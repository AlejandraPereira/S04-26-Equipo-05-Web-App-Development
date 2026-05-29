import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Mínimo 8 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    if (!token) { setError("Token inválido. Solicitá un nuevo enlace."); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "El enlace expiró o es inválido. Solicitá uno nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ margin: "0 0 12px", color: "#111827" }}>Contraseña actualizada</h2>
            <p style={{ color: "#6b7280" }}>Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 8px", color: "#111827" }}>Nueva contraseña</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
              Ingresá tu nueva contraseña.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="password"
                placeholder="Nueva contraseña (mín. 8 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
              />
              {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ padding: 12, borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
              <Link to="/forgot-password" style={{ textAlign: "center", fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
                Solicitar un nuevo enlace
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
