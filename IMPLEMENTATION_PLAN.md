# Cursor / Claude Fable 5.2 Implementation Plan

## Project: Pixel-faithful rebuild of `happylightsmiami.com`

> Paste this document into Cursor Agent and run it with **Claude Fable 5.2** at **High** effort. Fable 5.2 is the coding agent/model; it is not the application framework.

## 1. Objective

Build a production-quality, pixel-faithful reimplementation of the public customer journey at [happylightsmiami.com](https://happylightsmiami.com/), including its visual language, responsive behavior, animated header lights, homepage interactions, and quote wizard.

The initial implementation may use the reference site's current copy as temporary parity content only if the project owner is authorized to use it. All copy, business details, service areas, reviews, prices, SEO values, and integrations must be centralized so they can be replaced without editing components.

The clone must **not** hotlink or send data to the reference business. Do not reuse its phone numbers, email, address, social links, analytics IDs, CallRail account, Google API key, review URL, Zapier webhook, or any other production integration. Use project-owned assets and blank/project-owned environment variables.

## 2. Definition of done

The work is complete when:

- The homepage matches the reference at desktop, tablet, and mobile widths.
- The announcement bar, navigation, animated light strand, hero, every homepage band, footer, and mobile Call/Text bar are present.
- The decorative light strand behaves like the reference, including desktop/mobile density and reduced-motion behavior.
- The quote experience includes the ZIP gate, four questions, contact fields, review step, submit/error/success states, and responsive design.
- All mutable business and SEO content comes from typed configuration/data files.
- No request, phone link, email link, analytics event, or lead submission points to Happy Lights of Miami.
- The site has semantic HTML, keyboard support, reduced-motion support, no horizontal overflow at 320px, and no obvious layout shift.
- Visual regression screenshots pass at every viewport listed in Section 16.

## 3. Reference audit and scope

### Core conversion routes — implement in Phase 1

- `/` — main sales homepage.
- `/christmas-light-quote` — interactive quote wizard.
- `/thank-you` — simple confirmation/fallback page for non-JS or externally redirected submissions.
- `/privacy-policy` — project-owned privacy copy, not copied legal text.
- Custom `not-found` page using the same shell.

### Additional public routes — Phase 2 unless explicitly required now

- `/neighbor` — referral/neighbor campaign.
- `/rebook` — returning-customer flow.
- `/careers` — recruiting index.
- Career role, application, and thank-you routes for phone sales, in-person sales, project management, and installers.

The main site is effectively a one-page sales experience plus a separate quote wizard. Careers, neighbor, and rebook are distinct campaign funnels and should not block the Phase 1 launch.

### Reference implementation finding

The live site runs on WordPress, but the homepage and quote page are custom, self-contained HTML/CSS/vanilla-JavaScript builds inside a blank child-theme template. Do **not** reproduce WordPress or Elementor merely because the reference uses them. Reproduce the rendered experience in a maintainable application.

## 4. Recommended technical stack

Use the existing repository stack if one is already established and can meet the requirements. Otherwise use:

- Current stable Next.js App Router.
- TypeScript with strict mode.
- React Server Components by default; client components only for interactive UI.
- CSS Modules plus a small global token/reset layer. Do not depend on a component library.
- `next/font/google` for Merriweather and Inter, or licensed self-hosted font files.
- Zod for server/client form validation.
- A Next.js route handler for lead submission.
- Playwright for interaction and visual regression tests.
- Optional `@axe-core/playwright` for automated accessibility checks.

Avoid Framer Motion or another animation dependency. The reference motion is small enough for CSS transitions, keyframes, native `<details>`, and `IntersectionObserver`.

## 5. Repository architecture

Adapt names to the existing repository, but keep these responsibilities separate:

```text
app/
  layout.tsx
  page.tsx
  not-found.tsx
  christmas-light-quote/
    page.tsx
  thank-you/
    page.tsx
  privacy-policy/
    page.tsx
  api/
    leads/
      route.ts

components/
  layout/
    AnnouncementBar.tsx
    SiteHeader.tsx
    MobileMenu.tsx
    SiteFooter.tsx
    MobileContactBar.tsx
  decorative/
    HolidayLightStrand.tsx
    Bulb.tsx
    Spark.tsx
    HangingChain.tsx
  ui/
    Button.tsx
    FramedBoard.tsx
    Label.tsx
    SectionHeading.tsx
    TrustRow.tsx
  home/
    Hero.tsx
    ComparisonSection.tsx
    GallerySection.tsx
    ProcessSection.tsx
    ReviewsSection.tsx
    PricingSection.tsx
    FaqSection.tsx
    ClosingCta.tsx
  quote/
    QuoteWizard.tsx
    QuoteProgressStrand.tsx
    ZipGate.tsx
    PropertyStep.tsx
    HeightStep.tsx
    BudgetStep.tsx
    ContactStep.tsx
    ReviewStep.tsx
    QuoteSuccess.tsx

content/
  site.ts
  home.ts
  quote.ts
  service-areas.ts
  reviews.ts
  faq.ts

lib/
  attribution.ts
  lead-schema.ts
  lead-submit.ts
  metadata.ts
  structured-data.ts
  phone.ts

styles/
  tokens.css
  globals.css

tests/
  e2e/
  visual/
```

Do not put business strings directly inside visual components. Components should render typed data passed as props.

## 6. Design system

### Fonts

- Display/headings/numbers: `Merriweather`, weight `800`, fallback `Georgia, serif`.
- Body/navigation/controls: `Inter`, weights `400–800`, fallback `sans-serif`.

### Required tokens

Create these as global CSS custom properties:

```css
:root {
  --sage: #c2cfc0;
  --cream: #f4ecd9;
  --red: #c0362c;
  --red-dark: #93261f;
  --ink: #243b35;
  --gold: #e3b34f;
  --teal: #497263;
  --body-muted: #3a5049;
  --oxide: #77341f;

  --font-display: "Merriweather", Georgia, serif;
  --font-sans: "Inter", sans-serif;

  --space-1: 6px;
  --space-2: 10px;
  --space-3: 14px;
  --space-4: 20px;
  --space-5: 28px;
  --space-6: 40px;
  --space-7: 56px;
  --space-8: 80px;

  --radius-hair: 2px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --border-ornament: 1.5px;
  --border-mark: 2px;
  --border-control: 2.5px;
  --border-object: 3px;

  --shadow-mark: 3px 3px 0;
  --shadow-control: 4px 4px 0;
  --shadow-panel: 6px 6px 0;
  --shadow-card: 8px 8px 0;
  --shadow-hung: 10px 10px 0;
  --shadow-press: 2px 2px 0;
  --shadow-held: 1px 1px 0;

  --duration-press: 120ms;
  --duration-quick: 250ms;
  --duration-reveal: 500ms;
  --duration-enter: 800ms;
  --ease-out: cubic-bezier(.22, .9, .3, 1);
}
```

### Visual rules

- The aesthetic is vintage, hand-painted holiday signage.
- Use cream boards with dark green outlines and hard offset shadows.
- Never use soft/blurred box shadows for cards or buttons.
- Red is the action/accent color on light sections. Gold replaces red accents on the ink background.
- Buttons move `2px 2px` on hover and `3px 3px` while active; reduce the hard shadow accordingly.
- Red primary buttons have a dotted cream inset trim.
- Slight rotation is intentional only on selected “hung” objects; never rotate form fields or ordinary body copy.
- Standard content max width is `1200px`; header max width is `1240px`.
- Standard desktop section padding is `104px 32px 96px`.
- At `880px` and below, use `72px 20px 64px` section padding.

### Typography targets

- Hero H1 desktop: `clamp(38px, 3.7vw, 48px)`, line-height `1.15`, letter-spacing `-.01em`.
- Hero H1 mobile: `clamp(31px, 8.7vw, 42px)`.
- Section H2: `clamp(32px, 3.5vw, 46px)`, line-height `1.15`.
- Body copy: generally `15.5px–17.5px`, line-height `1.5–1.64`.
- Uppercase labels: Inter 800, `10.5px–12.5px`, tracking `.13em–.18em`.
- Large prices and statistics: Merriweather 800.

## 7. Shared shell and header

### Announcement bar

- Ink background, cream text, gold emphasis.
- Desktop: `13.5px`, padding `10px 20px`.
- Mobile: `12.5px`, padding `9px 14px`, shorter alternate message.

### Navigation

- Sage background; maximum width `1240px`; desktop padding `16px 48px`.
- Logo is `64px × 64px` desktop and `54px × 54px` mobile.
- Center desktop links: How it works, Gallery, Reviews, FAQ; gap `26px`.
- Link hover draws a `2.5px` red underline left-to-right.
- Right side: click-to-call link plus raised red quote CTA.
- At `1000px` and below, hide inline links and show a native `<details>` menu.
- Mobile menu is a right-aligned cream board, minimum width `228px`, opened with a `200ms` clip-path unroll.
- Close the menu when any menu link is chosen.
- At `760px` and below, hide the header quote CTA and render the phone as a `46px × 46px` icon-only control.

### Animated holiday light strand — exact behavior

Implement this as reusable SVG/CSS, not a raster background.

- Strand height: `44px`.
- Desktop: four equal flex segments; six bulbs per segment; 24 bulbs total.
- Mobile at `760px` and below: hide segments 3 and 4; 12 bulbs total.
- Each segment wire uses `viewBox="0 0 100 44"`, `preserveAspectRatio="none"`, and path `M0,3 Q50,40 100,3` with `1.4px` ink stroke.
- Bulb X stations per segment: `8.3%`, `25%`, `41.7%`, `58.3%`, `75%`, `91.7%`.
- Bulb Y positions: `13.2px`, `21.4px`, `25.5px`, `25.5px`, `21.4px`, `13.2px`.
- Each bulb is `14px` wide, centered with `margin-left:-7px`, and lifted with `margin-top:-4.8px`.
- Bulb SVG uses `viewBox="0 0 16 26"` and three paths:
  - Cap: `M5.11 0.95H10.89A1.25 1.25 0 0 1 12.15 2.2V4.52A1.25 1.25 0 0 1 10.89 5.77H5.11A1.25 1.25 0 0 1 3.85 4.52V2.2A1.25 1.25 0 0 1 5.11 0.95Z`
  - Glass: `M8 6.5C13 6.5 14.1 9.46 14.1 13.55C14.1 18.15 10.7 23.78 9.34 24.63Q8 25.47 6.66 24.63C5.3 23.78 1.9 18.15 1.9 13.55C1.9 9.46 3 6.5 8 6.5Z`
  - Highlight: `M11.29 16.7Q10.41 19.76 9.04 22.82`
- Cap fill is cream with ink outline; glass uses current color with ink outline; highlight is cream. A cream bulb uses a partially transparent ink highlight.
- Color map by segment:
  - 1: gold, red, cream, gold, gold, red.
  - 2: cream, gold, gold, red, cream, gold.
  - 3: gold, red, cream, gold, gold, red.
  - 4: cream, gold, gold, red, cream, gold.
- Ignition: `.55s` with left-to-right delay of approximately `index × 55ms`.
- Breathing glow: `2.6s ease-in-out infinite alternate`, beginning after the strand has ignited.
- Use `filter: drop-shadow(...)` so the glow follows the bulb silhouette.
- Ignition keyframes: dim at 0%, bright bloom at 38%, settle at 100%.
- Breathing range: from roughly `4px` glow / `.95` brightness to `9px + 3px` glow / `1.14` brightness.
- Use `overflow-x:clip`, not `hidden`, on the strand.
- Under `prefers-reduced-motion: reduce`, disable motion but retain a static `drop-shadow(0 0 6px currentColor)` glow.

### Mobile contact bar

- At `760px` and below, show a fixed bottom bar with two equal columns: red Call and cream Text.
- Add `74px` bottom padding to the page.
- Keep it translated below the viewport while the hero's primary CTA is visible; reveal it when the hero CTA leaves the viewport.
- Ensure it does not cover the footer or sticky controls inside the quote wizard.

## 8. Homepage composition

Implement the following bands in this exact order.

### 8.1 Hero — sage

- Desktop two-column grid: `1.08fr .92fr`, `64px` gap, padding `40px 48px 104px`.
- At `1100px`, switch to one column.
- At `760px`, use `28px 20px 84px` and a `40px` gap.
- Left column: two-line display headline, service summary, separate bold repair promise, red primary CTA, cream call CTA, and compact trust row.
- On mobile, hide the secondary hero call button.
- Add a few small ink/gold sparkle SVGs on desktop; hide them on mobile.
- Right column: cream raised media board tilted `1.1deg`.
- Video display: aspect ratio `10 / 8.5`, `object-fit:cover`, `object-position:50% 58%`, ink outline, rounded inner frame.
- Add an accessible inset Play/Pause button.
- Hang a separate guarantee plaque beneath the media board using two drawn chains. Slightly counter-rotate the plaque and feature the 48-hour figure in red.
- End the hero with a full-width cream proof strip bordered in ink.

Hero media behavior:

- Start with a poster image.
- Use project-owned AV1 and H.264 sources.
- Set `muted`, `loop`, `playsInline`, and `preload="none"`.
- Only arm autoplay when the media is visible, the page is active, reduced motion is off, Data Saver is off, and the connection is not 2G.
- Always keep manual Play/Pause available.

### 8.2 Problem versus solution — sage

- Centered heading and introductory paragraph.
- Desktop three-column comparison: intentionally lighter/crooked negative card, cream “instead” pill, dominant raised solution card.
- Negative card: translucent sage, dashed ink border, no hard shadow, slight negative rotation.
- Positive card: cream, 3px ink outline, about 9px hard shadow, dotted inset trim, slight positive rotation.
- Include four negative points and four positive service stages.
- End with a centered assurance line and quote CTA.
- Stack sequentially at `900px` and below.

### 8.3 Gallery and proof — ink, `id="gallery"`

- Heading and intro in cream with gold emphasized word.
- Six-image asymmetric grid using cream-outlined photo boards and dark hard shadows.
- Desktop grid: six columns with approximately `172px` rows; first image spans four columns by two rows.
- At `900px`, use two columns. At `560px`, use approximately `132px` rows.
- Put small cream location plates at bottom-left of each image.
- Follow with credibility copy, four gold statistics, a dotted divider, a service-area eyebrow, and outlined service-area pills.
- All images need explicit dimensions, useful alt text, and lazy loading except any image proven to be LCP.

### 8.4 How it works — cream, `id="how-it-works"`

- Four equal-height raised cards in a four-column grid.
- Draw a horizontal ink hanging rail above the cards, with chains/hooks connecting to each card.
- Each card has a red circular number badge, title, description, and small gold pill label.
- Reveal once on intersection: draw the rail left-to-right, fade cards in sequentially, then scale number badges into place.
- At `880px`, remove the rail/chains and stack cards with `56px` vertical gaps.
- Finish with a centered quote CTA.

### 8.5 Reviews — sage, `id="reviews"`

- Use one large cream ledger board, not four unrelated cards.
- Add an ink ledger header with gold rating and five SVG stars.
- Desktop reviews are a ruled 2×2 grid.
- At `820px`, use one column.
- At `760px`, show only two featured reviews to control mobile page length.
- Add an underlined external review link driven by configuration.
- Beneath the ledger, add a slightly rotated ink “honesty record” board with gold metrics and dotted internal rules.

### 8.6 Pricing/value — cream

- Centered display heading and intro.
- Large Merriweather seasonal price range on one line where possible, with a red dash.
- Custom pill-shaped range gauge with a gold “most homes” middle band and estate tail.
- Add typical-home explanation beneath it.
- Follow with a framed cream value card and quote CTA.
- Limit the gauge to about `300px` at `620px` and below.

### 8.7 FAQ — sage, `id="faq"`

- Six native `<details>` items; first item open by default.
- Cream boards with ink outlines and hard shadows.
- CSS-drawn red plus changes to minus when open.
- Preserve keyboard behavior and visible focus.
- Hover/press may translate the board by `2px` with matching shadow reduction.
- If animated intrinsic height is unsupported, fall back to native open/close without breaking content.

### 8.8 Closing CTA and footer — ink

- Booking eyebrow, large cream heading with gold emphasis, support copy, red quote CTA, gold-underlined call link, and a compact proof row.
- Separate footer content with a subtle gold dotted divider.
- Desktop footer grid: approximately `1.7fr 1fr 1fr 1.3fr`.
- At `820px`, use two columns with the brand spanning both.
- At `520px`, use one column.
- Include brand summary, social buttons, contact details, hours, address, explore links, service areas, and legal row from configuration.
- Social buttons are `44px × 44px` cream-outline plates.

## 9. Quote wizard

Use the same announcement bar, navigation, animated light strand, footer, and mobile contact bar as the homepage.

### Quote page visual frame

- Sage page background.
- Centered headline and compact three-item proof row.
- Main wizard appears as a cream hung board, max width about `860px`, with two hanging chains.
- Inside the board, render a five-station progress strand: Property, Size, Budget, Contact, Review.
- Progress bulbs begin dark and illuminate as steps are completed.
- At successful completion, transition the board/page to the ink “night” state and light all progress bulbs gold.

### State machine

Represent wizard state explicitly; do not infer it from DOM classes.

```ts
type QuoteState = {
  phase: "zip" | "questions" | "submitting" | "success" | "error";
  step: 0 | 1 | 2 | 3 | 4;
  zip: string;
  inArea: boolean | null;
  propertyType: "residential" | "commercial" | "";
  stories: "1" | "2" | "3plus" | "";
  budget: "tier1" | "tier2" | "tier3" | "unsure" | "";
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  consent: boolean;
};
```

### Step 0: ZIP gate

- Accept exactly five digits.
- Check against the project-owned service ZIP allowlist.
- Show clear in-area and out-of-area result states.
- Allow an out-of-area visitor to continue deliberately.
- Support `?zip=12345` prefill, but do not auto-submit.
- Keep service-area values in `content/service-areas.ts`.

### Question 1: Property type

- Two large illustrated option cards: Residential and Commercial.
- Selecting a card visibly checks it and advances or enables Next.
- Use project-owned illustrations; selected state can reveal a lit image layer.

### Question 2: Building height

- Three illustrated cards: one story, two stories, three-plus/lift required.
- Maintain equal card behavior and clear selected state.

### Question 3: Budget

- Three project-owned price bands plus “Not sure yet.”
- Use stacked raised rows on smaller screens.
- Values and labels come from `content/quote.ts`, not component literals.

### Question 4: Contact

- Required: name, phone, property address.
- Optional: email, notes.
- Include clear call/text consent text and checkbox based on the project's actual legal requirements.
- If address autocomplete is added, use a project-owned key and keep manual entry functional when the provider fails.
- Use accessible inline errors linked with `aria-describedby`.

### Review

- Show every answer in a readable summary.
- Provide Edit/Back controls.
- Explain what happens after submission.
- Disable duplicate submission while pending.

### Submit, failure, and success

- Submit to `/api/leads`, never directly from the browser to a third-party webhook.
- Validate again on the server with Zod.
- Add request timeout, idempotency key, honeypot, rate limiting, and structured server logging without storing sensitive data in console output.
- Map the validated request to a project-owned CRM/webhook only on the server.
- On failure, preserve answers and show retry plus configured call/text fallback.
- On success, show an accessible confirmation state and next-step expectations.
- Never copy the reference site's exposed Zapier webhook.

## 10. Content and configuration model

At minimum, centralize:

- Business name and logo asset.
- Primary phone, SMS phone, optional tracking number, email, address, and hours.
- Social URLs and review URL.
- Announcement/booking season and deadline.
- CTA labels.
- Rating, review count, insurance amount, year established, homes served, and return-customer figures.
- Prices, deposit percentage, install window, repair promise, and discount claims.
- Counties, cities, service ZIP allowlist, and future city slugs.
- Gallery assets, dimensions, locations, and alt text.
- Review names, excerpts, attribution, and verification status.
- FAQ questions and answers.
- SEO title, description, canonical base, OG image, and schema data.
- Lead endpoint/integration settings.

The live page dynamically swaps phone numbers through CallRail, which is why its static source and rendered phone can differ. The clone should render one project-owned canonical number from configuration. Add number-swapping only when the project owner supplies their own account and test plan.

## 11. Assets and media

- Store local media under `public/media` or an equivalent project-owned asset store.
- Do not hotlink the reference domain.
- Reuse the reference logo, photography, customer names/reviews, or video only if the project owner has the rights. Otherwise use dimension-matched placeholders until new assets are supplied.
- Reference asset proportions:
  - Square logo, source rendered at `160 × 160`.
  - Six gallery images: approximately `4:3`, `4:3`, `4:3`, `3:4`, `4:3`, and `16:9`.
  - Hero video board: portrait-leaning crop displayed at `10:8.5`.
- Generate a poster image for the hero reel.
- Supply AV1 and H.264 video variants.
- Preserve explicit image dimensions to prevent CLS.

## 12. SEO and local SEO scaffold

The initial copy and real service areas will change later, so SEO must be data-driven from day one.

- Use Next.js metadata for unique title, description, canonical, Open Graph, and Twitter values.
- Add project-owned `LocalBusiness`, `Organization`, `WebSite`, `WebPage`, and `Place` JSON-LD only when the underlying values are accurate.
- Add `FAQPage` JSON-LD only for questions visibly rendered on the page and only if it remains appropriate for the site's search strategy.
- Keep NAP identical in visible footer content and schema.
- Generate `sitemap.xml` and `robots.txt`.
- Do not publish thin placeholder location pages.
- Prepare a future `service-area/[slug]` content model, but only generate routes when each city has unique, substantive content.
- While copied/placeholder business content remains, set staging to `noindex` and block production deployment.
- Do not carry over the reference site's Rank Math data, GTM container, CallRail script, author schema, or analytics IDs.

## 13. Attribution and analytics

- Create an optional first-party attribution module with explicit consent integration.
- Preserve first-touch and last-touch UTMs and common ad click IDs for up to the project's approved retention period.
- Read attribution at submission time and pass it server-side with the lead.
- Do not include arbitrary query strings, referrer paths containing personal data, or raw browser history.
- All analytics and advertising code must be disabled unless project-owned IDs are present.
- Document the final event names for quote start, ZIP result, step completion, submit success, submit failure, call click, and text click.

## 14. Accessibility and interaction requirements

- Add a visible-on-focus skip link and focusable main target.
- Use one H1 per route and logical H2/H3 order.
- Use native links, buttons, `<details>`, labels, inputs, and form semantics.
- Do not make option cards clickable `div` elements; use buttons or radios.
- Maintain visible 3px focus rings with adequate contrast.
- Minimum mobile target size: `44px`.
- Decorative SVGs must be `aria-hidden`.
- The video toggle needs an accurate Play/Pause accessible name.
- Use `aria-live` conservatively for ZIP results, validation summary, and submission status.
- On step change, move focus to the new question heading without forcing unwanted scroll.
- Honor `prefers-reduced-motion`; retain meaning and static bulb glow.
- Verify contrast on sage, cream, ink, red, and gold combinations.

## 15. Performance requirements

- Server-render all static content.
- Keep client JavaScript limited to menu behavior, video control, mobile CTA visibility, reveal animation, FAQ enhancement, and quote state.
- Lazy-load gallery media and non-critical illustrations.
- Do not preload hero video; use the poster as the first paint.
- Load only the Merriweather 800 and required Inter weight range.
- Avoid layout shifts by reserving media and board dimensions.
- Do not animate layout-heavy properties when transform/opacity/clip-path works.
- Verify no horizontal overflow at 320px and 375px.

## 16. Responsive breakpoints and visual regression matrix

Required behavior breakpoints:

- `1100px`: hero becomes one column.
- `1000px`: desktop nav links hide; mobile menu appears.
- `900px`: comparison stacks; gallery becomes two columns.
- `880px`: section padding shrinks; process cards stack and rail disappears.
- `820px`: review ledger and footer use narrower layouts.
- `760px`: mobile header treatment, two light-strand segments, sticky Call/Text bar, smaller type, reduced review count.
- `620px`: pricing gauge compresses.
- `560px`: gallery rows, video control, form padding, and FAQ spacing tighten.
- `520px`: closing actions and footer become one column.

Capture and compare screenshots at:

- `1440 × 1000`
- `1280 × 900`
- `1024 × 900`
- `900 × 1000`
- `768 × 1024`
- `390 × 844`
- `375 × 812`
- `320 × 700`

## 17. Implementation sequence for Cursor

### Phase 0 — inspect and baseline

1. Inspect the repository, package manager, existing routes, styles, test setup, and dirty files.
2. Report the discovered stack and any conflict with this plan.
3. Create a short implementation checklist in the repo.
4. Start the local app and capture baseline screenshots if a site already exists.
5. Do not overwrite unrelated user work.

### Phase 1 — foundation

1. Add fonts, reset, tokens, page backgrounds, max-width containers, base focus styles, and reusable board/button/label primitives.
2. Add typed site/content configuration.
3. Build the shared announcement bar, header, mobile menu, footer, and mobile contact bar.
4. Build and test the reusable animated holiday light strand before proceeding.

### Phase 2 — homepage

1. Implement the hero and video behavior.
2. Implement comparison.
3. Implement gallery/proof.
4. Implement process cards and one-time reveal.
5. Implement reviews/record board.
6. Implement pricing/value.
7. Implement FAQ and closing CTA.
8. Test every breakpoint and fix overflow before moving on.

### Phase 3 — quote wizard

1. Build the hung-board shell and progress strand.
2. Implement the ZIP gate and project-owned service area logic.
3. Implement each question step with typed state.
4. Implement contact validation and review.
5. Implement `/api/leads` with safe stub behavior when no endpoint is configured.
6. Implement error and success states.
7. Add keyboard, focus, mobile sticky-control, and refresh/back-navigation tests.

### Phase 4 — metadata and production hardening

1. Add route metadata, JSON-LD helpers, robots, sitemap, icons, and OG assets.
2. Add consent-aware attribution/analytics hooks but leave them disabled without project IDs.
3. Add privacy page and environment variable documentation.
4. Confirm that no reference-domain integration or contact detail remains.

### Phase 5 — verification

1. Run formatting, lint, typecheck, unit tests, build, and Playwright tests.
2. Run visual comparisons at all eight target viewports.
3. Test keyboard-only use, reduced motion, Save Data behavior where possible, and JavaScript-disabled fallbacks.
4. Check console and network logs for errors, mixed content, failed media, and unexpected requests.
5. Use Lighthouse as a diagnostic, then fix concrete issues rather than chasing a score blindly.

## 18. Acceptance checklist

### Visual

- [ ] Exact palette, fonts, borders, hard shadows, radii, spacing rhythm, and section order.
- [ ] Header strand has 24 animated bulbs desktop and 12 mobile.
- [ ] Bulbs illuminate sequentially, breathe softly, and remain statically lit under reduced motion.
- [ ] No soft card shadows or generic modern SaaS styling.
- [ ] Hero media board, hanging guarantee plaque, process rail, ledger, price gauge, FAQ boards, and footer match the reference composition.
- [ ] No horizontal overflow at 320px, 375px, or 390px.

### Functional

- [ ] Desktop anchors land on the correct sections.
- [ ] Mobile menu opens, animates, closes on selection, and remains keyboard accessible.
- [ ] Hero video respects visibility, reduced motion, Save Data, and manual control.
- [ ] Mobile Call/Text bar appears only after the hero CTA leaves view and never covers essential controls.
- [ ] Process reveal runs once; content remains visible without JavaScript.
- [ ] FAQ works without custom JavaScript.
- [ ] Quote wizard validates every step, preserves answers, supports Back/Edit, prevents duplicate submission, and handles failure.
- [ ] No form submission reaches the reference site.

### Content and SEO

- [ ] Every mutable string and business fact is in typed content/configuration.
- [ ] Placeholder content can be replaced without changing layout components.
- [ ] Metadata, schema, footer NAP, sitemap, and robots use project-owned data.
- [ ] Staging remains `noindex` until original copy/assets and real business data are supplied.

### Quality

- [ ] TypeScript strict mode passes.
- [ ] Production build passes.
- [ ] Playwright smoke and visual tests pass.
- [ ] Keyboard and focus behavior pass manual review.
- [ ] No console errors and no unexpected third-party requests.

## 19. Cursor working rules

- Work phase by phase and keep the app runnable after every phase.
- Inspect before editing; preserve existing conventions when they satisfy this plan.
- Prefer semantic HTML and CSS over JavaScript abstractions.
- Do not approximate a distinctive element with a generic component when exact SVG/CSS is specified here.
- Do not copy the reference site's entire generated HTML into one component.
- Do not paste its inline WordPress scripts, tracking, webhook, or identifiers.
- Use deterministic data arrays for bulbs, gallery items, metrics, reviews, process steps, and FAQs.
- After each major section, compare the implementation beside the live reference at the required viewport.
- If an asset is missing, create a correctly sized placeholder and record it in `ASSET-TODO.md`; do not hotlink.
- If a business/SEO value is unknown, use an obvious typed placeholder and keep staging `noindex`; do not invent claims.
- Stop only when the acceptance checklist is complete or a genuine user-owned asset/business decision is required.

## 20. Sources used for this plan

- [Reference homepage](https://happylightsmiami.com/)
- [Reference quote wizard](https://happylightsmiami.com/christmas-light-quote/)
- [Reference XML sitemap](https://happylightsmiami.com/page-sitemap.xml)
- [Reference homepage WordPress record](https://happylightsmiami.com/wp-json/wp/v2/pages/9822)
- [Cursor documentation for Claude Fable 5.2](https://prod.cursor.com/docs/models/claude-fable-5-2)

Audit date: November 13, 2026. Re-check the live reference before final visual sign-off because it may change after this audit.
