# Manual external steps

These actions were deliberately not performed. They change production or Google account state and require the owner's explicit authorization.

## Current stop/go decision

- **Deploy for production observation:** GO after the owner reviews the branch/diff and authorizes deployment.
- **Enable ads:** STOP.
- **Request AdSense review:** STOP.

The site currently has one source-verified public guide and 252 quarantined legacy guide records. Google says a site should provide enough valuable, unique content and a good user experience before review. It does not publish a universal article-count threshold. Add and verify a representative body of genuinely useful content before requesting review: [Google AdSense — site not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en).

## 1. Editorial evidence before monetization

1. Select the next guides using Search Console page/query evidence, beginning with high-impression intents that do not duplicate the verified negative-prompts guide.
2. For every guide promoted from `needs-review` to `verified`, record:
   - exact product/model/interface version;
   - verification date;
   - primary sources;
   - real test inputs and outputs or screenshots owned by the site;
   - limitations and failure cases;
   - a named accountable reviewer only when that person genuinely performed the review.
3. Rewrite from evidence; do not lightly edit or “humanize” the legacy generated copy.
4. Keep uncertain pages noindex or retire them with an evidence-backed redirect/410 decision.
5. Do not submit for AdSense review while the public publisher section is effectively one verified guide.

## 2. Deploy the reviewed branch

1. Merge or deploy `feature/adsense-readiness-rebuild` only after explicit owner authorization.
2. Set `NEXT_PUBLIC_SITE_URL=https://freeaipromptmaker.com`.
3. Set `NEXT_PUBLIC_GA4_ID` only for the correct GA4 property. The tag remains blocked until analytics consent.
4. Set `NEXT_PUBLIC_GOOGLE_VERIFICATION` only if ownership verification is intentionally managed through a meta tag.
5. Set a server-only `GEMINI_API_KEY` only if image analysis should be available. Do not expose it as a `NEXT_PUBLIC_*` variable. The additional numbered keys are optional rotation fallbacks.
6. Confirm the production platform preserves the headers in `next.config.ts`.

## 3. Production verification immediately after deploy

Run from an unauthenticated browser and a terminal:

1. Confirm HTTP→HTTPS and `www`→canonical-host behavior are permanent and one hop.
2. Confirm `/robots.txt`, `/sitemap.xml`, `/ads.txt`, homepage, verified guide, privacy, terms, contact, and content standards return 200.
3. Confirm `/flux-pro` and the merged guide source return the intended permanent redirect.
4. Confirm the malformed nested `/keyword` URL returns 410.
5. Confirm no needs-review guide appears in the sitemap or guide hub.
6. Confirm declining analytics produces no Google tag request and the privacy control can reopen settings.
7. Confirm image analysis returns an explicit unavailable state when its key is absent and a provider-derived result when correctly configured.
8. Run the production equivalent of the route crawl and browser smoke suite.

## 4. Search Console observation

1. Open the correct domain property.
2. Inspect the homepage, `/blog`, and the verified negative-prompts guide with Live Test after deployment.
3. Confirm the new canonical, robots, rendered HTML, and mobile usability.
4. Submit or re-submit the root sitemap only after production verification. Google recommends a sitemap for many changed pages and does not guarantee indexing: [Search Console sitemap guidance](https://support.google.com/webmasters/answer/7451001?hl=en), [URL Inspection guidance](https://support.google.com/webmasters/answer/9012289?hl=en).
5. Do not request indexing for noindex/needs-review pages.
6. Record weekly for at least several crawls:
   - indexed/not-indexed counts and reasons;
   - crawl/validation changes for the 119 discovered and 50 crawled exclusions;
   - mobile field CWV, especially the 35-URL LCP group;
   - clicks, impressions, CTR, and position for the verified guide and homepage.
7. Do not claim field CWV improvement until the Chrome UX/Search Console window reflects the deployed release.

## 5. Analytics validation

1. In a clean browser, decline analytics and verify zero GA4 requests/events.
2. In a second clean session, accept analytics and verify the correct property receives only approved outcome events.
3. Confirm no prompt text, negative prompt, image bytes/name, free text, or full URL query payload reaches analytics.
4. Compare GA4 sessions with Search Console clicks after several weeks. The baseline mismatch was 158 GA4 sessions versus 1,554 GSC clicks in similar 90-day windows.
5. Treat the baseline GA4 data as incomplete until the gap is explained.

## 6. Certified CMP and advertising — only when content is ready

The current privacy control is for optional analytics; it is not an IAB TCF advertising CMP.

1. In AdSense **Privacy & messaging**, configure a Google-certified CMP for the correct site before serving ads in the EEA, UK, or Switzerland. Google's current requirement is a certified CMP integrated with the IAB TCF; TCF v2.3 is now the applicable transition target: [CMP requirement](https://support.google.com/adsense/answer/13554020?hl=en), [TCF v2.3 integration](https://support.google.com/adsense/answer/9804260?hl=en).
2. Configure clear consent, do-not-consent, manage-options, and later revocation behavior. Review all selected languages and the privacy-policy URL before publishing: [Create a European regulations message](https://support.google.com/adsense/answer/10960768?hl=en).
3. Decide Basic versus Advanced Consent Mode with privacy/legal review; do not silently convert the analytics-only dialog into an ad-consent system.
4. Enable AdSense code and slots only in a separate authorized implementation after the account/site state permits it. Keep ad tags blocked when required consent is absent.
5. Re-run accessibility, layout, CLS, performance, and content-to-ad-balance tests with real ad code before production enablement.

## 7. ads.txt and AdSense site state

1. After deployment, confirm the public `ads.txt` contains the correct authorized seller line without duplicating entries.
2. In AdSense **Sites**, wait for reprocessing and confirm the site and ads.txt statuses. Google documents `Authorized`, `Unauthorized`, `Not found`, and `Not applicable` states here: [Check AdSense site status](https://support.google.com/adsense/answer/12170222?hl=en).
3. Do not alter the publisher identifier unless the owner confirms the correct account.
4. Do not remove/re-add the site merely to accelerate review; Google notes this can delay processing.

## 8. Request review last

Request review only when all of the following are true:

- the rebuilt site is live and publicly reachable without authentication;
- the production crawl and browser suite are clean;
- a meaningful set of guides has genuine source/test/editorial evidence;
- no generated/uncertain guide is promoted as verified;
- the Policy Center has been checked again;
- the correct CMP is published if advertising code will be used for affected regions;
- ownership and ads.txt states are correct;
- mobile field data has been observed and no severe UX regression exists;
- the owner has manually reviewed the site and explicitly authorizes the request.

Then use AdSense **Sites → site → Request review**. Google states review often takes days and can take 2–4 weeks; no result is guaranteed: [AdSense review steps](https://support.google.com/adsense/answer/12176698?hl=en).
