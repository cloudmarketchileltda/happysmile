import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { formatDate, formatTime } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { EstadoCita } from "@/data/mock";

export const Route = createFileRoute("/admin/agenda")({
  head: () => ({ meta: [{ title: "Agenda — Admin Happy Smile" }] }),
  component: AdminAgenda,
});

function AdminAgenda() {
  const s = useClinic();
  const [fProf, setFProf] = useState("");
  const [fEsp, setFEsp] = useState("");
  const [fFecha, setFFecha] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({
    pacienteId: "",
    profesionalId: "",
    especialidadId: "",
    fecha: "",
    hora: "10:00",
    duracionMin: 30,
    box: "Box 1",
    estado: "Confirmada" as EstadoCita,
  });

  const filtered = s.citas
    .filter((c) => !fProf || c.profesionalId === fProf)
    .filter((c) => !fEsp || c.especialidadId === fEsp)
    .filter((c) => !fFecha || c.fechaISO.slice(0, 10) === fFecha)
    .sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));

  const save = () => {
    if (!form.pacienteId || !form.profesionalId || !form.especialidadId || !form.fecha) {
      toast.error("Completa los campos");
      return;
    }
    const [h, m] = form.hora.split(":").map(Number);
    const d = new Date(form.fecha);
    d.setHours(h!, m!, 0, 0);
    const payload = {
      pacienteId: form.pacienteId,
      profesionalId: form.profesionalId,
      especialidadId: form.especialidadId,
      fechaISO: d.toISOString(),
      duracionMin: form.duracionMin,
      box: form.box,
      estado: form.estado,
    };
    if (editId) {
      s.updateCita(editId, payload);
      toast.success("Cita actualizada");
    } else {
      s.addCita(payload);
      toast.success("Cita creada");
    }
    setOpen(false);
  };
  const openNew = () => {
    setEditId(null);
    setForm({
      pacienteId: "",
      profesionalId: "",
      especialidadId: "",
      fecha: new Date().toISOString().slice(0, 10),
      hora: "10:00",
      duracionMin: 30,
      box: "Box 1",
      estado: "Confirmada",
    });
    setOpen(true);
  };
  const openEdit = (id: string) => {
    const c = s.citas.find((x) => x.id === id)!;
    setEditId(id);
    setForm({
      pacienteId: c.pacienteId,
      profesionalId: c.profesionalId,
      especialidadId: c.especialidadId,
      fecha: c.fechaISO.slice(0, 10),
      hora: formatTime(c.fechaISO),
      duracionMin: c.duracionMin,
      box: c.box,
      estado: c.estado,
    });
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Gestión de Agenda"
        subtitle="Todas las citas de la clínica"
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
          >
            <Plus className="h-4 w-4" />
            Nueva cita
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
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
        <input
          type="date"
          className={inputCls + " w-auto"}
          value={fFecha}
          onChange={(e) => setFFecha(e.target.value)}
        />
        <button
          onClick={() => {
            setFProf("");
            setFEsp("");
            setFFecha("");
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          Limpiar
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Paciente</th>
                <th className="p-3 text-left">Profesional</th>
                <th className="p-3 text-left">Especialidad</th>
                <th className="p-3 text-left">Box</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 whitespace-nowrap">
                    {formatDate(c.fechaISO)} {formatTime(c.fechaISO)}
                  </td>
                  <td className="p-3 font-medium">
                    {s.pacientes.find((p) => p.id === c.pacienteId)?.nombre}
                  </td>
                  <td className="p-3">
                    {s.profesionales.find((p) => p.id === c.profesionalId)?.nombre}
                  </td>
                  <td className="p-3">
                    {s.especialidades.find((e) => e.id === c.especialidadId)?.nombre}
                  </td>
                  <td className="p-3">{c.box}</td>
                  <td className="p-3">
                    <EstadoBadge estado={c.estado} />
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(c.id)}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDelId(c.id)}
                        className="grid h-8 w-8 place-items-center rounded text-coral hover:bg-coral/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? "Editar cita" : "Nueva cita"}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
            >
              Guardar
            </button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Paciente">
            <select
              className={inputCls}
              value={form.pacienteId}
              onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
            >
              <option value="">Seleccionar…</option>
              {s.pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Profesional">
            <select
              className={inputCls}
              value={form.profesionalId}
              onChange={(e) => setForm({ ...form, profesionalId: e.target.value })}
            >
              <option value="">Seleccionar…</option>
              {s.profesionales.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Especialidad">
            <select
              className={inputCls}
              value={form.especialidadId}
              onChange={(e) => setForm({ ...form, especialidadId: e.target.value })}
            >
              <option value="">Seleccionar…</option>
              {s.especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Box">
            <input
              className={inputCls}
              value={form.box}
              onChange={(e) => setForm({ ...form, box: e.target.value })}
            />
          </Field>
          <Field label="Fecha">
            <input
              type="date"
              className={inputCls}
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
          </Field>
          <Field label="Hora">
            <input
              type="time"
              className={inputCls}
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
            />
          </Field>
          <Field label="Duración (min)">
            <input
              type="number"
              className={inputCls}
              value={form.duracionMin}
              onChange={(e) => setForm({ ...form, duracionMin: Number(e.target.value) })}
            />
          </Field>
          <Field label="Estado">
            <select
              className={inputCls}
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoCita })}
            >
              {["Confirmada", "Pendiente", "Cancelada", "Completada"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!delId}
        onClose={() => setDelId(null)}
        title="¿Eliminar cita?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDelId(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (delId) {
                  s.deleteCita(delId);
                  toast.success("Cita eliminada");
                  setDelId(null);
                }
              }}
              className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground"
            >
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}
