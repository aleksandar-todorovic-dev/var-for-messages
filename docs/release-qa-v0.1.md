# VAR for Messages — Release QA v0.1

**Status:** Release-candidate checklist  
**Production:** https://var-for-messages.vercel.app/

## Verified

- [x] Lint passes.
- [x] Automated tests pass.
- [x] Production build passes.
- [x] Vercel production deployment is ready.
- [x] Production URL returns successfully over HTTPS.
- [x] No Vercel runtime errors were present during the deployment check.
- [x] SR creator flow works.
- [x] Category suggestion and manual override work.
- [x] `create → reviewing → verdict` works.
- [x] Red and yellow verdicts render.
- [x] PNG export is exactly `1080 × 1350`.
- [x] Desktop download works.
- [x] Desktop Share fallback downloads the PNG.
- [x] Android native file Share opens the system share sheet.
- [x] Android Share cancellation returns safely to the verdict.
- [x] Shared PNG remains readable after sending.
- [x] No raw user content exists in typed analytics payloads.

## Re-check after this QA patch is deployed

- [ ] Favicon appears.
- [ ] Metadata no longer contains `prototype`.
- [ ] Mobile creator demo is readable without horizontal overflow.
- [ ] SR and EN complete flow still work.
- [ ] 320px, 375px, 390px, and 430px layouts have no horizontal scroll.
- [ ] 140-character message remains readable.
- [ ] 24-character player name remains readable.
- [ ] Keyboard-only flow remains usable.
- [ ] Reduced-motion flow remains static and complete.
- [ ] GitHub Actions CI passes on the merge commit.

## Useful final cross-device checks

- [ ] Android Chrome.
- [ ] iPhone Safari, when available.
- [ ] Desktop Chromium.
- [ ] Desktop Firefox.
- [ ] 200% browser zoom.
- [ ] Grayscale recognition of red versus yellow through text and marker shape.

## Non-blocking open decisions

- Final product name and custom domain.
- Final analytics provider and launch thresholds.
- Optional social-preview image.
- Future `no_card / overturned` severity.
- Future launch channels.

## Release rule

Do not add new product scope during QA.

A change belongs in this phase only when it fixes:

- a reproducible defect;
- accessibility;
- export reliability;
- browser compatibility;
- incorrect metadata;
- deployment or CI;
- a clearly observed mobile readability problem.
