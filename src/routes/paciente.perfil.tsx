import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Field, inputCls } from "@/components/modal";

export const Route = createFileRoute("/paciente/perfil")({
  head: () => ({ meta: [{ title: "Mi Perfil — Happy Smile" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const s = useClinic();
  const p = s.pacientes.find((x) => x.id === s.pacienteActualId)!;
  const [form, setForm] = useState(p);

  const guardar = () => {
    s.updatePaciente(p.id, form);
    toast.success("Cambios guardados");
  };

  return (
    <>
      <PageHeader title="Mi Perfil" subtitle="Actualiza tus datos personales" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand text-2xl font-bold text-brand-foreground">
            {p.nombre.split(" ").slice(0, 2).map((n) => n[0]).join("")}
          </div>
          <div className="mt-4 font-display text-lg font-bold">{p.nombre}</div>
          <div className="text-xs text-muted-foreground">Ficha {p.ficha}</div>
        </div>
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          <Field label="Nombre completo"><input className={inputCls} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
          <Field label="RUT"><input className={inputCls} value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Teléfono"><input className={inputCls} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></Field>
          <Field label="Fecha de nacimiento"><input type="date" className={inputCls} value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} /></Field>
          <Field label="N° ficha clínica"><input className={inputCls} value={form.ficha} disabled /></Field>
          <div className="sm:col-span-2">
            <button onClick={guardar} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90">Guardar cambios</button>
          </div>
        </div>
      </div>
    </>
  );
}
