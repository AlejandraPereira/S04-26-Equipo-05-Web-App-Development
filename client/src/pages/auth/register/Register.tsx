import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../../../assets/icons8-logo-de-google-48.png";

type UserType = "profesional" | "empresa";

interface ProfesionalForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface EmpresaForm {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("profesional");

  const [profForm, setProfForm] = useState<ProfesionalForm>({
    name: "", email: "", password: "", confirmPassword: "",
  });

  const [empForm, setEmpForm] = useState<EmpresaForm>({
    companyName: "", email: "", password: "", confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTabChange = (type: UserType) => {
    setUserType(type);
    setErrors({});
  };

  const validateProf = () => {
    const e: Record<string, string> = {};
    if (!profForm.name.trim()) e.name = "El nombre es requerido";
    if (!profForm.email.includes("@")) e.email = "Email inválido";
    if (profForm.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (profForm.password !== profForm.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const validateEmp = () => {
    const e: Record<string, string> = {};
    if (!empForm.companyName.trim()) e.companyName = "El nombre de la empresa es requerido";
    if (!empForm.email.includes("@")) e.email = "Email inválido";
    if (empForm.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (empForm.password !== empForm.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = userType === "profesional" ? validateProf() : validateEmp();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    if (userType === "profesional") {
      // TODO: POST /auth/register { userType: "profesional", ...profForm }
      // Por ahora navegamos directo al diagnóstico pasando el nombre
      navigate("/diagnostic", { state: { name: profForm.name, email: profForm.email } });
    } else {
      // TODO: POST /auth/register { userType: "empresa", ...empForm }
      navigate("/dashboard");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crear cuenta</h1>
      <p style={styles.subtitle}>Completá los campos para registrarte</p>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => handleTabChange("profesional")}
          style={{ ...styles.tab, ...(userType === "profesional" ? styles.tabActive : styles.tabInactive) }}
        >
          👤 Profesional
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("empresa")}
          style={{ ...styles.tab, ...(userType === "empresa" ? styles.tabActive : styles.tabInactive) }}
        >
          🏢 Empresa
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* PROFESIONAL */}
        {userType === "profesional" && (
          <>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>👤</span>
              <input
                name="name"
                placeholder="Nombre completo"
                value={profForm.name}
                onChange={e => setProfForm({ ...profForm, name: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.name && <p style={styles.error}>{errors.name}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>✉️</span>
              <input
                name="email"
                placeholder="Correo electrónico"
                value={profForm.email}
                onChange={e => setProfForm({ ...profForm, email: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.email && <p style={styles.error}>{errors.email}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={profForm.password}
                onChange={e => setProfForm({ ...profForm, password: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={profForm.confirmPassword}
                onChange={e => setProfForm({ ...profForm, confirmPassword: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
          </>
        )}

        {/* EMPRESA */}
        {userType === "empresa" && (
          <>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🏢</span>
              <input
                name="companyName"
                placeholder="Nombre de la empresa"
                value={empForm.companyName}
                onChange={e => setEmpForm({ ...empForm, companyName: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.companyName && <p style={styles.error}>{errors.companyName}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>✉️</span>
              <input
                name="email"
                placeholder="Email corporativo"
                value={empForm.email}
                onChange={e => setEmpForm({ ...empForm, email: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.email && <p style={styles.error}>{errors.email}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={empForm.password}
                onChange={e => setEmpForm({ ...empForm, password: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={empForm.confirmPassword}
                onChange={e => setEmpForm({ ...empForm, confirmPassword: e.target.value })}
                style={styles.input}
              />
            </div>
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}

            <div style={styles.infoBanner}>
              <span style={{ fontSize: 14 }}>ℹ️</span>
              <p style={styles.infoText}>
                Con una cuenta empresa podés publicar ofertas laborales y acceder a perfiles de profesionales +45.
              </p>
            </div>
          </>
        )}

        {userType === "profesional" && (
          <>
            <div style={styles.divider}>
              <span style={styles.line} />
              <span style={styles.dividerText}>o continuá con</span>
              <span style={styles.line} />
            </div>
            <button type="button" style={styles.googleButton}>
              <img src={googleIcon} alt="Google" style={styles.googleIconImg} />
              Continuar con Google
            </button>
          </>
        )}

        <button type="submit" style={styles.button}>
          {userType === "empresa" ? "Crear cuenta empresa" : "Registrarse"}
        </button>

        <p style={styles.footer}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={styles.link}>Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column" },
  title: { textAlign: "center", fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "6px" },
  subtitle: { textAlign: "center", fontSize: "14px", color: "#6b7280", marginBottom: "20px" },
  tabs: { display: "flex", borderRadius: "10px", background: "#f3f4f6", padding: "4px", marginBottom: "24px", gap: "4px" },
  tab: { flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#111827", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  tabInactive: { background: "transparent", color: "#9ca3af" },
  form: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" },
  inputWrapper: { display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0 10px", background: "white" },
  icon: { fontSize: "14px", marginRight: "8px", color: "#9ca3af" },
  input: { width: "100%", padding: "12px 0", border: "none", outline: "none", fontSize: "14px" },
  infoBanner: { display: "flex", alignItems: "flex-start", gap: "8px", padding: "12px 14px", borderRadius: "8px", background: "#eff6ff", border: "1px solid #bfdbfe" },
  infoText: { margin: 0, fontSize: "13px", color: "#1d4ed8", lineHeight: 1.5 },
  divider: { display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" },
  line: { flex: 1, height: "1px", background: "#e5e7eb" },
  dividerText: { fontSize: "12px", color: "#9ca3af" },
  googleButton: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: "500", fontSize: "14px" },
  button: { padding: "12px", borderRadius: "8px", border: "none", background: "#0f172a", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "14px", marginTop: "4px" },
  footer: { fontSize: "13px", color: "#6b7280", textAlign: "center", marginTop: "8px" },
  link: { color: "#2563eb", fontWeight: "500", textDecoration: "none" },
  error: { color: "#dc2626", fontSize: "12px", marginTop: "-6px", marginLeft: "4px" },
  googleIconImg: { width: "18px", height: "18px", objectFit: "contain" },
};