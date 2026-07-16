# Free AI Prompt Maker AdSense Rebuild Design

Date: 2026-07-16
Status: approved design, pending written-spec review
Baseline commit: `ef94e2b1913db1e76f6d45e466aaa4c0b994dee5`

## Objective

Rebuild `freeaipromptmaker.com` into an honest, useful, accessible, fast, and maintainable prompt-making product with a realistic chance of passing a future AdSense site review. Approval is not guaranteed. Success means removing every identifiable low-value-content, deception, policy, consent, technical SEO, accessibility, performance, security, and unfinished-product risk that can be corrected safely in the repository.

The rebuild must preserve legitimate organic equity and useful product behavior. It must not manufacture authors, tests, reviews, benchmarks, audience statistics, professional credentials, or first-hand experience.

## Evidence driving the design

- AdSense classifies the site as **Low value content**, with **Action required** and “site is not ready to show ads.”
- Search Console reports 103 indexed and 197 not-indexed pages: 119 discovered-not-indexed and 50 crawled-not-indexed.
- The site has 253 generated guides; all contain first-person language and 245 contain generated experience phrases.
- Scheduled workflows publish search-targeted content directly to `main` without human review.
- The leading negative-prompts guide has 796 clicks and 437,580 impressions; a same-intent guide has 9 clicks and 40,188 impressions.
- GA4 captured 158 sessions while Search Console reported 1,554 clicks in comparable 90-day windows, so Analytics is not complete enough to justify destructive URL decisions.
- Mobile Search Console field data groups 35 URLs under LCP longer than 2.5 seconds; the representative group is 2.6 seconds.
- Production image-to-prompt can return plausible output without analyzing the image.
- Site-wide aggregate ratings, audience/testing claims, and many authorship/editorial claims lack evidence.
- Light theme, tablet navigation, consent behavior, empty advertising inventory, lint, tests, dependency security, and internal linking have material defects.

Detailed evidence remains in `docs/adsense-rebuild/`.

## Chosen approach

Perform a major refactor within the existing Next.js App Router stack.

This approach is preferred over a targeted patch because the trust, content, layout, consent, and quality-control problems cross most templates. It is preferred over a framework migration because the current static-first build works, TypeScript passes, public URLs can remain stable, and migration would add SEO, redirect, deployment, and testing risk without resolving the underlying publisher-quality problem.

## Architectural principles

1. **Static-first publisher pages.** Articles, legal pages, directories, and trust pages render as Server Components with minimal client JavaScript.
2. **Isolated product islands.** The text generator, image upload, theme switch, consent bridge, and other interactive behavior are bounded client components with explicit inputs and outputs.
3. **Truthful behavior.** Unavailable services fail closed. UI labels describe what the application actually does.
4. **Human-first content.** Indexability and navigation follow usefulness, accuracy, uniqueness, and evidence—not publication volume.
5. **One source of truth.** Theme tokens, site facts, metadata, schema, routes, content state, and analytics event names each have one typed definition.
6. **Progressive enhancement.** Core navigation, article reading, legal information, and the text generator’s essential form remain understandable without decorative motion.
7. **No account writes.** Search Console, GA4, AdSense, DNS, deployment, and CMP publishing remain external/manual unless separately authorized.

## Route and rendering model

### Core product routes

- `/` becomes the primary text prompt builder and concise product explanation.
- `/image-to-prompt` remains only if it can expose an honest configured/unavailable/error state.
- `/prompt-generators` remains the maintained directory for supported models and use cases.
- Generic `/prompt-generator-for/[useCase]` routes remain indexable only when their visible content is unique and useful.
- Model/use-case variants remain operational `noindex,follow` pages initially; they stay out of the sitemap and primary search architecture.

### Publisher and trust routes

- `/blog` becomes a curated guide hub, not a chronological dump of automated posts.
- Retained guide routes keep their current slugs unless the URL decision table explicitly assigns a merge, redirect, archive, or removal.
- `/about`, `/content-standards`, `/privacy`, `/cookies`, `/terms`, and `/contact` use honest, implementation-aligned copy.
- The custom 404 preserves correct status and useful recovery paths.

### Known URL actions

- Merge `/blog/2025-11-27-stable-diffusion-negative-prompts-guide` into `/blog/2025-11-29-stable-diffusion-negative-prompts-guide`. Transfer unique “field” and “best practices” coverage, update internal links, then issue one permanent redirect.
- Redirect `/flux-pro` permanently to `/prompt-generators` as the closest maintained generator directory.
- Remove the malformed relative link creating `/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword`; serve explicit 410 removal handling for that accidental URL.
- Preserve four historical model/use-case 404 examples that now return 200; no redirect is added to currently healthy routes.
- Never redirect unrelated removed content to the homepage.

## Content system redesign

### Stop the harmful pipeline

- Disable scheduled direct-to-production content workflows.
- Remove the “humanize” instruction that invents experience.
- Prevent content automation from committing directly to `main`.
- Any future assisted draft must enter a pull-request review flow and pass the editorial schema before it can be indexable.

### Editorial states

Every guide receives a typed state:

- `verified`: reviewed for accuracy, sources, unique intent, current model/version, and honest authorship; eligible for index and sitemap.
- `needs-review`: remains accessible without ads but is `noindex`, excluded from sitemap and curated hubs, and clearly not presented as current verified guidance.
- `archived`: historically useful, clearly dated, `noindex`, excluded from current guidance and monetization.
- `redirected` or `removed`: implemented only through the approved URL mapping.

Indexability is derived from state, not scattered frontmatter booleans.

### Triage order

1. Protect and deeply improve the leading negative-prompts guide.
2. Improve other pages with meaningful clicks and query coverage.
3. Review high-impression/low-CTR pages against their actual queries before changing titles or descriptions.
4. Consolidate only same-intent pages with a stronger destination and transferred unique value.
5. Quarantine unverified automated pages with no meaningful Search evidence or with discovered/crawled-not-indexed quality signals.

Low GA4 traffic alone is never a removal reason. Receiving traffic never excuses misleading content.

`CONTENT_DECISIONS.csv` is the decision ledger, not a frozen implementation input. It must be updated when each page receives an editorial state so its final primary decision, destination, evidence, and implementation status stay consistent with the shipped sitemap, redirects, and route behavior.

### Required verified-guide fields

- accurate title and summary;
- stable intent and canonical URL;
- original publisher value;
- author/editor identity that can be truthfully supported, or neutral organizational authorship without invented biography;
- published date and last verified date;
- model/product version where relevant;
- primary sources and evidence links;
- limitations and untested claims clearly marked;
- representative media with provenance;
- explicit editorial state.

No word-count minimum is used as a quality proxy.

## Product and UI design

### Visual direction

Use a calm, credible, tool-first identity instead of an advertisement-heavy neon landing page. Retain a restrained cyan accent to preserve recognition, but use semantic surfaces, readable typography, generous spacing, and clear hierarchy.

- Light mode is a complete first-class theme with dark readable headings and accessible contrast.
- Dark mode uses deep navy surfaces without hard-coded page-specific foreground colors.
- Theme is applied before paint, persists locally, and can follow the system preference.
- Motion is restrained and disabled/reduced when `prefers-reduced-motion` is set.

### Page composition

The homepage order is:

1. concise value proposition with no unsupported statistics;
2. primary generator workspace;
3. short explanation of how prompt construction works;
4. supported model syntax and honest limitations;
5. a small curated set of verified guides;
6. transparent project/trust links;
7. compact footer.

There is no mobile sticky bar or consent overlay obscuring the generator. The desktop navigation only appears at widths where it fits; tablet widths use the compact navigation.

### Text generator

- Keep model selection, prompt composition, negative prompt, copy variants, and local history where they provide real value.
- Remove arbitrary “confidence,” “quality,” deterministic, hallucination-reduction, or publish-ready scores unless a documented measurement supports them.
- Clearly distinguish local deterministic formatting from model inference.
- Copy success uses an accessible live region and has a visible error state.
- Local history remains local and is described accurately.

### Image-to-prompt

- Validate MIME signature, size, decoded dimensions, and accepted formats.
- If the provider is missing, unavailable, rate-limited, or returns invalid output, do not generate a fake analysis. Return an explicit typed error/unavailable response.
- If configured, disclose that the image is sent to the named external processor and align privacy copy with retention/logging behavior.
- Show accessible upload, processing, success, error, and reset states.
- Do not claim style extraction accuracy, zero retention, or training exclusions the publisher cannot prove.

### Newsletter, tools, and affiliate surfaces

- Remove the no-op newsletter until a real consent-aware subscription workflow exists.
- Remove unsupported tool ratings, stale pricing claims, and placeholder affiliate parameters.
- If authorized affiliate links are introduced later, disclose them and use appropriate link relationships.

## AdSense and consent design

- Do not render AdSense scripts, empty ad containers, or placeholder inventory during the rebuild/readiness period.
- Publisher content and product function must stand on their own without advertising.
- Keep ad integration behind one typed, disabled-by-default boundary so it can be reintroduced deliberately after readiness review.
- A future enabled ad requires configuration, a valid slot, an authorized consent state, and a reader-safe placement.
- Do not place ads next to copy/upload/generate controls or cluster multiple units after an article.
- The repository can prepare a consent integration boundary, but publishing a Google-certified CMP message for this site is a manual external step.
- Do not describe the current custom banner as certified. Remove it if it is redundant with the future certified CMP.
- Consent withdrawal and accurate legal disclosures are required before production ad/analytics expansion.

## Analytics design

Keep measurement minimal, consent-aware, and tied to product outcomes. Define typed events for:

- generator started;
- prompt generated locally;
- prompt copy succeeded/failed by variant;
- image upload accepted/rejected;
- image analysis succeeded/failed/unavailable;
- guide CTA used;
- consent state changed.

Do not include prompt text, image data, personal data, account identifiers, or visitor identifiers in event parameters. Do not mark events as key events or change GA4 configuration without authorization. Document the present GA4/Search Console coverage gap.

## Technical SEO design

- Generate one canonical per indexable page from a centralized URL helper.
- Build the sitemap only from `verified` indexable routes and real modification dates; omit `lastmod` when unknown.
- Keep operational noindex variants out of the sitemap and de-emphasized in primary navigation.
- Configure one-hop permanent canonical-host redirects while preserving path and query.
- Remove unsupported `AggregateRating`, `Offer`, generic FAQ, and generic HowTo schema.
- Emit only visible, page-specific Organization, WebSite, BreadcrumbList, Article, FAQ, or HowTo data that can be supported.
- Add schema tests for route type, required fields, visibility, canonical consistency, and absence of fake ratings.
- Build useful guide hubs and contextual related links from editorial clusters rather than global template saturation.
- Preserve high-value query coverage during merges and update every source link, sitemap entry, canonical, and related-content reference.

## Accessibility design

- Add a skip link and a stable `main` landmark target.
- Give every input a visible label or an accessible programmatic label that does not rely on placeholder text.
- Preserve logical heading order and one H1 per page.
- Meet WCAG AA contrast in both themes, including muted footer/breadcrumb text.
- Ensure keyboard access, visible focus, predictable menu behavior, dialog focus management, and accessible status announcements.
- Respect reduced motion and avoid content motion required to understand state.
- Test at 320, 375, 768, 820, 1024, and desktop widths.

## Performance design

- Keep article/legal pages server-rendered and exclude generator/upload/motion code from their client bundles.
- Prioritize the real LCP image and supply responsive sizes, dimensions, and representative optimized media.
- Remove `/noise.png` and other missing/unused asset requests.
- Remove pre-consent/pre-approval AdSense connections.
- Reduce global providers and only hydrate interactive islands.
- Avoid layout shifts by reserving space for genuine media, not disabled ads.
- Target repeat mobile lab LCP at or below 2.5 seconds on the homepage and representative article, zero critical console errors, and no known failed static-asset requests.
- Field improvement is measured later in Search Console and is never guaranteed by lab results.

## Security and dependency design

- Upgrade Next.js and affected dependencies to patched compatible versions.
- Fix all lint errors and review remaining warnings.
- Sanitize rendered Markdown/HTML and keep unsafe HTML disabled unless explicitly required and tested.
- Strengthen image upload validation and return bounded typed errors.
- Replace per-instance abuse limits with a deployment-appropriate boundary if the image endpoint remains enabled.
- Tighten CSP sources incrementally; remove unused third-party connections and avoid breaking required framework behavior.
- Never expose secrets, account IDs, publisher IDs, tokens, or raw authenticated exports.

## Error and empty states

Every interactive unit defines idle, loading, success, empty, unavailable, validation-error, provider-error, rate-limit, and retry states where applicable.

- Errors are specific and actionable without exposing internal stack traces or configuration secrets.
- Disabled features do not render fake results or implementation-oriented placeholders.
- Network/provider failures preserve user input when safe.
- The 404 page remains useful in both themes.
- Removed URLs return the mapped permanent redirect or removal status without redirect chains.

## Test strategy

Implementation follows test-driven development.

### Unit and integration tests

- prompt-builder syntax and variants;
- local-history behavior and migration;
- editorial-state/indexability rules;
- sitemap, canonical, robots, redirect, and schema generation;
- consent and script-loading boundaries;
- image validation and API success/error/unavailable contracts;
- analytics event sanitization;
- content/frontmatter validation;
- known broken-link and asset regression cases.

### Browser tests

- homepage generator and copy workflows;
- image-to-prompt configured/unavailable/error states with non-sensitive fixtures;
- mobile/tablet/desktop navigation;
- light/dark/system theme persistence and contrast-sensitive screenshots;
- keyboard navigation, focus order, skip link, and reduced motion;
- consent decline/withdrawal with no Google tag or ad container;
- representative article, legal, directory, 404, redirect, and removal routes;
- zero unexpected console errors and failed first-party requests.

### Quality gates

- dependency install from lockfile;
- lint;
- TypeScript;
- unit/integration tests;
- production build;
- production dependency audit with documented exceptions only when no safe patch exists;
- full internal link/status/schema crawl;
- Lighthouse mobile comparison on homepage and representative article;
- adversarial review from publisher-policy, technical SEO, accessibility, mobile UX, security, and skeptical AI-art-user perspectives.

## Implementation sequencing

1. Add test infrastructure and freeze harmful auto-publishing.
2. Introduce central site facts, editorial state, URL helpers, schema rules, and redirect mapping.
3. Remove misleading claims/schema and fail image analysis closed.
4. Rebuild semantic design tokens, layout, navigation, footer, themes, and accessibility foundations.
5. Refactor the generator and image tool into isolated, truthful product components.
6. Rebuild publisher/trust templates and advertising/consent boundaries.
7. Apply connected-data content triage, the approved merge, redirect, 410, sitemap, and internal-link updates.
8. Upgrade dependencies, tighten security, and optimize bundles/media.
9. Run all automated/manual verification and fix regressions.
10. Complete implementation log, manual external steps, and final readiness report.

Each step must leave the application buildable and must preserve unrelated user changes.

## External/manual work

The final manual-steps report will list, without performing them:

- deploy and production verification;
- canonical-host redirect/DNS/hosting checks where repository configuration is insufficient;
- publish/configure a certified CMP for the correct site if monetization proceeds;
- verify AdSense `ads.txt` recognition after deployment and processing delay;
- review GA4 product-event and consent coverage;
- observe Search Console indexing and field CWV after release;
- provide genuine ownership/editor/test evidence where desired;
- request AdSense review only after the site has been deployed, observed, and manually reviewed.

## Acceptance criteria

The rebuild is ready for handoff only when:

- no known fabricated statistic, review, rating, experience, author, test, or capability claim remains;
- no fake image analysis is returned;
- auto-generated content cannot publish directly;
- every known URL has one documented decision and every implemented redirect is one hop;
- indexable routes are limited to verified content and useful product/trust pages;
- both themes and all target breakpoints are usable and accessible;
- no ad script or empty ad inventory appears in the readiness build;
- legal copy matches actual data flow;
- lint, TypeScript, tests, and production build pass;
- critical first-party browser flows pass without console/network failures;
- fresh crawl, schema checks, accessibility checks, and Lighthouse comparisons are recorded;
- remaining human evidence, external actions, and policy risks are explicit;
- the final report states that ranking, indexing, traffic, and AdSense approval cannot be guaranteed.
