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

describe('content library', () => {
  it('passes the complete content contract', () => {
    expect(validateContentLibrary()).toEqual([])
  })

  it('contains six categories and eighteen variants per locale', () => {
    for (const locale of locales) {
      expect(getCategories(locale)).toHaveLength(6)
      expect(getVerdictVariants(locale)).toHaveLength(18)

      for (const categoryId of incidentCategoryIds) {
        expect(
          getVerdictVariants(locale, categoryId),
        ).toHaveLength(3)
      }
    }
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
