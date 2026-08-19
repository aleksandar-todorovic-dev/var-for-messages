import type {
  AnalyticsEvent,
  AnalyticsEventMap,
  AnalyticsEventName,
} from './analytics-events'

export type AnalyticsAdapter = {
  track: (event: AnalyticsEvent) => void
}

const noopAdapter: AnalyticsAdapter = {
  track() {
    // Analytics is optional and must never block the product.
  },
}

let activeAdapter: AnalyticsAdapter = noopAdapter
let landingViewed = false

export function setAnalyticsAdapter(
  adapter: AnalyticsAdapter,
) {
  activeAdapter = adapter
}

export function resetAnalyticsAdapter() {
  activeAdapter = noopAdapter
  landingViewed = false
}

export function track<EventName extends AnalyticsEventName>(
  name: EventName,
  properties: AnalyticsEventMap[EventName],
) {
  try {
    activeAdapter.track({ name, properties } as AnalyticsEvent)
  } catch {
    // Analytics failures are deliberately isolated from product flow.
  }
}

export function trackLandingViewed(
  properties: AnalyticsEventMap['landing_viewed'],
) {
  if (landingViewed) {
    return false
  }

  landingViewed = true
  track('landing_viewed', properties)
  return true
}
