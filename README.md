# VAR for Messages

VAR for Messages is a mobile-first React app that turns an ordinary chat message into an absurdly serious football-style VAR ruling.

**Live app:** https://varformessages.com/

## Current status

The current application-behavior baseline is:

```text
ec34dc87febd9e46751238456870f861b3b45a74
```

The v0.1 product flow is:

```text
create → reviewing → verdict → share or download
```

The app currently supports:

- Serbian and English;
- required message + optional player name;
- 140-character message / 24-character player-name limits;
- deterministic category suggestions with manual override;
- 6 incident categories;
- 52 curated verdict bundles (26 SR + 26 EN);
- same-locale/same-category safe fallbacks;
- short `scan → lock → reveal` review sequence;
- red and yellow verdict cards;
- exact `1080 × 1350` PNG export;
- native PNG sharing where supported;
- download fallback;
- preflight Instagram/TikTok in-app-browser handoff in known embedded-browser environments;
- reduced-motion behavior;
- client-side verdict generation with no message backend;
- bilingual Privacy / Terms / no-affiliation / contact surfaces;
- public third-party notices;
- privacy-minimized Umami Cloud Europe event analytics;
- optional locale-specific Tally feedback links.

## Privacy / analytics

Message text, player names, verdict wording, case IDs, generated images, recipients/share destinations and feedback answers are not sent to VAR analytics.

The current Umami integration uses a strict fixed event/property allowlist, respects Do Not Track, removes recruitment query parameters after parsing, uses no `identify()`/persistent VAR user identity, and safely becomes a no-op when blocked by privacy tools. Brave/adblock/DNT users may therefore be intentionally undercounted without affecting product behavior.

Public project/privacy contact: `hello@varformessages.com`.

## Stack

- React 19
- React DOM 19
- TypeScript 6
- Vite 8
- Vitest
- ESLint
- plain feature-scoped CSS
- Fontsource (Barlow Condensed + Inter)
- `html-to-image`
- Vercel
- GitHub Actions
- Umami Cloud Europe

## Development

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Run the full quality gate:

```bash
npm run check
```

Individual commands:

```bash
npm run lint
npm run test:run
npm run build
```

Current compatibility gate: **17 test files / 253 tests PASS**, plus lint, TypeScript/Vite build, `git diff --check`, GitHub Actions, live production privacy-payload QA and physical Android Instagram-IAB → external-browser → Share/Download QA.

## Source structure

```text
src/
  app/
  content/
    sr/
    en/
  features/
    analytics/
    browser-compat/
    category-suggestion/
    creator/
    export/
    legal/
    review-sequence/
    verdict/
  shared/
```

## v0.1 scope exclusions

The current pilot intentionally has no:

- user account/history backend;
- uploaded screenshots or OCR;
- user-facing generative AI;
- payments, ads, sponsorship or affiliate monetization;
- appeal/counter-verdict flow;
- public gallery/feed;
- animated export.

Commercial monetization remains blocked pending the project’s separate professional legal/accounting/payment/privacy/trademark gate.

## Deployment

`main` deploys to Vercel through Git integration.

GitHub Actions runs lint, tests and the production build for pull requests and pushes to `main`.

The historical `v0.1.0` tag remains immutable at `7df4af4efb4a5c9f575d55c5896f2ec6ed2f2618`. The `v0.1.1` compatibility release formalizes the social in-app-browser handoff. The last code-changing application-behavior baseline is `ec34dc87febd9e46751238456870f861b3b45a74`; later release/documentation-only commits may move `main` without changing that application behavior.