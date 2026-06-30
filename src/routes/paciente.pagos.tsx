import { createFileRoute } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard, EstadoBadge } from "@/components/portal-layout";
import { formatCLP, formatDate } from "@/lib/format";

export const Route = createFileRoute("/paciente/pagos")({
  head: () => ({ meta: [{ title: "Mis Pagos — Happy Smile" }] }),
  component: PagosPage,
});

function PagosPage() {
  const s = useClinic();
  const trats = s.tratamientos.filter((t) => t.pacienteId === s.pacienteActualId);
  const totalTrat = trats.reduce((a, t) => a + t.costoTotal, 0);
  const totalPag = trats.reduce(
    (a, t) => a + t.cuotas.filter((c) => c.estado === "Pagado").reduce((x, c) => x + c.monto, 0),
    0,
  );
  const saldo = totalTrat - totalPag;

  const filas = trats.flatMap((t) =>
    t.cuotas.map((c) => ({ ...c, tratamiento: t.nombre, id: `${t.id}-${c.numero}` })),
  );

  return (
    <>
      <PageHeader title="Mis Pagos" subtitle="Tus tratamientos y cuotas" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total tratamientos" value={formatCLP(totalTrat)} tone="brand" />
        <StatCard label="Total pagado" value={formatCLP(totalPag)} tone="success" />
        <StatCard
          label="Saldo pendiente"
          value={formatCLP(saldo)}
          tone={saldo > 0 ? "coral" : "default"}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Tratamiento</th>
                <th className="p-3 text-left">Cuota</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3 text-left">Vencimiento</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filas.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium">{c.tratamiento}</td>
                  <td className="p-3 text-muted-foreground">#{c.numero}</td>
                  <td className="p-3 text-right font-semibold">{formatCLP(c.monto)}</td>
                  <td className="p-3">{formatDate(c.vencimiento)}</td>
                  <td className="p-3">
                    <EstadoBadge estado={c.estado} />
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
