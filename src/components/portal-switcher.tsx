import { Link, useRouterState } from "@tanstack/react-router";

const portals = [
  { to: "/", label: "Público" },
  { to: "/paciente", label: "Paciente" },
  { to: "/profesional", label: "Profesional" },
  { to: "/admin", label: "Administración" },
] as const;

export function PortalSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => {
    if (to === "/") return !pathname.startsWith("/paciente") && !pathname.startsWith("/profesional") && !pathname.startsWith("/admin");
    return pathname.startsWith(to);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/60 p-1 text-xs">
      <span className="hidden px-2 text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
        Demo
      </span>
      {portals.map((p) => (
        <Link
          key={p.to}
          to={p.to}
          className={
            "rounded-full px-2.5 py-1 transition-colors sm:px-3 " +
            (isActive(p.to)
              ? "bg-brand text-brand-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {p.label}
        </Link>
      ))}
    </div>
  );
}
