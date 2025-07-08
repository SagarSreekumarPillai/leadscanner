import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import type { Browser } from "puppeteer";

export async function getOfficialWebsiteFromGoogle(browser: Browser, businessName: string, address: string): Promise<string | null> {
  const page = await browser.newPage();

  try {
    const query = encodeURIComponent(`${businessName} ${address}`);
    const url = `https://www.google.com/search?q=${query}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const links: string[] = [];

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("/url?q=")) {
        const cleanLink = href.replace("/url?q=", "").split("&")[0];
        if (
          !cleanLink.includes("justdial.com") &&
          !cleanLink.includes("indiamart.com") &&
          !cleanLink.includes("sulekha.com") &&
          !cleanLink.includes("facebook.com") &&
          !cleanLink.includes("linkedin.com")
        ) {
          links.push(cleanLink);
        }
      }
    });

    const filtered = links.find((link) =>
      /\.(in|com|org|net)$/.test(new URL(link).hostname)
    );

    return filtered || null;
  } catch (error) {
    console.error("❌ Google search scrape failed:", error);
    return null;
  } finally {
    await page.close();
  }
}
