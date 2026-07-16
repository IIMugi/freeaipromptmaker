# Connected Data Findings

Inspection date: 2026-07-16
Mode: owner-authenticated, read-only browser inspection

The correct Search Console domain property, GA4 web property, and AdSense site entry for `freeaipromptmaker.com` were inspected. The initially open GA4 property belonged to a different site; it was rejected as evidence and the correct property was selected through the account/property picker. No account ID, email address, publisher ID, payment profile, tax record, personal detail, credential, cookie, or visitor identifier is included here.

## Properties and date ranges

| Product | Property inspected | Primary ranges/status dates |
| --- | --- | --- |
| Search Console | Domain property for `freeaipromptmaker.com` | 2025-11-26–2026-07-14 and 2026-04-15–2026-07-14; indexing updated 2026-07-10; CWV/enhancements updated 2026-07-15 |
| Google Analytics 4 | Web property named `https://freeaipromptmaker.com/` | 2026-04-17–2026-07-15 (last 90 days) |
| Google AdSense | Site entry for `freeaipromptmaker.com` | Site status last updated 2026-03-04; current account/site screens inspected 2026-07-16 |

Sanitized per-URL aggregates are joined into `URL_INVENTORY.csv`. The raw page/query/example extracts are stored outside the public repository under the audit working directory.

## Search Console findings

### Search performance

| Range | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 2025-11-26–2026-07-14 | 1,940 | 970,118 | 0.2% | 6.8 |
| 2026-04-15–2026-07-14 | 1,554 | 487,332 | 0.3% | 7.4 |

The owner’s aggregate performance observations were accurate. The dominant query and page cluster is Stable Diffusion/SDXL negative prompts:

- `sdxl negative prompt`: 16 clicks and 208 impressions in the recent range, average position 3.0;
- `sdxl negative prompts`: 15 clicks and 161 impressions, position 2.9;
- `negative prompt generator`: 12 clicks and 239 impressions, position 7.3;
- `negative prompt`: 6 clicks and 1,123 impressions, 0.5% CTR, position 8.3.

The leading page, `/blog/2025-11-29-stable-diffusion-negative-prompts-guide`, recorded 796 clicks and 437,580 impressions over the long range and 592 clicks/197,368 impressions in the recent range. It accounts for roughly 41% of long-range clicks and 45% of impressions. Its click rate has accelerated materially in the recent period.

The homepage recorded 67 clicks/11,026 impressions in the long range and 50/6,764 in the recent range. Search demand is therefore content-led, not primarily branded/homepage-led.

A second page with the same Stable Diffusion negative-prompt intent recorded 9 clicks and 40,188 impressions. Its filtered queries center on “negative prompt field” and “best practices,” while the leading page owns the core list/generator/SDXL intent. This is the first evidence-backed merge candidate: unique field/best-practice material must move to the leading page before a one-hop permanent redirect.

Recent device distribution is unusually different by metric:

| Device | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 1,013 | 464,228 | 0.2% | 7.4 |
| Mobile | 522 | 22,482 | 2.3% | 7.8 |
| Tablet | 19 | 622 | 3.1% | 6.5 |

The United States produced 266 clicks from 316,407 impressions at 0.1% CTR. India produced 196 clicks from 10,930 impressions at 1.8% CTR. This suggests the very low aggregate CTR is heavily influenced by broad US desktop impressions; titles should not be rewritten in bulk without page/query intent review.

### Indexing

The owner-provided indexed/non-indexed counts were reversed. The live report showed:

- **103 indexed pages**;
- **197 not indexed pages across six reasons**;
- 119 “Discovered – currently not indexed,” successful validation state, with no last crawl in the examples;
- 50 “Crawled – currently not indexed,” validation not started;
- 19 excluded by `noindex`;
- 5 not found (404);
- 3 redirect pages;
- 1 blocked by robots.txt.

The 119 discovered examples and 50 crawled examples are dominated by the generated blog corpus. The `/blog` hub itself appears in the discovered-not-indexed group. This is strong account-level corroboration of the local scaled-content, weak-linking, and quality findings; it is not an instruction to request indexing or validate fixes before the rebuild.

Four historical model/use-case 404 examples now return 200 in the live crawl, so they are recorded as stale resolved examples. `/flux-pro` remains a real historical 404 and is assigned a permanent redirect to the maintained prompt-generator directory. The malformed article-relative `/keyword` URL remains an accidental 404 and is assigned explicit removal handling after its source link is repaired.

The submitted sitemap was successful, last read 2026-07-15, and reported 275 discovered pages. The live crawl found 276 current sitemap URLs; the one-page difference is consistent with publication timing and requires no resubmission.

### Core Web Vitals and enhancements

- Mobile: 35 URLs need improvement, 0 good, 0 poor.
- The only active issue is **LCP longer than 2.5 seconds on mobile**; INP longer than 200 ms affects 0 URLs.
- One group contains all 35 affected URLs, represented by the leading negative-prompts guide, with group LCP 2.6 seconds.
- Desktop: 35 good URLs, 0 need improvement, 0 poor.
- HTTPS: 35 HTTPS and 0 non-HTTPS in the overview.
- Breadcrumbs: 58 valid, 0 invalid.
- Review snippets: 35 valid, 0 invalid.

“Valid” review-snippet syntax does not prove the ratings are authentic. Repository/live evidence shows the underlying aggregate rating is unsupported, so it remains scheduled for removal despite a technically valid enhancement report.

### Manual actions, security, and links

- Manual actions: Google reported no issues detected.
- Security issues: Google reported no issues detected.
- External links: 2,784 total. The leading linked pages are the homepage and legal/trust pages with roughly 278 links each; the top linking “sites” are raw cloud IP addresses, so this should not be treated as strong editorial backlink evidence.
- Internal links: 731 total in the account report, concentrated on privacy, tools, homepage, contact, cookies, standards, about, terms, the generator directory, and image-to-prompt. This reinforces the crawl finding that most guides lack meaningful internal discovery.

## Analytics findings

The correct property captured only 158 sessions and 118 active users in the last 90 days, versus 1,554 Search Console clicks in a nearly identical period. GA4 therefore observes only about one tenth as many sessions as GSC reports organic clicks. Consent, implementation timing, attribution, or tag coverage may contribute; regardless of cause, GA4 is too incomplete to drive destructive URL decisions.

### Acquisition and engagement

| Channel | Sessions | Engaged sessions | Engagement rate | Average engagement/session | Events |
| --- | ---: | ---: | ---: | ---: | ---: |
| Total | 158 | 100 | 63.29% | 1m 37s | 1,110 |
| Organic Search | 101 | 64 | 63.37% | 1m 22s | 582 |
| Direct | 47 | 28 | 59.57% | 2m 16s | 451 |
| Referral | 5 | 4 | 80% | 1m 27s | 32 |
| AI Assistant | 4 | 4 | 100% | 50s | 28 |

GA4 reported 115 new users against 118 active users and no key events or revenue. The sample is too small and incomplete for a reliable retention conclusion.

### Landing pages

- Homepage: 38 sessions, 32 active users, 2m 04s average engagement/session.
- Leading negative-prompts guide: 22 sessions, 20 active users, 55s.
- Midjourney v6 guide: 7 sessions, 33s.
- Stable Diffusion extensions guide: 7 sessions, 1m 49s.
- AI art styles guide: 6 sessions, 2m 31s.
- AI art lenses guide: 6 sessions, 5m 36s.
- Image-to-prompt: 6 sessions, 1m 01s.
- `(not set)`: 11 sessions, another data-quality limitation.

All 48 reported landing-page rows were sanitized and joined where a current crawl URL existed.

### Devices, countries, and events

- Active users: 60 mobile (50.85%), 57 desktop (48.31%), 1 tablet.
- Mobile engagement rate was 61.97% with 1m 50s average engagement/user; desktop was 63.95% with 2m 32s.
- Top countries by active users were United States (27), India (25), Indonesia (7), Bangladesh (6), and Russia (5).
- Events: 423 `page_view`, 260 `scroll_depth`, 157 `session_start`, 115 `first_visit`, 101 `user_engagement`, 45 `scroll`, 8 `view_search_results`, and 1 generic `click`.
- No generator completion, prompt-copy, image-analysis success/degraded/error, newsletter, or other product-value event appeared. No key event was configured in the observed data.

The current Analytics setup cannot answer whether users successfully generate/copy prompts or whether image-to-prompt actually helps them.

## AdSense findings

### Exact site-review status

- Approval status: **Action required**.
- Site readiness: **Site is not ready to show ads**.
- Exact issue classification: **Low value content**.
- Google’s detail states that the site does not yet meet the criteria for use in the publisher network and points to minimum-content, unique/high-quality-content, thin-content, and publisher-quality guidance.
- Site status last updated: 2026-03-04.
- The account’s site table reports `ads.txt` as **Not found**, but the public audit now retrieves a correctly shaped `ads.txt` file at HTTP 200. The account state is stale until a future authorized review/recheck.

The review confirmation checkbox and “Request review” button were deliberately not used.

### Policy center and reporting

- Policy Center currently says there is no issue stopping or limiting ad serving. This does **not** clear the separate site-approval rejection; the account is not serving ads on the target site.
- Reports show zero page views, impressions, clicks, and earnings, so no page- or placement-level monetization evidence exists.
- The account home warns that account activation/site connection steps remain.

### Consent-message state

The Privacy & messaging overview says one European-regulations message is active, but read-only detail shows it belongs to another site in the account. The target site has no Google-managed published European-regulations message. The target’s current custom banner must therefore not be described as a Google-certified CMP solution.

## Conflicts between assumptions and account evidence

1. The earlier 197/103 indexed/non-indexed observation was reversed: it is 103 indexed and 197 not indexed.
2. The public crawl exposes 276 indexable URLs, while Google currently reports only 103 indexed and large generated-content discovery/crawl exclusion clusters.
3. Search Console reports 1,554 clicks in the recent three-month range; GA4 records only 158 total sessions in a comparable 90-day range. GA4 coverage is materially incomplete.
4. Search Console calls 35 review-snippet items technically valid, but the ratings are unsupported by repository or publisher evidence.
5. The public `ads.txt` is now available, while the stale AdSense site row says “Not found.”
6. The AdSense account has one active European consent message, but it is for another site—not `freeaipromptmaker.com`.

## High-confidence conclusions

- The exact AdSense rejection confirms the audit’s low-value/scaled-content diagnosis.
- The automated content corpus is not merely under-indexed because it is new: 50 URLs were crawled and still excluded, 119 remained undiscovered-to-crawl, and only 103 total pages were indexed.
- The leading negative-prompts URL is genuine organic equity and must be preserved/improved.
- One same-intent negative-prompts page should merge into that leader after unique query-serving material transfers.
- Mobile LCP remediation must target the shared article template, not only the homepage.
- GA4 must be treated as a coverage and product-measurement problem, not as evidence that most pages have no value.
- A review request now would be premature.

## Lower-confidence hypotheses

- Broad US desktop impressions may come from a small set of high-volume negative-prompt queries and SERP features; page/query filtering should precede title changes.
- Consent gating may explain part of the GA4/Search Console gap, but implementation history or tag coverage may also contribute.
- Some discovered-not-indexed URLs may enter the index with time, but the scaled production pattern and crawled-not-indexed cluster make quality/duplication the more actionable explanation.
- External links dominated by raw cloud IPs may be crawler/scraper artifacts rather than endorsements.

## Changes made because of connected data

- Enriched `URL_INVENTORY.csv` with long/recent Search Console metrics, click-rate trend, indexing category samples, GA4 sessions/users/engagement, and explicit coverage caveats.
- Rebuilt `CONTENT_DECISIONS.csv` with one primary decision per content URL.
- Assigned the 2025-11-27 Stable Diffusion negative-prompts guide to `MERGE` into the stronger 2025-11-29 guide.
- Assigned `/flux-pro` to a one-hop `REDIRECT_301` to `/prompt-generators`.
- Assigned the accidental article-relative `/keyword` URL to `DELETE_410` after its source link is corrected.
- Preserved 275 indexable live URLs as `IMPROVE` and 144 operational template variants as `NOINDEX`; no broad deletion decision was inferred from incomplete GA4 data.
- Elevated shared mobile article LCP, product-event measurement, and CMP truthfulness in the implementation priorities.

## Actions deliberately not performed

- No AdSense review, Search Console indexing/validation request, sitemap submission, URL inspection request, or external account change was made.
- No Analytics property/filter/audience/event/key-event setting was changed.
- No AdSense checkbox, publish switch, consent message, site entry, ad setting, payment item, or account setting was changed.
- No sensitive export was committed to the public repository.
