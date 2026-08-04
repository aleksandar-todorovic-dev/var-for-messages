# VAR for Messages

VAR for Messages is a mobile-first React prototype that turns an ordinary message into a humorous football-style VAR ruling.

This repository currently contains the clean development foundation for the first product prototype.

## Current status

Prototype setup.

The project currently includes:

* React
* TypeScript
* Vite
* ESLint
* Git
* a minimal application shell
* an initial feature-oriented source structure

Final UI, verdict-card design, and product behavior are not implemented yet.

## Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Planned source structure

```text
src/
  app/
    App.tsx
    app-state.ts
  content/
    sr/
    en/
  features/
    creator/
    category-suggestion/
    review-sequence/
    verdict/
    export/
    analytics/
  shared/
    components/
    types/
    utils/
    styles/
```

Folders are added to Git when they contain actual implementation files. Empty placeholder files are intentionally avoided.

## Initial scope

The first implementation will focus on:

* Serbian and English support
* message input
* optional player name
* deterministic category suggestion
* manual category selection
* short review state
* curated verdict generation
* share and PNG export

The following are outside the initial setup:

* backend
* user accounts
* analytics implementation
* deployment
* payments
* screenshot upload
* OCR
* final branding
* final visual design

## Privacy direction

The initial product is intended to remain client-side. Raw message text and player names should not be sent to analytics or remote storage.

## Repository status

This repository is currently at the clean project-foundation stage.
