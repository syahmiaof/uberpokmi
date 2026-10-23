import { expect, test } from "@playwright/test";

test("mobile booking controls stay usable and artwork stays clear", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const foodCard = page.locator(".food-service");
  const deliveryCard = page.locator(".send-service");
  const foodTitle = await foodCard.locator("h2").boundingBox();
  const foodImage = await foodCard.locator(".service-food-image").boundingBox();
  const deliveryTitle = await deliveryCard.locator("h2").boundingBox();
  const parcel = await deliveryCard.locator(".parcel-art").boundingBox();
  expect(
    foodTitle && foodImage && foodTitle.y + foodTitle.height <= foodImage.y + 2,
  ).toBeTruthy();
  expect(
    deliveryTitle &&
      parcel &&
      deliveryTitle.y + deliveryTitle.height <= parcel.y + 2,
  ).toBeTruthy();
  await page.screenshot({
    path: ".impeccable/review/mobile.png",
    fullPage: true,
  });
  await page.locator(".ride-service").click();
  await expect(page.locator(".map-route")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Swap pickup and destination" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /^Destination:/ }).click();
  await page.getByRole("textbox", { name: "Search locations" }).fill("KLCC");
  await page.locator("dialog .location-list button").first().click();
  await expect(page.locator(".map-route")).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: ".impeccable/review/ride-mobile.png",
    fullPage: true,
  });
  await page.locator(".sheet-toggle").click();
  await expect(
    page.getByRole("button", { name: "Confirm PokmiGo" }),
  ).toBeHidden();
  await page.locator(".sheet-toggle").click();
  await expect(
    page.getByRole("button", { name: "Confirm PokmiGo" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.locator(".food-service").click();
  await page.screenshot({
    path: ".impeccable/review/food-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Home" })
    .click();
  await page.locator(".send-service").click();
  await page.screenshot({
    path: ".impeccable/review/delivery-mobile.png",
    fullPage: true,
  });
  await expect(page.getByLabel("Sender name")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("light theme remains legible at desktop and mobile widths", async ({
  page,
}) => {
  await page.goto("/#account");
  await page.getByRole("button", { name: "Light theme" }).click();
  await page.goto("/");
  await page.screenshot({
    path: ".impeccable/review/light-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({
    path: ".impeccable/review/light-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("location dialog supports keyboard focus and Escape", async ({ page }) => {
  await page.goto("/#ride");
  await page.getByRole("button", { name: /^Destination:/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Destination" })).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Search locations" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Destination" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: /^Destination:/ }),
  ).toBeFocused();
});
