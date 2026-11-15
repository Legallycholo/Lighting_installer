import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const viewports = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 1024, height: 900 },
  { width: 900, height: 1000 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 700 },
];
for (const viewport of viewports) {
  test(`homepage and quote at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [route, name] of [
      ["/", "home"],
      ["/christmas-light-quote", "quote"],
    ]) {
      await page.goto(route);
      // The Next.js dev-tools badge is not part of the page; keep it out of baselines.
      await page.addStyleTag({
        content: "nextjs-portal { display: none !important; }",
      });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(viewport.width);
      await expect(page).toHaveScreenshot(`${name}-${viewport.width}.png`, {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.005,
      });
    }
  });
}
test("homepage and quote pass automated accessibility checks", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/christmas-light-quote",
    "/privacy-policy",
    "/thank-you",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        null,
        2,
      ),
    ).toEqual([]);
  }
});
