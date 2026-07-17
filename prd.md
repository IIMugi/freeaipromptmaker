# Free AI Prompt Maker — Current Product Requirements

Last updated: 2026-07-17

## Product purpose

Free AI Prompt Maker is a static-first web tool that helps people assemble text prompts for several image-generation interfaces. It provides editable prompt building blocks, local examples, and reviewed educational guides. It does not generate an image on the main prompt-builder route and does not promise that a prompt will produce a particular result.

## Required user experiences

- Build and copy a prompt using model, subject, style, lighting, camera, and parameter controls.
- Upload an image only on the image-to-prompt route. The server must bound the request, verify the signature, fully decode a single supported image, and reject invalid dimensions or pixel counts before contacting the configured provider.
- Browse use-case worksheets that clearly label examples as locally authored and not independently output-tested.
- Browse the editorial blog. Only entries marked `verified` may be indexed or exposed through publisher surfaces; `needs-review` entries remain accessible by direct URL but are excluded from discovery and indexing.
- Read About, Contact, Privacy, Cookies, Terms, and Content Standards pages from the global navigation or footer.
- Choose analytics consent, withdraw it later, and have the decision respected across navigation and tabs.

## Publishing boundary

Generated material is never published automatically. The two content workflows are manual, read-only jobs that can create one unpublished artifact at an explicit `CONTENT_DRAFT_OUTPUT` path. Every draft requires manual editorial review, source verification, claim checking, and an explicit registry decision before it can become publisher content.

## Advertising boundary

Advertising is disabled during readiness work. The runtime keeps only a centralized, inert ad boundary so a future implementation cannot appear accidentally. Account state, policy eligibility, placement design, consent behavior, and production verification must all be reviewed before any future enablement.

## Quality requirements

- Static-first rendering and canonical redirects with query preservation.
- One main landmark per page, keyboard-reachable skip navigation, visible focus, adequate contrast, and usable layouts from 375px upward.
- Production CSP without `unsafe-eval`, HSTS, clickjacking protection, bounded uploads, and no secrets in client bundles.
- Meaningful canonical pages may be indexed. Duplicate model/use-case variants remain followable but noindexed.
- No fabricated testing, experience, rankings, benchmarks, popularity, earnings, conversion, or result claims.
- Clean install, lint, TypeScript, unit, production build, browser suite, route audit, and dependency audit must pass before release consideration.

## Non-goals

- Automatic publication or deployment.
- Enabling advertising during the local readiness rebuild.
- Guaranteeing provider behavior, output quality, traffic, search position, indexing, or monetization review outcomes.
