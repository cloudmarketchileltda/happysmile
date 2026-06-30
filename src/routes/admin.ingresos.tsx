import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard, EstadoBadge } from "@/components/portal-layout";
import { formatCLP } from "@/lib/format";
import { inputCls } from "@/components/modal";

export const Route = createFileRoute("/admin/ingresos")({
  head: () => ({ meta: [{ title: "Ingresos — Admin Happy Smile" }] }),
  component: AdminIng,
});

function AdminIng() {
  const s = useClinic();
  const [fProf, setFProf] = useState("");
  const [fEsp, setFEsp] = useState("");

  const trats = s.tratamientos
    .filter((t) => !fProf || t.profesionalId === fProf)
    .filter((t) => !fEsp || t.especialidadId === fEsp);

  const rows = trats.map((t) => {
    const pagado = t.cuotas.filter((c) => c.estado === "Pagado").reduce((a, c) => a + c.monto, 0);
    const saldo = t.costoTotal - pagado;
    const tieneMora = t.cuotas.some((c) => c.estado === "Vencido");
    return { ...t, pagado, saldo, estado: tieneMora ? "Con mora" : "Al día" };
  });

  const hoy = new Date();
  const ingMes = s.tratamientos
    .flatMap((t) => t.cuotas)
    .filter(
      (c) =>
        c.estado === "Pagado" &&
        new Date(c.vencimiento).getMonth() === hoy.getMonth() &&
        new Date(c.vencimiento).getFullYear() === hoy.getFullYear(),
    )
    .reduce((a, c) => a + c.monto, 0);
  const proyectado = s.tratamientos
    .flatMap((t) => t.cuotas)
    .filter((c) => c.estado === "Pendiente")
    .reduce((a, c) => a + c.monto, 0);
  const mora = s.tratamientos
    .flatMap((t) => t.cuotas)
    .filter((c) => c.estado === "Vencido")
    .reduce((a, c) => a + c.monto, 0);

  return (
    <>
      <PageHeader title="Control de Ingresos" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ingreso del mes" value={formatCLP(ingMes)} tone="success" />
        <StatCard
          label="Ingreso proyectado"
          value={formatCLP(proyectado)}
          tone="brand"
          hint="Suma de cuotas pendientes"
        />
        <StatCard label="Total en mora" value={formatCLP(mora)} tone="coral" />
      </div>

      <div className="mt-4 mb-4 flex flex-wrap gap-2">
        <select
          className={inputCls + " w-auto"}
          value={fProf}
          onChange={(e) => setFProf(e.target.value)}
        >
          <option value="">Todos los profesionales</option>
          {s.profesionales.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <select
          className={inputCls + " w-auto"}
          value={fEsp}
          onChange={(e) => setFEsp(e.target.value)}
        >
          <option value="">Todas las especialidades</option>
          {s.especialidades.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Paciente</th>
                <th className="p-3 text-left">Tratamiento</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Pagado</th>
                <th className="p-3 text-right">Saldo</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 font-medium">
                    {s.pacientes.find((p) => p.id === r.pacienteId)?.nombre}
                  </td>
                  <td className="p-3">{r.nombre}</td>
                  <td className="p-3 text-right">{formatCLP(r.costoTotal)}</td>
                  <td className="p-3 text-right text-success">{formatCLP(r.pagado)}</td>
                  <td className="p-3 text-right font-semibold">{formatCLP(r.saldo)}</td>
                  <td className="p-3">
                    <EstadoBadge estado={r.estado} />
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
