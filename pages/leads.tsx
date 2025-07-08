// app/leads/page.tsx
"use client";

import { useState } from "react";
import { Lead, scrapeLeadsFromDuckDuckGo } from "@/lib/scraper/duckduckgoLeadsScraper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LeadResultsTable } from "@/components/LeadResultsTable";

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">LeadScanner 🕵️</h1>
      <div className="flex gap-2 mb-4">
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
    </div>
  );
}
