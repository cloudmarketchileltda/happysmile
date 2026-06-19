import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge } from "@/components/portal-layout";
import { Modal } from "@/components/modal";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/profesional/agenda")({
  head: () => ({ meta: [{ title: "Mi Agenda — Happy Smile" }] }),
  component: AgendaProf,
});

function AgendaProf() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const [vista, setVista] = useState<"semana" | "mes">("semana");
  const [detalle, setDetalle] = useState<string | null>(null);

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const inicio = new Date(hoy); inicio.setDate(hoy.getDate() - hoy.getDay());
  const dias = vista === "semana" ? 7 : 30;
  const fechas = Array.from({ length: dias }).map((_, i) => { const d = new Date(inicio); d.setDate(inicio.getDate() + i); return d; });

  const citasMap = new Map<string, typeof s.citas>();
  s.citas.filter((c) => c.profesionalId === prof.id).forEach((c) => {
    const k = new Date(c.fechaISO).toISOString().slice(0, 10);
    if (!citasMap.has(k)) citasMap.set(k, []);
    citasMap.get(k)!.push(c);
  });

  const cita = s.citas.find((c) => c.id === detalle);
  const pac = cita && s.pacientes.find((p) => p.id === cita.pacienteId);
  const esp = cita && s.especialidades.find((e) => e.id === cita.especialidadId);

  return (
    <>
      <PageHeader
        title="Mi Agenda"
        subtitle="Vista calendario de tus citas"
        action={
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <button onClick={() => setVista("semana")} className={"rounded-md px-3 py-1 text-sm font-medium " + (vista === "semana" ? "bg-background shadow-sm" : "text-muted-foreground")}>Semana</button>
            <button onClick={() => setVista("mes")} className={"rounded-md px-3 py-1 text-sm font-medium " + (vista === "mes" ? "bg-background shadow-sm" : "text-muted-foreground")}>Mes</button>
          </div>
        }
      />
      <div className={"grid gap-2 " + (vista === "semana" ? "sm:grid-cols-7" : "sm:grid-cols-5 lg:grid-cols-7")}>
        {fechas.map((d) => {
          const k = d.toISOString().slice(0, 10);
          const items = (citasMap.get(k) ?? []).sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));
          const isHoy = k === hoy.toISOString().slice(0, 10);
          return (
            <div key={k} className={"rounded-xl border bg-card p-2 " + (isHoy ? "border-brand" : "border-border")}>
              <div className="mb-2 text-center text-xs">
                <div className="text-muted-foreground">{d.toLocaleDateString("es-CL", { weekday: "short" })}</div>
                <div className={"font-display text-lg font-bold " + (isHoy ? "text-brand" : "")}>{d.getDate()}</div>
              </div>
              <div className="space-y-1">
                {items.length === 0 && <div className="py-2 text-center text-[10px] text-muted-foreground">Sin citas</div>}
                {items.map((c) => {
                  const p = s.pacientes.find((x) => x.id === c.pacienteId);
                  return (
                    <button key={c.id} onClick={() => setDetalle(c.id)} className="w-full rounded bg-brand-soft p-1.5 text-left hover:bg-brand-soft/70">
                      <div className="text-[10px] font-bold text-brand">{formatTime(c.fechaISO)}</div>
                      <div className="truncate text-[11px] font-medium">{p?.nombre}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{c.duracionMin} min · {c.box}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!detalle} onClose={() => setDetalle(null)} title="Detalle de cita">
        {cita && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Paciente</span><span className="font-semibold">{pac?.nombre}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Especialidad</span><span className="font-semibold">{esp?.nombre}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-semibold">{formatDate(cita.fechaISO)} · {formatTime(cita.fechaISO)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duración</span><span className="font-semibold">{cita.duracionMin} min</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Box</span><span className="font-semibold">{cita.box}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><EstadoBadge estado={cita.estado} /></div>
          </div>
        )}
      </Modal>
    </>
  );
}
