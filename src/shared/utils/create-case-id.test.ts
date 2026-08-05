import { describe, expect, it } from 'vitest'
import { createCaseId } from './create-case-id'

describe('createCaseId', () => {
  it('creates the stable base case ID', () => {
    expect(createCaseId('dry01')).toBe('#DRY01')
  })

  it('adds a session occurrence only when requested', () => {
    expect(createCaseId('5MIN', 2)).toBe('#5MIN-02')
  })

  it('does not accept an empty technical code', () => {
    expect(() => createCaseId('---')).toThrow('Case code')
  })
})
