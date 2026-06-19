import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/profesionales")({
  head: () => ({ meta: [{ title: "Profesionales — Admin Happy Smile" }] }),
  component: AdminProf,
});

const emptyForm = { nombre: "", especialidadId: "", rut: "", email: "", telefono: "", horario: "", comision: 30, bio: "", credenciales: "" };

function AdminProf() {
  const s = useClinic();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = s.profesionales.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()));

  const openNew = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (id: string) => { const p = s.profesionales.find((x) => x.id === id)!; setEditId(id); setForm(p); setOpen(true); };
  const save = () => {
    if (!form.nombre || !form.especialidadId) { toast.error("Completa los campos obligatorios"); return; }
    if (editId) { s.updateProfesional(editId, form); toast.success("Profesional actualizado"); }
    else { s.addProfesional(form); toast.success("Profesional agregado"); }
    setOpen(false);
  };
  const del = () => { if (delId) { s.deleteProfesional(delId); toast.success("Profesional eliminado"); setDelId(null); } };

  return (
    <>
      <PageHeader title="Gestión de Profesionales" subtitle="Mantenedor de especialistas" action={<button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"><Plus className="h-4 w-4" />Nuevo</button>} />
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-lg border border-border bg-card px-3 py-2"><Search className="h-4 w-4 self-center text-muted-foreground" /><input className="bg-transparent text-sm outline-none" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} /></div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="p-3 text-left">Nombre</th><th className="p-3 text-left">Especialidad</th><th className="p-3 text-left">RUT</th><th className="p-3 text-left">Email</th><th className="p-3 text-right">Comisión</th><th className="p-3"></th></tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3">{s.especialidades.find((e) => e.id === p.especialidadId)?.nombre}</td>
                  <td className="p-3 text-muted-foreground">{p.rut}</td>
                  <td className="p-3 text-muted-foreground">{p.email}</td>
                  <td className="p-3 text-right">{p.comision}%</td>
                  <td className="p-3"><div className="flex justify-end gap-1"><button onClick={() => openEdit(p.id)} className="grid h-8 w-8 place-items-center rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setDelId(p.id)} className="grid h-8 w-8 place-items-center rounded text-coral hover:bg-coral/10"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Editar profesional" : "Nuevo profesional"} size="lg" footer={<><button onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button><button onClick={save} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Guardar</button></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre"><input className={inputCls} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
          <Field label="Especialidad"><select className={inputCls} value={form.especialidadId} onChange={(e) => setForm({ ...form, especialidadId: e.target.value })}><option value="">Seleccionar…</option>{s.especialidades.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select></Field>
          <Field label="RUT"><input className={inputCls} value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Teléfono"><input className={inputCls} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></Field>
          <Field label="Horario"><input className={inputCls} value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} /></Field>
          <Field label="Comisión (%)"><input type="number" className={inputCls} value={form.comision} onChange={(e) => setForm({ ...form, comision: Number(e.target.value) })} /></Field>
          <Field label="Credenciales"><input className={inputCls} value={form.credenciales} onChange={(e) => setForm({ ...form, credenciales: e.target.value })} /></Field>
        </div>
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="¿Eliminar profesional?" size="sm" footer={<><button onClick={() => setDelId(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button><button onClick={del} className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground">Eliminar</button></>}>
        <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}
