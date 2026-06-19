// Alias del Panel Financiero (reutiliza el componente compartido)
import { createFileRoute } from "@tanstack/react-router";
import { AdminPanelFinanciero } from "@/components/admin-panel-financiero";

export const Route = createFileRoute("/admin/financiero")({
  head: () => ({ meta: [{ title: "Panel Financiero — Admin Happy Smile" }] }),
  component: AdminPanelFinanciero,
});
