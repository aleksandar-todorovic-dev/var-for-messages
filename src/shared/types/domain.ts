export const locales = ['sr', 'en'] as const
export type Locale = (typeof locales)[number]

export const incidentCategoryIds = [
  'time_wasting',
  'dry_texting',
  'suspicious_excuse',
  'planning_foul',
  'emotional_offside',
  'missed_chance',
] as const

export type IncidentCategoryId = (typeof incidentCategoryIds)[number]

export type Severity = 'no_card' | 'yellow' | 'red'
export type LaunchSeverity = Exclude<Severity, 'no_card'>

export type SuggestionConfidence = 'none' | 'low' | 'high'

export type GeneratedVerdict = {
  locale: Locale
  originalMessage: string
  playerName?: string
  categoryId: IncidentCategoryId
  severity: LaunchSeverity

  reviewLine: string
  sanction: string
  offense: string
  explanation: string
  penalty: string

  caseId: string
  variantId: string
}
