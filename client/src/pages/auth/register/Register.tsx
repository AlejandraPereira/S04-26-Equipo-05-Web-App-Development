import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "../../../context/AppContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3008";

type UserType = "profesional" | "empresa";

interface ProfesionalForm { name: string; email: string; password: string; confirmPassword: string }
interface EmpresaForm    { companyName: string; email: string; password: string; confirmPassword: string }

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const PERKS = [
  "Diagnóstico gratuito de habilidades",
  "Rutas de aprendizaje personalizadas",
  "CV vivo que evoluciona con vos",
  "Acceso al marketplace de empleos",
];

/* ── Fondo compartido: malla de gradientes + retícula de puntos ───────────── */
function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#04060d]" />
      <div className="absolute -top-24 right-0 w-[clamp(300px,44vw,640px)] h-[clamp(300px,44vw,640px)] rounded-full bg-violet-600/18 blur-[130px]" />
      <div className="absolute -bottom-32 -left-24 w-[clamp(280px,40vw,560px)] h-[clamp(280px,40vw,560px)] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="absolute top-1/2 left-1/3 w-[clamp(200px,28vw,440px)] h-[clamp(200px,28vw,440px)] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
    </div>
  );
}

function FieldInput({
  icon: Icon, placeholder, value, onChange, type = "text", error, showToggle, onToggle, show,
}: {
  icon: React.ElementType; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string;
  showToggle?: boolean; onToggle?: () => void; show?: boolean;
}) {
  return (
    <div>
      <div className={`group flex items-center gap-3 px-4 h-[52px] rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all duration-200 ${error ? "border-red-500/50 shadow-[0_0_0_4px_rgba(239,68,68,0.06)]" : "border-white/10 focus-within:border-blue-400/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"}`}>
        <Icon size={16} className={`shrink-0 transition-colors ${error ? "text-red-400/70" : "text-gray-500 group-focus-within:text-blue-400"}`} />
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600 min-w-0"
        />
        {showToggle && (
          <button type="button" onClick={onToggle} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} className="text-gray-600 hover:text-gray-300 transition-colors shrink-0 p-1 -mr-1">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useApp();

  const [userType, setUserType]   = useState<UserType>("profesional");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const [showPass, setShowPass]         = useState(false);
  const [showConf, setShowConf]         = useState(false);

  const [profForm, setProfForm] = useState<ProfesionalForm>({ name: "", email: "", password: "", confirmPassword: "" });
  const [empForm,  setEmpForm]  = useState<EmpresaForm>   ({ companyName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const handleTabChange = (t: UserType) => { setUserType(t); setErrors({}); setServerError(null); };

  const validateProf = () => {
    const e: Record<string, string> = {};
    if (!profForm.name.trim())                         e.name = "El nombre es requerido";
    if (!profForm.email.includes("@"))                 e.email = "Email inválido";
    if (profForm.password.length < 8)                  e.password = "Mínimo 8 caracteres";
    if (profForm.password !== profForm.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const validateEmp = () => {
    const e: Record<string, string> = {};
    if (!empForm.companyName.trim())                 e.companyName = "El nombre de la empresa es requerido";
    if (!empForm.email.includes("@"))                e.email = "Email inválido";
    if (empForm.password.length < 8)                 e.password = "Mínimo 8 caracteres";
    if (empForm.password !== empForm.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = userType === "profesional" ? validateProf() : validateEmp();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setServerError(null); setIsSubmitting(true);
    try {
      if (userType === "profesional") {
        await registerUser(profForm.name, profForm.email, profForm.password, "profesional");
        navigate("/diagnostic");
      } else {
        await registerUser(empForm.companyName, empForm.email, empForm.password, "empresa");
        navigate("/companyprofile");
      }
    } catch (err: any) {
      setServerError(err.message || "Error al registrarse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#04060d] text-white flex flex-col lg:flex-row overflow-hidden">
      <AuthBackground />

      {/* ── LEFT PANEL — solo desktop ────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-1/2 flex-col justify-between p-10 xl:p-16 border-r border-white/[0.06] min-h-[100dvh]">

        <Link to="/" className="flex items-center gap-3 no-underline w-fit group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-lg shadow-xl shadow-blue-500/25 transition-transform group-hover:scale-105">
            R
          </div>
          <div>
            <p className="font-bold text-base tracking-tight leading-none">ReConecta45</p>
            <p className="text-xs text-gray-500 mt-1">Revalorizando experiencia</p>
          </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-md"
        >
          <h2 className="font-black leading-[1.05] mb-5 text-[length:clamp(2.25rem,3.6vw,3.25rem)]">
            Comenzá tu
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              nuevo comienzo
            </span>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed mb-9 max-w-sm">
            Creá tu cuenta y accedé a todas las herramientas que necesitás para reconectarte con el mercado laboral.
          </p>

          {/* Perks */}
          <div className="flex flex-col gap-3.5">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={15} className="text-blue-400" />
                </span>
                <span className="text-sm text-gray-300">{perk}</span>
              </motion.div>
            ))}
          </div>

          {/* Mini badge */}
          <div className="mt-9 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Gratis · Sin tarjeta de crédito
          </div>
        </motion.div>

        <p className="text-xs text-gray-600">© 2026 ReConecta45 · Todos los derechos reservados</p>
      </aside>

      {/* ── RIGHT PANEL — FORM ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 md:px-10 py-8 sm:py-12 lg:py-0 min-h-[100dvh] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo mobile */}
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8 no-underline w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">R</div>
            <span className="font-bold text-[15px]">ReConecta45</span>
          </Link>

          <h1 className="font-black mb-2 text-[length:clamp(1.6rem,6vw,2rem)] leading-tight">Crear cuenta</h1>
          <p className="text-gray-400 text-sm mb-7">Completá los campos para empezar</p>

          {/* TABS con indicador deslizante */}
          <div className="relative flex p-1 rounded-2xl bg-white/[0.035] border border-white/[0.06] mb-6">
            {(["profesional", "empresa"] as UserType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTabChange(t)}
                aria-pressed={userType === t}
                className={`relative flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  userType === t ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {userType === t && (
                  <motion.span
                    layoutId="registerTabPill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/25"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {t === "profesional" ? <User size={14} /> : <Building2 size={14} />}
                  {t === "profesional" ? "Profesional" : "Empresa"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Fields profesional */}
            {userType === "profesional" && (
              <>
                <FieldInput icon={User} placeholder="Nombre completo" value={profForm.name}
                  onChange={v => setProfForm(f => ({ ...f, name: v }))} error={errors.name} />
                <FieldInput icon={Mail} placeholder="Correo electrónico" type="email" value={profForm.email}
                  onChange={v => setProfForm(f => ({ ...f, email: v }))} error={errors.email} />
                <FieldInput icon={Lock} placeholder="Contraseña" value={profForm.password}
                  onChange={v => setProfForm(f => ({ ...f, password: v }))} error={errors.password}
                  showToggle onToggle={() => setShowPass(p => !p)} show={showPass} />
                <FieldInput icon={Lock} placeholder="Confirmar contraseña" value={profForm.confirmPassword}
                  onChange={v => setProfForm(f => ({ ...f, confirmPassword: v }))} error={errors.confirmPassword}
                  showToggle onToggle={() => setShowConf(p => !p)} show={showConf} />
              </>
            )}

            {/* Fields empresa */}
            {userType === "empresa" && (
              <>
                <FieldInput icon={Building2} placeholder="Nombre de la empresa" value={empForm.companyName}
                  onChange={v => setEmpForm(f => ({ ...f, companyName: v }))} error={errors.companyName} />
                <FieldInput icon={Mail} placeholder="Email corporativo" type="email" value={empForm.email}
                  onChange={v => setEmpForm(f => ({ ...f, email: v }))} error={errors.email} />
                <FieldInput icon={Lock} placeholder="Contraseña" value={empForm.password}
                  onChange={v => setEmpForm(f => ({ ...f, password: v }))} error={errors.password}
                  showToggle onToggle={() => setShowPass(p => !p)} show={showPass} />
                <FieldInput icon={Lock} placeholder="Confirmar contraseña" value={empForm.confirmPassword}
                  onChange={v => setEmpForm(f => ({ ...f, confirmPassword: v }))} error={errors.confirmPassword}
                  showToggle onToggle={() => setShowConf(p => !p)} show={showConf} />
              </>
            )}

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
              className="group relative flex items-center justify-center gap-2 h-[52px] rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                <>
                  Crear cuenta {userType === "empresa" ? "de empresa" : "gratis"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-xs text-gray-600">o registrate con</span>
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

            <p className="text-center text-sm text-gray-500">
              ¿Ya tenés cuenta?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors no-underline">
                Iniciá sesión
              </Link>
            </p>

            <p className="text-center text-xs text-gray-600 -mt-1">
              Al registrarte aceptás nuestros{" "}
              <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Términos</span>{" "}
              y{" "}
              <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Privacidad</span>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}