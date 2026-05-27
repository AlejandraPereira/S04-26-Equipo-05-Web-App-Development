import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Email inválido"); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Error al procesar la solicitud. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <Link to="/login" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          ← Volver al inicio de sesión
        </Link>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ margin: "0 0 12px", color: "#111827" }}>Email enviado</h2>
            <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
              Si tu email está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 16 }}>
              No olvides revisar la carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 8px", color: "#111827" }}>¿Olvidaste tu contraseña?</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
              Ingresá tu email y te enviaremos un enlace para restablecerla.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
              />
              {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ padding: 12, borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
