import type {
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../shared/types/domain'

export type CreatorFieldErrors = {
  message?: string
  playerName?: string
  category?: string
}

export type CategorySelectionSource = 'suggestion' | 'manual' | null

export type CreatorState = {
  locale: Locale
  message: string
  playerName: string

  suggestedCategoryId: IncidentCategoryId | null
  selectedCategoryId: IncidentCategoryId | null
  suggestionConfidence: SuggestionConfidence
  categorySelectionSource: CategorySelectionSource

  errors: CreatorFieldErrors
}

export type SessionState = {
  lastVariantIdByCategory: Partial<
    Record<IncidentCategoryId, string>
  >
  generatedCount: number
}

export type AppState = {
  creator: CreatorState
  preparedVerdict: GeneratedVerdict | null
  session: SessionState
}

export function createInitialAppState(locale: Locale): AppState {
  return {
    creator: {
      locale,
      message: '',
      playerName: '',
      suggestedCategoryId: null,
      selectedCategoryId: null,
      suggestionConfidence: 'none',
      categorySelectionSource: null,
      errors: {},
    },
    preparedVerdict: null,
    session: {
      lastVariantIdByCategory: {},
      generatedCount: 0,
    },
  }
}
