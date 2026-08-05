import type {
  AppView,
  IncidentCategoryId,
  LaunchSeverity,
  Locale,
  SuggestionConfidence,
} from '../../shared/types/domain'
import type { ShareCapability } from '../export/share-verdict'

export type AnalyticsEventMap = {
  landing_viewed: {
    locale: Locale
    appVersion: string
  }

  category_suggested: {
    locale: Locale
    categoryId: IncidentCategoryId
    confidence: Exclude<SuggestionConfidence, 'none'>
  }

  category_overridden: {
    locale: Locale
    suggestedCategoryId: IncidentCategoryId
    selectedCategoryId: IncidentCategoryId
  }

  verdict_generated: {
    locale: Locale
    categoryId: IncidentCategoryId
    severity: LaunchSeverity
    generatedCount: number
  }

  share_invoked: {
    locale: Locale
    categoryId: IncidentCategoryId
    capability: ShareCapability
  }

  share_completed: {
    locale: Locale
    categoryId: IncidentCategoryId
  }

  share_failed: {
    locale: Locale
    categoryId: IncidentCategoryId
    failureClass: string
  }

  download_clicked: {
    locale: Locale
    categoryId: IncidentCategoryId
    source: 'download_button' | 'share_fallback'
  }

  edit_clicked: {
    locale: Locale
    categoryId: IncidentCategoryId
  }

  review_another_clicked: {
    locale: Locale
    previousCategoryId: IncidentCategoryId
    generatedCount: number
  }

  language_changed: {
    from: Locale
    to: Locale
    view: AppView
  }
}
