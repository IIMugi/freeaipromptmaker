# AdSense Rebuild Audit

Audit date: 2026-07-16
Repository baseline: `ef94e2b1913db1e76f6d45e466aaa4c0b994dee5`
Production site: `https://freeaipromptmaker.com/`

This document records the repository, production, and owner-authenticated connected-data audit. Google Search Console, Google Analytics 4, and AdSense were inspected in read-only mode and are detailed in `CONNECTED_DATA_FINDINGS.md`. No external account setting, validation, indexing request, consent message, review request, or other account state was changed.

## Executive finding

The current site is not ready for an AdSense review. AdSense's exact site classification is **Low value content**, with **Action required** and “site is not ready to show ads”; this directly corroborates the local content-quality findings. The main risk is not visual polish: it is a trust and content-production system that publishes search-targeted AI articles directly to production, inserts invented first-person experience, presents unsupported testing and audience claims, exposes misleading structured data, and allows the image analysis tool to return a plausible result when no analysis provider is configured. The site also has material accessibility, consent, dependency-security, internal architecture, and quality-gate defects.

There is a useful product underneath these risks. The text prompt builder works without an account, produces model-aware syntax, preserves local history, and copied the tested result correctly. The site uses clean canonicals, a valid sitemap set, a useful custom 404, and static rendering for most routes. The safest rebuild is therefore likely to preserve the working generator and public URLs while replacing the trust, content, template, and quality-control layers. Connected data sharpens the first URL consolidation: one established negative-prompts guide holds 796 clicks and 437,580 impressions, while a same-intent guide holds 9 clicks and 40,188 impressions. The final architecture decision remains gated on design approval.

## Evidence scope and method

- Cloned the public repository linked by the production footer and captured a clean Git baseline.
- Installed locked dependencies, ran the existing lint/build checks, ran TypeScript directly, and inspected the production dependency audit.
- Crawled all sitemap URLs, generated routes, and discovered internal links; recorded 422 public URL checks in `URL_INVENTORY.csv`.
- Inspected representative production pages at mobile, tablet, and desktop widths in light and dark themes.
- Exercised the primary generator, copy workflow, theme persistence, mobile navigation, consent decline path, a current guide, the image-to-prompt API, and the custom 404.
- Ran fresh Lighthouse 13.4.0 mobile audits against the homepage and a current article. The Windows runner reported a temporary-file cleanup error after collection; both JSON artifacts were independently parsed and validated before the scores below were used.
- Statistically inspected all 253 post files, content-planner state, publishing scripts, structured data, advertisements, consent logic, legal copy, redirects, and internal linking.
- Compared policy-sensitive findings with current first-party Google Search, AdSense, and Web Vitals documentation.
- Inspected the correct authenticated Search Console, GA4, and AdSense properties read-only; sanitized aggregates are tracked and raw extracts remain outside the public repository.

## Baseline facts

| Metric | Result |
| --- | --- |
| Production HTML URLs checked | 422 |
| Successful HTML pages | 420 |
| Indexable successful pages | 276 |
| `noindex,follow` model/use-case pages | 144 |
| Sitemap entries | 276, all 200 and indexable |
| Guide files/routes | 253 |
| Guides with zero internal inlinks | 138 |
| Guides with at most one internal inlink | 184 |
| Guides with no external source link | 239 |
| Guides containing first-person language | 253 |
| Guides containing generated experience phrases | 245; 1,284 phrase hits |
| Automated planner entries | 233 of 243 |
| Guides with tested-version metadata | 0 |
| Guides with updated-at metadata | 0 |
| Production build | Passed; 425 generated pages |
| TypeScript | Passed |
| Lint | Failed; 3 errors and 6 warnings |
| Automated test command | None |
| Production dependency audit | 7 findings: 4 high, 3 moderate |
| Search Console indexed / not indexed | 103 / 197 (report updated 2026-07-10) |
| Search Console recent performance | 1,554 clicks / 487,332 impressions / 0.3% CTR / position 7.4 |
| Search Console mobile CWV | 35 URLs need improvement; one LCP >2.5s issue group |
| GA4 recent coverage | 158 sessions / 118 active users over 90 days; materially incomplete versus GSC |
| AdSense site status | Action required; Low value content; not ready to show ads |

## Findings

### P0-01 — Search-targeted scaled publishing fabricates human experience

- **Evidence:** Two scheduled workflows publish daily/every two days and commit directly to `main`. The generator asks Gemini for high-volume topics. The humanization step explicitly instructs the model to add phrases such as “In my experience,” “I've found,” and “What works for me” so the copy reads like an experienced human. Corpus analysis found first-person language in all 253 guides and those generated experience patterns in 245 guides, with 1,284 total hits. The planner marks 233 of 243 topics as auto-generated.
- **Affected routes/files:** `/blog/*`; `.github/workflows/daily-content.yml`; `.github/workflows/generate-content.yml`; `scripts/generate-content.js`; `scripts/generate-topic.js`; `scripts/humanize-content.js`; `data/content-planner.json`; `posts/*`.
- **Why it matters:** Google classifies large numbers of pages created primarily to manipulate rankings and generative content without added value as scaled content abuse. Invented first-hand experience is independently deceptive and makes authorship/editorial claims unreliable.
- **Chosen remediation:** Disable direct-to-production schedules; remove the deceptive humanization step; require a documented human editor, evidence checklist, model/version/date fields, source citations, and pull-request review before publication. Audit existing guides individually and keep uncertain URLs conservative. Search Console's 119 discovered-not-indexed and 50 crawled-not-indexed URLs, plus AdSense's Low value content classification, confirm the priority without justifying indiscriminate deletion.
- **Implementation status:** Verified; pending approved implementation. No workflow was changed during the audit.

### P0-02 — Image-to-prompt can claim analysis when no image analysis occurred

- **Evidence:** A valid, non-sensitive PNG sent to the production API returned HTTP 200 with `degraded: true` and `reason: missing_api_key`, but also returned detailed style DNA, a prompt, and remixes derived from fallback inputs rather than image understanding. Invalid text input correctly returned 400. The UI markets the feature as instant visual extraction without disclosing the degraded result.
- **Affected routes/files:** `/image-to-prompt`; `/api/image-to-prompt`; `app/image-to-prompt/*`; `app/api/image-to-prompt/route.ts`; related components and privacy copy.
- **Why it matters:** A reviewer or user can reasonably believe the upload was analyzed when it was not. Google explicitly lists misleading functionality as a spam-policy concern. The mismatch also undermines the privacy and trust pages.
- **Chosen remediation:** Fail closed with an honest unavailable state when the provider is not configured or fails. Never label fallback text as image analysis. Validate file signatures and dimensions, document the external processor accurately, and add success/degraded/error integration tests.
- **Implementation status:** Verified; pending approved implementation.

### P0-03 — Unsupported trust, testing, ownership, and performance claims

- **Evidence:** Production copy claims, among other things, 60%+ hallucination reduction, universal framework recognition, deterministic guarantees, strict zero retention, 50,000+ prompts, 100,000+ users, testing across 12+ models since 2022, quarterly audits, every example being tested, and no affiliate bias. The repository contains no measurement protocol, experiment data, verified team identities, test artifacts, audience analytics, or editorial audit records supporting these claims. The automated articles themselves add invented personal experience.
- **Affected routes/files:** `/`; `/about`; `/privacy`; `/terms`; `/blog/*`; `components/Home/*`; legal page sources; post corpus.
- **Why it matters:** These claims are material to user trust and AdSense publisher identity. Unverifiable assertions make the project look manufactured and can turn otherwise useful content into misleading content.
- **Chosen remediation:** Remove every unsupported quantitative, testing, guarantee, founding, audience, retention, and expertise claim. Replace them only with verifiable product behavior and an honest project/editorial description. Require a linked evidence artifact for future first-hand-testing claims.
- **Implementation status:** Verified; pending approved copy and trust-layer rebuild.

### P0-04 — Misleading structured data is emitted site-wide

- **Evidence:** All 276 indexable pages expose an `AggregateRating` of 4.9 from 2,847 ratings without a review source. FAQ markup appears on 266 indexable pages and HowTo markup on 55, frequently through generic templates. The site also emits organization/software/offer data broadly. The crawl found the rating even on legal and index pages.
- **Affected routes/files:** All rendered routes; `app/layout.tsx`; page-level JSON-LD builders; blog and use-case templates.
- **Why it matters:** Google requires structured data to be representative, visible, accurate, and not misleading. Site-wide fake ratings can invalidate rich results and create manual-action risk.
- **Chosen remediation:** Remove unsupported rating and offer data. Keep only page-specific, visible, truthful schema; validate representative samples and add schema assertions to tests.
- **Implementation status:** Verified; pending approved implementation.

### P0-05 — Published guides include broken, truncated, and legacy-branded content

- **Evidence:** Seventeen post files are at most 40 lines and several end mid-sentence. One 25-line guide creates a live `/keyword` link that returns 404 and ends abruptly. The newest inspected guide uses an unrelated boxing-glove stock image for multi-object DALL-E guidance and contains generated first-hand experience. Roughly 78 source occurrences still use the legacy “PromptMaster” name. Two guide links point to `example.com` and two to `127.0.0.1`.
- **Affected routes/files:** `/blog/*`; especially `posts/2026-02-05-ai-art-reference-guide-inspiration-prompts.mdx`; `posts/*`; rendered article template.
- **Why it matters:** These are visible production-quality failures and direct evidence that the publishing system is not reviewed. Truncated or internally inconsistent pages can be judged low value even if their word count or metadata looks complete.
- **Chosen remediation:** Immediately noindex or unpublish visibly broken articles during implementation, repair the broken internal link, and review every guide against a content acceptance checklist. Preserve uncertain URLs in the decision inventory until GSC evidence is available; merge or redirect only when a close replacement and transferred value are documented.
- **Implementation status:** Verified; connected data is joined. One same-intent guide is assigned to merge, while uncertain URLs remain conservative rather than being removed from incomplete GA4 data.

### P0-06 — Direct framework dependency has unresolved production security advisories

- **Evidence:** `npm audit --omit=dev --json` reported seven production findings, including four high-severity findings and advisories affecting the direct Next.js dependency. The lockfile installs Next.js 16.0.8. The build passes, but there is no security test or update gate.
- **Affected routes/files:** Entire deployment; `package.json`; `package-lock.json`.
- **Why it matters:** A production framework advisory can affect request handling or server behavior even when the site is mostly static. Passing builds do not clear security findings.
- **Chosen remediation:** Upgrade the direct framework and transitive dependencies to patched compatible versions, inspect release notes, then rerun unit, integration, browser, build, and production audit gates.
- **Implementation status:** Verified; upgrade not yet attempted.

### P1-01 — Consent implementation is not sufficient as a verified Google CMP solution

- **Evidence:** The site uses a custom binary accept/decline banner and one localStorage flag. There is no granular purpose/vendor choice, verified IAB TCF string, Google-certified CMP integration, or revocation UI. The AdSense/Analytics scripts are delayed until acceptance, which is positive, but the page still preconnects to the AdSense host before consent. Declining consent leaves multiple 280px advertisement placeholders in articles because `AdUnit` renders the configured branch even when `hasConsent` is false.
- **Affected routes/files:** All routes; consent components; `lib/consent.ts`; `components/Ads/*`; `app/layout.tsx`; privacy/cookie copy.
- **Why it matters:** Google requires a certified CMP for personalized ads in the EEA, UK, and Switzerland. The current banner must not be represented as certified. Empty ad blocks also degrade the experience for users who decline.
- **Chosen remediation:** Integrate a Google-certified CMP or remain in a documented non-personalized/limited-ads mode that satisfies current requirements; remove pre-consent connections; provide revocation; render no ad container after decline; reconcile legal copy with actual data flows.
- **Implementation status:** Verified; account-side configuration and CMP selection require owner action and must remain external/manual.

### P1-02 — Advertising layout reserves excessive empty inventory and misstates injection behavior

- **Evidence:** Article logic creates one to four `InArticleAd` components based on character length, but groups every one after the article body rather than injecting between content sections. It then adds an end-of-content ad and a 600px sidebar unit. On the tested article, declining consent still produced four 280px empty loading blocks plus the hidden desktop sidebar structure. Disabled/unconfigured ads render implementation-oriented placeholder text.
- **Affected routes/files:** `/blog/*`; `components/Blog/DynamicAdInjector.tsx`; `components/Ads/AdUnit.tsx`; `app/blog/[slug]/page.tsx`.
- **Why it matters:** Large empty or clustered ad regions make pages feel built around inventory rather than reader value. Ads and placeholders must not obstruct or materially dilute publisher content.
- **Chosen remediation:** Remove dynamic count-based stacking. During rebuild, show no ads unless consent, configuration, and a valid slot are present; limit placements to deliberate reader-safe positions after the publisher-content review.
- **Implementation status:** Verified; pending implementation and later AdSense account review.

### P1-03 — Light theme is incomplete and makes primary headings unreadable

- **Evidence:** In production light mode, the tested article H1 and custom 404 H1 remained hard-coded white on a light background and were nearly invisible. Breadcrumb text was also low contrast. Source inspection finds broad hard-coded slate/white colors in templates rather than semantic theme tokens. Theme selection is applied in an effect after a dark server render, creating flash risk.
- **Affected routes/files:** `/blog/*`; custom 404; likely legal/about templates; `components/ThemeProvider.tsx`; global theme styles and hard-coded utility classes.
- **Why it matters:** Critical content becomes unreadable in an advertised theme, failing basic usability and likely WCAG contrast requirements.
- **Chosen remediation:** Rebuild both themes from semantic tokens, remove hard-coded foreground colors from page templates, set theme before paint, respect system preference, and add automated light/dark contrast and screenshot checks.
- **Implementation status:** Verified on representative routes; full route implementation pending.

### P1-04 — Tablet navigation breaks at the desktop breakpoint

- **Evidence:** At a 768px audit viewport, desktop navigation is activated even though its content extends beyond the 760px document width; the theme button is offscreen and Contact is clipped/wrapped. Mobile and desktop widths did not show the same failure.
- **Affected routes/files:** All routes using the global header; header/navigation component and breakpoint utilities.
- **Why it matters:** A common tablet width loses access to navigation controls and appears unfinished.
- **Chosen remediation:** Keep compact/mobile navigation until the full desktop layout fits, add overflow-safe spacing, and add 768px/820px browser tests.
- **Implementation status:** Verified; pending implementation.

### P1-05 — Accessibility gaps remain despite a strong Lighthouse baseline

- **Evidence:** Fresh Lighthouse accessibility was 0.96 on both tested pages. The homepage footer contrast measured about 4.3:1 where 4.5:1 is required for normal text; article light-mode defects are more severe. Three text inputs rely on placeholders without programmatic labels. There is no skip link and no `prefers-reduced-motion` handling despite extensive motion. Generic “Learn more” link text was flagged.
- **Affected routes/files:** Global header/footer; homepage generator; newsletter form; article and legal templates; motion components; global CSS.
- **Why it matters:** Keyboard, low-vision, motion-sensitive, and assistive-technology users receive a weaker experience. Automated 0.96 scores do not cover the severe theme-specific failures.
- **Chosen remediation:** Add visible or accessible labels, a skip link and main target, reduced-motion styles, descriptive link text, focus-order review, and semantic color tokens meeting WCAG AA in both themes.
- **Implementation status:** Verified; pending implementation and keyboard/screen-reader checks.

### P1-06 — Mobile lab LCP is outside the “good” Core Web Vitals threshold

- **Evidence:** Fresh mobile Lighthouse: homepage performance 0.91, FCP 1.33s, LCP 2.87s, TBT 154ms, CLS 0; article performance 0.83, FCP 1.53s, LCP 3.52s, TBT 263ms, CLS 0. The article LCP image is not prioritized. The article transfers about 527 KiB with about 72 KiB unused JavaScript. Field CWV was not available in the unauthenticated audit; the owner-supplied context says 35 mobile URLs needed improvement and zero were good.
- **Affected routes/files:** `/`; `/blog/*`; shared client providers; article image/template; motion and generator bundles.
- **Why it matters:** Google’s “good” LCP threshold is at most 2.5s at the 75th percentile. The page templates load more client code than static publisher pages need.
- **Chosen remediation:** Isolate interactive generator code from article/legal bundles, prioritize the true LCP image, reduce client providers and motion, remove unused scripts/connections, and verify with repeat Lighthouse plus authenticated Search Console field groups.
- **Implementation status:** Lab and field direction verified. Search Console's only mobile issue group is LCP above 2.5 seconds for 35 URLs, represented by the leading negative-prompts guide at 2.6 seconds.

### P1-07 — Internal architecture leaves most guides weakly connected

- **Evidence:** Of 253 guides, 138 have zero discovered internal inlinks, 184 have at most one, and 201 have at most two. The global footer links every crawlable route to a few hubs but the guide corpus lacks coherent topic-cluster navigation. The 144 model/use-case variants are heavily linked and self-canonical but intentionally noindexed and omitted from the sitemap.
- **Affected routes/files:** `/blog/*`; blog index; related-post logic; use-case hubs; global navigation/footer; sitemap generation.
- **Why it matters:** Useful guides are difficult for users and crawlers to discover while a large templated noindex network receives internal prominence. Similar titles indicate intent overlap and cannibalization risk.
- **Chosen remediation:** Define a smaller evidence-backed topic architecture, connect retained guides through real hub/cluster navigation, consolidate overlapping intent after GSC review, and remove noindex template pages from primary navigation if they do not provide unique operational value.
- **Implementation status:** Verified; the first high-confidence merge and two removal/redirect mappings are documented. Broader consolidation remains conservative because page/query intent must be preserved.

### P1-08 — Content lacks source, freshness, and test provenance

- **Evidence:** 239 of 253 guides have no external source links. None records the model version tested or an updated date. Two hundred forty meta descriptions append the same generic “comprehensive guide” text. Titles include 155 beginning with “Master” and 11 more using “Complete,” “Ultimate,” or “Definitive.” Similarity analysis found multiple close intent pairs across depth of field, consistent characters, texture/seamless pattern, and model comparisons.
- **Affected routes/files:** `/blog/*`; `posts/*`; blog frontmatter schema and metadata generation.
- **Why it matters:** Fast-changing model instructions require verifiable dates, versions, sources, and honest scope. Template superlatives and repeated intent make the corpus look scaled rather than maintained.
- **Chosen remediation:** Introduce tested-version, reviewed-by, last-verified, sources, and evidence fields; retire generic suffixes and superlatives; require unique intent and useful examples; merge only where connected query/URL data supports it.
- **Implementation status:** Verified; connected metrics and decisions are recorded for every known content URL. GA4's severe coverage gap is explicitly excluded as a deletion signal.

### P1-09 — Sitemap freshness and host redirects send avoidable signals

- **Evidence:** Static and use-case sitemap entries use the build date as `lastmod`, so unchanged pages look freshly modified on every deployment. `https://www.freeaipromptmaker.com/` returns a temporary 307 to the canonical host, while plain HTTP root returns 308.
- **Affected routes/files:** `app/sitemap.ts`; hosting redirect configuration; all sitemap consumers.
- **Why it matters:** False modification dates waste crawl/freshness signals. Google recommends permanent redirects such as 301/308 for permanent site moves.
- **Chosen remediation:** Emit a real content modification date or omit `lastmod`; configure a one-hop 308 from every non-canonical host/protocol combination while preserving path and query.
- **Implementation status:** Verified; code change pending, host configuration remains a manual external step.

### P1-10 — Core quality gates do not protect production

- **Evidence:** `npm run lint` fails with 3 errors and 6 warnings. TypeScript and build pass, but there is no test script and no unit, integration, route, accessibility, schema, or browser suite. Scheduled content workflows push directly to `main` without those gates.
- **Affected routes/files:** Entire repository; `package.json`; ESLint findings; GitHub Actions workflows.
- **Why it matters:** The live broken link, truncated content, theme regression, and misleading degraded API response are exactly the failures automated acceptance gates should catch.
- **Chosen remediation:** Fix lint, add focused unit/integration/browser/accessibility/schema/link tests, require build/type/lint/test checks on pull requests, and prohibit scheduled direct pushes.
- **Implementation status:** Verified; pending test-driven implementation.

### P1-11 — Newsletter and affiliate/comparison surfaces are not trustworthy enough

- **Evidence:** The footer newsletter form only prevents submission; it has no backend, success/error state, or clear “not available” label. The tools page shows eight ratings without evidence, contains pricing freshness claims, and includes an active placeholder affiliate URL using `?via=freeaipromptmaker`; outbound links omit `sponsored`/`nofollow` treatment.
- **Affected routes/files:** Global footer; `/tools`; `data/ai-tools.ts`; tools UI.
- **Why it matters:** A no-op form is misleading functionality. Unsubstantiated ratings and undeclared affiliate tracking undermine the stated no-bias claim and AdSense publisher trust.
- **Chosen remediation:** Remove the newsletter until it genuinely works with consent and confirmation. Remove unsupported ratings/pricing and the placeholder affiliate destination; add clear disclosure and appropriate link relationships if an authorized affiliate program is later used.
- **Implementation status:** Verified; pending implementation.

### P2-01 — Missing static asset causes a production 404

- **Evidence:** Fresh homepage Lighthouse recorded a console/network 404 for `/noise.png`; the hero references the file but it is absent from `public/`. The organization schema also references `/logo.png`, which is not present in the inspected static assets.
- **Affected routes/files:** Homepage hero; organization schema; `public/`.
- **Why it matters:** Failed requests hurt quality signals and leave metadata consumers with broken assets.
- **Chosen remediation:** Remove unused references or add optimized, correctly sized brand assets; add a route/static-asset existence test.
- **Implementation status:** Verified for `/noise.png`; final logo response verification remains in implementation QA.

### P2-02 — Upload validation and rate limiting are not robust

- **Evidence:** The image API checks declared MIME/size but not file signature or decoded dimensions. Rate limiting is in-memory per runtime instance. When Gemini is configured, uploaded bytes are forwarded to Google, which is not accurately expressed by current “local/transient” assurances.
- **Affected routes/files:** `/api/image-to-prompt`; privacy policy; deployment/runtime configuration.
- **Why it matters:** Client-declared MIME is not a sufficient security boundary, serverless in-memory limits are inconsistent, and the legal disclosure must match real processing.
- **Chosen remediation:** Verify magic bytes and dimensions before processing, use a deployment-appropriate abuse control if the feature remains public, minimize retention/logging, and document the actual third-party data flow without guarantees the publisher cannot make.
- **Implementation status:** Verified; pending implementation and owner policy confirmation.

### P2-03 — Security headers need a production-safe tightening plan

- **Evidence:** The current Content Security Policy permits `unsafe-inline` and `unsafe-eval`; third-party script requirements are broad. No automated header test exists. The public site also performs an unused AdSense preconnect before consent.
- **Affected routes/files:** Next/Vercel headers and root layout; third-party script components.
- **Why it matters:** Broad script allowances reduce XSS containment and make future third-party changes harder to review.
- **Chosen remediation:** Inventory necessary sources, remove unused connections, migrate toward nonce/hash-compatible scripts where practical, and test headers without breaking the generator or authorized Google tags.
- **Implementation status:** Verified; staged remediation required.

### P2-04 — Metadata and template details overstate freshness and quality

- **Evidence:** Repeated meta-description suffixes affect about 240 guides; stock images are often weakly related to article intent; generic FAQ/HowTo blocks inflate page length; estimated read time and schema derive from generated content rather than editorial verification.
- **Affected routes/files:** `/blog/*`; post generator; article metadata/schema and image selection.
- **Why it matters:** Good metadata should describe unique visible content, not compensate for uncertain quality with repeated claims.
- **Chosen remediation:** Generate metadata only after editorial acceptance, select genuinely representative media with provenance, and include FAQ/HowTo only when the visible page directly supports it.
- **Implementation status:** Verified; pending content rebuild.

### P3-01 — Minor polish and resilience issues

- **Evidence:** The mobile cookie banner overlaps the generator launch area and its management control is visually cramped. Lighthouse flags generic link text, about 14 KiB legacy JavaScript, forced reflow, and an unused preconnect. Some implementation comments and visible placeholders expose internal configuration language.
- **Affected routes/files:** Homepage mobile layout; consent banner; footer; build target/polyfills; advertisement components.
- **Why it matters:** These are not primary readiness blockers, but together they make the product feel less finished.
- **Chosen remediation:** Resolve during component rebuild after P0/P1 work; verify on 320, 375, 768, 820, 1024, and desktop widths.
- **Implementation status:** Verified; queued behind higher-priority work.

## Positive controls worth preserving

- All 276 sitemap entries returned 200 and were indexable during capture.
- Every successful page had one H1 and a canonical URL.
- The canonical HTTP root redirect is permanent; only the `www` variant needs correction.
- The text prompt builder completed the audited concept-to-result-to-copy flow correctly.
- Consent decline prevented Google Analytics and AdSense script injection in the tested code path, even though placeholders and the preconnect need correction.
- The custom 404 returns the correct HTTP status and offers useful recovery links.
- `ads.txt` returned 200 as `text/plain` and followed the expected record shape; publisher identifiers are intentionally omitted from this report.
- Static rendering, strict TypeScript, a passing production build, zero measured CLS in the two Lighthouse runs, and mostly strong automated accessibility scores provide a workable engineering base.

## Policy and measurement references

- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google AdSense publisher policies](https://support.google.com/adsense/answer/10502938?hl=en)
- [Google structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google requirements for certified CMPs](https://support.google.com/adsense/answer/13554020?hl=en)
- [Google AdSense EU user consent policy help](https://support.google.com/adsense/answer/9804260?hl=en)
- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds?hl=en)
- [Google redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

## Audit completion and next gate

The repository, public production, Search Console, GA4, and AdSense audit is complete. Connected evidence is sufficient for a conservative rebuild and the first data-supported URL mappings. Known limitations remain:

1. GA4 captured only 158 sessions against 1,554 GSC clicks in comparable 90-day periods, so it cannot support destructive URL decisions.
2. Search Console provides sample URLs for indexing reasons and no per-page Google-selected canonical export; URL Inspection was deliberately not used as a bulk workflow.
3. AdSense has no serving data because the site is not approved, and its `ads.txt` status is stale relative to the now-working public file.
4. Genuine first-hand prompt/image experiments, ownership identity, editorial authorship, and claim-support artifacts require human evidence and cannot be invented during implementation.

The next gate is design/architecture approval, followed by test-driven implementation. No external account write action is authorized.
