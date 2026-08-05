import type {
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../shared/types/domain'
import type {
  AppState,
  CreatorFieldErrors,
} from './app-state'

export type AppAction =
  | { type: 'SET_LOCALE'; locale: Locale }
  | { type: 'SET_MESSAGE'; message: string }
  | { type: 'SET_PLAYER_NAME'; playerName: string }
  | {
      type: 'APPLY_CATEGORY_SUGGESTION'
      categoryId: IncidentCategoryId | null
      confidence: SuggestionConfidence
    }
  | {
      type: 'SELECT_CATEGORY'
      categoryId: IncidentCategoryId
    }
  | {
      type: 'VALIDATION_FAILED'
      errors: CreatorFieldErrors
    }
  | {
      type: 'PREPARE_VERDICT'
      verdict: GeneratedVerdict
    }

export function appReducer(
  state: AppState,
  action: AppAction,
): AppState {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        ...state,
        creator: {
          ...state.creator,
          locale: action.locale,
          errors: {},
        },
        preparedVerdict: null,
      }

    case 'SET_MESSAGE':
      return {
        ...state,
        creator: {
          ...state.creator,
          message: action.message,
          errors: {
            ...state.creator.errors,
            message: undefined,
          },
        },
        preparedVerdict: null,
      }

    case 'SET_PLAYER_NAME':
      return {
        ...state,
        creator: {
          ...state.creator,
          playerName: action.playerName,
          errors: {
            ...state.creator.errors,
            playerName: undefined,
          },
        },
        preparedVerdict: null,
      }

    case 'APPLY_CATEGORY_SUGGESTION': {
      const manualSelection =
        state.creator.categorySelectionSource === 'manual'

      const shouldAutoSelect =
        !manualSelection &&
        action.confidence === 'high' &&
        action.categoryId !== null

      return {
        ...state,
        creator: {
          ...state.creator,
          suggestedCategoryId: action.categoryId,
          suggestionConfidence: action.confidence,
          selectedCategoryId: manualSelection
            ? state.creator.selectedCategoryId
            : shouldAutoSelect
              ? action.categoryId
              : null,
          categorySelectionSource: manualSelection
            ? 'manual'
            : shouldAutoSelect
              ? 'suggestion'
              : null,
          errors: {
            ...state.creator.errors,
            category: undefined,
          },
        },
      }
    }

    case 'SELECT_CATEGORY':
      return {
        ...state,
        creator: {
          ...state.creator,
          selectedCategoryId: action.categoryId,
          categorySelectionSource: 'manual',
          errors: {
            ...state.creator.errors,
            category: undefined,
          },
        },
        preparedVerdict: null,
      }

    case 'VALIDATION_FAILED':
      return {
        ...state,
        creator: {
          ...state.creator,
          errors: action.errors,
        },
        preparedVerdict: null,
      }

    case 'PREPARE_VERDICT':
      return {
        ...state,
        creator: {
          ...state.creator,
          errors: {},
        },
        preparedVerdict: action.verdict,
        session: {
          generatedCount: state.session.generatedCount + 1,
          lastVariantIdByCategory: {
            ...state.session.lastVariantIdByCategory,
            [action.verdict.categoryId]: action.verdict.variantId,
          },
        },
      }
  }
}
