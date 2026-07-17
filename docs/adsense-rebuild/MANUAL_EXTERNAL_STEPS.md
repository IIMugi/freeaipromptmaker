# Manual external steps

Last verified against official Google guidance: 2026-07-17

These actions were deliberately not performed. They change production or Google account state and require explicit owner authorization.

## Current stop/go decision

- **Deploy for production observation:** GO only after owner review and authorization.
- **Enable advertising:** STOP — advertising and ad consent are not implemented.
- **Request AdSense review:** STOP until the rebuilt release is live, verified, and the current account tasks/status are known.

The local publisher section has seven source-verified guides across Stable Diffusion, Leonardo, and Midjourney. The other 246 registry records remain `needs-review`. This satisfies the local publisher-depth objective but does not establish account eligibility or guarantee a review result.

## 1. Owner and editorial review

1. Review the branch diff, `FINAL_READINESS_REPORT.md`, `CONTENT_DECISIONS.csv`, `URL_INVENTORY.csv`, `QA_MATRIX.md`, and `LIGHTHOUSE_SUMMARY.json`.
2. Review all seven verified guides for source accuracy, rights, tone, and current interface/version boundaries.
3. Keep every uncertain guide quarantined. Promotion requires current primary sources, a verification date, exact version/interface scope, limitations, and an accountable human review.
4. Do not lightly edit or “humanize” legacy generated copy. Rewrite from evidence or retire it with a documented redirect/410 decision.

## 2. Authorized deployment

1. Deploy the locally merged `main` only after explicit authorization.
2. Set `NEXT_PUBLIC_SITE_URL=https://freeaipromptmaker.com`.
3. Set `NEXT_PUBLIC_GA4_ID` only for the correct GA4 property. The value is strictly validated and the tag remains blocked until analytics consent.
4. Set `NEXT_PUBLIC_GOOGLE_VERIFICATION` only if meta-tag ownership verification is intentionally used.
5. Set a server-only `GEMINI_API_KEY` only if image analysis should be available. Do not expose provider keys through `NEXT_PUBLIC_*` variables.
6. Confirm the production platform preserves the headers from `next.config.ts`.
7. Do not add advertising variables, publisher IDs, scripts, or slots as part of this deployment.

## 3. Immediate production verification

Use a clean unauthenticated browser and a terminal:

1. Confirm HTTP→HTTPS and `www`→apex behavior are permanent, one hop, and query preserving.
2. Confirm `/robots.txt`, `/sitemap.xml`, homepage, guide hub, all seven verified guides, privacy, cookies, terms, contact, content standards, and tools return 200.
3. Confirm `/flux-pro` and the merged guide source reach their final destinations in one hop.
4. Confirm the malformed nested `/keyword` URL returns 410 and an unknown route returns 404.
5. Confirm no `needs-review` guide appears in the guide hub or sitemap and model/use-case variants remain noindex/follow.
6. Confirm declining analytics produces no Google measurement request; accept, reopen settings, withdraw, and verify the decision and cookie cleanup.
7. Confirm image analysis returns an explicit unavailable response without a provider key and a provider-derived response only when correctly configured.
8. Re-run the production equivalent of the crawler and browser suite, including console/network capture and both themes at all four viewport widths.

## 4. Search Console observation

1. Open the correct domain property.
2. Inspect the homepage, `/blog`, and representative verified guides with Live Test after deployment.
3. Confirm rendered HTML, canonical, robots state, structured data, and mobile usability.
4. Submit or re-submit the root sitemap only after production verification. Google does not guarantee indexing: [sitemap guidance](https://support.google.com/webmasters/answer/7451001?hl=en), [URL Inspection guidance](https://support.google.com/webmasters/answer/9012289?hl=en).
5. Do not request indexing for noindex or `needs-review` pages.
6. Record weekly through several crawls:
   - indexed/not-indexed counts and reasons;
   - changes in the baseline discovered-not-indexed and crawled-not-indexed groups;
   - mobile field CWV, especially LCP;
   - clicks, impressions, CTR, and position for the homepage and verified clusters.
7. Do not claim field CWV improvement until the Search Console/Chrome UX window reflects the deployed release.

## 5. Analytics validation

1. In a clean session, decline analytics and verify zero GA4 requests/events.
2. In a second clean session, accept analytics and verify the correct property receives only the approved bounded events.
3. Confirm prompt text, negative prompts, image bytes/name, free text, and full query-bearing URLs do not reach analytics.
4. Withdraw consent and verify Consent Mode updates plus reachable `_ga*`, `_gid`, `_gat*`, `_gac*`, and `_dc_gtm_*` cleanup across relevant domain scopes.
5. Compare GA4 sessions with Search Console clicks after several weeks. Treat the baseline mismatch as incomplete instrumentation until explained.

## 6. Separate advertising and CMP implementation

The current dialog controls optional analytics only. It is not an advertising CMP.

1. Check Google’s current publisher requirement before implementation. Google currently requires a Google-certified CMP integrated with the IAB TCF for personalized ads served to users in the EEA, UK, and Switzerland: [official CMP requirement](https://support.google.com/adsense/answer/13554116?hl=en).
2. Choose and configure an appropriate certified CMP with privacy/legal review. Google states that certification does not establish full compliance with the TCF or applicable privacy law.
3. Implement clear consent, refusal, manage-options, and later revocation behavior in every supported language/region.
4. Decide personalized, non-personalized, and limited-ad behavior with legal review; do not repurpose the analytics-only dialog.
5. Add publisher code and placements only in a separate authorized change after current account/site status permits it.
6. Re-run accessibility, keyboard, density, deceptive-adjacency, responsive, CLS, performance, security-header, console, and network tests with real advertising behavior before enabling it in production.

## 7. Account and ads.txt evidence

1. In AdSense **Sites**, check the current approval status and ads.txt status. Google documents `Requires review`, `Needs attention`, `Getting ready`, and `Ready`, plus ads.txt `Not applicable`, `Not found`, `Unauthorized`, and `Authorized`: [official site-status guidance](https://support.google.com/adsense/answer/12170222?hl=en).
2. Complete the account tasks shown on the AdSense homepage. Google notes that incomplete tasks can keep the site in “Getting ready.”
3. The repository currently contains an existing public seller declaration in `public/ads.txt`. Confirm that its publisher ID belongs to the intended owner account, verify the served file at the site root after deployment, and do not change it without authorization.
4. Check Policy Center and regulatory messages again. Record dates and screenshots without changing settings until the implementation plan is approved.
5. Do not remove and re-add the site merely to accelerate processing; Google warns that resubmission can delay the process.

## 8. Request review last

Request review only when all of the following are true:

- the rebuilt release is live and publicly reachable;
- production crawl, browser, privacy, security, and performance checks are complete;
- all seven verified guides have passed owner/editor review and no uncertain guide is promoted;
- account tasks, Policy Center, site status, and ads.txt status have been checked;
- the separate advertising/CMP implementation is complete if advertising code will be present;
- mobile field data has been observed and no severe UX regression exists;
- the owner explicitly authorizes the request.

Then use the current AdSense Sites workflow. Google says checks usually take a few days and can take 2–4 weeks in some cases; no outcome is guaranteed: [site-status guidance](https://support.google.com/adsense/answer/12170222?hl=en), [site-not-ready guidance](https://support.google.com/adsense/answer/12176698?hl=en).

**Search ranking, indexing, traffic, and AdSense approval cannot be guaranteed.**
