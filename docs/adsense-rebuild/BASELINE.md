# AdSense Rebuild Baseline

Baseline captured on 2026-07-16 before product-code changes. The repository was cloned from the public project link exposed in the production footer because the original Codex working directory was not a Git repository.

## Repository safety

- Repository: `https://github.com/IIMugi/freeaipromptmaker`
- Branch: `main`
- Baseline commit: `ef94e2b1913db1e76f6d45e466aaa4c0b994dee5`
- Initial status: clean and aligned with `origin/main`
- Package manager: npm with `package-lock.json`
- Repository visibility: publicly cloneable; authenticated Google exports must not be committed here.
- No push, deployment, DNS change, external-account write, AdSense review request, or bulk indexing action was performed.

## Confirmed stack and delivery model

- Next.js 16.0.8 App Router with React 19.2.0 and TypeScript 5 in strict mode.
- Tailwind CSS 4 through PostCSS; CSS variables and component-level utility classes provide theming.
- Static-first build for most routes, with one dynamic Node.js route at `/api/image-to-prompt` and dynamic social-image routes.
- Vercel production delivery is confirmed by live response headers and repository configuration.
- Google Fonts are self-managed through `next/font` at build time.
- Content is rendered from repository files at build time; there is no CMS or content database.

## Repository structure and responsibilities

| Area | Purpose |
| --- | --- |
| `app/` | App Router pages, metadata, sitemap, robots, legal pages, API route |
| `components/` | Generator, image-to-prompt UI, ads, consent, analytics, blog presentation, layout, themes |
| `posts/` | 253 Markdown/MDX guide files |
| `data/prompt-use-cases.ts` | 12 generic use-case pages and 144 model/use-case template combinations |
| `data/ai-tools.ts` | Tool-comparison claims, prices, ratings, and outbound/affiliate destinations |
| `data/content-planner.json` | AI-generated topic inventory and publication history |
| `scripts/` | Gemini-based topic generation, article generation, and “humanization” automation |
| `.github/workflows/` | Two scheduled auto-publishing workflows that commit directly to `main` |
| `lib/` | Prompt construction, content loading, analytics, consent, sanitation, and hooks |
| `public/` | Static assets and `ads.txt` |

## Baseline page and sitemap counts

- Production build: 425 prerendered/static outputs plus dynamic API/social-image routes.
- Public HTML routes crawled from the sitemap, repository route generation, and discovered internal links: 422.
- Successful public HTML pages: 420.
- Indexable successful pages: 276.
- `noindex,follow` successful pages: 144 model/use-case template variants.
- Expected/observed 404 pages in the audit crawl: 2, including one deliberate test URL and one malformed live internal link ending in `/keyword`.
- Live sitemap entries: 276; every sitemap URL returned 200 and none was noindex at capture time.
- Blog files/routes: 253.
- Generic use-case routes: 12.
- Model-specific use-case routes: 144.
- All successful HTML pages exposed one H1 and a canonical tag in the rendered source.

## Content generation model

The content system is materially different from the stale repository notes that describe only two blog posts:

- Two scheduled GitHub Actions workflows run daily and every two days.
- Gemini chooses topics around high-volume search keywords, writes long-form drafts, and runs a second “humanize” prompt.
- The humanization prompt explicitly adds unsupported first-person phrases such as “In my experience”.
- Generated MDX is committed and pushed directly to `main` without a human review gate.
- The content planner marks most posts as automatically generated.
- Default frontmatter attributes the work to the site name rather than a verifiable person.

This is an initial P0 scaled-content and trust risk, not merely a stylistic concern.

## Baseline commands

| Command | Result |
| --- | --- |
| `npm ci` | Passed; 536 packages installed. npm reported 11 total vulnerabilities (1 low, 4 moderate, 6 high). |
| `npm audit --omit=dev --json` | Failed as a quality gate; 7 production findings (4 high, 3 moderate), including the direct Next.js dependency. |
| `npm run lint` | Failed with 3 errors and 6 warnings. Errors include synchronous state updates in effects and a CommonJS import in an ESM script. |
| `npx tsc --noEmit` | Passed with exit code 0. |
| `npm run build` | Passed; 425 static pages generated in about 128 seconds. |
| Project test command | None exists. No unit, integration, route, accessibility, or browser test suite is configured. |

## Third-party scripts and data flows

- Google Analytics is conditionally loaded after the custom consent flag is accepted.
- Google AdSense is conditionally loaded after the same all-or-nothing custom consent flag.
- The banner is not a certified Google CMP and has no granular purpose/vendor controls.
- The image-to-prompt feature uploads selected images to the site API, which forwards image bytes to Google Gemini when configured.
- When Gemini is unavailable or returns invalid data, the API fabricates a plausible “analysis” from only the filename and returns HTTP 200 with a degraded flag.
- Unsplash images are used as generic category fallbacks for guide covers.
- The tools directory includes outbound links described as potentially affiliate links, but repository evidence does not establish a real affiliate relationship or the accuracy of pricing/ratings.
- A newsletter form is rendered in the footer, but no submission integration was found in the initial architecture review.

## Advertising baseline

- Multiple ad components exist for headers, articles, sidebars, results, and end-of-content placements.
- Long articles can request up to four dynamic in-article placements, in addition to other ad components.
- `AdUnit` renders an explicit advertisement placeholder when configuration is absent and can render an empty reserved ad container before consent/loading completes.
- The root layout preconnects to the advertising domain before consent.
- AdSense and analytics share one binary consent decision.
- `public/ads.txt` exists and must be validated against the authenticated AdSense site record without exposing identifiers.

## Technical SEO baseline

- Canonical tags, a custom 404, `robots.txt`, and a generated XML sitemap exist.
- HTTP correctly redirects to HTTPS with 308, while `https://www` currently uses a temporary 307 rather than a permanent canonical-host redirect.
- Sitemap timestamps for static and use-case routes use the build time, creating artificial freshness on every deployment.
- The 144 noindex model/use-case variants are excluded from the sitemap, but use self-referencing canonicals and are heavily linked from the public template network.
- Root metadata emits an unsupported aggregate rating and count through `SoftwareApplication` structured data on every route.
- Generic use-case pages emit repetitive FAQ schema even though the answers are template-derived.
- Blog templates emit Article, Breadcrumb, FAQ, and sometimes HowTo schema; the underlying evidence and eligibility have not been validated.
- One live guide contains a malformed internal link ending in `/keyword`, producing a 404.

## Initial trust, legal, and content risks

- The homepage and About page claim unverified years of experience, prompt counts, audience size, model coverage, testing, update cadence, and editorial review.
- The privacy policy claims zero retention, third-party non-training guarantees, GPC support, anonymized telemetry behavior, and a data-protection process that are not established by the implementation.
- The image-upload data flow is not described with sufficient clarity before upload.
- The homepage claims deterministic results, unsupported hallucination reduction, AI-detector bypass, LSI/keyword-density behavior, and “publish-ready” SEO output.
- The tools directory contains unsupported rankings and ratings, potentially stale prices, and ambiguous affiliate disclosure.
- Legacy “PromptMaster AI” branding remains in repository instructions, automation identities, content, and memory files.

## Performance and UX baseline risks

- The generator is isolated behind a lazy component, but global client components still include theme, consent, analytics tracking, header behavior, and scroll tracking.
- Article pages include multiple client-only engagement and advertising components.
- The home page ships a very long pseudo-technical guide beneath the interactive tool.
- Theme initialization occurs after hydration and currently fails the React hooks lint rule, creating flash/layout-risk concerns.
- Many components use hard-coded dark colors even though a light theme is advertised.
- No automated mobile, theme, keyboard, screen-reader, overflow, console, or Core Web Vitals regression coverage exists.

## Security baseline risks

- The direct Next.js version is affected by current published advisories according to npm audit.
- The CSP permits both `unsafe-inline` and `unsafe-eval` for scripts.
- The image API uses an in-memory, instance-local IP rate limiter, which is not a reliable distributed production limit.
- Image validation checks declared MIME type and size but not file signatures or dimensions.
- Image failures are logged server-side and converted into misleading successful fallback responses.

## Initial architecture risks

1. Unreviewed automated publishing can continuously reintroduce policy and trust failures.
2. The indexable corpus is much larger than the stale project documentation and lacks per-URL editorial evidence.
3. Trust/legal copy is disconnected from real code behavior.
4. Site-wide false structured data contaminates every public page.
5. The 144-page noindex template network adds build, crawl, maintenance, and internal-link cost without a demonstrated user need.
6. Monetization components are more mature than the quality, consent, and testing systems they depend on.
7. No automated quality gate prevents bad content, broken links, metadata errors, theme regressions, or policy-risk claims from reaching production.

## Data limitations at baseline

- Search Console, GA4, and AdSense authenticated properties have not yet been inspected in this baseline.
- No URL will be deleted or redirected solely from local/crawl evidence.
- Traffic, indexing history, engagement, and the exact AdSense rejection classification remain pending read-only authenticated inspection.
