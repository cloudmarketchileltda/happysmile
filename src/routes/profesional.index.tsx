import { createFileRoute } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard, EstadoBadge } from "@/components/portal-layout";
import { formatCLP, formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/profesional/")({
  head: () => ({ meta: [{ title: "Panel Profesional — Happy Smile" }] }),
  component: ProfHome,
});

function ProfHome() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const mis = s.citas.filter((c) => c.profesionalId === prof.id);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const proximas = mis
    .filter((c) => new Date(c.fechaISO) >= hoy && c.estado !== "Cancelada")
    .sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));
  const ingresosMes =
    s.tratamientos
      .filter((t) => t.profesionalId === prof.id)
      .reduce(
        (acc, t) =>
          acc + t.cuotas.filter((c) => c.estado === "Pagado").reduce((a, c) => a + c.monto, 0),
        0,
      ) *
    (prof.comision / 100);

  return (
    <>
      <PageHeader
        title={`Hola, ${prof.nombre.split(" ")[1]} 👋`}
        subtitle="Tu actividad clínica de un vistazo"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Citas próximas" value={String(proximas.length)} tone="brand" />
        <StatCard
          label="Pacientes activos"
          value={String(
            new Set(
              s.tratamientos
                .filter((t) => t.profesionalId === prof.id && t.estado === "En curso")
                .map((t) => t.pacienteId),
            ).size,
          )}
        />
        <StatCard
          label="Tratamientos en curso"
          value={String(
            s.tratamientos.filter((t) => t.profesionalId === prof.id && t.estado === "En curso")
              .length,
          )}
          tone="success"
        />
        <StatCard
          label="Comisión acumulada"
          value={formatCLP(ingresosMes)}
          tone="brand"
          hint={`${prof.comision}% de comisión`}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Próximas citas</h2>
        <div className="mt-4 space-y-2">
          {proximas.slice(0, 5).map((c) => {
            const pac = s.pacientes.find((p) => p.id === c.pacienteId);
            return (
              <div
                key={c.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(c.fechaISO).slice(0, 5)}
                  </div>
                  <div className="font-display font-bold text-brand">{formatTime(c.fechaISO)}</div>
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{pac?.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.box} · {c.duracionMin} min
                  </div>
                </div>
                <EstadoBadge estado={c.estado} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
