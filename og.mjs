// Regenerates og.png from the hero in index.html: `bun og.mjs`.
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  colorScheme: "dark",
});
await page.goto(new URL("./index.html", import.meta.url).href);
await page.addStyleTag({
  content: `
    html, body { height: 100%; margin-block: 0; }
    body { display: flex; flex-direction: column; justify-content: center; }
    .site-header, main > section:not(.intro), .site-footer { display: none; }
    .intro { padding-block: 0; }
    .cursor { animation: none; }
  `,
});
await page.screenshot({ path: new URL("./og.png", import.meta.url).pathname });
await browser.close();
