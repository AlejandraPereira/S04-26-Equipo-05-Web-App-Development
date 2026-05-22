import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;
type UserType = "profesional" | "empresa";

export default function Login() {
  const [userType, setUserType] = useState<UserType>("profesional");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleTabChange = (type: UserType) => {
    setUserType(type);
    reset();
  };

  const onSubmit = (data: FormData) => {
    console.log("LOGIN:", { userType, ...data });
    // TODO: POST /auth/login con { userType, email, password }
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

        <div style={styles.forgotRow}>
          <Link to="/forgot-password" style={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" style={styles.button}>
          Entrar como {userType === "empresa" ? "Empresa" : "Profesional"}
        </button>

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
  container: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "6px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  tabs: {
    display: "flex",
    borderRadius: "10px",
    background: "#f3f4f6",
    padding: "4px",
    marginBottom: "24px",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#fff",
    color: "#111827",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  tabInactive: {
    background: "transparent",
    color: "#9ca3af",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "0 10px",
    background: "white",
  },
  icon: {
    fontSize: "14px",
    marginRight: "8px",
    color: "#9ca3af",
  },
  input: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-4px",
  },
  forgot: {
    fontSize: "13px",
    color: "#2563eb",
    textDecoration: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "4px",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
    marginTop: "8px",
  },
  link: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
  error: {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "-6px",
    marginLeft: "4px",
  },
};