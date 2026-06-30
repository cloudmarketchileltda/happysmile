import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { formatCLP, formatDate, monthName } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Gasto } from "@/data/mock";

export const Route = createFileRoute("/admin/gastos")({
  head: () => ({ meta: [{ title: "Gastos — Admin Happy Smile" }] }),
  component: AdminGastos,
});

const cats: Gasto["categoria"][] = [
  "Materiales",
  "Arriendo",
  "Servicios básicos",
  "Sueldos",
  "Otros",
];
const empty = {
  fecha: new Date().toISOString().slice(0, 10),
  categoria: "Materiales" as Gasto["categoria"],
  descripcion: "",
  monto: 0,
  comprobante: "",
};

function AdminGastos() {
  const s = useClinic();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const hoy = new Date();
  const data = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(hoy);
    d.setMonth(hoy.getMonth() - (5 - i));
    return {
      mes: monthName(d.getMonth()),
      monto: s.gastos
        .filter((g) => {
          const f = new Date(g.fecha);
          return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
        })
        .reduce((a, g) => a + g.monto, 0),
    };
  });

  const save = () => {
    if (!form.descripcion || !form.monto) {
      toast.error("Completa los campos");
      return;
    }
    if (editId) {
      s.updateGasto(editId, form);
      toast.success("Gasto actualizado");
    } else {
      s.addGasto(form);
      toast.success("Gasto registrado");
    }
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Control de Gastos"
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
            Nuevo gasto
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Gastos mensuales</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={((v: number) => formatCLP(v)) as never} />
              <Bar dataKey="monto" fill="oklch(0.68 0.16 22)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Comprobante</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {s.gastos
                .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
                .map((g) => (
                  <tr key={g.id}>
                    <td className="p-3">{formatDate(g.fecha)}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {g.categoria}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{g.descripcion}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{g.comprobante}</td>
                    <td className="p-3 text-right font-semibold">{formatCLP(g.monto)}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(g.id);
                            setForm(g);
                            setOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded hover:bg-muted"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDelId(g.id)}
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
        title={editId ? "Editar gasto" : "Nuevo gasto"}
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
          <Field label="Fecha">
            <input
              type="date"
              className={inputCls}
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
          </Field>
          <Field label="Categoría">
            <select
              className={inputCls}
              value={form.categoria}
              onChange={(e) =>
                setForm({ ...form, categoria: e.target.value as Gasto["categoria"] })
              }
            >
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descripción">
              <input
                className={inputCls}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Monto">
            <input
              type="number"
              className={inputCls}
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: Number(e.target.value) })}
            />
          </Field>
          <Field label="Comprobante">
            <input
              className={inputCls}
              value={form.comprobante}
              onChange={(e) => setForm({ ...form, comprobante: e.target.value })}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!delId}
        onClose={() => setDelId(null)}
        title="¿Eliminar gasto?"
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
                  s.deleteGasto(delId);
                  toast.success("Gasto eliminado");
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
