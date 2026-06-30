import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalLayout, type NavItem } from "@/components/portal-layout";
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  CalendarPlus,
  CreditCard,
  User,
  ClipboardEdit,
} from "lucide-react";
import { useClinic } from "@/store/clinic-store";

const items: NavItem[] = [
  { to: "/paciente", label: "Inicio", icon: LayoutDashboard },
  { to: "/paciente/tratamientos", label: "Mis Tratamientos", icon: Stethoscope },
  { to: "/paciente/horas", label: "Mis Horas", icon: Calendar },
  { to: "/paciente/agendar", label: "Agendar Hora", icon: CalendarPlus },
  { to: "/paciente/modificar", label: "Modificar / Cancelar", icon: ClipboardEdit },
  { to: "/paciente/pagos", label: "Mis Pagos", icon: CreditCard },
  { to: "/paciente/perfil", label: "Mi Perfil", icon: User },
];

export const Route = createFileRoute("/paciente")({
  component: PacienteLayout,
});

function PacienteLayout() {
  const paciente = useClinic((s) => s.pacientes.find((p) => p.id === s.pacienteActualId)!);
  return (
    <PortalLayout
      items={items}
      portalLabel="Portal Paciente"
      userName={paciente.nombre}
      userMeta={`Ficha ${paciente.ficha}`}
    >
      <Outlet />
    </PortalLayout>
  );
}
