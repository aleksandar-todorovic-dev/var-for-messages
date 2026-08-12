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

  it('rotates fallback variants in deterministic round-robin order', () => {
    const secondVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'missed_chance',
      message: 'Promenio je temu.',
      lastVariantId: 'sr_missed_question_yellow',
    })

    const thirdVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'missed_chance',
      message: 'Promenio je temu.',
      lastVariantId: secondVariant.id,
    })

    const wrappedVariant = selectVerdictVariant({
      locale: 'sr',
      categoryId: 'missed_chance',
      message: 'Promenio je temu.',
      lastVariantId: thirdVariant.id,
    })

    expect(secondVariant.id).toBe('sr_missed_flirt_red')
    expect(thirdVariant.id).toBe('sr_missed_side_yellow')
    expect(wrappedVariant.id).toBe('sr_missed_question_yellow')
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
