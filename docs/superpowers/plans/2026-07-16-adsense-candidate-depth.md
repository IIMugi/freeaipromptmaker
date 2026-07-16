# AdSense Deployment-Candidate Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish six additional source-verified guides, quarantine every uncertain legacy body, strengthen verified topic architecture, and complete a clean local merge candidate without enabling ads or external writes.

**Architecture:** Keep all evidence-backed guide routes, but split rendering at the editorial-policy boundary: verified records receive the article template while all other records receive a static `noindex,follow` quarantine shell that never renders MDX. Promote six Search Console-prioritized guides only after complete body replacement and registry/ledger alignment; derive hub, related links, schema, sitemap, and indexability from the registry.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, MDX/gray-matter, Tailwind CSS 4, Vitest, Testing Library, Playwright, Lighthouse 13, PowerShell/npm.

---

## File responsibility map

- `app/blog/[slug]/page.tsx`: verified article renderer and early quarantine-shell branch; no inferred claims.
- `lib/blog.ts`: filesystem parsing and verified-only related-guide selection.
- `data/editorial-status.json`: sole guide publication state, source list, verification date, and documented version snapshot.
- `posts/*.mdx`: rewritten, evidence-bounded guide bodies.
- `app/blog/page.tsx` and `components/Blog/BlogIndexClient.tsx`: concise verified hub with factual calls to action.
- `docs/adsense-rebuild/CONTENT_DECISIONS.csv`: decision-to-editorial implementation state.
- `docs/adsense-rebuild/URL_INVENTORY.csv`: final route/indexability/sitemap/evidence facts.
- `tests/unit/blog-content.test.ts`: verified-corpus truth and provenance contract.
- `tests/unit/content-decisions.test.ts`: ledger/registry count and state alignment.
- `tests/unit/sitemap.test.ts`: exact verified sitemap membership.
- `tests/e2e/publisher-pages.spec.ts`: rendered quarantine and verified evidence behavior.

### Task 1: Quarantine uncertain guide bodies

**Files:**
- Modify: `tests/e2e/publisher-pages.spec.ts`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `components/Blog/BlogIndexClient.tsx`

- [ ] **Step 1: Write the failing browser contract**

Change the needs-review test to visit `2026-02-13-best-stable-diffusion-extensions` before it is promoted and assert the old body sentinel `Transform Your AI Art with the Right Extensions` is absent. Also assert no `article[type]` JSON-LD, image, TOC, takeaways, share controls, or generated pros/cons are visible; the H1 and `This earlier guide body is withheld` notice remain visible. Add assertions that hub copy does not contain `production-ready`, `better images`, `output quality`, or `fewer iterations`.

- [ ] **Step 2: Run the focused browser test and confirm failure**

Run: `npm run test:e2e -- tests/e2e/publisher-pages.spec.ts`

Expected: FAIL because the legacy MDX sentinel and article furniture currently render.

- [ ] **Step 3: Implement the early quarantine branch**

In `BlogPostPage`, calculate the policy immediately after loading the post. When `policy.index` is false, return a static page containing breadcrumbs, the original title, editorial status, the exact bounded notice, a verified-hub link, and verified related cards. Do not compute or render MDX, image, TOC, takeaways, pros/cons, source metadata, schema, share controls, or article CTA in this branch. Set quarantined metadata description to `This preserved guide URL is withheld from publication while its claims, sources, and current tool version are reviewed.`

Delete `PROS_CONS_BY_TOPIC`, `guessProsConsCategory`, and every inferred fallback. Verified pages use only `post.pros ?? []` and `post.cons ?? []`.

Replace hub metadata and CTA copy with factual text: `Source-checked prompt and tool references with explicit version and limitation notes.` and `Format a prompt locally, then copy it into the tool you choose.`

- [ ] **Step 4: Re-run focused tests and typecheck**

Run: `npm run test:e2e -- tests/e2e/publisher-pages.spec.ts && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 5: Commit the quarantine architecture**

```bash
git add app/blog components/Blog tests/e2e/publisher-pages.spec.ts
git commit -m "fix: quarantine unverified guide bodies"
```

### Task 2: Strengthen verified-corpus acceptance tests

**Files:**
- Modify: `tests/unit/blog-content.test.ts`
- Modify: `tests/unit/content-decisions.test.ts`
- Modify: `tests/unit/sitemap.test.ts`

- [ ] **Step 1: Write failing registry and body tests**

Add the exact six promotion slugs. Assert registry counts are `verified: 7`, `needs-review: 246`, and total `253`. For every verified record require ISO `lastVerified`, non-empty `testedVersion`, at least two HTTPS sources, and that each source URL appears verbatim in the MDX. Reject these verified-body patterns case-insensitively: `in my experience`, `I've found`, `what works for me`, `guaranteed`, `best results`, `perfect`, `game.?changer`, price/cost assertions, star ratings, audience counts, and claims that independent image tests were run. Require the phrase `No independent image-generation comparison was performed for this guide.` in each newly promoted body.

Update the sitemap test to expect the seven exact guide URLs sorted by the existing date order. Extend the ledger test to assert 422 rows and exactly seven `IMPLEMENTED_VERIFIED` guide rows after promotion.

- [ ] **Step 2: Run tests and confirm they fail before registry promotion**

Run: `npm test -- tests/unit/blog-content.test.ts tests/unit/content-decisions.test.ts tests/unit/sitemap.test.ts`

Expected: FAIL with one verified record and one verified sitemap guide.

- [ ] **Step 3: Keep tests red while content is rewritten**

Do not weaken phrase or provenance rules to accommodate legacy prose. The tests become green only after Tasks 3–5 replace content, registry, and ledgers.

### Task 3: Rewrite the Stable Diffusion workflow cluster

**Files:**
- Modify: `posts/2026-01-04-stable-diffusion-regional-prompting-guide.mdx`
- Modify: `posts/2026-01-25-stable-diffusion-wildcards-guide.mdx`
- Modify: `posts/2026-02-13-best-stable-diffusion-extensions.mdx`

- [ ] **Step 1: Replace the Regional Prompter guide**

Use the exact scope and source snapshot from the design. Include: verification boundary; `BREAK`, base prompt, divide-ratio, rows/columns, and 2D-region semantics; a three-region text worksheet; an input-to-region table; compatibility limitations for A1111/Forge/reForge/LoRA modes; a one-variable troubleshooting sequence; links to the verified negative-prompts, wildcards, and extensions guides. Sources:

- `https://github.com/hako-mikan/sd-webui-regional-prompter`
- `https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1`

- [ ] **Step 2: Replace the Dynamic Prompts wildcards guide**

Include: `{a|b}` variants; `__name__` wildcard files; nested paths; weighted choices; expansion-count arithmetic; a deterministic folder example; a four-row syntax/failure table; warning that combinatorial mode expands work; one-variable debugging; verified cluster links. Sources:

- `https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md`
- `https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/tutorial.md`
- `https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1`

- [ ] **Step 3: Replace the extensions guide**

Retitle it as a safety-first selection guide rather than a “best” ranking. Include: arbitrary-code warning; built-in Available tab versus repository URL; provenance/maintenance/license/release checklist; minimal-stack matrix for regional prompts, wildcard templating, and no-extension cases; pin/backup/rollback sequence; remote-access restriction and explicit warning against routine `--enable-insecure-extension-access`; no quality ranking. Sources:

- `https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Extensions`
- `https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Developing-extensions`
- `https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1`

- [ ] **Step 4: Run the verified-body scan on the three rewritten files**

Run: `rg -n -i "in my experience|i.ve found|what works for me|guarante|perfect|game.?changer|\$[0-9]|[0-9](\.[0-9])?\s*stars" posts/2026-01-04-stable-diffusion-regional-prompting-guide.mdx posts/2026-01-25-stable-diffusion-wildcards-guide.mdx posts/2026-02-13-best-stable-diffusion-extensions.mdx`

Expected: no matches.

### Task 4: Rewrite the Leonardo and Midjourney cluster

**Files:**
- Modify: `posts/2026-02-09-master-leonardo-ai-models.mdx`
- Modify: `posts/2026-02-22-master-leonardo-ai-negative-prompts.mdx`
- Modify: `posts/2025-11-27-midjourney-v6-complete-prompt-guide.mdx`

- [ ] **Step 1: Replace the Leonardo models guide**

Retitle it as a current model-selection reference. Include the 2026 interface path; automatic versus explicit selection; Fast/Ultra as documented modes without cost claims; a task-to-model table covering Leonardo Lucid Origin, Lucid Realism, Phoenix 1.0 and selected catalog providers only as documented; settings-vary-by-model caveat; a prompt-control worksheet; link to the Leonardo negative-prompt guide. Sources:

- `https://intercom.help/leonardo-ai/en/articles/8942360-how-to-generate-images-with-leonardo-ai`
- `https://docs.leonardo.ai/me/docs/list-of-models`
- `https://leonardo.ai/news/ai-image-models`

- [ ] **Step 2: Replace the Leonardo negative-prompts guide**

Include: current input location boundary; terms rather than `no`/`without`; unwanted-element diagnosis table; one-variable sequence across negative prompt, model, aspect ratio, style, and Canvas; small category lists explicitly labeled starting hypotheses; warning that negative prompts do not guarantee removal; link to the model-selection guide. Sources:

- `https://intercom.help/leonardo-ai/en/articles/8067671-prompting-tips-tricks`
- `https://intercom.help/leonardo-ai/en/articles/8942360-how-to-generate-images-with-leonardo-ai`
- `https://intercom.help/leonardo-ai/en/articles/8093145-how-to-use-canvas-editor-tool`

- [ ] **Step 3: Replace the Midjourney V6 guide**

Retitle it `Midjourney V6.1 Parameter Reference (Legacy Model)`. State on the first screen that V8.1 is current and V6.1 is legacy. Include `--v 6.1`, prompt-versus-parameter separation, a compatibility table limited to parameters confirmed in official docs, a migration checklist that removes unsupported carryover, and a reproducible parameter-placement example. Do not present V8.1 parameter ranges as V6.1 behavior. Sources:

- `https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version`
- `https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List`

- [ ] **Step 4: Run the verified-body scan on the three rewritten files**

Run the same prohibited-phrase scan from Task 3 against these three paths.

Expected: no matches.

### Task 5: Promote the six guides and align public architecture

**Files:**
- Modify: `data/editorial-status.json`
- Modify: `docs/adsense-rebuild/CONTENT_DECISIONS.csv`
- Modify: `docs/adsense-rebuild/URL_INVENTORY.csv`
- Modify: `components/Blog/BlogIndexClient.tsx`
- Test: `tests/unit/blog-content.test.ts`
- Test: `tests/unit/content-decisions.test.ts`
- Test: `tests/unit/sitemap.test.ts`

- [ ] **Step 1: Update the editorial registry exactly**

Set the six records to `verified`, `lastVerified: "2026-07-16"`, the exact version strings from the design, and the source arrays used in the bodies. Preserve all 247 other records unchanged, including the existing verified guide and redirect-source record.

- [ ] **Step 2: Update only the six decision rows**

In `CONTENT_DECISIONS.csv`, change the six guide rows to `IMPLEMENTED_VERIFIED`; update rationale to name the verification date, documented snapshot, unique worksheet/table value, and no-hands-on boundary. Do not alter primary decisions, destinations, or GSC/GA metrics.

In `URL_INVENTORY.csv`, update the six rows to indexable/self-canonical/200/in-sitemap, `IMPLEMENTED_VERIFIED`, and evidence/usefulness fields consistent with the rewritten body. Do not change connected-data metrics.

- [ ] **Step 3: Make hub clusters explicit and factual**

Add a small `Verified topics` section derived from the verified post categories/counts. Use descriptive labels only; no ratings, superlatives, audience claims, or outcome promises. Preserve search/filter accessibility.

- [ ] **Step 4: Run focused unit tests**

Run: `npm test -- tests/unit/blog-content.test.ts tests/unit/content-decisions.test.ts tests/unit/sitemap.test.ts tests/unit/editorial.test.ts`

Expected: PASS with 7 verified, 246 needs-review, 253 registry rows, 422 decisions, and seven guide sitemap entries.

- [ ] **Step 5: Run build and browser checks**

Run: `npm run build && npm run test:e2e -- tests/e2e/publisher-pages.spec.ts tests/e2e/accessibility.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit the verified publisher cluster**

```bash
git add posts data/editorial-status.json docs/adsense-rebuild/CONTENT_DECISIONS.csv docs/adsense-rebuild/URL_INVENTORY.csv components/Blog tests
git commit -m "content: publish six source-verified guide references"
```

### Task 6: Adversarial safety, visual, and performance remediation

**Files:**
- Modify only files implicated by evidence-backed findings.
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/console-network.spec.ts`
- Modify: `tests/e2e/themes-and-navigation.spec.ts`

- [ ] **Step 1: Resolve every Critical/Important audit finding**

For each finding, first add or tighten a focused regression test, run it red, implement the smallest fix, and rerun it green. Search dangerous residue with:

`rg -n -i "aggregate.?rating|ratingValue|ratingCount|humaniz|in my experience|i.ve found|what works for me|git push|schedule:|adsbygoogle|doubleclick|ad placeholder|degraded.?true|fallbackResult|zero retention|guaranteed" --glob '!posts/**' --glob '!docs/adsense-rebuild/AUDIT.md' .`

Delete unused harmful code rather than documenting a local exception. Preserve audit/history documents and unrelated user work.

- [ ] **Step 2: Re-run security/privacy focused tests**

Run: `npm test -- tests/unit/image-upload.test.ts tests/unit/image-api.test.ts tests/unit/analytics.test.ts tests/unit/security-headers.test.ts tests/components/consent.test.tsx tests/components/ads-disabled.test.tsx`

Expected: PASS. Confirm no analytics event type accepts prompt text, image data, filename, free text, or URL payload.

- [ ] **Step 3: Run production visual/interaction QA**

Run the Playwright suite at 375, 768, 820, and 1280 widths in light/dark themes. Cover homepage, generator, image analysis, blog hub, verified guide, quarantine route, legal pages, tools, redirects, 404, and 410. Check focus order, skip link, Escape, reduced motion, contrast, overflow, names, loading/error/retry/copy states, console errors, failed first-party requests, analytics-decline requests, and ad-origin absence. Add screenshots only for findings/report evidence.

- [ ] **Step 4: Optimize honest LCP and run Lighthouse**

Use a production server. Run Lighthouse mobile three times each for `/` and `/blog/2025-11-29-stable-diffusion-negative-prompts-guide`. Record per-run artifacts and medians for Performance, A11y, Best Practices, SEO, FCP, LCP, TBT, CLS, and transfer. Keep changes only when they preserve generator readiness, visible content, SEO/A11y 100, and CLS 0.

- [ ] **Step 5: Commit evidence-backed remediation**

Commit coherent code/test batches with descriptive messages; do not combine unrelated fixes.

### Task 7: Final gate, reports, outputs, and local merge

**Files:**
- Modify: `docs/adsense-rebuild/IMPLEMENTATION_LOG.md`
- Modify: `docs/adsense-rebuild/MANUAL_EXTERNAL_STEPS.md`
- Modify: `docs/adsense-rebuild/FINAL_READINESS_REPORT.md`
- Copy deliverables to the authorized outputs directory.

- [ ] **Step 1: Run the feature-branch clean gate**

Run in order and require exit 0:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
npm run audit:routes
npm audit
```

- [ ] **Step 2: Update exact reports and manual steps**

Record before/after guide counts, route/sitemap counts, all test totals, Lighthouse medians, security/privacy evidence, remaining human evidence, external-only actions, and an honest AdSense go/no-go. Include exactly: `Search ranking, indexing, traffic, and AdSense approval cannot be guaranteed.`

- [ ] **Step 3: Commit reports and copy user-facing deliverables**

Commit the report updates. Copy final reports, CSVs, performance summary/artifacts, and a concise handoff index to `C:\Users\aly0s\Documents\Codex\2026-07-16\begin-now-first-inspect-git-status\outputs`.

- [ ] **Step 4: Run final review and merge locally**

Use the required code-review and finishing-branch workflows. After approval, merge `feature/adsense-readiness-rebuild` into local `main` without push or deploy. Preserve all commits.

- [ ] **Step 5: Re-run the complete gate on merged main**

Run the same eight commands from Step 1 in the main worktree. Fix and commit any merge-result failure, then confirm both worktrees are clean and main contains the feature history.
