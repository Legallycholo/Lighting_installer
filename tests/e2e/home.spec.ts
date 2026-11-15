import { expect, test } from "@playwright/test";

const bulbs = '[data-testid="header-strand"] svg[viewBox="0 0 16 26"]';

test("homepage has semantic landmarks, working section links, and a keyboard skip link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();

  const navigation = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  for (const [label, id] of [
    ["How it works", "how-it-works"],
    ["Gallery", "gallery"],
    ["Reviews", "reviews"],
    ["FAQ", "faq"],
  ]) {
    await navigation.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(
      page.locator(`#${id}`).getByRole("heading", { level: 2 }),
    ).toBeInViewport();
  }
  const ids = await page
    .locator("main > section")
    .evaluateAll((sections) =>
      sections.map((section) => section.getAttribute("aria-labelledby")),
    );
  expect(ids).toEqual([
    "hero-heading",
    "comparison-heading",
    "gallery-heading",
    "process-heading",
    "reviews-heading",
    "pricing-heading",
    "faq-heading",
    "closing-heading",
  ]);
});

test("mobile menu closes on selection and Escape returns focus to its toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator('summary[aria-label="Mobile navigation"]');
  const menu = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Gallery", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Gallery", exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#gallery$/);
  await expect(page.locator("#gallery-heading")).toBeInViewport();
});

test("mobile call/text bar appears after the hero CTA and stays clear of the footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const bar = page.locator('nav[aria-label="Contact options"]');
  await page.locator("#hero-primary-cta").scrollIntoViewIfNeeded();
  await expect(page.locator("#hero-primary-cta")).toBeInViewport();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await expect(bar).toBeHidden();
  await page.locator("#gallery-heading").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "false");
  await expect(bar).toBeInViewport();
  await expect(
    bar.getByRole("link", { name: "Call", exact: true }),
  ).toHaveAttribute("href", /^tel:/);
  await expect(
    bar.getByRole("link", { name: "Text", exact: true }),
  ).toHaveAttribute("href", /^sms:/);
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await expect(bar).toBeHidden();
  await page.locator("#hero-primary-cta").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await expect(bar).toBeHidden();
});

test("header lights show 24 bulbs on desktop and 12 on mobile with static reduced-motion glow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(`${bulbs}:visible`)).toHaveCount(24);
  await expect(page.getByTestId("header-strand")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(`${bulbs}:visible`)).toHaveCount(12);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(bulbs).first()).toHaveCSS("animation-name", "none");
  const filter = await page
    .locator(bulbs)
    .first()
    .evaluate((bulb) => getComputedStyle(bulb).filter);
  expect(filter).toContain("drop-shadow");
  expect(filter).toContain("6px");
});

test("homepage loads its local media without console errors or failed media requests", async ({
  page,
}) => {
  const errors: string[] = [];
  const failedMedia: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      (url.pathname.startsWith("/media/") || url.pathname === "/_next/image") &&
      response.status() >= 400
    ) {
      failedMedia.push(`${response.status()} ${url.pathname}`);
    }
  });
  page.on("requestfailed", (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith("/media/") || url.pathname === "/_next/image") {
      failedMedia.push(`${request.failure()?.errorText} ${url.pathname}`);
    }
  });
  await page.goto("/");
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(failedMedia).toEqual([]);
  expect(errors).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("FAQ retains native keyboard behavior and process content remains readable", async ({
    page,
  }) => {
    await page.goto("/");
    const faqs = page.locator("#faq details");
    await expect(faqs).toHaveCount(6);
    await expect(faqs.first()).toHaveAttribute("open", "");
    const firstSummary = faqs.first().locator("summary");
    await firstSummary.focus();
    await page.keyboard.press("Enter");
    await expect(faqs.first()).not.toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(faqs.first()).toHaveAttribute("open", "");
    await expect(faqs.first().locator("div")).toBeVisible();
    const cards = page.locator("#how-it-works article");
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) await expect(card).toBeVisible();
    await expect(page.locator("#hero-primary-cta")).toHaveAttribute(
      "href",
      "/christmas-light-quote",
    );
  });
});
