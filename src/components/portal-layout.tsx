import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";
import { HappySmileLogo } from "./public-header";

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface Props {
  items: NavItem[];
  portalLabel: string;
  userName: string;
  userMeta?: string;
  children: ReactNode;
}

export function PortalLayout({ items, portalLabel, userName, userMeta, children }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => {
    // Most-specific match wins; root portal item only active on exact
    const exactMatches = items.filter((i) => pathname === i.to);
    if (exactMatches.length) return exactMatches[0]!.to === to;
    // Otherwise longest startsWith match
    const candidates = items
      .filter((i) => pathname.startsWith(i.to) && i.to !== "/")
      .sort((a, b) => b.to.length - a.to.length);
    return candidates[0]?.to === to;
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <HappySmileLogo />
            <span className="hidden rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand md:inline">
              {portalLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-semibold text-foreground">{userName}</div>
              {userMeta && <div className="text-muted-foreground">{userMeta}</div>}
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
              {userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
          <nav className="sticky top-[65px] flex flex-col gap-1 p-4">
            {items.map((it) => {
              const active = isActive(it.to);
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-brand text-brand-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{it.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-x-hidden pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-flow-col gap-1 overflow-x-auto border-t border-border bg-background px-2 py-2 lg:hidden">
        {items.map((it) => {
          const active = isActive(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={
                "flex min-w-[68px] flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium " +
                (active ? "bg-brand-soft text-brand" : "text-muted-foreground")
              }
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "brand" | "coral" | "success" | "warning";
}) {
  const toneClass: Record<string, string> = {
    default: "border-border bg-card",
    brand: "border-brand/20 bg-brand-soft",
    coral: "border-coral/30 bg-coral/10",
    success: "border-success/30 bg-success/10",
    warning: "border-warning/30 bg-warning/10",
  };
  return (
    <div className={"rounded-xl border p-4 " + toneClass[tone]}>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    Confirmada: "bg-brand text-brand-foreground",
    Pendiente: "bg-warning/20 text-yellow-800 dark:text-yellow-200",
    Cancelada: "bg-coral text-coral-foreground",
    Completada: "bg-success/20 text-green-800 dark:text-green-200",
    Completado: "bg-success/20 text-green-800 dark:text-green-200",
    "En curso": "bg-info/20 text-blue-800 dark:text-blue-200",
    Pausado: "bg-muted text-muted-foreground",
    Pagado: "bg-success/20 text-green-800 dark:text-green-200",
    Vencido: "bg-coral text-coral-foreground",
    "Al día": "bg-success/20 text-green-800 dark:text-green-200",
    "Con mora": "bg-coral text-coral-foreground",
  };
  const cls = map[estado] ?? "bg-muted text-muted-foreground";
  return (
    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + cls}>
      {estado}
    </span>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      {icon && <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">{icon}</div>}
      <div className="font-display text-lg font-semibold text-foreground">{title}</div>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
