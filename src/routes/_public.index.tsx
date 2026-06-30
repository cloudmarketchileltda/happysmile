import { createFileRoute, Link } from "@tanstack/react-router";
import { useClinic } from "@/store/clinic-store";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Happy Smile — Tu sonrisa, nuestra pasión" },
      {
        name: "description",
        content:
          "Clínica dental integral en Santiago. Implantes, ortodoncia, endodoncia y más. Agenda online.",
      },
      { property: "og:title", content: "Happy Smile — Tu sonrisa, nuestra pasión" },
      {
        property: "og:description",
        content: "Clínica dental integral en Santiago. Agenda online en minutos.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const especialidades = useClinic((s) => s.especialidades);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-soft via-background to-background">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              ✨ Clínica Dental Premium
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
              Tu sonrisa, <span className="text-brand">nuestra pasión</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              En Happy Smile combinamos tecnología, especialistas certificados y un trato cercano
              para cuidar de tu salud bucal en cada etapa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:opacity-90"
              >
                Agenda tu hora
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Regístrate gratis
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">+5.000</span>{" "}
                pacientes felices
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">15+</span> años de
                experiencia
              </div>
            </div>
          </div>
          <div className="relative grid place-items-center">
            <div className="relative aspect-square w-full max-w-md rounded-3xl bg-gradient-to-br from-brand to-brand/70 p-1 shadow-2xl">
              <img
                src="/centro2.jpg"
                alt="Happy Smile Clínica Dental"
                className="h-full w-full rounded-[22px] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-background p-4 shadow-lg ring-1 ring-border">
                <div className="text-xs font-medium text-muted-foreground">Próxima hora</div>
                <div className="font-display text-sm font-bold text-foreground">Mañana 10:00</div>
                <div className="text-xs text-brand">Dr. Rodrigo Fuentes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Nuestras Especialidades
            </h2>
            <p className="mt-2 text-muted-foreground">Cuidamos cada detalle de tu salud bucal</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {especialidades.map((e) => (
              <Link
                key={e.id}
                to="/especialidades"
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
              >
                <div className="mb-3 grid h-14 w-14 place-items-center rounded-xl bg-brand-soft text-3xl">
                  {e.icono}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{e.nombre}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.descripcion}</p>
                <div className="mt-4 text-sm font-medium text-brand group-hover:underline">
                  Conocer más →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Encuéntranos</h2>
            <p className="mt-2 text-muted-foreground">Visítanos en pleno centro de Providencia.</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <div className="font-semibold">Dirección</div>
                  <div className="text-sm text-muted-foreground">
                    La Concepcion 553, Cunco, Chile
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <div className="font-semibold">Teléfono</div>
                  <div className="text-sm text-muted-foreground">+56 2 2345 6789</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <div className="font-semibold">Horario</div>
                  <div className="text-sm text-muted-foreground">
                    Lun-Vie 09:00-19:00 · Sáb 10:00-14:00
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-border bg-brand-soft/30 text-center">
            <div>
              <MapPin className="mx-auto h-10 w-10 text-brand" />
              <div className="mt-2 font-display font-semibold">Mapa interactivo</div>
              <div className="text-sm text-muted-foreground">Cunco, Chile</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
