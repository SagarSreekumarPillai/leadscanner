// app/leads/page.tsx
"use client";

import { useState } from "react";
import { Lead, scrapeLeadsFromDuckDuckGo } from "@/lib/scraper/duckduckgoLeadsScraper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LeadResultsTable } from "@/components/LeadResultsTable";
import { exportLeadsToCSV } from "@/lib/utils/exportToCSV";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LeadScannerPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!keyword || !location) return;
    setLoading(true);
    setLeads([]);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, location }),
      });
      const json = await res.json();
      setLeads(json.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    // <div className="max-w-4xl mx-auto p-6 min-h-screen transition-colors bg-white text-black dark:bg-black dark:text-white">
    <div className="w-full min-h-screen p-4 bg-white text-black dark:bg-black dark:text-white">   
    <ThemeToggle />
      <h1 className="text-2xl font-bold mb-4">LeadScanner 🕵️</h1>
      <div className="max-w-7xl mx-auto p-4 flex gap-2 mb-4">
        <Input
          placeholder="Enter business keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {leads.length > 0 && <LeadResultsTable leads={leads} />}
      {leads.length > 0 && (
        <Button className="mt-4" onClick={() => exportLeadsToCSV(leads)}>
            Download CSV
        </Button>
        )}

    </div>
  );
}
