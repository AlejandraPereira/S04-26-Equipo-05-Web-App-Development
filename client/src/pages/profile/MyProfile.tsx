import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

/* ─── Types ─── */
type Profile = {
  id?: string; userId: string; username: string | null; headline: string | null;
  summary: string | null; location: string | null; yearsExperience: number | null;
  linkedinUrl: string | null; completionScore: number; lastUpdated: Date;
};
type Skill         = { name: string; score: number };
type CourseProgress = { id: string; title: string; emoji: string; progress: number };
type QuizBadge     = { id: string; score: number; passed: boolean; correctCount: number; totalQuestions: number; course: { id: string; title: string; emoji: string } };
type WorkExp       = { id: string; title: string; company: string; startDate: string; endDate: string | null; description: string };

const levelColor = (s: number) => s >= 75 ? "text-success" : s >= 50 ? "text-primary" : "text-warning";
const levelLabel = (s: number) => s >= 75 ? "Avanzado" : s >= 50 ? "Intermedio" : "Básico";
const levelVariant = (s: number): "success" | "default" | "warning" =>
  s >= 75 ? "success" : s >= 50 ? "default" : "warning";

const emptyExp = (): WorkExp => ({ id: "", title: "", company: "", startDate: "", endDate: null, description: "" });

/* ─── Modal wrapper ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card border border-border rounded-2xl p-7 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Component ─── */
export default function MyProfile() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);

  const [skills, setSkills]     = useState<Skill[]>([]);
  const [courses, setCourses]   = useState<CourseProgress[]>([]);
  const [badges, setBadges]     = useState<QuizBadge[]>([]);
  const [workExps, setWorkExps] = useState<WorkExp[]>([]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLinksModal, setShowLinksModal]     = useState(false);
  const [showExpModal, setShowExpModal]         = useState(false);
  const [editingExp, setEditingExp]             = useState<WorkExp>(emptyExp());

  const [editProfile, setEditProfile] = useState({ username: "", headline: "", location: "", yearsExperience: "", summary: "" });
  const [editLinks, setEditLinks]     = useState({ linkedinUrl: "" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<Profile>(`/professional-profile/${user.id}`).catch(() => null),
      api.get<{ skills: Skill[] }>("/diagnosis/result").catch(() => null),
      api.get<CourseProgress[]>("/learning/my-courses").catch(() => []),
      api.get<QuizBadge[]>("/learning/quiz-results/mine").catch(() => []),
      api.get<WorkExp[]>(`/professional-profile/${user.id}/work-experiences`).catch(() => []),
    ]).then(([prof, diag, coursesData, quizData, expData]) => {
      if (prof) {
        setProfile(prof);
        setEditProfile({
          username: prof.username ?? "", headline: prof.headline ?? "",
          location: prof.location ?? "", yearsExperience: prof.yearsExperience?.toString() ?? "",
          summary: prof.summary ?? "",
        });
        setEditLinks({ linkedinUrl: prof.linkedinUrl ?? "" });
      }
      setSkills(diag?.skills ?? []);
      setCourses((coursesData as CourseProgress[]).filter(c => c.progress > 0));
      setBadges((quizData as QuizBadge[]).filter(q => q.passed));
      setWorkExps(expData as WorkExp[]);
    }).finally(() => setLoading(false));
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    const body = {
      username: editProfile.username || null, headline: editProfile.headline || null,
      location: editProfile.location || null, summary: editProfile.summary || null,
      yearsExperience: editProfile.yearsExperience ? Number(editProfile.yearsExperience) : null,
    };
    try {
      const data = profile?.id
        ? await api.patch<Profile>(`/professional-profile/${profile.id}`, body)
        : await api.post<Profile>(`/professional-profile/create`, { ...body, userId: user.id });
      setProfile(data); setShowProfileModal(false);
    } catch (err) { console.error(err); }
  };

  const saveLinks = async () => {
    if (!user) return;
    try {
      const data = profile?.id
        ? await api.patch<Profile>(`/professional-profile/${profile.id}`, { linkedinUrl: editLinks.linkedinUrl || null })
        : await api.post<Profile>(`/professional-profile/create`, { linkedinUrl: editLinks.linkedinUrl || null, userId: user.id });
      setProfile(data); setShowLinksModal(false);
    } catch (err) { console.error(err); }
  };

  const saveExp = async () => {
    if (!user) return;
    const updated = editingExp.id
      ? workExps.map(e => e.id === editingExp.id ? editingExp : e)
      : [...workExps, { ...editingExp, id: crypto.randomUUID() }];
    try {
      const result = await api.put<WorkExp[]>(`/professional-profile/${user.id}/work-experiences`, { workExperiences: updated });
      setWorkExps(result); setShowExpModal(false);
    } catch (err) { console.error(err); }
  };

  const deleteExp = async (id: string) => {
    if (!user) return;
    const updated = workExps.filter(e => e.id !== id);
    try {
      const result = await api.put<WorkExp[]>(`/professional-profile/${user.id}/work-experiences`, { workExperiences: updated });
      setWorkExps(result);
    } catch (err) { console.error(err); }
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}/perfil/${user?.id}`;
    try { await navigator.clipboard.writeText(url); } catch { prompt("Copiá este link:", url); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPDF = () => {
    const name = profile?.username ?? user?.fullName ?? "Profesional";
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>CV – ${name}</title>
<style>body{font-family:Georgia,serif;padding:48px;max-width:780px;margin:0 auto;color:#111;line-height:1.6}h1{font-size:28px;margin:0 0 4px}.headline{color:#555;font-size:15px;margin:4px 0 12px}.meta{color:#777;font-size:13px;margin-bottom:20px}h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #2563eb;padding-bottom:6px;color:#1e40af;margin-top:28px;margin-bottom:14px}.skill{display:inline-block;margin:3px 5px 3px 0;padding:3px 12px;border:1px solid #93c5fd;border-radius:999px;font-size:12px;color:#1e40af}.job{margin-bottom:20px}.job-title{font-weight:700;font-size:15px}.job-company{color:#2563eb;font-size:14px}.job-dates{color:#777;font-size:12px;margin:2px 0}.job-desc{font-size:13px;color:#444;margin-top:4px}.badge{display:inline-block;margin:3px 5px 3px 0;padding:3px 12px;border:1px solid #16a34a;border-radius:999px;font-size:12px;color:#15803d}.footer{margin-top:40px;color:#aaa;font-size:11px;border-top:1px solid #eee;padding-top:10px}@media print{body{padding:20px}}</style>
</head><body>
<h1>${name}</h1>
${profile?.headline ? `<p class="headline">${profile.headline}</p>` : ""}
<p class="meta">${profile?.location ? `📍 ${profile.location}` : ""}${profile?.yearsExperience != null ? ` · ${profile.yearsExperience} años de experiencia` : ""}</p>
${profile?.summary ? `<p>${profile.summary}</p>` : ""}
${skills.length > 0 ? `<h2>Habilidades</h2><div>${skills.map(s => `<span class="skill">${s.name} — ${s.score}%</span>`).join("")}</div>` : ""}
${workExps.length > 0 ? `<h2>Experiencia Laboral</h2>${workExps.map(exp => `<div class="job"><div class="job-title">${exp.title}</div><div class="job-company">${exp.company}</div><div class="job-dates">${exp.startDate} — ${exp.endDate ?? "Actualidad"}</div>${exp.description ? `<div class="job-desc">${exp.description}</div>` : ""}</div>`).join("")}` : ""}
${badges.length > 0 ? `<h2>Cursos Certificados</h2><div>${badges.map(b => `<span class="badge">${b.course.emoji} ${b.course.title} — ${b.score}%</span>`).join("")}</div>` : ""}
${profile?.linkedinUrl ? `<h2>Contacto</h2><p><a href="${profile.linkedinUrl}" style="color:#2563eb">${profile.linkedinUrl}</a></p>` : ""}
<p class="footer">Generado con ReConecta45 · ${new Date().toLocaleDateString()}</p>
<script>window.onload=function(){window.print()}</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Permití ventanas emergentes para descargar el CV"); return; }
    w.document.write(html); w.document.close();
  };

  const initials = user ? user.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "AP";

  if (loading) {
    return (
      <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
        <Sidebar />

        <div className="flex-1 p-6 min-w-0">
          <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

          {/* HEADER */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 flex-wrap">
                <Avatar className="w-20 h-20 shrink-0">
                  <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {profile?.username ?? user?.fullName ?? "Sin nombre"}
                  </h1>
                  <p className="text-muted-foreground mt-1">{profile?.headline ?? "Sin título profesional"}</p>
                  {profile?.summary && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{profile.summary}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    📍 {profile?.location ?? "Sin ubicación"} ·{" "}
                    {profile?.yearsExperience != null ? `${profile.yearsExperience} años de experiencia` : "Sin experiencia cargada"}
                  </p>

                  <div className="mt-4 max-w-xs">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Perfil completado</span>
                      <span>{profile?.completionScore ?? 0}%</span>
                    </div>
                    <Progress value={profile?.completionScore ?? 0} className="h-1.5" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setShowProfileModal(true)}>
                    ✏️ Editar perfil
                  </Button>
                  <Button
                    variant={copied ? "success" : "ghost"}
                    size="sm"
                    onClick={copyShareLink}
                  >
                    {copied ? "✓ Link copiado" : "🔗 Compartir"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadPDF}>
                    📄 Descargar CV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GRID */}
          <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-[1fr_320px]"}`}>
            {/* LEFT */}
            <div className="flex flex-col gap-5">

              {/* CURSOS EN PROGRESO */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>📖 Mis cursos en progreso</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/learning")}>Ver todos →</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground text-sm">
                      Todavía no empezaste ningún curso.{" "}
                      <button className="text-primary hover:underline" onClick={() => navigate("/learning")}>
                        Explorar cursos →
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {courses.slice(0, 4).map(c => (
                        <div
                          key={c.id}
                          className="cursor-pointer group"
                          onClick={() => navigate(`/curso/${c.id}`)}
                        >
                          <div className="flex justify-between text-sm mb-2 group-hover:text-primary transition-colors">
                            <span>{c.emoji} {c.title}</span>
                            <span className="text-muted-foreground">{c.progress}%</span>
                          </div>
                          <Progress value={c.progress} className="h-1.5" indicatorClassName="bg-success" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* HABILIDADES */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>🛡️ Habilidades detectadas</CardTitle>
                </CardHeader>
                <CardContent>
                  {skills.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground text-sm">
                      Completá el{" "}
                      <button className="text-primary hover:underline" onClick={() => navigate("/diagnostic")}>
                        diagnóstico inicial →
                      </button>{" "}
                      para ver tus habilidades.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {skills.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="font-medium truncate">{s.name}</span>
                              <span className={levelColor(s.score)}>{s.score}%</span>
                            </div>
                            <Progress value={s.score} className="h-1" />
                          </div>
                          <Badge variant={levelVariant(s.score)} className="shrink-0 text-[10px]">
                            {levelLabel(s.score)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* EXPERIENCIA LABORAL */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>💼 Experiencia laboral</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingExp(emptyExp()); setShowExpModal(true); }}>
                      + Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {workExps.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">No hay experiencias cargadas todavía.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {workExps.map((exp, idx) => (
                        <div key={exp.id}>
                          {idx > 0 && <Separator className="my-3" />}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{exp.title}</p>
                              <p className="text-primary text-xs mt-0.5">{exp.company}</p>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                {exp.startDate} — {exp.endDate ?? "Actualidad"}
                              </p>
                              {exp.description && (
                                <p className="text-muted-foreground text-xs mt-2 leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setEditingExp({ ...exp }); setShowExpModal(true); }}>Editar</Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteExp(exp.id)}>Eliminar</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5">

              {/* BADGES */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>🏅 Quizzes aprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  {badges.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">Completá un quiz para ganar tu primera insignia.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {badges.map(b => (
                        <button
                          key={b.id}
                          onClick={() => navigate(`/curso/${b.course.id}`)}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-success/30 bg-success/5 hover:bg-success/10 transition-colors text-left w-full"
                        >
                          <span className="text-lg">{b.course.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold">{b.course.title}</p>
                            <p className="text-xs text-success">✓ {b.score}% · {b.correctCount}/{b.totalQuestions}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ENLACES */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>🔗 Enlaces</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowLinksModal(true)}>Editar →</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile?.linkedinUrl ? (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                      className="text-primary text-sm hover:underline">
                      LinkedIn →
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">Sin LinkedIn cargado.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <Modal title="Editar perfil" onClose={() => setShowProfileModal(false)}>
          <div className="flex flex-col gap-3">
            <Input value={editProfile.username} onChange={e => setEditProfile({ ...editProfile, username: e.target.value })} placeholder="Nombre público" />
            <Input value={editProfile.headline} onChange={e => setEditProfile({ ...editProfile, headline: e.target.value })} placeholder="Título profesional" />
            <Input value={editProfile.location} onChange={e => setEditProfile({ ...editProfile, location: e.target.value })} placeholder="Ubicación" />
            <Input type="number" value={editProfile.yearsExperience} onChange={e => setEditProfile({ ...editProfile, yearsExperience: e.target.value })} placeholder="Años de experiencia" />
            <Textarea className="h-28" value={editProfile.summary} onChange={e => setEditProfile({ ...editProfile, summary: e.target.value })} placeholder="Resumen / Bio" />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>Cancelar</Button>
              <Button onClick={saveProfile}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL LINKS */}
      {showLinksModal && (
        <Modal title="Editar enlaces" onClose={() => setShowLinksModal(false)}>
          <div className="flex flex-col gap-3">
            <Input value={editLinks.linkedinUrl} onChange={e => setEditLinks({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/usuario" />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" onClick={() => setShowLinksModal(false)}>Cancelar</Button>
              <Button onClick={saveLinks}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL EXPERIENCIA */}
      {showExpModal && (
        <Modal title={editingExp.id ? "Editar experiencia" : "Agregar experiencia"} onClose={() => setShowExpModal(false)}>
          <div className="flex flex-col gap-3">
            <Input value={editingExp.title} onChange={e => setEditingExp({ ...editingExp, title: e.target.value })} placeholder="Cargo (ej: Gerente de RRHH)" />
            <Input value={editingExp.company} onChange={e => setEditingExp({ ...editingExp, company: e.target.value })} placeholder="Empresa" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={editingExp.startDate} onChange={e => setEditingExp({ ...editingExp, startDate: e.target.value })} placeholder="Inicio (ej: 2018)" />
              <Input value={editingExp.endDate ?? ""} onChange={e => setEditingExp({ ...editingExp, endDate: e.target.value || null })} placeholder="Fin (vacío = Actualidad)" />
            </div>
            <Textarea className="h-24" value={editingExp.description} onChange={e => setEditingExp({ ...editingExp, description: e.target.value })} placeholder="Descripción breve del rol y logros" />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" onClick={() => setShowExpModal(false)}>Cancelar</Button>
              <Button onClick={saveExp}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
