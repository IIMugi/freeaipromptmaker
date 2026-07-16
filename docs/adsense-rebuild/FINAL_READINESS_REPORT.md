# Final AdSense and search readiness report

Date: 2026-07-16

## Executive decision

**The local repository is ready for an authorized production deployment and observation period. It is not yet ready for an AdSense review request.**

The rebuild removed the principal engineering and trust failures behind the prior state: direct automated publishing, fabricated experience and image-analysis results, unsupported ratings/schema, misleading product statistics, false legal promises, ad placeholders, weak consent boundaries, broken responsive behavior, current dependency vulnerabilities, and the absence of tests.

The remaining AdSense risk is primarily editorial and external, not a hidden code failure. Only one guide is verified with current primary sources and version/date evidence; 252 legacy guide records remain quarantined as needs-review. The rebuilt site also has not been deployed, observed in live field data, connected to a certified advertising CMP, or re-reviewed in the account.

## Connected-data baseline

| Evidence | Baseline finding |
| --- | --- |
| AdSense | “Low value content”; last account update observed 2026-03-04. No ad-serving Policy Center issue, no report data, and no published European regulations message. |
| Search Console, long range | 1,940 clicks, 970,118 impressions, 0.2% CTR, average position 6.8. |
| Search Console, recent range | 1,554 clicks, 487,332 impressions, 0.3% CTR, average position 7.4. |
| Indexing | 103 indexed and 197 not indexed: 119 discovered-not-indexed, 50 crawled-not-indexed, 19 noindex, 5 404, 3 redirect, 1 robots. |
| Mobile CWV | 35 URLs needed improvement; representative field LCP 2.6s. Desktop group was good. |
| Rich results | 35 fake review-snippet items were valid under the old unsupported rating schema. |
| GA4 | 158 sessions and 118 active users in 90 days versus 1,554 GSC clicks in a comparable period; coverage is materially incomplete. |
| Content corpus | 253 files; all used first-person language, 245 contained generated experience phrases, 239 had no external source, and 138 had no discovered internal inlink. |
| Traffic concentration | The retained negative-prompts guide had 796 clicks and 437,580 impressions; its duplicate had 9 clicks and 40,188 impressions. |

## Final architecture and URL decisions

| Area | Final behavior |
| --- | --- |
| Homepage | Indexable, generator-first, factual, one H1, no fake audience/ratings/team/community claims. |
| Product/trust pages | Rebuilt and indexable where useful; privacy and terms match actual data flow. |
| Generic use-case pages | 12 indexable pages in the sitemap. |
| Model/use-case variants | 144 useful direct routes, noindex/follow, absent from sitemap to avoid thin duplication. |
| Guide hub | Lists only verified guides. |
| Verified guides | 1 source-verified guide in hub and sitemap. |
| Legacy guides | Needs-review, noindex, excluded from hubs and sitemap; not represented as verified. |
| Duplicate negative-prompts guide | One-hop permanent redirect to the traffic-leading rewritten guide. |
| `/flux-pro` | One-hop permanent redirect to `/prompt-generators`. |
| Malformed `/keyword` route | Explicit 410. |
| Sitemap | 24 URLs; no noindex URL found by the route audit. |
| Structured data | Factual Website/Article/Breadcrumb boundaries; unsupported rating, generic FAQ, and generic HowTo schema removed. |

The complete 422-row decision matrix contains 275 improve, 144 noindex, 1 merge, 1 permanent redirect, and 1 delete/410 decision. Every row now has an implemented status.

## Before and after

| Quality area | Before | Final local state |
| --- | --- | --- |
| Publishing | Scheduled generated posts could push to `main`; deceptive humanization asked for fabricated experience. | Workflows are manual-only; scripts produce explicit drafts and cannot publish directly. |
| Image analysis | Missing/failed provider could fabricate output from a filename and return success. | Byte-signature/size validation; 503 unavailable, 400 invalid, 502 provider/parse failure; success is provider-derived only. |
| Ads | Scripts/slots/placeholders and reserved empty inventory existed. | Ads are disabled; no script, slot, placeholder, or ad network request appears in the readiness build. |
| Consent | Analytics and ads shared an inadequate binary control. | Optional analytics is off by default, opt-in, persistent, and withdrawable; advertising remains outside this control and disabled. |
| Trust/legal | Unsupported zero-retention, testing, audience, experience, pricing, affiliate, and outcome claims. | Copy describes actual local processing, Gemini upload boundary, analytics consent, disabled ads, and explicit limitations. |
| SEO/schema | Build-time fake freshness, unsupported aggregate ratings, generic FAQ/HowTo, duplicate intent, broken nested URL. | Stable timestamps, factual schema, verified-only sitemap/hub, one-hop redirects, explicit 410, clean crawl. |
| Accessibility | Theme contrast defects, missing labels/skip link/reduced motion, broken tablet navigation. | Both-theme WCAG A/AA automation passes; skip link, labels, focus target, Escape behavior, reduced motion, and 375/768/820/1280 overflow tests pass. |
| Security | 7 production dependency findings, including 4 high; MIME-only image validation; weak headers. | Next 16.2.10/React 19.2.7; zero npm audit findings; signature checks; tightened headers/CSP. |
| Quality gates | Lint failed with 3 errors/6 warnings; no tests. | Lint/type/build pass; 47 unit/component tests; 32 browser tests; full route crawler. |

## Final automated evidence

- Production build: 426 static pages generated.
- Unit/component: 21 files, 47 passed.
- Production browser: 32 passed.
- Route audit: 423 routes, 24 sitemap URLs, 126 internal links, 17 assets, zero issues.
- Route statuses: 420 successful, 2 intended permanent redirects, 1 intended 410.
- Dependency audit: zero total and zero production vulnerabilities.
- Unexpected console/page/first-party network errors on representative critical routes: zero.
- Google advertising/measurement requests with analytics declined: zero.
- WCAG A/AA automated violations on the tested two-theme route set: zero.

## Performance result

Final Lighthouse 13.4.0 mobile medians, three runs per route:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 94 | 100 | 100 | 100 | 0.92s | 2.94s | 117ms | 0 | 264 KB |
| Verified guide | 96 | 100 | 100 | 100 | 0.91s | 2.85s | 44ms | 0 | 323 KB |

The article improved materially from the audit baseline of performance 83, LCP 3.52s, and TBT 263ms. The final simulated mobile LCP remains above the 2.5-second target on both pages. It is a recorded residual performance risk, not evidence that field CWV is fixed. Search Console field data must be rechecked after deployment and its observation window.

## Remaining risks and human evidence

### Blocks AdSense review now

1. Only one guide is verified. Google requires enough valuable, unique content and good UX but does not publish a universal minimum count. The owner should build a meaningful evidence-backed publisher section before review.
2. The rebuilt code is not live; account crawlers still see the old production release until deployment.
3. The current privacy control is not a certified IAB TCF advertising CMP. Advertising must remain disabled until a correct CMP/ad-consent design is published and tested.
4. AdSense site status and ads.txt recognition must be rechecked after deployment.
5. A manual owner/editor review and genuine test artifacts are still required for future verified guides.

### Does not block a controlled deployment

- Simulated mobile LCP is 2.85–2.94s rather than at most 2.5s; deploy, measure field data, and continue optimizing without claiming a pass.
- Automated accessibility cannot replace a human screen-reader/low-vision session.
- The in-memory image API limiter is instance-local; production infrastructure should add a distributed/platform rate limit if usage grows.
- GA4 baseline coverage is incomplete and must not drive destructive URL decisions until validated.
- Search Console will take time to recrawl redirects, noindex changes, schema removal, and the smaller sitemap.

## Final readiness matrix

| Decision | Status |
| --- | --- |
| Audit and evidence baseline complete | PASS |
| Data-supported URL decisions implemented | PASS |
| UI/frontend rebuild complete locally | PASS |
| Technical SEO/schema/crawl gate | PASS |
| Security/dependency gate | PASS |
| Unit/build/browser/accessibility gate | PASS |
| Local deployment candidate | PASS |
| Live production verification | PENDING OWNER AUTHORIZATION |
| Field CWV/search observation | PENDING DEPLOYMENT AND TIME |
| Sufficient verified publisher depth | NOT YET |
| Certified advertising CMP and real-ad QA | NOT YET |
| AdSense review request | DO NOT REQUEST YET |

Follow `MANUAL_EXTERNAL_STEPS.md` in order. No external account write action was performed during this rebuild.

**Search ranking, indexing, traffic, and AdSense approval cannot be guaranteed.**
