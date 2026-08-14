import { describe, expect, it } from 'vitest'
import { getVerdictVariants } from '../../content'
import { categoryRules } from './category-rules'
import { normalizeForMatching } from './normalize-for-matching'
import { suggestCategory } from './suggest-category'

describe('category suggestion', () => {
  it('normalizes Serbian diacritics and punctuation', () => {
    expect(normalizeForMatching('  VAŽI.  ')).toBe('vazi')
  })

  it('recognizes a high-confidence dry reply', () => {
    expect(suggestCategory('sr', 'Važi.')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['sr_vazi'],
    })
  })

  it('prefers a more specific time-wasting trigger', () => {
    expect(suggestCategory('sr', 'Krećem sad!')).toEqual({
      categoryId: 'time_wasting',
      confidence: 'high',
      matchedTriggerIds: ['sr_leaving_now', 'sr_on_my_way'],
    })
  })

  it('recognizes Serbian without diacritics', () => {
    expect(
      suggestCategory('sr', 'Tek sad vidim, izvini.'),
    ).toMatchObject({
      categoryId: 'suspicious_excuse',
      confidence: 'high',
    })
  })

  it('keeps emotional offside low-confidence', () => {
    expect(suggestCategory('sr', 'A šta smo mi?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['sr_what_are_we_early'],
    })
  })

  it('keeps the Serbian status question low-confidence but distinct', () => {
    expect(suggestCategory('sr', 'Gde ovo vodi?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['sr_status_too_soon'],
    })
  })

  it('keeps the English status question low-confidence but distinct', () => {
    expect(suggestCategory('en', 'Where is this going?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['en_status_too_soon'],
    })
  })

  it('recognizes independently authored English rules', () => {
    expect(
      suggestCategory('en', 'Sorry, just saw this.'),
    ).toMatchObject({
      categoryId: 'suspicious_excuse',
      confidence: 'high',
    })
  })

  it('routes a common short Serbian reply without pretending it was važi', () => {
    expect(suggestCategory('sr', 'OK.')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['sr_short_reply'],
    })
  })

  it('keeps contextual-only dry and missed-chance cues out of auto-suggestion', () => {
    expect(suggestCategory('sr', 'Dobro.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('sr', 'Hahaha.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('sr', 'Još malo.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('sr', 'Sad ću.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', 'Almost ready.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })

    // Broad observational phrases must not become high-confidence excuse suggestions.
    expect(suggestCategory('sr', 'Nisam primetio novu frizuru.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('sr', 'E sad vidim šta si mislio.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', "Didn't notice the typo.")).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', 'Seeing this now makes sense.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })

  it('recognizes expanded planning and emotional-offside phrasing', () => {
    expect(suggestCategory('sr', 'Ne tad, ne tamo.')).toMatchObject({
      categoryId: 'planning_foul',
      confidence: 'low',
    })
    expect(suggestCategory('sr', 'Kuda ovo vodi?')).toMatchObject({
      categoryId: 'emotional_offside',
      confidence: 'low',
    })
  })

  it('matches phrases on normalized token boundaries', () => {
    expect(suggestCategory('sr', 'Kasnim 25 minuta.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', 'Back in 15 minutes.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })

  it('maps every category rule to a compatible verdict bundle', () => {
    for (const rule of categoryRules) {
      const variants = getVerdictVariants(
        rule.locale,
        rule.categoryId,
      )

      expect(
        variants.some((variant) =>
          variant.triggerIds?.includes(rule.triggerId),
        ),
      ).toBe(true)
    }
  })

  it('returns no suggestion for an unmatched message', () => {
    expect(suggestCategory('sr', 'Vidimo se sutra.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })
})
