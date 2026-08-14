import { describe, expect, it } from 'vitest'
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

  it('returns no suggestion for an unmatched message', () => {
    expect(suggestCategory('sr', 'Vidimo se sutra.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })
})
