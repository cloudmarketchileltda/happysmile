import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/profesional/actividades")({
  head: () => ({ meta: [{ title: "Registro de Actividades — Happy Smile" }] }),
  component: Actividades,
});

function Actividades() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const realizadas = s.citas
    .filter((c) => c.profesionalId === prof.id && (c.estado === "Completada" || new Date(c.fechaISO) < new Date()))
    .filter((c) => !desde || c.fechaISO >= desde)
    .filter((c) => !hasta || c.fechaISO <= hasta + "T23:59:59")
    .sort((a, b) => +new Date(b.fechaISO) - +new Date(a.fechaISO));

  return (
    <>
      <PageHeader title="Registro de Actividades" subtitle="Historial de citas y procedimientos" />
      <div className="mb-4 flex flex-wrap gap-2">
        <input type="date" className="rounded-lg border border-input bg-card px-3 py-2 text-sm" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <input type="date" className="rounded-lg border border-input bg-card px-3 py-2 text-sm" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <button onClick={() => { setDesde(""); setHasta(""); }} className="rounded-lg border border-border px-3 py-2 text-sm">Limpiar filtros</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr><th className="p-3 text-left">Fecha</th><th className="p-3 text-left">Paciente</th><th className="p-3 text-left">Procedimiento</th><th className="p-3 text-left">Duración</th><th className="p-3 text-left">Observaciones</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {realizadas.map((c) => {
                const p = s.pacientes.find((x) => x.id === c.pacienteId);
                const e = s.especialidades.find((x) => x.id === c.especialidadId);
                return (
                  <tr key={c.id}>
                    <td className="p-3 whitespace-nowrap">{formatDate(c.fechaISO)} {formatTime(c.fechaISO)}</td>
                    <td className="p-3 font-medium">{p?.nombre}</td>
                    <td className="p-3">{e?.nombre}</td>
                    <td className="p-3">{c.duracionMin} min</td>
                    <td className="p-3 text-muted-foreground">{c.notas ?? "Sin observaciones"}</td>
                  </tr>
                );
              })}
              {realizadas.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Sin actividades en el rango seleccionado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
