import { createFileRoute } from "@tanstack/react-router";
import { AdminPanelFinanciero } from "@/components/admin-panel-financiero";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Panel Financiero — Happy Smile" }] }),
  component: AdminHome,
});

function AdminHome() {
  return <AdminPanelFinanciero />;
}
