import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Modal, Field, inputCls } from "@/components/modal";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/admin/pacientes")({
  head: () => ({ meta: [{ title: "Pacientes — Admin Happy Smile" }] }),
  component: AdminPac,
});

const empty = { nombre: "", rut: "", email: "", telefono: "", fechaNacimiento: "", ficha: "" };

function AdminPac() {
  const s = useClinic();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const filtered = s.pacientes.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()) || p.rut.includes(q));

  const save = () => {
    if (!form.nombre) { toast.error("Nombre requerido"); return; }
    if (editId) { s.updatePaciente(editId, form); toast.success("Paciente actualizado"); }
    else { s.addPaciente({ ...form, ficha: form.ficha || "HS-" + String(s.pacientes.length + 1).padStart(4, "0") }); toast.success("Paciente agregado"); }
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Gestión de Pacientes" action={<button onClick={() => { setEditId(null); setForm(empty); setOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"><Plus className="h-4 w-4" />Nuevo</button>} />
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-lg border border-border bg-card px-3 py-2"><Search className="h-4 w-4 self-center text-muted-foreground" /><input className="bg-transparent text-sm outline-none" placeholder="Buscar por nombre o RUT…" value={q} onChange={(e) => setQ(e.target.value)} /></div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="p-3 text-left">Ficha</th><th className="p-3 text-left">Nombre</th><th className="p-3 text-left">RUT</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Teléfono</th><th className="p-3"></th></tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-mono text-xs">{p.ficha}</td>
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3">{p.rut}</td>
                  <td className="p-3 text-muted-foreground">{p.email}</td>
                  <td className="p-3 text-muted-foreground">{p.telefono}</td>
                  <td className="p-3"><div className="flex justify-end gap-1"><button onClick={() => { setEditId(p.id); setForm(p); setOpen(true); }} className="grid h-8 w-8 place-items-center rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setDelId(p.id)} className="grid h-8 w-8 place-items-center rounded text-coral hover:bg-coral/10"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Editar paciente" : "Nuevo paciente"} size="lg" footer={<><button onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button><button onClick={save} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Guardar</button></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre completo"><input className={inputCls} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
          <Field label="RUT"><input className={inputCls} value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Teléfono"><input className={inputCls} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></Field>
          <Field label="Fecha de nacimiento"><input type="date" className={inputCls} value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} /></Field>
          <Field label="N° ficha"><input className={inputCls} value={form.ficha} onChange={(e) => setForm({ ...form, ficha: e.target.value })} placeholder="Se genera automáticamente" /></Field>
        </div>
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="¿Eliminar paciente?" size="sm" footer={<><button onClick={() => setDelId(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button><button onClick={() => { if (delId) { s.deletePaciente(delId); toast.success("Paciente eliminado"); setDelId(null); } }} className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground">Eliminar</button></>}><p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p></Modal>
    </>
  );
}
