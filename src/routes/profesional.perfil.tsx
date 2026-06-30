import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinic-store";
import { PageHeader } from "@/components/portal-layout";
import { Field, inputCls } from "@/components/modal";

export const Route = createFileRoute("/profesional/perfil")({
  head: () => ({ meta: [{ title: "Mi Perfil — Happy Smile" }] }),
  component: PerfilProf,
});

function PerfilProf() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const esp = s.especialidades.find((e) => e.id === prof.especialidadId);
  const [form, setForm] = useState(prof);
  const [disp, setDisp] = useState({
    lun: true,
    mar: true,
    mie: true,
    jue: true,
    vie: true,
    sab: false,
    dom: false,
  });

  const dias = [
    ["lun", "Lunes"],
    ["mar", "Martes"],
    ["mie", "Miércoles"],
    ["jue", "Jueves"],
    ["vie", "Viernes"],
    ["sab", "Sábado"],
    ["dom", "Domingo"],
  ] as const;

  const guardar = () => {
    s.updateProfesional(prof.id, form);
    toast.success("Perfil actualizado");
  };

  return (
    <>
      <PageHeader title="Mi Perfil Profesional" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand text-2xl font-bold text-brand-foreground">
            {prof.nombre
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="mt-4 font-display text-lg font-bold">{prof.nombre}</div>
          <div className="text-sm text-brand">{esp?.nombre}</div>
          <div className="mt-2 text-xs text-muted-foreground">{prof.credenciales}</div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <Field label="Nombre">
              <input
                className={inputCls}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Field>
            <Field label="RUT">
              <input
                className={inputCls}
                value={form.rut}
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <input
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Teléfono">
              <input
                className={inputCls}
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Biografía">
                <textarea
                  rows={3}
                  className={inputCls}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 font-display text-lg font-bold">Disponibilidad horaria</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {dias.map(([k, label]) => (
                <label
                  key={k}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <span>{label}</span>
                  <button
                    onClick={() => setDisp({ ...disp, [k]: !disp[k] })}
                    className={
                      "h-6 w-11 rounded-full transition-colors " +
                      (disp[k] ? "bg-brand" : "bg-muted")
                    }
                  >
                    <span
                      className={
                        "block h-5 w-5 transform rounded-full bg-white transition-transform " +
                        (disp[k] ? "translate-x-6" : "translate-x-0.5")
                      }
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={guardar}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </>
  );
}
