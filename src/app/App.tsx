import { useEffect, useReducer } from 'react'
import { getUiCopy } from '../content'
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

  useEffect(() => {
    persistLocale(creator.locale)
    document.documentElement.lang =
      creator.locale === 'sr' ? 'sr-Latn' : 'en'
  }, [creator.locale])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [view])

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
    dispatch({ type: 'SET_LOCALE', locale })
  }

  function handleCategoryChange(
    categoryId: IncidentCategoryId,
  ) {
    dispatch({ type: 'SELECT_CATEGORY', categoryId })
  }

  function handleSubmit(): CreatorFieldErrors {
    const errors = validateCreator(creator, copy)

    if (hasCreatorErrors(errors)) {
      dispatch({ type: 'VALIDATION_FAILED', errors })
      return errors
    }

    const categoryId = creator.selectedCategoryId

    if (!categoryId) {
      return errors
    }

    const verdict = generateVerdict({
      locale: creator.locale,
      categoryId,
      message: creator.message,
      playerName: creator.playerName,
      lastVariantId:
        session.lastVariantIdByCategory[categoryId],
      caseOccurrence: session.generatedCount + 1,
    })

    dispatch({
      type: 'START_REVIEW',
      verdict,
    })

    return {}
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
        onEdit={() =>
          dispatch({ type: 'EDIT_INCIDENT' })
        }
        onReviewAnother={() =>
          dispatch({ type: 'REVIEW_ANOTHER' })
        }
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
