
import { ScrapedData } from "../types";

/**
 * MOCK SCRAPER
 * In a real-world scenario, this would be an API call to a Node.js server 
 * running Playwright or Puppeteer. 
 * Playwright script logic for the backend:
 * 
 * const browser = await playwright.chromium.launch();
 * const context = await browser.newContext();
 * const page = await context.newPage();
 * await page.goto(url, { waitUntil: 'networkidle' });
 * const html = await page.content();
 * const styles = await page.evaluate(() => {
 *   const result = {};
 *   const elements = document.querySelectorAll('*');
 *   // extract computed styles for key layout elements...
 *   return result;
 * });
 * return { html, styles };
 */

export const scrapeUrl = async (url: string): Promise<ScrapedData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // If it's a known demo site, we provide better mock data
  if (url.includes('example.com')) {
    return {
      url,
      title: "Example Domain",
      htmlSnippet: "<div><header><h1>Header</h1></header><main><section><h2>Hero</h2><p>Description</p></section></main></div>",
      computedStyles: {
        "header": { "background": "#f0f0f0", "padding": "20px" },
        "h1": { "font-size": "32px", "color": "#333" }
      },
      metadata: {
        colors: ["#ffffff", "#f0f0f0", "#333333"],
        fonts: ["Arial", "sans-serif"]
      }
    };
  }

  // Generic mock for other URLs
  return {
    url,
    title: "Analyzed Site",
    htmlSnippet: `
      <nav class="top-nav">
        <div class="logo">CloneUI</div>
        <ul>
          <li>Home</li>
          <li>Features</li>
          <li>Pricing</li>
        </ul>
      </nav>
      <section class="hero">
        <h1>Transform URLs into React Components</h1>
        <p>The ultimate developer tool for UI cloning.</p>
        <button class="cta">Get Started</button>
      </section>
    `,
    computedStyles: {
      ".top-nav": { "display": "flex", "justify-content": "space-between", "padding": "1rem" },
      ".hero": { "text-align": "center", "padding": "5rem 0" }
    },
    metadata: {
      colors: ["#0f172a", "#38bdf8", "#f8fafc"],
      fonts: ["Inter", "sans-serif"]
    }
  };
};
