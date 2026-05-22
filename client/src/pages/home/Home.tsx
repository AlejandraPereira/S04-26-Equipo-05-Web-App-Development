import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

export default function Home() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>

      {/* NAV */}
      <div className={styles.nav}>
        <div className={styles.logo}>ReConecta45</div>
        <button className={styles.navButton} onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Reinventa tu carrera profesional</h1>
        <p className={styles.subtitle}>
          Una plataforma para profesionales +45 que quieren actualizar su perfil,
          desarrollar nuevas habilidades y reconectarse con el mercado laboral.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={() => navigate("/register")}>
            Empezar gratis
          </button>
          <button className={styles.secondaryButton} onClick={scrollToHowItWorks}>
            Ver cómo funciona
          </button>
        </div>
      </section>

      {/* TRUST */}
      <p className={styles.trust}>
        Diseñado para profesionales con experiencia que buscan un nuevo comienzo
      </p>

      {/* FEATURES */}
      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.icon}>🧠</div>
          <h3>Diagnóstico inteligente</h3>
          <p>Entiende tu perfil profesional actual y oportunidades de mejora.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>📚</div>
          <h3>Rutas de aprendizaje</h3>
          <p>Contenido personalizado según tu experiencia y objetivos.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>📈</div>
          <h3>CV vivo</h3>
          <p>Tu perfil evoluciona con cada habilidad que desarrollas.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>💼</div>
          <h3>Marketplace</h3>
          <p>Conexión directa con empresas que buscan tu experiencia.</p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.simpleSection}>
        <h2>El problema no es tu experiencia</h2>
        <p>
          Es la desconexión entre tu trayectoria, las nuevas habilidades del mercado
          y las oportunidades disponibles hoy.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={styles.how}>
        <h2 className={styles.howTitle}>Cómo funciona</h2>
        <p className={styles.howSubtitle}>
          Un proceso simple en 3 pasos para transformar tu perfil profesional
        </p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.number}>1</div>
            <div>
              <h3 className={styles.stepTitle}>Te registras</h3>
              <p className={styles.stepText}>Creas tu cuenta en menos de 1 minuto.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.number}>2</div>
            <div>
              <h3 className={styles.stepTitle}>Diagnóstico + Ruta</h3>
              <p className={styles.stepText}>Evaluamos tu perfil y te damos un plan personalizado.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.number}>3</div>
            <div>
              <h3 className={styles.stepTitle}>Aprendes y avanzas</h3>
              <p className={styles.stepText}>Desarrollas habilidades y construís tu CV vivo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.cta}>
        <h2>Empieza tu próximo capítulo</h2>
        <p>Sin CVs complejos. Sin procesos largos. Solo tu experiencia + nuevas oportunidades.</p>
        <button className={styles.primaryButton} onClick={() => navigate("/register")}>
          Crear cuenta
        </button>
      </section>

      {/* FOOTER */}
      <div className={styles.footer}>
        ReConecta45 © 2026 — Revalorizando talento profesional
      </div>
    </div>
  );
}