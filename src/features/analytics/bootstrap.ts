import { setAnalyticsAdapter } from './analytics'
import type { RecruitmentSource } from './analytics-events'
import {
  consumeRecruitmentSource,
} from './recruitment-source'
import {
  createUmamiAdapter,
  guardUmamiPayload,
  loadUmamiTracker,
} from './umami'

export function initializeAnalytics(): RecruitmentSource | undefined {
  let source: RecruitmentSource | undefined

  try {
    source = consumeRecruitmentSource(
      window.location,
      window.history,
    )
  } catch {
    // Analytics bootstrap must never block the application.
  }

  try {
    window.varForMessagesAnalyticsGuard = guardUmamiPayload
    const adapter = createUmamiAdapter()

    setAnalyticsAdapter(adapter)
    loadUmamiTracker(document, adapter.flushQueuedEvents)
  } catch {
    // A blocked or unavailable tracker leaves the safe no-op behavior.
  }

  return source
}
