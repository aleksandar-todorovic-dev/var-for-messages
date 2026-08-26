import type { Locale } from '../shared/types/domain'
import type { UiCopy } from './content-types'

export const srUiCopy = {
  languageLabel: 'Jezik',
  creatorKicker: 'VAR za poruke',
  demoLabel: 'Primer presude',
  newIncidentLabel: 'Novi incident',
  formHeadline: 'Pošalji poruku na pregled.',

  headline: 'Poruka ide na VAR proveru.',
  supportingText: 'Ubaci poruku. Dobij presudu. Pošalji je igraču.',
  heroCta: 'Pošalji na VAR',

  messageLabel: 'Poruka za proveru',
  messagePlaceholder: 'Evo me za pet minuta.',
  messageExamples: {
    control: 'Treba ti ideja? Pogledaj primere',
    sets: [
      [
        'Krećem sad.',
        'K.',
        'Nisam video poruku.',
        'Ti biraj.',
        'Gde ovo vodi?',
      ],
      [
        'Samo što nisam.',
        'Okej.',
        'Telefon mi se ugasio.',
        'Kako hoćeš.',
        'Ko ti je ona?',
      ],
      [
        'Stižem.',
        'Mhm.',
        'Nisam imao signal.',
        'Ništa od toga.',
        'Jesmo mi zajedno?',
      ],
    ],
    note: 'Primeri, ne kompletna lista.',
  },
  playerNameLabel: 'Ime igrača — opciono',

  privacyNote:
    'Poruka i ime ostaju u tvom browseru. Ne unosi osetljive ili privatne podatke i koristi samo sadržaj koji smeš da koristiš i deliš.',

  reviewButton: 'Pregledaj incident',

  suggestionPrefix: 'VAR sumnja na:',
  selectedIncidentPrefix: 'Izabran incident:',
  changeIncident: 'Promeni incident',
  hideIncidents: 'Sakrij incidente',
  categoryPrompt: 'Šta VAR treba da pregleda?',
  lowSuggestionGuidance:
    'Potvrdi ili izaberi drugi incident.',
  noClearSuggestionGuidance:
    'VAR nije siguran koji je incident. Izaberi ga ručno — poruka i dalje može na pregled.',

  reviewingStatuses: [
    'Pregled poruke…',
    'Provera incidenta…',
    'Konačna odluka',
  ],

  socialInAppBrowser: {
    creator: {
      kicker: 'PROVERA BROWSERA',
      heading: 'Otvori VAR u svom browseru.',
      body:
        'Instagram/TikTok pregledač može da blokira deljenje i preuzimanje VAR presude. Otvori ovu stranicu u svom browseru pre nego što uneseš poruku.',
    },
    verdict: {
      kicker: 'PROVERA BROWSERA',
      heading: 'Otvori VAR u svom browseru.',
      body:
        'Ovaj pregledač ne podržava pouzdano deljenje ili preuzimanje. Otvori VAR u svom browseru i napravi presudu tamo. Ova presuda se neće automatski preneti.',
    },
    instructions: {
      instagram:
        'U Instagramu otvori meni ⋯ i izaberi opciju „Otvori u spoljnom pregledaču“.',
      tiktok:
        'U TikToku otvori meni pregledača (⋯ ili Share) i izaberi opciju za otvaranje stranice u svom browseru.',
    },
    address: 'varformessages.com',
  },

  share: 'Podeli presudu',
  download: 'Preuzmi PNG',
  edit: 'Izmeni incident',
  reviewAnother: 'Nova provera',

  actionStatus: {
    preparing: 'Pripremam PNG za deljenje…',
    sharing: 'Otvaram sistemsko deljenje…',
    shared: 'Presuda je predata sistemskom meniju za deljenje.',
    cancelled: 'Deljenje je otkazano.',
    fallbackDownloaded:
      'Ovaj browser ne podržava deljenje PNG fajla. Presuda je preuzeta.',
    downloaded: 'PNG presuda je preuzeta.',
    retry: 'Pokušaj ponovo',
  },

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
  creatorKicker: 'VAR for messages',
  demoLabel: 'Example ruling',
  newIncidentLabel: 'New incident',
  formHeadline: 'Send the message for review.',

  headline: 'Put the message under review.',
  supportingText:
    'Drop in a message. Get the ruling. Send it back to the player.',
  heroCta: 'Send to VAR',

  messageLabel: 'Message under review',
  messagePlaceholder: 'I’ll be there in five minutes.',
  messageExamples: {
    control: 'Need an idea? See examples',
    sets: [
      [
        'Leaving now.',
        'Okay.',
        "Didn't see your message.",
        'You choose.',
        'Where is this going?',
      ],
      [
        'Almost there.',
        'Sure.',
        'My phone died.',
        'Whatever you want.',
        'Who is she?',
      ],
      [
        'Be there soon.',
        'Mhm.',
        'Had no signal.',
        'None of those.',
        'Are we together?',
      ],
    ],
    note: 'Examples, not a complete list.',
  },
  playerNameLabel: 'Player name — optional',

  privacyNote:
    'Your message and player name stay in your browser. Don’t enter sensitive or private information, and only use content you’re allowed to use and share.',

  reviewButton: 'Review incident',

  suggestionPrefix: 'VAR suspects:',
  selectedIncidentPrefix: 'Selected incident:',
  changeIncident: 'Change incident',
  hideIncidents: 'Hide incidents',
  categoryPrompt: 'What should VAR review?',
  lowSuggestionGuidance:
    'Confirm it or choose another incident.',
  noClearSuggestionGuidance:
    "VAR isn't sure which incident this is. Choose it manually — the message can still be reviewed.",

  reviewingStatuses: [
    'Reviewing message…',
    'Checking incident…',
    'Final decision',
  ],

  socialInAppBrowser: {
    creator: {
      kicker: 'BROWSER CHECK',
      heading: 'Open VAR in your browser.',
      body:
        "Instagram/TikTok's in-app browser may block sharing or downloading your VAR verdict. Open this page in your browser before entering a message.",
    },
    verdict: {
      kicker: 'BROWSER CHECK',
      heading: 'Open VAR in your browser.',
      body:
        "Share/Download isn't reliable in this in-app browser. Open VAR in your browser and create the verdict there. This verdict won't transfer automatically.",
    },
    instructions: {
      instagram:
        "Open Instagram's browser menu and choose the option to open the page in your external browser.",
      tiktok:
        "Open TikTok's browser menu (⋯ or Share) and choose the option to open the page in your browser.",
    },
    address: 'varformessages.com',
  },

  share: 'Share ruling',
  download: 'Download PNG',
  edit: 'Edit incident',
  reviewAnother: 'Review another',

  actionStatus: {
    preparing: 'Preparing the PNG for sharing…',
    sharing: 'Opening system sharing…',
    shared: 'The ruling was handed to the system share menu.',
    cancelled: 'Sharing was cancelled.',
    fallbackDownloaded:
      'This browser cannot share the PNG file. The ruling was downloaded instead.',
    downloaded: 'The PNG ruling was downloaded.',
    retry: 'Try again',
  },

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
