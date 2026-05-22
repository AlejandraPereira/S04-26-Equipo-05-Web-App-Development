import { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <div style={styles.page}>
      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.navBar}>
          <div style={styles.logo}>ReConecta45</div>
          <input placeholder="Buscar cursos, habilidades..." style={styles.search} />
          <div style={styles.rightNav}>
            <div style={styles.iconBtn}>🔔</div>
            <div style={styles.avatarSmall} onClick={() => navigate("/profile")}>
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          {userName ? `¡Hola ${userName.split(" ")[0]}! Tu perfil tiene un gran potencial` : "Tu perfil tiene un gran potencial"}
        </h1>
        <p style={styles.subtitle}>
          Analizamos tus respuestas para construir una ruta de aprendizaje personalizada.
        </p>
      </section>

      {/* RESULT */}
      <section style={styles.resultCard}>
        <div style={styles.scoreBox}>
          <h2 style={styles.score}>{average}%</h2>
          <p style={styles.scoreText}>Compatibilidad con nuevas oportunidades</p>
        </div>

        <div style={styles.resultInfo}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Fortalezas detectadas</h3>
            <ul style={styles.list}>
              {strengths.length > 0 ? (
                strengths.map((s, i) => <li key={i}>✔ {s.name} ({s.score}%)</li>)
              ) : (
                <li>Completá más pasos para detectar fortalezas</li>
              )}
            </ul>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Áreas recomendadas</h3>
            <ul style={styles.list}>
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
      <section style={styles.nextSection}>
        <h2 style={styles.nextTitle}>Cursos recomendados para vos</h2>
        <p style={styles.nextText}>
          Basado en tu diagnóstico, estas rutas pueden ayudarte a potenciar tu perfil profesional.
        </p>

        <div style={styles.coursesGrid}>
          <div style={styles.courseCard}>
            <div style={styles.match}>92% Match</div>
            <div style={styles.courseImage}>🤖</div>
            <div style={styles.courseContent}>
              <div style={styles.courseMeta}>Básico • 3h 20min</div>
              <h3 style={styles.courseTitle}>Fundamentos de Inteligencia Artificial</h3>
              <p style={styles.courseProvider}>By ReConecta45</p>
              <span style={styles.courseLink} onClick={() => navigate("/curso/1")}>Ver detalle →</span>
            </div>
          </div>

          <div style={styles.courseCard}>
            <div style={styles.match}>87% Match</div>
            <div style={styles.courseImage}>🔗</div>
            <div style={styles.courseContent}>
              <div style={styles.courseMeta}>Intermedio • 2h 45min</div>
              <h3 style={styles.courseTitle}>Marca Personal Digital</h3>
              <p style={styles.courseProvider}>By ReConecta45</p>
              <span style={styles.courseLink} onClick={() => navigate("/curso/3")}>Ver detalle →</span>
            </div>
          </div>

          <div style={styles.courseCard}>
            <div style={styles.match}>81% Match</div>
            <div style={styles.courseImage}>📊</div>
            <div style={styles.courseContent}>
              <div style={styles.courseMeta}>Básico • 4h 00min</div>
              <h3 style={styles.courseTitle}>Herramientas Digitales Modernas</h3>
              <p style={styles.courseProvider}>By ReConecta45</p>
              <span style={styles.courseLink} onClick={() => navigate("/curso/4")}>Ver detalle →</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.ctaButton}
          >
            Ir a mi Dashboard →
          </button>
        </div>
      </section>

      <div style={styles.footer}>ReConecta45 © 2026</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", width: "100%", padding: "24px 16px", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" },
  nav: { maxWidth: "1100px", margin: "0 auto 40px auto" },
  navBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" },
  logo: { fontWeight: "700", fontSize: "18px", color: "#fff" },
  search: { flex: 1, minWidth: "220px", maxWidth: "500px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #1f2937", background: "#0f172a", color: "white", outline: "none" },
  rightNav: { display: "flex", alignItems: "center", gap: "12px" },
  iconBtn: { fontSize: "18px", cursor: "pointer" },
  avatarSmall: { width: "38px", height: "38px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", color: "#fff", cursor: "pointer" },
  hero: { maxWidth: "760px", margin: "0 auto 60px auto", textAlign: "center" },
  title: { fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700", color: "#fff", marginBottom: "14px", lineHeight: "1.2" },
  subtitle: { fontSize: "18px", color: "#9ca3af", lineHeight: "1.7" },
  resultCard: { maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" },
  scoreBox: { border: "1px solid #1f2937", borderRadius: "20px", padding: "40px", background: "rgba(255,255,255,0.03)" },
  score: { fontSize: "64px", color: "#2563eb", marginBottom: "10px" },
  scoreText: { color: "#9ca3af", lineHeight: "1.6" },
  resultInfo: { display: "grid", gap: "16px" },
  infoCard: { border: "1px solid #1f2937", borderRadius: "16px", padding: "20px", background: "rgba(255,255,255,0.03)" },
  infoTitle: { fontSize: "20px", marginBottom: "16px", color: "#fff" },
  list: { paddingLeft: "18px", color: "#d1d5db", lineHeight: "2" },
  nextSection: { maxWidth: "1100px", margin: "80px auto" },
  nextTitle: { fontSize: "30px", textAlign: "center", marginBottom: "10px", color: "#fff" },
  nextText: { textAlign: "center", color: "#9ca3af", marginBottom: "40px", lineHeight: "1.7" },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" },
  courseCard: { border: "1px solid #1f2937", borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,0.03)", position: "relative" },
  match: { position: "absolute", top: "12px", right: "12px", background: "#2563eb", padding: "5px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" },
  courseImage: { height: "120px", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" },
  courseContent: { padding: "18px" },
  courseMeta: { fontSize: "13px", color: "#9ca3af", marginBottom: "8px" },
  courseTitle: { fontSize: "18px", marginBottom: "8px", color: "#fff", lineHeight: "1.4" },
  courseProvider: { fontSize: "13px", color: "#94a3b8", marginBottom: "12px" },
  courseLink: { color: "#60a5fa", cursor: "pointer", fontWeight: "600" },
  ctaButton: { padding: "14px 32px", borderRadius: "12px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "80px", color: "#6b7280", fontSize: "12px" },
};