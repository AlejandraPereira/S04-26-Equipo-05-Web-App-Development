import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type Job = {
  id: string; title: string; company?: string; description: string;
  location: string; isRemote: boolean; minSalary: number; maxSalary: number;
  publishedAt: string; status?: string;
};

const AREAS = [
  { label: "Finanzas",       keywords: ["finanz", "contador", "contab", "tesor", "presupuest"] },
  { label: "RRHH",           keywords: ["rrhh", "recursos humanos", "talento", "selección", "reclut"] },
  { label: "IT / Tecnología",keywords: ["it", "software", "develop", "programad", "tecnolog", "sistem", "data"] },
  { label: "Marketing",      keywords: ["marketing", "community", "redes social", "brand", "publicidad"] },
  { label: "Ventas",         keywords: ["ventas", "comercial", "ejecutivo de cuentas", "sales", "cliente"] },
  { label: "Operaciones",    keywords: ["operaciones", "logística", "supply chain", "procesos", "calidad"] },
  { label: "Legal",          keywords: ["legal", "abogado", "juridico", "complia", "regulat"] },
  { label: "Administración", keywords: ["admin", "asistente", "coordinad", "gestión", "backoffice"] },
];

export default function Marketplace() {
  const [isMobile, setIsMobile]       = useState(false);
  const [jobs, setJobs]               = useState<Job[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedIds, setAppliedIds]   = useState<string[]>([]);
  const [applyingId, setApplyingId]   = useState<string | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  const [search, setSearch]                     = useState("");
  const [filterModality, setFilterModality]     = useState<"all" | "remote" | "onsite">("all");
  const [filterArea, setFilterArea]             = useState<string[]>([]);
  const size = 10;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get<{ data: Job[] }>(`/job?page=${page}&size=${size}`)
      .then(json => setJobs(json.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    api.get<string[]>("/job-applications/applied-ids").then(setAppliedIds).catch(() => {});
  }, []);

  const matchesArea = (job: Job, areas: string[]) => {
    if (areas.length === 0) return true;
    const text = `${job.title} ${job.description}`.toLowerCase();
    return areas.some(label => AREAS.find(a => a.label === label)?.keywords.some(kw => text.includes(kw)));
  };

  const toggleArea = (area: string) =>
    setFilterArea(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);

  const filteredJobs = jobs.filter(job => {
    if (search) {
      const q = search.toLowerCase();
      if (![job.title, job.description, job.location].some(t => t.toLowerCase().includes(q))) return false;
    }
    if (filterModality === "remote" && !job.isRemote)  return false;
    if (filterModality === "onsite" && job.isRemote)   return false;
    if (!matchesArea(job, filterArea))                  return false;
    return true;
  });

  const hasActiveFilters = search || filterModality !== "all" || filterArea.length > 0;

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId);
    try {
      await api.post(`/job-applications/${jobId}/apply`, { coverLetter: coverLetter || undefined });
      setAppliedIds(prev => [...prev, jobId]);
      setApplySuccess(jobId);
      setShowModal(false);
      setCoverLetter("");
      setTimeout(() => setApplySuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Error al postularte");
    } finally {
      setApplyingId(null);
    }
  };

  const openApplyModal = (job: Job) => { setSelectedJob(job); setCoverLetter(""); setShowModal(true); };

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
      <Sidebar />

      <div className="flex-1 p-6 min-w-0">
        <TopBar showLogo placeholder="Buscar empleos, empresas o skills..." />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Explorá oportunidades laborales y encontrá tu próximo trabajo.</p>
        </div>

        {/* SUCCESS TOAST */}
        {applySuccess && (
          <div className="fixed top-20 right-6 z-50 bg-success text-success-foreground px-5 py-3 rounded-xl font-semibold text-sm shadow-lg animate-fade-in">
            ✓ Postulación enviada exitosamente
          </div>
        )}

        {/* APPLY MODAL */}
        {showModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-[90%] max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-1">Postularme a esta oferta</h2>
              <p className="text-muted-foreground text-sm mb-5">{selectedJob.title}</p>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Carta de presentación (opcional)
              </label>
              <Textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Contá por qué te interesa este puesto y qué podés aportar..."
                className="h-36 mb-5"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={() => handleApply(selectedJob.id)} disabled={applyingId === selectedJob.id}>
                  {applyingId ? "Enviando..." : "Enviar postulación"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div className="flex gap-3 items-center mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <Input
              className="pl-9"
              placeholder="Buscar ofertas por título, descripción o ubicación..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <Button variant="ghost" size="icon" onClick={() => setSearch("")}>✕</Button>
          )}
          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredJobs.length} resultado{filteredJobs.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* LAYOUT */}
        <div className={`grid gap-6 items-start ${
          isMobile ? "grid-cols-1" :
          selectedJob && !showModal ? "grid-cols-[260px_1fr_380px]" : "grid-cols-[260px_1fr]"
        }`}>

          {/* FILTER PANEL */}
          <Card className="sticky top-5 h-fit">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-base">Filtros</h3>
                {hasActiveFilters && (
                  <button className="text-destructive text-xs hover:underline" onClick={() => { setSearch(""); setFilterModality("all"); setFilterArea([]); }}>
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* MODALIDAD */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modalidad</p>
                <div className="flex flex-col gap-2">
                  {([
                    { value: "all",    label: "🌍 Todas",     desc: "Presencial y remoto" },
                    { value: "remote", label: "🌐 Remoto",    desc: "Trabajo desde casa" },
                    { value: "onsite", label: "🏢 Presencial", desc: "Asistencia al lugar" },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterModality(opt.value)}
                      className={`text-left px-3 py-2 rounded-lg border transition-colors text-sm ${
                        filterModality === opt.value
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label}
                      <span className="block text-xs opacity-60 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ÁREA */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Área de expertise</p>
                <div className="flex flex-col gap-2">
                  {AREAS.map(area => {
                    const active = filterArea.includes(area.label);
                    return (
                      <label key={area.label} className="flex items-center gap-2.5 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleArea(area.label)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                        <span className={`text-sm ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {area.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JOB LIST */}
          <div className="flex flex-col gap-4">
            {loading && (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
              </div>
            )}
            {!loading && filteredJobs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No hay ofertas disponibles con ese criterio.
                </CardContent>
              </Card>
            )}

            {!loading && filteredJobs.map(job => {
              const applied = appliedIds.includes(job.id);
              return (
                <Card key={job.id} className="hover:border-primary/40 transition-colors">
                  <CardContent className="pt-5">
                    <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">🏢</div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{job.company ?? "Empresa"}</p>
                        </div>
                      </div>
                      <Badge variant={job.isRemote ? "default" : "success"}>
                        {job.isRemote ? "🌐 Remoto" : "🏢 Presencial"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{job.description}</p>

                    <div className="flex justify-between items-center gap-4 flex-wrap pt-3 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span>📍 {job.location}</span>
                        <span className="mx-2">·</span>
                        <span className="text-success font-semibold">
                          ${job.minSalary.toLocaleString()} – ${job.maxSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
                        <Button
                          variant={selectedJob?.id === job.id ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                        >
                          {selectedJob?.id === job.id ? "Cerrar" : "Ver detalles"}
                        </Button>
                        <Button
                          size="sm"
                          variant={applied ? "success" : "default"}
                          disabled={applied}
                          onClick={() => !applied && openApplyModal(job)}
                        >
                          {applied ? "✓ Postulado" : "Postularme"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex items-center gap-3 mt-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                ← Anterior
              </Button>
              <span className="text-sm text-muted-foreground">Página {page}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)}>
                Siguiente →
              </Button>
            </div>
          </div>

          {/* JOB DETAIL DRAWER */}
          {selectedJob && !showModal && (
            <Card className="sticky top-5 h-fit">
              <CardContent className="pt-4">
                <div className="flex justify-end mb-3">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>✕</Button>
                </div>

                <div className="flex gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">🏢</div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{selectedJob.title}</h2>
                    <p className="text-muted-foreground text-sm">{selectedJob.company ?? "Empresa"}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-5">
                  <Badge variant={selectedJob.isRemote ? "default" : "success"}>
                    {selectedJob.isRemote ? "🌐 Remoto" : "🏢 Presencial"}
                  </Badge>
                  <Badge variant="muted">📍 {selectedJob.location}</Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedJob.description}</p>

                <div className="p-4 rounded-xl bg-success/5 border border-success/20 mb-5">
                  <p className="text-xs text-muted-foreground mb-1">Salario</p>
                  <p className="text-xl font-bold text-success">
                    ${Number(selectedJob.minSalary).toLocaleString()} — ${Number(selectedJob.maxSalary).toLocaleString()}
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant={appliedIds.includes(selectedJob.id) ? "success" : "default"}
                  disabled={appliedIds.includes(selectedJob.id)}
                  onClick={() => !appliedIds.includes(selectedJob.id) && openApplyModal(selectedJob)}
                >
                  {appliedIds.includes(selectedJob.id) ? "✓ Ya te postulaste" : "Postularme a esta oferta"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
