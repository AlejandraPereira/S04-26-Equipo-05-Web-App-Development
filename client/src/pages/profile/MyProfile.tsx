import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const USER_ID = "00000000-0000-0000-0000-000000000001";
const API = "http://localhost:3008";

type Profile = {
  id?: string;
  userId: string;
  username: string |null; // add to backend
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

  const [editLinks, setEditLinks] = useState({
    linkedinUrl: "",
  });

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
        yearsExperience: editProfile.yearsExperience
          ? Number(editProfile.yearsExperience)
          : null,
      };

      if (profile?.id) {
        const res = await fetch(`${API}/professional-profile/${profile.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        setProfile(data);
      } else {
        const res = await fetch(`${API}/professional-profile/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, userId: USER_ID }),
        });
        const data = await res.json();
        setProfile(data);
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
        const data = await res.json();
        setProfile(data);
      } else {
        const res = await fetch(`${API}/professional-profile/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, userId: USER_ID }),
        });
        const data = await res.json();
        setProfile(data);
      }

      setShowLinksModal(false);
    } catch (err) {
      console.error("Error saving links:", err);
    }
  };

  const initials = "AP";

  return (
    <>
      <div style={{ ...styles.page, flexDirection: isMobile ? "column" : "row" }}>
        <Sidebar />

        <div style={styles.main}>
          <TopBar showLogo placeholder="uscar cursos, habilidades..." />

          {loading ? (
            <p style={{ color: "#9ca3af" }}>Cargando perfil...</p>
          ) : (
            <>
              {/* PROFILE HEADER */}
              <div style={styles.profileHeader}>
                <div style={styles.avatar}>{initials}</div>

                <div style={{ flex: 1 }}>
                  <h1 style={styles.name}>
                      {profile?.username ?? "Sin nombre"}
                  </h1>
                  <p style={styles.role}>
                    {profile?.headline ?? "Sin rol"}
                  </p>
                  <p style={styles.role}>
                    {profile?.summary ?? "Agrega una descripción de tu perfil"}
                  </p>
                  <p style={styles.meta}>
                    📍 {profile?.location ?? "Sin ubicación"} •{" "}
                    {profile?.yearsExperience != null
                      ? `${profile.yearsExperience} años de experiencia`
                      : "Sin experiencia cargada"}
                  </p>

                  <div style={{ marginTop: 10, maxWidth: 300 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                      <span>Perfil completado</span>
                      <span>{profile?.completionScore ?? 0}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1f2937", borderRadius: 999 }}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 999,
                          background: "#2563eb",
                          width: `${profile?.completionScore ?? 0}%`,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <span onClick={() => setShowProfileModal(true)} style={styles.editLink}>
                  Editar perfil →
                </span>
              </div>

              {/* GRID */}
              <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr" }}>
                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* COURSES */}
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3>📖 Continúa con tu aprendizaje</h3>
                      <span onClick={() => navigate("/learning")} style={styles.catalogLink}>
                        Ver mis cursos →
                      </span>
                    </div>
                    {courses.map((c, i) => (
                      <div key={i} style={styles.course}>
                        <div style={styles.courseTop}>
                          <span>{c.name}</span>
                          <span>{c.progress}%</span>
                        </div>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${c.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SKILLS */}
                  <div style={styles.card}>
                    <h3 style={{ marginBottom: 16 }}>🛡️ Habilidades Validadas</h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: 12,
                    }}>
                      {skills.map((s, i) => (
                        <div key={i} style={styles.skillCard}>
                          <div style={styles.skillBadge}>
                            <span style={{ fontSize: 22 }}>{s.icon}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{s.category}</p>
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
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* BADGES */}
                  <div style={styles.card}>
                    <h3>🏅 Insignias</h3>
                    <div style={styles.badges}>
                      {badges.map((b, i) => (
                        <span key={i} style={styles.badge}>{b}</span>
                      ))}
                    </div>
                  </div>

                  {/* LINKS */}
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3>Enlaces</h3>
                      <span onClick={() => setShowLinksModal(true)} style={styles.catalogLink}>
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
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Editar perfil</h2>
            <input
              style={styles.input}
              value={editProfile.headline}
              onChange={(e) => setEditProfile({ ...editProfile, headline: e.target.value })}
              placeholder="Headline (ej: HR Leader con 20 años de experiencia)"
            />
            <input
              style={styles.input}
              value={editProfile.location}
              onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
              placeholder="Ubicación (ej: Buenos Aires, Argentina)"
            />
            <input
              style={styles.input}
              type="number"
              value={editProfile.yearsExperience}
              onChange={(e) => setEditProfile({ ...editProfile, yearsExperience: e.target.value })}
              placeholder="Años de experiencia"
            />
            <textarea
              style={{ ...styles.input, height: 100, resize: "vertical" }}
              value={editProfile.summary}
              onChange={(e) => setEditProfile({ ...editProfile, summary: e.target.value })}
              placeholder="Resumen / Bio"
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowProfileModal(false)}>
                Cancelar
              </button>
              <button style={styles.saveBtn} onClick={saveProfile}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LINKS */}
      {showLinksModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Editar enlaces</h2>
            <input
              style={styles.input}
              value={editLinks.linkedinUrl}
              onChange={(e) => setEditLinks({ linkedinUrl: e.target.value })}
              placeholder="LinkedIn URL (ej: https://linkedin.com/in/usuario)"
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowLinksModal(false)}>
                Cancelar
              </button>
              <button style={styles.saveBtn} onClick={saveLinks}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui" },
  main: { flex: 1, padding: "30px", minWidth: 0 },
  profileHeader: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", flexWrap: "wrap" },
  avatar: { width: "70px", height: "70px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "20px" },
  name: { margin: 0, color: "#fff" },
  role: { color: "#9ca3af", marginTop: "5px" },
  meta: { fontSize: "13px", color: "#6b7280", marginTop: "5px" },
  editLink: { color: "#60a5fa", cursor: "pointer", fontSize: "14px" },
  grid: { display: "grid", gap: "20px" },
  card: { padding: "20px", border: "1px solid #1f2937", borderRadius: "16px", background: "rgba(255,255,255,0.03)" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  catalogLink: { color: "#60a5fa", cursor: "pointer" },
  course: { marginBottom: "16px" },
  courseTop: { display: "flex", justifyContent: "space-between" },
  progressBar: { height: "8px", background: "#1f2937", borderRadius: "999px" },
  progressFill: { height: "100%", background: "#22c55e" },
  skillCard: {display: "flex",alignItems: "center",gap: 12,padding: "12px 14px",background: "#0f172a",borderRadius: 12,border: "1px solid #1f2937",},
  skillBadge: {width: 44,height: 44,borderRadius: 10,background: "#1e293b",display: "flex",alignItems: "center",justifyContent: "center",border: "1px solid #374151",flexShrink: 0,},
  badges: { display: "flex", gap: "8px", flexWrap: "wrap" },
  badge: { padding: "6px 10px", background: "#1e293b", borderRadius: "999px", fontSize: "12px" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { width: "100%", maxWidth: "500px", background: "#111827", padding: "28px", borderRadius: "20px" },
  modalTitle: { marginBottom: "20px", color: "#fff" },
  input: { width: "100%", padding: "12px", marginBottom: "14px", borderRadius: "10px", border: "1px solid #374151", background: "#0f172a", color: "#fff", boxSizing: "border-box" },
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: "12px" },
  cancelBtn: { padding: "10px 16px", border: "1px solid #374151", background: "transparent", color: "#d1d5db", borderRadius: 8, cursor: "pointer" },
  saveBtn: { padding: "10px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
};