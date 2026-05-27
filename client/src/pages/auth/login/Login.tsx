import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;
type UserType = "profesional" | "empresa";

export default function Login() {
  const [userType, setUserType] = useState<UserType>("profesional");
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useApp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleTabChange = (type: UserType) => {
    setUserType(type);
    setServerError(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setServerError(null);
      await login(data.email, data.password, userType);
      navigate(userType === "empresa" ? "/companyprofile" : "/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Iniciar sesión</h1>
      <p style={styles.subtitle}>Bienvenido/a de vuelta</p>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => handleTabChange("profesional")}
          style={{
            ...styles.tab,
            ...(userType === "profesional" ? styles.tabActive : styles.tabInactive),
          }}
        >
          👤 Profesional
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("empresa")}
          style={{
            ...styles.tab,
            ...(userType === "empresa" ? styles.tabActive : styles.tabInactive),
          }}
        >
          🏢 Empresa
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>✉️</span>
          <input
            placeholder={userType === "empresa" ? "Email corporativo" : "Correo electrónico"}
            {...register("email")}
            style={styles.input}
          />
        </div>
        {errors.email && <p style={styles.error}>{errors.email.message}</p>}

        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            style={styles.input}
          />
        </div>
        {errors.password && <p style={styles.error}>{errors.password.message}</p>}

        {serverError && <p style={styles.error}>{serverError}</p>}

        <div style={styles.forgotRow}>
          <Link to="/forgot-password" style={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>


        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : `Entrar como ${userType === "empresa" ? "Empresa" : "Profesional"}`}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ color: "#9ca3af", fontSize: 13 }}>o</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        <a
          href="http://localhost:3008/auth/google"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, textDecoration: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Continuar con Google
        </a>

        <p style={styles.footer}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={styles.link}>
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", flexDirection: "column" },
  title: { textAlign: "center", fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "6px" },
  subtitle: { textAlign: "center", fontSize: "14px", color: "#6b7280", marginBottom: "20px" },
  tabs: { display: "flex", borderRadius: "10px", background: "#f3f4f6", padding: "4px", marginBottom: "24px", gap: "4px" },
  tab: { flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#111827", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  tabInactive: { background: "transparent", color: "#9ca3af" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  inputWrapper: { display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0 10px", background: "white" },
  icon: { fontSize: "14px", marginRight: "8px", color: "#9ca3af" },
  input: { width: "100%", padding: "12px 0", border: "none", outline: "none", fontSize: "14px" },
  forgotRow: { display: "flex", justifyContent: "flex-end", marginTop: "-4px" },
  forgot: { fontSize: "13px", color: "#2563eb", textDecoration: "none" },
  button: { padding: "12px", borderRadius: "8px", border: "none", background: "#0f172a", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "14px", marginTop: "4px", opacity: 1 },
  footer: { fontSize: "13px", color: "#6b7280", textAlign: "center", marginTop: "8px" },
  link: { color: "#2563eb", fontWeight: "500", textDecoration: "none" },
  error: { color: "#dc2626", fontSize: "12px", marginTop: "-6px", marginLeft: "4px" },
};
