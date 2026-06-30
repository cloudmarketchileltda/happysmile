import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_public/registro")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Happy Smile" },
      { name: "description", content: "Regístrate como paciente en Happy Smile." },
    ],
  }),
  component: RegistroPage,
});

function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const registrar = () => {
    if (!nombre || !rut || !email || !telefono || !pass || !pass2) {
      toast.error("Completa todos los campos");
      return;
    }
    if (pass !== pass2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    toast.success("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand text-brand-foreground">
            <User className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-foreground">Crear cuenta</h2>
          <p className="text-sm text-muted-foreground">
            Regístrate para agendar horas y gestionar tus tratamientos
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-medium">Nombre completo</label>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="María González"
            />
          </div>
          <div>
            <label className="text-sm font-medium">RUT</label>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="12.345.678-9"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@mail.cl"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+56 9 1234 5678"
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
          <div>
            <label className="text-sm font-medium">Repetir contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={registrar}
            className="mt-2 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Crear cuenta
          </button>
          <div className="border-t border-border pt-3">
            <Link
              to="/login"
              className="flex items-center justify-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
