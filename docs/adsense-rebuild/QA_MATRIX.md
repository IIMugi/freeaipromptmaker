# Final local QA matrix

Date: 2026-07-17

Target: Next.js production build at the local loopback origin.

## Responsive and theme matrix

The persistent Playwright matrix visits every route below at 375, 768, 820, and 1280 pixels in both light and dark themes (112 route/viewport/theme visits):

- `/`
- `/image-to-prompt`
- `/blog`
- `/blog/2025-11-29-stable-diffusion-negative-prompts-guide`
- `/blog/2025-11-28-dall-e-3-photorealism-prompt-guide`
- `/prompt-generators`
- `/prompt-generator-for/youtube-thumbnails`
- `/about`
- `/contact`
- `/privacy`
- `/cookies`
- `/terms`
- `/content-standards`
- `/tools`

For every visit the test asserts HTTP 200, the selected persisted theme, exactly one main landmark, exactly one H1, and at most one pixel of document overflow.

Result: **PASS**. The matrix initially found a 96px `/blog` overflow caused by uncontained absolute decoration and a nested main on quarantined guides. Both defects were fixed and the complete matrix reran green.

## Accessibility and interaction

| Check | Coverage | Result |
| --- | --- | --- |
| Automated WCAG A/AA | 11 representative routes, light and dark, axe WCAG 2.0/2.1 A/AA tags | PASS — 0 violations |
| Main landmark | Global main plus explicit prompt hub/use-case and full matrix assertions | PASS |
| H1 structure | Full 14-route responsive matrix | PASS |
| Skip link | First Tab, Enter activation, focus moved to main | PASS |
| Visible focus | Computed focus outline on the keyboard-focused skip link | PASS |
| Mobile navigation | Open by keyboard, Escape dismisses, focus remains on trigger | PASS |
| Theme state | Toggle persistence across reload; explicit light/dark matrix | PASS |
| Reduced motion | Emulated `prefers-reduced-motion: reduce`; animation and transition durations collapse | PASS |
| Control names | Homepage input/textarea/select names plus axe interactive-name checks | PASS |
| Consent states | Allow, reopen settings, withdraw/decline, persisted state | PASS |
| Generator state | Main concept updates preview; copy button becomes usable | PASS |

Automated checks do not substitute for a human screen-reader, low-vision, cognitive-accessibility, or real touch-device session.

## Publisher and URL behavior

| Check | Result |
| --- | --- |
| Verified hub contains only bounded factual copy | PASS |
| Verified guide is indexable and shows evidence/date | PASS |
| `needs-review` body, article schema, images, share/CTA/advantages furniture withheld | PASS |
| Quarantined guide is noindex/follow | PASS |
| Unknown route returns useful 404 | PASS |
| Malformed nested route returns 410 | PASS |
| `/flux-pro` and merged guide source return intended permanent redirects | PASS |
| `www` + legacy path resolves to final apex URL in one hop with query preservation | PASS |

## Console, network, privacy, and security

Representative console/page/first-party network monitoring covers the homepage, blog hub, two verified guides, image-to-prompt, About, Privacy, and Tools.

| Check | Result |
| --- | --- |
| Unexpected console errors | 0 |
| Uncaught page errors | 0 |
| First-party HTTP responses at least 400 on successful routes | 0 |
| Google advertising/measurement requests after decline | 0 |
| Advertising DOM/script markers | 0 |
| Production CSP contains `base-uri`, `form-action`, `frame-ancestors`; excludes `unsafe-eval` | PASS |
| HSTS includes `includeSubDomains` | PASS |

## Consolidated browser result

`npm run test:e2e`: **51 passed** using Chromium against the production build.

