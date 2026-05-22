import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

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
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0b0f19", color: "#fff",
      flexDirection: isMobile ? "column" : "row",
    }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 24, minWidth: 0 }}>
        <TopBar showLogo placeholder="Buscar jobs, empresas o skills..." />

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Marketplace</h1>
          <p style={{ marginTop: 8, color: "#9ca3af" }}>
            Explora oportunidades laborales y encuentra tu próximo trabajo.
          </p>
        </div>

        {/* FILTER BAR */}
        <div style={{ display: "flex", gap: 10, margin: "0 0 24px 0", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#111827", border: "1px solid #1f2937" }}>
            <input
              style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "#fff" }}
              placeholder="Buscar ofertas, empresas o skills..."
            />
          </div>
            <select style={{ padding: "10px 12px", borderRadius: 10, background: "#111827", color: "#fff", border: "1px solid #1f2937" }}>
              <option>Relevancia</option>
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </select>
            <button style={{ padding: "10px 20px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
              Buscar empleo
            </button>
          </div>

        {/* LAYOUT */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "280px minmax(0, 900px)",
          gap: 24,
          alignItems: "start",
          justifyContent: "start",
        }}>
          {/* FILTERS */}
          <div style={{
            border: "1px solid #1f2937",
            borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            padding: 20,
            position: isMobile ? "relative" : "sticky",
            top: 20,
            height: "fit-content",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: 20 }}>Filtros</h3>

            <div style={{ marginBottom: 28 }}>
              <p style={{ marginBottom: 14, color: "#9ca3af", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Skills
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["React", "Node", "UX", "TypeScript"].map((skill) => (
                  <label key={skill} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#e5e7eb", fontSize: 15 }}>
                    <input
                      type="checkbox"
                      checked={filters.skills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 14, color: "#9ca3af", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Tipo
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Remote", "Onsite"].map((type) => (
                  <label key={type} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#e5e7eb", fontSize: 15 }}>
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => toggleType(type)}
                      style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {loading && <p style={{ color: "#9ca3af" }}>Cargando jobs...</p>}

            {!loading && filteredJobs.map((job) => (
              <div key={job.id} style={{
                padding: 22, borderRadius: 20,
                border: "1px solid #1f2937",
                background: "rgba(255,255,255,0.03)",
                transition: "0.2s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "#172033", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}>
                      🏢
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 20 }}>{job.title}</h3>
                      <p style={{ marginTop: 6, color: "#9ca3af", fontSize: 14 }}>
                        {job.company ?? "Company"}
                      </p>
                    </div>
                  </div>

                  <span style={{
                    padding: "8px 12px", borderRadius: 999,
                    background: job.isRemote ? "rgba(37,99,235,0.15)" : "rgba(34,197,94,0.15)",
                    color: job.isRemote ? "#60a5fa" : "#4ade80",
                    fontSize: 13, fontWeight: 600,
                  }}>
                    {job.isRemote ? "Remote" : "Onsite"}
                  </span>
                </div>

                <p style={{ marginTop: 18, lineHeight: 1.6, color: "#d1d5db" }}>
                  {job.description}
                </p>

                <div style={{
                  marginTop: 22, paddingTop: 18,
                  borderTop: "1px solid #1f2937",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", gap: 20, flexWrap: "wrap",
                }}>
                  <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>
                    📍 {job.location}
                    <br />
                    💰 ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                  </div>

                  <div style={{ display: "flex", gap: 12, width: isMobile ? "100%" : "auto" }}>
                    <button style={{
                      flex: 1, padding: "12px 18px", borderRadius: 12,
                      border: "none", background: "#2563eb",
                      color: "#fff", cursor: "pointer", fontWeight: 600,
                    }}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: 10, borderRadius: 10, background: "#1f2937", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Anterior
              </button>
              <span style={{ alignSelf: "center" }}>Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                style={{ padding: 10, borderRadius: 10, background: "#1f2937", color: "#fff", border: "none", cursor: "pointer" }}
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