# Assets awaiting owner approval

All files in `public/media` were generated locally as original SVG layout
placeholders, not downloaded from the reference business. The gallery and hero
are visibly labelled illustrative concepts. `scripts/create-placeholders.mjs`
regenerates them. No media request points to the reference domain.

Before launch replace:

- `logo.svg`: approved business identity (160×160).
- `hero-reel-poster.svg`: licensed poster for the 10:8.5 display crop.
- Hero video: add owned AV1 and H.264 sources in `content/home.ts`. Sources are
  deliberately empty until clips exist; the implementation renders a poster
  without broken requests or a nonfunctional play button. Video visibility,
  document activity, reduced-motion, Save Data, 2G and manual controls are ready.
- `gallery-1.svg` through `gallery-6.svg`: six licensed installation photographs;
  preserve dimensions, useful alt text and location labels in `content/home.ts`.
- `quiz-house-*`, `quiz-store-*`, `quiz-story1-*`, `quiz-story2-*`,
  `quiz-story3-*`: lit/unlit property illustrations. These original SVGs can be
  retained if approved; they are illustrative, not customer installations.
- `quiz-skyline.svg`: success illustration.
- `og.png` / `og.svg`: branded 1200×630 social image after identity approval.

Business details, claims, review permission, service coverage, contact details,
pricing, consent/privacy wording and a project-owned lead integration must also
be supplied. Keep staging noindex; do not claim pixel-faithful media parity
while these stand-ins remain.
