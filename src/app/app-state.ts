import type {
  AppView,
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../shared/types/domain'

export type CreatorFieldErrors = {
  message?: string
  playerName?: string
  category?: string
  generation?: string
}

export type CategorySelectionSource = 'suggestion' | 'manual' | null
export type CreatorEntryFocus = 'none' | 'message'

export type CreatorState = {
  locale: Locale
  message: string
  playerName: string

  suggestedCategoryId: IncidentCategoryId | null
  selectedCategoryId: IncidentCategoryId | null
  suggestionConfidence: SuggestionConfidence
  categorySuggestionPending: boolean
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
  view: AppView
  creator: CreatorState
  creatorEntryFocus: CreatorEntryFocus
  generatedVerdict: GeneratedVerdict | null
  session: SessionState
}

export function createInitialAppState(locale: Locale): AppState {
  return {
    view: 'create',
    creator: {
      locale,
      message: '',
      playerName: '',
      suggestedCategoryId: null,
      selectedCategoryId: null,
      suggestionConfidence: 'none',
      categorySuggestionPending: false,
      categorySelectionSource: null,
      errors: {},
    },
    creatorEntryFocus: 'none',
    generatedVerdict: null,
    session: {
      lastVariantIdByCategory: {},
      generatedCount: 0,
    },
  }
}
