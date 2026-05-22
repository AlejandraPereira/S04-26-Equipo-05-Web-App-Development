import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const coursesMock = [
  {
    id: 1,
    title: "Fundamentos de Inteligencia Artificial",
    description: "Aprende los conceptos básicos de IA aplicados al trabajo.",
    level: "Básico",
    duration: "3h 20m",
    modules: 6,
    skills: ["IA básica", "Pensamiento digital", "Automatización"],
    progress: 60,
  },
  {
    id: 2,
    title: "Liderazgo en entornos cambiantes",
    description: "Desarrolla habilidades de liderazgo moderno.",
    level: "Avanzado",
    duration: "5h 10m",
    modules: 8,
    skills: ["Liderazgo", "Gestión del cambio", "Comunicación"],
    progress: 30,
  },
  {
    id: 3,
    title: "Marca personal digital",
    description: "Construye una presencia profesional sólida online.",
    level: "Intermedio",
    duration: "2h 45m",
    modules: 5,
    skills: ["Marca personal", "LinkedIn", "Networking"],
    progress: 80,
  },
  {
    id: 4,
    title: "Herramientas digitales modernas",
    description: "Domina herramientas digitales clave para el trabajo.",
    level: "Básico",
    duration: "4h 00m",
    modules: 7,
    skills: ["Office", "Google Suite", "Productividad"],
    progress: 10,
  },
  {
    id: 5,
    title: "Gestión del cambio organizacional",
    description: "Aprende a liderar procesos de transformación.",
    level: "Avanzado",
    duration: "6h 15m",
    modules: 9,
    skills: ["Cambio", "Estrategia", "Liderazgo"],
    progress: 45,
  },
  {
    id: 6,
    title: "Comunicación efectiva",
    description: "Mejora tu comunicación en entornos profesionales.",
    level: "Intermedio",
    duration: "2h 30m",
    modules: 4,
    skills: ["Comunicación", "Soft skills"],
    progress: 70,
  },
  {
    id: 7,
    title: "Pensamiento estratégico aplicado",
    description: "Aprende a tomar decisiones con visión de negocio.",
    level: "Avanzado",
    duration: "4h 50m",
    modules: 6,
    skills: ["Estrategia", "Análisis", "Decisiones"],
    progress: 25,
  },
  {
    id: 8,
    title: "Productividad y enfoque digital",
    description: "Mejora tu rendimiento con técnicas modernas de productividad.",
    level: "Básico",
    duration: "2h 40m",
    modules: 5,
    skills: ["Productividad", "Organización", "Hábitos"],
    progress: 55,
  },
  {
    id: 9,
    title: "Transformación digital en empresas",
    description: "Entiende cómo las empresas evolucionan digitalmente.",
    level: "Intermedio",
    duration: "3h 10m",
    modules: 6,
    skills: ["Transformación", "Digitalización", "Estrategia"],
    progress: 40,
  },
  {
    id: 10,
    title: "Innovación y creatividad",
    description: "Desarrolla pensamiento creativo aplicado al trabajo.",
    level: "Básico",
    duration: "2h 20m",
    modules: 4,
    skills: ["Creatividad", "Innovación"],
    progress: 20,
  },
];

export default function Learning() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = coursesMock.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "Todos" || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const continueCourses = filtered.slice(0, 3);
  const recommendedCourses = filtered.slice(3, 9);

  return (
    <div style={{ ...styles.page, flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar />

      <div style={styles.main}>
       
        <TopBar showLogo placeholder="Buscar skills, cursos o jobs..." />

        {/* FILTER */}
        <div style={styles.filterWrapper}>
          <div style={styles.filterBar}>
            <div style={styles.searchBox}>
              
              <input
                style={styles.searchInput}
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              style={styles.dropdown}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="Todos">Nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <select style={styles.dropdown}>
              <option>Duración</option>
              <option>&lt; 3h</option>
              <option>3h - 5h</option>
              <option>5h+</option>
            </select>
          </div>
        </div>

        {/* CONTINUE */}
        <h2 style={styles.sectionTitle}>📖 Continúa aprendiendo</h2>
        <div style={styles.grid}>
          {continueCourses.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={styles.imageFull}>
                <span style={styles.levelBadge}>{c.level}</span>
                 Imagen del curso
              </div>
              <h3 style={styles.title}>{c.title}</h3>
              <p style={styles.desc}>{c.description}</p>
              <div style={styles.skills}>
                {c.skills.map((s, i) => (
                  <span key={i} style={styles.skill}>{s}</span>
                ))}
              </div>
              <div style={styles.metaRow}>
                <span>⏱ {c.duration}</span>
                <span>📘 {c.modules} módulos</span>
              </div>
              <div style={styles.progressText}>
                <span>{c.progress}%</span>
                <span>
                  Siguiente módulo:{" "}
                  {Math.min(c.modules, Math.ceil((c.progress / 100) * c.modules) + 1)}
                </span>
              </div>
              <div style={styles.bar}>
                <div style={{ ...styles.fill, width: `${c.progress}%` }} />
              </div>
              <button style={styles.btn} onClick={() => navigate(`/curso/${c.id}`)}>
                Continuar
              </button>
            </div>
          ))}
        </div>

        {/* RECOMMENDED */}
        <h2 style={styles.sectionTitle}>⭐ Recomendados para ti</h2>
        <div style={styles.grid}>
          {recommendedCourses.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={styles.imageFull}>
                <span style={styles.levelBadge}>{c.level}</span>
                 Imagen del curso
              </div>
              <h3 style={styles.title}>{c.title}</h3>
              <p style={styles.desc}>{c.description}</p>
              <div style={styles.skills}>
                {c.skills.map((s, i) => (
                  <span key={i} style={styles.skill}>{s}</span>
                ))}
              </div>
              <button style={styles.btn} onClick={() => navigate(`/curso/${c.id}`)}>
                Ver curso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#fff" },
  main: { flex: 1, padding: 20 },
  filterWrapper: { display: "flex", justifyContent: "center" },
  filterBar: { display: "flex", gap: 10, margin: "15px 0", alignItems: "center", maxWidth: "1400px", width: "100%" },
  searchBox: { flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#111827", border: "1px solid #1f2937" },
  searchInput: { width: "100%", border: "none", outline: "none", background: "transparent", color: "#fff" },
  dropdown: { padding: "10px 12px", borderRadius: 10, background: "#111827", color: "#fff", border: "1px solid #1f2937" },
  sectionTitle: { marginTop: 20, marginBottom: 10 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 15 },
  card: { background: "#111827", borderRadius: 14, padding: 15, border: "1px solid #1f2937" },
  imageFull: { width: "100%", height: 140, borderRadius: 12, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "#9ca3af" },
  levelBadge: { position: "absolute", top: 10, right: 10, fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#000" },
  title: { fontSize: 14, marginTop: 10 },
  desc: { fontSize: 12, color: "#9ca3af" },
  skills: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 },
  skill: { fontSize: 10, background: "#1f2937", padding: "3px 6px", borderRadius: 6 },
  metaRow: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 8 },
  progressText: { display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 10, color: "#9ca3af" },
  bar: { height: 6, background: "#1f2937", borderRadius: 999, marginTop: 5 },
  fill: { height: "100%", background: "#22c55e", borderRadius: 999 },
  btn: { marginTop: 10, width: "100%", padding: 8, borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" },
};