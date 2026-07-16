# Free AI Prompt Maker AdSense Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Next.js site into a truthful, static-first, accessible prompt product with verified indexability rules, safe tool behavior, and no known repository-level AdSense low-value-content risks.

**Architecture:** Keep Next.js App Router and isolate client-side product tools from static publisher pages. Centralize site facts, editorial state, URL decisions, schema, consent, and analytics contracts so route behavior is derived and testable. Ship the readiness build with advertising disabled, unverified generated guides quarantined from Search, and high-equity URLs preserved.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Vitest, Testing Library, Playwright, `@axe-core/playwright`, npm, Vercel-compatible routing.

**Primary references:** [Next.js testing guide](https://nextjs.org/docs/app/guides/testing), [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [Playwright accessibility testing](https://playwright.dev/docs/next/accessibility-testing).

---

## File responsibility map

- `lib/site.ts`: public site name, origin, supported claims, social links, and readiness flags.
- `lib/editorial.ts`: editorial-state types, frontmatter parsing, indexability, sitemap, and hub eligibility.
- `lib/seo.ts`: canonical URL and page-specific JSON-LD builders.
- `lib/analytics.ts`: allow-listed, privacy-safe product event contract.
- `lib/image-upload.ts`: image signature and size validation independent of the route handler.
- `lib/blog.ts`: filesystem loading plus editorial fields; no invented dates or fallback authorship.
- `data/editorial-status.json`: explicit per-guide state and verification metadata.
- `data/redirects.ts`: one-hop permanent redirects and removal paths.
- `components/Layout/*`: semantic global shell with responsive navigation and no no-op form.
- `components/Generator/*`: truthful local prompt formatting and accessible copy/history flows.
- `components/ImageToPrompt/*`: honest upload, unavailable, provider-error, success, and copy states.
- `components/Consent/*`: analytics-only consent boundary for the readiness build.
- `components/Ads/*`: disabled readiness boundary; no script, slot, or placeholder rendering.
- `app/*`: static-first pages, metadata, schema, sitemap, robots, redirects, and route composition.
- `tests/unit/*`: pure functions, route contracts, schema, content state, analytics, upload validation.
- `tests/components/*`: theme, consent, generator, upload, header, and footer behavior.
- `tests/e2e/*`: real browser workflows, accessibility, breakpoints, themes, redirects, and console/network checks.

## Wave 1 — Quality foundation and harmful-pipeline freeze

### Task 1: Add deterministic unit, component, and browser test infrastructure

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/smoke.test.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Install the test dependencies**

Run:

```bash
npm install --save-dev vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright
npx playwright install chromium
```

Expected: dependencies and Chromium install successfully; the lockfile changes.

- [ ] **Step 2: Add scripts and test configuration**

Add these scripts to `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:all": "npm run lint && npx tsc --noEmit && npm test && npm run build && npm run test:e2e"
}
```

Create `vitest.config.ts`:

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/components/**/*.test.tsx'],
    restoreMocks: true,
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'work/playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:3200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3200',
    url: 'http://127.0.0.1:3200',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

Ignore `test-results/`, `work/playwright-report/`, and `playwright/.cache/`.

- [ ] **Step 3: Write and run failing smoke tests**

Create `tests/unit/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('runs TypeScript tests', () => expect(2 + 2).toBe(4));
});
```

Create `tests/e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('homepage exposes one main landmark and generator heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /prompt/i }).first()).toBeVisible();
});
```

Run `npm test`; expected: unit smoke passes. Run `npm run test:e2e`; expected: the current homepage test passes or fails only on the explicit semantic assertion to be fixed in later tasks.

- [ ] **Step 4: Commit the quality foundation**

```bash
git add package.json package-lock.json vitest.config.ts playwright.config.ts tests .gitignore
git commit -m "test: add unit and browser quality gates"
```

### Task 2: Freeze automated publishing and encode the prohibition

**Files:**
- Modify: `.github/workflows/daily-content.yml`
- Modify: `.github/workflows/auto-blogger.yml`
- Modify: `scripts/content-manager.js`
- Modify: `scripts/generate-post.js`
- Create: `tests/unit/content-pipeline.test.ts`

- [ ] **Step 1: Write the pipeline regression test**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('content publishing safety', () => {
  it('has no scheduled workflow that pushes generated content', () => {
    const workflows = ['daily-content.yml', 'auto-blogger.yml'].map((name) =>
      fs.readFileSync(path.join(root, '.github/workflows', name), 'utf8'),
    );
    for (const workflow of workflows) {
      expect(workflow).not.toMatch(/schedule:/);
      expect(workflow).not.toMatch(/git push/);
    }
  });

  it('does not instruct a model to invent human experience', () => {
    const scripts = ['content-manager.js', 'generate-post.js']
      .map((name) => fs.readFileSync(path.join(root, 'scripts', name), 'utf8'))
      .join('\n');
    expect(scripts).not.toMatch(/in my experience|i.ve found|what works for me/i);
    expect(scripts).not.toMatch(/indistinguishable from.*human/i);
  });
});
```

- [ ] **Step 2: Run the test and confirm the current pipeline fails**

Run `npm test -- tests/unit/content-pipeline.test.ts`.

Expected: failures show scheduled triggers, direct pushes, or deceptive humanization language.

- [ ] **Step 3: Convert workflows to manual draft-only checks**

Replace workflow triggers with `workflow_dispatch`, remove write permissions and push steps, and end each workflow after generating a local artifact for review. Change scripts so they can write a draft only when `CONTENT_DRAFT_OUTPUT` is an explicit path and never run Git commands.

The exported script result must be:

```js
export function assertDraftMode() {
  const output = process.env.CONTENT_DRAFT_OUTPUT;
  if (!output) throw new Error('CONTENT_DRAFT_OUTPUT is required; publishing is disabled.');
  return output;
}
```

- [ ] **Step 4: Re-run the pipeline test**

Expected: both tests pass and `rg -n "git push|schedule:|In my experience|I've found" .github scripts` returns no publishing/deception match.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows scripts tests/unit/content-pipeline.test.ts
git commit -m "fix: stop automated direct content publishing"
```

## Wave 2 — Truth, editorial state, URLs, and technical SEO

### Task 3: Centralize truthful site facts and readiness flags

**Files:**
- Create: `lib/site.ts`
- Create: `tests/unit/site.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/opengraph-image.tsx`
- Modify: `app/twitter-image.tsx`

- [ ] **Step 1: Write the site-facts contract test**

```ts
import { describe, expect, it } from 'vitest';
import { SITE, READINESS } from '@/lib/site';

describe('site facts', () => {
  it('contains only supported publisher facts', () => {
    expect(SITE.origin).toBe('https://freeaipromptmaker.com');
    expect(SITE.social.github).toBe('https://github.com/IIMugi/freeaipromptmaker');
    expect(JSON.stringify(SITE)).not.toMatch(/100,?000|50,?000|4\.9|2847|since 2022/i);
  });

  it('ships readiness advertising disabled', () => {
    expect(READINESS.adsEnabled).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `lib/site.ts`**

```ts
export const SITE = {
  name: 'Free AI Prompt Maker',
  origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com',
  description: 'Build and copy structured prompts for supported image-generation tools.',
  social: { github: 'https://github.com/IIMugi/freeaipromptmaker' },
} as const;

export const READINESS = {
  adsEnabled: false,
  imageAnalysisConfigured: Boolean(process.env.GEMINI_API_KEY),
} as const;
```

Use these values in root metadata and social images. Remove unsupported Twitter identity, keywords stuffing, aggregate rating, Offer, broken logo, and AdSense preconnect from `app/layout.tsx`.

- [ ] **Step 3: Run tests, typecheck, and commit**

Run `npm test -- tests/unit/site.test.ts` and `npx tsc --noEmit`; expected: pass.

```bash
git add lib/site.ts app/layout.tsx app/opengraph-image.tsx app/twitter-image.tsx tests/unit/site.test.ts
git commit -m "refactor: centralize supported site facts"
```

### Task 4: Add editorial state and quarantine unverified guides

**Files:**
- Create: `lib/editorial.ts`
- Create: `data/editorial-status.json`
- Modify: `lib/blog.ts`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `components/Blog/BlogIndexClient.tsx`
- Modify: `components/Blog/RelatedPosts.tsx`
- Create: `tests/unit/editorial.test.ts`
- Create: `tests/unit/blog-content.test.ts`

- [ ] **Step 1: Write editorial-state tests**

```ts
import { describe, expect, it } from 'vitest';
import { getEditorialPolicy } from '@/lib/editorial';

describe('editorial policy', () => {
  it('indexes only verified content', () => {
    expect(getEditorialPolicy('verified')).toEqual({ index: true, inSitemap: true, inHub: true });
    expect(getEditorialPolicy('needs-review')).toEqual({ index: false, inSitemap: false, inHub: false });
    expect(getEditorialPolicy('archived')).toEqual({ index: false, inSitemap: false, inHub: false });
  });
});
```

Add a corpus test that every guide has an explicit status entry, no verified guide contains fabricated experience phrases, and no verified guide defaults its date to `new Date()`.

- [ ] **Step 2: Implement the state contract**

```ts
export type EditorialState = 'verified' | 'needs-review' | 'archived';

export type EditorialRecord = {
  state: EditorialState;
  lastVerified?: string;
  testedVersion?: string;
  sources?: string[];
};

export function getEditorialPolicy(state: EditorialState) {
  const visible = state === 'verified';
  return { index: visible, inSitemap: visible, inHub: visible } as const;
}
```

Populate `data/editorial-status.json` with all 253 slugs. Default generated/unreviewed articles to `needs-review`. Mark no article `verified` until its body and metadata pass the corpus test during Task 11.

- [ ] **Step 3: Make route metadata and hubs derive from editorial state**

Extend `BlogPost`/`BlogPostMeta` with `editorialState`, `lastVerified`, `testedVersion`, and `sources`. `getAllPosts({ hubOnly: true })` returns verified guides only. Article metadata returns `robots: { index: false, follow: true }` for non-verified content and renders a visible review/archive notice without ads.

- [ ] **Step 4: Run tests and commit**

Run `npm test -- tests/unit/editorial.test.ts tests/unit/blog-content.test.ts`; expected: pass with all slugs covered.

```bash
git add lib/editorial.ts lib/blog.ts data/editorial-status.json app/blog components/Blog tests/unit/editorial.test.ts tests/unit/blog-content.test.ts
git commit -m "feat: derive guide visibility from editorial state"
```

### Task 5: Centralize canonicals, structured data, sitemap, redirects, and removals

**Files:**
- Create: `lib/seo.ts`
- Create: `data/redirects.ts`
- Modify: `next.config.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `components/Seo/BreadcrumbsJSON.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/prompt-generator-for/[useCase]/page.tsx`
- Modify: `app/[model]/prompt-generator-for/[useCase]/page.tsx`
- Create: `app/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword/route.ts`
- Create: `tests/unit/seo.test.ts`
- Create: `tests/unit/sitemap.test.ts`
- Create: `tests/unit/redirects.test.ts`

- [ ] **Step 1: Write failing URL/schema tests**

```ts
import { describe, expect, it } from 'vitest';
import { canonicalUrl, websiteJsonLd } from '@/lib/seo';
import { permanentRedirects } from '@/data/redirects';

describe('SEO contracts', () => {
  it('builds canonical URLs without duplicate slashes', () => {
    expect(canonicalUrl('/blog/example')).toBe('https://freeaipromptmaker.com/blog/example');
  });

  it('never emits unsupported ratings or offers', () => {
    const json = JSON.stringify(websiteJsonLd());
    expect(json).not.toMatch(/AggregateRating|ratingValue|ratingCount|Offer/);
  });

  it('uses one-hop related redirects', () => {
    expect(permanentRedirects).toContainEqual({ source: '/flux-pro', destination: '/prompt-generators' });
    expect(new Set(permanentRedirects.map((item) => item.source)).size).toBe(permanentRedirects.length);
  });
});
```

- [ ] **Step 2: Implement canonical/schema helpers and route mapping**

```ts
import { SITE } from '@/lib/site';

export function canonicalUrl(pathname = '/') {
  return new URL(pathname, `${SITE.origin}/`).toString();
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
  } as const;
}
```

```ts
export const permanentRedirects = [
  { source: '/flux-pro', destination: '/prompt-generators' },
  {
    source: '/blog/2025-11-27-stable-diffusion-negative-prompts-guide',
    destination: '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  },
] as const;
```

Return status 410 from the accidental keyword route. Generate sitemap entries only for verified guides and useful static/generic use-case routes, using `lastVerified` or a known source date instead of build time. Remove generic FAQ/HowTo/review schema.

- [ ] **Step 3: Run tests and commit**

Run `npm test -- tests/unit/seo.test.ts tests/unit/sitemap.test.ts tests/unit/redirects.test.ts`; expected: pass.

```bash
git add lib/seo.ts data/redirects.ts next.config.ts app/sitemap.ts app/robots.ts app/blog app/prompt-generator-for app/[model] components/Seo tests/unit
git commit -m "fix: centralize truthful SEO and URL handling"
```

### Task 6: Remove advertising from the readiness build and simplify consent

**Files:**
- Modify: `components/Ads/AdUnit.tsx`
- Modify: `components/Ads/AdSenseScript.tsx`
- Modify: `components/Ads/index.ts`
- Modify: `components/Blog/DynamicAdInjector.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `lib/consent.ts`
- Modify: `components/Consent/ConsentGate.tsx`
- Modify: `components/Consent/CookieConsent.tsx`
- Create: `tests/components/consent.test.tsx`
- Create: `tests/components/ads-disabled.test.tsx`

- [ ] **Step 1: Write failing readiness tests**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdUnit } from '@/components/Ads/AdUnit';

describe('readiness advertising', () => {
  it('renders no script, slot, label, or placeholder', () => {
    const { container } = render(<AdUnit slot="test" />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/advert/i)).not.toBeInTheDocument();
  });
});
```

Consent tests must prove decline is the default, analytics children render only after explicit analytics acceptance, withdrawal is available, and the banner never claims certified CMP or personalized ads.

- [ ] **Step 2: Implement the disabled ad boundary**

`AdUnit` and `AdSenseScript` return `null` while `READINESS.adsEnabled` is false. Remove every article ad wrapper so no spacing or label remains. Keep the files as the single future integration boundary rather than scattering environment checks.

Use this consent type:

```ts
export type ConsentState = 'unset' | 'analytics-accepted' | 'declined';
export const CONSENT_KEY = 'site-consent-v2';
export const CONSENT_EVENT = 'site-consent-change';
```

- [ ] **Step 3: Run tests and commit**

Run `npm test -- tests/components/consent.test.tsx tests/components/ads-disabled.test.tsx`; expected: pass.

```bash
git add components/Ads components/Blog/DynamicAdInjector.tsx components/Consent app/layout.tsx app/blog/[slug]/page.tsx lib/consent.ts tests/components
git commit -m "fix: disable ads and make consent truthful"
```

## Wave 3 — Product safety and measurement

### Task 7: Fail image analysis closed with typed validation

**Files:**
- Create: `lib/image-upload.ts`
- Modify: `app/api/image-to-prompt/route.ts`
- Modify: `components/ImageToPrompt/ImageReverseEngineer.tsx`
- Modify: `app/image-to-prompt/page.tsx`
- Create: `tests/unit/image-upload.test.ts`
- Create: `tests/unit/image-api.test.ts`
- Create: `tests/components/image-reverse-engineer.test.tsx`

- [ ] **Step 1: Write validation and API contract tests**

```ts
import { describe, expect, it } from 'vitest';
import { detectImageType } from '@/lib/image-upload';

describe('image signatures', () => {
  it('detects PNG bytes independent of the declared MIME type', () => {
    expect(detectImageType(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('image/png');
  });

  it('rejects arbitrary bytes', () => {
    expect(detectImageType(new TextEncoder().encode('not-an-image'))).toBeNull();
  });
});
```

Route tests must assert: missing key returns 503 `{ code: 'analysis_unavailable' }`; invalid signature returns 400; provider failure returns 502; invalid provider JSON returns 502; success returns only normalized provider output. No response may contain `degraded: true` or filename-derived prompt data.

- [ ] **Step 2: Implement byte validation and typed failures**

```ts
export type ImageMime = 'image/png' | 'image/jpeg' | 'image/webp';

export function detectImageType(bytes: Uint8Array): ImageMime | null {
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47].every((value, index) => bytes[index] === value)) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}
```

Delete `createFallbackResult`. Read the uploaded bytes before provider creation, compare the signature with the declared MIME, and return bounded messages without stack traces or environment details.

- [ ] **Step 3: Rebuild the client state machine**

Use `type AnalysisState = 'idle' | 'validating' | 'uploading' | 'success' | 'unavailable' | 'error'`. Preserve the selected file on retry, announce status with `role="status"`, label the file input, and disable copy/share until real success.

- [ ] **Step 4: Run tests and commit**

Run the three focused test files, then `npx tsc --noEmit`; expected: pass.

```bash
git add lib/image-upload.ts app/api/image-to-prompt app/image-to-prompt components/ImageToPrompt tests
git commit -m "fix: stop fabricated image analysis results"
```

### Task 8: Replace open-ended analytics with privacy-safe product events

**Files:**
- Modify: `lib/analytics.ts`
- Modify: `lib/hooks/usePromptBuilder.ts`
- Modify: `components/ImageToPrompt/ImageReverseEngineer.tsx`
- Modify: `components/Analytics/ScrollTracker.tsx`
- Create: `tests/unit/analytics.test.ts`

- [ ] **Step 1: Write the event allow-list test**

```ts
import { describe, expect, it, vi } from 'vitest';
import { trackProductEvent } from '@/lib/analytics';

describe('analytics events', () => {
  it('sends only allow-listed scalar fields', () => {
    const gtag = vi.fn();
    Object.assign(window, { gtag });
    trackProductEvent('prompt_copy_succeeded', { model: 'flux', variant: 'prompt' });
    expect(gtag).toHaveBeenCalledWith('event', 'prompt_copy_succeeded', { model: 'flux', variant: 'prompt' });
  });
});
```

TypeScript must reject arbitrary event names and prompt/image payload fields.

- [ ] **Step 2: Implement the typed contract**

```ts
type ProductEventMap = {
  prompt_generated: { model: string };
  prompt_copy_succeeded: { model: string; variant: 'prompt' | 'with-negative' | 'json' };
  prompt_copy_failed: { model: string; variant: 'prompt' | 'with-negative' | 'json' };
  image_upload_rejected: { reason: 'size' | 'type' | 'signature' };
  image_analysis_succeeded: Record<string, never>;
  image_analysis_failed: { reason: 'unavailable' | 'provider' | 'validation' };
};

export function trackProductEvent<K extends keyof ProductEventMap>(name: K, params: ProductEventMap[K]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
```

Remove noisy scroll-depth custom tracking from the readiness build unless it has a documented decision use.

- [ ] **Step 3: Run tests and commit**

```bash
npm test -- tests/unit/analytics.test.ts
npx tsc --noEmit
git add lib/analytics.ts lib/hooks/usePromptBuilder.ts components/ImageToPrompt components/Analytics tests/unit/analytics.test.ts
git commit -m "refactor: track privacy-safe product outcomes"
```

### Task 9: Remove invented generator scores and preserve useful local behavior

**Files:**
- Modify: `lib/hooks/usePromptBuilder.ts`
- Modify: `components/Generator/LivePreview.tsx`
- Modify: `components/Generator/PromptBuilder.tsx`
- Modify: `lib/prompt-builder.ts`
- Create: `tests/unit/prompt-builder.test.ts`
- Create: `tests/components/prompt-builder.test.tsx`

- [ ] **Step 1: Write prompt syntax and UI tests**

Assert deterministic model syntax, negative-prompt support, copy variants, local history, copy failure, and absence of “Output Confidence,” “Syntax Quality,” “guaranteed,” and percentage scores.

```tsx
expect(screen.queryByText(/output confidence|syntax quality/i)).not.toBeInTheDocument();
expect(screen.getByText(/formatted locally/i)).toBeVisible();
```

- [ ] **Step 2: Remove score computation and expose factual validation**

Delete `outputConfidence`, `syntaxQuality`, and `ScoreCard`. Keep explicit validation such as missing concept or unsupported model parameter. Label the preview “Formatted locally for {model}” and describe it as syntax formatting, not AI inference.

- [ ] **Step 3: Wire typed analytics and accessible copy states**

Track generation once a non-empty prompt exists and copy success/failure without prompt text. Use `aria-live="polite"` for copy result and preserve keyboard history controls.

- [ ] **Step 4: Run tests and commit**

```bash
npm test -- tests/unit/prompt-builder.test.ts tests/components/prompt-builder.test.tsx
git add lib/prompt-builder.ts lib/hooks/usePromptBuilder.ts components/Generator tests
git commit -m "fix: make prompt builder claims factual"
```

## Wave 4 — UI, accessibility, publisher pages, and content remediation

### Task 10: Rebuild theme and global layout foundations

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/ThemeProvider.tsx`
- Modify: `components/Layout/Header.tsx`
- Modify: `components/Layout/Footer.tsx`
- Modify: `components/UI/*`
- Create: `tests/components/theme-provider.test.tsx`
- Create: `tests/components/layout.test.tsx`
- Create: `tests/e2e/themes-and-navigation.spec.ts`

- [ ] **Step 1: Write theme/layout tests**

Component tests assert system default, storage persistence, semantic token application, labeled theme toggle, no newsletter form, skip link, one main landmark, and mobile menu close-on-navigation. Browser tests use 375, 768, 820, and 1280 widths and assert no horizontal overflow.

- [ ] **Step 2: Apply theme before paint**

Add an inline initialization script that reads `theme-preference`, falls back to `matchMedia`, validates `light|dark|system`, and sets `data-theme` before the body paints. Refactor `ThemeProvider` so effects subscribe to changes rather than synchronously initializing state.

- [ ] **Step 3: Rebuild semantic tokens and shell**

Define ground/base/raised/overlay surfaces, primary/secondary/muted text, focus, border, accent, success, warning, and danger tokens for both themes. Add `@media (prefers-reduced-motion: reduce)` that disables nonessential animation and smooth scrolling.

Use compact navigation below `lg`, add `aria-expanded` and `aria-controls`, use a document-level Escape handler, and remove the no-op newsletter/social account claims from the footer.

- [ ] **Step 4: Run tests and commit**

```bash
npm test -- tests/components/theme-provider.test.tsx tests/components/layout.test.tsx
npm run test:e2e -- tests/e2e/themes-and-navigation.spec.ts
git add app/globals.css app/layout.tsx components/ThemeProvider.tsx components/Layout components/UI tests
git commit -m "feat: rebuild accessible responsive site shell"
```

### Task 11: Recompose the homepage around the real generator value

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/Hero/HeroSection.tsx`
- Modify: `components/Seo/HomeFoundationalGuide.tsx`
- Modify: `components/Gallery/PromptGallery.tsx`
- Modify: `components/Gallery/PromptGalleryLazy.tsx`
- Create: `components/Home/HowPromptFormattingWorks.tsx`
- Create: `components/Home/SupportedModels.tsx`
- Create: `components/Home/VerifiedGuides.tsx`
- Create: `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Write homepage browser assertions**

Assert the page has one H1, the generator is visible before curated content, no unsupported number/guarantee/“universally acknowledged” language exists, all form fields have labels, and the primary generate-to-copy workflow works at mobile and desktop sizes.

- [ ] **Step 2: Replace the page composition**

Compose: concise hero, generator, local-formatting explanation, supported model limitations, verified guides only, and trust links. Remove the hidden verification span, unsupported image-analysis promise, latest-post feed, SEO essay, empty community gallery, decorative noise image, and generic “Learn more.”

- [ ] **Step 3: Run tests and commit**

```bash
npm run test:e2e -- tests/e2e/homepage.spec.ts
git add app/page.tsx components/Hero components/Home components/Seo/HomeFoundationalGuide.tsx components/Gallery tests/e2e/homepage.spec.ts
git commit -m "feat: make homepage generator-first and truthful"
```

### Task 12: Rebuild guide, trust, tools, and error templates

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `components/Blog/*`
- Modify: `app/(legal)/about/page.tsx`
- Modify: `app/(legal)/content-standards/page.tsx`
- Modify: `app/(legal)/privacy/page.tsx`
- Modify: `app/(legal)/cookies/page.tsx`
- Modify: `app/(legal)/terms/page.tsx`
- Modify: `app/(legal)/contact/page.tsx`
- Modify: `app/tools/page.tsx`
- Modify: `data/ai-tools.ts`
- Modify: `app/not-found.tsx`
- Modify: `app/error.tsx`
- Create: `tests/unit/trust-copy.test.ts`
- Create: `tests/e2e/publisher-pages.spec.ts`

- [ ] **Step 1: Write trust-copy and browser tests**

Scan rendered/source copy for unsupported audience counts, founding history, quarterly audits, model-testing claims, ratings, deterministic guarantees, affiliate independence, and zero-retention assurances. Browser tests verify article/light-theme H1 contrast, breadcrumb labels, visible review status, source/verified fields, 404 status, and no ad placeholders.

- [ ] **Step 2: Rebuild publisher templates**

Use semantic theme tokens throughout. Verified articles show published/verified/model/source metadata; needs-review articles show a neutral “This guide has not completed the current editorial review” notice and are not linked from the hub. Remove dynamic ad injection and generic schema blocks.

- [ ] **Step 3: Align legal and tools copy with implementation**

State that local prompt formatting stays in the browser, uploaded images are sent to Google only when analysis is configured and invoked, analytics is consent-gated, advertising is disabled in the readiness build, and approval is not guaranteed. Remove unsupported ratings, stale prices, and placeholder affiliate URLs.

- [ ] **Step 4: Run tests and commit**

```bash
npm test -- tests/unit/trust-copy.test.ts
npm run test:e2e -- tests/e2e/publisher-pages.spec.ts
git add app/blog app/'(legal)' app/tools app/not-found.tsx app/error.tsx components/Blog data/ai-tools.ts tests
git commit -m "fix: rebuild trustworthy publisher and legal pages"
```

### Task 13: Transfer the approved merge and verify the retained guide set

**Files:**
- Modify: `posts/2025-11-29-stable-diffusion-negative-prompts-guide.mdx`
- Modify: `posts/2026-02-05-ai-art-reference-guide-inspiration-prompts.mdx`
- Modify: `posts/2025-11-30-ai-art-styles-guide.mdx`
- Modify: `posts/2026-01-04-stable-diffusion-regional-prompting-guide.mdx`
- Modify: `posts/2026-02-16-master-ai-art-lenses-prompts-guide.mdx`
- Modify: `posts/2026-02-24-master-ai-art-weather-time-prompts.mdx`
- Modify: `posts/2026-01-25-stable-diffusion-wildcards-guide.mdx`
- Modify: `posts/2026-02-23-master-ai-art-emotion-prompts.mdx`
- Modify: `posts/2026-05-17-master-sdxl-prompting-guide.mdx`
- Modify: `posts/2026-02-13-best-stable-diffusion-extensions.mdx`
- Modify: `data/editorial-status.json`
- Modify: `docs/adsense-rebuild/CONTENT_DECISIONS.csv`
- Modify: `docs/adsense-rebuild/URL_INVENTORY.csv`
- Create: `tests/unit/content-decisions.test.ts`

- [ ] **Step 1: Write decision-ledger tests**

Parse `CONTENT_DECISIONS.csv` and assert one row per URL, one allowed primary decision, destination for MERGE/REDIRECT, no redirect chains, no indexable needs-review guide, and implementation status matching route behavior.

- [ ] **Step 2: Transfer unique merge material**

Move the weaker page’s supported “negative prompt field” and best-practice material into the leading guide. Remove invented first-person experience, legacy brand references, generic claims, and unsupported examples. Add primary documentation sources and verified metadata only where the source actually supports the statement.

- [ ] **Step 3: Repair the malformed reference guide link**

Replace `[ai art reference](keyword)` with a real relevant internal URL or plain text based on sentence intent; do not create an unrelated redirect.

- [ ] **Step 4: Review high-equity guides in descending GSC order**

For each page with clicks, verify unique intent, factual model/version statements, sources, authorship, full ending, internal links, representative media, and metadata. Mark only completed pages `verified`; leave the rest `needs-review`. Do not bulk lengthen or invent experiments.

- [ ] **Step 5: Regenerate decision evidence and run tests**

Run `npm test -- tests/unit/blog-content.test.ts tests/unit/content-decisions.test.ts`, the internal crawl, and `npm run build`. Update counts and implementation statuses from actual output.

- [ ] **Step 6: Commit content decisions**

```bash
git add posts data/editorial-status.json docs/adsense-rebuild/CONTENT_DECISIONS.csv docs/adsense-rebuild/URL_INVENTORY.csv tests/unit
git commit -m "content: preserve verified guides and quarantine unreviewed corpus"
```

## Wave 5 — Dependency security, full verification, and handoff

### Task 14: Upgrade dependencies and tighten production security

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.ts`
- Modify: `components/ThemeProvider.tsx`
- Modify: `components/Ads/AdUnit.tsx`
- Delete: `scripts/parse_lighthouse.js`
- Modify: `scripts/parse_lighthouse.mjs`
- Create: `tests/unit/security-headers.test.ts`

- [ ] **Step 1: Capture the current advisories and write header tests**

Run `npm audit --omit=dev --json` and save the sanitized summary in the implementation log. Test `nosniff`, frame protection, referrer policy, permissions policy, object-src none, and absence of unused AdSense origins.

- [ ] **Step 2: Upgrade to patched compatible releases**

Run:

```bash
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

Review official Next.js release/upgrade notes before accepting migrations. Do not use a destructive codemod without inspecting its diff.

- [ ] **Step 3: Fix lint and upgrade regressions**

Resolve every lint error and warning in files touched by the rebuild. Remove the duplicate CommonJS Lighthouse parser or convert it to ESM. Tighten CSP by removing Google ad origins while ads are disabled; retain only origins required by configured analytics/image behavior.

- [ ] **Step 4: Run the full non-browser gate and commit**

Run `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm audit --omit=dev`. Expected: lint/type/tests/build pass; production audit has no known fixable high-severity direct dependency issue.

```bash
git add package.json package-lock.json next.config.ts components/ThemeProvider.tsx components/Ads/AdUnit.tsx scripts tests/unit/security-headers.test.ts
git commit -m "chore: patch dependencies and production headers"
```

### Task 15: Run browser, accessibility, crawl, performance, and adversarial verification

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/console-network.spec.ts`
- Create: `scripts/audit-routes.mjs`
- Modify: `docs/adsense-rebuild/IMPLEMENTATION_LOG.md`
- Modify: `docs/adsense-rebuild/MANUAL_EXTERNAL_STEPS.md`
- Modify: `docs/adsense-rebuild/FINAL_READINESS_REPORT.md`

- [ ] **Step 1: Add automated WCAG A/AA scans**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/blog', '/image-to-prompt', '/about', '/privacy']) {
  test(`${route} has no automated WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
```

- [ ] **Step 2: Add console/network and route-crawl gates**

Fail on unexpected console errors, unhandled page errors, first-party 4xx/5xx, missing assets, duplicate canonicals, multiple/missing H1, unsupported rating schema, indexable pages absent from sitemap, and noindex pages present in sitemap. Allow only the documented 410 test URL and deliberate 404 test URL.

- [ ] **Step 3: Run the complete gate**

Run:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
node scripts/audit-routes.mjs
```

Expected: every command exits 0.

- [ ] **Step 4: Run fresh Lighthouse comparisons**

Run mobile Lighthouse three times each for `/` and the leading negative-prompts guide against the production build. Record medians for performance, accessibility, best practices, SEO, FCP, LCP, TBT, CLS, and transfer size. Target lab LCP at or below 2.5 seconds, zero critical console/network errors, and no accessibility/SEO regression. Document field CWV as pending observation rather than claiming improvement.

- [ ] **Step 5: Perform the adversarial review and fix findings**

Review as: AdSense reviewer, technical SEO lead, keyboard/low-vision user, mobile user, security engineer, and skeptical AI-art practitioner. Re-run the relevant focused test after every fix and then rerun the full gate.

- [ ] **Step 6: Complete handoff documentation**

`IMPLEMENTATION_LOG.md` records commits, files, tests, counts, and deviations. `MANUAL_EXTERNAL_STEPS.md` lists deployment, CMP, analytics, Search Console observation, ads.txt reprocessing, and later review-request steps without performing them. `FINAL_READINESS_REPORT.md` includes all required before/after counts, comparisons, remaining human evidence, policy risks, and the explicit statement: “Search ranking, indexing, traffic, and AdSense approval cannot be guaranteed.”

- [ ] **Step 7: Commit verification and reports**

```bash
git add tests/e2e scripts/audit-routes.mjs docs/adsense-rebuild
git commit -m "docs: record final AdSense readiness verification"
```

## Completion rule

Do not deploy, push, change DNS, publish a CMP, change Analytics/AdSense/Search Console settings, request indexing, validate fixes, or request AdSense review. Completion is a locally verified repository plus explicit manual external steps. Any failing gate is work remaining, not a documentation-only exception.
