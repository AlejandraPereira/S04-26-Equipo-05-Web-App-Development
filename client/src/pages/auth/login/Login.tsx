import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Building2, User, Eye, EyeOff } from "lucide-react";
import { useApp } from "../../../context/AppContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3008";

const schema = z.object({
  email:    z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
type FormData = z.infer<typeof schema>;
type UserType = "profesional" | "empresa";

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

/* ── Fondo compartido: malla de gradientes + retícula de puntos ───────────── */
function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base */}
      <div className="absolute inset-0 bg-[#04060d]" />
      {/* auroras (tamaño fluido) */}
      <div className="absolute -top-32 -left-24 w-[clamp(280px,42vw,620px)] h-[clamp(280px,42vw,620px)] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-24 w-[clamp(280px,40vw,600px)] h-[clamp(280px,40vw,600px)] rounded-full bg-violet-600/15 blur-[130px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[clamp(200px,30vw,460px)] h-[clamp(200px,30vw,460px)] rounded-full bg-indigo-500/10 blur-[120px]" />
      {/* retícula de puntos que se desvanece */}
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      {/* viñeta superior */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
    </div>
  );
}

export default function Login() {
  const [userType, setUserType]   = useState<UserType>("profesional");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPass, setShowPass]   = useState(false);
  const { login } = useApp();
  const navigate  = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const handleTabChange = (t: UserType) => { setUserType(t); setServerError(null); reset(); };

  const onSubmit = async (data: FormData) => {
    try {
      setServerError(null);
      await login(data.email, data.password, userType);
      navigate(userType === "empresa" ? "/companyprofile" : "/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Credenciales inválidas");
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#04060d] text-white flex flex-col lg:flex-row overflow-hidden">
      <AuthBackground />

      {/* ── PANEL IZQUIERDO — solo desktop ───────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-1/2 flex-col justify-between p-10 xl:p-16 border-r border-white/[0.06] min-h-[100dvh] relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline w-fit group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-lg shadow-xl shadow-blue-500/25 shrink-0 transition-transform group-hover:scale-105">
            R
          </div>
          <div>
            <p className="font-bold text-base tracking-tight leading-none">ReConecta45</p>
            <p className="text-xs text-gray-500 mt-1">Revalorizando experiencia</p>
          </div>
        </Link>

        {/* Contenido central */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-md"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-medium text-gray-300 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            +45 · Una nueva etapa profesional
          </span>

          <h2 className="font-black leading-[1.05] mb-5 text-[length:clamp(2.25rem,3.6vw,3.25rem)]">
            Tu experiencia es
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              tu mayor activo
            </span>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed mb-9 max-w-sm">
            Miles de profesionales +45 ya están actualizando sus habilidades y encontrando nuevas oportunidades.
          </p>

          {/* Testimonial */}
          <figure className="relative p-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm overflow-hidden">
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            <span className="absolute top-4 right-5 text-5xl leading-none font-serif text-white/[0.06] select-none">”</span>
            <blockquote className="text-[15px] text-gray-200 leading-relaxed italic mb-5 relative">
              Encontré trabajo en una startup en 3 semanas. La plataforma me ayudó a actualizar mi perfil.
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold shrink-0">M</div>
              <div>
                <p className="text-sm font-semibold leading-none">Marcela R.</p>
                <p className="text-xs text-gray-500 mt-1">CFO → FinTech Lead</p>
              </div>
            </figcaption>
          </figure>
        </motion.div>

        <p className="text-xs text-gray-600">© 2026 ReConecta45 · Todos los derechos reservados</p>
      </aside>

      {/* ── PANEL DERECHO — FORM (full width en mobile) ──────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 md:px-10 py-8 sm:py-12 lg:py-0 min-h-[100dvh] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo mobile */}
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-9 no-underline w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">R</div>
            <span className="font-bold text-[15px]">ReConecta45</span>
          </Link>

          <h1 className="font-black mb-2 text-[length:clamp(1.6rem,6vw,2rem)] leading-tight">Bienvenido de vuelta</h1>
          <p className="text-gray-400 text-sm mb-7">Iniciá sesión para continuar</p>

          {/* TABS con indicador deslizante */}
          <div className="relative flex p-1 rounded-2xl bg-white/[0.035] border border-white/[0.06] mb-6">
            {(["profesional", "empresa"] as UserType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTabChange(t)}
                aria-pressed={userType === t}
                className={`relative flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  userType === t ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {userType === t && (
                  <motion.span
                    layoutId="loginTabPill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/25"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {t === "profesional" ? <User size={14} /> : <Building2 size={14} />}
                  {t === "profesional" ? "Profesional" : "Empresa"}
                </span>
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">

            {/* Email */}
            <div>
              <div className={`group flex items-center gap-3 px-4 h-[52px] rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all duration-200 ${errors.email ? "border-red-500/50 shadow-[0_0_0_4px_rgba(239,68,68,0.06)]" : "border-white/10 focus-within:border-blue-400/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"}`}>
                <Mail size={16} className={`shrink-0 transition-colors ${errors.email ? "text-red-400/70" : "text-gray-500 group-focus-within:text-blue-400"}`} />
                <input
                  {...register("email")}
                  placeholder={userType === "empresa" ? "Email corporativo" : "Correo electrónico"}
                  autoComplete="email"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-600 min-w-0"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className={`group flex items-center gap-3 px-4 h-[52px] rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all duration-200 ${errors.password ? "border-red-500/50 shadow-[0_0_0_4px_rgba(239,68,68,0.06)]" : "border-white/10 focus-within:border-blue-400/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"}`}>
                <Lock size={16} className={`shrink-0 transition-colors ${errors.password ? "text-red-400/70" : "text-gray-500 group-focus-within:text-blue-400"}`} />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-600 min-w-0"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"} className="text-gray-600 hover:text-gray-300 transition-colors shrink-0 p-1 -mr-1">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            {/* Forgot */}
            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors no-underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm"
              >
                {serverError}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex items-center justify-center gap-2 h-[52px] rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Entrar como {userType === "empresa" ? "Empresa" : "Profesional"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-xs text-gray-600">o continuá con</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Google */}
            <a
              href={`${API_BASE}/auth/google`}
              className="flex items-center justify-center gap-3 h-[52px] rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.99] transition-all text-sm font-medium no-underline text-white"
            >
              {GOOGLE_SVG}
              Continuar con Google
            </a>

            <p className="text-center text-sm text-gray-500 mt-2">
              ¿No tenés cuenta?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors no-underline">
                Registrate gratis
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}