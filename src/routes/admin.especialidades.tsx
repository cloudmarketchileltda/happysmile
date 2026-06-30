import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { formatCLP } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/especialidades")({
  head: () => ({ meta: [{ title: "Especialidades — Admin Happy Smile" }] }),
  component: AdminEsp,
});

const empty = { nombre: "", descripcion: "", icono: "✨", duracionMin: 30, precioBase: 0 };

function AdminEsp() {
  const s = useClinic();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [delId, setDelId] = useState<string | null>(null);

  const save = () => {
    if (!form.nombre) {
      toast.error("Nombre requerido");
      return;
    }
    if (editId) {
      s.updateEspecialidad(editId, form);
      toast.success("Especialidad actualizada");
    } else {
      s.addEspecialidad(form);
      toast.success("Especialidad agregada");
    }
    setOpen(false);
  };
  const del = () => {
    if (delId) {
      s.deleteEspecialidad(delId);
      toast.success("Especialidad eliminada");
      setDelId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Gestión de Especialidades"
        action={
          <button
            onClick={() => {
              setEditId(null);
              setForm(empty);
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
          >
            <Plus className="h-4 w-4" />
            Nueva
          </button>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Especialidad</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-right">Duración</th>
                <th className="p-3 text-right">Precio base</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {s.especialidades.map((e) => (
                <tr key={e.id}>
                  <td className="p-3">
                    <span className="mr-2">{e.icono}</span>
                    <span className="font-medium">{e.nombre}</span>
                  </td>
                  <td className="p-3 text-muted-foreground line-clamp-1">{e.descripcion}</td>
                  <td className="p-3 text-right">{e.duracionMin} min</td>
                  <td className="p-3 text-right">{formatCLP(e.precioBase)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditId(e.id);
                          setForm(e);
                          setOpen(true);
                        }}
                        className="grid h-8 w-8 place-items-center rounded hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDelId(e.id)}
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
        title={editId ? "Editar especialidad" : "Nueva especialidad"}
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
          <Field label="Nombre">
            <input
              className={inputCls}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </Field>
          <Field label="Ícono (emoji)">
            <input
              className={inputCls}
              value={form.icono}
              onChange={(e) => setForm({ ...form, icono: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descripción">
              <textarea
                rows={3}
                className={inputCls}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Duración (min)">
            <input
              type="number"
              className={inputCls}
              value={form.duracionMin}
              onChange={(e) => setForm({ ...form, duracionMin: Number(e.target.value) })}
            />
          </Field>
          <Field label="Precio base (CLP)">
            <input
              type="number"
              className={inputCls}
              value={form.precioBase}
              onChange={(e) => setForm({ ...form, precioBase: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!delId}
        onClose={() => setDelId(null)}
        title="¿Eliminar especialidad?"
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
              onClick={del}
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
