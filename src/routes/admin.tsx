import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalLayout, type NavItem } from "@/components/portal-layout";
import { LayoutDashboard, UserCog, Stethoscope, Calendar, Package, Users, TrendingUp, TrendingDown, CreditCard, PieChart } from "lucide-react";

const items: NavItem[] = [
  { to: "/admin", label: "Panel Financiero", icon: LayoutDashboard },
  { to: "/admin/profesionales", label: "Profesionales", icon: UserCog },
  { to: "/admin/especialidades", label: "Especialidades", icon: Stethoscope },
  { to: "/admin/agenda", label: "Agenda", icon: Calendar },
  { to: "/admin/materiales", label: "Materiales", icon: Package },
  { to: "/admin/pacientes", label: "Pacientes", icon: Users },
  { to: "/admin/ingresos", label: "Ingresos", icon: TrendingUp },
  { to: "/admin/gastos", label: "Gastos", icon: TrendingDown },
  { to: "/admin/cuotas", label: "Cuotas y Pagos", icon: CreditCard },
  { to: "/admin/financiero", label: "Reportes", icon: PieChart },
];

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  return (
    <PortalLayout items={items} portalLabel="Administración" userName="Administrador" userMeta="Happy Smile">
      <Outlet />
    </PortalLayout>
  );
}
