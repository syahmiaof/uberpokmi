import { chromium } from "@playwright/test";

const url = process.argv[2];
if (!url || !/^https:\/\//.test(url)) {
  throw new Error(
    "Usage: node scripts/smoke-production.mjs https://your-domain/",
  );
}

const home = await fetch(url);
if (!home.ok) throw new Error(`Homepage returned HTTP ${home.status}`);
const html = await home.text();
const imageUrl = html.match(
  /<meta\s+property="og:image"\s+content="([^"]+)"/i,
)?.[1];
if (!imageUrl) throw new Error("Open Graph image tag is missing");
const image = await fetch(imageUrl);
if (!image.ok || !image.headers.get("content-type")?.startsWith("image/png")) {
  throw new Error(`Open Graph image failed: HTTP ${image.status}`);
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Your city. Your way." }).waitFor();

  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const [label, heading] of [
    ["Ride", "Where to?"],
    ["Food", "Good food. Good mood."],
    ["Delivery", "Small parcel. Big possibilities."],
  ]) {
    await nav.getByRole("button", { name: label, exact: true }).click();
    await page.getByRole("heading", { name: heading }).waitFor();
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("navigation", { name: "Mobile navigation" }).waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  if (overflow) throw new Error("Horizontal overflow at 375px");
  if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  console.log(
    `PASS ${url} · homepage, 3 services, mobile nav, OG image, no JS errors`,
  );
} finally {
  await browser.close();
}
