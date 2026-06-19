import { createFileRoute, Link } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard, EstadoBadge } from "@/components/portal-layout";
import { formatCLP, formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/paciente/")({
  head: () => ({ meta: [{ title: "Mi Panel — Happy Smile" }] }),
  component: PacienteHome,
});

function PacienteHome() {
  const s = useClinic();
  const paciente = s.pacientes.find((p) => p.id === s.pacienteActualId)!;
  const proxima = s.citas
    .filter((c) => c.pacienteId === paciente.id && new Date(c.fechaISO) > new Date() && c.estado !== "Cancelada")
    .sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO))[0];
  const tratamientos = s.tratamientos.filter((t) => t.pacienteId === paciente.id);
  const activo = tratamientos.find((t) => t.estado === "En curso");

  const saldoPendiente = tratamientos.reduce((acc, t) => acc + t.cuotas.filter((c) => c.estado !== "Pagado").reduce((a, c) => a + c.monto, 0), 0);
  const totalPagado = tratamientos.reduce((acc, t) => acc + t.cuotas.filter((c) => c.estado === "Pagado").reduce((a, c) => a + c.monto, 0), 0);

  const prof = proxima && s.profesionales.find((p) => p.id === proxima.profesionalId);
  const esp = proxima && s.especialidades.find((e) => e.id === proxima.especialidadId);

  return (
    <>
      <PageHeader
        title={`Hola, ${paciente.nombre.split(" ")[0]} 👋`}
        subtitle="Este es el resumen de tu cuidado dental en Happy Smile"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tratamientos" value={String(tratamientos.length)} tone="brand" />
        <StatCard label="Total pagado" value={formatCLP(totalPagado)} tone="success" />
        <StatCard label="Saldo pendiente" value={formatCLP(saldoPendiente)} tone={saldoPendiente > 0 ? "coral" : "default"} />
        <StatCard label="Próximas citas" value={String(s.citas.filter((c) => c.pacienteId === paciente.id && new Date(c.fechaISO) > new Date()).length)} tone="default" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próxima cita</div>
          {proxima ? (
            <div>
              <div className="font-display text-2xl font-bold text-brand">
                {formatDate(proxima.fechaISO)} · {formatTime(proxima.fechaISO)}
              </div>
              <div className="mt-2 text-sm text-foreground">{esp?.nombre} con {prof?.nombre}</div>
              <div className="text-xs text-muted-foreground">{proxima.box}</div>
              <div className="mt-3"><EstadoBadge estado={proxima.estado} /></div>
              <Link to="/paciente/horas" className="mt-4 inline-flex rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Ver todas mis horas</Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No tienes próximas citas. <Link to="/paciente/agendar" className="font-semibold text-brand">Agendar ahora →</Link></div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tratamiento activo</div>
          {activo ? (
            <div>
              <div className="font-display text-lg font-bold">{activo.nombre}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.especialidades.find((e) => e.id === activo.especialidadId)?.nombre}</div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs"><span>Avance</span><span>{activo.etapas.filter((e) => e.completada).length}/{activo.etapas.length} etapas</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brand" style={{ width: `${(activo.etapas.filter((e) => e.completada).length / activo.etapas.length) * 100}%` }} />
                </div>
              </div>
              <Link to="/paciente/tratamientos" className="mt-4 inline-flex rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Ver tratamientos</Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No tienes tratamientos activos en este momento.</div>
          )}
        </div>
      </div>
    </>
  );
}
