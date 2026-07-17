# AdSense readiness rebuild implementation log

Date: 2026-07-17

Branch: `feature/adsense-readiness-rebuild`

Baseline: `0b82f2f`

Implementation head before the final report update: `55798c8`

## Scope and authority

The work covered repository inspection, live-site inspection, read-only connected evidence, URL decisions, architecture, UI, editorial controls, technical SEO, privacy/consent, uploads, security, testing, performance, residue removal, and adversarial review.

No deployment, remote publication, DNS change, Google account setting change, sitemap submission, indexing request, CMP publication, advertising enablement, or AdSense review request was performed.

## Implementation sequence

| Commit | Result |
| --- | --- |
| `a6287ef` | Added Vitest, Testing Library, Playwright, axe, and initial quality gates. |
| `30f6696` | Converted generated publishing to manual unpublished artifacts with no direct publication. |
| `bdab060` | Centralized factual site identity and readiness flags. |
| `2ef0e21` | Added explicit editorial states and derived publisher visibility/indexability from them. |
| `bff82f3` | Centralized canonicals, schema policy, sitemap behavior, redirects, and removal handling. |
| `1ddc000` | Disabled advertising/empty inventory and separated optional analytics consent. |
| `9385108` | Removed fabricated image-analysis fallback and added fail-closed API contracts. |
| `c391ae2` | Added typed, payload-safe product outcome analytics. |
| `a4c5b2c` | Removed invented prompt quality/confidence and unsupported model-syntax claims. |
| `8fd6c5b` | Rebuilt the responsive shell, themes, navigation, skip link, and reduced-motion behavior. |
| `a4fe522` | Rebuilt the homepage around the local formatter and removed fake metrics/community claims. |
| `a43c684` | Rewrote trust, legal, tools, error, and not-found pages to match actual behavior. |
| `274619a` | Preserved the traffic-leading guide, rewrote it from primary sources, merged its duplicate, and quarantined the unreviewed corpus. |
| `7bcaf51` | Upgraded dependencies and added production security headers. |
| `587cb78` | Closed initial WCAG, hydration, console/network, route-crawl, and performance findings. |
| `2702e71` | Recorded the first complete local readiness report and evidence package. |
| `0341e26` | Designed the verified publisher-depth expansion. |
| `4951bcb` | Added the test-first implementation plan for candidate guide promotion. |
| `512962e` | Withheld all unverified legacy guide bodies while preserving direct review routes. |
| `b2e9020` | Rewrote the Stable Diffusion candidate workflows with primary sources and bounded claims. |
| `829d000` | Added semantic table rendering and bounded content checks. |
| `9e221a8` | Distinguished table and editorial-policy labels for assistive technology. |
| `0e829b5` | Rewrote Leonardo and Midjourney candidate guides around documented interfaces and limitations. |
| `4bc220b` | Tightened Leonardo/Midjourney version and claim boundaries. |
| `e991adf` | Hardened verified-content structural safeguards. |
| `bfb1390` | Protected AST comment/span pairing in content checks. |
| `dc383c4` | Promoted six additional source-verified guides and exposed their topic clusters. |
| `d8414cb` | Refreshed the rendered inventory and decision CSVs after guide promotion. |
| `6ed7d57` | Enforced default-denied analytics, withdrawal, cookie cleanup, cross-tab changes, and current-consent event checks. |
| `933b327` | Bounded request streams and fully decoded single-frame images before provider use. |
| `5673122` | Hardened production CSP/HSTS/framing and one-hop host/legacy redirects with query preservation. |
| `f618c3d` | Replaced unsupported use-case rankings and outcome claims with factual worksheets; removed nested publisher landmarks. |
| `c4439c1` | Removed stale ad/injector/helper code, repository-mutating draft behavior, and obsolete active guidance. |
| `55798c8` | Closed the final blog overflow and quarantine-landmark defects; added the full QA matrix and multi-run Lighthouse parser. |

## URL and editorial result

- Decision rows: 422.
- Primary decisions: 275 `IMPROVE`, 144 `NOINDEX`, 1 `MERGE`, 1 `REDIRECT_301`, and 1 `DELETE_410`.
- Implementation states: 167 general decisions, 245 direct guide quarantine decisions, 7 verified guides, 2 permanent redirects, and 1 explicit 410.
- Editorial registry: 253 records — 7 verified and 246 `needs-review`.
- Verified topic clusters: Stable Diffusion (4), Leonardo (2), Midjourney (1).
- Sitemap: 30 indexable URLs; model/use-case variants and quarantined guides are absent.
- The malformed nested `/keyword` URL returns 410.
- `/flux-pro` and the weaker duplicate negative-prompts guide resolve by one-hop permanent redirects.

The row-level decisions and fresh rendered inventory are in `CONTENT_DECISIONS.csv` and `URL_INVENTORY.csv`.

## Final feature-branch gate

| Gate | Observed result |
| --- | --- |
| `npm ci` | 643 packages installed; 644 audited; 0 vulnerabilities. |
| `npm run lint` | Exit 0; no reported errors or warnings. |
| `npx tsc --noEmit` | Exit 0. |
| `npm test` | 27 files, 103 tests passed. |
| `npm run build` | Next.js 16.2.10; 426 static pages generated. |
| `npm run test:e2e` | 51 Chromium tests passed against the production build. |
| `npm run audit:routes` | 423 routes, 30 sitemap URLs, 132 internal links, 17 assets; 0 issues. |
| `npm audit` | 0 vulnerabilities. |

Browser gates cover both themes, 375/768/820/1280 widths, 14 representative content/trust routes, one main landmark, overflow, H1s, visible focus, skip navigation, Escape/focus return, reduced motion, consent state changes, axe WCAG A/AA checks, control names/states, redirect/404/410 behavior, security headers, and representative console/network behavior.

## Fresh mobile Lighthouse medians

| Route | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 95 | 100 | 100 | 100 | 0.907s | 2.875s | 68ms | 0 | 268 KB |
| Verified negative-prompts guide | 96 | 100 | 100 | 100 | 0.906s | 2.820s | 32ms | 0 | 331 KB |

The three-run details and medians are in `LIGHTHOUSE_SUMMARY.json`. Simulated mobile LCP remains above 2.5s and is recorded as a residual risk.

## Adversarial review outcomes

- **Publisher reviewer:** seven source-backed guides now form a visible, navigable three-topic section; uncertain content is withheld rather than lightly edited.
- **Technical SEO:** verified-only discovery, noindex near-duplicates, one-hop redirects, explicit 410, truthful metadata, and canonical/sitemap consistency pass the full crawl.
- **Keyboard and low vision:** both-theme automated WCAG scans, focus visibility, skip focus, Escape focus return, labels, reduced motion, and viewport overflow checks pass.
- **Mobile:** the final matrix caught and fixed a blog hero containing-block defect that caused 96px document overflow at every tested width.
- **Security and privacy:** consent withdrawal, cookie cleanup, strict GA configuration, full image decode, production CSP without `unsafe-eval`, HSTS, framing controls, and clean dependency audits pass.
- **Skeptical practitioner:** unsupported model rankings, fake testing, outcome promises, stale pricing/quality claims, and universal negative-prompt statements are absent from verified or generic publisher surfaces.
- **Repository residue:** unused ad placements, dynamic injection, duplicate inferred claims, mutating draft behavior, and stale active documentation were removed.

## Deviations and limitations

- Repository instructions requested Context7, but it was unavailable; current primary vendor documentation was used instead.
- An attempted delegated analytics review could not run because the shared subagent usage limit was exhausted; the main agent performed the audit and repeated the automated gates.
- Lighthouse produced complete JSON but Windows returned `EPERM` while cleaning temporary Chrome profiles. Every counted artifact was parsed for required categories and audits.
- No human screen-reader, low-vision, legal, editorial-owner, or production-device field session was performed.
- The local implementation is complete, but production/search/advertising readiness still depends on authorized deployment, live observation, current account evidence, and a separate advertising/CMP implementation.
