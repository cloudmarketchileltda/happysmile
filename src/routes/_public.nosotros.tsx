import { createFileRoute } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { Heart, Award, Users } from "lucide-react";

export const Route = createFileRoute("/_public/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — Happy Smile" },
      { name: "description", content: "Conoce la historia, misión y equipo de Happy Smile." },
    ],
  }),
  component: NosotrosPage,
});

function NosotrosPage() {
  const profesionales = useClinic((s) => s.profesionales);
  const especialidades = useClinic((s) => s.especialidades);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Sobre Happy Smile</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Hace más de 15 años cuidamos las sonrisas de las familias chilenas combinando tecnología,
          calidez humana y excelencia clínica.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Heart,
            title: "Nuestra misión",
            text: "Entregar atención dental de excelencia con un trato cercano y personalizado para cada paciente.",
          },
          {
            icon: Award,
            title: "Nuestra visión",
            text: "Ser la clínica dental de referencia en Chile por su calidad clínica y experiencia del paciente.",
          },
          {
            icon: Users,
            title: "Nuestros valores",
            text: "Confianza, compromiso, innovación y respeto guían cada decisión clínica y humana.",
          },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold">Nuestro equipo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Especialistas con vocación y experiencia.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profesionales.map((p) => {
            const esp = especialidades.find((e) => e.id === p.especialidadId);
            return (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-5 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-2xl font-bold text-brand-foreground">
                  {p.nombre
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-3 font-display font-bold">{p.nombre}</h3>
                <div className="text-sm text-brand">{esp?.nombre}</div>
                <p className="mt-2 text-xs text-muted-foreground">{p.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
