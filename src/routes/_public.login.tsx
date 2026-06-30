import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User, Stethoscope, Shield, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_public/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — Happy Smile" }] }),
  component: LoginPage,
});

type Perfil = "paciente" | "profesional" | "admin" | null;

const perfiles = [
  {
    id: "paciente" as const,
    titulo: "Paciente",
    descripcion: "Agenda horas, revisa tratamientos y pagos",
    icono: User,
    ruta: "/paciente",
    color: "bg-brand text-brand-foreground",
    nombreDemo: "María González",
  },
  {
    id: "profesional" as const,
    titulo: "Profesional",
    descripcion: "Gestiona agenda, pacientes e ingresos",
    icono: Stethoscope,
    ruta: "/profesional",
    color: "bg-emerald-600 text-white",
    nombreDemo: "Dr. Rodrigo Fuentes",
  },
  {
    id: "admin" as const,
    titulo: "Administración",
    descripcion: "Panel financiero, insumos y gestión general",
    icono: Shield,
    ruta: "/admin",
    color: "bg-violet-600 text-white",
    nombreDemo: "Administrador",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<Perfil>(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const perfil = perfiles.find((p) => p.id === perfilSeleccionado);

  const login = () => {
    if (!email || !pass) {
      toast.error("Ingresa tu email y contraseña");
      return;
    }
    toast.success(`¡Bienvenido/a, ${perfil?.nombreDemo}! Ingresando al portal ${perfil?.titulo}.`);
    setTimeout(() => navigate({ to: perfil!.ruta }), 600);
  };

  // Pantalla de selección de perfil
  if (!perfilSeleccionado) {
    return (
      <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-2xl place-items-center px-4 py-12">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand text-3xl text-brand-foreground shadow-sm">
              🦷
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Happy Smile</h1>
            <p className="mt-1 text-muted-foreground">
              Selecciona tu perfil para acceder al portal
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {perfiles.map((p) => {
              const Icon = p.icono;
              return (
                <button
                  key={p.id}
                  onClick={() => setPerfilSeleccionado(p.id)}
                  className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  <div className={"grid h-14 w-14 place-items-center rounded-xl " + p.color}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold text-foreground">
                    {p.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.descripcion}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Acceder <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Demo — Todos los portales son de prueba con datos ficticios
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de login unificada para todos los perfiles
  return (
    <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className={"mx-auto grid h-12 w-12 place-items-center rounded-xl " + perfil!.color}>
            {(() => {
              const Icon = perfil!.icono;
              return <Icon className="h-6 w-6" />;
            })()}
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-foreground">
            Portal {perfil!.titulo}
          </h2>
          <p className="text-sm text-muted-foreground">
            Inicia sesión para acceder al portal {perfil!.titulo.toLowerCase()}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                perfil!.id === "paciente"
                  ? "maria@mail.cl"
                  : perfil!.id === "profesional"
                    ? "rfuentes@happysmile.cl"
                    : "admin@happysmile.cl"
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={login}
            className={
              "mt-2 w-full rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 " +
              (perfil!.id === "paciente"
                ? "bg-brand"
                : perfil!.id === "profesional"
                  ? "bg-emerald-600"
                  : "bg-violet-600")
            }
          >
            Ingresar como {perfil!.nombreDemo}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Demo: cualquier credencial te ingresa como {perfil!.nombreDemo}
          </p>
          <div className="border-t border-border pt-3">
            {perfil!.id === "paciente" && (
              <Link
                to="/registro"
                className="block text-center text-sm font-medium text-brand hover:underline"
              >
                ¿Eres nuevo? Crea una cuenta aquí
              </Link>
            )}
            <Link
              to="/"
              className="mt-1 block text-center text-sm font-medium text-muted-foreground hover:underline"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
