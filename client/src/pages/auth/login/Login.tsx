import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <p className={styles.subtitle}>Bienvenido/a de vuelta</p>

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

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}>✉️</span>
          <input
            placeholder={userType === "empresa" ? "Email corporativo" : "Correo electrónico"}
            {...register("email")}
            className={styles.input}
          />
        </div>
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className={styles.input}
          />
        </div>
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" className={styles.button}>
          Entrar como {userType === "empresa" ? "Empresa" : "Profesional"}
        </button>

        <p className={styles.footer}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" className={styles.link}>Registrate</Link>
        </p>
      </form>
    </div>
  );
}