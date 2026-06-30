import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClinic } from "@/store/clinic-store";
import { PageHeader, EstadoBadge, EmptyState } from "@/components/portal-layout";
import { formatCLP, formatDate } from "@/lib/format";
import { ChevronDown, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/paciente/tratamientos")({
  head: () => ({ meta: [{ title: "Mis Tratamientos — Happy Smile" }] }),
  component: TratamientosPage,
});

function TratamientosPage() {
  const s = useClinic();
  const tratamientos = s.tratamientos.filter((t) => t.pacienteId === s.pacienteActualId);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Mis Tratamientos"
        subtitle="Revisa tus tratamientos activos y su historial"
      />
      {tratamientos.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-6 w-6" />}
          title="Aún no tienes tratamientos"
          description="Cuando inicies un tratamiento aparecerá aquí."
        />
      ) : (
        <div className="space-y-4">
          {tratamientos.map((t) => {
            const prof = s.profesionales.find((p) => p.id === t.profesionalId);
            const esp = s.especialidades.find((e) => e.id === t.especialidadId);
            const pagado = t.cuotas
              .filter((c) => c.estado === "Pagado")
              .reduce((a, c) => a + c.monto, 0);
            const saldo = t.costoTotal - pagado;
            const completadas = t.etapas.filter((e) => e.completada).length;
            const progreso = (completadas / t.etapas.length) * 100;
            const isOpen = open === t.id;

            return (
              <div key={t.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="p-5">
                  <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold">{t.nombre}</h3>
                        <EstadoBadge estado={t.estado} />
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {esp?.nombre} · {prof?.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Inicio: {formatDate(t.fechaInicio)}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-display text-xl font-bold">
                        {formatCLP(t.costoTotal)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Pagado: {formatCLP(pagado)} · Saldo:{" "}
                        <span className="font-semibold text-coral">{formatCLP(saldo)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Progreso</span>
                      <span>
                        {completadas}/{t.etapas.length} etapas
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-brand transition-all"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(isOpen ? null : t.id)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand"
                  >
                    {isOpen ? "Ocultar detalle" : "Ver detalle"}{" "}
                    <ChevronDown
                      className={"h-4 w-4 transition-transform " + (isOpen ? "rotate-180" : "")}
                    />
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-border bg-brand-soft/30 p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Etapas
                        </div>
                        <ul className="mt-2 space-y-2">
                          {t.etapas.map((e, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span
                                className={
                                  "grid h-5 w-5 place-items-center rounded-full text-[10px] " +
                                  (e.completada
                                    ? "bg-success text-white"
                                    : "bg-muted text-muted-foreground")
                                }
                              >
                                {e.completada ? "✓" : i + 1}
                              </span>
                              <span
                                className={
                                  e.completada ? "text-foreground" : "text-muted-foreground"
                                }
                              >
                                {e.nombre}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Notas
                        </div>
                        <p className="mt-2 text-sm text-foreground">
                          {t.notas || "Sin notas adicionales."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
