import {
  incidentCategoryIds,
  locales,
} from '../../shared/types/domain'
import type { AnalyticsAdapter } from './analytics'
import {
  analyticsEventNames,
  recruitmentSources,
  type AnalyticsEvent,
  type AnalyticsEventName,
} from './analytics-events'

export const UMAMI_WEBSITE_ID =
  'ad1093ae-a95d-4145-8e8c-b709a7db329d'
export const UMAMI_SCRIPT_URL =
  'https://cloud.umami.is/script.js'
export const UMAMI_TRACKED_PATH = '/'
export const UMAMI_PRELOAD_QUEUE_LIMIT = 20

type UnknownRecord = Record<string, unknown>

export type SafeUmamiPayload = {
  website: typeof UMAMI_WEBSITE_ID
  url: typeof UMAMI_TRACKED_PATH
  name: AnalyticsEventName
  data: UnknownRecord
}

export type UmamiTracker = {
  track: (payload: SafeUmamiPayload) => unknown
}

declare global {
  interface Window {
    umami?: UmamiTracker
    varForMessagesAnalyticsGuard?: (
      type: unknown,
      payload: unknown,
    ) => SafeUmamiPayload | false
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function hasExactKeys(
  value: UnknownRecord,
  keys: readonly string[],
) {
  const actualKeys = Object.keys(value)

  return (
    actualKeys.length === keys.length &&
    actualKeys.every((key) => keys.includes(key))
  )
}

function isLocale(value: unknown) {
  return locales.some((locale) => locale === value)
}

function isCategory(value: unknown) {
  return incidentCategoryIds.some(
    (category) => category === value,
  )
}

function isRecruitmentSource(value: unknown) {
  return recruitmentSources.some(
    (source) => source === value,
  )
}

function isAllowedEventName(
  value: unknown,
): value is AnalyticsEventName {
  return analyticsEventNames.some(
    (eventName) => eventName === value,
  )
}

function hasSafeEventData(
  name: AnalyticsEventName,
  data: UnknownRecord,
) {
  if (name === 'landing_viewed') {
    const keys = Object.keys(data)
    const exactShape =
      keys.length >= 1 &&
      keys.length <= 2 &&
      keys.every(
        (key) => key === 'locale' || key === 'source',
      )

    return (
      exactShape &&
      isLocale(data.locale) &&
      (data.source === undefined ||
        isRecruitmentSource(data.source))
    )
  }

  if (name === 'category_overridden') {
    return (
      hasExactKeys(data, [
        'locale',
        'fromCategory',
        'toCategory',
      ]) &&
      isLocale(data.locale) &&
      isCategory(data.fromCategory) &&
      isCategory(data.toCategory)
    )
  }

  if (name === 'category_suggested') {
    return (
      hasExactKeys(data, [
        'locale',
        'category',
        'confidence',
      ]) &&
      isLocale(data.locale) &&
      isCategory(data.category) &&
      data.confidence === 'high'
    )
  }

  return (
    hasExactKeys(data, ['locale', 'category']) &&
    isLocale(data.locale) &&
    isCategory(data.category)
  )
}

export function guardUmamiPayload(
  type: unknown,
  payload: unknown,
): SafeUmamiPayload | false {
  if (
    type !== 'event' ||
    !isRecord(payload) ||
    !hasExactKeys(payload, [
      'website',
      'url',
      'name',
      'data',
    ]) ||
    payload.website !== UMAMI_WEBSITE_ID ||
    payload.url !== UMAMI_TRACKED_PATH ||
    !isAllowedEventName(payload.name) ||
    !isRecord(payload.data) ||
    !hasSafeEventData(payload.name, payload.data)
  ) {
    return false
  }

  return {
    website: UMAMI_WEBSITE_ID,
    url: UMAMI_TRACKED_PATH,
    name: payload.name,
    data: { ...payload.data },
  }
}

export function createSafeUmamiPayload(
  event: AnalyticsEvent,
) {
  return guardUmamiPayload('event', {
    website: UMAMI_WEBSITE_ID,
    url: UMAMI_TRACKED_PATH,
    name: event.name,
    data: event.properties,
  })
}

type DoNotTrackNavigator = {
  doNotTrack?: string | null
  msDoNotTrack?: string | null
}

export function isDoNotTrackEnabled(
  navigatorLike: DoNotTrackNavigator,
  windowDoNotTrack?: string | null,
) {
  return [
    navigatorLike.doNotTrack,
    navigatorLike.msDoNotTrack,
    windowDoNotTrack,
  ].some(
    (value) => value === '1' || value === 'yes',
  )
}

export function createUmamiAdapter(
  getTracker: () => UmamiTracker | undefined = () =>
    window.umami,
  dntEnabled: () => boolean = () =>
    isDoNotTrackEnabled(
      window.navigator,
      (
        window as Window & {
          doNotTrack?: string | null
        }
      ).doNotTrack,
    ),
): AnalyticsAdapter & {
  flushQueuedEvents: () => void
} {
  let queuedPayloads: SafeUmamiPayload[] = []
  let queueFlushed = false

  function hasDoNotTrack() {
    try {
      return dntEnabled()
    } catch {
      return true
    }
  }

  function availableTracker() {
    try {
      return getTracker()
    } catch {
      return undefined
    }
  }

  function send(
    tracker: UmamiTracker,
    payload: SafeUmamiPayload,
  ) {
    try {
      tracker.track(payload)
    } catch {
      // A provider failure must never interrupt product behavior.
    }
  }

  function flushQueuedEvents() {
    if (queueFlushed) {
      return
    }

    const tracker = availableTracker()

    if (!tracker) {
      return
    }

    queueFlushed = true
    const payloadsToFlush = queuedPayloads
    queuedPayloads = []

    if (hasDoNotTrack()) {
      return
    }

    for (const payload of payloadsToFlush) {
      if (hasDoNotTrack()) {
        return
      }

      send(tracker, payload)
    }
  }

  return {
    track(event) {
      if (hasDoNotTrack()) {
        return
      }

      const payload = createSafeUmamiPayload(event)

      if (!payload) {
        return
      }

      const tracker = availableTracker()

      if (tracker) {
        send(tracker, payload)
        return
      }

      if (
        !queueFlushed &&
        queuedPayloads.length < UMAMI_PRELOAD_QUEUE_LIMIT
      ) {
        queuedPayloads.push(payload)
      }
    },

    flushQueuedEvents,
  }
}

export function loadUmamiTracker(
  documentLike: Pick<Document, 'createElement' | 'head'> =
    document,
  onTrackerLoad: () => void = () => {},
) {
  const script = documentLike.createElement('script')

  script.defer = true
  script.src = UMAMI_SCRIPT_URL
  script.referrerPolicy = 'no-referrer'
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
  script.setAttribute(
    'data-domains',
    'varformessages.com,www.varformessages.com',
  )
  script.setAttribute('data-auto-track', 'false')
  script.setAttribute('data-exclude-search', 'true')
  script.setAttribute('data-exclude-hash', 'true')
  script.setAttribute('data-do-not-track', 'true')
  script.setAttribute(
    'data-before-send',
    'varForMessagesAnalyticsGuard',
  )
  script.onload = () => {
    try {
      onTrackerLoad()
    } catch {
      // Loading analytics must never interrupt the application.
    }
  }
  script.onerror = () => {
    // A blocked or unavailable tracker is an expected no-op state.
  }

  documentLike.head.append(script)
  return script
}
