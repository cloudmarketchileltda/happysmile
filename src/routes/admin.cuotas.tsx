import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge } from "@/components/portal-layout";
import { formatCLP, formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/cuotas")({
  head: () => ({ meta: [{ title: "Cuotas y Pagos — Admin Happy Smile" }] }),
  component: AdminCuotas,
});

function AdminCuotas() {
  const s = useClinic();

  const planes = s.tratamientos.map((t) => {
    const pag = t.cuotas.filter((c) => c.estado === "Pagado").length;
    const prox = t.cuotas.find((c) => c.estado !== "Pagado");
    const tieneMora = t.cuotas.some((c) => c.estado === "Vencido");
    return { t, pag, prox, estado: pag === t.cuotas.length ? "Pagado" : tieneMora ? "Con mora" : "Al día" };
  });

  return (
    <>
      <PageHeader title="Cuotas y Pagos" subtitle="Gestor de planes de pago" />
      <div className="space-y-3">
        {planes.map(({ t, pag, prox, estado }) => {
          const paciente = s.pacientes.find((p) => p.id === t.pacienteId);
          return (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold">{paciente?.nombre}</h3>
                    <EstadoBadge estado={estado} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t.nombre}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{pag}/{t.cuotas.length} cuotas · {formatCLP(t.costoTotal)} total · próx. vence {prox ? formatDate(prox.vencimiento) : "—"}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.cuotas.map((c) => (
                  <div key={c.numero} className={"flex items-center gap-2 rounded-lg border px-3 py-2 text-xs " + (c.estado === "Pagado" ? "border-success/30 bg-success/10" : c.estado === "Vencido" ? "border-coral/30 bg-coral/10" : "border-border")}>
                    <span className="font-semibold">#{c.numero}</span>
                    <span>{formatCLP(c.monto)}</span>
                    <span className="text-muted-foreground">{formatDate(c.vencimiento)}</span>
                    {c.estado !== "Pagado" && (
                      <button onClick={() => { s.marcarCuotaPagada(t.id, c.numero); toast.success(`Cuota #${c.numero} pagada`); }} className="rounded bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">Marcar pagada</button>
                    )}
                    {c.estado === "Pagado" && <span className="text-success">✓ Pagada</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
