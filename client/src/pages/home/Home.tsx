import { useNavigate } from "react-router-dom";
import {
  Brain,
  Briefcase,
  Sparkles,
  ArrowRight,
  BarChart3,
  UserCheck,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Brain,
    title: "Diagnóstico inteligente",
    desc: "Analizamos tu perfil profesional y detectamos oportunidades reales de crecimiento.",
    className: "lg:col-span-2",
  },
  {
    icon: Sparkles,
    title: "Rutas personalizadas",
    desc: "Contenido y habilidades adaptadas a tu experiencia y objetivos.",
  },
  {
    icon: Briefcase,
    title: "Conexión laboral",
    desc: "Empresas modernas buscando experiencia real como la tuya.",
  },
  {
    icon: BarChart3,
    title: "CV Vivo",
    desc: "Tu perfil evoluciona automáticamente mientras aprendés.",
    className: "lg:col-span-2",
  },
];

const STEPS = [
  {
    icon: Rocket,
    title: "Creás tu cuenta",
    desc: "Sin procesos complejos ni formularios eternos.",
  },
  {
    icon: Brain,
    title: "Recibís un diagnóstico",
    desc: "Detectamos fortalezas y habilidades para potenciar.",
  },
  {
    icon: UserCheck,
    title: "Conectás con oportunidades",
    desc: "Aprendé, mejorá tu perfil y encontrá nuevas oportunidades.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden font-sans relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-500/15 blur-[140px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#030712]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-lg shadow-xl shadow-blue-500/20">
              R
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-tight">
                ReConecta45
              </h1>

              <p className="text-xs text-gray-500">
                Revalorizando experiencia
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Empezar gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 lg:pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm mb-8 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Plataforma diseñada para profesionales +45
            </div>

            {/* TITLE */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              Volvé al mercado
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-300 pb-2">
                con ventaja
              </span>
            </h1>

            {/* DESC */}
            <p className="mt-7 text-lg text-gray-400 leading-relaxed max-w-xl">
              Actualizá tus habilidades, desarrollá nuevas oportunidades y
              conectate con empresas que valoran la experiencia profesional.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold text-base transition-all shadow-2xl shadow-blue-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Empezar gratis
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all backdrop-blur-xl"
              >
                Explorar plataforma
              </button>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-10 mt-14">
              <div>
                <h3 className="text-3xl font-black">+2.000</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Profesionales
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black">+500</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Empresas
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black">95%</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Satisfacción
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px]" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl overflow-hidden">
              {/* TOP */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="space-y-5">
                {/* CARD */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="text-blue-400" size={22} />

                    <span className="text-sm text-blue-300">
                      Diagnóstico completado
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">
                    Perfil altamente competitivo
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Tu experiencia tiene alto valor para empresas tecnológicas.
                  </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                    <p className="text-gray-500 text-sm">Skills</p>

                    <h3 className="text-3xl font-black mt-2">+24</h3>

                    <div className="w-full h-2 rounded-full bg-white/5 mt-5 overflow-hidden">
                      <div className="w-[75%] h-full bg-blue-500 rounded-full" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                    <p className="text-gray-500 text-sm">
                      Entrevistas
                    </p>

                    <h3 className="text-3xl font-black mt-2">12</h3>

                    <div className="w-full h-2 rounded-full bg-white/5 mt-5 overflow-hidden">
                      <div className="w-[60%] h-full bg-violet-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* MOCKUP */}
                <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Progreso profesional
                      </p>

                      <h3 className="text-2xl font-bold mt-1">
                        82%
                      </h3>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                      <BarChart3 className="text-blue-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                      <div className="w-[82%] h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Frontend</span>
                      <span>Networking</span>
                      <span>IA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight">
            Todo lo que necesitás
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Herramientas modernas para relanzar tu carrera profesional
            sin empezar desde cero.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[260px]">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 ${feature.className}`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <Icon className="text-blue-400" size={28} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>

                  <div className="mt-auto pt-6">
                    <button className="text-blue-400 text-sm flex items-center gap-2 hover:gap-3 transition-all">
                      Conocer más
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black">
            Cómo funciona
          </h2>

          <p className="text-gray-400 mt-4">
            Un proceso simple para volver a destacarte
          </p>
        </div>

        <div className="space-y-5">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex items-start gap-6 p-8 rounded-[32px] border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Icon className="text-blue-400" size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-[40px] border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 p-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_50%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-8">
              ✦ Empezá hoy mismo
            </div>

            <h2 className="text-5xl font-black leading-tight max-w-3xl mx-auto">
              Tu experiencia todavía tiene muchísimo valor
            </h2>

            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              ReConecta45 te ayuda a actualizar tu perfil,
              aprender nuevas habilidades y encontrar nuevas oportunidades.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-10 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-lg shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Crear cuenta gratis
            </button>

            <p className="text-gray-600 text-sm mt-5">
              Sin tarjeta de crédito · Gratis para siempre
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black">
                R
              </div>

              <div>
                <h3 className="font-bold">
                  ReConecta45
                </h3>

                <p className="text-xs text-gray-500">
                  Experiencia + oportunidades
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              Plataforma diseñada para ayudar a profesionales
              +45 a reinventarse y reconectarse con el mercado laboral moderno.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-5">
              Producto
            </h4>

            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer transition-all">
                Diagnóstico
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                CV Vivo
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                Marketplace
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">
              Empresa
            </h4>

            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer transition-all">
                Nosotros
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                Contacto
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                Privacidad
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">
              Comunidad
            </h4>

            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer transition-all">
                LinkedIn
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                Instagram
              </li>

              <li className="hover:text-white cursor-pointer transition-all">
                Soporte
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2026 ReConecta45. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 text-sm text-gray-600">
            <button className="hover:text-white transition-all">
              Términos
            </button>

            <button className="hover:text-white transition-all">
              Privacidad
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}