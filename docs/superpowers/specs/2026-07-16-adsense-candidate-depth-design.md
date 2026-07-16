# AdSense deployment-candidate depth design

Date: 2026-07-16

## Goal

Extend the completed readiness rebuild into the strongest honest local deployment candidate that the repository evidence permits. The work must add genuine publisher depth without reviving generated claims, preserve evidence-backed URLs without exposing uncertain prose, and keep advertising disabled.

## Evidence boundary

- Search Console metrics in `CONTENT_DECISIONS.csv` and `URL_INVENTORY.csv` determine candidate priority.
- GA4 is coverage-incomplete and cannot justify destructive URL decisions.
- A guide may be promoted only when its current body is replaced from primary documentation and the editorial registry records a verification date, an exact documented interface/version snapshot, authoritative sources, and limitations.
- Documentation verification is not hands-on image testing. Every promoted guide must say that no independent image-generation comparison was performed when no owned artifacts exist.
- Existing titles, metadata, examples, ratings, prices, personal experience, and performance claims are untrusted until independently supported.

## Legacy-guide architecture

### Selected approach: quarantine shell

All `needs-review` and `archived` guide URLs remain statically reachable with a self-canonical and `noindex,follow`. Their MDX body, image, generated table of contents, inferred takeaways, inferred pros/cons, share controls, and article calls to action do not render. Instead, the route renders:

- the original topic as the H1 so the preserved URL remains intelligible;
- an explicit review state and a short explanation that the previous body is withheld because it has not passed current source/version review;
- a link to the verified guide hub and, when available, verified related guides only;
- no Article schema and no search-index invitation.

This retains GSC-backed URLs and allows later evidence-led promotion without presenting uncertain copy as publication-quality. Mass 410, redirect, or deletion is rejected because Search Console shows established demand and GA4 is incomplete.

### Template cleanup

The article template must never synthesize advantages, limitations, or product claims from a topic label. Verified pages may render only frontmatter-authored pros/cons that survived the guide review. Related guides must always be verified. Metadata for quarantined routes must use a bounded review description rather than the unverified legacy description.

## Verified publisher clusters

Six existing high-value, non-duplicate URLs will be rewritten and promoted.

### Stable Diffusion WebUI workflow cluster

1. `2026-01-04-stable-diffusion-regional-prompting-guide`
   - Evidence: 122 long-range clicks; 38,089 impressions; 88 recent clicks.
   - Scope: Regional Prompter syntax, region planning, compatibility limits, and a reproducible text-only prompt matrix.
   - Version: Regional Prompter upstream `main` commit `3ed4cb30e10e510e4cd9b33cd9b11cda170859c2`, documented against AUTOMATIC1111 1.10.1.
2. `2026-01-25-stable-diffusion-wildcards-guide`
   - Evidence: 81 clicks; 23,038 impressions; 72 recent clicks.
   - Scope: Dynamic Prompts wildcard/variant syntax, deterministic file organization, expansion-count calculations, and failure cases.
   - Version: Dynamic Prompts upstream `main` commit `de056ff8d80e4ad120e13a90cf200f3383f427c6`, documented against AUTOMATIC1111 1.10.1.
3. `2026-02-13-best-stable-diffusion-extensions`
   - Evidence: 45 clicks; 17,283 impressions; 32 recent clicks; seven GA4 sessions.
   - Scope: a safety-first extension selection and installation checklist, not a ranked “best” list; arbitrary-code risk, version pinning, rollback, and minimal-stack decisions.
   - Version: AUTOMATIC1111 1.10.1 and official extension documentation snapshot verified 2026-07-16.

These pages link contextually to the already verified negative-prompts guide and to one another only where the workflow relationship is useful.

### Leonardo current-interface cluster

4. `2026-02-09-master-leonardo-ai-models`
   - Evidence: 28 clicks; 33,592 impressions; 20 recent clicks.
   - Scope: current model-selection workflow using Leonardo’s 2026 model catalog and interface, with a task-to-model decision table and settings-availability caveats.
   - Version: Leonardo web image-creation interface documented 2026-02-17; model catalog snapshot verified 2026-07-16.
5. `2026-02-22-master-leonardo-ai-negative-prompts`
   - Evidence: 36 clicks; 47,414 impressions; 32 recent clicks.
   - Scope: bounded negative-prompt troubleshooting, explicit model dependence, and a one-variable-at-a-time worksheet.
   - Version: Leonardo prompting help and 2026 image-creation interface snapshot verified 2026-07-16.

The two Leonardo guides cross-link and avoid claims about token prices, tiers, or output quality not needed for the documented workflow.

### Midjourney legacy-reference cluster

6. `2025-11-27-midjourney-v6-complete-prompt-guide`
   - Evidence: 42 clicks; 133,750 impressions; 32 recent clicks; highest non-verified impression total.
   - Scope: an explicitly legacy V6/V6.1 parameter reference and migration note. It must state that V8.1 is the current default and that parameters vary by version.
   - Version: Midjourney V6.1 (released 2024-07-30; default until 2025-06-16), documentation snapshot verified 2026-07-16 while V8.1 is current.

This page does not imply that V6.1 is current and does not claim independent generation tests.

## Unique value requirements

Each guide contains more than a paraphrase of vendor documentation:

- an intent-specific decision table or worksheet;
- a reproducible text-only example whose expansion or parameter interpretation can be checked without generating an image;
- a troubleshooting sequence that changes one variable at a time;
- explicit “documented,” “locally checked,” and “not tested” boundaries;
- contextual links to verified adjacent material;
- a primary-source section matching the registry URLs.

No guide uses invented personal experience, ownership claims, ratings, universal lists, guaranteed outcomes, stale prices, or fake test results.

## Ledgers and counts

After six promotions, the editorial registry must contain 7 verified and 246 needs-review records. One needs-review source URL remains the existing permanent redirect. The 422 decision rows remain stable, but guide implementation statuses change from `IMPLEMENTED_NOINDEX_NEEDS_REVIEW` to `IMPLEMENTED_VERIFIED` for the six promoted URLs. `URL_INVENTORY.csv` must reflect indexability, sitemap state, evidence score, recommendations, implementation status, and final behavior for each changed row.

The sitemap and guide hub must include all seven verified guides and no needs-review guide. Every verified page must be self-canonical, linked from the hub or a verified cluster, useful without advertising, and represented in the sitemap.

## Test strategy

Behavior is changed test-first.

- Unit tests assert exact registry counts, required verification fields, source/body alignment, and no prohibited phrases in every verified body.
- Article-route/component tests assert that a needs-review body sentinel cannot appear in rendered output and that inferred pros/cons are absent.
- Browser tests assert the quarantine shell, `noindex,follow`, absence of legacy body/images/schema/ads, verified metadata, cluster links, themes, keyboard flow, and representative route behavior.
- Sitemap/content-decision tests assert seven verified guides, no noindex URL in the sitemap, and ledger-state alignment.
- Route crawl, lint, TypeScript, unit/component tests, production build, browser tests, dependency audit, and security/privacy checks remain mandatory.

## Performance and safety

Suppressing legacy MDX rendering removes unnecessary article content from 246 routes without delaying the generator or hiding verified content. Performance work may remove unused client/UI code or optimize verified article rendering, but must preserve one visible H1, content order, accessibility, CLS 0, and truthful behavior. Lighthouse uses three production mobile runs for the homepage and the leading verified guide, reporting medians even if the 2.5-second target remains unattainable honestly.

No external service state, deployment, push, CMP, ads, DNS, Search Console, Analytics, or AdSense setting is changed.
