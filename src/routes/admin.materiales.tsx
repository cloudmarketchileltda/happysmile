import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, StatCard } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { formatCLP } from "@/lib/format";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/materiales")({
  head: () => ({ meta: [{ title: "Materiales — Admin Happy Smile" }] }),
  component: AdminMat,
});

const empty = {
  nombre: "",
  categoria: "",
  unidad: "",
  stock: 0,
  stockMin: 0,
  precioUnit: 0,
  proveedor: "",
};

function AdminMat() {
  const s = useClinic();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const filtered = s.materiales.filter((m) => m.nombre.toLowerCase().includes(q.toLowerCase()));
  const bajoStock = s.materiales.filter((m) => m.stock < m.stockMin);

  const save = () => {
    if (!form.nombre) {
      toast.error("Nombre requerido");
      return;
    }
    if (editId) {
      s.updateMaterial(editId, form);
      toast.success("Material actualizado");
    } else {
      s.addMaterial(form);
      toast.success("Material agregado");
    }
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Materiales e Insumos"
        subtitle="Inventario y control de stock"
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
            Nuevo
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total ítems" value={String(s.materiales.length)} tone="brand" />
        <StatCard
          label="Bajo stock mínimo"
          value={String(bajoStock.length)}
          tone={bajoStock.length > 0 ? "coral" : "success"}
        />
        <StatCard
          label="Valor inventario"
          value={formatCLP(s.materiales.reduce((a, m) => a + m.stock * m.precioUnit, 0))}
        />
      </div>

      {bajoStock.length > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-coral/30 bg-coral/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
          <div className="text-sm">
            <div className="font-semibold text-coral">
              Atención: {bajoStock.length} ítem(s) bajo stock mínimo
            </div>
            <div className="text-muted-foreground">{bajoStock.map((m) => m.nombre).join(", ")}</div>
          </div>
        </div>
      )}

      <input
        className="mt-4 mb-4 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
        placeholder="Buscar material…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Material</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-right">Mín</th>
                <th className="p-3 text-right">Precio</th>
                <th className="p-3 text-left">Proveedor</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => {
                const bajo = m.stock < m.stockMin;
                return (
                  <tr key={m.id} className={bajo ? "bg-coral/5" : ""}>
                    <td className="p-3 font-medium">
                      {m.nombre}
                      <div className="text-xs text-muted-foreground">{m.unidad}</div>
                    </td>
                    <td className="p-3">{m.categoria}</td>
                    <td className={"p-3 text-right font-semibold " + (bajo ? "text-coral" : "")}>
                      {m.stock}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">{m.stockMin}</td>
                    <td className="p-3 text-right">{formatCLP(m.precioUnit)}</td>
                    <td className="p-3 text-muted-foreground">{m.proveedor}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(m.id);
                            setForm(m);
                            setOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded hover:bg-muted"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDelId(m.id)}
                          className="grid h-8 w-8 place-items-center rounded text-coral hover:bg-coral/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? "Editar material" : "Nuevo material"}
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
          <Field label="Nombre">
            <input
              className={inputCls}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </Field>
          <Field label="Categoría">
            <input
              className={inputCls}
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
          </Field>
          <Field label="Unidad">
            <input
              className={inputCls}
              value={form.unidad}
              onChange={(e) => setForm({ ...form, unidad: e.target.value })}
            />
          </Field>
          <Field label="Proveedor">
            <input
              className={inputCls}
              value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              className={inputCls}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </Field>
          <Field label="Stock mínimo">
            <input
              type="number"
              className={inputCls}
              value={form.stockMin}
              onChange={(e) => setForm({ ...form, stockMin: Number(e.target.value) })}
            />
          </Field>
          <Field label="Precio unitario">
            <input
              type="number"
              className={inputCls}
              value={form.precioUnit}
              onChange={(e) => setForm({ ...form, precioUnit: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!delId}
        onClose={() => setDelId(null)}
        title="¿Eliminar material?"
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
                  s.deleteMaterial(delId);
                  toast.success("Material eliminado");
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
