import { createFileRoute } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge, EmptyState } from "@/components/portal-layout";
import { formatDate, formatTime } from "@/lib/format";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/paciente/horas")({
  head: () => ({ meta: [{ title: "Mis Horas — Happy Smile" }] }),
  component: HorasPage,
});

function HorasPage() {
  const s = useClinic();
  const mis = s.citas.filter((c) => c.pacienteId === s.pacienteActualId).sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));
  const now = new Date();
  const proximas = mis.filter((c) => new Date(c.fechaISO) >= now);
  const pasadas = mis.filter((c) => new Date(c.fechaISO) < now).reverse();

  const Tarjeta = ({ id, label, list }: { id: string; label: string; list: typeof mis }) => (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold">{label}</h2>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay citas en esta sección.</p>
      ) : (
        <div className="space-y-3">
          {list.map((c) => {
            const prof = s.profesionales.find((p) => p.id === c.profesionalId);
            const esp = s.especialidades.find((e) => e.id === c.especialidadId);
            return (
              <div key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-soft">
                  <div className="text-xs text-brand">{formatDate(c.fechaISO).slice(0, 5)}</div>
                  <div className="font-display text-sm font-bold">{formatTime(c.fechaISO)}</div>
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{esp?.nombre}</div>
                  <div className="truncate text-sm text-muted-foreground">{prof?.nombre} · {c.box}</div>
                </div>
                <EstadoBadge estado={c.estado} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="Mis Horas" subtitle="Calendario y lista de tus citas" />
      {mis.length === 0 ? (
        <EmptyState icon={<Calendar className="h-6 w-6" />} title="Aún no tienes citas" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Tarjeta id="prox" label="Próximas citas" list={proximas} />
          <Tarjeta id="pas" label="Citas pasadas" list={pasadas} />
        </div>
      )}
    </>
  );
}
