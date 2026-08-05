import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  resetAnalyticsAdapter,
  setAnalyticsAdapter,
  track,
} from './analytics'

afterEach(() => {
  resetAnalyticsAdapter()
})

describe('typed analytics adapter', () => {
  it('forwards only the supplied typed event payload', () => {
    const adapter = {
      track: vi.fn(),
    }

    setAnalyticsAdapter(adapter)

    track('download_clicked', {
      locale: 'sr',
      categoryId: 'dry_texting',
      source: 'download_button',
    })

    expect(adapter.track).toHaveBeenCalledWith(
      'download_clicked',
      {
        locale: 'sr',
        categoryId: 'dry_texting',
        source: 'download_button',
      },
    )
  })

  it('isolates provider failures from the product', () => {
    setAnalyticsAdapter({
      track() {
        throw new Error('provider unavailable')
      },
    })

    expect(() => {
      track('landing_viewed', {
        locale: 'en',
        appVersion: '0.1.0',
      })
    }).not.toThrow()
  })
})
