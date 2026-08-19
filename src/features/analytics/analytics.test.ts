import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  resetAnalyticsAdapter,
  setAnalyticsAdapter,
  track,
  trackLandingViewed,
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
      category: 'dry_texting',
    })

    expect(adapter.track).toHaveBeenCalledWith({
      name: 'download_clicked',
      properties: {
        locale: 'sr',
        category: 'dry_texting',
      },
    })
  })

  it('isolates absent analytics and provider failures from the product', () => {
    expect(() => {
      track('landing_viewed', { locale: 'en' })
    }).not.toThrow()

    setAnalyticsAdapter({
      track() {
        throw new Error('provider unavailable')
      },
    })

    expect(() => {
      track('landing_viewed', { locale: 'en' })
    }).not.toThrow()
  })

  it('emits landing_viewed at most once per page lifetime', () => {
    const adapter = { track: vi.fn() }
    setAnalyticsAdapter(adapter)

    expect(
      trackLandingViewed({
        locale: 'en',
        source: 'telegram',
      }),
    ).toBe(true)
    expect(
      trackLandingViewed({ locale: 'sr' }),
    ).toBe(false)
    expect(adapter.track).toHaveBeenCalledOnce()
  })

  it('exposes a closed compile-time property contract', () => {
    const compileTimeContract = () => {
      track('verdict_generated', {
        locale: 'en',
        category: 'dry_texting',
        // @ts-expect-error User content is not an analytics property.
        message: 'must not compile',
      })

      track('share_completed', {
        locale: 'en',
        category: 'dry_texting',
        // @ts-expect-error Player names are not analytics properties.
        playerName: 'must not compile',
      })

      track('category_suggested', {
        locale: 'en',
        category: 'dry_texting',
        // @ts-expect-error Only high-confidence suggestions are allowed.
        confidence: 'low',
      })

      // @ts-expect-error Arbitrary event names are rejected.
      track('feedback_clicked', { locale: 'en' })
    }

    void compileTimeContract
    expect(true).toBe(true)
  })
})
