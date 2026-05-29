import { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useApp } from "../../context/AppContext";

type Skill = { name: string; score: number };
type Course = { id: string; title: string; emoji: string; level: string; duration: string; skills: string[]; progress: number };
type MatchedCourse = Course & { matchScore: number };

/* Mapeo: keywords de skill → nombre de curso */
const SKILL_COURSE_MAP: Record<string, string[]> = {
  "Herramientas IA":         ["Fundamentos de Inteligencia Artificial"],
  "IA básica":               ["Fundamentos de Inteligencia Artificial"],
  "Pensamiento Digital":     ["Fundamentos de Inteligencia Artificial", "Transformación digital en empresas"],
  "Automatización":          ["Fundamentos de Inteligencia Artificial", "Herramientas digitales modernas"],
  "Liderazgo":               ["Liderazgo en entornos cambiantes"],
  "Gestión de Personas":     ["Liderazgo en entornos cambiantes"],
  "Gestión del Cambio":      ["Liderazgo en entornos cambiantes", "Gestión del cambio organizacional"],
  "Cambio":                  ["Gestión del cambio organizacional"],
  "Marca Personal":          ["Marca personal digital"],
  "LinkedIn":                ["Marca personal digital"],
  "Networking":              ["Marca personal digital"],
  "Office / Google Suite":   ["Herramientas digitales modernas"],
  "Productividad":           ["Productividad y enfoque digital", "Herramientas digitales modernas"],
  "Organización":            ["Productividad y enfoque digital"],
  "Comunicación":            ["Comunicación efectiva"],
  "Soft skills":             ["Comunicación efectiva", "Liderazgo en entornos cambiantes"],
  "Comunicación Visual":     ["Comunicación efectiva"],
  "Pensamiento Estratégico": ["Pensamiento estratégico aplicado"],
  "Análisis":                ["Pensamiento estratégico aplicado"],
  "Decisiones":              ["Pensamiento estratégico aplicado"],
  "Estrategia":              ["Pensamiento estratégico aplicado", "Gestión del cambio organizacional"],
  "Transformación":          ["Transformación digital en empresas"],
  "Digitalización":          ["Transformación digital en empresas"],
  "Creatividad":             ["Innovación y creatividad"],
  "Innovación":              ["Innovación y creatividad"],
};

function getMatchedCourses(skills: Skill[], courses: Course[]): MatchedCourse[] {
  const scoreMap: Record<string, number> = {};

  skills.forEach(skill => {
    const priority = skill.score < 70 ? (70 - skill.score) : 0; // priorizo las brechas
    const bonus = skill.score < 50 ? 20 : 0;

    const matchedTitles = SKILL_COURSE_MAP[skill.name] ?? [];
    matchedTitles.forEach(title => {
      scoreMap[title] = (scoreMap[title] ?? 50) + priority + bonus;
    });
  });

  // También matcheo por skill array del curso
  courses.forEach(course => {
    course.skills.forEach(cs => {
      skills.forEach(userSkill => {
        if (cs.toLowerCase().includes(userSkill.name.toLowerCase().split(" ")[0].toLowerCase()) && userSkill.score < 70) {
          scoreMap[course.title] = (scoreMap[course.title] ?? 50) + 10;
        }
      });
    });
  });

  return courses
    .filter(c => c.progress < 100) // no mostrar ya completados
    .map(c => ({ ...c, matchScore: Math.min(99, scoreMap[c.title] ?? 30) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  const [skills, setSkills] = useState<Skill[]>(location.state?.skills ?? []);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingResult, setLoadingResult] = useState(!location.state?.skills);

  useEffect(() => {
    if (location.state?.skills) return;
    api.get<{ skills: Skill[] }>("/diagnosis/result")
      .then(res => setSkills(res.skills ?? []))
      .catch(() => {})
      .finally(() => setLoadingResult(false));
  }, []);

  useEffect(() => {
    api.get<Course[]>("/learning/my-courses").catch(() => []).then(setCourses);
  }, []);

  const userName: string = user?.fullName ?? location.state?.name ?? "Profesional";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const average = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
    : 0;

  const strengths = skills.filter(s => s.score >= 70);
  const improvements = skills.filter(s => s.score < 70);
  const matchedCourses = getMatchedCourses(skills, courses);

  const getTip = (score: number) => {
    if (score >= 80) return "Mantené y aplicá en proyectos reales";
    if (score >= 60) return "Reforzá con práctica aplicada";
    if (score >= 40) return "Estudiá fundamentos + ejercicios guiados";
    return "Empezá desde bases estructuradas paso a paso";
  };

  if (loadingResult) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
        Cargando resultados...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.navBar}>
          <div style={styles.logo}>ReConecta45</div>
          <div style={styles.rightNav}>
            <div style={styles.avatarSmall} onClick={() => navigate("/profile")}>{initials}</div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          {userName ? `¡Hola ${userName.split(" ")[0]}! Tu diagnóstico está listo` : "Tu diagnóstico está listo"}
        </h1>
        <p style={styles.subtitle}>
          Analizamos tus respuestas y generamos una ruta de aprendizaje personalizada para vos.
        </p>
      </section>

      {/* SCORE + SKILLS */}
      <section style={styles.resultCard}>
        <div style={styles.scoreBox}>
          <h2 style={styles.score}>{average}%</h2>
          <p style={styles.scoreText}>Compatibilidad con nuevas oportunidades</p>
          <div style={{ marginTop: 24, height: 8, background: "#1f2937", borderRadius: 999 }}>
            <div style={{ height: "100%", background: average >= 70 ? "#22c55e" : average >= 50 ? "#3b82f6" : "#f59e0b", borderRadius: 999, width: `${average}%`, transition: "width 1s ease" }} />
          </div>
          <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            {average >= 70 ? "🚀 Perfil muy competitivo" : average >= 50 ? "📈 Buen punto de partida" : "🎯 Grandes oportunidades de crecimiento"}
          </p>
        </div>

        <div style={styles.resultInfo}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>✅ Fortalezas detectadas</h3>
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{s.name}</span><span style={{ color: "#22c55e" }}>{s.score}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1f2937", borderRadius: 999 }}>
                    <div style={{ height: "100%", background: "#22c55e", borderRadius: 999, width: `${s.score}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280", fontSize: 13 }}>Completá el diagnóstico completo para ver tus fortalezas</p>
            )}
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📚 Áreas de mejora</h3>
            {improvements.length > 0 ? (
              improvements.map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{s.name}</span><span style={{ color: "#f59e0b" }}>{s.score}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1f2937", borderRadius: 999 }}>
                    <div style={{ height: "100%", background: "#f59e0b", borderRadius: 999, width: `${s.score}%` }} />
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#6b7280" }}>{getTip(s.score)}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#22c55e", fontSize: 13 }}>Excelente perfil — seguí potenciando tus habilidades</p>
            )}
          </div>
        </div>
      </section>

      {/* RUTA PERSONALIZADA */}
      <section style={styles.nextSection}>
        <h2 style={styles.nextTitle}>🗺️ Tu ruta de aprendizaje personalizada</h2>
        <p style={styles.nextText}>
          Basado en tu diagnóstico, seleccionamos los cursos con mayor impacto para vos.
        </p>

        {matchedCourses.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, border: "1px solid #1f2937", borderRadius: 20, color: "#6b7280" }}>
            <p>Cargando recomendaciones...</p>
          </div>
        ) : (
          <div style={styles.coursesGrid}>
            {matchedCourses.map((course) => (
              <div key={course.id} style={styles.courseCard}>
                <div style={{ position: "absolute", top: 12, right: 12, background: course.matchScore >= 70 ? "#16a34a" : course.matchScore >= 50 ? "#2563eb" : "#d97706", padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {course.matchScore}% Match
                </div>
                {course.progress > 0 && course.progress < 100 && (
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(37,99,235,0.8)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#fff" }}>
                    {course.progress}% completado
                  </div>
                )}
                <div style={styles.courseImage}><span style={{ fontSize: 52 }}>{course.emoji}</span></div>
                <div style={styles.courseContent}>
                  <div style={styles.courseMeta}>{course.level} · {course.duration}</div>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    {course.skills.slice(0, 3).map((s, i) => (
                      <span key={i} style={{ fontSize: 11, background: "#1f2937", padding: "2px 8px", borderRadius: 6, color: "#9ca3af" }}>{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/curso/${course.id}`)}
                    style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                  >
                    {course.progress > 0 ? "Continuar curso →" : "Empezar ahora →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/learning")} style={{ ...styles.ctaButton, background: "transparent", border: "1px solid #2563eb", color: "#60a5fa" }}>
            Ver todos los cursos
          </button>
          <button onClick={() => navigate("/dashboard")} style={styles.ctaButton}>
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
  navBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" },
  logo: { fontWeight: "700", fontSize: "18px", color: "#fff" },
  rightNav: { display: "flex", alignItems: "center", gap: "12px" },
  avatarSmall: { width: "38px", height: "38px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", color: "#fff", cursor: "pointer" },
  hero: { maxWidth: "760px", margin: "0 auto 60px auto", textAlign: "center" },
  title: { fontSize: "clamp(26px, 5vw, 40px)", fontWeight: "700", color: "#fff", marginBottom: "14px", lineHeight: "1.2" },
  subtitle: { fontSize: "18px", color: "#9ca3af", lineHeight: "1.7" },
  resultCard: { maxWidth: "1100px", margin: "0 auto 60px auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" },
  scoreBox: { border: "1px solid #1f2937", borderRadius: "20px", padding: "36px", background: "rgba(255,255,255,0.03)" },
  score: { fontSize: "64px", color: "#2563eb", marginBottom: "10px", margin: 0 },
  scoreText: { color: "#9ca3af", lineHeight: "1.6", marginTop: 8 },
  resultInfo: { display: "grid", gap: "16px" },
  infoCard: { border: "1px solid #1f2937", borderRadius: "16px", padding: "20px", background: "rgba(255,255,255,0.03)" },
  infoTitle: { fontSize: "18px", marginBottom: "16px", color: "#fff" },
  nextSection: { maxWidth: "1100px", margin: "0 auto 80px auto" },
  nextTitle: { fontSize: "28px", textAlign: "center", marginBottom: "10px", color: "#fff" },
  nextText: { textAlign: "center", color: "#9ca3af", marginBottom: "40px", lineHeight: "1.7" },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" },
  courseCard: { border: "1px solid #1f2937", borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,0.03)", position: "relative" },
  courseImage: { height: "130px", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" },
  courseContent: { padding: "18px" },
  courseMeta: { fontSize: "13px", color: "#9ca3af", marginBottom: "8px" },
  courseTitle: { fontSize: "17px", marginBottom: "10px", color: "#fff", lineHeight: "1.4" },
  ctaButton: { padding: "14px 32px", borderRadius: "12px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "40px", color: "#6b7280", fontSize: "12px", paddingBottom: 40 },
};
