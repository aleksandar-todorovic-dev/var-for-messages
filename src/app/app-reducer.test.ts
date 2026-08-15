import { describe, expect, it } from 'vitest'
import type { GeneratedVerdict } from '../shared/types/domain'
import { appReducer } from './app-reducer'
import { createInitialAppState } from './app-state'

const generatedVerdict: GeneratedVerdict = {
  locale: 'sr',
  originalMessage: 'Važi.',
  categoryId: 'dry_texting',
  severity: 'yellow',
  reviewLine: 'Da li je ovo odgovor ili upozorenje?',
  sanction: 'Žuti karton',
  offense: 'Za odgovor bez pulsa',
  explanation: 'Jedna reč. Nula topline. Maksimalna tenzija.',
  penalty:
    'Sledeća poruka mora da sadrži glagol i makar jedan znak života.',
  caseId: '#DRY01',
  variantId: 'sr_dry_vazi_yellow',
}

function createReviewingState() {
  return appReducer(createInitialAppState('sr'), {
    type: 'START_REVIEW',
    verdict: generatedVerdict,
  })
}

function createVerdictState() {
  return appReducer(createReviewingState(), {
    type: 'COMPLETE_REVIEW',
  })
}

describe('appReducer application flow', () => {
  it('auto-selects a high-confidence suggestion', () => {
    const state = appReducer(createInitialAppState('sr'), {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'time_wasting',
      confidence: 'high',
    })

    expect(state.creator.selectedCategoryId).toBe('time_wasting')
    expect(state.creator.categorySelectionSource).toBe('suggestion')
  })

  it('does not auto-select a low-confidence suggestion', () => {
    const state = appReducer(createInitialAppState('sr'), {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'emotional_offside',
      confidence: 'low',
    })

    expect(state.creator.suggestedCategoryId).toBe(
      'emotional_offside',
    )
    expect(state.creator.selectedCategoryId).toBeNull()
  })

  it('preserves a manual override when suggestions change', () => {
    const manualState = appReducer(createInitialAppState('sr'), {
      type: 'SELECT_CATEGORY',
      categoryId: 'missed_chance',
    })

    const suggestedState = appReducer(manualState, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'time_wasting',
      confidence: 'high',
    })

    expect(suggestedState.creator.suggestedCategoryId).toBe(
      'time_wasting',
    )
    expect(suggestedState.creator.selectedCategoryId).toBe(
      'missed_chance',
    )
    expect(suggestedState.creator.categorySelectionSource).toBe(
      'manual',
    )
  })

  it('clears suggestion-derived selection when the message changes', () => {
    let state = appReducer(createInitialAppState('en'), {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'dry_texting',
      confidence: 'high',
    })

    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'On my way.',
    })

    expect(state.creator.selectedCategoryId).toBeNull()
    expect(state.creator.suggestedCategoryId).toBeNull()
    expect(state.creator.categorySelectionSource).toBeNull()
  })

  it('preserves a manual selection while editing a nonempty message', () => {
    let state = appReducer(createInitialAppState('sr'), {
      type: 'SELECT_CATEGORY',
      categoryId: 'planning_foul',
    })

    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Nova poruka.',
    })

    expect(state.creator.selectedCategoryId).toBe('planning_foul')
    expect(state.creator.categorySelectionSource).toBe('manual')
  })

  it('keeps a category validation error until a real selection resolves it', () => {
    let state = createInitialAppState('sr')
    state.creator.message = 'Nema automatskog podudaranja.'
    state = appReducer(state, {
      type: 'VALIDATION_FAILED',
      errors: { category: 'Izaberi incident.' },
    })

    const noMatchState = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: null,
      confidence: 'none',
    })

    expect(noMatchState.creator.errors.category).toBe(
      'Izaberi incident.',
    )
  })

  it('starts review and stores session history', () => {
    const state = createReviewingState()

    expect(state.view).toBe('reviewing')
    expect(state.generatedVerdict).toEqual(generatedVerdict)
    expect(state.session.generatedCount).toBe(1)
    expect(
      state.session.lastVariantIdByCategory.dry_texting,
    ).toBe(generatedVerdict.variantId)
  })

  it('completes review only from a valid reviewing state', () => {
    const createState = createInitialAppState('sr')
    const unchangedState = appReducer(createState, {
      type: 'COMPLETE_REVIEW',
    })

    expect(unchangedState).toBe(createState)

    const verdictState = createVerdictState()

    expect(verdictState.view).toBe('verdict')
    expect(verdictState.generatedVerdict).toEqual(generatedVerdict)
  })

  it('edits an incident without clearing creator fields', () => {
    const creatorState = createInitialAppState('sr')
    creatorState.creator.message = 'Važi.'
    creatorState.creator.playerName = 'Aleksandar'
    creatorState.creator.selectedCategoryId = 'dry_texting'

    const reviewingState = appReducer(creatorState, {
      type: 'START_REVIEW',
      verdict: generatedVerdict,
    })

    const verdictState = appReducer(reviewingState, {
      type: 'COMPLETE_REVIEW',
    })

    const editedState = appReducer(verdictState, {
      type: 'EDIT_INCIDENT',
    })

    expect(editedState.view).toBe('create')
    expect(editedState.creator.message).toBe('Važi.')
    expect(editedState.creator.playerName).toBe('Aleksandar')
    expect(editedState.creator.selectedCategoryId).toBe(
      'dry_texting',
    )
    expect(editedState.creatorEntryFocus).toBe('message')
    expect(editedState.generatedVerdict).toBeNull()
  })

  it('starts another review with a clean incident and preserved session', () => {
    const verdictState = createVerdictState()

    const nextState = appReducer(verdictState, {
      type: 'REVIEW_ANOTHER',
    })

    expect(nextState.view).toBe('create')
    expect(nextState.creator.locale).toBe('sr')
    expect(nextState.creator.message).toBe('')
    expect(nextState.creator.playerName).toBe('')
    expect(nextState.creator.selectedCategoryId).toBeNull()
    expect(nextState.creator.suggestedCategoryId).toBeNull()
    expect(nextState.creatorEntryFocus).toBe('message')
    expect(nextState.session.generatedCount).toBe(1)
    expect(
      nextState.session.lastVariantIdByCategory.dry_texting,
    ).toBe(generatedVerdict.variantId)
  })

  it('clears a stale manual category when the message is emptied', () => {
    let state = createInitialAppState('sr')
    state.creator.message = 'Nešto.'
    state = appReducer(state, {
      type: 'SELECT_CATEGORY',
      categoryId: 'planning_foul',
    })

    const clearedState = appReducer(state, {
      type: 'SET_MESSAGE',
      message: '   ',
    })

    expect(clearedState.creator.message).toBe('   ')
    expect(clearedState.creator.selectedCategoryId).toBeNull()
    expect(clearedState.creator.suggestedCategoryId).toBeNull()
    expect(clearedState.creator.suggestionConfidence).toBe('none')
    expect(clearedState.creator.categorySelectionSource).toBeNull()
  })

  it('clears suggestion-derived selection when locale changes', () => {
    let state = appReducer(createInitialAppState('en'), {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'dry_texting',
      confidence: 'high',
    })

    state = appReducer(state, {
      type: 'SET_LOCALE',
      locale: 'sr',
    })

    expect(state.creator.locale).toBe('sr')
    expect(state.creator.selectedCategoryId).toBeNull()
    expect(state.creator.suggestedCategoryId).toBeNull()
    expect(state.creator.categorySelectionSource).toBeNull()
  })

  it('keeps the selected category when locale changes', () => {
    const selectedState = appReducer(createInitialAppState('sr'), {
      type: 'SELECT_CATEGORY',
      categoryId: 'planning_foul',
    })

    const englishState = appReducer(selectedState, {
      type: 'SET_LOCALE',
      locale: 'en',
    })

    expect(englishState.creator.locale).toBe('en')
    expect(englishState.creator.selectedCategoryId).toBe(
      'planning_foul',
    )
  })

  it('ignores creator edits outside the create view', () => {
    const reviewingState = createReviewingState()

    const unchangedState = appReducer(reviewingState, {
      type: 'SET_MESSAGE',
      message: 'Changed too late',
    })

    expect(unchangedState).toBe(reviewingState)
  })
})
