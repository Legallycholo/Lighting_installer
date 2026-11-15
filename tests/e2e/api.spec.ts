import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const validLead = {
  zip: "33134",
  propertyType: "residential",
  stories: "1",
  budget: "unsure",
  name: "Preview Test",
  phone: "(305) 555-0100",
  email: "test@example.com",
  address: "123 Test Street, Miami FL 33134",
  notes: "Automated preview verification only.",
  consent: true,
  website: "",
};
const headers = () => ({ "Idempotency-Key": randomUUID() });

// Default demo configuration only. No test enables a real webhook or submits to a CRM.
test.describe("lead API", () => {
  test("valid demo request is honest and simultaneous retries share one result", async ({
    request,
  }) => {
    const key = randomUUID();
    const responses = await Promise.all(
      Array.from({ length: 3 }, () =>
        request.post("/api/leads", {
          headers: { "Idempotency-Key": key },
          data: validLead,
        }),
      ),
    );
    const results = await Promise.all(
      responses.map((response) => response.json()),
    );
    for (const response of responses) {
      expect(response.status()).toBe(200);
      expect(response.headers()["cache-control"]).toBe("no-store");
    }
    expect(results[0]).toMatchObject({
      ok: true,
      mode: "demo",
      id: expect.any(String),
    });
    expect(results.every((result) => result.id === results[0].id)).toBe(true);
    expect(JSON.stringify(results[0])).not.toContain(validLead.phone);
    expect(JSON.stringify(results[0])).not.toContain(validLead.email);
    const changed = await request.post("/api/leads", {
      headers: { "Idempotency-Key": key },
      data: { ...validLead, stories: "2" },
    });
    expect(changed.status()).toBe(409);
  });

  test("validates contacts, consent, ZIP, and allowed option values on the server", async ({
    request,
  }) => {
    const response = await request.post("/api/leads", {
      headers: headers(),
      data: {
        ...validLead,
        zip: "123",
        phone: "123",
        email: "broken",
        consent: false,
        propertyType: "unknown",
      },
    });
    expect(response.status()).toBe(400);
    const result = await response.json();
    expect(result.ok).toBe(false);
    expect(result.fields).toEqual(
      expect.objectContaining({
        zip: expect.any(String),
        phone: expect.any(String),
        email: expect.any(String),
        consent: expect.any(String),
        propertyType: expect.any(String),
      }),
    );
  });

  test("requires an idempotency key and rejects the honeypot", async ({
    request,
  }) => {
    const missing = await request.post("/api/leads", { data: validLead });
    expect(missing.status()).toBe(400);
    const trapped = await request.post("/api/leads", {
      headers: headers(),
      data: { ...validLead, website: "bot.invalid" },
    });
    expect(trapped.status()).toBe(400);
    expect((await trapped.json()).ok).toBe(false);
  });

  test("rejects cross-origin JSON without allowing CORS", async ({
    request,
  }) => {
    const response = await request.post("/api/leads", {
      headers: { ...headers(), Origin: "https://unrelated.invalid" },
      data: validLead,
    });
    expect(response.status()).toBe(403);
    expect(response.headers()["access-control-allow-origin"]).toBeUndefined();
  });

  test("rejects oversized, malformed, and non-JSON requests", async ({
    request,
  }) => {
    const oversized = await request.post("/api/leads", {
      headers: headers(),
      data: { ...validLead, notes: "x".repeat(17_000) },
    });
    expect(oversized.status()).toBe(413);
    const malformed = await request.post("/api/leads", {
      headers: { ...headers(), "Content-Type": "application/json" },
      data: "{",
    });
    expect(malformed.status()).toBe(400);
    const wrongType = await request.post("/api/leads", {
      headers: headers(),
      form: { name: "Preview Test" },
    });
    expect(wrongType.status()).toBe(415);
  });
});
