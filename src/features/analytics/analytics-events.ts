import type {
  IncidentCategoryId,
  Locale,
} from '../../shared/types/domain'

export const recruitmentSources = [
  'benchmark',
  'reddit-sideproject',
  'balkan-discord',
  'telegram',
] as const

export type RecruitmentSource =
  (typeof recruitmentSources)[number]

export const analyticsEventNames = [
  'landing_viewed',
  'verdict_generated',
  'share_completed',
  'download_clicked',
  'review_another_clicked',
  'category_suggested',
  'category_overridden',
  'share_failed',
] as const

type VerdictProperties = {
  locale: Locale
  category: IncidentCategoryId
}

export type AnalyticsEventMap = {
  landing_viewed: {
    locale: Locale
    source?: RecruitmentSource
  }

  verdict_generated: VerdictProperties
  share_completed: VerdictProperties
  download_clicked: VerdictProperties
  review_another_clicked: VerdictProperties
  share_failed: VerdictProperties

  category_suggested: {
    locale: Locale
    category: IncidentCategoryId
    confidence: 'high'
  }

  category_overridden: {
    locale: Locale
    fromCategory: IncidentCategoryId
    toCategory: IncidentCategoryId
  }
}

export type AnalyticsEventName =
  keyof AnalyticsEventMap

export type AnalyticsEvent = {
  [EventName in AnalyticsEventName]: {
    name: EventName
    properties: AnalyticsEventMap[EventName]
  }
}[AnalyticsEventName]
