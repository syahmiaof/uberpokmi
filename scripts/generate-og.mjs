import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const image = await readFile(path.join(root, "public/images/pokmi-car.png"));
const displayFont = await readFile(
  path.join(
    root,
    "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2",
  ),
);
const bodyFont = await readFile(
  path.join(
    root,
    "node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
  ),
);
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html>
    <html lang="en"><head><meta charset="utf-8"><style>
      @font-face { font-family: Space; src: url(data:font/woff2;base64,${displayFont.toString("base64")}); font-weight: 700; }
      @font-face { font-family: Inter; src: url(data:font/woff2;base64,${bodyFont.toString("base64")}); font-weight: 500; }
      * { box-sizing: border-box; }
      html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
      body { background: #101412; color: #f5f7f2; font-family: Inter, sans-serif; position: relative; }
      body::before { content: ''; position: absolute; inset: -120px -120px -180px 470px; opacity: .25; transform: rotate(-25deg); background: repeating-linear-gradient(90deg, transparent 0 82px, #333e36 83px 84px, transparent 85px 194px); }
      .stripe { position: absolute; width: 370px; height: 800px; top: -120px; right: 124px; background: #c8ff3d; transform: skewX(-18deg); }
      .edge { position: absolute; width: 4px; height: 780px; top: -100px; right: 78px; background: #c8ff3d; transform: skewX(-18deg); opacity: .52; }
      .brand { position: absolute; left: 62px; top: 46px; font: 700 42px Space, sans-serif; letter-spacing: -2.4px; }
      .brand span { color: #c8ff3d; }
      .eyebrow { position: absolute; left: 65px; top: 145px; color: #c8ff3d; font: 500 16px Inter, sans-serif; letter-spacing: 3.2px; }
      h1 { position: absolute; left: 58px; top: 182px; width: 650px; margin: 0; font: 700 91px/.99 Space, sans-serif; letter-spacing: -6px; }
      h1 em { color: #c8ff3d; font-style: normal; }
      .sub { position: absolute; left: 64px; top: 425px; font: 500 20px Inter, sans-serif; color: #a8b3ab; }
      .services { position: absolute; left: 64px; bottom: 54px; border-top: 1px solid #465249; padding-top: 22px; width: 450px; font: 500 16px Inter, sans-serif; letter-spacing: 2px; }
      .services span { color: #c8ff3d; padding: 0 15px; }
      .car { position: absolute; width: 708px; height: auto; right: -53px; top: 171px; filter: drop-shadow(0 24px 22px #0007); }
      .demo { position: absolute; right: 49px; bottom: 42px; background: #101412; border: 1px solid #333e36; padding: 13px 18px; border-radius: 100px; font: 500 12px Inter, sans-serif; letter-spacing: 1.5px; }
    </style></head><body>
      <div class="stripe"></div><div class="edge"></div>
      <div class="brand">uberpokmi<span>.</span></div>
      <div class="eyebrow">KUALA LUMPUR, IN MOTION</div>
      <h1>Your city.<br><em>Your way.</em></h1>
      <div class="sub">One city. Three ways to keep moving.</div>
      <div class="services">RIDE <span>·</span> FOOD <span>·</span> SEND</div>
      <img class="car" src="data:image/png;base64,${image.toString("base64")}" alt="">
      <div class="demo">INTERACTIVE DEMO</div>
    </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".car").evaluate((image) => image.decode());
  await page.screenshot({ path: path.join(root, "public/og-uberpokmi.png") });
} finally {
  await browser.close();
}
