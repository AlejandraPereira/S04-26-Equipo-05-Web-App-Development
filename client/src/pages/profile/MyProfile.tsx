import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import styles from "./myProfile.module.css";

const USER_ID = "00000000-0000-0000-0000-000000000001";
const API = "http://localhost:3008";

type Profile = {
  id?: string;
  userId: string;
  username: string | null;
  headline: string | null;
  summary: string | null;
  location: string | null;
  yearsExperience: number | null;
  linkedinUrl: string | null;
  completionScore: number;
  lastUpdated: Date;
};

const skills = [
  { name: "Liderazgo", category: "Socioemocional", level: "Avanzado", icon: "🧭" },
  { name: "Comunicación", category: "Socioemocional", level: "Avanzado", icon: "💬" },
  { name: "Herramientas IA", category: "Digital", level: "Básico", icon: "🤖" },
  { name: "Marca Personal", category: "Digital", level: "Intermedio", icon: "🔗" },
  { name: "Gestión del Cambio", category: "Cognitiva", level: "Intermedio", icon: "🔄" },
  { name: "Office / Google Suite", category: "Digital", level: "Avanzado", icon: "📊" },
];

const levelColor: Record<string, string> = {
  "Básico": "#f59e0b",
  "Intermedio": "#3b82f6",
  "Avanzado": "#22c55e",
};

const courses = [
  { name: "Fundamentos de IA", progress: 60 },
  { name: "Marca Personal", progress: 35 },
  { name: "Herramientas Digitales", progress: 80 },
];

const badges = ["Perfil Completo", "Primer Curso", "Explorador Digital"];

export default function MyProfile() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);

  const [editProfile, setEditProfile] = useState({
    username: "",
    headline: "",
    location: "",
    yearsExperience: "",
    summary: "",
  });

  const [editLinks, setEditLinks] = useState({ linkedinUrl: "" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/professional-profile/${USER_ID}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditProfile({
            username: data.username ?? "",
            headline: data.headline ?? "",
            location: data.location ?? "",
            yearsExperience: data.yearsExperience?.toString() ?? "",
            summary: data.summary ?? "",
          });
          setEditLinks({ linkedinUrl: data.linkedinUrl ?? "" });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const body = {
        username: editProfile.username || null,
        headline: editProfile.headline || null,
        location: editProfile.location || null,
        summary: editProfile.summary || null,
        yearsExperience: editProfile.yearsExperience ? Number(editProfile.yearsExperience) : null,
      };
      if (profile?.id) {
        const res = await fetch(`${API}/professional-profile/${profile.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setProfile(await res.json());
      } else {
        const res = await fetch(`${API}/professional-profile/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, userId: USER_ID }),
        });
        setProfile(await res.json());
      }
      setShowProfileModal(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const saveLinks = async () => {
    try {
      const body = { linkedinUrl: editLinks.linkedinUrl || null };
      if (profile?.id) {
        const res = await fetch(`${API}/professional-profile/${profile.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setProfile(await res.json());
      } else {
        const res = await fetch(`${API}/professional-profile/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, userId: USER_ID }),
        });
        setProfile(await res.json());
      }
      setShowLinksModal(false);
    } catch (err) {
      console.error("Error saving links:", err);
    }
  };

  const initials = "AP";

  return (
    <>
      <div className={`${styles.page} ${isMobile ? styles.mobile : styles.desktop}`}>
        <Sidebar />

        <div className={styles.main}>
          <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

          {loading ? (
            <p style={{ color: "#9ca3af" }}>Cargando perfil...</p>
          ) : (
            <>
              {/* PROFILE HEADER */}
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>{initials}</div>

                <div style={{ flex: 1 }}>
                  <h1 className={styles.name}>{profile?.username ?? "Sin nombre"}</h1>
                  <p className={styles.role}>{profile?.headline ?? "Sin rol"}</p>
                  <p className={styles.role}>
                    {profile?.summary ?? "Agrega una descripción de tu perfil"}
                  </p>
                  <p className={styles.meta}>
                    📍 {profile?.location ?? "Sin ubicación"} •{" "}
                    {profile?.yearsExperience != null
                      ? `${profile.yearsExperience} años de experiencia`
                      : "Sin experiencia cargada"}
                  </p>

                  <div className={styles.completionWrapper}>
                    <div className={styles.completionLabel}>
                      <span>Perfil completado</span>
                      <span>{profile?.completionScore ?? 0}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${profile?.completionScore ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <span className={styles.editLink} onClick={() => setShowProfileModal(true)}>
                  Editar perfil →
                </span>
              </div>

              {/* GRID */}
              <div
                className={styles.grid}
                style={{ gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr" }}
              >
                {/* LEFT */}
                <div className={styles.leftCol}>
                  {/* COURSES */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>📖 Continúa con tu aprendizaje</h3>
                      <span className={styles.catalogLink} onClick={() => navigate("/learning")}>
                        Ver mis cursos →
                      </span>
                    </div>
                    {courses.map((c, i) => (
                      <div key={i} className={styles.course}>
                        <div className={styles.courseTop}>
                          <span>{c.name}</span>
                          <span>{c.progress}%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SKILLS */}
                  <div className={styles.card}>
                    <h3 style={{ marginBottom: 16 }}>🛡️ Habilidades Validadas</h3>
                    <div className={`${styles.skillsGrid} ${isMobile ? styles.mobile : styles.desktop}`}>
                      {skills.map((s, i) => (
                        <div key={i} className={styles.skillCard}>
                          <div className={styles.skillBadge}>
                            <span style={{ fontSize: 22 }}>{s.icon}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p className={styles.skillName}>{s.name}</p>
                            <p className={styles.skillCategory}>{s.category}</p>
                          </div>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: levelColor[s.level],
                            background: levelColor[s.level] + "22",
                            padding: "3px 10px",
                            borderRadius: 999,
                            border: `1px solid ${levelColor[s.level]}44`,
                            whiteSpace: "nowrap",
                          }}>
                            {s.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className={styles.rightCol}>
                  <div className={styles.card}>
                    <h3>🏅 Insignias</h3>
                    <div className={styles.badges}>
                      {badges.map((b, i) => (
                        <span key={i} className={styles.badge}>{b}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>Enlaces</h3>
                      <span className={styles.catalogLink} onClick={() => setShowLinksModal(true)}>
                        Editar →
                      </span>
                    </div>
                    <p>
                      🔗 LinkedIn:{" "}
                      {profile?.linkedinUrl ? (
                        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>
                          {profile.linkedinUrl}
                        </a>
                      ) : (
                        <span style={{ color: "#6b7280" }}>Sin LinkedIn</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Editar perfil</h2>
            <input
              className={styles.input}
              value={editProfile.headline}
              onChange={(e) => setEditProfile({ ...editProfile, headline: e.target.value })}
              placeholder="Headline (ej: HR Leader con 20 años de experiencia)"
            />
            <input
              className={styles.input}
              value={editProfile.location}
              onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
              placeholder="Ubicación (ej: Buenos Aires, Argentina)"
            />
            <input
              className={styles.input}
              type="number"
              value={editProfile.yearsExperience}
              onChange={(e) => setEditProfile({ ...editProfile, yearsExperience: e.target.value })}
              placeholder="Años de experiencia"
            />
            <textarea
              className={styles.textarea}
              value={editProfile.summary}
              onChange={(e) => setEditProfile({ ...editProfile, summary: e.target.value })}
              placeholder="Resumen / Bio"
            />
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowProfileModal(false)}>
                Cancelar
              </button>
              <button className={styles.saveBtn} onClick={saveProfile}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LINKS */}
      {showLinksModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Editar enlaces</h2>
            <input
              className={styles.input}
              value={editLinks.linkedinUrl}
              onChange={(e) => setEditLinks({ linkedinUrl: e.target.value })}
              placeholder="LinkedIn URL (ej: https://linkedin.com/in/usuario)"
            />
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowLinksModal(false)}>
                Cancelar
              </button>
              <button className={styles.saveBtn} onClick={saveLinks}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}