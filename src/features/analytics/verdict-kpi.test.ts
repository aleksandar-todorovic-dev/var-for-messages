import { describe, expect, it, vi } from 'vitest'
import { createVerdictKpiTracker } from './verdict-kpi'

describe('per-verdict KPI deduplication', () => {
  it('emits every KPI class at most once in one lifecycle', () => {
    const emit = vi.fn()
    const tracker = createVerdictKpiTracker(emit)
    const common = {
      locale: 'en' as const,
      category: 'dry_texting' as const,
    }

    expect(
      tracker.emitOnce('verdict_generated', common),
    ).toBe(false)

    tracker.startLifecycle()

    tracker.emitOnce('verdict_generated', common)
    expect(tracker.startLifecycle()).toBe(false)
    tracker.emitOnce('verdict_generated', common)
    tracker.emitOnce('share_completed', common)
    tracker.emitOnce('share_completed', common)
    tracker.emitOnce('download_clicked', common)
    tracker.emitOnce('download_clicked', common)
    tracker.emitOnce('review_another_clicked', common)
    tracker.emitOnce('review_another_clicked', common)
    tracker.emitOnce('share_failed', common)
    tracker.emitOnce('share_failed', common)
    tracker.emitOnce('category_suggested', {
      locale: 'en',
      category: 'time_wasting',
      confidence: 'high',
    })
    tracker.emitOnce('category_suggested', {
      locale: 'en',
      category: 'time_wasting',
      confidence: 'high',
    })
    tracker.emitOnce('category_overridden', {
      locale: 'en',
      fromCategory: 'time_wasting',
      toCategory: 'dry_texting',
    })
    tracker.emitOnce('category_overridden', {
      locale: 'en',
      fromCategory: 'time_wasting',
      toCategory: 'dry_texting',
    })

    expect(emit).toHaveBeenCalledTimes(7)
  })

  it('records only a high-confidence suggestion and its override', () => {
    const emit = vi.fn()
    const tracker = createVerdictKpiTracker(emit)

    tracker.startLifecycle()

    expect(
      tracker.emitCategorySuggestionOutcome({
        locale: 'en',
        suggestedCategory: 'time_wasting',
        suggestionConfidence: 'high',
        selectedCategory: 'dry_texting',
      }),
    ).toEqual({
      categorySuggested: true,
      categoryOverridden: true,
    })
    expect(
      tracker.emitCategorySuggestionOutcome({
        locale: 'en',
        suggestedCategory: 'time_wasting',
        suggestionConfidence: 'high',
        selectedCategory: 'dry_texting',
      }),
    ).toEqual({
      categorySuggested: false,
      categoryOverridden: false,
    })
    expect(emit).toHaveBeenNthCalledWith(
      1,
      'category_suggested',
      {
        locale: 'en',
        category: 'time_wasting',
        confidence: 'high',
      },
    )
    expect(emit).toHaveBeenNthCalledWith(
      2,
      'category_overridden',
      {
        locale: 'en',
        fromCategory: 'time_wasting',
        toCategory: 'dry_texting',
      },
    )
    expect(emit).toHaveBeenCalledTimes(2)
  })

  it('does not count a low-confidence suggestion or override', () => {
    const emit = vi.fn()
    const tracker = createVerdictKpiTracker(emit)

    tracker.startLifecycle()

    expect(
      tracker.emitCategorySuggestionOutcome({
        locale: 'sr',
        suggestedCategory: 'emotional_offside',
        suggestionConfidence: 'low',
        selectedCategory: 'planning_foul',
      }),
    ).toEqual({
      categorySuggested: false,
      categoryOverridden: false,
    })
    expect(emit).not.toHaveBeenCalled()
  })

  it('allows the next generated verdict to emit KPI classes again', () => {
    const emit = vi.fn()
    const tracker = createVerdictKpiTracker(emit)
    const properties = {
      locale: 'sr' as const,
      category: 'planning_foul' as const,
    }

    expect(tracker.startLifecycle()).toBe(true)
    expect(
      tracker.emitOnce('download_clicked', properties),
    ).toBe(true)
    expect(
      tracker.emitOnce('download_clicked', properties),
    ).toBe(false)

    tracker.finishLifecycle()
    expect(tracker.startLifecycle()).toBe(true)
    expect(
      tracker.emitOnce('download_clicked', properties),
    ).toBe(true)
    expect(emit).toHaveBeenCalledTimes(2)
  })
})
