import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { useApp } from "../../context/AppContext";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type CourseWithProgress = {
  id: string; title: string; emoji: string; level: string; progress: number;
};
type QuizResult = {
  id: string; score: number; passed: boolean; correctCount: number;
  totalQuestions: number; createdAt: string;
  course: { id: string; title: string; emoji: string };
};
type MyApplication = {
  id: string; status: string; appliedAt: string;
  job: { id: string; title: string; location: string; isRemote: boolean; minSalary: number; maxSalary: number };
};
type MyEvaluation = {
  id: string; rating: number; feedback: string; createdAt: string;
  evaluatorName: string; jobId: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" | "muted" }> = {
  PENDING:   { label: "Pendiente",  variant: "warning"     },
  REVIEWED:  { label: "Revisada",   variant: "default"     },
  INTERVIEW: { label: "Entrevista", variant: "secondary"   },
  ACCEPTED:  { label: "Aceptada",   variant: "success"     },
  REJECTED:  { label: "Rechazada",  variant: "destructive" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [evaluations, setEvaluations] = useState<MyEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get<CourseWithProgress[]>("/learning/my-courses").catch(() => []),
      api.get<MyApplication[]>("/job-applications/mine").catch(() => []),
      api.get<QuizResult[]>("/learning/quiz-results/mine").catch(() => []),
      api.get<MyEvaluation[]>("/candidates/my-evaluations").catch(() => []),
    ]).then(([c, a, q, ev]) => {
      setCourses(c);
      setApplications(a);
      setQuizResults(q);
      setEvaluations(ev);
    }).finally(() => setLoading(false));
  }, []);

  const inProgress  = courses.filter(c => c.progress > 0 && c.progress < 100);
  const recommended = courses.filter(c => c.progress === 0).slice(0, 4);
  const recentlySeen = courses.filter(c => c.progress > 0).slice(0, 3);
  const passedQuizzes = quizResults.filter(q => q.passed);

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
      <Sidebar />

      <div className="flex-1 p-5 min-w-0">
        <TopBar showLogo placeholder="Buscar cursos, habilidades..." />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Hola, {user?.fullName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Continuá tu aprendizaje y revisá tu progreso</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="pt-5">
                  <Skeleton className="h-5 w-48 mb-4" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(j => <Skeleton key={j} className="h-24 rounded-xl" />)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* POSTULACIONES */}
            {applications.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>📋 Mis postulaciones</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => navigate("/marketplace")}>
                      Ver marketplace
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {applications.slice(0, 5).map(app => {
                    const st = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
                    return (
                      <div key={app.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background/50 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg shrink-0">🏢</div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{app.job.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              📍 {app.job.location} · {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* EVALUACIONES */}
            {evaluations.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>💬 Evaluaciones recibidas</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {evaluations.slice(0, 4).map(ev => {
                    const stars = "★".repeat(ev.rating) + "☆".repeat(5 - ev.rating);
                    const starClass = ev.rating >= 4 ? "text-success" : ev.rating >= 3 ? "text-warning" : "text-destructive";
                    return (
                      <div key={ev.id} className="p-4 rounded-xl border border-border bg-background/50">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm shrink-0">🏢</div>
                            <div>
                              <p className="font-semibold text-sm">{ev.evaluatorName}</p>
                              <p className="text-xs text-muted-foreground">{new Date(ev.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`text-lg tracking-widest ${starClass}`}>{stars}</span>
                        </div>
                        {ev.feedback && (
                          <p className="text-sm text-muted-foreground border-l-2 border-border pl-3 leading-relaxed">
                            "{ev.feedback}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* QUIZ BADGES */}
            {passedQuizzes.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>🏅 Quizzes aprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {passedQuizzes.slice(0, 8).map(q => (
                      <button
                        key={q.id}
                        onClick={() => navigate(`/curso/${q.course.id}`)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-success/30 bg-success/5 hover:bg-success/10 transition-colors cursor-pointer"
                      >
                        <span className="text-lg">{q.course.emoji}</span>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-foreground">{q.course.title}</p>
                          <p className="text-xs text-success">✓ {q.score}% · {q.correctCount}/{q.totalQuestions}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* EN PROGRESO */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>📚 En progreso</CardTitle>
              </CardHeader>
              <CardContent>
                {inProgress.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No tenés cursos en progreso.{" "}
                    <button className="text-primary hover:underline" onClick={() => navigate("/learning")}>
                      Explorar cursos →
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
                    {inProgress.map(c => (
                      <div key={c.id} className="p-4 rounded-xl border border-border bg-background/50">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{c.emoji}</span>
                          <p className="font-semibold text-sm leading-tight">{c.title}</p>
                        </div>
                        <Progress value={c.progress} className="mb-2" />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground">{c.progress}% completado</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/curso/${c.id}`)}
                        >
                          Continuar →
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* VISTOS RECIENTEMENTE */}
            {recentlySeen.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>🕘 Vistos recientemente</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {recentlySeen.map(c => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/curso/${c.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50 hover:bg-muted/50 transition-colors cursor-pointer w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.emoji}</span>
                        <span className="text-sm font-medium">{c.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{c.progress}% visto</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* RECOMENDADOS */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>⭐ Recomendados para vos</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate("/learning")}>
                    Ver catálogo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}>
                  {recommended.map(r => (
                    <div key={r.id} className="p-4 rounded-xl border border-border bg-background/50">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{r.emoji}</span>
                        <p className="font-semibold text-sm leading-tight">{r.title}</p>
                      </div>
                      <Badge variant="muted" className="mb-3">{r.level}</Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/curso/${r.id}`)}
                      >
                        Ver curso
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
