# Advertising Readiness Boundary

Last updated: 2026-07-17

Ads are disabled. This repository does not claim that the site or an account is eligible, accepted, or production-ready for advertising.

## Current implementation

- `READINESS.adsEnabled` is false.
- `components/Ads/AdSenseScript.tsx` and `components/Ads/AdUnit.tsx` are inert centralized boundaries.
- No placement wrappers, reserved advertising gaps, publisher script, slot IDs, or public publisher identifier are shipped.
- Analytics remains separate from advertising and loads only after explicit analytics consent.
- The privacy and cookies pages describe the current disabled state and consent controls.

## Future enablement gate

Do not enable advertising by adding an environment value or editing a route. A future change needs its own reviewed implementation covering:

1. Current account and publisher-policy status checked in the relevant dashboard.
2. Current official integration requirements and consent obligations.
3. A placement plan reviewed for deceptive adjacency, density, mobile usability, and layout shift.
4. Strict publisher-ID and slot validation with no implementation placeholders shown to visitors.
5. Consent withdrawal, regional behavior, privacy disclosure, and cookie cleanup verified in a real browser.
6. Production console, network, security-header, accessibility, and performance checks.
7. A separate release decision after manual editorial and legal review.

Historical placement ideas in old audit evidence are not implementation instructions. Current status and remaining external checks belong in `docs/adsense-rebuild/FINAL_READINESS_REPORT.md` and `docs/adsense-rebuild/MANUAL_EXTERNAL_STEPS.md`.

