import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";

type Lesson = {
  id: number;
  title: string;
  type: "Video" | "Reto";
  duration: string;
  description: string;
  noteIntro: string;
  notes: { bold: string; text: string }[];
  instructor: { name: string; role: string; initials: string };
  resources: { name: string; type: string; size: string }[];
};

type CourseData = {
  id: string;
  title: string;
  emoji: string;
  level: string;
  duration: string;
  modulesCount: number;
  skills: string[];
  lessons: Lesson[] | null;
};

export default function CoursePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showXpBanner, setShowXpBanner] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get<CourseData>(`/learning/courses/${id}`).then(data => {
      setCourseData(data);
    }).catch(console.error);

    api.get<{ courseId: string; progress: number; completedLessons: number[] }[]>("/learning/progress")
      .then(list => {
        const found = list.find(p => p.courseId === id);
        if (found?.completedLessons?.length) {
          setCompletedLessons(found.completedLessons);
          // start at first incomplete lesson
          const lessons = courseData?.lessons ?? [];
          const firstIncomplete = lessons.findIndex((_, i) => !found.completedLessons.includes(i));
          setCurrentIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
        }
      }).catch(() => {});
  }, [id]);

  // reset play state when lesson changes
  useEffect(() => { setIsPlaying(false); }, [currentIndex]);

  const lessons = courseData?.lessons ?? [];
  const currentLesson: Lesson | null = lessons[currentIndex] ?? null;

  const isCompleted = (idx: number) => completedLessons.includes(idx);

  const isLocked = (idx: number) => {
    if (idx === 0) return false;
    return !isCompleted(idx - 1) && !isCompleted(idx);
  };

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  const handleMarkComplete = async () => {
    if (!id || !currentLesson || marking) return;

    if (currentLesson.type === "Reto") {
      navigate(`/quiz/${id}`);
      return;
    }

    setMarking(true);
    try {
      await api.patch(`/learning/courses/${id}/lesson/${currentIndex}`, {});
      const updated = completedLessons.includes(currentIndex)
        ? completedLessons
        : [...completedLessons, currentIndex];
      setCompletedLessons(updated);
      setShowXpBanner(true);
      setTimeout(() => setShowXpBanner(false), 3000);

      // auto-advance to next lesson if exists
      if (currentIndex < lessons.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 600);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  const handleDownload = (name: string) => {
    setDownloadToast(name);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  if (!courseData) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#9ca3af" }}>Cargando curso...</p>
        </div>
      </div>
    );
  }

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
            🎉 +50 XP — ¡Lección completada!
          </div>
        )}

        {/* DOWNLOAD TOAST */}
        {downloadToast && (
          <div style={{
            position: "fixed", top: showXpBanner ? 140 : 80, right: 24, zIndex: 999,
            background: "#0d1117", border: "1px solid #2563eb", color: "#fff",
            padding: "16px 20px", borderRadius: 14,
            boxShadow: "0 8px 30px rgba(37,99,235,0.25)",
            display: "flex", alignItems: "center", gap: 12, minWidth: 280,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✅</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Descarga exitosa</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{downloadToast}</p>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 0, flex: 1, alignItems: "start" }}>

          {/* LEFT — main content */}
          <div style={{ padding: "0 0 40px 0", minWidth: 0 }}>

            {/* VIDEO PLAYER */}
            {currentLesson && (
              <div
                onClick={() => currentLesson.type === "Video" && setIsPlaying(!isPlaying)}
                style={{
                  width: "100%", aspectRatio: "16/9",
                  background: currentLesson.type === "Reto"
                    ? "linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1a1040 100%)"
                    : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentLesson.type === "Video" ? "pointer" : "default",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {courseData.title}
                </div>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div style={{ position: "absolute", width: 300, height: 300, background: `radial-gradient(circle, ${currentLesson.type === "Reto" ? "rgba(124,58,237,0.2)" : "rgba(37,99,235,0.15)"} 0%, transparent 70%)`, borderRadius: "50%" }} />

                {currentLesson.type === "Reto" ? (
                  <div style={{ zIndex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 12 }}>🎯</div>
                    <p style={{ color: "#c4b5fd", fontWeight: 700, fontSize: 18, margin: 0 }}>Reto del curso</p>
                    <p style={{ color: "#8b5cf6", fontSize: 14, marginTop: 4 }}>Hacé clic en "Ir al quiz" para comenzar</p>
                  </div>
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", transition: "all 0.2s ease", zIndex: 1 }}>
                    {isPlaying ? (
                      <div style={{ display: "flex", gap: 5 }}>
                        <div style={{ width: 4, height: 22, background: "#1e293b", borderRadius: 2 }} />
                        <div style={{ width: 4, height: 22, background: "#1e293b", borderRadius: 2 }} />
                      </div>
                    ) : (
                      <div style={{ width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: "22px solid #1e293b", marginLeft: 5 }} />
                    )}
                  </div>
                )}

                <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "5px 12px", borderRadius: 6, fontSize: 12, color: "#e2e8f0" }}>
                  ⏱ {currentLesson.duration}
                </div>
              </div>
            )}

            {/* LESSON INFO */}
            {currentLesson && (
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 999, background: currentLesson.type === "Reto" ? "rgba(124,58,237,0.15)" : "rgba(37,99,235,0.12)", color: currentLesson.type === "Reto" ? "#c4b5fd" : "#60a5fa", fontSize: 12, fontWeight: 600 }}>
                    {currentLesson.type === "Reto" ? "🎯 Reto" : "▶ Video"}
                  </span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>⏱ {currentLesson.duration}</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>Lección {currentIndex + 1} de {lessons.length}</span>
                </div>

                <h1 style={{ margin: "0 0 12px", fontSize: isMobile ? 20 : 26, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                  {currentLesson.title}
                </h1>
                <p style={{ margin: "0 0 20px", color: "#9ca3af", lineHeight: 1.7, fontSize: 15 }}>
                  {currentLesson.description}
                </p>

                {/* ACTION BUTTONS */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted(currentIndex) || marking}
                    style={{
                      padding: "12px 24px", borderRadius: 12, border: "none",
                      background: isCompleted(currentIndex) ? "#16a34a" : currentLesson.type === "Reto" ? "#7c3aed" : "#2563eb",
                      color: "#fff", cursor: isCompleted(currentIndex) ? "default" : "pointer",
                      fontWeight: 700, fontSize: 15, transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 8,
                      opacity: marking ? 0.7 : 1,
                    }}
                  >
                    {isCompleted(currentIndex) ? "✓ Completada" : currentLesson.type === "Reto" ? "🎯 Ir al quiz" : "Marcar como completada"}
                  </button>

                  {currentIndex < lessons.length - 1 && (
                    <button
                      onClick={() => !isLocked(currentIndex + 1) && setCurrentIndex(currentIndex + 1)}
                      disabled={isLocked(currentIndex + 1)}
                      style={{
                        padding: "12px 20px", borderRadius: 12,
                        border: "1px solid #1f2937", background: "transparent",
                        color: isLocked(currentIndex + 1) ? "#4b5563" : "#e5e7eb",
                        cursor: isLocked(currentIndex + 1) ? "default" : "pointer",
                        fontWeight: 600, fontSize: 15,
                      }}
                    >
                      Siguiente →
                    </button>
                  )}
                </div>

                {/* NOTES (only for Video type) */}
                {currentLesson.type === "Video" && currentLesson.noteIntro && (
                  <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Notas de la Clase</h2>
                    <div style={{ padding: "20px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid #1f2937" }}>
                      <p style={{ color: "#9ca3af", lineHeight: 1.8, marginBottom: currentLesson.notes.length > 0 ? 16 : 0, fontSize: 14 }}>
                        {currentLesson.noteIntro}
                      </p>
                      {currentLesson.notes.length > 0 && (
                        <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                          {currentLesson.notes.map((note, i) => (
                            <li key={i} style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.7, display: "flex", gap: 8 }}>
                              <span style={{ color: "#2563eb", marginTop: 2 }}>•</span>
                              <span>
                                <strong style={{ color: "#fff" }}>{note.bold}</strong>
                                {note.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* RETO placeholder */}
                {currentLesson.type === "Reto" && (
                  <div style={{ marginBottom: 32, padding: "24px", borderRadius: 14, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#c4b5fd", fontSize: 16, fontWeight: 600 }}>
                      Este es un reto de evaluación. Hacé clic en "Ir al quiz" para responder las preguntas del curso y marcar esta lección como completada.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => navigate("/learning")}
                  style={{ background: "transparent", border: "1px solid #1f2937", color: "#60a5fa", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "10px 18px", borderRadius: 10, marginBottom: 32 }}
                >
                  Ver todos los cursos →
                </button>

                {/* RESOURCES + INSTRUCTOR */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  {currentLesson.resources.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Recursos</h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {currentLesson.resources.map((r, i) => (
                          <div
                            key={i}
                            onClick={() => handleDownload(r.name)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: "1px solid #1f2937", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.06)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1f2937"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1e293b", border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📄</div>
                              <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#e5e7eb" }}>{r.name}</p>
                                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{r.type} · {r.size}</p>
                              </div>
                            </div>
                            <span style={{ color: "#4b5563", fontSize: 18 }}>⬇</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Instructor</h2>
                    <div style={{ padding: "20px", borderRadius: 14, border: "1px solid #1f2937", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {currentLesson.instructor.initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 15 }}>{currentLesson.instructor.name}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#6b7280", marginTop: 2 }}>{currentLesson.instructor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — sidebar panel */}
          <div style={{ borderLeft: "1px solid #1f2937", background: "#0d1117", minHeight: isMobile ? "auto" : "100%", position: isMobile ? "relative" : "sticky", top: 0, maxHeight: isMobile ? "none" : "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

            {/* PROGRESS PANEL */}
            <div style={{ padding: "20px", borderBottom: "1px solid #1f2937", background: "rgba(37,99,235,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Tu Progreso</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", background: "rgba(22,163,74,0.15)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(22,163,74,0.3)" }}>
                  {completedLessons.length}/{lessons.length} lecciones
                </span>
              </div>
              <div style={{ height: 6, background: "#1f2937", borderRadius: 999, margin: "10px 0 8px" }}>
                <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2563eb, #7c3aed)", width: `${progressPercent}%`, transition: "width 0.5s ease" }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                {courseData.title} · {progressPercent}% completado
              </p>
            </div>

            {/* LESSON LIST */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Contenido del Curso</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{lessons.length} Lecciones</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {lessons.map((l, idx) => {
                  const done = isCompleted(idx);
                  const locked = isLocked(idx);
                  const active = idx === currentIndex;
                  return (
                    <div
                      key={l.id}
                      onClick={() => !locked && setCurrentIndex(idx)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px", borderRadius: 10,
                        background: active ? "rgba(37,99,235,0.12)" : "transparent",
                        border: active ? "1px solid rgba(37,99,235,0.3)" : "1px solid transparent",
                        cursor: locked ? "default" : "pointer",
                        opacity: locked ? 0.45 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#16a34a" : active ? (l.type === "Reto" ? "#7c3aed" : "#2563eb") : "#1f2937", fontSize: 11 }}>
                        {locked ? "🔒" : done ? "✓" : active ? (l.type === "Reto" ? "🎯" : "▶") : "○"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#fff" : done ? "#94a3b8" : "#d1d5db", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.title}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "#4b5563", marginTop: 2 }}>
                          {l.type} · ⏱ {l.duration}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/learning")}
                style={{ marginTop: 20, width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #1f2937", background: "transparent", color: "#60a5fa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
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
