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

  it('uses a safe category fallback for unmatched manual input', () => {
    const cases = [
      ['sr', 'time_wasting', 'sr_time_status_yellow'],
      ['sr', 'dry_texting', 'sr_dry_short_yellow'],
      ['sr', 'suspicious_excuse', 'sr_excuse_generic_yellow'],
      ['sr', 'planning_foul', 'sr_plan_anything_red'],
      ['sr', 'emotional_offside', 'sr_offside_generic_yellow'],
      ['sr', 'missed_chance', 'sr_missed_generic_yellow'],
      ['en', 'time_wasting', 'en_time_status_yellow'],
      ['en', 'dry_texting', 'en_dry_short_yellow'],
      ['en', 'suspicious_excuse', 'en_excuse_generic_yellow'],
      ['en', 'planning_foul', 'en_plan_anything_red'],
      ['en', 'emotional_offside', 'en_offside_generic_yellow'],
      ['en', 'missed_chance', 'en_missed_generic_yellow'],
    ] as const

    for (const [locale, categoryId, expectedId] of cases) {
      expect(
        selectVerdictVariant({
          locale,
          categoryId,
          message: 'Completely unmatched text.',
        }).id,
      ).toBe(expectedId)
    }
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
