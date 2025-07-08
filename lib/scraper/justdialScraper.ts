import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

interface Lead {
  name: string;
  address: string;
  source: string;
}

export async function scrapeJustDial(keyword: string, location: string): Promise<Lead[]> {
  const searchQuery = `${keyword} in ${location}`.replace(/\s+/g, "-");
  const url = `https://www.justdial.com/${location}/${searchQuery}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  console.log("🌐 Navigating to:", url);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Scroll a few times to trigger lazy loading
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  
  await page.waitForSelector(".store-details", { timeout: 10000 });
  
  const html = await page.content();
  const $ = cheerio.load(html);

  const leads: Lead[] = [];

  $(".store-details").each((_, el) => {
    const name = $(el).find(".lng_cont_name").text().trim();
    const address = $(el).find(".cont_sw_addr").text().trim();

    if (name) {
      console.log("✅ Found business:", name, "|", address);
      leads.push({
        name,
        address,
        source: "JustDial",
      });
    }
  });

  await browser.close();
  console.log("🎯 Final leads:", leads.length);
  return leads;
}
