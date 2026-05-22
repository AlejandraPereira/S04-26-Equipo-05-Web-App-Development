import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import styles from "./dashboard.module.css";

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
    { title: "Fundamentos de Inteligencia Artificial", progress: 60, id: "1" },
    { title: "Marca personal digital", progress: 35, id: "3" },
  ];

  const history = [
    { title: "Comunicación efectiva", status: "Visto" },
    { title: "Productividad y enfoque digital", status: "Visto" },
  ];

  const recommended = [
    { title: "Liderazgo en entornos cambiantes", id: "2" },
    { title: "Herramientas digitales modernas", id: "4" },
  ];

  return (
    <div className={`${styles.wrapper} ${isMobile ? styles.mobile : styles.desktop}`}>
      <Sidebar />

      <div className={styles.content}>
        <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>
            Continuá tu aprendizaje y revisá tu progreso
          </p>
        </div>

        <div className={styles.sections}>

          {/* COURSES IN PROGRESS */}
          <section>
            <h2 className={styles.sectionHeader}>📚 En progreso</h2>
            <div className={`${styles.gridCourses} ${isMobile ? styles.mobile : ""}`}>
              {coursesInProgress.map((c, i) => (
                <div key={i} className={styles.card}>
                  <h3>{c.title}</h3>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className={styles.progressLabel}>{c.progress}% completado</p>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => navigate(`/curso/${c.id}`)}
                  >
                    Continuar
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* HISTORIAL */}
          <section>
            <h2 className={styles.sectionHeader}>🕘 Vistos recientemente</h2>
            <div className={styles.gridHistory}>
              {history.map((h, i) => (
                <div key={i} className={styles.cardHistory}>
                  <span>{h.title}</span>
                  <span>{h.status}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECOMMENDED */}
          <section>
            <div className={styles.sectionHeaderRow}>
              <h2>⭐ Recomendados</h2>
              <button
                className={styles.btnOutline}
                onClick={() => navigate("/learning")}
              >
                Ver catálogo
              </button>
            </div>
            <div className={`${styles.gridRecommended} ${isMobile ? styles.mobile : ""}`}>
              {recommended.map((r, i) => (
                <div key={i} className={styles.card}>
                  <h3>{r.title}</h3>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => navigate(`/curso/${r.id}`)}
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