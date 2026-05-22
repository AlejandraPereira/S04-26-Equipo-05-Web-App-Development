import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import styles from "./QuizPage.module.css";

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
  passingScore: number;
  questions: Question[];
}

// TODO: GET /quizzes/:quizId
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

export default function QuizPage() {
  const navigate = useNavigate();

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

  // Dynamic inline styles (depend on state)
  const optionBg = (opt: Option) => {
    if (!confirmed) return selected === opt.id ? "rgba(37,99,235,0.18)" : "rgba(255,255,255,0.02)";
    if (opt.id === question.correctId) return "rgba(22,163,74,0.15)";
    if (opt.id === selected && !isCorrect) return "rgba(220,38,38,0.15)";
    return "rgba(255,255,255,0.02)";
  };

  const optionBorder = (opt: Option) => {
    if (!confirmed) return selected === opt.id ? "#2563eb" : "#1f2937";
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

  const stepDotClass = (q: Question, i: number) => {
    const ans = answers[q.id];
    if (ans) return ans.correct ? styles.stepDotCorrect : styles.stepDotWrong;
    if (i === currentIndex) return styles.stepDotActive;
    return styles.stepDotDefault;
  };

  // RESULT SCREEN
  if (phase === "result") {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.content}>
          <TopBar showLogo placeholder="Buscar cursos..." />

          {showXp && (
            <div className={styles.xpToast}>
              🎉 +{quiz.xpReward} XP ganados — ¡Quiz superado!
            </div>
          )}

          <div className={styles.resultInner}>
            <div
              className={styles.resultCard}
              style={{
                border: `1px solid ${passed ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
                boxShadow: passed ? "0 0 60px rgba(22,163,74,0.08)" : "0 0 60px rgba(220,38,38,0.08)",
              }}
            >
              <div className={styles.resultEmoji}>{passed ? "🏅" : "📚"}</div>
              <h1 className={styles.resultTitle}>{passed ? "¡Quiz superado!" : "Casi llegás"}</h1>
              <p className={styles.resultSubtitle}>{quiz.title} · {quiz.moduleTitle}</p>

              {/* Score ring — kept inline because scorePercent is dynamic */}
              <div
                className={styles.scoreRing}
                style={{
                  background: `conic-gradient(${passed ? "#16a34a" : "#dc2626"} ${scorePercent * 3.6}deg, #1f2937 0deg)`,
                }}
              >
                <div className={styles.scoreRingInner}>
                  <span className={styles.scorePercent}>{scorePercent}%</span>
                  <span className={styles.scoreLabel}>{correctCount}/{total} correctas</span>
                </div>
              </div>

              <div
                className={styles.resultMessage}
                style={{
                  background: passed ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                  border: `1px solid ${passed ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                <p className={styles.resultMessageText} style={{ color: passed ? "#4ade80" : "#f87171" }}>
                  {passed
                    ? `Desbloqueaste la siguiente lección y ganaste +${quiz.xpReward} XP.`
                    : `Necesitás ${quiz.passingScore}% para aprobar. Revisá las notas y volvé a intentarlo.`}
                </p>
              </div>

              <div className={styles.answerSummary}>
                {quiz.questions.map((q, i) => {
                  const ans = answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={styles.answerRow}
                      style={{
                        background: ans?.correct ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)",
                        border: `1px solid ${ans?.correct ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)"}`,
                      }}
                    >
                      <span className={styles.answerIcon} style={{ color: ans?.correct ? "#4ade80" : "#f87171" }}>
                        {ans?.correct ? "✓" : "✗"}
                      </span>
                      <p className={styles.answerQuestion}>
                        <span className={styles.answerQuestionNum}>P{i + 1}. </span>
                        {q.question}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className={styles.resultCtas}>
                {passed ? (
                  <>
                    <button className={styles.btnContinue} onClick={() => navigate(-1)}>
                      Continuar curso →
                    </button>
                    <button className={styles.btnSecondary} onClick={handleRetry}>
                      Reintentar
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.btnRetry} onClick={handleRetry}>
                      Volver a intentar
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
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

  // QUIZ SCREEN
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>
        <TopBar placeholder="Buscar cursos..." />

        <div className={styles.inner}>
          <div className={styles.container}>

            {/* Header */}
            <div className={styles.quizHeader}>
              <div className={styles.quizHeaderTop}>
                <span className={quiz.isFinal ? styles.badgeFinal : styles.badgeIntermediate}>
                  {quiz.isFinal ? "⭐ Quiz Final" : "🧩 Quiz Intermedio"}
                </span>
                <span className={styles.moduleLabel}>{quiz.moduleTitle}</span>
              </div>
              <h1 className={styles.quizTitle}>{quiz.title}</h1>
              <p className={styles.quizSubtitle}>
                Necesitás {quiz.passingScore}% para aprobar · +{quiz.xpReward} XP al completar
              </p>
            </div>

            {/* Progress */}
            <div className={styles.progressSection}>
              <div className={styles.progressMeta}>
                <span className={styles.progressMetaText}>Pregunta {currentIndex + 1} de {total}</span>
                <span className={styles.progressMetaText}>
                  {Object.values(answers).filter((a) => a.correct).length} correctas
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(currentIndex / total) * 100}%` }}
                />
              </div>
              <div className={styles.stepDots}>
                {quiz.questions.map((q, i) => (
                  <div key={q.id} className={`${styles.stepDot} ${stepDotClass(q, i)}`} />
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className={styles.questionCard}>
              <span className={styles.questionTypeBadge}>
                {question.type === "truefalse" ? "Verdadero / Falso" : "Opción Múltiple"}
              </span>
              <p className={styles.questionText}>{question.question}</p>

              <div className={styles.options}>
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={confirmed}
                    className={styles.optionBtn}
                    style={{
                      background: optionBg(opt),
                      border: `1px solid ${optionBorder(opt)}`,
                      cursor: confirmed ? "default" : "pointer",
                    }}
                  >
                    <div
                      className={styles.optionLabel}
                      style={{
                        border: `1px solid ${optionBorder(opt)}`,
                        color: optionLabelColor(opt),
                      }}
                    >
                      {optionLabel(opt)}
                    </div>
                    <span
                      className={styles.optionText}
                      style={{ fontWeight: selected === opt.id ? 600 : 400 }}
                    >
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              {confirmed && (
                <div className={isCorrect ? styles.explanationCorrect : styles.explanationWrong}>
                  <span className={styles.explanationIcon}>{isCorrect ? "✅" : "❌"}</span>
                  <div>
                    <p className={isCorrect ? styles.explanationTitleCorrect : styles.explanationTitleWrong}>
                      {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
                    </p>
                    <p className={styles.explanationText}>{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.btnBack} onClick={() => navigate(-1)}>
                ← Volver al curso
              </button>
              {!confirmed ? (
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className={`${styles.btnConfirm} ${selected ? styles.btnConfirmActive : styles.btnConfirmDisabled}`}
                >
                  Confirmar respuesta
                </button>
              ) : (
                <button className={styles.btnNext} onClick={handleNext}>
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