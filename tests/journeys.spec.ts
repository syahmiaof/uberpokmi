import { test, expect, type Page } from "@playwright/test";
const navigate = async (page: Page, name: string) => {
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
};
const location = async (page: Page, label: string, name: string) => {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("textbox", { name: "Search locations" }).fill(name);
  await page
    .locator("dialog .location-list")
    .getByRole("button")
    .filter({ hasText: name })
    .first()
    .click();
};
const finish = async (page: Page, count: number) => {
  for (let i = 0; i < count; i++)
    await page.getByRole("button", { name: "Advance demo" }).click();
};
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("ride validation, matching, tracking, chat, receipt, rating and reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await navigate(page, "Ride");
  await page.getByRole("button", { name: "Confirm PokmiGo" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose your pickup");
  await location(page, "Destination", "Sunway Pyramid");
  await page.getByRole("button", { name: /PokmiComfort/ }).click();
  await page.getByLabel("Have a promo code?").fill("RIDE5");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByText("RIDE5 · RM 5.00 saved")).toBeVisible();
  const amount = await page
    .locator(".price-breakdown .total strong")
    .last()
    .innerText();
  await page.getByRole("button", { name: "Confirm PokmiComfort" }).click();
  await page.getByRole("button", { name: "Book demo ride" }).click();
  await expect(
    page.getByRole("heading", { name: "Searching for your driver" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your driver is assigned" }),
  ).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: "Chat demo" }).click();
  await page
    .getByRole("textbox", { name: "Message to demo driver" })
    .fill("I am ready");
  await page.getByRole("button", { name: "Send demo message" }).click();
  await expect(
    page.getByText("Got it, thanks!", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await finish(page, 3);
  await expect(
    page.getByRole("heading", { name: "You’ve arrived" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "How was your ride?: 5 stars" })
    .click();
  await page.getByRole("button", { name: "View receipt" }).click();
  await expect(page.locator("dialog .total")).toContainText(amount);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await navigate(page, "Activity");
  await expect(page.locator(".activity-row")).toHaveCount(1);
  await expect(page.locator(".activity-row")).toContainText("Completed");
  await page.reload();
  await page.locator(".activity-row").click();
  await expect(
    page.getByRole("button", { name: "How was your ride?: 5 stars" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
test("scheduled ride never matches immediately, and cancellation persists", async ({
  page,
}) => {
  await navigate(page, "Ride");
  await location(page, "Destination", "KLCC");
  await page.getByRole("button", { name: "Schedule", exact: true }).click();
  await page.getByRole("button", { name: "Schedule PokmiGo" }).click();
  await expect(page.getByRole("alert")).toContainText("future date");
  await page.getByLabel("Pickup date and time").fill("2099-12-25T12:30");
  await page.getByRole("button", { name: "Schedule PokmiGo" }).click();
  await page.getByRole("button", { name: "Schedule demo ride" }).click();
  await expect(
    page.getByRole("heading", { name: "Your ride is scheduled." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Advance demo" })).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Cancel booking", exact: true })
    .click();
  await page
    .locator("dialog")
    .getByRole("button", { name: "Cancel booking" })
    .click();
  await navigate(page, "Activity");
  await expect(page.locator(".activity-row")).toContainText("Cancelled");
});
test("food customization, quantity, voucher, checkout, tracking and reorder", async ({
  page,
}) => {
  await navigate(page, "Food");
  await page
    .getByRole("textbox", { name: "Search food or restaurants" })
    .fill("Ayam Gepuk Pokmi");
  await page.locator(".restaurant-card").click();
  await page.getByRole("button", { name: /Ayam Gepuk Original/ }).click();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await expect(page.getByRole("alert")).toContainText("required options");
  await page.getByRole("radio", { name: "Regular" }).check();
  await page.getByRole("radio", { name: "Medium", exact: true }).check();
  await page.getByRole("checkbox", { name: "Fried egg" }).check();
  await page.getByRole("button", { name: "Increase Quantity" }).click();
  await page.getByLabel("Special instructions").fill("Sambal separately");
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("button", { name: /View your bag/ }).click();
  await expect(page.locator("dialog")).toContainText("Sambal separately");
  await page.getByLabel("Have a promo code?").fill("FIRSTBITE");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.locator(".applied")).toContainText("RM 3.48 saved");
  await page.getByRole("button", { name: /Continue to checkout/ }).click();
  await page.getByLabel("Delivery instructions").fill("Lobby");
  await page.getByRole("button", { name: /Place demo order/ }).click();
  await expect(
    page.getByRole("heading", { name: "Order placed", exact: true }),
  ).toBeVisible();
  await finish(page, 6);
  await expect(
    page.getByRole("heading", { name: "Enjoy every bite" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "View receipt" }).click();
  await expect(page.locator("dialog .total")).toContainText("RM 34.82");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Reorder your favourites" }).click();
  await expect(page.locator("dialog")).toContainText("Sambal separately");
});
test("cart replacement is explicit; declining preserves cart and removing empties it", async ({
  page,
}) => {
  await navigate(page, "Food");
  await page
    .locator(".restaurant-card")
    .filter({ hasText: "Kopi & Toast" })
    .click();
  await page.getByRole("button", { name: /Kaya Butter Toast/ }).click();
  await page.getByRole("radio", { name: "Regular" }).check();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page
    .locator(".restaurant-card")
    .filter({ hasText: "Wok Street" })
    .click();
  await page.getByRole("button", { name: /Char Kway Teow/ }).click();
  await page.getByRole("radio", { name: "Regular" }).check();
  await page.getByRole("radio", { name: "Mild", exact: true }).check();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await expect(
    page.getByRole("heading", { name: "Start a new bag?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: /View your bag/ }).click();
  await expect(page.locator("dialog")).toContainText("Kaya Butter Toast");
  await page.getByRole("button", { name: "Remove Kaya Butter Toast" }).click();
  await expect(
    page.getByRole("heading", { name: "A craving goes here." }),
  ).toBeVisible();
});
test("parcel form validates, enforces vehicle restrictions and completes proof", async ({
  page,
}) => {
  await navigate(page, "Delivery");
  await page.getByRole("button", { name: "Review delivery" }).click();
  await expect(page.getByRole("alert")).toContainText("sender and receiver");
  await page.getByLabel("Sender name").fill("Demo Sender");
  await page.getByLabel("Receiver name").fill("Demo Receiver");
  await page.getByLabel("Sender phone").fill("invalid");
  await page.getByLabel("Receiver phone").fill("0123456789");
  await page.getByRole("button", { name: "Review delivery" }).click();
  await expect(page.getByRole("alert")).toContainText("Malaysian mobile");
  await page.getByLabel("Sender phone").fill("01112345678");
  await location(page, "Parcel drop-off", "Sunway Pyramid");
  await page.getByLabel("Parcel contents").fill("Books");
  await page.getByRole("button", { name: /Medium Parcel/ }).click();
  await expect(page.getByRole("button", { name: /PokmiBike/ })).toBeDisabled();
  await page.getByLabel("Have a promo code?").fill("SEND3");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.locator(".applied")).toContainText("RM 3.00 saved");
  await page.getByRole("button", { name: "Review delivery" }).click();
  await page.getByRole("button", { name: "Confirm demo delivery" }).click();
  await finish(page, 4);
  await expect(
    page.getByRole("heading", { name: "Delivered with care" }),
  ).toBeVisible();
  await expect(page.locator(".delivery-proof")).toContainText("Demo Receiver");
  await navigate(page, "Activity");
  await expect(page.locator(".activity-row")).toContainText("Completed");
});
test("account saved addresses, preferences, notifications and confirmed reset", async ({
  page,
}) => {
  await navigate(page, "Account");
  await page.getByRole("button", { name: "Add place" }).click();
  await page.getByLabel("Place label").fill("Gym");
  await location(page, "Saved address", "TRX");
  await page.getByRole("button", { name: "Save place" }).click();
  await expect(
    page.locator(".saved-address").filter({ hasText: "Gym" }),
  ).toContainText("TRX");
  await page.getByRole("button", { name: "Edit Gym" }).click();
  await page.getByLabel("Place label").fill("Studio");
  await page.getByRole("button", { name: "Save place" }).click();
  await page.getByRole("button", { name: "Light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".saved-address")).toHaveCount(3);
  await page.getByRole("button", { name: "Delete Studio" }).click();
  await page.getByRole("button", { name: "Delete place" }).click();
  await expect(page.locator(".saved-address")).toHaveCount(2);
  await page.getByRole("button", { name: /^Notifications/ }).click();
  await page.getByRole("button", { name: "Mark all read" }).click();
  await expect(page.getByText("0 unread updates")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: "Reset demo data", exact: false })
    .click();
  await page
    .locator("dialog")
    .getByRole("button", { name: "Reset demo data" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("heading", { name: "Your city. Your way." }),
  ).toBeVisible();
});
test("map tile failure falls back and reduced motion is respected", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await navigate(page, "Ride");
  await location(page, "Destination", "KLCC");
  await expect(page.locator(".map-route")).toBeVisible();
  await page.getByRole("button", { name: "Street map", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Street map", exact: true }),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Simulated map · drag to explore")).toBeVisible();
  expect(
    await page
      .locator(".map-route")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("responsive layouts, local images and visual captures", async ({
  page,
}) => {
  for (const width of [375, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { name: "Your city. Your way." }),
    ).toBeVisible();
    await page.locator(".home-restaurants").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".home-restaurants img")).every(
        (i) => (i as HTMLImageElement).complete,
      ),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Home overflow at ${width}`,
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
        ),
    ).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width === 375 || width === 1440)
      await page.screenshot({
        path: `.impeccable/review/${width === 375 ? "mobile" : "desktop"}.png`,
        fullPage: true,
      });
    for (const route of [
      "ride",
      "food",
      "delivery",
      "offers",
      "account",
      "activity",
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflow at ${width}`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ["ride", "food", "delivery"]) {
    await page.goto(`/#${route}`);
    await page.screenshot({
      path: `.impeccable/review/${route}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Offers" })
    .click();
  await expect(
    page.getByRole("heading", { name: "A little extra, just for you." }),
  ).toBeVisible();
});
