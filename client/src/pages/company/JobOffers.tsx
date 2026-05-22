import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

type Modalidad = "Presencial" | "Remoto" | "Híbrido";

interface Oferta {
  titulo: string;
  descripcion: string;
  salarioMin: string;
  salarioMax: string;
  ubicacion: string;
  modalidad: Modalidad | "";
  requisitos: string;
}

const emptyOferta: Oferta = {
  titulo: "", descripcion: "", salarioMin: "",
  salarioMax: "", ubicacion: "", modalidad: "", requisitos: "",
};

const modalidades: Modalidad[] = ["Presencial", "Remoto", "Híbrido"];

const tips = [
  { title: "Sé específico en el título", desc: "Evita títulos genéricos. 'Gerente de Operaciones con foco en logística' atrae mejor talento que solo 'Gerente'." },
  { title: "Describe el equipo y la cultura", desc: "Los profesionales +45 valoran el contexto: con quién van a trabajar y cómo es el ambiente." },
  { title: "Publica el salario", desc: "Las ofertas con rango salarial reciben hasta 3x más postulaciones." },
  { title: "Requisitos realistas", desc: "Pide solo lo verdaderamente necesario. Evita sobre-requisitar el puesto." },
];

export default function JobOffers() {
  const [isMobile, setIsMobile] = useState(false);
  const [oferta, setOferta] = useState<Oferta>(emptyOferta);
  const [errors, setErrors] = useState<Partial<Record<keyof Oferta, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleField = (field: keyof Oferta, value: string) => {
    setOferta((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Oferta, string>> = {};
    if (!oferta.titulo.trim()) e.titulo = "El título es requerido";
    if (!oferta.descripcion.trim()) e.descripcion = "La descripción es requerida";
    if (!oferta.ubicacion.trim()) e.ubicacion = "La ubicación es requerida";
    if (!oferta.modalidad) e.modalidad = "Selecciona una modalidad";
    if (!oferta.requisitos.trim()) e.requisitos = "Los requisitos son requeridos";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // TODO: POST /job-opportunities { ...oferta }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setOferta(emptyOferta); }, 3000);
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0b0f19", color: "#fff",
      fontFamily: "system-ui",
      flexDirection: isMobile ? "column" : "row",
    }}>
      <Sidebar userType="empresa" />

      <div style={{ flex: 1, padding: "24px", minWidth: 0 }}>
        <TopBar showLogo placeholder="Buscar ofertas..." />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Publicar oferta</h1>
          <p style={{ marginTop: "6px", color: "#9ca3af" }}>
            Publica tu búsqueda y accede a talento +45 validado
          </p>
        </div>

        {submitted && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 20px", borderRadius: 14, marginBottom: 24,
            background: "rgba(22,163,74,0.1)",
            border: "1px solid rgba(22,163,74,0.3)",
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#4ade80", fontSize: 15 }}>¡Oferta publicada!</p>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Tu oferta ya es visible para los profesionales.</p>
            </div>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
          gap: 24,
          alignItems: "start",
        }}>
          {/* FORM */}
          <div style={{
            background: "#0d1117", border: "1px solid #1f2937",
            borderRadius: 20, padding: "32px 28px",
          }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>Nueva oferta laboral</h2>
            <p style={{ margin: "0 0 28px", color: "#6b7280", fontSize: 14 }}>
              Completa los campos para publicar tu búsqueda a profesionales +45.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div>
                <label style={styles.label}>Título del puesto *</label>
                <input
                  placeholder="Ej: Gerente de Operaciones"
                  value={oferta.titulo}
                  onChange={e => handleField("titulo", e.target.value)}
                  style={{ ...styles.input, borderColor: errors.titulo ? "#dc2626" : "#1f2937" }}
                />
                {errors.titulo && <p style={styles.error}>{errors.titulo}</p>}
              </div>

              <div>
                <label style={styles.label}>Descripción del puesto *</label>
                <textarea
                  placeholder="Describe las responsabilidades, el equipo y el contexto del rol..."
                  value={oferta.descripcion}
                  onChange={e => handleField("descripcion", e.target.value)}
                  style={{ ...styles.textarea, borderColor: errors.descripcion ? "#dc2626" : "#1f2937" }}
                />
                {errors.descripcion && <p style={styles.error}>{errors.descripcion}</p>}
              </div>

              <div>
                <label style={styles.label}>Rango salarial (opcional)</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    placeholder="Mínimo (ej: 2000)"
                    value={oferta.salarioMin}
                    onChange={e => handleField("salarioMin", e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <div style={{ display: "flex", alignItems: "center", color: "#4b5563", fontSize: 18 }}>—</div>
                  <input
                    placeholder="Máximo (ej: 3500)"
                    value={oferta.salarioMax}
                    onChange={e => handleField("salarioMax", e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#4b5563" }}>En USD/mes. Déjalo vacío si prefieres no publicarlo.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={styles.label}>Ubicación *</label>
                  <input
                    placeholder="Ej: Madrid, España"
                    value={oferta.ubicacion}
                    onChange={e => handleField("ubicacion", e.target.value)}
                    style={{ ...styles.input, borderColor: errors.ubicacion ? "#dc2626" : "#1f2937" }}
                  />
                  {errors.ubicacion && <p style={styles.error}>{errors.ubicacion}</p>}
                </div>

                <div>
                  <label style={styles.label}>Modalidad *</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {modalidades.map((m) => (
                      <button
                        key={m} type="button"
                        onClick={() => handleField("modalidad", m)}
                        style={{
                          flex: 1, padding: "11px 0", borderRadius: 10,
                          border: "1px solid", cursor: "pointer",
                          fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                          borderColor: oferta.modalidad === m ? "#2563eb" : "#1f2937",
                          background: oferta.modalidad === m ? "rgba(37,99,235,0.15)" : "transparent",
                          color: oferta.modalidad === m ? "#60a5fa" : "#6b7280",
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {errors.modalidad && <p style={styles.error}>{errors.modalidad}</p>}
                </div>
              </div>

              <div>
                <label style={styles.label}>Requisitos *</label>
                <textarea
                  placeholder="Lista las habilidades, experiencia y perfil buscado..."
                  value={oferta.requisitos}
                  onChange={e => handleField("requisitos", e.target.value)}
                  style={{ ...styles.textarea, height: 120, borderColor: errors.requisitos ? "#dc2626" : "#1f2937" }}
                />
                {errors.requisitos && <p style={styles.error}>{errors.requisitos}</p>}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #1f2937" }}>
                <button
                  type="button" onClick={() => setOferta(emptyOferta)}
                  style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid #1f2937", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 14 }}
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15 }}
                >
                  Publicar oferta →
                </button>
              </div>

            </form>
          </div>

          {/* TIPS */}
          <div style={{
            background: "#0d1117", border: "1px solid #1f2937",
            borderRadius: 16, padding: "20px",
            position: isMobile ? "relative" : "sticky",
            top: 20,
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Consejos para tu oferta
            </h3>
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