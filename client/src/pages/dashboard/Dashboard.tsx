import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const coursesInProgress = [
    {
      title: "Fundamentos de Inteligencia Artificial",
      progress: 60,
      id: "1",
    },
    {
      title: "Marca personal digital",
      progress: 35,
      id: "3",
    },
  ];

  const history = [
    {
      title: "Comunicación efectiva",
      status: "Visto",
    },
    {
      title: "Productividad y enfoque digital",
      status: "Visto",
    },
  ];

  const recommended = [
    {
      title: "Liderazgo en entornos cambiantes",
      id: "2",
    },
    {
      title: "Herramientas digitales modernas",
      id: "4",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#fff",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <TopBar showLogo placeholder="Buscar cursos, habilidades..." />
        
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#9ca3af", marginTop: 5 }}>
            Continuá tu aprendizaje y revisá tu progreso
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>

          {/* COURSES IN PROGRESS */}
          <section>
            <h2 style={{ marginBottom: 12 }}>📚 En progreso</h2>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {coursesInProgress.map((c, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: "1px solid #1f2937",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <h3 style={{ marginBottom: 10 }}>{c.title}</h3>
                  <div style={{ height: 8, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${c.progress}%`, height: "100%", background: "#3b82f6" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{c.progress}% completado</p>
                  <button
                    onClick={() => navigate(`/curso/${c.id}`)}
                    style={{
                      marginTop: 10, width: "100%", padding: 10,
                      borderRadius: 10, border: "none",
                      background: "#2563eb", color: "#fff", cursor: "pointer",
                    }}
                  >
                    Continuar
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* HISTORIAL */}
          <section>
            <h2 style={{ marginBottom: 12 }}>🕘 Vistos recientemente</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: 14, borderRadius: 12,
                    border: "1px solid #1f2937", background: "#0f172a",
                    display: "flex", justifyContent: "space-between",
                  }}
                >
                  <span>{h.title}</span>
                  <span style={{ color: "#9ca3af" }}>{h.status}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECOMMENDED */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>⭐ Recomendados</h2>
              <button
                onClick={() => navigate("/learning")}
                style={{
                  background: "transparent", border: "1px solid #1f2937",
                  color: "#60a5fa", padding: "8px 12px",
                  borderRadius: 10, cursor: "pointer",
                }}
              >
                Ver catálogo
              </button>
            </div>
            <div
              style={{
                display: "grid", gap: 12,
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {recommended.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16, borderRadius: 14,
                    border: "1px solid #1f2937",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <h3>{r.title}</h3>
                  <button
                    onClick={() => navigate(`/curso/${r.id}`)}
                    style={{
                      marginTop: 10, width: "100%", padding: 10,
                      borderRadius: 10, border: "none",
                      background: "#1f2937", color: "#fff", cursor: "pointer",
                    }}
                  >
                    Ver curso
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}