import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeLeadsFromDuckDuckGo } from "@/lib/scraper/duckduckgoLeadsScraper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { keyword, location } = req.body;

  if (!keyword || !location) {
    return res.status(400).json({ success: false, message: "Missing keyword or location" });
  }

  try {
    const leads = await scrapeLeadsFromDuckDuckGo(keyword, location);
    return res.status(200).json({ success: true, data: leads });
  } catch (err: any) {
    console.error("❌ Scraper error:", err.message);
    return res.status(500).json({ success: false, message: "Scraping failed", error: err.message });
  }
}
