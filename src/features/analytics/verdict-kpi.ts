import { track } from './analytics'
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from './analytics-events'
import type {
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../../shared/types/domain'

export const verdictKpiEventNames = [
  'verdict_generated',
  'share_completed',
  'download_clicked',
  'review_another_clicked',
  'category_suggested',
  'category_overridden',
  'share_failed',
] as const satisfies readonly AnalyticsEventName[]

export type VerdictKpiEventName =
  (typeof verdictKpiEventNames)[number]

type VerdictKpiEmitter = <
  EventName extends VerdictKpiEventName,
>(
  name: EventName,
  properties: AnalyticsEventMap[EventName],
) => void

type CategorySuggestionOutcome = {
  locale: Locale
  suggestedCategory: IncidentCategoryId | null
  suggestionConfidence: SuggestionConfidence
  selectedCategory: IncidentCategoryId
}

export function createVerdictKpiTracker(
  emit: VerdictKpiEmitter = track,
) {
  let lifecycleActive = false
  const emitted = new Set<VerdictKpiEventName>()

  function emitOnce<
    EventName extends VerdictKpiEventName,
  >(
    name: EventName,
    properties: AnalyticsEventMap[EventName],
  ) {
    if (!lifecycleActive || emitted.has(name)) {
      return false
    }

    emitted.add(name)
    emit(name, properties)
    return true
  }

  return {
    startLifecycle() {
      if (lifecycleActive) {
        return false
      }

      lifecycleActive = true
      emitted.clear()
      return true
    },

    finishLifecycle() {
      lifecycleActive = false
      emitted.clear()
    },

    emitOnce,

    emitCategorySuggestionOutcome({
      locale,
      suggestedCategory,
      suggestionConfidence,
      selectedCategory,
    }: CategorySuggestionOutcome) {
      if (
        suggestionConfidence !== 'high' ||
        suggestedCategory === null
      ) {
        return {
          categorySuggested: false,
          categoryOverridden: false,
        }
      }

      const categorySuggested = emitOnce(
        'category_suggested',
        {
          locale,
          category: suggestedCategory,
          confidence: 'high',
        },
      )
      const categoryOverridden =
        suggestedCategory !== selectedCategory &&
        emitOnce('category_overridden', {
          locale,
          fromCategory: suggestedCategory,
          toCategory: selectedCategory,
        })

      return {
        categorySuggested,
        categoryOverridden,
      }
    },
  }
}
