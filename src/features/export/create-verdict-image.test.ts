import { describe, expect, it } from 'vitest'
import { createVerdictFileName } from './create-verdict-image'

describe('createVerdictFileName', () => {
  it('creates a neutral ASCII filename from the case ID', () => {
    expect(createVerdictFileName('#DRY01-02')).toBe(
      'var-verdict-dry01-02.png',
    )
  })

  it('never includes arbitrary user text', () => {
    expect(createVerdictFileName('#ČĆ / hello')).toBe(
      'var-verdict-hello.png',
    )
  })

  it('falls back when the case code is empty', () => {
    expect(createVerdictFileName('###')).toBe(
      'var-verdict-case.png',
    )
  })
})
