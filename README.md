# VAR for Messages

VAR for Messages is a mobile-first React app that turns an ordinary chat
message into an absurdly serious football-style VAR ruling.

**Live app:** https://varformessages.com/

## Current status

The v0.1 MVP flow is implemented:

```text
create → review → verdict → share or download
```

The app currently supports:

- Serbian and English;
- a required message and optional player name;
- deterministic category suggestions;
- manual category override;
- 6 incident categories;
- 46 curated SR/EN verdict bundles;
- a short `scan → lock → reveal` review sequence;
- red and yellow verdict cards;
- exact `1080 × 1350` PNG export;
- native PNG sharing where the browser supports it;
- download fallback;
- reduced-motion behavior;
- client-side generation with no backend.

## Privacy

Raw message text, player names, case IDs, verdict copy, and generated images are
not sent to analytics or remote storage.

The analytics layer is currently a typed no-op adapter. It records nothing
until a provider is selected and privacy-reviewed.

## Stack

- React 19
- TypeScript 6
- Vite 8
- Vitest
- plain CSS
- Fontsource
- `html-to-image`
- Vercel

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

## Source structure

```text
src/
  app/
  content/
    sr/
    en/
  features/
    analytics/
    category-suggestion/
    creator/
    export/
    review-sequence/
    verdict/
  shared/
```

## v0.1 scope exclusions

The MVP intentionally has no:

- backend or database;
- accounts or history;
- uploaded screenshots or OCR;
- generative AI;
- payments;
- appeal flow;
- public gallery;
- animated export.

## Deployment

`main` deploys to Vercel through Git integration.

GitHub Actions runs lint, tests, and the production build for pull requests and
pushes to `main`.
