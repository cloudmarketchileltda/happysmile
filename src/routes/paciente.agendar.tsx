import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { formatDate } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/paciente/agendar")({
  head: () => ({ meta: [{ title: "Agendar Hora — Happy Smile" }] }),
  component: AgendarPage,
});

const horarios = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30", "17:00"];

function AgendarPage() {
  const s = useClinic();
  const [paso, setPaso] = useState(1);
  const [espId, setEspId] = useState<string | null>(null);
  const [profId, setProfId] = useState<string | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);

  const profsDisp = espId ? s.profesionales.filter((p) => p.especialidadId === espId) : [];
  const esp = s.especialidades.find((e) => e.id === espId);
  const prof = s.profesionales.find((p) => p.id === profId);

  const proximaDias = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toISOString().slice(0, 10);
  });

  const confirmar = () => {
    if (!profId || !espId || !fecha || !hora) return;
    const [h, m] = hora.split(":").map(Number);
    const d = new Date(fecha); d.setHours(h!, m!, 0, 0);
    s.addCita({
      pacienteId: s.pacienteActualId,
      profesionalId: profId,
      especialidadId: espId,
      fechaISO: d.toISOString(),
      duracionMin: esp?.duracionMin ?? 30,
      box: "Box " + Math.ceil(Math.random() * 4),
      estado: "Confirmada",
    });
    setPaso(6);
    toast.success("¡Hora agendada con éxito!");
  };

  const Steps = () => (
    <div className="mb-6 flex items-center gap-2">
      {[1,2,3,4,5].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div className={"grid h-7 w-7 place-items-center rounded-full text-xs font-bold " + (paso >= n ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground")}>{n}</div>
          {n < 5 && <div className={"h-0.5 w-6 " + (paso > n ? "bg-brand" : "bg-muted")} />}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title="Agendar Hora" subtitle="Reserva tu próxima cita en pocos pasos" />
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6">
        {paso < 6 && <Steps />}

        {paso === 1 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Selecciona una especialidad</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.especialidades.map((e) => (
                <button key={e.id} onClick={() => { setEspId(e.id); setPaso(2); }} className={"rounded-xl border p-4 text-left transition-all hover:border-brand " + (espId === e.id ? "border-brand bg-brand-soft" : "border-border")}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{e.icono}</span>
                    <div><div className="font-semibold">{e.nombre}</div><div className="text-xs text-muted-foreground">{e.duracionMin} min</div></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 2 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Selecciona un especialista</h2>
            <div className="grid gap-3">
              {profsDisp.map((p) => (
                <button key={p.id} onClick={() => { setProfId(p.id); setPaso(3); }} className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-brand">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-brand text-sm font-bold text-brand-foreground">{p.nombre.split(" ").slice(0,2).map((n) => n[0]).join("")}</div>
                  <div className="min-w-0 flex-1"><div className="font-semibold">{p.nombre}</div><div className="text-xs text-muted-foreground">{p.horario}</div></div>
                </button>
              ))}
            </div>
            <button onClick={() => setPaso(1)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Volver</button>
          </div>
        )}

        {paso === 3 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Selecciona una fecha</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
              {proximaDias.map((d) => (
                <button key={d} onClick={() => { setFecha(d); setPaso(4); }} className={"rounded-lg border p-2 text-center text-xs " + (fecha === d ? "border-brand bg-brand-soft" : "border-border hover:border-brand")}>
                  <div className="font-semibold">{formatDate(d).slice(0, 5)}</div>
                  <div className="text-muted-foreground">{new Date(d).toLocaleDateString("es-CL", { weekday: "short" })}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setPaso(2)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Volver</button>
          </div>
        )}

        {paso === 4 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Selecciona un horario</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {horarios.map((h) => (
                <button key={h} onClick={() => { setHora(h); setPaso(5); }} className={"rounded-lg border py-2 text-sm font-medium " + (hora === h ? "border-brand bg-brand-soft text-brand" : "border-border hover:border-brand")}>{h}</button>
              ))}
            </div>
            <button onClick={() => setPaso(3)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Volver</button>
          </div>
        )}

        {paso === 5 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Confirma tu cita</h2>
            <div className="rounded-xl bg-brand-soft p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Especialidad</dt><dd className="font-semibold">{esp?.nombre}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Profesional</dt><dd className="font-semibold">{prof?.nombre}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Fecha</dt><dd className="font-semibold">{fecha && formatDate(fecha)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Horario</dt><dd className="font-semibold">{hora}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Duración</dt><dd className="font-semibold">{esp?.duracionMin} min</dd></div>
              </dl>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPaso(4)} className="rounded-lg border border-border px-4 py-2 text-sm">← Volver</button>
              <button onClick={confirmar} className="flex-1 rounded-lg bg-brand py-2 text-sm font-semibold text-brand-foreground hover:opacity-90">Confirmar hora</button>
            </div>
          </div>
        )}

        {paso === 6 && (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
            <h2 className="mt-4 font-display text-2xl font-bold">¡Hora agendada!</h2>
            <p className="mt-2 text-sm text-muted-foreground">Te enviamos la confirmación por correo. Te esperamos el {fecha && formatDate(fecha)} a las {hora}.</p>
            <button onClick={() => { setPaso(1); setEspId(null); setProfId(null); setFecha(null); setHora(null); }} className="mt-6 rounded-lg bg-brand px-6 py-2 text-sm font-semibold text-brand-foreground">Agendar otra hora</button>
          </div>
        )}
      </div>
    </>
  );
}
