import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

interface Skill {
  name: string;
  level: number;
}

interface Candidate {
  name: string;
  role: string;
  location: string;
  skills: Skill[];
}

export default function Candidates() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const candidates: Candidate[] = [
    {
      name: "Ana Corbelle",
      role: "HR Leader | Especialista en Talento Senior",
      location: "Buenos Aires, Argentina",
      skills: [
        { name: "Liderazgo", level: 90 },
        { name: "Gestión del cambio", level: 85 },
        { name: "Comunicación", level: 88 },
      ],
    },
    {
      name: "Vanina Colazo",
      role: "Especialista en Desarrollo Organizacional",
      location: "Buenos Aires, Argentina",
      skills: [
        { name: "Estrategia", level: 92 },
        { name: "Liderazgo", level: 88 },
        { name: "Marca personal", level: 80 },
      ],
    },
    {
      name: "Carlos Méndez",
      role: "Gerente de Operaciones | Transformación Digital",
      location: "Córdoba, Argentina",
      skills: [
        { name: "Transformación digital", level: 85 },
        { name: "Gestión de proyectos", level: 90 },
        { name: "Pensamiento estratégico", level: 82 },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#fff", fontFamily: "system-ui", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar userType="empresa" />

      <div style={{ flex: 1, padding: "24px", minWidth: 0 }}>
        <TopBar showLogo placeholder="Buscar candidatos..." />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Candidatos</h1>
          <p style={{ marginTop: "6px", color: "#9ca3af" }}>
            Explorá los perfiles disponibles
          </p>
        </div>

        <div style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: isMobile ? "1fr" : selectedUser ? "1fr 380px" : "1fr",
          alignItems: "start",
        }}>
          {/* GRID */}
          <div style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile ? "1fr" : selectedUser ? "repeat(2, minmax(280px, 1fr))" : "repeat(3, minmax(280px, 340px))",
          }}>
            {candidates.map((c, i) => (
              <div key={i} onClick={() => setSelectedUser(c)} style={{
                padding: "20px", borderRadius: "18px",
                border: `1px solid ${selectedUser?.name === c.name ? "#2563eb" : "#1f2937"}`,
                background: selectedUser?.name === c.name ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.03)",
                cursor: "pointer", transition: "0.2s",
              }}>
                <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: "#2563eb", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontWeight: 700, flexShrink: 0,
                  }}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17 }}>{c.name}</h3>
                    <p style={{ margin: "4px 0", color: "#cbd5e1" }}>{c.role}</p>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>📍 {c.location}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                  {c.skills.map((s, idx) => (
                    <span key={idx} style={{
                      padding: "6px 10px", borderRadius: 999,
                      background: "#172033", color: "#93c5fd", fontSize: 12,
                    }}>
                      {s.name}
                    </span>
                  ))}
                </div>
                <button style={{
                  width: "100%", padding: 10, borderRadius: 10,
                  border: "none", background: "#2563eb",
                  color: "#fff", cursor: "pointer", fontWeight: 600,
                }}>
                  Ver perfil
                </button>
              </div>
            ))}
          </div>

          {/* DRAWER */}
          {selectedUser && (
            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: 24, padding: 24,
              position: isMobile ? "relative" : "sticky",
              top: 20, height: "fit-content",
              width: isMobile ? "100%" : 380,
            }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button onClick={() => setSelectedUser(null)} style={{
                  background: "transparent", border: "1px solid #374151",
                  color: "#fff", width: 34, height: 34,
                  borderRadius: 10, cursor: "pointer",
                }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "#2563eb", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 26, fontWeight: 700, marginBottom: 14,
                }}>
                  {selectedUser.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <h2 style={{ margin: 0 }}>{selectedUser.name}</h2>
                <p style={{ color: "#9ca3af", marginTop: 6 }}>{selectedUser.role}</p>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                <button style={{ flex: 1, padding: 12, background: "#2563eb", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Entrevistar</button>
                <button style={{ flex: 1, padding: 12, background: "transparent", border: "1px solid #374151", borderRadius: 12, color: "#fff", cursor: "pointer" }}>Mensaje</button>
              </div>

              <div style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 16 }}>Habilidades</h3>
                {selectedUser.skills.map((s: Skill, i: number) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                      <span>{s.name}</span><span>{s.level}%</span>
                    </div>
                    <div style={{ height: 8, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#3b82f6", width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ marginBottom: 16 }}>Feedback</h3>
                <div style={{ fontSize: 22, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
                <textarea placeholder="Escribí una evaluación..." style={{
                  width: "100%", height: 110, background: "#0f172a",
                  border: "1px solid #1f2937", borderRadius: 14,
                  padding: 12, color: "#fff", resize: "none", outline: "none",
                  boxSizing: "border-box",
                }} />
                <button style={{
                  marginTop: 14, width: "100%", padding: 12,
                  borderRadius: 12, border: "none", background: "#22c55e",
                  color: "#000", cursor: "pointer", fontWeight: 700,
                }}>
                  Enviar evaluación
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}