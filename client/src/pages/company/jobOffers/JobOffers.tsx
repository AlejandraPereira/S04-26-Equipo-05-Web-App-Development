import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import styles from "./JobOffers.module.css";

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
    if (!oferta.modalidad) e.modalidad = "Seleccioná una modalidad";
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
    <div className={styles.page} style={{ flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar userType="empresa" />

      <div className={styles.main}>
        <TopBar placeholder="Buscar ofertas..." />

        <div className={styles.header}>
          <h1>Publicar oferta</h1>
          <p>Publicá tu búsqueda y accedé a talento +45 validado</p>
        </div>

        {submitted && (
          <div className={styles.successBanner}>
            <div>
              <p className={styles.successTitle}>¡Oferta publicada!</p>
              <p className={styles.successSub}>Tu oferta ya es visible para los profesionales.</p>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 24, alignItems: "start" }}>

          {/* FORM */}
          <div className={styles.formCard}>
            <h2>Nueva oferta laboral</h2>
            <p>Completá los campos para publicar tu búsqueda a profesionales +45.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.label}>Título del puesto *</label>
                <input
                  className={`${styles.input} ${errors.titulo ? styles.inputError : ""}`}
                  placeholder="Ej: Gerente de Operaciones"
                  value={oferta.titulo}
                  onChange={e => handleField("titulo", e.target.value)}
                />
                {errors.titulo && <p className={styles.error}>{errors.titulo}</p>}
              </div>

              <div>
                <label className={styles.label}>Descripción del puesto *</label>
                <textarea
                  className={`${styles.textarea} ${errors.descripcion ? styles.inputError : ""}`}
                  placeholder="Describí las responsabilidades, el equipo y el contexto del rol..."
                  value={oferta.descripcion}
                  onChange={e => handleField("descripcion", e.target.value)}
                />
                {errors.descripcion && <p className={styles.error}>{errors.descripcion}</p>}
              </div>

              <div>
                <label className={styles.label}>Rango salarial (opcional)</label>
                <div className={styles.salarioRow}>
                  <input className={styles.input} style={{ flex: 1 }} placeholder="Mínimo (ej: 2000)" value={oferta.salarioMin} onChange={e => handleField("salarioMin", e.target.value)} />
                  <span style={{ color: "#4b5563", fontSize: 18 }}>—</span>
                  <input className={styles.input} style={{ flex: 1 }} placeholder="Máximo (ej: 3500)" value={oferta.salarioMax} onChange={e => handleField("salarioMax", e.target.value)} />
                </div>
                <p className={styles.salarioNote}>En USD/mes. Dejá vacío si preferís no publicarlo.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <label className={styles.label}>Ubicación *</label>
                  <input
                    className={`${styles.input} ${errors.ubicacion ? styles.inputError : ""}`}
                    placeholder="Ej: Buenos Aires, Argentina"
                    value={oferta.ubicacion}
                    onChange={e => handleField("ubicacion", e.target.value)}
                  />
                  {errors.ubicacion && <p className={styles.error}>{errors.ubicacion}</p>}
                </div>

                <div>
                  <label className={styles.label}>Modalidad *</label>
                  <div className={styles.modalidadGroup}>
                    {modalidades.map((m) => (
                      <button
                        key={m} type="button"
                        onClick={() => handleField("modalidad", m)}
                        className={`${styles.modalidadBtn} ${oferta.modalidad === m ? styles.modalidadActive : ""}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {errors.modalidad && <p className={styles.error}>{errors.modalidad}</p>}
                </div>
              </div>

              <div>
                <label className={styles.label}>Requisitos *</label>
                <textarea
                  className={`${styles.textarea} ${styles.textareaShort} ${errors.requisitos ? styles.inputError : ""}`}
                  placeholder="Listá las habilidades, experiencia y perfil buscado..."
                  value={oferta.requisitos}
                  onChange={e => handleField("requisitos", e.target.value)}
                />
                {errors.requisitos && <p className={styles.error}>{errors.requisitos}</p>}
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.btnClear} onClick={() => setOferta(emptyOferta)}>Limpiar</button>
                <button type="submit" className={styles.btnSubmit}>Publicar oferta →</button>
              </div>
            </form>
          </div>

          {/* TIPS */}
          <div
            className={styles.tipsCard}
            style={{ position: isMobile ? "relative" : "sticky", top: 20 }}
          >
            <h3 className={styles.tipsTitle}>Consejos para tu oferta</h3>
            <div className={styles.tips}>
              {tips.map((t, i) => (
                <div key={i} className={styles.tip}>
                  <p className={styles.tipTitle}>{t.title}</p>
                  <p className={styles.tipDesc}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}