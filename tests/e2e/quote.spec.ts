import { expect, test, type Page } from "@playwright/test";

async function selectRadio(page: Page, name: RegExp) {
  const radio = page.getByRole("radio", { name });
  await radio.focus();
  await page.keyboard.press("Space");
  await expect(radio).toBeChecked();
}

async function reachContact(page: Page) {
  await page.goto("/christmas-light-quote?zip=33101");
  await expect(page.getByLabel("Property ZIP code")).toHaveValue("33101");
  await page.getByRole("button", { name: "Check my area" }).click();
  await page.getByRole("button", { name: "Let's get started" }).click();
  await selectRadio(page, /Residential/);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await selectRadio(page, /1 story/);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await selectRadio(page, /Not sure yet/);
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

async function fillContact(page: Page) {
  await page.getByLabel("Your name", { exact: false }).fill("Demo Tester");
  await page.getByLabel("Phone number", { exact: false }).fill("3055550100");
  await page
    .getByLabel("Property address", { exact: false })
    .fill("123 Test Street, Miami, FL 33101");
  await page.locator("#quote-consent").check();
}

test("ZIP prefill requires action and an out-of-area visitor can deliberately continue", async ({
  page,
}) => {
  await page.goto("/christmas-light-quote?zip=99999");
  await expect(page.getByLabel("Property ZIP code")).toHaveValue("99999");
  await expect(page.getByText("That one's outside our usual map.")).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Check my area" }).click();
  await expect(
    page.getByText("That one's outside our usual map."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /My property is just outside/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "What are we lighting up?" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByLabel("Property ZIP code")).toHaveValue("99999");
  await page.getByLabel("Property ZIP code").fill("123");
  await page.getByRole("button", { name: "Check my area" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "ZIP codes are 5 digits.",
  );
});

test("keyboard choices, validation, Back and Edit preserve answers before a demo submission", async ({
  page,
}) => {
  await reachContact(page);
  await expect(
    page.getByRole("heading", { name: "Where can we reach you?" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Review my answers" }).click();
  await expect(page.getByLabel("Your name", { exact: false })).toBeFocused();
  await expect(page.locator("#quote-name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await fillContact(page);
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("radio", { name: /Not sure yet/ })).toBeChecked();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: false })).toHaveValue(
    "Demo Tester",
  );
  await page.getByRole("button", { name: "Review my answers" }).click();
  await page.getByRole("button", { name: "Edit Name", exact: true }).click();
  await page
    .getByLabel("Your name", { exact: false })
    .fill("Demo Tester Updated");
  await page.getByRole("button", { name: "Review my answers" }).click();
  await expect(
    page.getByText("Demo Tester Updated", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit Request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your preview is complete." }),
  ).toBeVisible();
  await expect(page.getByText("Preview only · no request sent")).toBeVisible();
  await expect(page.locator("[data-lit=true]")).toHaveCount(5);
  await page.reload();
  await expect(page.getByLabel("Property ZIP code")).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    ),
  ).not.toContain("Demo Tester");
});

test("a failed submission preserves details, reuses its key on retry, and prevents duplicate submits", async ({
  page,
}) => {
  const keys: Array<string | undefined> = [];
  let requests = 0;
  let release: (() => void) | undefined;
  await page.route("**/api/leads", async (route) => {
    keys.push(route.request().headers()["idempotency-key"]);
    requests += 1;
    if (requests === 1) {
      await route.fulfill({
        status: 503,
        json: { ok: false, error: "Temporary delivery failure" },
      });
    } else {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      await route.fulfill({
        status: 200,
        json: { ok: true, mode: "demo", id: "test-demo" },
      });
    }
  });
  await reachContact(page);
  await fillContact(page);
  await page.getByRole("button", { name: "Review my answers" }).click();
  await page.getByRole("button", { name: "Submit Request" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Your answers are still here",
  );
  await expect(page.getByText("Demo Tester", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await expect.poll(() => requests).toBe(2);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
  release?.();
  await expect(
    page.getByRole("heading", { name: "Your preview is complete." }),
  ).toBeVisible();
});

test("quote controls fit a 320px viewport without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await reachContact(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await fillContact(page);
  await page.getByRole("button", { name: "Review my answers" }).click();
  const submit = page.getByRole("button", { name: "Submit Request" });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
