# AdSense readiness rebuild implementation log

Date: 2026-07-16

Branch: `feature/adsense-readiness-rebuild`

Baseline: `0b82f2f`

Implementation head before this report: `587cb78`

## Scope and authority

The work covered repository inspection, live-site inspection, read-only Search Console, Analytics, and AdSense evidence collection, URL decisions, architecture, UI/frontend, technical SEO, content controls, privacy/consent boundaries, security, testing, performance, and final adversarial review.

No deployment, push, DNS change, Google account setting change, sitemap submission, indexing request, CMP publication, ads enablement, or AdSense review request was performed.

## Implementation sequence

| Commit | Result |
| --- | --- |
| `a6287ef` | Added Vitest, Testing Library, Playwright, axe, and initial quality gates. |
| `30f6696` | Disabled automated direct publishing; workflows now produce reviewable draft artifacts only. |
| `bdab060` | Centralized factual site identity and readiness flags. |
| `2ef0e21` | Added explicit editorial states and derived guide visibility/indexability from them. |
| `bff82f3` | Centralized canonicals, schema policy, sitemap behavior, redirects, and removal handling. |
| `1ddc000` | Disabled advertising and removed empty inventory; separated optional analytics consent. |
| `9385108` | Removed filename-based fabricated image analysis and added fail-closed API contracts. |
| `c391ae2` | Added typed, payload-safe product outcome analytics. |
| `a4c5b2c` | Removed invented prompt quality/confidence and unsupported model syntax claims. |
| `8fd6c5b` | Rebuilt the responsive shell, themes, navigation, skip link, and reduced-motion behavior. |
| `a4fe522` | Rebuilt the homepage around the real local formatter and removed fake metrics/community claims. |
| `a43c684` | Rewrote trust, legal, tools, error, and 404 pages to match actual behavior. |
| `274619a` | Preserved the traffic-leading guide, rewrote it from primary sources, merged its duplicate, and quarantined the unreviewed corpus. |
| `7bcaf51` | Upgraded Next/React and dependencies, added production security headers, and reduced the production audit to zero findings. |
| `587cb78` | Closed full WCAG, hydration, console/network, route-crawl, and performance findings. |

## URL and editorial implementation

- Decision rows: 422.
- Primary decisions: 275 `IMPROVE`, 144 `NOINDEX`, 1 `MERGE`, 1 `REDIRECT_301` (implemented by Next as permanent 308), and 1 `DELETE_410`.
- Implemented states: 167 general decisions, 251 guide noindex/needs-review decisions, 2 permanent redirects, 1 explicit 410, and 1 verified guide.
- Editorial registry: 1 verified guide and 252 needs-review records. One needs-review record is the merged source URL and resolves through the permanent redirect.
- The guide hub and sitemap expose only the verified guide.
- The 144 model-specific use-case variants remain useful direct tools but are noindex and absent from the sitemap.
- The malformed nested `/keyword` URL returns 410.
- `/flux-pro` redirects permanently to `/prompt-generators`.
- The weaker 2025-11-27 negative-prompts guide redirects permanently to the evidence-backed 2025-11-29 guide.

The row-level evidence and implementation states are in `CONTENT_DECISIONS.csv` and `URL_INVENTORY.csv`.

## Quality and security evidence

| Gate | Final observed result |
| --- | --- |
| `npm ci` | Lockfile installation completed during the final gate. |
| `npm run lint` | Exit 0; zero errors and warnings. |
| `npx tsc --noEmit` | Exit 0. |
| `npm test` | 21 files, 47 tests passed. |
| `npm run build` | Next 16.2.10; 426 static pages generated; exit 0. |
| `npm run test:e2e` | 32 Chromium tests passed against the production build. |
| `npm run audit:routes` | 423 routes, 24 sitemap URLs, 126 internal links, 17 assets; zero issues. |
| `npm audit` | Zero vulnerabilities, including development dependencies. |
| `npm audit --omit=dev` | Zero production vulnerabilities. |

The route audit checked status codes, redirect destinations, canonical count/target, one H1, robots/sitemap consistency, unsupported rating schema, internal link status, and first-party asset status. Browser gates covered 375/768/820/1280 widths, theme persistence, keyboard dismissal, skip-link focus, both-theme WCAG A/AA scans, verified and quarantined guides, 404/410/308 behavior, and unexpected console/network errors.

## Mobile Lighthouse comparison

Lighthouse 13.4.0 ran three times per route against a production build; values below are medians.

| Route | Phase | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | First rebuild measurement | 87 | 100 | 100 | 92 | 1.06s | 3.88s | 144ms | 0 | 410 KB |
| `/` | Final | 94 | 100 | 100 | 100 | 0.92s | 2.94s | 117ms | 0 | 264 KB |
| Verified guide | First rebuild measurement | 86 | 100 | 100 | 92 | 1.21s | 3.92s | 190ms | 0 | 521 KB |
| Verified guide | Final | 96 | 100 | 100 | 100 | 0.91s | 2.85s | 44ms | 0 | 323 KB |

The original audit baseline was homepage performance 91/LCP 2.87s and article performance 83/LCP 3.52s. Lab variation means small cross-run differences should not be treated as field improvement. The final simulated mobile LCP remains above the 2.5-second target, so Search Console field CWV must be observed after deployment.

## Adversarial review outcomes

- **AdSense reviewer:** ad code, slots, and placeholders are disabled; fake ratings and unsupported schema were removed. The remaining blocker is content depth: only one guide is verified, so review submission is not recommended yet.
- **Technical SEO:** verified-only sitemap/hub, one-hop redirects, explicit 410, accurate canonicals, truthful metadata, and noindex quarantine passed the full crawl.
- **Keyboard/low-vision:** skip target is focusable, mobile navigation closes with Escape, controls have names, links are not distinguished by color alone where tested, and both themes pass automated WCAG A/AA scans.
- **Mobile:** no horizontal overflow at 375, 768, 820, or 1280 pixels; generator is before explanatory content.
- **Security/privacy:** file signatures and size are validated, provider failures do not fabricate success, CSP/security headers are present, analytics is opt-in, and dependency audits are clean.
- **Skeptical AI-art practitioner:** output quality guarantees, fake confidence, invented syntax, fake tests, false personal experience, stale ratings/pricing, and universal negative-prompt claims were removed from public product/trust surfaces. The verified guide identifies versions, limitations, and primary sources.
- **Repository residue:** the unused legacy foundational guide containing false FAQ/zero-retention/guarantee claims was deleted during the adversarial pass.

## Deviations and limitations

- Context7 was requested by repository instructions but was unavailable; current primary vendor documentation was used instead.
- The code-review workflow normally delegates to a reviewer agent, but this task did not authorize subagents. A separate self-adversarial diff and requirements review was performed.
- Lighthouse wrote valid JSON on every run but Windows intermittently returned `EPERM` while deleting Lighthouse's temporary Chrome profile. Every used artifact was independently parsed; the temporary Lighthouse package was then removed and `npm audit` returned zero findings.
- No screen-reader human session, real low-vision user session, or production-device field test was performed. Automated axe coverage is not a substitute for those checks.
- The local implementation is complete, but monetization readiness still depends on external deployment, genuine editorial evidence, live observation, a certified CMP when ads are enabled, and account-side review.
