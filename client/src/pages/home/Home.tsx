import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.page}>

      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.logo}>ReConecta45</div>

        <button
          style={styles.navButton}
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Reinventa tu carrera profesional
        </h1>

        <p style={styles.subtitle}>
          Una plataforma para profesionales +45 que quieren actualizar su perfil,
          desarrollar nuevas habilidades y reconectarse con el mercado laboral.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/register")}
          >
            Empezar gratis
          </button>

          <button
            style={styles.secondaryButton}
            onClick={scrollToHowItWorks}
          >
            Ver cómo funciona
          </button>
        </div>
      </section>

      {/* TRUST */}
      <p style={styles.trust}>
        Diseñado para profesionales con experiencia que buscan un nuevo comienzo
      </p>

      {/* FEATURES */}
      <section style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon}>🧠</div>
          <h3>Diagnóstico inteligente</h3>
          <p>Entiende tu perfil profesional actual y oportunidades de mejora.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>📚</div>
          <h3>Rutas de aprendizaje</h3>
          <p>Contenido personalizado según tu experiencia y objetivos.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>📈</div>
          <h3>CV vivo</h3>
          <p>Tu perfil evoluciona con cada habilidad que desarrollas.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>💼</div>
          <h3>Marketplace</h3>
          <p>Conexión directa con empresas que buscan tu experiencia.</p>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.simpleSection}>
        <h2>El problema no es tu experiencia</h2>
        <p>
          Es la desconexión entre tu trayectoria, las nuevas habilidades del mercado
          y las oportunidades disponibles hoy.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.how}>

        <h2 style={styles.howTitle}>Cómo funciona</h2>

        <p style={styles.howSubtitle}>
          Un proceso simple en 3 pasos para transformar tu perfil profesional
        </p>

        <div style={styles.steps}>

          <div style={styles.step}>
            <div style={styles.number}>1</div>
            <div>
              <h3 style={styles.stepTitle}>Te registras</h3>
              <p style={styles.stepText}>Creas tu cuenta en menos de 1 minuto.</p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.number}>2</div>
            <div>
              <h3 style={styles.stepTitle}>Diagnóstico + Ruta</h3>
              <p style={styles.stepText}>
                Evaluamos tu perfil y te damos un plan personalizado.
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.number}>3</div>
            <div>
              <h3 style={styles.stepTitle}>Aprendes y avanzas</h3>
              <p style={styles.stepText}>
                Desarrollas habilidades y construyes tu CV vivo.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section style={styles.cta}>
        <h2>Empieza tu próximo capítulo</h2>
        <p>
          Sin CVs complejos. Sin procesos largos. Solo tu experiencia + nuevas oportunidades.
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => navigate("/register")}
        >
          Crear cuenta
        </button>
      </section>

      {/* FOOTER */}
      <div style={styles.footer}>
        ReConecta45 © 2026 — Revalorizando talento profesional
      </div>

    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    color: "#e5e7eb",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1000px",
    margin: "0 auto 60px auto",
  },

  logo: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#fff",
  },

  navButton: {
    background: "transparent",
    border: "1px solid #374151",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  hero: {
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },

  title: {
    fontSize: "44px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#9ca3af",
    lineHeight: "1.6",
  },

  actions: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },

  primaryButton: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryButton: {
    background: "transparent",
    border: "1px solid #374151",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  trust: {
    textAlign: "center",
    marginTop: "50px",
    color: "#6b7280",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    maxWidth: "1000px",
    margin: "80px auto",
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #1f2937",
  },

  icon: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  simpleSection: {
    maxWidth: "700px",
    margin: "80px auto",
    textAlign: "center",
  },

  how: {
    maxWidth: "900px",
    margin: "100px auto",
    padding: "0 20px",
  },

  howTitle: {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
    color: "#fff",
  },

  howSubtitle: {
    textAlign: "center",
    color: "#9ca3af",
    marginBottom: "40px",
  },

  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  step: {
    display: "flex",
    gap: "16px",
    padding: "18px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #1f2937",
  },

  stepTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px",
  },

  stepText: {
    fontSize: "14px",
    color: "#9ca3af",
  },

  number: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    flexShrink: 0,
  },

  cta: {
    maxWidth: "700px",
    margin: "100px auto",
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    marginTop: "80px",
    fontSize: "12px",
    color: "#6b7280",
  },
};