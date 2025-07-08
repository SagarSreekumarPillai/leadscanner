// File: lib/scraper/googleLeadsScraper.ts
import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";

export interface Lead {
  name: string;
  website: string;
  email?: string;
  phone?: string;
  source: string;
}

export async function scrapeLeadsFromGoogle(
  keyword: string,
  location: string
): Promise<Lead[]> {
  const searchQuery = `${keyword} in ${location}`;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  console.log("🟡 Search query:", searchQuery);
  console.log("🟡 Visiting Google URL:", googleUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  await page.goto(googleUrl, { waitUntil: "networkidle2", timeout: 30000 });
  await page.waitForSelector("a", { timeout: 10000 });

  const rawLinks: string[] = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    const urls = anchors
      .map((a) => a.href)
      .filter(
        (href) =>
          href &&
          !href.includes("google.com") &&
          !href.includes("webcache.googleusercontent") &&
          !href.startsWith("/search?")
      );
    return Array.from(new Set(urls));
  });

  console.log("🌐 Found raw Google links:", rawLinks.slice(0, 10));

  const cleanLinks = rawLinks
    .filter(
      (url) =>
        !url.includes("justdial.com") &&
        !url.includes("indiamart.com") &&
        !url.includes("sulekha.com")
    )
    .filter((url, i, self) => self.indexOf(url) === i)
    .slice(0, 10);

  console.log("✅ Cleaned links count:", cleanLinks.length);
  console.log("✅ Cleaned links:", cleanLinks);

  const leads: Lead[] = [];

  for (const site of cleanLinks) {
    console.log("🔗 Visiting site:", site);
    try {
      const contact = await scrapeContactFromWebsite(browser, site);
      leads.push({
        name: getDomainName(site),
        website: site,
        email: contact.email,
        phone: contact.phone,
        source: "Google",
      });
    } catch (err) {
      console.warn(`⚠️ Failed to scrape: ${site}`);
    }
  }

  await browser.close();
  return leads;
}

async function scrapeContactFromWebsite(browser: Browser, url: string) {
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    const html = await page.content();

    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const phoneMatch = html.match(/(\+91[\s-]?)?\d{10}/);

    return {
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
    };
  } catch (err) {
    console.warn(`❌ Error scraping contact from ${url}:`, err);
    return {};
  } finally {
    await page.close();
  }
}

function getDomainName(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
