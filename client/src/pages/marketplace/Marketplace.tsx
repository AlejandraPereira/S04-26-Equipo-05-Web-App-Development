import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import styles from "./marketplace.module.css";

type Job = {
  id: string;
  title: string;
  company?: string;
  description: string;
  location: string;
  isRemote: boolean;
  minSalary: number;
  maxSalary: number;
  publishedAt: string;
  status?: string;
};

export default function Marketplace() {
  const [isMobile, setIsMobile] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const size = 10;

  const [filters, setFilters] = useState({
    skills: [] as string[],
    types: [] as string[],
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3008/job?page=${page}&size=${size}`);
        const json = await res.json();
        setJobs(json.data || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page]);

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSkill =
      filters.skills.length === 0 ||
      filters.skills.some((skill) => job.title.includes(skill));
    const matchType =
      filters.types.length === 0 ||
      filters.types.includes(job.isRemote ? "Remote" : "Onsite");
    return matchSkill && matchType;
  });

  return (
    <div className={`${styles.wrapper} ${isMobile ? styles.mobile : styles.desktop}`}>
      <Sidebar />

      <div className={styles.content}>
        <TopBar showLogo placeholder="Buscar jobs, empresas o skills..." />

        <div className={styles.header}>
          <h1>Marketplace</h1>
          <p>Explora oportunidades laborales y encuentra tu próximo trabajo.</p>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              placeholder="Buscar ofertas, empresas o skills..."
            />
          </div>
          <select className={styles.sortSelect}>
            <option>Relevancia</option>
            <option>Más recientes</option>
            <option>Más antiguos</option>
          </select>
          <button className={styles.searchButton}>Buscar empleo</button>
        </div>

        {/* LAYOUT */}
        <div className={`${styles.layout} ${isMobile ? styles.mobile : styles.desktop}`}>
          {/* FILTERS PANEL */}
          <div className={`${styles.filtersPanel} ${isMobile ? "" : styles.sticky}`}>
            <h3>Filtros</h3>

            <div className={styles.filterGroup}>
              <p className={styles.filterGroupLabel}>Skills</p>
              <div className={styles.filterOptions}>
                {["React", "Node", "UX", "TypeScript"].map((skill) => (
                  <label key={skill} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={filters.skills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <p className={styles.filterGroupLabel}>Tipo</p>
              <div className={styles.filterOptions}>
                {["Remote", "Onsite"].map((type) => (
                  <label key={type} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={filters.types.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          <div className={styles.jobList}>
            {loading && <p className={styles.loadingText}>Cargando jobs...</p>}

            {!loading && filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobCardTop}>
                  <div className={styles.jobInfo}>
                    <div className={styles.companyLogo}>🏢</div>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.companyName}>{job.company ?? "Company"}</p>
                    </div>
                  </div>
                  <span className={job.isRemote ? styles.badgeRemote : styles.badgeOnsite}>
                    {job.isRemote ? "Remote" : "Onsite"}
                  </span>
                </div>

                <p className={styles.jobDescription}>{job.description}</p>

                <div className={styles.jobFooter}>
                  <div className={styles.jobMeta}>
                    📍 {job.location}
                    <br />
                    💰 ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                  </div>
                  <div className={`${styles.jobActions} ${isMobile ? styles.mobile : ""}`}>
                    <button className={styles.btnDetails}>Ver detalles</button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className={styles.pageLabel}>Page {page}</span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}