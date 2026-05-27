import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmpresaProfile {
  nombre: string; industria: string; descripcion: string;
  ubicacion: string; sitioWeb: string; empleados: string; linkedinUrl: string;
}

const profileMock: EmpresaProfile = {
  nombre: "Mercer Argentina", industria: "Recursos Humanos & Consultoría",
  descripcion: "Somos una consultora líder en gestión de talento y compensaciones con más de 30 años en el mercado argentino.",
  ubicacion: "Buenos Aires, Argentina", sitioWeb: "https://www.mercer.com/ar",
  empleados: "500-1000", linkedinUrl: "https://linkedin.com/company/mercer-argentina",
};

const industriaOptions = [
  "Recursos Humanos & Consultoría", "Tecnología", "Finanzas & Banca",
  "Salud", "Educación", "Retail & Consumo masivo",
  "Manufactura & Industria", "Servicios profesionales", "Otro",
];
const empleadosOptions = ["1-10", "11-50", "51-200", "200-500", "500-1000", "1000+"];
const emptyProfile: EmpresaProfile = { nombre: "", industria: "", descripcion: "", ubicacion: "", sitioWeb: "", empleados: "", linkedinUrl: "" };
type CompanyStats = { activeJobs: number; reviewed: number; interview: number };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{children}</p>;
}

export default function CompanyProfile() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile]   = useState<EmpresaProfile>(profileMock);
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState<EmpresaProfile>(profileMock);
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState<CompanyStats>({ activeJobs: 0, reviewed: 0, interview: 0 });

  useEffect(() => {
    api.get<CompanyStats>("/job-applications/company-stats").then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api.get<any>("/company/mine")
      .then(data => {
        if (data) {
          const mapped: EmpresaProfile = {
            nombre: data.legalName ?? "", industria: data.industry ?? "",
            descripcion: data.description ?? "", ubicacion: data.location ?? "",
            sitioWeb: data.webSiteUrl ?? "",
            empleados: data.employeeCount ? String(data.employeeCount) : "",
            linkedinUrl: data.linkedinUrl ?? "",
          };
          setProfile(mapped); setForm(mapped);
        } else { setProfile(emptyProfile); setForm(emptyProfile); setEditing(true); }
      })
      .catch(() => { setProfile(emptyProfile); setForm(emptyProfile); setEditing(true); })
      .finally(() => setLoading(false));
  }, []);

  const handleField = (field: keyof EmpresaProfile, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const parseEmployeeCount = (s: string) => { const n = parseInt(s.split("-")[0]); return isNaN(n) ? 1 : n; };
    try {
      await api.put("/company/mine", {
        legalName: form.nombre, industry: form.industria,
        description: form.descripcion || null, location: form.ubicacion || null,
        webSiteUrl: form.sitioWeb || null, linkedinUrl: form.linkedinUrl || null,
        employeeCount: parseEmployeeCount(form.empleados),
      });
      setProfile(form); setEditing(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
  };

  const initials = profile.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "E";

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
      <Sidebar />

      <div className="flex-1 p-6 min-w-0">
        <TopBar showLogo placeholder="Buscar empresas..." />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Perfil de Empresa</h1>
          <p className="text-muted-foreground mt-1">Así te ven los profesionales en el marketplace</p>
        </div>

        {loading && <p className="text-muted-foreground">Cargando perfil...</p>}

        {saved && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-5 bg-success/10 border border-success/30">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-semibold text-success text-sm">¡Perfil actualizado!</p>
              <p className="text-xs text-muted-foreground">Los cambios ya son visibles para los profesionales.</p>
            </div>
          </div>
        )}

        <div className={`grid gap-5 items-start ${isMobile ? "grid-cols-1" : "grid-cols-[1fr_300px]"}`}>

          {/* LEFT */}
          <Card>
            <CardContent className="pt-6">
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <Avatar className="w-20 h-20 shrink-0 rounded-2xl">
                  <AvatarFallback className="rounded-2xl text-2xl font-bold bg-gradient-to-br from-primary to-violet-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl">{profile.nombre}</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">{profile.industria}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">📍 {profile.ubicacion}</p>
                </div>
                {!editing && (
                  <Button variant="outline" onClick={() => setEditing(true)}>✏️ Editar perfil</Button>
                )}
              </div>

              <Separator className="mb-5" />

              {editing ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <FieldLabel>Nombre de la empresa *</FieldLabel>
                    <Input value={form.nombre} onChange={e => handleField("nombre", e.target.value)} placeholder="Ej: Mercer Argentina" />
                  </div>
                  <div>
                    <FieldLabel>Industria *</FieldLabel>
                    <select value={form.industria} onChange={e => handleField("industria", e.target.value)}
                      className="w-full h-10 rounded-lg border border-border bg-muted text-foreground px-3 text-sm outline-none">
                      <option value="">Seleccioná una industria</option>
                      {industriaOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Descripción *</FieldLabel>
                    <Textarea value={form.descripcion} onChange={e => handleField("descripcion", e.target.value)}
                      placeholder="Contá quiénes son y por qué valoran el talento senior..." className="h-28" />
                  </div>
                  <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div>
                      <FieldLabel>Ubicación *</FieldLabel>
                      <Input value={form.ubicacion} onChange={e => handleField("ubicacion", e.target.value)} placeholder="Ej: Buenos Aires, Argentina" />
                    </div>
                    <div>
                      <FieldLabel>Cantidad de empleados</FieldLabel>
                      <select value={form.empleados} onChange={e => handleField("empleados", e.target.value)}
                        className="w-full h-10 rounded-lg border border-border bg-muted text-foreground px-3 text-sm outline-none">
                        <option value="">Seleccioná</option>
                        {empleadosOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Sitio web</FieldLabel>
                      <Input value={form.sitioWeb} onChange={e => handleField("sitioWeb", e.target.value)} placeholder="https://www.empresa.com" />
                    </div>
                    <div>
                      <FieldLabel>LinkedIn</FieldLabel>
                      <Input value={form.linkedinUrl} onChange={e => handleField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/company/..." />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => { setForm(profile); setEditing(false); }}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar cambios →</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div>
                    <FieldLabel>Descripción</FieldLabel>
                    <p className="text-sm text-muted-foreground leading-relaxed">{profile.descripcion}</p>
                  </div>
                  <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div><FieldLabel>Ubicación</FieldLabel><p className="text-sm">📍 {profile.ubicacion}</p></div>
                    <div><FieldLabel>Empleados</FieldLabel><p className="text-sm">👥 {profile.empleados}</p></div>
                    <div>
                      <FieldLabel>Sitio web</FieldLabel>
                      <a href={profile.sitioWeb} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">
                        {profile.sitioWeb || "—"}
                      </a>
                    </div>
                    <div>
                      <FieldLabel>LinkedIn</FieldLabel>
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">
                        {profile.linkedinUrl ? "Ver perfil →" : "—"}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            {/* ACTIVIDAD */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  { label: "Ofertas activas",       value: stats.activeJobs, icon: "📢" },
                  { label: "Candidatos revisados",  value: stats.reviewed,   icon: "👁" },
                  { label: "Entrevistas agendadas", value: stats.interview,  icon: "📅" },
                ].map((s, i, arr) => (
                  <div key={i}>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-muted-foreground">{s.icon} {s.label}</span>
                      <span className="text-2xl font-bold">{s.value}</span>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ACCESOS RÁPIDOS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Accesos rápidos</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start" onClick={() => navigate("/joboffers")}>
                  📢 Publicar nueva oferta
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate("/candidates")}>
                  👥 Ver candidatos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
