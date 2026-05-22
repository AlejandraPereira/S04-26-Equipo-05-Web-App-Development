import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../../../assets/icons8-logo-de-google-48.png";
import styles from "./Register.module.css";

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
      navigate("/diagnostic", { state: { name: profForm.name, email: profForm.email } });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear cuenta</h1>
      <p className={styles.subtitle}>Completá los campos para registrarte</p>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => handleTabChange("profesional")}
          className={`${styles.tab} ${userType === "profesional" ? styles.tabActive : ""}`}
        >
          👤 Profesional
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("empresa")}
          className={`${styles.tab} ${userType === "empresa" ? styles.tabActive : ""}`}
        >
          🏢 Empresa
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* PROFESIONAL */}
        {userType === "profesional" && (
          <>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>👤</span>
              <input name="name" placeholder="Nombre completo" value={profForm.name} onChange={e => setProfForm({ ...profForm, name: e.target.value })} className={styles.input} />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>✉️</span>
              <input name="email" placeholder="Correo electrónico" value={profForm.email} onChange={e => setProfForm({ ...profForm, email: e.target.value })} className={styles.input} />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>🔒</span>
              <input name="password" type="password" placeholder="Contraseña" value={profForm.password} onChange={e => setProfForm({ ...profForm, password: e.target.value })} className={styles.input} />
            </div>
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>🔒</span>
              <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={profForm.confirmPassword} onChange={e => setProfForm({ ...profForm, confirmPassword: e.target.value })} className={styles.input} />
            </div>
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          </>
        )}

        {/* EMPRESA */}
        {userType === "empresa" && (
          <>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>🏢</span>
              <input name="companyName" placeholder="Nombre de la empresa" value={empForm.companyName} onChange={e => setEmpForm({ ...empForm, companyName: e.target.value })} className={styles.input} />
            </div>
            {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>✉️</span>
              <input name="email" placeholder="Email corporativo" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} className={styles.input} />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>🔒</span>
              <input name="password" type="password" placeholder="Contraseña" value={empForm.password} onChange={e => setEmpForm({ ...empForm, password: e.target.value })} className={styles.input} />
            </div>
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <div className={styles.inputWrapper}>
              <span className={styles.icon}>🔒</span>
              <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={empForm.confirmPassword} onChange={e => setEmpForm({ ...empForm, confirmPassword: e.target.value })} className={styles.input} />
            </div>
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

            <div className={styles.infoBanner}>
              <span style={{ fontSize: 14 }}>ℹ️</span>
              <p className={styles.infoText}>Con una cuenta empresa podés publicar ofertas laborales y acceder a perfiles de profesionales +45.</p>
            </div>
          </>
        )}

        {userType === "profesional" && (
          <>
            <div className={styles.divider}>
              <span className={styles.line} />
              <span className={styles.dividerText}>o continuá con</span>
              <span className={styles.line} />
            </div>
            <button type="button" className={styles.googleButton}>
              <img src={googleIcon} alt="Google" className={styles.googleIconImg} />
              Continuar con Google
            </button>
          </>
        )}

        <button type="submit" className={styles.button}>
          {userType === "empresa" ? "Crear cuenta empresa" : "Registrarse"}
        </button>

        <p className={styles.footer}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className={styles.link}>Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}