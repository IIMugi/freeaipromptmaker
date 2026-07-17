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
- Completed the four-width/two-theme browser matrix, fixed the remaining blog overflow and quarantine landmark defects, and passed all 51 browser tests.
- Recorded three-run mobile Lighthouse medians for the homepage and a verified guide.
- Passed the ordered feature-branch clean-install gate: 103 unit/component tests, 426-page build, zero route-audit issues, and zero dependency findings.

## Remaining local work

- Commit and copy the final reports, CSVs, route audit, QA matrix, and Lighthouse summary to the task output directory.
- Review the final diff, merge locally to `main`, and repeat the ordered clean-install gate there.

## Operating rules

- Use current primary documentation for time-sensitive libraries and provider behavior.
- Run browser tests after user-visible changes.
- Keep unverified content quarantined.
- Do not claim external account state or guaranteed outcomes.
