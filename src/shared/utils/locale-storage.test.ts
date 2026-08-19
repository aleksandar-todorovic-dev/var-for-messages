import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getInitialLocale,
  persistLocale,
} from './locale-storage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('locale persistence', () => {
  it('uses browser auto-detection without persisting it', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(() => null),
        setItem,
      },
      navigator: { language: 'sr-Latn-RS' },
    })

    expect(getInitialLocale()).toBe('sr')
    expect(setItem).not.toHaveBeenCalled()
  })

  it('lets a valid explicit stored choice win', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(() => 'en'),
        setItem: vi.fn(),
      },
      navigator: { language: 'sr-Latn-RS' },
    })

    expect(getInitialLocale()).toBe('en')
  })

  it('persists only when explicit persistence is requested', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(() => null),
        setItem,
      },
      navigator: { language: 'en-US' },
    })

    persistLocale('sr')

    expect(setItem).toHaveBeenCalledWith(
      'var-for-messages:locale',
      'sr',
    )
  })
})
