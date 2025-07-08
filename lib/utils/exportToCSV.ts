export function exportLeadsToCSV(leads: any[], filename = "leads.csv") {
    if (!leads || leads.length === 0) return;
  
    // Extract headers
    const headers = Object.keys(leads[0]);
  
    // Escape CSV values properly
    const rows = leads.map((lead) =>
      headers
        .map((key) => {
          const val = lead[key] ?? "";
          const safe = val.toString().replace(/"/g, '""'); // Escape quotes
          return `"${safe}"`;
        })
        .join(",")
    );
  
    // Combine header + rows
    const csvContent = [headers.join(","), ...rows].join("\n");
  
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
  
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();
  }
  