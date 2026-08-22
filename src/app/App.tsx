import {
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { getUiCopy } from '../content'
import { trackLandingViewed } from '../features/analytics/analytics'
import type { RecruitmentSource } from '../features/analytics/analytics-events'
import { createVerdictKpiTracker } from '../features/analytics/verdict-kpi'
import { suggestCategory } from '../features/category-suggestion/suggest-category'
import { CreatorView } from '../features/creator/CreatorView'
import type { InspirationSetIndex } from '../features/creator/inspiration-sets'
import {
  hasCreatorErrors,
  validateCreator,
} from '../features/creator/validate-creator'
import { ReviewSequence } from '../features/review-sequence/ReviewSequence'
import { generateVerdict } from '../features/verdict/select-verdict'
import { VerdictView } from '../features/verdict/VerdictView'
import type {
  IncidentCategoryId,
  Locale,
} from '../shared/types/domain'
import {
  getInitialLocale,
  persistLocale,
} from '../shared/utils/locale-storage'
import { appReducer } from './app-reducer'
import {
  createInitialAppState,
  type CreatorFieldErrors,
} from './app-state'
import './app.css'

type AppProps = {
  inspirationSetIndex: InspirationSetIndex
  recruitmentSource?: RecruitmentSource
}

function App({
  inspirationSetIndex,
  recruitmentSource,
}: AppProps) {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    () => createInitialAppState(getInitialLocale()),
  )

  const {
    view,
    creator,
    creatorEntryFocus,
    generatedVerdict,
    session,
  } = state
  const copy = getUiCopy(creator.locale)
  const verdictKpisRef = useRef<
    ReturnType<typeof createVerdictKpiTracker> | null
  >(null)

  if (verdictKpisRef.current === null) {
    verdictKpisRef.current = createVerdictKpiTracker()
  }

  const verdictKpis = verdictKpisRef.current

  useEffect(() => {
    document.documentElement.lang =
      creator.locale === 'sr' ? 'sr-Latn' : 'en'
  }, [creator.locale])

  useEffect(() => {
    trackLandingViewed({
      locale: creator.locale,
      ...(recruitmentSource
        ? { source: recruitmentSource }
        : {}),
    })
  }, [creator.locale, recruitmentSource])

  useEffect(() => {
    if (
      view === 'create' &&
      creatorEntryFocus === 'message'
    ) {
      return
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [view, creatorEntryFocus])

  useEffect(() => {
    if (view !== 'create') {
      return
    }

    const message = creator.message.trim()

    if (!message) {
      dispatch({
        type: 'APPLY_CATEGORY_SUGGESTION',
        categoryId: null,
        confidence: 'none',
      })
      return
    }

    const timeoutId = window.setTimeout(() => {
      const suggestion = suggestCategory(
        creator.locale,
        creator.message,
      )

      dispatch({
        type: 'APPLY_CATEGORY_SUGGESTION',
        categoryId: suggestion.categoryId,
        confidence: suggestion.confidence,
      })
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [view, creator.locale, creator.message])

  function handleLocaleChange(locale: Locale) {
    persistLocale(locale)

    if (locale === creator.locale) {
      return
    }

    dispatch({ type: 'SET_LOCALE', locale })
  }

  function handleCategoryChange(
    categoryId: IncidentCategoryId,
  ) {
    dispatch({ type: 'SELECT_CATEGORY', categoryId })
  }

  function handleSubmit(): CreatorFieldErrors {
    const manualSelection =
      creator.categorySelectionSource === 'manual'
    const currentSuggestion = suggestCategory(
      creator.locale,
      creator.message,
    )
    let categoryId = manualSelection
      ? creator.selectedCategoryId
      : null
    let creatorForValidation = {
      ...creator,
      selectedCategoryId: categoryId,
    }

    if (!manualSelection && creator.message.trim()) {
      categoryId =
        currentSuggestion.confidence === 'high'
          ? currentSuggestion.categoryId
          : null
      creatorForValidation = {
        ...creator,
        selectedCategoryId: categoryId,
      }

      dispatch({
        type: 'APPLY_CATEGORY_SUGGESTION',
        categoryId: currentSuggestion.categoryId,
        confidence: currentSuggestion.confidence,
      })
    }

    const errors = validateCreator(
      creatorForValidation,
      copy,
    )

    if (hasCreatorErrors(errors)) {
      dispatch({ type: 'VALIDATION_FAILED', errors })
      return errors
    }

    if (!categoryId) {
      return errors
    }

    try {
      const verdict = generateVerdict({
        locale: creator.locale,
        categoryId,
        message: creator.message,
        playerName: creator.playerName,
        lastVariantId:
          session.lastVariantIdByCategory[categoryId],
        caseOccurrence: session.generatedCount + 1,
      })

      if (!verdictKpis.startLifecycle()) {
        return {}
      }

      verdictKpis.emitOnce('verdict_generated', {
        locale: verdict.locale,
        category: verdict.categoryId,
      })

      verdictKpis.emitCategorySuggestionOutcome({
        locale: verdict.locale,
        suggestedCategory: currentSuggestion.categoryId,
        suggestionConfidence: currentSuggestion.confidence,
        selectedCategory: verdict.categoryId,
      })

      dispatch({
        type: 'START_REVIEW',
        verdict,
      })

      return {}
    } catch {
      const generationErrors: CreatorFieldErrors = {
        generation: copy.errors.generation,
      }

      dispatch({
        type: 'VALIDATION_FAILED',
        errors: generationErrors,
      })

      return generationErrors
    }
  }

  if (view === 'reviewing' && generatedVerdict) {
    return (
      <ReviewSequence
        verdict={generatedVerdict}
        onComplete={() =>
          dispatch({ type: 'COMPLETE_REVIEW' })
        }
      />
    )
  }

  if (view === 'verdict' && generatedVerdict) {
    return (
      <VerdictView
        verdict={generatedVerdict}
        onEdit={() => {
          verdictKpis.finishLifecycle()
          dispatch({ type: 'EDIT_INCIDENT' })
        }}
        onShareCompleted={() =>
          verdictKpis.emitOnce(
            'share_completed',
            {
              locale: generatedVerdict.locale,
              category: generatedVerdict.categoryId,
            },
          )
        }
        onShareFailed={() =>
          verdictKpis.emitOnce('share_failed', {
            locale: generatedVerdict.locale,
            category: generatedVerdict.categoryId,
          })
        }
        onDownloadClicked={() =>
          verdictKpis.emitOnce(
            'download_clicked',
            {
              locale: generatedVerdict.locale,
              category: generatedVerdict.categoryId,
            },
          )
        }
        onReviewAnother={() => {
          verdictKpis.emitOnce(
            'review_another_clicked',
            {
              locale: generatedVerdict.locale,
              category: generatedVerdict.categoryId,
            },
          )

          verdictKpis.finishLifecycle()
          dispatch({ type: 'REVIEW_ANOTHER' })
        }}
      />
    )
  }

  return (
    <CreatorView
      creator={creator}
      entryFocus={creatorEntryFocus}
      inspirationSetIndex={inspirationSetIndex}
      onLocaleChange={handleLocaleChange}
      onMessageChange={(message) =>
        dispatch({ type: 'SET_MESSAGE', message })
      }
      onPlayerNameChange={(playerName) =>
        dispatch({
          type: 'SET_PLAYER_NAME',
          playerName,
        })
      }
      onCategoryChange={handleCategoryChange}
      onSubmit={handleSubmit}
    />
  )
}

export default App
