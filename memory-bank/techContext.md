# Technical Context

Last refreshed: 2026-07-17

## Runtime

- Next.js 16.2.10, React 19.2.7, TypeScript 5, Tailwind CSS 4.
- Node package lock and `npm ci` are the reproducibility boundary.
- Static MDX-like markdown posts are parsed with gray-matter and rendered through React Markdown.
- Sharp 0.34.5 performs server-side image decoding and inspection.
- Google GenAI is used only by the image-to-prompt endpoint and explicitly invoked draft tools.

## Commands

```text
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
npm run audit:routes
npm audit
```

## Draft tools

`npm run daily-content` and `npm run generate-post` are manual draft commands. They require `CONTENT_DRAFT_OUTPUT`, may write only that selected artifact, and do not update the registry, planner, history, posts, Git state, or deployments. The associated Actions jobs are manual, read-only, and upload an unpublished artifact for review.

## Environment boundaries

- `NEXT_PUBLIC_SITE_URL`: canonical site origin, with the production origin as the default.
- `NEXT_PUBLIC_GA4_ID`: optional, strictly validated analytics measurement ID; analytics still requires consent.
- Gemini keys: server-side only. Never expose them through `NEXT_PUBLIC_` names or client bundles.
- Advertising configuration is intentionally absent from the readiness runtime.

## Documentation source order

1. Current repository code and tests.
2. `docs/adsense-rebuild/FINAL_READINESS_REPORT.md` and supporting CSVs.
3. This memory bank.
4. Dated audit/design/implementation documents as historical evidence only.
