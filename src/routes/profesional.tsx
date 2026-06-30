import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalLayout, type NavItem } from "@/components/portal-layout";
import { LayoutDashboard, Calendar, Users, ClipboardList, DollarSign, User } from "lucide-react";
import { useClinic } from "@/store/clinic-store";

const items: NavItem[] = [
  { to: "/profesional", label: "Inicio", icon: LayoutDashboard },
  { to: "/profesional/agenda", label: "Mi Agenda", icon: Calendar },
  { to: "/profesional/pacientes", label: "Mis Pacientes", icon: Users },
  { to: "/profesional/actividades", label: "Actividades", icon: ClipboardList },
  { to: "/profesional/ingresos", label: "Mis Ingresos", icon: DollarSign },
  { to: "/profesional/perfil", label: "Mi Perfil", icon: User },
];

export const Route = createFileRoute("/profesional")({ component: ProfLayout });

function ProfLayout() {
  const s = useClinic();
  const prof = s.profesionales.find((p) => p.id === s.profesionalActualId)!;
  const esp = s.especialidades.find((e) => e.id === prof.especialidadId);
  return (
    <PortalLayout
      items={items}
      portalLabel="Portal Profesional"
      userName={prof.nombre}
      userMeta={esp?.nombre}
    >
      <Outlet />
    </PortalLayout>
  );
}
