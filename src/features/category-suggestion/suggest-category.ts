import type {
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../../shared/types/domain'
import { matchCategoryRules } from './match-category-rules'

export type CategorySuggestion = {
  categoryId: IncidentCategoryId | null
  confidence: SuggestionConfidence
  matchedTriggerIds: readonly string[]
}

export function suggestCategory(
  locale: Locale,
  message: string,
): CategorySuggestion {
  const matches = matchCategoryRules(locale, message).filter(
    (match) => match.suggest !== false,
  )

  if (matches.length === 0) {
    return {
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    }
  }

  const topMatch = matches[0]

  return {
    categoryId: topMatch.categoryId,
    confidence: topMatch.confidence,
    matchedTriggerIds: matches
      .filter((match) => match.categoryId === topMatch.categoryId)
      .map((match) => match.triggerId),
  }
}
