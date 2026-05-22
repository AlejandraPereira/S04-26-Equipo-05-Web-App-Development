import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

// ─── Types ────────────────────────────────────────────────────────────────────
type QuestionType = "multiple" | "truefalse";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options: Option[];
  correctId: string;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  subtitle: string;
  courseTitle: string;
  moduleTitle: string;
  isFinal: boolean;
  xpReward: number;
  passingScore: number; // percentage 0–100
  questions: Question[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
// Replace with API call: GET /quizzes/:quizId
const quizMock: QuizData = {
  id: "quiz-mod2-mid",
  title: "Quiz: Presencia Digital",
  subtitle: "Módulo 2 · Verificación intermedia",
  courseTitle: "Marca Personal para Profesionales +45",
  moduleTitle: "Módulo 2: Presencia Digital",
  isFinal: false,
  xpReward: 80,
  passingScore: 70,
  questions: [
    {
      id: 1,
      type: "multiple",
      question: "¿Cuál es el elemento MÁS importante para que un recruiter te encuentre en LinkedIn?",
      options: [
        { id: "a", text: "Tener más de 500 conexiones" },
        { id: "b", text: "Usar palabras clave de tu industria en el titular y resumen" },
        { id: "c", text: "Publicar contenido todos los días" },
        { id: "d", text: "Tener foto de perfil profesional" },
      ],
      correctId: "b",
      explanation: "LinkedIn funciona como un buscador. Las keywords en el titular y la sección Acerca de son los campos con mayor peso en el algoritmo de búsqueda de recruiters.",
    },
    {
      id: 2,
      type: "truefalse",
      question: "El titular de LinkedIn debe mostrar solo tu último cargo y empresa.",
      options: [
        { id: "true", text: "Verdadero" },
        { id: "false", text: "Falso" },
      ],
      correctId: "false",
      explanation: "El titular es tu propuesta de valor. Debe comunicar quién sos, a quién ayudás y qué problema resolvés, no solo un cargo que ya quedó en el pasado.",
    },
    {
      id: 3,
      type: "multiple",
      question: "¿Cuál de estas opciones describe mejor la sección 'Acerca de' de LinkedIn?",
      options: [
        { id: "a", text: "Un resumen del CV en tercera persona" },
        { id: "b", text: "Una lista de logros cuantificables" },
        { id: "c", text: "Una historia en primera persona con fortalezas, logros y objetivos" },
        { id: "d", text: "Un listado de habilidades técnicas" },
      ],
      correctId: "c",
      explanation: "La sección Acerca de es tu espacio narrativo. En primera persona, cercana y auténtica, conecta mejor con los recruiters y humaniza tu perfil.",
    },
    {
      id: 4,
      type: "truefalse",
      question: "El banner de LinkedIn es un espacio de marca personal que podés usar para comunicar tu área de expertise.",
      options: [
        { id: "true", text: "Verdadero" },
        { id: "false", text: "Falso" },
      ],
      correctId: "true",
      explanation: "Exacto. El banner es el primer elemento visual que ven los visitantes de tu perfil. Usarlo con intención — sector, propuesta de valor, frase clave — refuerza tu identidad profesional.",
    },
    {
      id: 5,
      type: "multiple",
      question: "¿Qué significa tener un perfil de LinkedIn con 'All-Star Status'?",
      options: [
        { id: "a", text: "Tenés más de 1000 seguidores" },
        { id: "b", text: "Completaste todas las secciones clave del perfil" },
        { id: "c", text: "Publicaste más de 50 artículos" },
        { id: "d", text: "LinkedIn te verificó como experto en tu industria" },
      ],
      correctId: "b",
      explanation: "All-Star es el nivel máximo de completitud del perfil. Incluir foto, titular, resumen, experiencias con descripción, educación y habilidades te da mayor visibilidad en búsquedas.",
    },
  ],
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const navigate = useNavigate();
  // const { quizId } = useParams(); // use to fetch from API

  const quiz = quizMock;
  const total = quiz.questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selectedId: string; correct: boolean }>>({});
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [showXp, setShowXp] = useState(false);

  const question = quiz.questions[currentIndex];
  const isCorrect = selected === question.correctId;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const scorePercent = Math.round((correctCount / total) * 100);
  const passed = scorePercent >= quiz.passingScore;

  const handleSelect = (optId: string) => {
    if (confirmed) return;
    setSelected(optId);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { selectedId: selected, correct: selected === question.correctId },
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setPhase("result");
      if (passed) {
        setTimeout(() => setShowXp(true), 600);
        setTimeout(() => setShowXp(false), 4000);
      }
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers({});
    setPhase("quiz");
  };

  // ── Styles helpers ────────────────────────────────────────────────────────
  const optionBg = (opt: Option) => {
    if (!confirmed) {
      return selected === opt.id
        ? "rgba(37,99,235,0.18)"
        : "rgba(255,255,255,0.02)";
    }
    if (opt.id === question.correctId) return "rgba(22,163,74,0.15)";
    if (opt.id === selected && !isCorrect) return "rgba(220,38,38,0.15)";
    return "rgba(255,255,255,0.02)";
  };

  const optionBorder = (opt: Option) => {
    if (!confirmed) {
      return selected === opt.id ? "#2563eb" : "#1f2937";
    }
    if (opt.id === question.correctId) return "#16a34a";
    if (opt.id === selected && !isCorrect) return "#dc2626";
    return "#1f2937";
  };

  const optionLabel = (opt: Option) => {
    if (!confirmed) return opt.id.toUpperCase();
    if (opt.id === question.correctId) return "✓";
    if (opt.id === selected && !isCorrect) return "✗";
    return opt.id.toUpperCase();
  };

  const optionLabelColor = (opt: Option) => {
    if (!confirmed) return selected === opt.id ? "#2563eb" : "#4b5563";
    if (opt.id === question.correctId) return "#16a34a";
    if (opt.id === selected && !isCorrect) return "#dc2626";
    return "#4b5563";
  };

  // ── RESULT SCREEN ──────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      
          <TopBar showLogo placeholder="Buscar cursos..." />

          {/* XP banner */}
          {showXp && (
            <div style={{
              position: "fixed", top: 80, right: 24, zIndex: 999,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", padding: "14px 22px", borderRadius: 14,
              fontWeight: 700, fontSize: 15, boxShadow: "0 8px 30px rgba(22,163,74,0.4)",
            }}>
              🎉 +{quiz.xpReward} XP ganados — ¡Quiz superado!
            </div>
          )}

          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px 24px",
          }}>
            <div style={{
              maxWidth: 560, width: "100%",
              background: "#0d1117",
              border: `1px solid ${passed ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
              borderRadius: 20,
              padding: "40px 36px",
              boxShadow: passed
                ? "0 0 60px rgba(22,163,74,0.08)"
                : "0 0 60px rgba(220,38,38,0.08)",
              textAlign: "center",
            }}>
              {/* Emoji */}
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                {passed ? "🏅" : "📚"}
              </div>

              {/* Title */}
              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: "#fff" }}>
                {passed ? "¡Quiz superado!" : "Casi llegás"}
              </h1>
              <p style={{ margin: "0 0 28px", color: "#6b7280", fontSize: 15 }}>
                {quiz.title} · {quiz.moduleTitle}
              </p>

              {/* Score ring */}
              <div style={{
                width: 120, height: 120,
                borderRadius: "50%",
                background: `conic-gradient(${passed ? "#16a34a" : "#dc2626"} ${scorePercent * 3.6}deg, #1f2937 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 28px",
                position: "relative",
              }}>
                <div style={{
                  width: 96, height: 96, borderRadius: "50%",
                  background: "#0d1117",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{scorePercent}%</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{correctCount}/{total} correctas</span>
                </div>
              </div>

              {/* Pass/fail message */}
              <div style={{
                padding: "14px 20px", borderRadius: 12, marginBottom: 28,
                background: passed ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                border: `1px solid ${passed ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
              }}>
                <p style={{ margin: 0, fontSize: 14, color: passed ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                  {passed
                    ? `Desbloqueaste la siguiente lección y ganaste +${quiz.xpReward} XP.`
                    : `Necesitás ${quiz.passingScore}% para aprobar. Revisá las notas y volvé a intentarlo.`}
                </p>
              </div>

              {/* Answer summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32, textAlign: "left" }}>
                {quiz.questions.map((q, i) => {
                  const ans = answers[q.id];
                  return (
                    <div key={q.id} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 14px", borderRadius: 10,
                      background: ans?.correct ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)",
                      border: `1px solid ${ans?.correct ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)"}`,
                    }}>
                      <span style={{
                        fontSize: 14, flexShrink: 0,
                        color: ans?.correct ? "#4ade80" : "#f87171",
                      }}>
                        {ans?.correct ? "✓" : "✗"}
                      </span>
                      <p style={{ margin: 0, fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: "#94a3b8" }}>P{i + 1}. </span>
                        {q.question}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {passed ? (
                  <>
                    <button
                      onClick={() => navigate(-1)}
                      style={{
                        padding: "12px 28px", borderRadius: 12, border: "none",
                        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                        color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15,
                      }}
                    >
                      Continuar curso →
                    </button>
                    <button
                      onClick={handleRetry}
                      style={{
                        padding: "12px 20px", borderRadius: 12,
                        border: "1px solid #1f2937", background: "transparent",
                        color: "#9ca3af", cursor: "pointer", fontSize: 14,
                      }}
                    >
                      Reintentar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRetry}
                      style={{
                        padding: "12px 28px", borderRadius: 12, border: "none",
                        background: "#2563eb",
                        color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15,
                      }}
                    >
                      Volver a intentar
                    </button>
                    <button
                      onClick={() => navigate(-1)}
                      style={{
                        padding: "12px 20px", borderRadius: 12,
                        border: "1px solid #1f2937", background: "transparent",
                        color: "#9ca3af", cursor: "pointer", fontSize: 14,
                      }}
                    >
                      Repasar lecciones
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", fontFamily: "system-ui" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar placeholder="Buscar cursos..." />

        <div style={{
          flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "40px 24px",
        }}>
          <div style={{ maxWidth: 640, width: "100%" }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                  color: quiz.isFinal ? "#f59e0b" : "#2563eb",
                  background: quiz.isFinal ? "rgba(245,158,11,0.1)" : "rgba(37,99,235,0.1)",
                  padding: "4px 10px", borderRadius: 6,
                  border: `1px solid ${quiz.isFinal ? "rgba(245,158,11,0.25)" : "rgba(37,99,235,0.25)"}`,
                }}>
                  {quiz.isFinal ? "⭐ Quiz Final" : "🧩 Quiz Intermedio"}
                </span>
                <span style={{ fontSize: 12, color: "#4b5563" }}>{quiz.moduleTitle}</span>
              </div>
              <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#fff" }}>{quiz.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                Necesitás {quiz.passingScore}% para aprobar · +{quiz.xpReward} XP al completar
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Pregunta {currentIndex + 1} de {total}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {Object.values(answers).filter(a => a.correct).length} correctas
                </span>
              </div>
              <div style={{ height: 4, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                  width: `${((currentIndex) / total) * 100}%`,
                  transition: "width 0.4s ease",
                }} />
              </div>
              {/* Step dots */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {quiz.questions.map((q, i) => {
                  const ans = answers[q.id];
                  return (
                    <div key={q.id} style={{
                      flex: 1, height: 6, borderRadius: 999,
                      background: ans
                        ? ans.correct ? "#16a34a" : "#dc2626"
                        : i === currentIndex ? "#2563eb" : "#1f2937",
                      transition: "background 0.3s",
                    }} />
                  );
                })}
              </div>
            </div>

            {/* Question card */}
            <div style={{
              background: "#0d1117",
              border: "1px solid #1f2937",
              borderRadius: 18,
              padding: "28px 28px 24px",
              marginBottom: 16,
            }}>
              {/* Question type badge */}
              <span style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8,
                color: "#4b5563",
                background: "#111827",
                padding: "3px 10px", borderRadius: 6,
                border: "1px solid #1f2937",
                display: "inline-block",
                marginBottom: 16,
              }}>
                {question.type === "truefalse" ? "Verdadero / Falso" : "Opción Múltiple"}
              </span>

              <p style={{
                margin: "0 0 24px",
                fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.55,
              }}>
                {question.question}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={confirmed}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 12,
                      background: optionBg(opt),
                      border: `1px solid ${optionBorder(opt)}`,
                      cursor: confirmed ? "default" : "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                      width: "100%",
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#111827",
                      border: `1px solid ${optionBorder(opt)}`,
                      fontSize: 12, fontWeight: 700,
                      color: optionLabelColor(opt),
                      transition: "all 0.15s",
                    }}>
                      {optionLabel(opt)}
                    </div>
                    <span style={{ fontSize: 15, color: "#d1d5db", fontWeight: selected === opt.id ? 600 : 400 }}>
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Explanation (after confirming) */}
              {confirmed && (
                <div style={{
                  marginTop: 20, padding: "14px 16px", borderRadius: 12,
                  background: isCorrect ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                  border: `1px solid ${isCorrect ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: isCorrect ? "#4ade80" : "#f87171" }}>
                      {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "transparent", border: "1px solid #1f2937",
                  color: "#6b7280", cursor: "pointer", fontSize: 13,
                  padding: "10px 16px", borderRadius: 10,
                }}
              >
                ← Volver al curso
              </button>

              {!confirmed ? (
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  style={{
                    padding: "12px 28px", borderRadius: 12, border: "none",
                    background: selected ? "#2563eb" : "#1f2937",
                    color: selected ? "#fff" : "#4b5563",
                    cursor: selected ? "pointer" : "default",
                    fontWeight: 700, fontSize: 15,
                    transition: "all 0.2s",
                  }}
                >
                  Confirmar respuesta
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  style={{
                    padding: "12px 28px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff", cursor: "pointer",
                    fontWeight: 700, fontSize: 15,
                  }}
                >
                  {currentIndex < total - 1 ? "Siguiente pregunta →" : "Ver resultados →"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}