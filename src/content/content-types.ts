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

  reviewLine: string
  sanction: string
  offense: string
  explanation: string
  penalty: string
  caseCode: string
}

export type UiCopy = {
  languageLabel: string
  creatorKicker: string
  demoLabel: string
  newIncidentLabel: string
  formHeadline: string

  headline: string
  supportingText: string

  messageLabel: string
  messagePlaceholder: string
  playerNameLabel: string

  privacyNote: string
  reviewButton: string

  suggestionPrefix: string
  changeIncident: string
  confirmIncident: string
  categoryPrompt: string

  reviewingStatuses: readonly [string, string, string]

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
