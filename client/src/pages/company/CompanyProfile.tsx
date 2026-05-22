import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

interface EmpresaProfile {
  nombre: string;
  industria: string;
  descripcion: string;
  ubicacion: string;
  sitioWeb: string;
  empleados: string;
  linkedinUrl: string;
}

const profileMock: EmpresaProfile = {
  nombre: "Mercer Argentina",
  industria: "Recursos Humanos & Consultoría",
  descripcion: "Somos una consultora líder en gestión de talento y compensaciones con más de 30 años en el mercado argentino. Creemos en el valor del talento senior como motor de crecimiento organizacional.",
  ubicacion: "Buenos Aires, Argentina",
  sitioWeb: "https://www.mercer.com/ar",
  empleados: "500-1000",
  linkedinUrl: "https://linkedin.com/company/mercer-argentina",
};

const industriaOptions = [
  "Recursos Humanos & Consultoría", "Tecnología", "Finanzas & Banca",
  "Salud", "Educación", "Retail & Consumo masivo",
  "Manufactura & Industria", "Servicios profesionales", "Otro",
];

const empleadosOptions = ["1-10", "11-50", "51-200", "200-500", "500-1000", "1000+"];

export default function CompanyProfile() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile] = useState<EmpresaProfile>(profileMock);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EmpresaProfile>(profileMock);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleField = (field: keyof EmpresaProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: PATCH /companies/:id { ...form }
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const initials = profile.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#fff", fontFamily: "system-ui", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar userType="empresa" />

      <div style={{ flex: 1, padding: "24px", minWidth: 0 }}>
        <TopBar showLogo placeholder="Buscar empresas..." />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Perfil de Empresa</h1>
          <p style={{ marginTop: "6px", color: "#9ca3af" }}>Así te ven los profesionales en el marketplace</p>
        </div>

        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 14, marginBottom: 24, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)" }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#4ade80", fontSize: 15 }}>¡Perfil actualizado!</p>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Los cambios ya son visibles para los profesionales.</p>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 20, padding: "32px 28px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ width: 80, height: 80, borderRadius: 18, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 22 }}>{profile.nombre}</h2>
                <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 14 }}>{profile.industria}</p>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>📍 {profile.ubicacion}</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid #1f2937", background: "transparent", color: "#60a5fa", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  Editar perfil →
                </button>
              )}
            </div>

            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={styles.label}>Nombre de la empresa *</label>
                  <input value={form.nombre} onChange={e => handleField("nombre", e.target.value)} placeholder="Ej: Mercer Argentina" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Industria *</label>
                  <select value={form.industria} onChange={e => handleField("industria", e.target.value)} style={styles.input}>
                    <option value="">Seleccioná una industria</option>
                    {industriaOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Descripción *</label>
                  <textarea value={form.descripcion} onChange={e => handleField("descripcion", e.target.value)} placeholder="Contá quiénes son y por qué valoran el talento senior..." style={styles.textarea} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={styles.label}>Ubicación *</label>
                    <input value={form.ubicacion} onChange={e => handleField("ubicacion", e.target.value)} placeholder="Ej: Buenos Aires, Argentina" style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Cantidad de empleados</label>
                    <select value={form.empleados} onChange={e => handleField("empleados", e.target.value)} style={styles.input}>
                      <option value="">Seleccioná</option>
                      {empleadosOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={styles.label}>Sitio web</label>
                    <input value={form.sitioWeb} onChange={e => handleField("sitioWeb", e.target.value)} placeholder="https://www.empresa.com" style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>LinkedIn</label>
                    <input value={form.linkedinUrl} onChange={e => handleField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/company/..." style={styles.input} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #1f2937" }}>
                  <button onClick={handleCancel} style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid #1f2937", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 14 }}>Cancelar</button>
                  <button onClick={handleSave} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Guardar cambios →</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <p style={styles.fieldLabel}>Descripción</p>
                  <p style={styles.fieldValue}>{profile.descripcion}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  <div>
                    <p style={styles.fieldLabel}>Ubicación</p>
                    <p style={styles.fieldValue}>📍 {profile.ubicacion}</p>
                  </div>
                  <div>
                    <p style={styles.fieldLabel}>Empleados</p>
                    <p style={styles.fieldValue}>👥 {profile.empleados}</p>
                  </div>
                  <div>
                    <p style={styles.fieldLabel}>Sitio web</p>
                    <a href={profile.sitioWeb} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: 14 }}>{profile.sitioWeb || "—"}</a>
                  </div>
                  <div>
                    <p style={styles.fieldLabel}>LinkedIn</p>
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: 14 }}>{profile.linkedinUrl ? "Ver perfil →" : "—"}</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 18, padding: "20px 24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Actividad</h3>
              {[
                { label: "Ofertas activas",       value: "3" },
                { label: "Candidatos revisados",  value: "12" },
                { label: "Entrevistas agendadas", value: "4" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? "1px solid #1f2937" : "none" }}>
                  <span style={{ fontSize: 14, color: "#d1d5db" }}>{s.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 18, padding: "20px 24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Accesos rápidos</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => navigate("/joboffers")} style={styles.quickBtn}>📢 Publicar nueva oferta</button>
                <button onClick={() => navigate("/candidates")} style={styles.quickBtn}>👥 Ver candidatos</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1f2937", background: "#111827", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", height: 120, padding: "12px 14px", borderRadius: 10, border: "1px solid #1f2937", background: "#111827", color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "system-ui" },
  fieldLabel: { margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" },
  fieldValue: { margin: 0, fontSize: 14, color: "#d1d5db", lineHeight: 1.7 },
  quickBtn: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #1f2937", background: "transparent", color: "#d1d5db", cursor: "pointer", fontSize: 14, textAlign: "left", fontWeight: 600 },
};