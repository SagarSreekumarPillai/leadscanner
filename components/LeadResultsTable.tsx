"use client";

import { Lead } from "@/lib/scraper/googleLeadsScraper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  leads: Lead[];
}

export function LeadResultsTable({ leads }: Props) {
  return (
    <Card className="p-4 mt-4">
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Website</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Source</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{lead.name}</td>
              <td className="p-2 text-blue-600 underline">
                <a href={lead.website} target="_blank" rel="noopener noreferrer">
                  {lead.website}
                </a>
              </td>
              <td className="p-2">{lead.email || "-"}</td>
              <td className="p-2">{lead.phone || "-"}</td>
              <td className="p-2">{lead.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
