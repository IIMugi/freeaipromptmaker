# System Patterns

## Rendering and routes

- Next.js App Router with static generation for the home, legal, blog, tools, and prompt-use-case surfaces.
- A single global `main#main-content` landmark in `app/layout.tsx`.
- Canonical URL helpers in `lib/seo.ts`; apex redirects are resolved before legacy-path redirects and preserve query strings.

## Editorial state

- `lib/editorial.ts` is the source of truth for `verified` versus `needs-review` state.
- Blog hubs, sitemap entries, related links, and other publisher surfaces use the verified subset.
- A quarantined route returns `noindex, follow`; missing or invalid routes use the normal not-found behavior.
- Frontmatter, rendered-content bounds, source ledgers, and content decisions are covered by automated tests.

## Privacy and analytics

- `lib/consent.ts` is the consent state boundary.
- Google Consent Mode defaults are written before any optional analytics configuration.
- The external analytics script is gated by current consent; withdrawal updates consent, clears reachable analytics cookies, and is respected across tabs.
- Tracking helpers reread consent at call time and accept bounded event fields.

## Upload security

- `lib/image-upload.ts` contains client-safe constants and signature checks.
- `lib/image-upload.server.ts` performs bounded stream reading and full Sharp decode before provider use.
- One PNG, JPEG, or WebP frame is accepted within configured byte, dimension, and pixel limits.

## Advertising

- `components/Ads/AdUnit.tsx` and `AdSenseScript.tsx` are inert boundaries while `READINESS.adsEnabled` is false.
- Routes do not reserve or render placement containers.

## Quality gates

- Vitest for units and render assertions.
- Playwright plus axe for runtime, keyboard, landmark, console, network, and responsive checks.
- Route inventory and Lighthouse outputs are recorded under `docs/adsense-rebuild/` and copied to the task output directory at completion.

