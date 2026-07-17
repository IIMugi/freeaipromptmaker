# Active Context

## Current work

The `feature/adsense-readiness-rebuild` branch is completing a local AdSense readiness rebuild. No deployment, remote publication, account mutation, or advertising enablement is authorized.

## Completed in the rebuild

- Audited the local route/content inventory and connected read-only evidence.
- Quarantined unverified articles and promoted six evidence-backed guides; the original stable-diffusion guide remains verified.
- Added source, quality, rendered-content, route, consent, upload, redirect, security-header, and accessibility regressions.
- Rewrote the verified Stable Diffusion, Leonardo, and Midjourney guide set around bounded claims and primary sources.
- Enforced consent withdrawal and analytics-cookie cleanup.
- Bounded and fully decoded image uploads before provider use.
- Hardened canonical redirects, production CSP, HSTS, and framing protection.
- Replaced generic use-case rankings and fabricated result claims with a factual iteration worksheet.
- Removed unused placement components, injection code, and inferred claims helpers.
- Restricted content tools to explicit unpublished artifacts.

## Remaining local work

- Complete responsive, theme, interaction, console, network, and reduced-motion browser QA.
- Run three mobile Lighthouse measurements for the home page and one verified guide, then record medians.
- Refresh final reports, CSVs, output copies, and manual external steps.
- Run the full clean-install gate, review the final diff, merge locally to `main`, and repeat the gate there.

## Operating rules

- Use current primary documentation for time-sensitive libraries and provider behavior.
- Run browser tests after user-visible changes.
- Keep unverified content quarantined.
- Do not claim external account state or guaranteed outcomes.
