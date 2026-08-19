import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  resetAnalyticsAdapter,
  setAnalyticsAdapter,
  trackLandingViewed,
} from './analytics'
import { analyticsEventNames } from './analytics-events'
import {
  createSafeUmamiPayload,
  createUmamiAdapter,
  guardUmamiPayload,
  isDoNotTrackEnabled,
  loadUmamiTracker,
  UMAMI_PRELOAD_QUEUE_LIMIT,
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
  type UmamiTracker,
} from './umami'

afterEach(() => {
  resetAnalyticsAdapter()
})

function validPayload() {
  return {
    website: UMAMI_WEBSITE_ID,
    url: '/',
    name: 'verdict_generated',
    data: {
      locale: 'en',
      category: 'dry_texting',
    },
  }
}

describe('Umami privacy guard', () => {
  it('uses exactly the approved event vocabulary', () => {
    expect(analyticsEventNames).toEqual([
      'landing_viewed',
      'verdict_generated',
      'share_completed',
      'download_clicked',
      'review_another_clicked',
      'category_suggested',
      'category_overridden',
      'share_failed',
    ])
  })

  it('accepts and reconstructs a fixed-schema payload', () => {
    expect(
      guardUmamiPayload('event', validPayload()),
    ).toEqual(validPayload())
  })

  it('rejects free text and forbidden user-content properties', () => {
    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        data: {
          ...validPayload().data,
          message: 'DO_NOT_LEAK_MESSAGE_82917',
        },
      }),
    ).toBe(false)

    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        data: {
          ...validPayload().data,
          playerName: 'DO_NOT_LEAK_PLAYER_47261',
        },
      }),
    ).toBe(false)
  })

  it('rejects unknown events, categories, sources, and outer fields', () => {
    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        name: 'language_changed',
      }),
    ).toBe(false)
    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        data: {
          locale: 'en',
          category: 'invented_category',
        },
      }),
    ).toBe(false)
    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        name: 'landing_viewed',
        data: { locale: 'en', source: 'newsletter' },
      }),
    ).toBe(false)
    expect(
      guardUmamiPayload('event', {
        ...validPayload(),
        referrer: 'https://example.com/private?q=secret',
      }),
    ).toBe(false)
  })

  it('builds a payload with no default URL, referrer, or browser fields', () => {
    const payload = createSafeUmamiPayload({
      name: 'share_completed',
      properties: {
        locale: 'sr',
        category: 'planning_foul',
      },
    })

    expect(payload).toEqual({
      website: UMAMI_WEBSITE_ID,
      url: '/',
      name: 'share_completed',
      data: {
        locale: 'sr',
        category: 'planning_foul',
      },
    })
    expect(payload).not.toHaveProperty('referrer')
    expect(payload).not.toHaveProperty('hostname')
    expect(payload).not.toHaveProperty('title')
  })

  it('allows only the fixed high-confidence suggestion schema', () => {
    const categorySuggestedPayload = {
      ...validPayload(),
      name: 'category_suggested',
      data: {
        locale: 'en',
        category: 'dry_texting',
        confidence: 'high',
      },
    }

    expect(
      guardUmamiPayload(
        'event',
        categorySuggestedPayload,
      ),
    ).toEqual(categorySuggestedPayload)
    expect(
      guardUmamiPayload('event', {
        ...categorySuggestedPayload,
        data: {
          ...categorySuggestedPayload.data,
          confidence: 'low',
        },
      }),
    ).toBe(false)
    expect(
      guardUmamiPayload('event', {
        ...categorySuggestedPayload,
        data: {
          ...categorySuggestedPayload.data,
          phrase: 'must not leave the browser',
        },
      }),
    ).toBe(false)
  })

  it('queues a pre-load landing event and flushes it once on script load', () => {
    const trackPayload = vi.fn()
    const trackerState: { current?: UmamiTracker } = {}
    const adapter = createUmamiAdapter(
      () => trackerState.current,
      () => false,
    )
    const script = {
      defer: false,
      src: '',
      referrerPolicy: '',
      onload: null as null | (() => void),
      onerror: null as null | (() => void),
      setAttribute: vi.fn(),
    }
    const documentLike = {
      createElement: vi.fn(() => script),
      head: { append: vi.fn() },
    } as unknown as Pick<
      Document,
      'createElement' | 'head'
    >

    setAnalyticsAdapter(adapter)
    loadUmamiTracker(
      documentLike,
      adapter.flushQueuedEvents,
    )

    expect(
      trackLandingViewed({ locale: 'en' }),
    ).toBe(true)
    expect(
      trackLandingViewed({ locale: 'en' }),
    ).toBe(false)
    expect(trackPayload).not.toHaveBeenCalled()

    trackerState.current = { track: trackPayload }
    script.onload?.()
    script.onload?.()

    expect(trackPayload).toHaveBeenCalledOnce()
    expect(trackPayload).toHaveBeenCalledWith({
      website: UMAMI_WEBSITE_ID,
      url: '/',
      name: 'landing_viewed',
      data: { locale: 'en' },
    })
  })

  it('checks Do Not Track before queueing', () => {
    const trackPayload = vi.fn()
    const trackerState: { current?: UmamiTracker } = {}
    let dntEnabled = true
    const adapter = createUmamiAdapter(
      () => trackerState.current,
      () => dntEnabled,
    )

    adapter.track({
      name: 'landing_viewed',
      properties: { locale: 'en' },
    })

    dntEnabled = false
    trackerState.current = { track: trackPayload }
    adapter.flushQueuedEvents()

    expect(trackPayload).not.toHaveBeenCalled()
  })

  it('checks Do Not Track again before a one-time flush', () => {
    const trackPayload = vi.fn()
    const trackerState: { current?: UmamiTracker } = {}
    let dntEnabled = false
    const adapter = createUmamiAdapter(
      () => trackerState.current,
      () => dntEnabled,
    )

    adapter.track({
      name: 'verdict_generated',
      properties: {
        locale: 'sr',
        category: 'planning_foul',
      },
    })

    dntEnabled = true
    trackerState.current = { track: trackPayload }
    adapter.flushQueuedEvents()
    dntEnabled = false
    adapter.flushQueuedEvents()

    expect(trackPayload).not.toHaveBeenCalled()
  })

  it('keeps a blocked tracker non-fatal with a bounded queue', () => {
    const trackPayload = vi.fn()
    const trackerState: { current?: UmamiTracker } = {}
    const adapter = createUmamiAdapter(
      () => trackerState.current,
      () => false,
    )

    expect(() => {
      for (
        let index = 0;
        index < UMAMI_PRELOAD_QUEUE_LIMIT + 5;
        index += 1
      ) {
        adapter.track({
          name: 'verdict_generated',
          properties: {
            locale: 'en',
            category: 'dry_texting',
          },
        })
      }
    }).not.toThrow()

    trackerState.current = { track: trackPayload }
    adapter.flushQueuedEvents()

    expect(trackPayload).toHaveBeenCalledTimes(
      UMAMI_PRELOAD_QUEUE_LIMIT,
    )
  })

  it('safely no-ops when the tracker is absent', () => {
    const adapter = createUmamiAdapter(
      () => undefined,
      () => false,
    )

    expect(() =>
      adapter.track({
        name: 'landing_viewed',
        properties: { locale: 'en' },
      }),
    ).not.toThrow()
  })

  it('suppresses dispatch when Do Not Track is enabled', () => {
    const tracker = { track: vi.fn() }
    const adapter = createUmamiAdapter(
      () => tracker,
      () => true,
    )

    adapter.track({
      name: 'landing_viewed',
      properties: { locale: 'en' },
    })

    expect(tracker.track).not.toHaveBeenCalled()
    expect(
      isDoNotTrackEnabled({ doNotTrack: '1' }),
    ).toBe(true)
    expect(
      isDoNotTrackEnabled({ doNotTrack: '0' }),
    ).toBe(false)
  })

  it('configures the tracker with all locked privacy attributes', () => {
    const attributes = new Map<string, string>()
    const script = {
      defer: false,
      src: '',
      referrerPolicy: '',
      onload: null as null | (() => void),
      onerror: null as null | (() => void),
      setAttribute: vi.fn((name: string, value: string) => {
        attributes.set(name, value)
      }),
    }
    const append = vi.fn()
    const documentLike = {
      createElement: vi.fn(() => script),
      head: { append },
    } as unknown as Pick<Document, 'createElement' | 'head'>

    loadUmamiTracker(documentLike, () => {
      throw new Error('tracker initialization failed')
    })

    expect(script.src).toBe(UMAMI_SCRIPT_URL)
    expect(script.defer).toBe(true)
    expect(script.referrerPolicy).toBe('no-referrer')
    expect(Object.fromEntries(attributes)).toEqual({
      'data-website-id': UMAMI_WEBSITE_ID,
      'data-domains':
        'varformessages.com,www.varformessages.com',
      'data-auto-track': 'false',
      'data-exclude-search': 'true',
      'data-exclude-hash': 'true',
      'data-do-not-track': 'true',
      'data-before-send': 'varForMessagesAnalyticsGuard',
    })
    expect(attributes.has('data-performance')).toBe(false)
    expect(append).toHaveBeenCalledWith(script)
    expect(() => script.onload?.()).not.toThrow()
    expect(() => script.onerror?.()).not.toThrow()
    expect(append).toHaveBeenCalledOnce()
  })
})
