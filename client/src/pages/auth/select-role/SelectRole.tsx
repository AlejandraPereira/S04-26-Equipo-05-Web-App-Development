import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useApp } from "../../../context/AppContext";

export default function SelectRole() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [selected, setSelected] = useState<"profesional" | "empresa" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem("access_token", token);
      const result = await api.patch<{ token: string; user: any }>("/auth/role", { role: selected });
      localStorage.setItem("access_token", result.token);
      setUser(result.user);
      navigate(selected === "empresa" ? "/companyprofile" : "/dashboard");
    } catch {
      setError("Error al guardar tu selección. Intentá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f19", color: "#fff" }}>
      <div style={{ maxWidth: 500, width: "100%", padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>¡Bienvenido/a!</h1>
        <p style={{ color: "#9ca3af", marginBottom: 40 }}>¿Cómo vas a usar ReConecta45?</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => setSelected("profesional")}
            style={{
              padding: 28, borderRadius: 20, cursor: "pointer", transition: "0.2s",
              border: `2px solid ${selected === "profesional" ? "#2563eb" : "#1f2937"}`,
              background: selected === "profesional" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.03)",
              color: "#fff", textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Soy Profesional</div>
            <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>
              Busco oportunidades laborales y quiero reconectar con el mercado
            </div>
          </button>

          <button
            onClick={() => setSelected("empresa")}
            style={{
              padding: 28, borderRadius: 20, cursor: "pointer", transition: "0.2s",
              border: `2px solid ${selected === "empresa" ? "#2563eb" : "#1f2937"}`,
              background: selected === "empresa" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.03)",
              color: "#fff", textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Soy Empresa</div>
            <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>
              Busco contratar profesionales con experiencia +45
            </div>
          </button>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</p>}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          style={{
            width: "100%", padding: 14, borderRadius: 12, border: "none",
            background: selected ? "#2563eb" : "#1f2937",
            color: selected ? "#fff" : "#6b7280",
            fontWeight: 700, fontSize: 16, cursor: selected ? "pointer" : "default",
            transition: "0.2s",
          }}
        >
          {loading ? "Guardando..." : "Continuar →"}
        </button>
      </div>
    </div>
  );
}
