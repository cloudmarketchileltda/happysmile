import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/_public/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Happy Smile" },
      { name: "description", content: "Contáctanos. Teléfono, email y dirección de Happy Smile." },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviar = () => {
    if (!nombre || !email || !mensaje) {
      toast.error("Completa todos los campos");
      return;
    }
    toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    setNombre(""); setEmail(""); setMensaje("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Contáctanos</h1>
        <p className="mt-2 text-muted-foreground">Estamos para responder tus dudas</p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Envíanos un mensaje</h2>
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Mensaje</label>
            <textarea rows={4} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
          </div>
          <button onClick={enviar} className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90">Enviar mensaje</button>
        </div>

        <div className="space-y-4">
          <div className="grid min-h-[200px] place-items-center rounded-2xl border border-dashed border-border bg-brand-soft/40">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10 text-brand" />
              <div className="mt-2 font-semibold">La Concepcion 553</div>
              <div className="text-sm text-muted-foreground">Cunco, Chile</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand" /> +56 2 2345 6789</div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand" /> hola@happysmile.cl</div>
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-brand" /> Lun-Vie 09:00-19:00 · Sáb 10:00-14:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
