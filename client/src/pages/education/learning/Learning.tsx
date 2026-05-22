import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import styles from "./Learning.module.css";
console.log("STYLES:", styles);

const coursesMock = [
  { id: 1, title: "Fundamentos de Inteligencia Artificial", description: "Aprende los conceptos básicos de IA aplicados al trabajo.", level: "Básico", duration: "3h 20m", modules: 6, skills: ["IA básica", "Pensamiento digital", "Automatización"], progress: 60 },
  { id: 2, title: "Liderazgo en entornos cambiantes", description: "Desarrolla habilidades de liderazgo moderno.", level: "Avanzado", duration: "5h 10m", modules: 8, skills: ["Liderazgo", "Gestión del cambio", "Comunicación"], progress: 30 },
  { id: 3, title: "Marca personal digital", description: "Construye una presencia profesional sólida online.", level: "Intermedio", duration: "2h 45m", modules: 5, skills: ["Marca personal", "LinkedIn", "Networking"], progress: 80 },
  { id: 4, title: "Herramientas digitales modernas", description: "Domina herramientas digitales clave para el trabajo.", level: "Básico", duration: "4h 00m", modules: 7, skills: ["Office", "Google Suite", "Productividad"], progress: 10 },
  { id: 5, title: "Gestión del cambio organizacional", description: "Aprende a liderar procesos de transformación.", level: "Avanzado", duration: "6h 15m", modules: 9, skills: ["Cambio", "Estrategia", "Liderazgo"], progress: 45 },
  { id: 6, title: "Comunicación efectiva", description: "Mejora tu comunicación en entornos profesionales.", level: "Intermedio", duration: "2h 30m", modules: 4, skills: ["Comunicación", "Soft skills"], progress: 70 },
  { id: 7, title: "Pensamiento estratégico aplicado", description: "Aprende a tomar decisiones con visión de negocio.", level: "Avanzado", duration: "4h 50m", modules: 6, skills: ["Estrategia", "Análisis", "Decisiones"], progress: 25 },
  { id: 8, title: "Productividad y enfoque digital", description: "Mejora tu rendimiento con técnicas modernas de productividad.", level: "Básico", duration: "2h 40m", modules: 5, skills: ["Productividad", "Organización", "Hábitos"], progress: 55 },
  { id: 9, title: "Transformación digital en empresas", description: "Entiende cómo las empresas evolucionan digitalmente.", level: "Intermedio", duration: "3h 10m", modules: 6, skills: ["Transformación", "Digitalización", "Estrategia"], progress: 40 },
  { id: 10, title: "Innovación y creatividad", description: "Desarrolla pensamiento creativo aplicado al trabajo.", level: "Básico", duration: "2h 20m", modules: 4, skills: ["Creatividad", "Innovación"], progress: 20 },
];

export default function Learning() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
    <div className={`${styles.page} ${isMobile ? styles.mobile : styles.desktop}`}>
      <Sidebar />

      <div className={styles.main}>
        <TopBar showLogo placeholder="Buscar skills, cursos o jobs..." />

        {/* FILTER BAR */}
        <div className={styles.filterWrapper}>
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={styles.dropdown}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="Todos">Nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <select className={styles.dropdown}>
              <option>Duración</option>
              <option>&lt; 3h</option>
              <option>3h - 5h</option>
              <option>5h+</option>
            </select>
          </div>
        </div>

        {/* CONTINUE */}
        <h2 className={styles.sectionTitle}>📖 Continúa aprendiendo</h2>
        <div className={styles.grid}>
          {continueCourses.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.levelBadge}>{c.level}</span>
                Imagen del curso
              </div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.description}</p>
              <div className={styles.skills}>
                {c.skills.map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
              </div>
              <div className={styles.metaRow}>
                <span>⏱ {c.duration}</span>
                <span>📘 {c.modules} módulos</span>
              </div>
              <div className={styles.progressText}>
                <span>{c.progress}%</span>
                <span>Siguiente módulo: {Math.min(c.modules, Math.ceil((c.progress / 100) * c.modules) + 1)}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
              </div>
              <button className={styles.btn} onClick={() => navigate(`/curso/${c.id}`)}>
                Continuar
              </button>
            </div>
          ))}
        </div>

        {/* RECOMMENDED */}
        <h2 className={styles.sectionTitle}>⭐ Recomendados para ti</h2>
        <div className={styles.grid}>
          {recommendedCourses.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.levelBadge}>{c.level}</span>
                Imagen del curso
              </div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.description}</p>
              <div className={styles.skills}>
                {c.skills.map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
              </div>
              <button className={styles.btn} onClick={() => navigate(`/curso/${c.id}`)}>
                Ver curso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}