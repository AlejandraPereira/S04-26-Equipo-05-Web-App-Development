import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import styles from "./Candidates.module.css";

interface Skill {
  name: string;
  level: number;
}

interface Candidate {
  name: string;
  role: string;
  location: string;
  skills: Skill[];
}

export default function Candidates() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const candidates: Candidate[] = [
    {
      name: "Ana Corbelle",
      role: "HR Leader | Especialista en Talento Senior",
      location: "Buenos Aires, Argentina",
      skills: [
        { name: "Liderazgo", level: 90 },
        { name: "Gestión del cambio", level: 85 },
        { name: "Comunicación", level: 88 },
      ],
    },
    {
      name: "Vanina Colazo",
      role: "Especialista en Desarrollo Organizacional",
      location: "Buenos Aires, Argentina",
      skills: [
        { name: "Estrategia", level: 92 },
        { name: "Liderazgo", level: 88 },
        { name: "Marca personal", level: 80 },
      ],
    },
    {
      name: "Carlos Méndez",
      role: "Gerente de Operaciones | Transformación Digital",
      location: "Córdoba, Argentina",
      skills: [
        { name: "Transformación digital", level: 85 },
        { name: "Gestión de proyectos", level: 90 },
        { name: "Pensamiento estratégico", level: 82 },
      ],
    },
  ];

  return (
    <div className={styles.page} style={{ flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar userType="empresa" />

      <div className={styles.main}>
        <TopBar placeholder="Buscar candidatos..." />

        <div className={styles.header}>
          <h1>Candidatos</h1>
          <p>Explorá los perfiles disponibles</p>
        </div>

        <div style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: isMobile ? "1fr" : selectedUser ? "1fr 380px" : "1fr",
          alignItems: "start",
        }}>
          {/* GRID */}
          <div style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: isMobile ? "1fr" : selectedUser ? "repeat(2, minmax(280px, 1fr))" : "repeat(3, minmax(280px, 340px))",
          }}>
            {candidates.map((c, i) => (
              <div
                key={i}
                onClick={() => setSelectedUser(c)}
                className={`${styles.card} ${selectedUser?.name === c.name ? styles.cardSelected : ""}`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className={styles.candidateName}>{c.name}</h3>
                    <p className={styles.candidateRole}>{c.role}</p>
                    <span className={styles.candidateLocation}>📍 {c.location}</span>
                  </div>
                </div>
                <div className={styles.skills}>
                  {c.skills.map((s, idx) => (
                    <span key={idx} className={styles.skill}>{s.name}</span>
                  ))}
                </div>
                <button className={styles.btnPrimary}>Ver perfil</button>
              </div>
            ))}
          </div>

          {/* DRAWER */}
          {selectedUser && (
            <div
              className={styles.drawer}
              style={{
                position: isMobile ? "relative" : "sticky",
                top: 20,
                width: isMobile ? "100%" : 380,
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button className={styles.drawerClose} onClick={() => setSelectedUser(null)}>✕</button>
              </div>

              <div className={styles.drawerProfile}>
                <div className={styles.avatarLarge}>
                  {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h2 style={{ margin: 0 }}>{selectedUser.name}</h2>
                <p style={{ color: "#9ca3af", marginTop: 6 }}>{selectedUser.role}</p>
              </div>

              <div className={styles.drawerActions}>
                <button className={styles.btnInterview}>Entrevistar</button>
                <button className={styles.btnMessage}>Mensaje</button>
              </div>

              <div style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 16 }}>Habilidades</h3>
                {selectedUser.skills.map((s, i) => (
                  <div key={i} className={styles.skillBar}>
                    <div className={styles.skillBarLabel}>
                      <span>{s.name}</span><span>{s.level}%</span>
                    </div>
                    <div className={styles.skillBarTrack}>
                      <div className={styles.skillBarFill} style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ marginBottom: 16 }}>Feedback</h3>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <textarea className={styles.feedbackTextarea} placeholder="Escribí una evaluación..." />
                <button className={styles.btnSend}>Enviar evaluación</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}