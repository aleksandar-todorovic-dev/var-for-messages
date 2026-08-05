import type { Locale } from '../shared/types/domain'
import type { UiCopy } from './content-types'

export const srUiCopy = {
  languageLabel: 'Jezik',
  headline: 'Poruka ide na VAR proveru.',
  supportingText: 'Ubaci poruku. Dobij presudu. Pošalji je igraču.',

  messageLabel: 'Poruka za proveru',
  messagePlaceholder: 'Evo me za pet minuta.',
  playerNameLabel: 'Ime igrača — opciono',

  privacyNote:
    'Ne unosi privatne podatke. Poruka ostaje u tvom browseru.',

  reviewButton: 'Pregledaj incident',

  suggestionPrefix: 'VAR sumnja na:',
  changeIncident: 'Promeni incident',
  categoryPrompt: 'Šta VAR treba da pregleda?',

  reviewingStatuses: [
    'Pregled poruke…',
    'Provera incidenta…',
    'Konačna odluka',
  ],

  share: 'Podeli presudu',
  download: 'Preuzmi PNG',
  edit: 'Izmeni incident',
  reviewAnother: 'Nova provera',

  validation: {
    emptyMessage: 'Unesi poruku koju VAR treba da pregleda.',
    messageTooLong: 'Poruka mora imati najviše 140 karaktera.',
    playerNameTooLong: 'Ime igrača mora imati najviše 24 karaktera.',
    missingCategory: 'Izaberi incident koji VAR treba da pregleda.',
  },

  card: {
    reviewLabel: 'VAR PROVERA',
    evidenceLabel: 'DOKAZ A',
    playerLabel: 'IGRAČ',
    reviewCheckLabel: 'PREGLED SNIMKA',
    finalDecisionLabel: 'KONAČNA ODLUKA',
    explanationLabel: 'OBRAZLOŽENJE',
    penaltyLabel: 'KAZNA',
    caseLabel: 'SLUČAJ',
  },

  errors: {
    generation:
      'Pregled nije završen. Poruka je sačuvana — pokušaj ponovo.',
    export: 'PNG trenutno nije napravljen. Pokušaj ponovo.',
    share:
      'Deljenje nije uspelo. Presudu i dalje možeš da preuzmeš.',
  },
} as const satisfies UiCopy

export const enUiCopy = {
  languageLabel: 'Language',
  headline: 'Put the message under review.',
  supportingText:
    'Drop in a message. Get the ruling. Send it back to the player.',

  messageLabel: 'Message under review',
  messagePlaceholder: 'I’ll be there in five minutes.',
  playerNameLabel: 'Player name — optional',

  privacyNote:
    'Avoid private details. Your message stays in your browser.',

  reviewButton: 'Review incident',

  suggestionPrefix: 'VAR suspects:',
  changeIncident: 'Change incident',
  categoryPrompt: 'What should VAR review?',

  reviewingStatuses: [
    'Reviewing message…',
    'Checking incident…',
    'Final decision',
  ],

  share: 'Share ruling',
  download: 'Download PNG',
  edit: 'Edit incident',
  reviewAnother: 'Review another',

  validation: {
    emptyMessage: 'Enter the message VAR should review.',
    messageTooLong: 'Keep the message under 140 characters.',
    playerNameTooLong: 'Keep the player name under 24 characters.',
    missingCategory: 'Choose the incident VAR should review.',
  },

  card: {
    reviewLabel: 'VAR REVIEW',
    evidenceLabel: 'EVIDENCE A',
    playerLabel: 'PLAYER',
    reviewCheckLabel: 'FOOTAGE REVIEW',
    finalDecisionLabel: 'FINAL DECISION',
    explanationLabel: 'EXPLANATION',
    penaltyLabel: 'PENALTY',
    caseLabel: 'CASE',
  },

  errors: {
    generation:
      'The review could not be completed. Your message is still here — try again.',
    export: 'The PNG could not be created. Try again.',
    share:
      'Sharing did not complete. You can still download the ruling.',
  },
} as const satisfies UiCopy

export const uiCopyByLocale: Readonly<Record<Locale, UiCopy>> = {
  sr: srUiCopy,
  en: enUiCopy,
}
