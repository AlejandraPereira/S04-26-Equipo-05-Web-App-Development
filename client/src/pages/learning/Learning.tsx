import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Course = {
  id: string; title: string; description: string; level: string;
  duration: string; modulesCount: number; skills: string[];
  emoji: string; progress: number;
};

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const levelVariant = course.level === "Avanzado" ? "destructive" : course.level === "Intermedio" ? "warning" : "success";

  return (
    <Card className="flex flex-col hover:border-primary/40 transition-colors cursor-pointer group" onClick={onClick}>
      {/* Thumbnail */}
      <div className="relative h-36 bg-secondary rounded-t-2xl flex items-center justify-center overflow-hidden">
        {course.progress === 100 && (
          <div className="absolute inset-0 bg-success/10 flex items-end justify-center pb-2">
            <Badge variant="success" className="absolute top-3 left-3">✓ Completado</Badge>
          </div>
        )}
        {course.progress > 0 && course.progress < 100 && (
          <Badge variant="default" className="absolute top-3 left-3">{course.progress}% completado</Badge>
        )}
        <Badge variant={levelVariant} className="absolute top-3 right-3">{course.level}</Badge>
        <span className="text-5xl group-hover:scale-110 transition-transform">{course.emoji}</span>
      </div>

      <CardContent className="flex flex-col flex-1 pt-4">
        <h3 className="font-semibold text-sm leading-tight mb-1">{course.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {course.skills.slice(0, 3).map((s, i) => (
            <Badge key={i} variant="muted" className="text-[10px]">{s}</Badge>
          ))}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>⏱ {course.duration}</span>
          <span>📘 {course.modulesCount} módulos</span>
        </div>

        {course.progress > 0 && course.progress < 100 && (
          <div className="mb-3">
            <Progress value={course.progress} className="h-1.5" indicatorClassName="bg-primary" />
          </div>
        )}

        <Button
          className="mt-auto w-full"
          variant={course.progress === 100 ? "outline" : course.progress > 0 ? "default" : "secondary"}
          size="sm"
        >
          {course.progress === 100 ? "Repasar" : course.progress > 0 ? "Continuar →" : "Ver curso"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Learning() {
  const navigate    = useNavigate();
  const [courses, setCourses]       = useState<Course[]>([]);
  const [search, setSearch]         = useState("");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [isMobile, setIsMobile]     = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api.get<Course[]>("/learning/my-courses")
      .then(setCourses)
      .catch(() => {
        api.get<Course[]>("/learning/courses")
          .then(c => setCourses(c.map(course => ({ ...course, progress: 0 }))))
          .catch(console.error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    const matchLevel  = levelFilter === "Todos" || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const inProgress  = filtered.filter(c => c.progress > 0 && c.progress < 100);
  const notStarted  = filtered.filter(c => c.progress === 0);
  const completed   = filtered.filter(c => c.progress === 100);

  const Section = ({ title, items }: { title: string; items: Course[] }) =>
    items.length === 0 ? null : (
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(c => (
            <CourseCard key={c.id} course={c} onClick={() => navigate(`/curso/${c.id}`)} />
          ))}
        </div>
      </section>
    );

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${isMobile ? "flex-col" : "flex-row"}`}>
      <Sidebar />

      <div className="flex-1 p-5 min-w-0">
        <TopBar showLogo placeholder="Buscar cursos, skills..." />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Catálogo de cursos</h1>
          <p className="text-muted-foreground mt-1">Aprendé a tu ritmo con rutas personalizadas</p>
        </div>

        {/* FILTROS */}
        <div className="flex gap-3 items-center mb-6 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
            <Input
              className="pl-9"
              placeholder="Buscar cursos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["Todos", "Básico", "Intermedio", "Avanzado"].map(lvl => (
              <Button
                key={lvl}
                variant={levelFilter === lvl ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No hay cursos que coincidan con tu búsqueda.
              </div>
            )}
            <Section title="📖 En progreso" items={inProgress} />
            <Section title="🚀 Para empezar" items={notStarted} />
            <Section title="✅ Completados" items={completed} />
          </>
        )}
      </div>
    </div>
  );
}
