# Implementation status

## Completion audit — November 15, 2026

The plan in `IMPLEMENTATION_PLAN.md` is implemented through Phase 5 for the
Phase 1 scope (homepage, quote wizard, thank-you, privacy, not-found, lead
API). Phase 2 funnels (neighbor, rebook, careers) and `service-area/[slug]`
routes are intentionally not built; only their content model exists.

History: the first agent stopped in the foundation phase; Codex built the
site; this pass finished the remaining plan items and ran the full
verification on Linux.

## Work checklist

- [x] Audit repository, preserve existing configuration and content.
- [x] Shared shell, fonts, animated light strand (24/12 bulbs), native
      `<details>` mobile menu, footer, mobile Call/Text bar.
- [x] All eight homepage bands in plan order with the specified breakpoints
      (1100, 1000, 900, 880, 820, 760, 620, 560, 520).
- [x] Local original placeholders plus `ASSET-TODO.md` inventory.
- [x] Accessible quote wizard with explicit state machine, ZIP gate, four
      questions, review/edit, submit/error/success, and night state.
- [x] `/api/leads`: Zod re-validation, idempotency key, honeypot, size/time
      limits, rate limiting, same-origin check, no PII in logs, safe demo stub.
- [x] Metadata, JSON-LD helpers (gated), robots, sitemap, icons, OG asset,
      privacy page, attribution/analytics hooks (off by default), `.env.example`.
- [x] Formatting, lint, strict TypeScript, production build.
- [x] Playwright: 15 e2e tests, 8 viewport screenshot baselines (Linux and
      macOS), axe WCAG 2.1 AA on four routes — all passing.

## Finished in this pass

- Quote success state now renders the next-step content from
  `content/quote.ts` (`done.meta`, hours line, "Can't wait?" call/text,
  gallery link); the demo state keeps its explicit "no request sent" copy.
- Delivery error board now shows the configured title and call/text fallback
  copy from `content/quote.ts` (`review.error`).
- Wizard submission goes through `lib/lead-submit.ts` (the plan's module),
  with cancel-on-unmount and a request timeout; duplicate submits and key
  reuse on retry are covered by tests.
- Hero has three small desktop-only ink/gold sparkles (plan §8.1).
- 44px minimum touch targets for footer links, the closing call link, the
  review link, the consent row and desktop nav links (plan §14).
- Pricing gauge "estates" label uses a solid muted color; it previously
  failed axe color-contrast at 70% opacity.
- Visual baselines captured on Linux at all eight sizes (the macOS set had
  five). The visual test hides the Next.js dev-tools badge so it cannot leak
  into screenshots. `PLAYWRIGHT_CHROMIUM_PATH` lets CI use a system Chromium.
- `.prettierignore` excludes the owner's plan document.

## Acceptance checklist (plan §18)

Visual: palette/fonts/borders/hard shadows/section order match the plan;
strand 24/12 bulbs with static reduced-motion glow (tested); no soft shadows;
no horizontal overflow at 320/375/390 (tested at all eight sizes).

Functional: anchors land on sections; mobile menu opens/animates/closes on
selection and Escape returns focus; hero video logic honours visibility,
reduced motion, Save Data and manual control (sources are owner inputs);
Call/Text bar appears only after the hero CTA leaves view and hides over the
footer; process reveal runs once and content stays visible without JS; FAQ
works without JS; wizard validates each step, preserves answers, supports
Back/Edit, blocks duplicate submits, handles failure; nothing reaches the
reference business (hostname is refused server-side).

Content/SEO: every mutable string lives in `content/`; staging is `noindex`,
robots disallow all, sitemap empty and JSON-LD off until `CONTENT_APPROVED`.

Quality: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`,
`pnpm test` all pass. Keyboard/focus behaviour is covered by tests
(skip link, menu, radios, step-heading focus, inline errors).

Not signed off: pixel parity against the live reference. That requires the
owner's licensed media and real copy; placeholder art makes a side-by-side
comparison meaningless, and the reference may have changed since the audit.

## Owner inputs required before launch

The identity, phone, address, prices, promises, statistics, service ZIPs and
reviews in `content/` are illustrative. A preview notice labels them and
search indexing remains disabled. Supply verified content, licensed
photography/video, privacy review and a project-owned lead destination
(`LEAD_MODE=live`, `LEAD_WEBHOOK_URL`) before setting `CONTENT_APPROVED=true`.
See `ASSET-TODO.md` and `README.md`.
