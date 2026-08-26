import type {
  IncidentCategoryId,
  LaunchSeverity,
  Locale,
} from '../shared/types/domain'

export type CategoryDefinition = {
  id: IncidentCategoryId
  locale: Locale
  label: string
  description: string
  example: string
}

export type VerdictVariant = {
  id: string
  locale: Locale
  categoryId: IncidentCategoryId
  severity: LaunchSeverity
  triggerIds?: readonly string[]
  priority?: number
  fallback?: boolean

  reviewLine: string
  sanction: string
  offense: string
  explanation: string
  penalty: string
  caseCode: string
}

export type MessageExampleSet = readonly [
  string,
  string,
  string,
  string,
  string,
]

export type MessageExampleSets = readonly [
  MessageExampleSet,
  MessageExampleSet,
  MessageExampleSet,
]

export type UiCopy = {
  languageLabel: string
  creatorKicker: string
  demoLabel: string
  newIncidentLabel: string
  formHeadline: string

  headline: string
  supportingText: string
  heroCta: string

  messageLabel: string
  messagePlaceholder: string
  messageExamples: {
    control: string
    sets: MessageExampleSets
    note: string
  }
  playerNameLabel: string

  privacyNote: string
  reviewButton: string

  suggestionPrefix: string
  selectedIncidentPrefix: string
  changeIncident: string
  hideIncidents: string
  categoryPrompt: string
  lowSuggestionGuidance: string
  noClearSuggestionGuidance: string

  reviewingStatuses: readonly [string, string, string]

  socialInAppBrowser: {
    creator: {
      kicker: string
      heading: string
      body: string
    }
    verdict: {
      kicker: string
      heading: string
      body: string
    }
    instructions: {
      instagram: string
      tiktok: string
    }
    address: string
  }

  share: string
  download: string
  edit: string
  reviewAnother: string

  actionStatus: {
    preparing: string
    sharing: string
    shared: string
    cancelled: string
    fallbackDownloaded: string
    downloaded: string
    retry: string
  }

  validation: {
    emptyMessage: string
    messageTooLong: string
    playerNameTooLong: string
    missingCategory: string
  }

  card: {
    reviewLabel: string
    evidenceLabel: string
    playerLabel: string
    reviewCheckLabel: string
    finalDecisionLabel: string
    explanationLabel: string
    penaltyLabel: string
    caseLabel: string
  }

  errors: {
    generation: string
    export: string
    share: string
  }
}
