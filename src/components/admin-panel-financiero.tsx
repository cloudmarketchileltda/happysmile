// Componente compartido del Panel Financiero (usado por /admin y /admin/financiero)
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard } from "@/components/portal-layout";
import { formatCLP, monthName } from "@/lib/format";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const COLORS = ["oklch(0.5 0.07 195)", "oklch(0.68 0.16 22)", "oklch(0.62 0.14 155)", "oklch(0.78 0.15 85)", "oklch(0.6 0.13 235)"];

export function AdminPanelFinanciero() {
  const s = useClinic();
  const hoy = new Date();

  const cuotasPagadas = s.tratamientos.flatMap((t) => t.cuotas.filter((c) => c.estado === "Pagado").map((c) => ({ monto: c.monto, fecha: c.vencimiento, tratamiento: t.nombre })));
  const cuotasPend = s.tratamientos.flatMap((t) => t.cuotas.filter((c) => c.estado !== "Pagado").map((c) => c.monto));

  const ingMes = cuotasPagadas.filter((c) => new Date(c.fecha).getMonth() === hoy.getMonth() && new Date(c.fecha).getFullYear() === hoy.getFullYear()).reduce((a, c) => a + c.monto, 0);
  const gastosMes = s.gastos.filter((g) => new Date(g.fecha).getMonth() === hoy.getMonth() && new Date(g.fecha).getFullYear() === hoy.getFullYear()).reduce((a, g) => a + g.monto, 0);
  const utilidad = ingMes - gastosMes;
  const porCobrar = cuotasPend.reduce((a, c) => a + c, 0);

  const dataLinea = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(hoy); d.setMonth(hoy.getMonth() - (5 - i));
    const ing = cuotasPagadas.filter((c) => { const f = new Date(c.fecha); return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear(); }).reduce((a, c) => a + c.monto, 0);
    const gas = s.gastos.filter((g) => { const f = new Date(g.fecha); return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear(); }).reduce((a, g) => a + g.monto, 0);
    return { mes: monthName(d.getMonth()), ingresos: ing, gastos: gas };
  });

  const cats = Array.from(new Set(s.gastos.map((g) => g.categoria)));
  const dataPie = cats.map((c) => ({ name: c, value: s.gastos.filter((g) => g.categoria === c).reduce((a, g) => a + g.monto, 0) }));

  const topTrat = [...s.tratamientos].sort((a, b) => b.costoTotal - a.costoTotal).slice(0, 5);

  return (
    <>
      <PageHeader title="Panel Financiero" subtitle="Visión general del desempeño de la clínica" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ingresos del mes" value={formatCLP(ingMes)} tone="success" />
        <StatCard label="Gastos del mes" value={formatCLP(gastosMes)} tone="coral" />
        <StatCard label="Utilidad neta" value={formatCLP(utilidad)} tone={utilidad >= 0 ? "brand" : "coral"} />
        <StatCard label="Cuentas por cobrar" value={formatCLP(porCobrar)} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Ingresos vs Gastos · últimos 6 meses</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={dataLinea}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={((v: number) => formatCLP(v)) as never} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="oklch(0.5 0.07 195)" strokeWidth={2.5} name="Ingresos" />
                <Line type="monotone" dataKey="gastos" stroke="oklch(0.68 0.16 22)" strokeWidth={2.5} name="Gastos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Distribución de gastos</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataPie} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => e.name}>
                  {dataPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={((v: number) => formatCLP(v)) as never} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-4 font-display text-lg font-bold">Top 5 tratamientos por ingresos</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="p-3 text-left">Tratamiento</th><th className="p-3 text-left">Paciente</th><th className="p-3 text-left">Profesional</th><th className="p-3 text-right">Valor</th></tr></thead>
            <tbody className="divide-y divide-border">
              {topTrat.map((t) => (
                <tr key={t.id}><td className="p-3 font-medium">{t.nombre}</td><td className="p-3">{s.pacientes.find((p) => p.id === t.pacienteId)?.nombre}</td><td className="p-3">{s.profesionales.find((p) => p.id === t.profesionalId)?.nombre}</td><td className="p-3 text-right font-semibold">{formatCLP(t.costoTotal)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
