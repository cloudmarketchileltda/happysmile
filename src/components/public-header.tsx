import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/especialidades", label: "Especialidades" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function HappySmileLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={"flex items-center gap-2 " + className}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
        <span className="text-lg">🦷</span>
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold text-foreground">Happy Smile</div>
        <div className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
          Clínica Dental
        </div>
      </div>
    </Link>
  );
}

export function PublicHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <HappySmileLogo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                  (active ? "bg-brand-soft text-brand" : "text-muted-foreground hover:text-foreground")
                }
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 sm:inline-block"
          >
            Iniciar sesión
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-brand px-3 py-2 text-center text-sm font-medium text-brand-foreground"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-brand-soft/40">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <HappySmileLogo />
          <p className="mt-3 text-sm text-muted-foreground">
            Sonríe con confianza. Cuidamos tu salud bucal con tecnología y cercanía.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold text-foreground">Contacto</div>
          <p className="text-muted-foreground">La Concepcion 553, Cunco, Chile</p>
          <p className="text-muted-foreground">+56 2 2345 6789 · hola@happysmile.cl</p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold text-foreground">Horario</div>
          <p className="text-muted-foreground">Lunes a Viernes · 09:00 – 19:00</p>
          <p className="text-muted-foreground">Sábado · 10:00 – 14:00</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Happy Smile · Todos los derechos reservados
      </div>
    </footer>
  );
}
