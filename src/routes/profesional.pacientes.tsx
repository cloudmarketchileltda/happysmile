import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge } from "@/components/portal-layout";
import { formatDate } from "@/lib/format";
import { Search } from "lucide-react";

export const Route = createFileRoute("/profesional/pacientes")({
  head: () => ({ meta: [{ title: "Mis Pacientes — Happy Smile" }] }),
  component: PacientesProf,
});

function PacientesProf() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const [q, setQ] = useState("");

  const misTrats = s.tratamientos.filter((t) => t.profesionalId === prof.id);
  const ids = Array.from(new Set(misTrats.map((t) => t.pacienteId)));
  const pacientes = ids.map((id) => s.pacientes.find((p) => p.id === id)!).filter(Boolean);
  const filtered = pacientes.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Mis Pacientes" subtitle="Pacientes bajo tu atención" />
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 self-center text-muted-foreground" />
        <input className="bg-transparent text-sm outline-none" placeholder="Buscar paciente…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr><th className="p-3 text-left">Paciente</th><th className="p-3 text-left">Tratamiento activo</th><th className="p-3 text-left">Próxima cita</th><th className="p-3 text-left">Estado</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const t = misTrats.find((x) => x.pacienteId === p.id && x.estado === "En curso") ?? misTrats.find((x) => x.pacienteId === p.id);
                const prox = s.citas.filter((c) => c.pacienteId === p.id && c.profesionalId === prof.id && new Date(c.fechaISO) >= new Date() && c.estado !== "Cancelada").sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO))[0];
                return (
                  <tr key={p.id}>
                    <td className="p-3"><div className="font-semibold">{p.nombre}</div><div className="text-xs text-muted-foreground">{p.ficha}</div></td>
                    <td className="p-3">{t?.nombre ?? "—"}</td>
                    <td className="p-3">{prox ? formatDate(prox.fechaISO) : "—"}</td>
                    <td className="p-3">{t && <EstadoBadge estado={t.estado} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
