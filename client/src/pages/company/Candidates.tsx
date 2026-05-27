import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Skill     { name: string; score: number }
interface Candidate {
  id: string; userId: string; fullName: string;
  headline: string | null; location: string | null; summary: string | null;
  yearsExperience: number | null; linkedinUrl: string | null;
  completionScore: number; skills: Skill[];
}
interface Evaluation {
  id: string; rating: number; feedback: string; createdAt: string;
  evaluator: { fullName: string };
}

export default function Candidates() {
  const [isMobile, setIsMobile]       = useState(false);
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);
  const [candidates, setCandidates]   = useState<Candidate[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [minYears, setMinYears]       = useState<number | "">("");

  const [feedback, setFeedback]       = useState("");
  const [rating, setRating]           = useState(3);
  const [sending, setSending]         = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loadingEvals, setLoadingEvals] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api.get<Candidate[]>("/candidates")
      .then(setCandidates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUser) { setEvaluations([]); return; }
    setLoadingEvals(true);
    api.get<Evaluation[]>(`/candidates/evaluations/${selectedUser.userId}`)
      .then(setEvaluations).catch(() => setEvaluations([]))
      .finally(() => setLoadingEvals(false));
  }, [selectedUser?.userId]);

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills.map(s => s.name)))).sort();

  const filtered = candidates.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (![c.fullName, c.headline ?? "", c.location ?? ""].some(t => t.toLowerCase().includes(q)) &&
          !c.skills.some(s => s.name.toLowerCase().includes(q))) return false;
    }
    if (filterSkill && !c.skills.some(s => s.name === filterSkill)) return false;
    if (minYears !== "" && (c.yearsExperience ?? 0) < minYears) return false;
    return true;
  });

  const handleSendFeedback = async () => {
    if (!selectedUser || !feedback.trim() || sending) return;
    setSending(true);
    try {
      const newEval = await api.post<Evaluation>("/candidates/evaluations", {
        candidateUserId: selectedUser.userId, rating, feedback: feedback.trim(),
      });
      setEvaluations(prev => [newEval, ...prev]);
      setFeedback(""); setRating(3);
    } catch (err: any) {
      alert(err.message || "Error al guardar la evaluación");
    } finally { setSending(false); }
  };

  const selectCandidate = (c: Candidate) => { setSelectedUser(c); setFeedback(""); setRating(3); };

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
      <Sidebar />

      <div className="flex-1 p-6 min-w-0">
        <TopBar showLogo placeholder="Buscar candidatos..." />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <p className="text-muted-foreground mt-1">Explorá perfiles de profesionales +45 disponibles</p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <Input
              className="pl-9"
              placeholder="Buscar por nombre, rol, ubicación o habilidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <select
              value={filterSkill}
              onChange={e => setFilterSkill(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border bg-muted text-foreground outline-none cursor-pointer transition-colors ${filterSkill ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
            >
              <option value="">🎯 Filtrar por habilidad</option>
              {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
            </select>

            <select
              value={minYears}
              onChange={e => setMinYears(e.target.value === "" ? "" : Number(e.target.value))}
              className={`px-3 py-2 rounded-lg text-sm border bg-muted text-foreground outline-none cursor-pointer transition-colors ${minYears !== "" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
            >
              <option value="">💼 Años de experiencia</option>
              {[1, 3, 5, 10, 15].map(y => <option key={y} value={y}>{y}+ años</option>)}
            </select>

            {(filterSkill || minYears !== "") && (
              <Button variant="destructive" size="sm" onClick={() => { setFilterSkill(""); setMinYears(""); }}>
                Limpiar filtros
              </Button>
            )}

            {filtered.length !== candidates.length && (
              <span className="text-xs text-muted-foreground ml-auto">
                {filtered.length} de {candidates.length} candidatos
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {search ? "No se encontraron candidatos con ese criterio." : "Aún no hay perfiles disponibles."}
            </CardContent>
          </Card>
        )}

        <div className={`grid gap-5 items-start ${
          isMobile ? "grid-cols-1" : selectedUser ? "grid-cols-[1fr_380px]" : "grid-cols-1"
        }`}>
          {/* GRID */}
          <div className={`grid gap-4 ${
            isMobile ? "grid-cols-1" :
            selectedUser ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}>
            {filtered.map(c => (
              <Card
                key={c.id}
                onClick={() => selectCandidate(c)}
                className={`cursor-pointer transition-colors hover:border-primary/50 ${
                  selectedUser?.id === c.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <CardContent className="pt-5">
                  <div className="flex gap-3 mb-4">
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarFallback className="text-base">
                        {c.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base truncate">{c.fullName}</h3>
                      <p className="text-muted-foreground text-sm truncate">{c.headline ?? "Profesional"}</p>
                      {c.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {c.location}</p>}
                    </div>
                  </div>

                  {c.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {c.skills.slice(0, 3).map((s, idx) => (
                        <Badge key={idx} variant="default" className="text-xs">{s.name}</Badge>
                      ))}
                    </div>
                  )}

                  {c.yearsExperience != null && (
                    <p className="text-xs text-muted-foreground mb-3">💼 {c.yearsExperience} años de experiencia</p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <Progress value={c.completionScore} className="flex-1 h-1.5" />
                    <span className="text-xs text-muted-foreground shrink-0">{c.completionScore}%</span>
                  </div>

                  <Button size="sm" className="w-full">Ver perfil</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* DRAWER */}
          {selectedUser && (
            <Card className="sticky top-5 h-fit">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">Perfil del candidato</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUser(null)}>✕</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-5">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarFallback className="text-2xl">
                      {selectedUser.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-lg">{selectedUser.fullName}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{selectedUser.headline ?? "Profesional"}</p>
                  {selectedUser.location && <p className="text-xs text-muted-foreground mt-1">📍 {selectedUser.location}</p>}
                </div>

                {selectedUser.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed p-3 rounded-xl bg-secondary/30 border border-border mb-5">
                    {selectedUser.summary}
                  </p>
                )}

                <div className="flex gap-2 mb-5">
                  <Button className="flex-1" size="sm">Entrevistar</Button>
                  {selectedUser.linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedUser.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn →</a>
                    </Button>
                  )}
                </div>

                {selectedUser.skills.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold mb-3">Habilidades del diagnóstico</h3>
                    {selectedUser.skills.map((s, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span>{s.name}</span>
                          <span className="text-muted-foreground">{s.score}%</span>
                        </div>
                        <Progress value={s.score} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                )}

                {/* NUEVA EVALUACIÓN */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3">Nueva evaluación</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors ${star <= rating ? "text-warning" : "text-muted"}`}
                      >★</button>
                    ))}
                    <span className="text-xs text-muted-foreground self-center ml-2">{rating}/5</span>
                  </div>
                  <Textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Escribí una evaluación del candidato..."
                    className="mb-3 h-24"
                  />
                  <Button
                    className="w-full"
                    variant={feedback.trim() ? "success" : "secondary"}
                    disabled={!feedback.trim() || sending}
                    onClick={handleSendFeedback}
                  >
                    {sending ? "Enviando..." : "Enviar evaluación"}
                  </Button>
                </div>

                {/* HISTORIAL */}
                {loadingEvals && <Skeleton className="h-20 rounded-xl" />}
                {evaluations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Historial ({evaluations.length})</h3>
                    <div className="flex flex-col gap-3">
                      {evaluations.map(ev => (
                        <div key={ev.id} className="p-3 rounded-xl border border-border bg-background/50">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`text-sm ${s <= ev.rating ? "text-warning" : "text-muted"}`}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(ev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ev.feedback}</p>
                          <p className="text-xs text-muted mt-1">Por: {ev.evaluator?.fullName ?? "Evaluador"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
