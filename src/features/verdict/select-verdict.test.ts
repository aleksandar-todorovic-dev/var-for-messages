import { describe, expect, it } from 'vitest'
import {
  generateVerdict,
  selectVerdictVariant,
} from './select-verdict'

describe('verdict selection', () => {
  it('selects the specific Serbian anchor for a five-minute message', () => {
    const variant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'time_wasting',
      message: 'Evo me za pet minuta.',
    })

    expect(variant.id).toBe('sr_time_5min_red')
  })

  it('prefers the more specific leaving-now variant', () => {
    const variant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'time_wasting',
      message: 'Krećem sad.',
    })

    expect(variant.id).toBe('sr_time_now_yellow')
  })

  it('routes the Serbian status question to the dedicated red bundle', () => {
    const variant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'emotional_offside',
      message: 'Gde ovo vodi?',
    })

    expect(variant.id).toBe('sr_offside_where_going_red')
  })

  it('routes the English status question to the dedicated red bundle', () => {
    const variant = selectVerdictVariant({
      locale: 'en',
      categoryId: 'emotional_offside',
      message: 'Where is this going?',
    })

    expect(variant.id).toBe('en_offside_where_going_red')
  })

  it('never crosses language or category', () => {
    const variant = selectVerdictVariant({
      locale: 'en',
      categoryId: 'dry_texting',
      message: 'K.',
    })

    expect(variant.id).toBe('en_dry_k_yellow')
    expect(variant.locale).toBe('en')
    expect(variant.categoryId).toBe('dry_texting')
  })

  it('routes common short replies to the generic dry bundle', () => {
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'dry_texting',
        message: 'ok',
      }).id,
    ).toBe('sr_dry_short_yellow')
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'dry_texting',
        message: 'dobro',
      }).id,
    ).toBe('sr_dry_short_yellow')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'dry_texting',
        message: 'okay',
      }).id,
    ).toBe('en_dry_short_yellow')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'dry_texting',
        message: 'sure',
      }).id,
    ).toBe('en_dry_sure_yellow')
  })

  it('routes vague arrival updates away from the five-minute-specific bundle', () => {
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'time_wasting',
        message: 'Stižem.',
      }).id,
    ).toBe('sr_time_status_yellow')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'time_wasting',
        message: 'On my way.',
      }).id,
    ).toBe('en_time_status_yellow')
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'time_wasting',
        message: 'Još malo.',
      }).id,
    ).toBe('sr_time_status_yellow')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'time_wasting',
        message: 'Almost ready.',
      }).id,
    ).toBe('en_time_status_yellow')
  })

  it('uses routing-only cues without turning them into category suggestions', () => {
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'missed_chance',
        message: 'Hahaha.',
      }).id,
    ).toBe('sr_missed_flirt_red')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'missed_chance',
        message: 'Haha.',
      }).id,
    ).toBe('en_missed_flirt_red')
  })

  it('uses the safe missed-chance fallback when no specific cue matches', () => {
    expect(
      selectVerdictVariant({
        locale: 'sr',
        categoryId: 'missed_chance',
        message: 'Promenio je temu.',
      }).id,
    ).toBe('sr_missed_generic_yellow')
    expect(
      selectVerdictVariant({
        locale: 'en',
        categoryId: 'missed_chance',
        message: 'Changed the subject.',
      }).id,
    ).toBe('en_missed_generic_yellow')
  })

  it('keeps deterministic round-robin fallback where no generic fallback exists', () => {
    const secondVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'planning_foul',
      message: 'Nešto treće.',
      lastVariantId: 'sr_plan_anything_red',
    })
    const thirdVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'planning_foul',
      message: 'Nešto treće.',
      lastVariantId: secondVariant.id,
    })
    const wrappedVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'planning_foul',
      message: 'Nešto treće.',
      lastVariantId: thirdVariant.id,
    })
    expect(secondVariant.id).toBe('sr_plan_choose_yellow')
    expect(thirdVariant.id).toBe('sr_plan_veto_red')
    expect(wrappedVariant.id).toBe('sr_plan_anything_red')
  })

  it('assembles one complete generated verdict', () => {
    const verdict = generateVerdict({
      locale: 'sr',
      categoryId: 'dry_texting',
      message: '  Važi.  ',
      playerName: '  Đorđe  ',
    })

    expect(verdict).toMatchObject({
      locale: 'sr',
      originalMessage: 'Važi.',
      playerName: 'Đorđe',
      categoryId: 'dry_texting',
      severity: 'yellow',
      sanction: 'Žuti karton',
      offense: 'Dry',
      caseId: '#DRY01',
      variantId: 'sr_dry_vazi_yellow',
    })
  })

  it('rejects an empty message', () => {
    expect(() =>
      generateVerdict({
        locale: 'sr',
        categoryId: 'dry_texting',
        message: '   ',
      }),
    ).toThrow('empty message')
  })
})
