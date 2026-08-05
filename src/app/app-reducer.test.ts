import { describe, expect, it } from 'vitest'
import type { GeneratedVerdict } from '../shared/types/domain'
import { appReducer } from './app-reducer'
import { createInitialAppState } from './app-state'

const preparedVerdict: GeneratedVerdict = {
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

describe('appReducer creator flow', () => {
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

  it('stores the prepared verdict and session history', () => {
    const state = appReducer(createInitialAppState('sr'), {
      type: 'PREPARE_VERDICT',
      verdict: preparedVerdict,
    })

    expect(state.preparedVerdict).toEqual(preparedVerdict)
    expect(state.session.generatedCount).toBe(1)
    expect(
      state.session.lastVariantIdByCategory.dry_texting,
    ).toBe(preparedVerdict.variantId)
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
})
