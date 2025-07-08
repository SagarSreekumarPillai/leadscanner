"use client";

import { Lead } from "@/lib/scraper/googleLeadsScraper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";


interface Props {
  leads: Lead[];
}

export function LeadResultsTable({ leads }: Props) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`, {
      description: text,
    });
  };

  return (
    <Card className="p-4 mt-4 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white dark:bg-black shadow-sm z-10">
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Website</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Source</th>
          </tr>
        </thead>
        <tbody>
        {leads.map((lead, idx) => (
            <tr
            key={idx}
            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
            <td className="p-2">{lead.name}</td>
            <td className="p-2 text-blue-600 underline">
                <a href={lead.website} target="_blank" rel="noopener noreferrer">
                {lead.website}
                </a>
            </td>
            <td className="p-2">
                <div className="flex items-center gap-2">
                {lead.email || "-"}
                {lead.email && (
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(lead.phone!, "Email")}
                    >
                    <Copy size={14} />
                    </Button>
                )}
                </div>
            </td>
            <td className="p-2">
                <div className="flex items-center gap-2">
                {lead.phone || "-"}
                {lead.phone && (
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(lead.phone!, "Phone")}
                    >
                    <Copy size={14} />
                    </Button>
                )}
                </div>
            </td>
            <td className="p-2">{lead.source}</td>
            </tr>
        ))}
        </tbody>

      </table>
    </Card>
  );
}
