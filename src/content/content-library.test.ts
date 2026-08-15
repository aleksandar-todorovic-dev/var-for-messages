import { describe, expect, it } from 'vitest'
import {
  allVerdictVariants,
  getCategories,
  getUiCopy,
  getVerdictVariants,
} from '.'
import {
  incidentCategoryIds,
  locales,
} from '../shared/types/domain'
import { validateContentLibrary } from './validate-content'

const expectedVariantCounts = {
  time_wasting: 5,
  dry_texting: 5,
  suspicious_excuse: 4,
  planning_foul: 4,
  emotional_offside: 4,
  missed_chance: 4,
} as const

describe('content library', () => {
  it('passes the complete content contract', () => {
    expect(validateContentLibrary()).toEqual([])
  })

  it('contains six categories and twenty-six variants per locale', () => {
    for (const locale of locales) {
      expect(getCategories(locale)).toHaveLength(6)
      expect(getVerdictVariants(locale)).toHaveLength(26)

      for (const categoryId of incidentCategoryIds) {
        expect(
          getVerdictVariants(locale, categoryId),
        ).toHaveLength(expectedVariantCounts[categoryId])
      }
    }
  })

  it('uses the v0.3 category labels', () => {
    expect(
      getCategories('sr').map((category) => category.label),
    ).toEqual([
      'Večnih pet minuta',
      'Dry reply',
      'Ne pije vodu',
      'Svejedno, ali ne to',
      'Emotivni ofsajd',
      'Promašen zicer',
    ])

    expect(
      getCategories('en').map((category) => category.label),
    ).toEqual([
      'On My Way',
      'Dry Reply',
      'Yeah, Right',
      'Anything But That',
      'Emotional Offside',
      'Missed Sitter',
    ])
  })

  it('keeps variant IDs globally unique', () => {
    const ids = allVerdictVariants.map((variant) => variant.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps each UI dictionary complete and locale-specific', () => {
    expect(getUiCopy('sr').card.caseLabel).toBe('SLUČAJ')
    expect(getUiCopy('en').card.caseLabel).toBe('CASE')
    expect(getUiCopy('sr').reviewingStatuses).toHaveLength(3)
    expect(getUiCopy('en').reviewingStatuses).toHaveLength(3)
  })
})
