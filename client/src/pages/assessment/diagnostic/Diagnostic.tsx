import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./diagnostic.module.css";

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
    <div className={styles.page}>
      {/* NAV */}
      <div className={styles.nav}>
        <div className={styles.logo}>ReConecta45</div>
        {userName && (
          <p className={styles.navUser}>
            Hola, <strong>{userName}</strong> 👋
          </p>
        )}
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Descubramos tu perfil profesional</h1>
        <p className={styles.subtitle}>
          Queremos entender tu experiencia, habilidades y objetivos
          para construir una ruta personalizada para vos.
        </p>
      </section>

      {/* CARD */}
      <section className={styles.card}>
        {/* PROGRESS */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className={styles.progressText}>Paso {step + 1} de {steps.length}</p>
        </div>

        <h2 className={styles.question}>{currentStep.question}</h2>

        <div className={styles.options}>
          {currentStep.options.map((opt) => (
            <button
              key={opt}
              className={`${styles.option} ${selected[step] === opt ? styles.selected : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {selected[step] === opt && <span className={styles.checkmark}>✓</span>}
              {opt}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          {step > 0 ? (
            <button className={styles.secondaryButton} onClick={() => setStep(step - 1)}>
              Volver
            </button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button
              className={styles.primaryButton}
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
            >
              Continuar
            </button>
          ) : (
            <button
              className={styles.primaryButton}
              disabled={!canContinue}
              onClick={handleSubmit}
            >
              Ver resultado
            </button>
          )}
        </div>
      </section>

      <div className={styles.footer}>
        ReConecta45 © 2026 — Revalorizando talento profesional
      </div>
    </div>
  );
}