import { NextApiRequest, NextApiResponse } from "next";
import { scrapeLeadsFromDuckDuckGo } from "@/lib/scraper/duckduckgoLeadsScraper";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { keyword, location } = req.body;

  if (!keyword || !location) {
    return res.status(400).json({ message: "Missing keyword or location" });
  }

  try {
    console.log("📥 Incoming payload:", keyword, location);

    const leads = await scrapeLeadsFromDuckDuckGo(keyword, location);
    console.log("✅ Scraped data length:", leads.length);

    if (leads.length > 0) {
      const { error } = await supabase.from("leads").insert(leads);
      if (error) {
        console.error("❌ Failed to save leads:", error.message);
      } else {
        console.log(`✅ Saved ${leads.length} leads to Supabase`);
      }
    }

    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    console.error("❌ Scraper error:", error);
    return res.status(500).json({ success: false, message: "Scraping failed", error });
  }
}