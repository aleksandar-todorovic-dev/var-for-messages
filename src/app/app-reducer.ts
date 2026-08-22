import type {
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
  SuggestionConfidence,
} from '../shared/types/domain'
import { normalizeMessageForDisplay } from '../shared/utils/normalize-input'
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
      type: 'START_REVIEW'
      verdict: GeneratedVerdict
    }
  | { type: 'COMPLETE_REVIEW' }
  | { type: 'EDIT_INCIDENT' }
  | { type: 'REVIEW_ANOTHER' }

function isCreateView(state: AppState) {
  return state.view === 'create'
}

export function appReducer(
  state: AppState,
  action: AppAction,
): AppState {
  switch (action.type) {
    case 'SET_LOCALE': {
      if (!isCreateView(state)) {
        return state
      }

      const manualSelection =
        state.creator.categorySelectionSource === 'manual'

      return {
        ...state,
        creator: {
          ...state.creator,
          locale: action.locale,
          suggestedCategoryId: null,
          selectedCategoryId: manualSelection
            ? state.creator.selectedCategoryId
            : null,
          suggestionConfidence: 'none',
          categorySuggestionPending:
            !manualSelection &&
            Boolean(
              normalizeMessageForDisplay(state.creator.message),
            ),
          categorySelectionSource: manualSelection
            ? 'manual'
            : null,
          errors: {},
        },
        generatedVerdict: null,
      }
    }

    case 'SET_MESSAGE': {
      if (!isCreateView(state)) {
        return state
      }

      const messageCleared = !normalizeMessageForDisplay(
        action.message,
      )
      const manualSelection =
        state.creator.categorySelectionSource === 'manual'
      const keepManualSelection =
        !messageCleared && manualSelection

      return {
        ...state,
        creator: {
          ...state.creator,
          message: action.message,
          suggestedCategoryId: null,
          selectedCategoryId: keepManualSelection
            ? state.creator.selectedCategoryId
            : null,
          suggestionConfidence: 'none',
          categorySuggestionPending:
            !messageCleared && !keepManualSelection,
          categorySelectionSource: keepManualSelection
            ? 'manual'
            : null,
          errors: {
            ...state.creator.errors,
            message: undefined,
            category:
              messageCleared || keepManualSelection
                ? undefined
                : state.creator.errors.category,
            generation: undefined,
          },
        },
        generatedVerdict: null,
      }
    }

    case 'SET_PLAYER_NAME':
      if (!isCreateView(state)) {
        return state
      }

      return {
        ...state,
        creator: {
          ...state.creator,
          playerName: action.playerName,
          errors: {
            ...state.creator.errors,
            playerName: undefined,
            generation: undefined,
          },
        },
        generatedVerdict: null,
      }

    case 'APPLY_CATEGORY_SUGGESTION': {
      if (!isCreateView(state)) {
        return state
      }

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
          categorySuggestionPending: false,
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
            category:
              manualSelection || shouldAutoSelect
                ? undefined
                : state.creator.errors.category,
          },
        },
      }
    }

    case 'SELECT_CATEGORY':
      if (!isCreateView(state)) {
        return state
      }

      return {
        ...state,
        creator: {
          ...state.creator,
          selectedCategoryId: action.categoryId,
          categorySuggestionPending: false,
          categorySelectionSource: 'manual',
          errors: {
            ...state.creator.errors,
            category: undefined,
            generation: undefined,
          },
        },
        generatedVerdict: null,
      }

    case 'VALIDATION_FAILED':
      if (!isCreateView(state)) {
        return state
      }

      return {
        ...state,
        creator: {
          ...state.creator,
          errors: action.errors,
        },
        generatedVerdict: null,
      }

    case 'START_REVIEW':
      if (!isCreateView(state)) {
        return state
      }

      return {
        ...state,
        view: 'reviewing',
        creatorEntryFocus: 'none',
        creator: {
          ...state.creator,
          errors: {},
        },
        generatedVerdict: action.verdict,
        session: {
          generatedCount: state.session.generatedCount + 1,
          lastVariantIdByCategory: {
            ...state.session.lastVariantIdByCategory,
            [action.verdict.categoryId]: action.verdict.variantId,
          },
        },
      }

    case 'COMPLETE_REVIEW':
      if (
        state.view !== 'reviewing' ||
        !state.generatedVerdict
      ) {
        return state
      }

      return {
        ...state,
        view: 'verdict',
      }

    case 'EDIT_INCIDENT':
      if (state.view !== 'verdict') {
        return state
      }

      return {
        ...state,
        view: 'create',
        creatorEntryFocus: 'message',
        generatedVerdict: null,
      }

    case 'REVIEW_ANOTHER':
      if (state.view !== 'verdict') {
        return state
      }

      return {
        ...state,
        view: 'create',
        creatorEntryFocus: 'message',
        creator: {
          ...state.creator,
          message: '',
          playerName: '',
          suggestedCategoryId: null,
          selectedCategoryId: null,
          suggestionConfidence: 'none',
          categorySuggestionPending: false,
          categorySelectionSource: null,
          errors: {},
        },
        generatedVerdict: null,
      }
  }
}
