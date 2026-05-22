import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  {
    question: "¿En qué área tenés más experiencia?",
    options: ["Liderazgo", "RRHH", "Tecnología", "Administración"],
  },
  {
    question: "¿Qué herramientas digitales utilizás?",
    options: ["Excel / Google Sheets", "LinkedIn", "Canva", "Herramientas de IA"],
  },
  {
    question: "¿Qué estás buscando actualmente?",
    options: ["Nuevo empleo", "Reinvención profesional", "Networking", "Trabajo remoto"],
  },
  {
    question: "¿Qué te gustaría fortalecer?",
    options: ["Habilidades digitales", "Comunicación", "Marca personal", "Inteligencia Artificial"],
  },
];

// Mapeo de respuestas a skills con scores
const answerToSkills: Record<string, { name: string; score: number }[]> = {
  "Liderazgo":               [{ name: "Liderazgo", score: 85 }, { name: "Gestión del Cambio", score: 70 }],
  "RRHH":                    [{ name: "Gestión de Personas", score: 85 }, { name: "Comunicación", score: 75 }],
  "Tecnología":              [{ name: "Pensamiento Digital", score: 80 }, { name: "Herramientas IA", score: 60 }],
  "Administración":          [{ name: "Pensamiento Estratégico", score: 80 }, { name: "Productividad", score: 70 }],
  "Excel / Google Sheets":   [{ name: "Office / Google Suite", score: 75 }],
  "LinkedIn":                [{ name: "Marca Personal", score: 65 }],
  "Canva":                   [{ name: "Comunicación Visual", score: 60 }],
  "Herramientas de IA":      [{ name: "Herramientas IA", score: 55 }],
  "Nuevo empleo":            [{ name: "Marca Personal", score: 50 }],
  "Reinvención profesional": [{ name: "Gestión del Cambio", score: 55 }],
  "Networking":              [{ name: "Comunicación", score: 65 }],
  "Trabajo remoto":          [{ name: "Productividad", score: 60 }],
  "Habilidades digitales":   [{ name: "Herramientas IA", score: 40 }],
  "Comunicación":            [{ name: "Comunicación", score: 45 }],
  "Marca personal":          [{ name: "Marca Personal", score: 40 }],
  "Inteligencia Artificial": [{ name: "Herramientas IA", score: 35 }],
};

export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(Array(steps.length).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const userName: string = location.state?.name ?? "";

  const handleSelect = (option: string) => {
    const updated = [...selected];
    updated[step] = option;
    setSelected(updated);
  };

  const handleSubmit = () => {
    // Construir skills desde las respuestas
    const skillMap: Record<string, number[]> = {};
    selected.forEach((answer) => {
      const mapped = answerToSkills[answer] ?? [];
      mapped.forEach(({ name, score }) => {
        if (!skillMap[name]) skillMap[name] = [];
        skillMap[name].push(score);
      });
    });

    const skills = Object.entries(skillMap).map(([name, scores]) => ({
      name,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    navigate("/results", { state: { skills, name: userName, answers: selected } });
  };

  const currentStep = steps[step];
  const canContinue = selected[step] !== "";

  return (
    <div style={styles.page}>
      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.logo}>ReConecta45</div>
        {userName && (
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
            Hola, <strong style={{ color: "#fff" }}>{userName}</strong> 👋
          </p>
        )}
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Descubramos tu perfil profesional</h1>
        <p style={styles.subtitle}>
          Queremos entender tu experiencia, habilidades y objetivos
          para construir una ruta personalizada para vos.
        </p>
      </section>

      {/* CARD */}
      <section style={styles.card}>
        {/* PROGRESS */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <p style={styles.progressText}>Paso {step + 1} de {steps.length}</p>
        </div>

        <h2 style={styles.question}>{currentStep.question}</h2>

        <div style={styles.options}>
          {currentStep.options.map((opt) => (
            <button
              key={opt}
              style={{
                ...styles.option,
                ...(selected[step] === opt ? styles.optionSelected : {}),
              }}
              onClick={() => handleSelect(opt)}
            >
              {selected[step] === opt && <span style={{ marginRight: 8 }}>✓</span>}
              {opt}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          {step > 0 ? (
            <button style={styles.secondaryButton} onClick={() => setStep(step - 1)}>
              Volver
            </button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button
              style={{ ...styles.primaryButton, opacity: canContinue ? 1 : 0.5 }}
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
            >
              Continuar
            </button>
          ) : (
            <button
              style={{ ...styles.primaryButton, opacity: canContinue ? 1 : 0.5 }}
              disabled={!canContinue}
              onClick={handleSubmit}
            >
              Ver resultado
            </button>
          )}
        </div>
      </section>

      <div style={styles.footer}>
        ReConecta45 © 2026 — Revalorizando talento profesional
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", padding: "24px", color: "#e5e7eb", fontFamily: "system-ui, sans-serif", background: "#0b0f19" },
  nav: { maxWidth: "1000px", margin: "0 auto 80px auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontWeight: "700", fontSize: "18px", color: "#fff" },
  hero: { maxWidth: "700px", margin: "0 auto 60px auto", textAlign: "center" },
  title: { fontSize: "48px", fontWeight: "700", color: "#fff", marginBottom: "18px" },
  subtitle: { fontSize: "18px", color: "#9ca3af", lineHeight: "1.7" },
  card: { maxWidth: "720px", margin: "0 auto", padding: "32px", borderRadius: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937" },
  progressWrapper: { marginBottom: "40px" },
  progressBar: { width: "100%", height: "8px", background: "#1f2937", borderRadius: "999px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#2563eb", borderRadius: "999px", transition: "width 0.3s ease" },
  progressText: { marginTop: "10px", fontSize: "14px", color: "#9ca3af" },
  question: { fontSize: "28px", color: "#fff", marginBottom: "24px" },
  options: { display: "flex", flexDirection: "column", gap: "14px" },
  option: {
    padding: "18px", borderRadius: "14px", border: "1px solid #374151",
    background: "rgba(255,255,255,0.03)", color: "#fff", cursor: "pointer",
    textAlign: "left", fontSize: "15px", transition: "all 0.15s",
  },
  optionSelected: {
    border: "1px solid #2563eb", background: "rgba(37,99,235,0.12)", color: "#60a5fa",
  },
  actions: { marginTop: "40px", display: "flex", justifyContent: "space-between" },
  primaryButton: { background: "#2563eb", border: "none", color: "white", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  secondaryButton: { background: "transparent", border: "1px solid #374151", color: "white", padding: "12px 18px", borderRadius: "10px", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "80px", fontSize: "12px", color: "#9ca3af" },
};