// Regenerates og.png from the hero in index.html: `bun og.mjs`.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  colorScheme: "dark",
});
await page.goto(new URL("./index.html", import.meta.url).href);
await page.addStyleTag({
  content: "main > section:not(.intro), .site-footer { display: none } .cursor { animation: none }",
});
await page.screenshot({ path: new URL("./og.png", import.meta.url).pathname });
await browser.close();
