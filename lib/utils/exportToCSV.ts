import { toast } from "sonner";

export function exportLeadsToCSV(leads: any[], filename = "leads.csv") {
  if (!leads || leads.length === 0) return;

  const headers = Object.keys(leads[0]);
  const rows = leads.map((lead) =>
    headers
      .map((key) => {
        const val = lead[key] ?? "";
        const safe = val.toString().replace(/"/g, '""');
        return `"${safe}"`;
      })
      .join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();

  toast.success("Leads downloaded as CSV", {
    description: `${leads.length} lead${leads.length > 1 ? "s" : ""} saved to ${filename}`,
  });
}
