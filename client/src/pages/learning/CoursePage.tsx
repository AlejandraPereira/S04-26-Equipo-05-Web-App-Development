import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const courseMock = {
  moduleTitle: "Módulo 2: Presencia Digital",
  xp: 1250,
  xpGained: 150,
  xpNextLevel: 750,
  progressPercent: 45,
  lesson: {
    id: 4,
    title: "Cómo optimizar tu perfil de LinkedIn para ser encontrado por recruiters",
    duration: "18:40 minutos de duración",
    rating: 4.9,
    reviews: "1.8k",
    description:
      "En esta lección aprenderemos a construir un perfil de LinkedIn que comunique tu propuesta de valor profesional de forma clara, atractiva y diferenciada, para que los recruiters y empresas te encuentren activamente.",
    notes: [
      {
        bold: "Foto y banner:",
        text: " Tu foto profesional genera la primera impresión. El banner es tu espacio de marca — usalo para comunicar tu área de expertise.",
      },
      {
        bold: "Titular profesional:",
        text: " No pongas solo tu cargo anterior. Describí tu propuesta de valor: quién sos, a quién ayudás y cómo.",
      },
      {
        bold: "Sección Acerca de:",
        text: " Contá tu historia en primera persona. Incluí tus fortalezas, logros clave y qué tipo de oportunidades buscás.",
      },
      {
        bold: "Keywords estratégicas:",
        text: " LinkedIn funciona como un buscador. Incluí las palabras clave de tu industria en el titular, el resumen y las experiencias.",
      },
    ],
    noteIntro:
      "LinkedIn es hoy la plataforma más importante para la visibilidad profesional. Optimizar tu perfil no es opcional: es la diferencia entre ser encontrado o ser invisible para los recruiters y empresas que buscan talento como el tuyo.",
    instructor: {
      name: "Ana Caro Corbelle",
      role: "HR Leader & Especialista en Marca Personal",
      initials: "AC",
    },
  },
  lessons: [
    { id: 1, title: "Qué es la marca personal y por qué importa", type: "Video", duration: "10:20", completed: true, locked: false },
    { id: 2, title: "Identificá tu propuesta de valor única", type: "Video", duration: "14:35", completed: true, locked: false },
    { id: 3, title: "Quiz: ¿Cuál es tu diferencial?", type: "Reto", duration: "5 min", completed: true, locked: false },
    { id: 4, title: "Optimizá tu perfil de LinkedIn", type: "Video", duration: "18:40", completed: false, locked: false, active: true },
    { id: 5, title: "Estrategia de contenido para profesionales", type: "Video", duration: "22:10", completed: false, locked: true },
    { id: 6, title: "Networking digital efectivo", type: "Video", duration: "16:50", completed: false, locked: true },
    { id: 7, title: "Reto Final: Tu perfil en 24hs", type: "Reto", duration: "15 min", completed: false, locked: true },
  ],
  resources: [
    { name: "Checklist de perfil LinkedIn", type: "PDF", size: "0.8 MB" },
    { name: "Plantilla: Titular profesional", type: "Doc", size: "Google Docs" },
    { name: "Guía de keywords por industria", type: "PDF", size: "1.1 MB" },
  ],
};

export default function CoursePage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showXpBanner, setShowXpBanner] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkComplete = () => {
    setCompleted(true);
    setShowXpBanner(true);
    setTimeout(() => setShowXpBanner(false), 3000);
  };

  const handleDownload = (fileName: string) => {
    setDownloadToast(fileName);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const { lesson, lessons, resources, xp, xpGained, xpNextLevel, progressPercent, moduleTitle } = courseMock;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

        {/* XP BANNER */}
        {showXpBanner && (
          <div style={{
            position: "fixed", top: 80, right: 24, zIndex: 999,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            color: "#fff", padding: "14px 22px", borderRadius: 14,
            fontWeight: 700, fontSize: 15, boxShadow: "0 8px 30px rgba(22,163,74,0.4)",
          }}>
            🎉 +{xpGained} XP ganados — ¡Lección completada!
          </div>
        )}

        {/* DOWNLOAD TOAST */}
        {downloadToast && (
          <div style={{
            position: "fixed",
            top: showXpBanner ? 140 : 80,
            right: 24,
            zIndex: 999,
            background: "#0d1117",
            border: "1px solid #2563eb",
            color: "#fff",
            padding: "16px 20px",
            borderRadius: 14,
            boxShadow: "0 8px 30px rgba(37,99,235,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 280,
            animation: "slideIn 0.25s ease",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              ✅
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>
                Descarga exitosa
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {downloadToast}
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
          gap: 0,
          flex: 1,
          alignItems: "start",
        }}>
          {/* LEFT — main content */}
          <div style={{ padding: "0 0 40px 0", minWidth: 0 }}>

            {/* VIDEO PLAYER */}
            <div
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 16, left: 16,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                padding: "6px 14px", borderRadius: 8,
                fontSize: 12, fontWeight: 600, color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                {moduleTitle}
              </div>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
              <div style={{
                position: "absolute",
                width: 300, height: 300,
                background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
                borderRadius: "50%",
              }} />
              <div style={{
                width: 72, height: 72,
                borderRadius: "50%",
                background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.95)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                transition: "all 0.2s ease",
                zIndex: 1,
              }}>
                {isPlaying ? (
                  <div style={{ display: "flex", gap: 5 }}>
                    <div style={{ width: 4, height: 22, background: "#1e293b", borderRadius: 2 }} />
                    <div style={{ width: 4, height: 22, background: "#1e293b", borderRadius: 2 }} />
                  </div>
                ) : (
                  <div style={{
                    width: 0, height: 0,
                    borderTop: "13px solid transparent",
                    borderBottom: "13px solid transparent",
                    borderLeft: "22px solid #1e293b",
                    marginLeft: 5,
                  }} />
                )}
              </div>
              <div style={{
                position: "absolute", bottom: 16, right: 16,
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                padding: "5px 12px", borderRadius: 6,
                fontSize: 12, color: "#e2e8f0",
              }}>
                ⏱ {lesson.duration.split(" ")[0]}
              </div>
            </div>

            {/* LESSON INFO */}
            <div style={{ padding: "24px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>⏱ {lesson.duration}</span>
                <span style={{ fontSize: 13, color: "#fbbf24" }}>⭐ {lesson.rating} ({lesson.reviews} valoraciones)</span>
              </div>

              <h1 style={{ margin: "0 0 12px", fontSize: isMobile ? 20 : 26, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                {lesson.title}
              </h1>
              <p style={{ margin: "0 0 20px", color: "#9ca3af", lineHeight: 1.7, fontSize: 15 }}>
                {lesson.description}
              </p>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                <button
                  onClick={handleMarkComplete}
                  disabled={completed}
                  style={{
                    padding: "12px 24px", borderRadius: 12, border: "none",
                    background: completed ? "#16a34a" : "#2563eb",
                    color: "#fff", cursor: completed ? "default" : "pointer",
                    fontWeight: 700, fontSize: 15,
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {completed ? "✓ Completada" : "Marcar como completada"}
                </button>
                <button style={{
                  padding: "12px 20px", borderRadius: 12,
                  border: "1px solid #1f2937", background: "transparent",
                  color: "#e5e7eb", cursor: "pointer", fontWeight: 600, fontSize: 15,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  💬 Dudas
                </button>
                <button style={{
                  padding: "12px 16px", borderRadius: 12,
                  border: "1px solid #1f2937", background: "transparent",
                  color: "#e5e7eb", cursor: "pointer", fontSize: 18,
                }}>
                  ↗
                </button>
              </div>

              {/* NOTES */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Notas de la Clase</h2>
                <div style={{
                  padding: "20px", borderRadius: 14,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid #1f2937",
                }}>
                  <p style={{ color: "#9ca3af", lineHeight: 1.8, marginBottom: 16, fontSize: 14 }}>
                    {lesson.noteIntro}
                  </p>
                  <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {lesson.notes.map((note, i) => (
                      <li key={i} style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.7, display: "flex", gap: 8 }}>
                        <span style={{ color: "#2563eb", marginTop: 2 }}>•</span>
                        <span>
                          <strong style={{ color: "#fff" }}>{note.bold}</strong>
                          {note.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* VER TODOS LOS CURSOS */}
              <button
                onClick={() => navigate("/learning")}
                style={{
                  background: "transparent",
                  border: "1px solid #1f2937",
                  color: "#60a5fa",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "10px 18px",
                  borderRadius: 10,
                  marginBottom: 32,
                }}
              >
                Ver todos los cursos →
              </button>

              {/* RESOURCES + INSTRUCTOR */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                {/* RESOURCES */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Recursos</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {resources.map((r, i) => (
                      <div
                        key={i}
                        onClick={() => handleDownload(r.name)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 16px", borderRadius: 12,
                          border: "1px solid #1f2937", background: "rgba(255,255,255,0.02)",
                          cursor: "pointer",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#2563eb";
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.06)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#1f2937";
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: "#1e293b", border: "1px solid #374151",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16,
                          }}>
                            📄
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#e5e7eb" }}>{r.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{r.type} • {r.size}</p>
                          </div>
                        </div>
                        <span style={{ color: "#4b5563", fontSize: 18 }}>⬇</span>
                      </div>
                    ))}
                    <button style={{
                      background: "transparent", border: "none",
                      color: "#60a5fa", cursor: "pointer", fontSize: 14,
                      textAlign: "left", padding: "4px 0",
                    }}>
                      Ver todos los recursos ↗
                    </button>
                  </div>
                </div>

                {/* INSTRUCTOR */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Instructor</h2>
                  <div style={{
                    padding: "20px", borderRadius: 14,
                    border: "1px solid #1f2937", background: "rgba(255,255,255,0.02)",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                      {lesson.instructor.initials}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 15 }}>{lesson.instructor.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#6b7280", marginTop: 2 }}>{lesson.instructor.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — sidebar panel */}
          <div style={{
            borderLeft: "1px solid #1f2937",
            background: "#0d1117",
            minHeight: isMobile ? "auto" : "100%",
            position: isMobile ? "relative" : "sticky",
            top: 0,
            maxHeight: isMobile ? "none" : "100vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* XP PANEL */}
            <div style={{
              padding: "20px",
              borderBottom: "1px solid #1f2937",
              background: "rgba(37,99,235,0.05)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                  Tu Progreso
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: "#16a34a",
                  background: "rgba(22,163,74,0.15)", padding: "3px 10px",
                  borderRadius: 999, border: "1px solid rgba(22,163,74,0.3)",
                }}>
                  🏅 +{xpGained} XP
                </span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 2 }}>
                {xp.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 500, color: "#6b7280" }}>XP totales</span>
              </div>
              <div style={{ height: 6, background: "#1f2937", borderRadius: 999, margin: "10px 0 8px" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                  width: `${progressPercent}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                {moduleTitle} completado al {progressPercent}%. Siguiente nivel en {xpNextLevel} XP.
              </p>
            </div>

            {/* LESSON LIST */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                  Contenido del Curso
                </span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{lessons.length} Lecciones</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {lessons.map((l) => (
                  <div key={l.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10,
                    background: l.active ? "rgba(37,99,235,0.12)" : "transparent",
                    border: l.active ? "1px solid rgba(37,99,235,0.3)" : "1px solid transparent",
                    cursor: l.locked ? "default" : "pointer",
                    opacity: l.locked ? 0.45 : 1,
                    transition: "all 0.15s",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: l.completed ? "#16a34a" : l.active ? "#2563eb" : "#1f2937",
                      fontSize: 11,
                    }}>
                      {l.locked ? "🔒" : l.completed ? "✓" : l.active ? "▶" : "○"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontSize: 13, fontWeight: l.active ? 600 : 400,
                        color: l.active ? "#fff" : l.completed ? "#94a3b8" : "#d1d5db",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {l.title}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#4b5563", marginTop: 2 }}>
                        {l.type} · ⏱ {l.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/learning")}
                style={{
                  marginTop: 20, width: "100%",
                  padding: "10px", borderRadius: 10,
                  border: "1px solid #1f2937", background: "transparent",
                  color: "#60a5fa", cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}
              >
                ← Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}