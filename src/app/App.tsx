import {
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { getUiCopy } from '../content'
import { track } from '../features/analytics/analytics'
import { suggestCategory } from '../features/category-suggestion/suggest-category'
import { CreatorView } from '../features/creator/CreatorView'
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

const APP_VERSION = '0.1.0'

function App() {
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
  const landingTrackedRef = useRef(false)
  const lastSuggestionEventRef = useRef('')

  useEffect(() => {
    document.documentElement.lang =
      creator.locale === 'sr' ? 'sr-Latn' : 'en'
  }, [creator.locale])

  useEffect(() => {
    if (landingTrackedRef.current) {
      return
    }

    landingTrackedRef.current = true

    track('landing_viewed', {
      locale: creator.locale,
      appVersion: APP_VERSION,
    })
  }, [creator.locale])

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
      lastSuggestionEventRef.current = ''

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

      if (
        suggestion.categoryId &&
        suggestion.confidence !== 'none'
      ) {
        const eventKey = [
          creator.locale,
          suggestion.categoryId,
          suggestion.confidence,
        ].join(':')

        if (
          eventKey !== lastSuggestionEventRef.current
        ) {
          lastSuggestionEventRef.current = eventKey

          track('category_suggested', {
            locale: creator.locale,
            categoryId: suggestion.categoryId,
            confidence: suggestion.confidence,
          })
        }
      }
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [view, creator.locale, creator.message])

  function handleLocaleChange(locale: Locale) {
    persistLocale(locale)

    if (locale === creator.locale) {
      return
    }

    track('language_changed', {
      from: creator.locale,
      to: locale,
      view,
    })

    lastSuggestionEventRef.current = ''
    dispatch({ type: 'SET_LOCALE', locale })
  }

  function handleCategoryChange(
    categoryId: IncidentCategoryId,
  ) {
    if (
      creator.suggestedCategoryId &&
      creator.suggestedCategoryId !== categoryId
    ) {
      track('category_overridden', {
        locale: creator.locale,
        suggestedCategoryId:
          creator.suggestedCategoryId,
        selectedCategoryId: categoryId,
      })
    }

    dispatch({ type: 'SELECT_CATEGORY', categoryId })
  }

  function handleSubmit(): CreatorFieldErrors {
    const manualSelection =
      creator.categorySelectionSource === 'manual'
    let categoryId = manualSelection
      ? creator.selectedCategoryId
      : null
    let creatorForValidation = {
      ...creator,
      selectedCategoryId: categoryId,
    }

    if (!manualSelection && creator.message.trim()) {
      const immediateSuggestion = suggestCategory(
        creator.locale,
        creator.message,
      )

      categoryId =
        immediateSuggestion.confidence === 'high'
          ? immediateSuggestion.categoryId
          : null
      creatorForValidation = {
        ...creator,
        selectedCategoryId: categoryId,
      }

      dispatch({
        type: 'APPLY_CATEGORY_SUGGESTION',
        categoryId: immediateSuggestion.categoryId,
        confidence: immediateSuggestion.confidence,
      })

      if (
        immediateSuggestion.categoryId &&
        immediateSuggestion.confidence !== 'none'
      ) {
        const eventKey = [
          creator.locale,
          immediateSuggestion.categoryId,
          immediateSuggestion.confidence,
        ].join(':')

        if (eventKey !== lastSuggestionEventRef.current) {
          lastSuggestionEventRef.current = eventKey

          track('category_suggested', {
            locale: creator.locale,
            categoryId: immediateSuggestion.categoryId,
            confidence: immediateSuggestion.confidence,
          })
        }
      }
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

      track('verdict_generated', {
        locale: verdict.locale,
        categoryId: verdict.categoryId,
        severity: verdict.severity,
        generatedCount: session.generatedCount + 1,
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
          track('edit_clicked', {
            locale: generatedVerdict.locale,
            categoryId: generatedVerdict.categoryId,
          })

          dispatch({ type: 'EDIT_INCIDENT' })
        }}
        onReviewAnother={() => {
          track('review_another_clicked', {
            locale: generatedVerdict.locale,
            previousCategoryId:
              generatedVerdict.categoryId,
            generatedCount: session.generatedCount,
          })

          dispatch({ type: 'REVIEW_ANOTHER' })
        }}
      />
    )
  }

  return (
    <CreatorView
      creator={creator}
      entryFocus={creatorEntryFocus}
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
