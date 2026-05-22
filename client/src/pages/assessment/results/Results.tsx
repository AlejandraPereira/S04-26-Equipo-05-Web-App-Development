import { useLocation, useNavigate } from "react-router-dom";
import styles from "./results.module.css";

type Skill = { name: string; score: number };

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const skills: Skill[] = location.state?.skills ?? [];
  const userName: string = location.state?.name ?? "Profesional";

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const average =
    skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
      : 0;

  const strengths = skills.filter((s) => s.score >= 70);
  const improvements = skills.filter((s) => s.score < 70);

  const getTip = (score: number) => {
    if (score >= 80) return "Mantené y aplicá en proyectos reales";
    if (score >= 60) return "Reforzá con práctica aplicada";
    if (score >= 40) return "Estudiá fundamentos + ejercicios guiados";
    return "Empezá desde bases estructuradas paso a paso";
  };

  return (
    <div className={styles.page}>
      {/* NAV */}
      <div className={styles.nav}>
        <div className={styles.navBar}>
          <div className={styles.logo}>ReConecta45</div>
          <input placeholder="Buscar cursos, habilidades..." className={styles.search} />
          <div className={styles.rightNav}>
            <div className={styles.iconBtn}>🔔</div>
            <div className={styles.avatarSmall} onClick={() => navigate("/profile")}>
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {userName
            ? `¡Hola ${userName.split(" ")[0]}! Tu perfil tiene un gran potencial`
            : "Tu perfil tiene un gran potencial"}
        </h1>
        <p className={styles.subtitle}>
          Analizamos tus respuestas para construir una ruta de aprendizaje personalizada.
        </p>
      </section>

      {/* RESULT */}
      <section className={styles.resultCard}>
        <div className={styles.scoreBox}>
          <h2 className={styles.score}>{average}%</h2>
          <p className={styles.scoreText}>Compatibilidad con nuevas oportunidades</p>
        </div>

        <div className={styles.resultInfo}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Fortalezas detectadas</h3>
            <ul className={styles.list}>
              {strengths.length > 0 ? (
                strengths.map((s, i) => <li key={i}>✔ {s.name} ({s.score}%)</li>)
              ) : (
                <li>Completá más pasos para detectar fortalezas</li>
              )}
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Áreas recomendadas</h3>
            <ul className={styles.list}>
              {improvements.length > 0 ? (
                improvements.map((s, i) => (
                  <li key={i}>📚 {s.name} — {getTip(s.score)}</li>
                ))
              ) : (
                <li>Excelente perfil, seguí potenciando tus habilidades</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className={styles.nextSection}>
        <h2 className={styles.nextTitle}>Cursos recomendados para vos</h2>
        <p className={styles.nextText}>
          Basado en tu diagnóstico, estas rutas pueden ayudarte a potenciar tu perfil profesional.
        </p>

        <div className={styles.coursesGrid}>
          <div className={styles.courseCard}>
            <div className={styles.match}>92% Match</div>
            <div className={styles.courseImage}>🤖</div>
            <div className={styles.courseContent}>
              <div className={styles.courseMeta}>Básico • 3h 20min</div>
              <h3 className={styles.courseTitle}>Fundamentos de Inteligencia Artificial</h3>
              <p className={styles.courseProvider}>By ReConecta45</p>
              <span className={styles.courseLink} onClick={() => navigate("/curso/1")}>Ver detalle →</span>
            </div>
          </div>

          <div className={styles.courseCard}>
            <div className={styles.match}>87% Match</div>
            <div className={styles.courseImage}>🔗</div>
            <div className={styles.courseContent}>
              <div className={styles.courseMeta}>Intermedio • 2h 45min</div>
              <h3 className={styles.courseTitle}>Marca Personal Digital</h3>
              <p className={styles.courseProvider}>By ReConecta45</p>
              <span className={styles.courseLink} onClick={() => navigate("/curso/3")}>Ver detalle →</span>
            </div>
          </div>

          <div className={styles.courseCard}>
            <div className={styles.match}>81% Match</div>
            <div className={styles.courseImage}>📊</div>
            <div className={styles.courseContent}>
              <div className={styles.courseMeta}>Básico • 4h 00min</div>
              <h3 className={styles.courseTitle}>Herramientas Digitales Modernas</h3>
              <p className={styles.courseProvider}>By ReConecta45</p>
              <span className={styles.courseLink} onClick={() => navigate("/curso/4")}>Ver detalle →</span>
            </div>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <button onClick={() => navigate("/dashboard")} className={styles.ctaButton}>
            Ir a mi Dashboard →
          </button>
        </div>
      </section>

      <div className={styles.footer}>ReConecta45 © 2026</div>
    </div>
  );
}