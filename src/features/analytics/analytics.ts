import type { AnalyticsEventMap } from './analytics-events'

type AnalyticsProperties =
  AnalyticsEventMap[keyof AnalyticsEventMap]

export type AnalyticsAdapter = {
  track: (
    event: keyof AnalyticsEventMap,
    properties: AnalyticsProperties,
  ) => void
}

const noopAdapter: AnalyticsAdapter = {
  track() {
    // Intentionally empty until a privacy-reviewed provider is selected.
  },
}

let activeAdapter: AnalyticsAdapter = noopAdapter

export function setAnalyticsAdapter(
  adapter: AnalyticsAdapter,
) {
  activeAdapter = adapter
}

export function resetAnalyticsAdapter() {
  activeAdapter = noopAdapter
}

export function track<
  EventName extends keyof AnalyticsEventMap,
>(
  event: EventName,
  properties: AnalyticsEventMap[EventName],
) {
  try {
    activeAdapter.track(event, properties)
  } catch {
    // Analytics must never interrupt the product flow.
  }
}
