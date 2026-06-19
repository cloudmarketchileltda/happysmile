export const formatCLP = (amount: number): string => {
  return `$${Math.round(amount).toLocaleString("es-CL")}`;
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const formatDateTime = (iso: string): string => `${formatDate(iso)} ${formatTime(iso)}`;

export const monthName = (idx: number): string =>
  ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][idx] ?? "";
