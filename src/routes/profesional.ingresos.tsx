import { createFileRoute } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard } from "@/components/portal-layout";
import { formatCLP, monthName } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/profesional/ingresos")({
  head: () => ({ meta: [{ title: "Mis Ingresos — Happy Smile" }] }),
  component: IngresosProf,
});

function IngresosProf() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const misTrats = s.tratamientos.filter((t) => t.profesionalId === prof.id);

  const hoy = new Date();
  // ingresos mes actual: cuotas pagadas en mes actual
  const cuotasPagadas = misTrats.flatMap((t) =>
    t.cuotas
      .filter((c) => c.estado === "Pagado")
      .map((c) => ({
        tratamiento: t.nombre,
        paciente: s.pacientes.find((p) => p.id === t.pacienteId)?.nombre ?? "",
        monto: c.monto,
        fecha: c.vencimiento,
      })),
  );

  const inMes =
    cuotasPagadas
      .filter(
        (c) =>
          new Date(c.fecha).getMonth() === hoy.getMonth() &&
          new Date(c.fecha).getFullYear() === hoy.getFullYear(),
      )
      .reduce((a, c) => a + c.monto, 0) *
    (prof.comision / 100);
  const inAnio =
    cuotasPagadas
      .filter((c) => new Date(c.fecha).getFullYear() === hoy.getFullYear())
      .reduce((a, c) => a + c.monto, 0) *
    (prof.comision / 100);
  const procMes = s.citas.filter(
    (c) =>
      c.profesionalId === prof.id &&
      c.estado === "Completada" &&
      new Date(c.fechaISO).getMonth() === hoy.getMonth(),
  ).length;

  const data = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(hoy);
    d.setMonth(hoy.getMonth() - (5 - i));
    const monto =
      cuotasPagadas
        .filter((c) => {
          const f = new Date(c.fecha);
          return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
        })
        .reduce((a, c) => a + c.monto, 0) *
      (prof.comision / 100);
    return { mes: monthName(d.getMonth()), monto: Math.round(monto) };
  });

  return (
    <>
      <PageHeader title="Mis Ingresos" subtitle={`Comisión vigente: ${prof.comision}%`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ganado este mes" value={formatCLP(inMes)} tone="brand" />
        <StatCard label="Ganado este año" value={formatCLP(inAnio)} tone="success" />
        <StatCard label="Procedimientos del mes" value={String(procMes)} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Ingresos últimos 6 meses</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={((v: number) => formatCLP(v)) as never} />
              <Bar dataKey="monto" fill="oklch(0.5 0.07 195)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-4 font-display text-lg font-bold">
          Desglose por tratamiento
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Tratamiento</th>
                <th className="p-3 text-left">Paciente</th>
                <th className="p-3 text-right">Cuota</th>
                <th className="p-3 text-right">Comisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cuotasPagadas.map((c, i) => (
                <tr key={i}>
                  <td className="p-3 font-medium">{c.tratamiento}</td>
                  <td className="p-3">{c.paciente}</td>
                  <td className="p-3 text-right">{formatCLP(c.monto)}</td>
                  <td className="p-3 text-right font-semibold text-brand">
                    {formatCLP((c.monto * prof.comision) / 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
