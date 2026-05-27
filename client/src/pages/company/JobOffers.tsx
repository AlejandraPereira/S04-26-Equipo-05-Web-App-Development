import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";

type Modalidad = "Presencial" | "Remoto" | "Hibrido";

interface Oferta {
  titulo: string;
  descripcion: string;
  salarioMin: string;
  salarioMax: string;
  ubicacion: string;
  modalidad: Modalidad | "";
  requisitos: string;
}

interface PublishedJob {
  id: string;
  title: string;
  location: string;
  isRemote: boolean;
  status: string;
  publishedAt: string;
}

interface Applicant {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter: string | null;
  user: { fullName: string; email: string };
}

const emptyOferta: Oferta = {
  titulo: "", descripcion: "", salarioMin: "",
  salarioMax: "", ubicacion: "", modalidad: "", requisitos: "",
};

const modalidades: Modalidad[] = ["Presencial", "Remoto", "Hibrido"];

const tips = [
  { title: "Se especifico en el titulo", desc: "Evita titulos genericos. 'Gerente de Operaciones con foco en logistica' atrae mejor talento que solo 'Gerente'." },
  { title: "Describe el equipo y la cultura", desc: "Los profesionales +45 valoran el contexto: con quien van a trabajar y como es el ambiente." },
  { title: "Publica el salario", desc: "Las ofertas con rango salarial reciben hasta 3x mas postulaciones." },
  { title: "Requisitos realistas", desc: "Pide solo lo verdaderamente necesario. Evita sobre-requisitar el puesto." },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendiente", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  REVIEWED: { label: "Revisada", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  INTERVIEW: { label: "Entrevista", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  ACCEPTED: { label: "Aceptada", color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  REJECTED: { label: "Rechazada", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function JobOffers() {
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = useState<"crear" | "ofertas">("crear");
  const [oferta, setOferta] = useState<Oferta>(emptyOferta);
  const [errors, setErrors] = useState<Partial<Record<keyof Oferta, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [myJobs, setMyJobs] = useState<PublishedJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (tab === "ofertas") {
      api.get<{ data: PublishedJob[] }>("/job?page=1&size=50")
        .then(json => setMyJobs(json.data ?? []))
        .catch(console.error);
    }
  }, [tab]);

  useEffect(() => {
    if (!selectedJobId) { setApplicants([]); return; }
    setLoadingApplicants(true);
    api.get<Applicant[]>(`/job-applications/job/${selectedJobId}`)
      .then(setApplicants)
      .catch(() => setApplicants([]))
      .finally(() => setLoadingApplicants(false));
  }, [selectedJobId]);

  const handleField = (field: keyof Oferta, value: string) => {
    setOferta((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Oferta, string>> = {};
    if (!oferta.titulo.trim()) e.titulo = "El titulo es requerido";
    if (!oferta.descripcion.trim()) e.descripcion = "La descripcion es requerida";
    if (!oferta.ubicacion.trim()) e.ubicacion = "La ubicacion es requerida";
    if (!oferta.modalidad) e.modalidad = "Selecciona una modalidad";
    if (!oferta.requisitos.trim()) e.requisitos = "Los requisitos son requeridos";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const company = await api.get<{ id: string } | null>("/company/mine");
      if (!company) {
        setErrors({ titulo: "Primero completa el perfil de tu empresa" });
        return;
      }

      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);

      await api.post("/job", {
        companyId: company.id,
        title: oferta.titulo,
        description: `${oferta.descripcion}\n\nRequisitos:\n${oferta.requisitos}`,
        location: oferta.ubicacion,
        isRemote: oferta.modalidad === "Remoto",
        minSalary: oferta.salarioMin ? Number(oferta.salarioMin) : 0,
        maxSalary: oferta.salarioMax ? Number(oferta.salarioMax) : 0,
        status: "OPEN",
        publishedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });

      setSubmitted(true);
      setOferta(emptyOferta);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setErrors({ titulo: err.message || "Error al publicar la oferta" });
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/job-applications/${appId}/status`, { status: newStatus });
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err: any) {
      alert(err.message || "Error al actualizar estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#fff", fontFamily: "system-ui", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar userType="empresa" />

      <div style={{ flex: 1, padding: "24px", minWidth: 0 }}>
        <TopBar showLogo placeholder="Buscar ofertas..." />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Ofertas laborales</h1>
          <p style={{ marginTop: "6px", color: "#9ca3af" }}>Publica busquedas y gestiona postulantes</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["crear", "ofertas"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 20px", borderRadius: 10, border: "1px solid",
              borderColor: tab === t ? "#2563eb" : "#1f2937",
              background: tab === t ? "rgba(37,99,235,0.15)" : "transparent",
              color: tab === t ? "#60a5fa" : "#9ca3af",
              cursor: "pointer", fontWeight: 600, fontSize: 14,
            }}>
              {t === "crear" ? "Crear oferta" : `Mis ofertas (${myJobs.length})`}
            </button>
          ))}
        </div>

        {submitted && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 14, marginBottom: 24, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#4ade80", fontSize: 15 }}>Oferta publicada!</p>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Tu oferta ya es visible para los profesionales.</p>
            </div>
          </div>
        )}

        {/* TAB: CREAR */}
        {tab === "crear" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 24, alignItems: "start" }}>
            <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 20, padding: "32px 28px" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>Nueva oferta laboral</h2>
              <p style={{ margin: "0 0 28px", color: "#6b7280", fontSize: 14 }}>Completa los campos para publicar tu busqueda a profesionales +45.</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={styles.label}>Titulo del puesto *</label>
                  <input placeholder="Ej: Gerente de Operaciones" value={oferta.titulo} onChange={e => handleField("titulo", e.target.value)} style={{ ...styles.input, borderColor: errors.titulo ? "#dc2626" : "#1f2937" }} />
                  {errors.titulo && <p style={styles.error}>{errors.titulo}</p>}
                </div>

                <div>
                  <label style={styles.label}>Descripcion del puesto *</label>
                  <textarea placeholder="Describe las responsabilidades, el equipo y el contexto del rol..." value={oferta.descripcion} onChange={e => handleField("descripcion", e.target.value)} style={{ ...styles.textarea, borderColor: errors.descripcion ? "#dc2626" : "#1f2937" }} />
                  {errors.descripcion && <p style={styles.error}>{errors.descripcion}</p>}
                </div>

                <div>
                  <label style={styles.label}>Rango salarial (opcional)</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input placeholder="Minimo (ej: 2000)" value={oferta.salarioMin} onChange={e => handleField("salarioMin", e.target.value)} style={{ ...styles.input, flex: 1 }} />
                    <div style={{ display: "flex", alignItems: "center", color: "#4b5563", fontSize: 18 }}>—</div>
                    <input placeholder="Maximo (ej: 3500)" value={oferta.salarioMax} onChange={e => handleField("salarioMax", e.target.value)} style={{ ...styles.input, flex: 1 }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#4b5563" }}>En USD/mes. Dejalo vacio si preferis no publicarlo.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={styles.label}>Ubicacion *</label>
                    <input placeholder="Ej: Madrid, Espania" value={oferta.ubicacion} onChange={e => handleField("ubicacion", e.target.value)} style={{ ...styles.input, borderColor: errors.ubicacion ? "#dc2626" : "#1f2937" }} />
                    {errors.ubicacion && <p style={styles.error}>{errors.ubicacion}</p>}
                  </div>
                  <div>
                    <label style={styles.label}>Modalidad *</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {modalidades.map((m) => (
                        <button key={m} type="button" onClick={() => handleField("modalidad", m)} style={{
                          flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                          borderColor: oferta.modalidad === m ? "#2563eb" : "#1f2937",
                          background: oferta.modalidad === m ? "rgba(37,99,235,0.15)" : "transparent",
                          color: oferta.modalidad === m ? "#60a5fa" : "#6b7280",
                        }}>
                          {m}
                        </button>
                      ))}
                    </div>
                    {errors.modalidad && <p style={styles.error}>{errors.modalidad}</p>}
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Requisitos *</label>
                  <textarea placeholder="Lista las habilidades, experiencia y perfil buscado..." value={oferta.requisitos} onChange={e => handleField("requisitos", e.target.value)} style={{ ...styles.textarea, height: 120, borderColor: errors.requisitos ? "#dc2626" : "#1f2937" }} />
                  {errors.requisitos && <p style={styles.error}>{errors.requisitos}</p>}
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #1f2937" }}>
                  <button type="button" onClick={() => setOferta(emptyOferta)} style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid #1f2937", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 14 }}>
                    Limpiar
                  </button>
                  <button type="submit" style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                    Publicar oferta →
                  </button>
                </div>
              </form>
            </div>

            {/* TIPS */}
            <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 16, padding: "20px", position: isMobile ? "relative" : "sticky", top: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Consejos para tu oferta</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {tips.map((t, i) => (
                  <div key={i} style={{ borderLeft: "2px solid #1f2937", paddingLeft: 14 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{t.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MIS OFERTAS */}
        {tab === "ofertas" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selectedJobId ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myJobs.length === 0 && (
                <div style={{ padding: 40, borderRadius: 16, border: "1px solid #1f2937", color: "#9ca3af", textAlign: "center" }}>
                  Aun no publicaste ofertas. Crea tu primera oferta en la pestania "Crear oferta".
                </div>
              )}
              {myJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                  style={{
                    padding: "18px 20px", borderRadius: 16,
                    border: `1px solid ${selectedJobId === job.id ? "#2563eb" : "#1f2937"}`,
                    background: selectedJobId === job.id ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", transition: "0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17 }}>{job.title}</h3>
                      <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
                        📍 {job.location} · {job.isRemote ? "Remoto" : "Presencial"} · {new Date(job.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ padding: "5px 12px", borderRadius: 999, background: job.status === "OPEN" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", color: job.status === "OPEN" ? "#4ade80" : "#f87171", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {job.status === "OPEN" ? "Activa" : job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* APPLICANTS PANEL */}
            {selectedJobId && (
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 24, padding: 24, position: isMobile ? "relative" : "sticky", top: 20, maxHeight: isMobile ? "none" : "calc(100vh - 40px)", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>Postulantes</h3>
                  <button onClick={() => setSelectedJobId(null)} style={{ background: "transparent", border: "1px solid #374151", color: "#fff", width: 34, height: 34, borderRadius: 10, cursor: "pointer" }}>✕</button>
                </div>

                {loadingApplicants && <p style={{ color: "#6b7280", fontSize: 13 }}>Cargando postulantes...</p>}

                {!loadingApplicants && applicants.length === 0 && (
                  <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", padding: 20 }}>Aun no hay postulantes para esta oferta.</p>
                )}

                {applicants.map(app => {
                  const st = STATUS_LABELS[app.status] ?? STATUS_LABELS.PENDING;
                  return (
                    <div key={app.id} style={{ padding: "16px", borderRadius: 14, border: "1px solid #1f2937", background: "rgba(255,255,255,0.02)", marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{app.user.fullName}</p>
                          <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: 12 }}>{app.user.email}</p>
                        </div>
                        <span style={{ padding: "5px 12px", borderRadius: 999, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600 }}>
                          {st.label}
                        </span>
                      </div>

                      {app.coverLetter && (
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1f2937", marginBottom: 10 }}>
                          <p style={{ margin: 0, fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{app.coverLetter}</p>
                        </div>
                      )}

                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#4b5563" }}>
                        Postulado el {new Date(app.appliedAt).toLocaleDateString()}
                      </p>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["REVIEWED", "INTERVIEW", "ACCEPTED", "REJECTED"].map(s => {
                          const sl = STATUS_LABELS[s];
                          const isActive = app.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => !isActive && handleStatusChange(app.id, s)}
                              disabled={isActive || updatingId === app.id}
                              style={{
                                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                border: `1px solid ${isActive ? sl.color : "#1f2937"}`,
                                background: isActive ? sl.bg : "transparent",
                                color: isActive ? sl.color : "#6b7280",
                                cursor: isActive ? "default" : "pointer",
                                opacity: updatingId === app.id ? 0.5 : 1,
                              }}
                            >
                              {sl.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1f2937", background: "#111827", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", height: 140, padding: "12px 14px", borderRadius: 10, border: "1px solid #1f2937", background: "#111827", color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "system-ui" },
  error: { color: "#dc2626", fontSize: 12, marginTop: 6, marginLeft: 2 },
};
