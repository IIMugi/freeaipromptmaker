# Final AdSense and search readiness report

Date: 2026-07-17

## Executive decision

**The local repository is a verified deployment candidate. Advertising remains disabled, and an AdSense review request remains an external owner decision after deployment and live verification.**

The rebuild closes the real local Critical and Important findings found during the fresh audit: unsafe automated publishing, an unverified publisher corpus, fabricated experience/testing/ranking claims, misleading product statistics and legal promises, incomplete analytics withdrawal, weak upload validation, nested landmarks, tablet/mobile overflow, stale ad-placement code, duplicate URL intent, dependency findings, and missing quality gates.

The public publisher surface now contains seven source-verified guides across three coherent topics. The other 246 editorial records remain `needs-review`; 245 render a withheld, noindex/follow review page and one resolves through the evidence-backed permanent merge. This meets the local objective of at least five useful verified guides without pretending that a page count guarantees publisher acceptance.

No deployment, production setting change, Google account mutation, sitemap submission, indexing request, ads enablement, CMP publication, or AdSense review request was performed.

## Connected-data baseline

These are the read-only values captured at the audit baseline; they were not re-queried during the final local gate.

| Evidence | Baseline finding |
| --- | --- |
| AdSense | “Low value content”; last account update observed 2026-03-04. No ad-serving Policy Center issue, report data, or published European regulations message was observed. |
| Search Console, long range | 1,940 clicks, 970,118 impressions, 0.2% CTR, average position 6.8. |
| Search Console, recent range | 1,554 clicks, 487,332 impressions, 0.3% CTR, average position 7.4. |
| Indexing | 103 indexed and 197 not indexed: 119 discovered-not-indexed, 50 crawled-not-indexed, 19 noindex, 5 404, 3 redirect, and 1 robots exclusion. |
| Mobile CWV | 35 URLs needed improvement; representative field LCP was 2.6s. Desktop group was good. |
| Rich results | 35 unsupported review-snippet items were valid under the old rating schema. |
| GA4 | 158 sessions and 118 active users in 90 days versus 1,554 GSC clicks in a comparable range; coverage was materially incomplete. |
| Legacy content corpus | 253 files; all used first-person language, 245 contained generated experience phrases, 239 had no external source, and 138 had no discovered internal inlink. |
| Traffic concentration | The retained negative-prompts guide had 796 clicks and 437,580 impressions; its duplicate had 9 clicks and 40,188 impressions. |

## Final architecture and URL decisions

| Area | Final behavior |
| --- | --- |
| Homepage | Indexable, generator-first, factual, one H1, one global main landmark, no fake audience/rating/team/community claims. |
| Trust and legal pages | Match the current local processing, optional analytics, upload-provider, disabled-advertising, and editorial-review boundaries. |
| Generic use-case pages | 12 factual, indexable pages in the sitemap; locally authored examples are explicitly not independently output-tested. |
| Model/use-case variants | 144 direct routes, noindex/follow, absent from the sitemap to avoid thin duplication. |
| Guide hub | Lists seven verified guides in three topic groups. |
| Verified guides | Four Stable Diffusion, two Leonardo, and one Midjourney guide, each with version/date boundaries and primary-source ledgers. |
| Legacy guides | 246 `needs-review` records excluded from discovery and indexing; legacy bodies are withheld. |
| Duplicate negative-prompts guide | One-hop permanent redirect to the traffic-leading rewritten guide. |
| `/flux-pro` | One-hop permanent redirect to `/prompt-generators`. |
| Malformed `/keyword` route | Explicit 410. |
| Sitemap | 30 URLs; the final crawler found no noindex entry in the sitemap. |
| Structured data | Factual Website/Article/Breadcrumb boundaries; unsupported rating, generic FAQ, and generic HowTo schema removed. |

The 422-row decision matrix contains 275 `IMPROVE`, 144 `NOINDEX`, 1 `MERGE`, 1 `REDIRECT_301` (implemented as a permanent 308), and 1 `DELETE_410`. Implementation states are 167 general decisions, 245 guide quarantine decisions, 7 verified guides, 2 permanent redirects, and 1 explicit 410.

## Before and after

| Quality area | Before | Final local state |
| --- | --- | --- |
| Publishing | Generated posts could be scheduled and written into the repository; prompts encouraged deceptive humanization. | Workflows are manual/read-only; scripts require an explicit unpublished artifact and do not mutate planner/history/registry/posts/Git/deployment state. |
| Editorial quality | 253 generated guides were presented as publisher content, often without sources and with invented experience. | Seven bounded guides are verified; 246 records remain quarantined and legacy bodies are withheld. |
| Generic publisher pages | Use-case pages claimed testing, rankings, popularity, CTR, revenue, and model superiority without evidence. | Rankings and fabricated expertise were removed; pages provide examples, limitations, an iteration worksheet, and a manual review checklist. |
| Image analysis | MIME checks could precede provider use without a full decode; earlier fallback behavior could fabricate success. | Request streams are bounded, signatures verified, and PNG/JPEG/WebP files fully decoded as one frame within byte/dimension/pixel limits before provider use; failures remain explicit. |
| Ads | Placement wrappers, scripts/slots/placeholders, and reserved empty inventory existed. | Ads are disabled; only inert centralized boundaries remain and no advertising request or placeholder appears. |
| Consent | Analytics consent withdrawal and cross-tab changes were incomplete. | Default-denied Consent Mode precedes configuration; current consent is reread at event time; withdrawal updates consent, clears bounded reachable analytics cookies, and works across tabs. |
| SEO and routing | Unsupported schema, duplicate intent, a malformed route, and multi-hop host/path behavior remained. | Verified-only sitemap/hub, truthful metadata, noindex duplicates, two one-hop redirects with query preservation, explicit 410, and a clean crawl. |
| Accessibility and layout | Missing labels/focus/reduced-motion behavior, nested landmarks, and residual blog overflow remained. | Both-theme axe scans, skip focus, visible focus, Escape return, reduced motion, one-main assertions, and the 375/768/820/1280 matrix pass. |
| Security | Dependency findings, production `unsafe-eval`, weak host/path redirects, and upload trust gaps remained. | Next 16.2.10/React 19.2.7, zero audit findings, production CSP without `unsafe-eval`, HSTS/framing controls, strict GA IDs, and full upload decode. |
| Repository residue | Dead ad placements, injector code, an unused inferred-claims helper, and obsolete operational docs remained. | Dead runtime files were deleted and active product/AdSense/memory guidance was replaced with the current boundaries. |

## Final automated evidence

The ordered feature-branch clean-install gate completed on 2026-07-17:

- `npm ci`: 643 packages installed; 644 audited; 0 vulnerabilities.
- `npm run lint`: exit 0; no reported errors or warnings.
- `npx tsc --noEmit`: exit 0.
- `npm test`: 27 files, 103 tests passed.
- `npm run build`: Next.js 16.2.10; 426 static pages generated.
- `npm run test:e2e`: 51 Chromium tests passed against the production build.
- `npm run audit:routes`: 423 routes, 30 sitemap URLs, 132 internal links, 17 assets, 0 issues.
- Route statuses: 420 successful, 2 intended permanent redirects, 1 intended 410.
- `npm audit`: 0 vulnerabilities.
- Unexpected console/page/first-party network errors on representative critical routes: 0.
- Google advertising/measurement requests with analytics declined: 0.
- Automated WCAG A/AA violations on the tested two-theme route set: 0.

The persistent browser matrix covers 14 product/publisher/trust routes at 375, 768, 820, and 1280 pixels in both light and dark themes, plus focus visibility, skip navigation, Escape dismissal and focus return, reduced motion, consent allow/reopen/withdraw, control names/states, redirects, 404, 410, security headers, console, and network behavior. See `QA_MATRIX.md`.

## Fresh mobile Lighthouse medians

Lighthouse 13.4.0 ran three fresh times per route against the final production build. Values are medians from the six parseable JSON artifacts.

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 95 | 100 | 100 | 100 | 0.907s | 2.875s | 68ms | 0 | 268 KB |
| Verified guide | 96 | 100 | 100 | 100 | 0.906s | 2.820s | 32ms | 0 | 331 KB |

The simulated mobile LCP remains above the 2.5-second target on both pages. This is a recorded residual performance risk, not evidence that field CWV is fixed. Search Console field data must be observed after an authorized deployment and its normal collection window. Windows returned `EPERM` while Lighthouse removed its temporary Chrome profile after each run; every retained artifact was complete and independently parsed before inclusion.

## Remaining risks and external evidence

### Blocks advertising enablement or review now

1. The rebuilt release is not live; production crawlers and account checks cannot validate this local state.
2. AdSense approval status, ads.txt status, Policy Center, and account tasks must be checked in the owner’s account after deployment. Google exposes those values on the Sites page and notes that a site with incomplete tasks will remain in “Getting ready”: [Google AdSense site status](https://support.google.com/adsense/answer/12170222?hl=en).
3. Advertising has no implemented consent layer. Google’s current publisher guidance requires a Google-certified TCF CMP for personalized ads in the EEA, UK, and Switzerland: [Google consent-management requirements](https://support.google.com/adsense/answer/13554116?hl=en).
4. Real advertising code, density, consent, CLS, accessibility, and network behavior have not been implemented or tested; that work requires a separate authorized change.
5. The owner must manually review the live product and the seven-guide publisher set before requesting review. Google does not publish a universal guide-count guarantee and may still judge the site not ready: [site-not-ready guidance](https://support.google.com/adsense/answer/12176698?hl=en).

### Does not block a controlled deployment

- Simulated mobile LCP is 2.820–2.875s rather than at most 2.5s; deploy, measure field data, and continue optimizing without claiming a pass.
- Automated accessibility cannot replace a human screen-reader or low-vision session.
- The image API limiter is instance-local; production infrastructure should add a distributed/platform limit if traffic warrants it.
- GA4 baseline coverage is incomplete and must not drive destructive URL decisions until validated.
- Search Console needs time to recrawl redirects, noindex changes, schema removal, and the smaller verified-only sitemap.

## Final readiness matrix

| Decision | Status |
| --- | --- |
| Audit and connected-evidence baseline | PASS |
| At least five useful source-verified guides | PASS — 7 |
| Quarantine and publisher-surface filtering | PASS |
| Data-supported URL decisions | PASS |
| UI, responsive, theme, and interaction rebuild | PASS locally |
| Technical SEO, schema, and crawl gate | PASS |
| Privacy, upload, security, and dependency gate | PASS locally |
| Clean install, unit, build, browser, and accessibility gate | PASS |
| Local deployment candidate | PASS |
| Live production verification | PENDING OWNER AUTHORIZATION |
| Field CWV/search observation | PENDING DEPLOYMENT AND TIME |
| Certified advertising CMP and real-ad QA | NOT IMPLEMENTED |
| AdSense review request | DO NOT REQUEST FROM THIS LOCAL TASK |

Follow `MANUAL_EXTERNAL_STEPS.md` in order. No external write action was performed during this rebuild.

**Search ranking, indexing, traffic, and AdSense approval cannot be guaranteed.**
