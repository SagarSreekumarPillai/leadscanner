import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";

export interface Lead {
  name: string;
  website: string;
  email?: string;
  phone?: string;
  source: string;
}

export async function scrapeLeadsFromDuckDuckGo(
  keyword: string,
  location: string
): Promise<Lead[]> {
  const searchQuery = `${keyword} in ${location}`;
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
    searchQuery
  )}&t=h_&ia=web`;

  console.log("🦆 DuckDuckGo search:", searchUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  await page.goto(searchUrl, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForSelector('[data-testid="result-title-a"]', {
    timeout: 10000,
  });

  const links: string[] = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('[data-testid="result-title-a"]')
    )
      .map((a) => (a as HTMLAnchorElement).href)
      .filter(
        (href) =>
          href.startsWith("http") &&
          !href.includes("justdial.com") &&
          !href.includes("facebook.com") &&
          !href.includes("linkedin.com") &&
          !href.includes("indiamart.com")
      )
      .slice(0, 10);
  });

  console.log("✅ Found links:", links);

  const leads: Lead[] = [];

  for (const site of links) {
    if (!site) continue;

    console.log("🔗 Visiting:", site);
    try {
      const contact = await scrapeContactFromWebsite(browser, site);

      // Filter: must have at least email or phone
      if (
        (!contact.email || !contact.email.includes("@")) &&
        (!contact.phone || contact.phone.length < 6)
      ) {
        continue;
      }

      const lead: Lead = {
        name: cleanDomainName(site),
        website: site,
        email: contact.email,
        phone: contact.phone,
        source: "DuckDuckGo",
      };

      leads.push(lead);
    } catch (err) {
      console.warn(`⚠️ Failed to scrape ${site}:`, err);
    }
  }

  await browser.close();
  return leads;
}

// 📩 Scrape one website for contact info
async function scrapeContactFromWebsite(browser: Browser, url: string) {
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    const html = await page.content();

    const emailMatch = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
    );
    const phoneMatch = html.match(/(\+91[\s-]?)?\d{10}/);

    return {
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
    };
  } catch (err) {
    return {};
  } finally {
    await page.close();
  }
}

// 🧼 Clean domain: facebook.com → Facebook
function cleanDomainName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const domain = hostname.split(".")[0];
    return capitalize(domain);
  } catch {
    return url;
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
