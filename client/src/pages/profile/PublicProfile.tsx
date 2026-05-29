import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";

type WorkExp = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

type PublicProfileData = {
  userId: string;
  fullName: string;
  username: string | null;
  headline: string | null;
  summary: string | null;
  location: string | null;
  yearsExperience: number | null;
  linkedinUrl: string | null;
  completionScore: number;
  workExperiences: WorkExp[];
};

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    api.get<PublicProfileData>(`/professional-profile/public/${userId}`)
      .then(setProfile)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontFamily: "system-ui" }}>
        Cargando perfil...
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontFamily: "system-ui", gap: 16 }}>
        <p style={{ fontSize: 20 }}>Perfil no encontrado</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}>Ir al inicio</button>
      </div>
    );
  }

  const displayName = profile.username ?? profile.fullName;
  const initials = displayName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui", padding: "24px 16px", boxSizing: "border-box" }}>
      {/* HEADER NAV */}
      <div style={{ maxWidth: 760, margin: "0 auto 40px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>ReConecta45</div>
        <button
          onClick={() => navigate("/login")}
          style={{ padding: "8px 20px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Iniciar sesión
        </button>
      </div>

      {/* PROFILE CARD */}
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* HERO */}
        <div style={{ padding: "32px", borderRadius: 20, border: "1px solid #1f2937", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, flexShrink: 0, color: "#fff" }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 26, color: "#fff" }}>{displayName}</h1>
              {profile.headline && <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: 15 }}>{profile.headline}</p>}
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
                {profile.location && `📍 ${profile.location}`}
                {profile.yearsExperience != null && ` · ${profile.yearsExperience} años de experiencia`}
              </p>
            </div>
          </div>

          {profile.summary && (
            <p style={{ marginTop: 20, lineHeight: 1.7, color: "#d1d5db", fontSize: 14, borderTop: "1px solid #1f2937", paddingTop: 16 }}>
              {profile.summary}
            </p>
          )}

          {/* Completion bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              <span>Perfil completado</span>
              <span>{profile.completionScore}%</span>
            </div>
            <div style={{ height: 4, background: "#1f2937", borderRadius: 999 }}>
              <div style={{ height: "100%", borderRadius: 999, background: "#2563eb", width: `${profile.completionScore}%` }} />
            </div>
          </div>

          {/* Links */}
          {profile.linkedinUrl && (
            <div style={{ marginTop: 16 }}>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: 14 }}>
                🔗 LinkedIn →
              </a>
            </div>
          )}
        </div>

        {/* EXPERIENCIA LABORAL */}
        {profile.workExperiences.length > 0 && (
          <div style={{ padding: "24px", borderRadius: 20, border: "1px solid #1f2937", background: "rgba(255,255,255,0.03)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#fff" }}>💼 Experiencia laboral</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {profile.workExperiences.map((exp) => (
                <div key={exp.id} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #1f2937", background: "#0f172a" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>{exp.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#60a5fa" }}>{exp.company}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                    {exp.startDate} — {exp.endDate ?? "Actualidad"}
                  </p>
                  {exp.description && (
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: "24px 32px", borderRadius: 20, border: "1px solid rgba(37,99,235,0.3)", background: "rgba(37,99,235,0.06)", textAlign: "center" }}>
          <p style={{ margin: "0 0 16px", color: "#9ca3af", fontSize: 14 }}>
            ¿Sos una empresa buscando talento +45?
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "12px 28px", borderRadius: 12, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15 }}
          >
            Accedé a ReConecta45 →
          </button>
        </div>
      </div>
    </div>
  );
}
