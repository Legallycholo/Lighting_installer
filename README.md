# Glow & Garland holiday lighting preview

A Next.js 16 App Router implementation of the supplied holiday-lighting plan.
The project now includes the complete sales homepage, responsive shared shell,
animated SVG light strand, quote wizard, lead route, and support/SEO routes.

## Run locally

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. Use sample ZIP `33101` to exercise the in-area flow,
or `99999` for the deliberate out-of-area flow. Submit dummy contact details;
the default API validates a preview and **does not deliver or retain a lead**.
The success screen explicitly explains this.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test
pnpm format:check
```

Playwright starts a local server if needed. The suite covers quote keyboard
interaction, validation, Back/Edit, retry/deduplication, safe API behavior,
accessibility, and responsive screenshots at all eight specified sizes.
Snapshots under `tests/visual` are regression baselines for this implementation;
they are **not proof of pixel parity** with the reference's licensed media.
Review intentional visual changes before running `pnpm test:visual --update-snapshots`.

Baselines are platform-specific (`*-darwin.png`, `*-linux.png`) because font
rasterisation differs between operating systems. If a platform has no baseline
yet, the first visual run writes one and fails; re-run to compare. To use a
pre-installed Chromium instead of Playwright's download (for example in a CI
image), set `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium`.

## Where to edit

- `content/site.ts`: identity, canonical phone, season, claims, prices and SEO.
- `content/home.ts`, `reviews.ts`, `faq.ts`, `quote.ts`: typed page copy.
- `content/service-areas.ts`: sample ZIP coverage and future city content model.
- `content/pages.ts`, `shell.ts`: support pages and shell labels.
- `styles/tokens.css`: exact design palette, type, spacing, borders and shadows.
- `components/`: static sections plus small interactive client components.
- `lib/lead-server.ts`: server-only validation, delivery and abuse controls.
- `ASSET-TODO.md`: media and business-input replacement inventory.
- `IMPLEMENTATION.md`: handoff audit and completion status.

All media is local original illustrative SVG artwork. The hero uses a poster
until approved video sources are added to `hero.video.sources`. The player is
ready for AV1/H.264 and respects visibility, document activity, reduced motion,
Save Data and slow connections. Runtime fonts are self-hosted by Next.js.

## Production configuration

Copy `.env.example` to `.env.local` for local configuration. Staging defaults to
noindex/nofollow, disallowed robots, empty sitemap and no business JSON-LD.
Production pipelines must set `DEPLOY_TARGET=production`; known Vercel and
Netlify production environments are also detected. Publication/indexing stays
blocked until `CONTENT_APPROVED=true` and an owned HTTPS canonical URL exist.
Approval is a deliberate owner action after replacing every placeholder,
verifying claims and coverage, licensing media, and reviewing privacy/consent.

For real quotes configure `LEAD_MODE=live`, `LEAD_WEBHOOK_URL` and optional
`LEAD_WEBHOOK_TOKEN` **on the server**. A missing/invalid live endpoint produces
an error, never a fake success. The receiving service must honor
`Idempotency-Key`, including retries after timeouts. No reference-business
integration, analytics account, phone or email is used.

Rate limiting and request deduplication currently use bounded in-process maps
(30 requests per 15 minutes, 24-hour successful-key retention). Unset ingress
configuration uses one shared conservative bucket. Before scaling, replace
these with atomic shared storage and configure an IP header overwritten by a
trusted ingress. Do not trust client-supplied forwarded headers. Do not log PII.

## Attribution and event hooks

Attribution and analytics default to off. Attribution requires its environment
flag **and separate explicit consent**; contact consent does not enable it.
Only allowlisted campaign parameters are retained for the configured 90-day
preview period. No raw browsing history, arbitrary query parameters, or referrer
paths are stored. Contact answers stay in component memory and clear on refresh.

An approved first-party listener can subscribe to `glow:analytics` after opt-in.
The event vocabulary is `quote_start`, `zip_result`, `step_complete`,
`submit_success`, `submit_failure`, `call_click`, and `text_click`; event details
contain only step numbers, coverage booleans and demo/live mode. No third-party
analytics SDK is installed. Enable only after adding a project-owned listener
and approving retention and consent requirements.

Phase 2 campaign/careers funnels and substantive city pages remain out of scope.
