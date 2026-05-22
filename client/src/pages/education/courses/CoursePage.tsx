import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import styles from "./coursePage.module.css";

const courseMock = {
  moduleTitle: "Módulo 2: Presencia Digital",
  xp: 1250, xpGained: 150, xpNextLevel: 750, progressPercent: 45,
  lesson: {
    id: 4,
    title: "Cómo optimizar tu perfil de LinkedIn para ser encontrado por recruiters",
    duration: "18:40 minutos de duración",
    rating: 4.9, reviews: "1.8k",
    description: "En esta lección aprenderemos a construir un perfil de LinkedIn que comunique tu propuesta de valor profesional de forma clara, atractiva y diferenciada, para que los recruiters y empresas te encuentren activamente.",
    notes: [
      { bold: "Foto y banner:", text: " Tu foto profesional genera la primera impresión. El banner es tu espacio de marca — usalo para comunicar tu área de expertise." },
      { bold: "Titular profesional:", text: " No pongas solo tu cargo anterior. Describí tu propuesta de valor: quién sos, a quién ayudás y cómo." },
      { bold: "Sección Acerca de:", text: " Contá tu historia en primera persona. Incluí tus fortalezas, logros clave y qué tipo de oportunidades buscás." },
      { bold: "Keywords estratégicas:", text: " LinkedIn funciona como un buscador. Incluí las palabras clave de tu industria en el titular, el resumen y las experiencias." },
    ],
    noteIntro: "LinkedIn es hoy la plataforma más importante para la visibilidad profesional. Optimizar tu perfil no es opcional: es la diferencia entre ser encontrado o ser invisible para los recruiters y empresas que buscan talento como el tuyo.",
    instructor: { name: "Ana Caro Corbelle", role: "HR Leader & Especialista en Marca Personal", initials: "AC" },
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
    <div className={`${styles.wrapper} ${isMobile ? styles.mobile : styles.desktop}`}>
      <Sidebar />

      <div className={styles.mainCol}>
        <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

        {/* XP BANNER */}
        {showXpBanner && (
          <div className={styles.toastXp}>
            🎉 +{xpGained} XP ganados — ¡Lección completada!
          </div>
        )}

        {/* DOWNLOAD TOAST */}
        {downloadToast && (
          <div className={styles.toastDownload} style={{ top: showXpBanner ? 140 : 80 }}>
            <div className={styles.toastIcon}>✅</div>
            <div>
              <p className={styles.toastTitle}>Descarga exitosa</p>
              <p className={styles.toastSub}>{downloadToast}</p>
            </div>
          </div>
        )}

        <div className={`${styles.contentGrid} ${isMobile ? styles.mobile : styles.desktop}`}>

          {/* LEFT */}
          <div className={styles.leftCol}>

            {/* VIDEO PLAYER */}
            <div className={styles.player} onClick={() => setIsPlaying(!isPlaying)}>
              <div className={styles.playerModuleLabel}>{moduleTitle}</div>
              <div className={styles.playerGrid} />
              <div className={styles.playerGlow} />
              <div
                className={styles.playerBtn}
                style={{ background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.95)" }}
              >
                {isPlaying ? (
                  <div className={styles.pauseBars}>
                    <div className={styles.pauseBar} />
                    <div className={styles.pauseBar} />
                  </div>
                ) : (
                  <div className={styles.playTriangle} />
                )}
              </div>
              <div className={styles.playerDuration}>⏱ {lesson.duration.split(" ")[0]}</div>
            </div>

            {/* LESSON INFO */}
            <div className={styles.lessonInfo}>
              <div className={styles.lessonMeta}>
                <span className={styles.lessonMetaItem}>⏱ {lesson.duration}</span>
                <span className={styles.lessonMetaRating}>⭐ {lesson.rating} ({lesson.reviews} valoraciones)</span>
              </div>

              <h1 style={{ margin: "0 0 12px", fontSize: isMobile ? 20 : 26, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                {lesson.title}
              </h1>
              <p style={{ margin: "0 0 20px", color: "#9ca3af", lineHeight: 1.7, fontSize: 15 }}>
                {lesson.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className={styles.lessonActions}>
                <button
                  onClick={handleMarkComplete}
                  disabled={completed}
                  className={`${styles.btnComplete} ${completed ? styles.done : styles.pending}`}
                >
                  {completed ? "✓ Completada" : "Marcar como completada"}
                </button>
                <button className={styles.btnOutline}>💬 Dudas</button>
                <button className={styles.btnIcon}>↗</button>
              </div>

              {/* NOTES */}
              <div className={styles.notesSection}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Notas de la Clase</h2>
                <div className={styles.notesCard}>
                  <p className={styles.notesIntro}>{lesson.noteIntro}</p>
                  <ul className={styles.notesList}>
                    {lesson.notes.map((note, i) => (
                      <li key={i} className={styles.noteItem}>
                        <span className={styles.noteBullet}>•</span>
                        <span>
                          <strong style={{ color: "#fff" }}>{note.bold}</strong>
                          {note.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className={styles.btnCatalog} onClick={() => navigate("/learning")}>
                Ver todos los cursos →
              </button>

              {/* RESOURCES + INSTRUCTOR */}
              <div className={`${styles.bottomGrid} ${isMobile ? styles.mobile : styles.desktop}`}>
                {/* RESOURCES */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Recursos</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {resources.map((r, i) => (
                      <div key={i} className={styles.resourceItem} onClick={() => handleDownload(r.name)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className={styles.resourceIcon}>📄</div>
                          <div>
                            <p className={styles.resourceName}>{r.name}</p>
                            <p className={styles.resourceMeta}>{r.type} • {r.size}</p>
                          </div>
                        </div>
                        <span className={styles.resourceDownload}>⬇</span>
                      </div>
                    ))}
                    <button className={styles.btnAllResources}>Ver todos los recursos ↗</button>
                  </div>
                </div>

                {/* INSTRUCTOR */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Instructor</h2>
                  <div className={styles.instructorCard}>
                    <div className={styles.instructorAvatar}>{lesson.instructor.initials}</div>
                    <div>
                      <p className={styles.instructorName}>{lesson.instructor.name}</p>
                      <p className={styles.instructorRole}>{lesson.instructor.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className={`${styles.sidePanel} ${isMobile ? "" : styles.sticky}`}>
            {/* XP PANEL */}
            <div className={styles.xpPanel}>
              <div className={styles.xpHeader}>
                <span className={styles.xpLabel}>Tu Progreso</span>
                <span className={styles.xpBadge}>🏅 +{xpGained} XP</span>
              </div>
              <div className={styles.xpTotal}>
                {xp.toLocaleString()} <span className={styles.xpTotalUnit}>XP totales</span>
              </div>
              <div className={styles.xpBar}>
                <div className={styles.xpBarFill} style={{ width: `${progressPercent}%` }} />
              </div>
              <p className={styles.xpInfo}>
                {moduleTitle} completado al {progressPercent}%. Siguiente nivel en {xpNextLevel} XP.
              </p>
            </div>

            {/* LESSON LIST */}
            <div className={styles.lessonList}>
              <div className={styles.lessonListHeader}>
                <span className={styles.lessonListLabel}>Contenido del Curso</span>
                <span className={styles.lessonListCount}>{lessons.length} Lecciones</span>
              </div>

              <div className={styles.lessonItems}>
                {lessons.map((l) => (
                  <div
                    key={l.id}
                    className={styles.lessonItem}
                    style={{
                      background: l.active ? "rgba(37,99,235,0.12)" : "transparent",
                      border: l.active ? "1px solid rgba(37,99,235,0.3)" : "1px solid transparent",
                      cursor: l.locked ? "default" : "pointer",
                      opacity: l.locked ? 0.45 : 1,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: l.completed ? "#16a34a" : l.active ? "#2563eb" : "#1f2937",
                      fontSize: 11,
                    }}>
                      {l.locked ? "🔒" : l.completed ? "✓" : l.active ? "▶" : "○"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className={styles.lessonItemTitle}
                        style={{
                          fontWeight: l.active ? 600 : 400,
                          color: l.active ? "#fff" : l.completed ? "#94a3b8" : "#d1d5db",
                        }}
                      >
                        {l.title}
                      </p>
                      <p className={styles.lessonItemMeta}>{l.type} · ⏱ {l.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.btnBackCatalog} onClick={() => navigate("/learning")}>
                ← Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}