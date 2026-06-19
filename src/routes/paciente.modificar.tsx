import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge, EmptyState } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { formatDate, formatTime } from "@/lib/format";
import { ClipboardEdit } from "lucide-react";

export const Route = createFileRoute("/paciente/modificar")({
  head: () => ({ meta: [{ title: "Modificar / Cancelar — Happy Smile" }] }),
  component: ModificarPage,
});

function ModificarPage() {
  const s = useClinic();
  const proximas = s.citas
    .filter((c) => c.pacienteId === s.pacienteActualId && new Date(c.fechaISO) >= new Date() && c.estado !== "Cancelada")
    .sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));

  const [editId, setEditId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  const editingCita = s.citas.find((c) => c.id === editId);

  const guardarCambio = () => {
    if (!editId || !nuevaFecha || !nuevaHora) return;
    const [h, m] = nuevaHora.split(":").map(Number);
    const d = new Date(nuevaFecha); d.setHours(h!, m!, 0, 0);
    s.updateCita(editId, { fechaISO: d.toISOString(), estado: "Pendiente" });
    toast.success("Cita modificada — pendiente de confirmación");
    setEditId(null);
  };

  const cancelar = () => {
    if (!cancelId) return;
    s.updateCita(cancelId, { estado: "Cancelada" });
    toast.success("Cita cancelada");
    setCancelId(null);
  };

  return (
    <>
      <PageHeader title="Modificar / Cancelar Hora" subtitle="Gestiona tus próximas citas" />
      {proximas.length === 0 ? (
        <EmptyState icon={<ClipboardEdit className="h-6 w-6" />} title="No tienes citas modificables" />
      ) : (
        <div className="space-y-3">
          {proximas.map((c) => {
            const prof = s.profesionales.find((p) => p.id === c.profesionalId);
            const esp = s.especialidades.find((e) => e.id === c.especialidadId);
            return (
              <div key={c.id} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{esp?.nombre}</span><EstadoBadge estado={c.estado} /></div>
                  <div className="text-sm text-muted-foreground">{prof?.nombre} · {c.box}</div>
                  <div className="text-sm font-medium">{formatDate(c.fechaISO)} · {formatTime(c.fechaISO)}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditId(c.id); setNuevaFecha(c.fechaISO.slice(0, 10)); setNuevaHora(formatTime(c.fechaISO)); }} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">Modificar</button>
                  <button onClick={() => setCancelId(c.id)} className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-coral-foreground hover:opacity-90">Cancelar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Modificar cita"
        description={editingCita ? `${formatDate(editingCita.fechaISO)} · ${formatTime(editingCita.fechaISO)}` : ""}
        footer={
          <>
            <button onClick={() => setEditId(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button>
            <button onClick={guardarCambio} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Guardar cambios</button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Nueva fecha"><input type="date" className={inputCls} value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} /></Field>
          <Field label="Nuevo horario"><input type="time" className={inputCls} value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} /></Field>
        </div>
      </Modal>

      <Modal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="¿Cancelar esta cita?"
        description="Esta acción no se puede deshacer."
        size="sm"
        footer={
          <>
            <button onClick={() => setCancelId(null)} className="rounded-lg border border-border px-4 py-2 text-sm">No, mantener</button>
            <button onClick={cancelar} className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground">Sí, cancelar</button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Si necesitas reagendar, puedes hacerlo desde "Agendar Hora".</p>
      </Modal>
    </>
  );
}
