# VAR for Messages — Release QA v0.1

**Status:** Closed for current free remote hybrid pilot
**Reconciled through:** 26 August 2026
**Historical immutable tag:** `v0.1.0` → `7df4af4efb4a5c9f575d55c5896f2ec6ed2f2618`
**Last code-changing application-behavior baseline:** `ec34dc87febd9e46751238456870f861b3b45a74`
**Production:** `https://varformessages.com/`
**Repository:** `aleksandar-todorovic-dev/var-for-messages` — private
**Package/app version:** `0.1.1`

---

# 1. Release decision

The current production build is technically cleared for the free remote hybrid pilot.

No critical runtime, export, responsive, accessibility or content-render defect is open. The reproduced Instagram Android in-app-browser Share/Download dead-end is closed by the v0.1.1 external-browser handoff and has passed physical production QA.

A physical iPhone Safari test was not available and is recorded as an accepted non-blocking closed-pilot compatibility risk.

Do not interpret this QA pass as product validation.

---

# 2. Source / deployment integrity

- [x] Last code-changing application-behavior baseline is `ec34dc87febd9e46751238456870f861b3b45a74`.
- [x] GitHub Actions CI completed successfully for that baseline.
- [x] Vercel production deployment for that baseline is `READY`.
- [x] Deployment source is GitHub branch `main`.
- [x] Repository is private.
- [x] Canonical production domain is `https://varformessages.com/`.
- [x] `www` redirects to the apex domain.
- [x] Canonical metadata uses `https://varformessages.com/`.
- [x] `og:url` uses `https://varformessages.com/`.
- [x] Production metadata no longer uses prototype wording.
- [x] Favicon/manifest production metadata exist.
- [x] Production indexing remains `index, follow`.

---

# 3. Local quality gates

Current v0.1.1 compatibility quality gate:

- [x] ESLint passes.
- [x] Vitest passes: **17 test files / 253 tests**.
- [x] TypeScript production build passes.
- [x] Vite production build passes.
- [x] `git diff --check` passes.
- [x] GitHub Actions CI passes for production merge `ec34dc8`.

Historical release evidence remains useful: the earlier release-completion gate had 9 test files / 48 tests; PR #1 behavioral hardening later reached 9 files / 77 tests; the privacy/readiness gate reached 14 files / 115 tests; and the 22 August creator-guidance gate reached 15 files / 236 tests. The 17-file / 253-test gate above supersedes those counts as the active total.

---

# 4. Functional flow

- [x] SR creator flow.
- [x] EN creator flow.
- [x] Language switch.
- [x] Message validation.
- [x] Optional player name.
- [x] High-confidence category suggestion.
- [x] Manual category selection.
- [x] Category override.
- [x] `create → reviewing → verdict`.
- [x] Edit incident.
- [x] Review another.
- [x] Share action path.
- [x] Download action path.
- [x] Unsupported Share download fallback.
- [x] Share cancellation returns safely.
- [x] Export retry/failure state remains recoverable.
- [x] Known Instagram/TikTok in-app browsers receive a preflight external-browser handoff before message entry.
- [x] Known-IAB verdict edge keeps the verdict visible while replacing Share/Download with the compatibility handoff.
- [x] Ordinary browser Share/Download behavior remains unchanged.

---

# 5. Verdict selection / content runtime

- [x] Six technical categories remain stable.
- [x] Historical baseline: original 18 SR + 18 EN bundles.
- [x] Current content contract: **26 variants per locale / 52 total** (`5/5/4/4/4/4` by category), including same-category safe fallbacks.
- [x] Language System v0.5 is the current content authority.
- [x] Trigger routing sanity checks pass.
- [x] Status-too-soon trigger cleanup preserved.
- [x] EN dead-phone trigger includes `my phone died`.
- [x] Unmatched manual choices use the explicit same-locale/same-category safe fallback.
- [x] Trigger-specific selection does not invent unsupported context for unmatched input.
- [x] Current verdict-selection regression tests cover specific routing, routing-only cues and all safe category fallbacks.

---

# 6. Comprehensive Chrome release QA evidence

QA artifact:

```text
release-qa-2026-08-12.zip
```

Harness environment:

```text
Google Chrome 151.0.7922.137
local production-style Vite preview
```

Final harness result:

```text
pass: true
failures: []
runtimeEvents: []
```

Covered:

- [x] SR end-to-end.
- [x] EN end-to-end.
- [x] review scan/lock/reveal flow.
- [x] edit flow.
- [x] review-another flow.
- [x] category interactions.
- [x] keyboard focus checkpoints.
- [x] reduced motion.
- [x] 200% real browser zoom.
- [x] responsive widths.
- [x] bundle-matrix rendering.
- [x] exact-size export stage.
- [x] metadata/canonical checks.

The QA ZIP is external evidence and should remain outside the source repository.

---

# 7. Content render / readability evidence

- [x] Historical original 36-bundle lock: all 36 unique cards rendered and visually inspected.
- [x] Historical pre-behavioral-hardening A→B→C→A cycle produced 48 matrix entries across categories/locales; this is render evidence, not the current unmatched-fallback selection contract.
- [x] Automated layout inspection reported no bundle failures.
- [x] No required text zone was empty.
- [x] No clipping/overflow failure was recorded.
- [x] Visible card and hidden export composition were both inspected.
- [x] Historical 36-bundle contact sheet generated.
- [x] Behavioral-hardening content contract validates 52 current production bundles (26/locale).
- [x] 16 new + 2 changed bundle items passed focused legal/content delta review.
- [ ] A separate new 52-card screenshot contact sheet was not rerun; accepted as non-blocking because the added variants are bounded same-card-template fallbacks/splits and current behavior/responsive gates are green.
- [x] Current content is not reopened for taste-only rewriting.

---

# 8. Responsive layout

Automated widths:

- [x] 320px.
- [x] 375px.
- [x] 390px.
- [x] 430px.
- [x] 1440px desktop.

At each automated responsive checkpoint:

- [x] Creator has no horizontal overflow.
- [x] Verdict has no horizontal overflow.
- [x] Card retains intended composition.

Manual desktop sanity also passed during product development and final review.

---

# 9. Long-input / exact export stress

Generated release-QA exports:

- [x] SR red short.
- [x] SR yellow long — 140-character message + long player name.
- [x] EN red short.
- [x] EN yellow long — 140-character message + long player name.

For all representative stress exports:

- [x] Valid PNG.
- [x] Exact `1080 × 1350`.
- [x] Message remains readable.
- [x] Player-name metadata remains usable.
- [x] Decision/explanation/penalty fit the fixed artifact.
- [x] Card height does not grow.

---

# 10. Keyboard accessibility

- [x] Keyboard-only creator flow.
- [x] Locale control reachable.
- [x] Message field reachable.
- [x] Category radio group reachable.
- [x] Arrow-key category change usable.
- [x] Player-name field reachable.
- [x] Submit reachable.
- [x] Verdict focus transition usable.
- [x] Share/Download/Edit/Review another reachable.
- [x] Focus-visible styles present.
- [x] Category radio focus-loss defect identified during QA.
- [x] CategoryPicker patch merged.
- [x] Keyboard-driven category change now preserves picker/focus.
- [x] Pointer selection retains compact behavior.

Current fix uses:

```text
event.currentTarget.matches(':focus-visible')
```

to decide whether to preserve the expanded picker.

---

# 11. Reduced motion

- [x] `prefers-reduced-motion: reduce` tested.
- [x] Review remains complete.
- [x] Motion collapses to near-static timing.
- [x] No required information depends on animation.

Recorded QA motion values were effectively reduced to minimal durations.

---

# 12. 200% zoom

- [x] Real browser zoom configured to 2.0.
- [x] Creator usable.
- [x] Verdict usable.
- [x] Responsive reflow occurs.
- [x] No horizontal overflow recorded.
- [x] No critical content loss.

---

# 13. Browser / device coverage

## Desktop Chromium / Chrome

- [x] Comprehensive automated QA.
- [x] Manual product-development sanity.
- [x] Download/export path.

## Desktop Firefox

- [x] Final manual SR sanity.
- [x] Final manual EN sanity.
- [x] Cards/layout appear normal.
- [x] No observed horizontal overflow or blocking behavior.

## Android Chrome — physical device

- [x] Production HTTPS loads.
- [x] Creator flow works.
- [x] Verdict works.
- [x] Native PNG file Share opens system share sheet.
- [x] Cancelling native Share returns safely.
- [x] Sent PNG remains readable.

## Instagram Android in-app browser — physical device / production

- [x] Profile link opens the production site inside Instagram's embedded browser.
- [x] Instagram UA is classified as the known Instagram IAB.
- [x] Creator form is withheld before private message entry.
- [x] Localized Instagram-specific handoff is shown.
- [x] Instagram menu → external browser opens the same production site in the device browser.
- [x] Compatibility warning disappears in the ordinary external browser.
- [x] Creator → verdict flow works after handoff.
- [x] Native Share works after handoff.
- [x] PNG Download works after handoff.
- [x] A generated result was successfully sent back through Instagram during owner QA.
- [x] No raw UA telemetry, new analytics field, new storage key, redirect service or cross-browser draft transfer was introduced.

Application-behavior baseline: `ec34dc87febd9e46751238456870f861b3b45a74`.

TikTok detector/unit/headless coverage is included in v0.1.1, but physical TikTok profile-link IAB QA remains pending because the new account does not yet expose a clickable Website field.

## WebKit / iPhone profile

Final compatibility sanity:

```text
Playwright 1.62.1
WebKit 26.5
build 2336
iPhone 16 Pro profile
402 × 681 viewport
DPR 3
touch enabled
target: https://varformessages.com/
```

Results:

- [x] Production load without runtime/page errors.
- [x] No horizontal overflow.
- [x] SR creator → category → review → verdict.
- [x] EN language switch → creator → review → verdict.
- [x] Touch-style category controls.
- [x] 140-character verdict layout.
- [x] Verdict-card readability.
- [x] Browser-side PNG export/download path.
- [x] Generated valid `1080 × 1350` PNG.
- [x] Runtime errors: none.
- [x] Repository files/Git history were not modified by the test.

Native iPhone Web Share was intentionally **not** claimed as tested.

## Physical iPhone Safari

- [ ] Not available.

Disposition:

> Accepted non-blocking closed-pilot risk. WebKit/iPhone-profile compatibility passed, but this does not replace a physical Safari test. Close before broad public promotion when a device becomes available.

---

# 14. Grayscale / non-color severity

Representative red and yellow exported cards were inspected in grayscale.

- [x] `CRVENI KARTON` / `ŽUTI KARTON` text remains explicit.
- [x] Severity marker remains visible.
- [x] Decision Line remains visible.
- [x] Card hierarchy remains understandable without relying on hue.

Color is not the sole severity signal.

---

# 15. Metadata and production URL

- [x] `<title>` = VAR for Messages.
- [x] Description is production-oriented.
- [x] Canonical = `https://varformessages.com/`.
- [x] `og:title` present.
- [x] `og:type` present.
- [x] `og:url` = `https://varformessages.com/`.
- [x] Serbian/English locale metadata present.
- [x] Site currently allows indexing.

---

# 16. Analytics / privacy / legal readiness

## Current implementation

- [x] Bilingual Privacy Notice and Terms/AUP live.
- [x] Operator/controller shown: Aleksandar Todorović, Serbia.
- [x] Privacy/project contact: `hello@varformessages.com`.
- [x] Independent/no-affiliation disclosure live.
- [x] Exact creator private/sensitive-content note live in SR/EN.
- [x] Locale-specific SR/EN Tally feedback links live.
- [x] Public `/third-party-notices.txt` reachable; repository `THIRD_PARTY_NOTICES.md` present.
- [x] Locale auto-detection remains non-persistent; explicit SR/EN choice persists.

## Umami integration

- [x] Umami Cloud Europe site configured (`ad1093ae-a95d-4145-8e8c-b709a7db329d`).
- [x] Strict allowlisted event/property schema.
- [x] No `identify()` / persistent VAR user ID.
- [x] No analytics cookies introduced by current setup.
- [x] No replay / heatmaps / performance monitoring.
- [x] Search/query/hash excluded; strict recruitment source allowlist.
- [x] DNT respected.
- [x] Bounded memory-only pre-load queue; tracker delay/block does not block app.
- [x] Per-verdict event-class dedup in memory.
- [x] `category_suggested` / `category_overridden` denominator limited to high-confidence successful verdict lifecycle.
- [x] No arbitrary/free-text properties.

Approved events:

```text
landing_viewed
verdict_generated
share_completed
download_clicked
review_another_clicked
category_suggested
category_overridden
share_failed
```

## PR #3 quality gate

- [x] `npm run check` PASS.
- [x] ESLint PASS.
- [x] 14 test files / 115 tests PASS.
- [x] TypeScript + Vite production build PASS.
- [x] `git diff --check` PASS.
- [x] GitHub Actions PASS.
- [x] Vercel production deployment for `3076c1a10a116a6593aa65f36dfe6609617880f8` READY.

## Live production analytics/privacy QA — 19 August 2026

- [x] `?src=benchmark` sanitized to `/`.
- [x] Brave Shields blocked Umami script; product continued normally.
- [x] With tracker allowed for QA, `landing_viewed` arrived in Umami Realtime.
- [x] `verdict_generated` arrived.
- [x] `review_another_clicked` arrived.
- [x] Umami `/api/send` requests returned `200`.
- [x] Sentinel message `DO_NOT_LEAK_MESSAGE_82917` absent from network payload.
- [x] Sentinel player `DO_NOT_LEAK_PLAYER_47261` absent from network payload.
- [x] Inspected verdict payload contained only website ID, path `/`, event name, locale and fixed category.
- [x] Known blocker/DNT undercount accepted; no bypass/proxy planned.

## v0.1.1 social-IAB privacy/compatibility delta — 26 August 2026

- [x] Detection reads the browser user-agent locally only to classify `instagram | tiktok | null`.
- [x] Classification is not persisted.
- [x] Raw user-agent is not added to VAR analytics events/properties.
- [x] No new cookie, localStorage key, provider, SDK, backend, redirect service or user identifier.
- [x] Message/player-name client-side privacy contract is unchanged.
- [x] Public Privacy Notice / Terms require no wording change for this bounded compatibility correction.
- [x] No production runtime dependency was added; third-party license bodies are unchanged.

## Legal / operational

- [x] Vercel Hobby confirmed.
- [x] Vercel `Improve models with my data` = OFF.
- [x] Cloudflare web path remains DNS-only.
- [x] Runtime/transitive license audit closed with no blocker.
- [x] LIA for current limited pilot analytics completed and passed 19 August 2026.

These gates are closed for the current free remote pilot. Reopen only for regression or material scope/data-flow change.

# 17. Known accepted risks / non-blockers

## Physical iPhone Safari

Not tested due to device unavailability.

Accepted for closed pilot.

## English-first naturalness

The EN library is content-locked and technically/render validated, but separate English-first/native-naturalness evidence remains desirable before EN is a primary promoted language.

Not a blocker for the current remote hybrid pilot; EN evidence should still be interpreted separately before primary EN promotion.

## Product hypothesis

Not validated.

QA proves the software behaves as intended; it does not prove people will want to send the result.

---


## Analytics undercount from privacy tools

Brave Shields, DNT and other tracker/ad blockers may intentionally suppress Umami. This is not a product defect. The app remains usable and the project will not bypass those protections. Pilot analytics must be interpreted as measured-user behavior, not a complete visitor census.

# 18. Release/version disposition

Historical tag:

```text
v0.1.0
```

remains immutable.

The historical `v0.1.0` tag remains immutable. The bounded, reproduced social in-app-browser compatibility blocker justifies the `v0.1.1` patch release.

Current package/app version is `0.1.1`.

The last code-changing application-behavior baseline is `ec34dc87febd9e46751238456870f861b3b45a74`. Release/documentation-only reconciliation commits may move `main` without changing that behavior baseline.

Use a later patch release only for another bounded evidence-based correction if needed.

---

# 19. Final QA verdict

```text
CURRENT FREE REMOTE PILOT BUILD
= PASS
```

Pilot code baseline:

pilot code baseline = 3076c1a10a116a6593aa65f36dfe6609617880f8
package/app = 0.1.0
historical tag v0.1.0 remains at 7df4af4efb4a5c9f575d55c5896f2ec6ed2f2618

Closed gates: release integrity, behavioral QA, post-verdict visual hierarchy, pre-pilot legal/privacy/analytics implementation, runtime licenses and live production payload privacy QA.

Remaining accepted limitations are explicit: physical iPhone Safari has no real-device pass, analytics can undercount blocker/DNT users, English naturalness remains a real-user validation question, and the product hypothesis/sendability is still unvalidated.

The next action is **real remote pilot evidence**, not another general QA/polish cycle.