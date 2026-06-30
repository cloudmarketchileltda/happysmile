import { createFileRoute, Link } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { formatCLP } from "@/lib/format";

export const Route = createFileRoute("/_public/especialidades")({
  head: () => ({
    meta: [
      { title: "Especialidades — Happy Smile" },
      {
        name: "description",
        content:
          "Conoce todas las especialidades dentales de Happy Smile y nuestros especialistas.",
      },
    ],
  }),
  component: EspecialidadesPage,
});

function EspecialidadesPage() {
  const especialidades = useClinic((s) => s.especialidades);
  const profesionales = useClinic((s) => s.profesionales);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Especialidades</h1>
        <p className="mt-2 text-muted-foreground">
          Atención integral con especialistas certificados
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {especialidades.map((e) => {
          const equipo = profesionales.filter((p) => p.especialidadId === e.id);
          return (
            <div key={e.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-soft text-4xl">
                    {e.icono}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-bold">{e.nombre}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{e.descripcion}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sesión típica: {e.duracionMin} min · Desde {formatCLP(e.precioBase)}
                    </p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="shrink-0 rounded-lg bg-brand px-5 py-2.5 text-center text-sm font-semibold text-brand-foreground hover:opacity-90"
                >
                  Agendar
                </Link>
              </div>
              {equipo.length > 0 && (
                <div className="border-t border-border bg-brand-soft/30 p-6">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Especialistas
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {equipo.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl bg-background p-3 ring-1 ring-border"
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                          {p.nombre
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{p.nombre}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {p.credenciales}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
