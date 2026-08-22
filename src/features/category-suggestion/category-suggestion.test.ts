import { describe, expect, it } from 'vitest'
import { getVerdictVariants } from '../../content'
import { normalizeMessageForDisplay } from '../../shared/utils/normalize-input'
import {
  categoryRules,
  type CategoryRule,
} from './category-rules'
import { matchCategoryRules } from './match-category-rules'
import { normalizeForMatching } from './normalize-for-matching'
import { suggestCategory } from './suggest-category'

const requiredRoutingCases = [
  ['sr', 'Krećem sad.', 'time_wasting', 'high'],
  ['sr', 'Evo me za pet minuta.', 'time_wasting', 'high'],
  ['sr', 'Samo što nisam.', 'time_wasting', 'high'],
  ['sr', 'Još malo.', 'time_wasting', 'low'],
  ['sr', 'Sad ću.', 'time_wasting', 'low'],
  ['sr', 'Kasnim 25 minuta.', null, 'none'],
  ['sr', 'K.', 'dry_texting', 'high'],
  ['sr', 'Važi.', 'dry_texting', 'high'],
  ['sr', 'Okej.', 'dry_texting', 'high'],
  ['sr', 'Dobro.', 'dry_texting', 'low'],
  ['sr', 'Aha.', 'dry_texting', 'low'],
  ['sr', 'Super.', null, 'none'],
  ['sr', 'Tek sad vidim poruku.', 'suspicious_excuse', 'high'],
  ['sr', 'Nisam video poruku.', 'suspicious_excuse', 'high'],
  ['sr', 'Telefon mi se ugasio.', 'suspicious_excuse', 'high'],
  ['sr', 'Sad vidim.', 'suspicious_excuse', 'low'],
  ['sr', 'Tek vidim.', 'suspicious_excuse', 'low'],
  ['sr', 'Nisam video.', 'suspicious_excuse', 'low'],
  ['sr', 'Nisam videla.', 'suspicious_excuse', 'low'],
  ['sr', 'E sad vidim šta si mislio.', null, 'none'],
  ['sr', 'Nisam video taj film.', null, 'none'],
  ['sr', 'Vidim.', null, 'none'],
  ['sr', 'Ti biraj.', 'planning_foul', 'high'],
  ['sr', 'Meni je svejedno.', 'planning_foul', 'high'],
  ['sr', 'Ništa od toga.', 'planning_foul', 'high'],
  ['sr', 'Ne tad, ne tamo.', 'planning_foul', 'low'],
  ['sr', 'Kako hoćeš.', 'planning_foul', 'low'],
  ['sr', 'Šta god.', 'planning_foul', 'low'],
  ['sr', 'Ne znam.', null, 'none'],
  ['sr', 'Može.', null, 'none'],
  ['sr', 'A šta smo mi?', 'emotional_offside', 'low'],
  ['sr', 'Gde ovo vodi?', 'emotional_offside', 'low'],
  ['sr', 'Ko ti je ona?', 'emotional_offside', 'low'],
  ['sr', 'Zašto si lajkovao?', 'emotional_offside', 'low'],
  ['sr', 'Jesmo mi zajedno?', 'emotional_offside', 'low'],
  ['sr', 'Šta je ovo između nas?', 'emotional_offside', 'low'],
  ['sr', 'Gde ovo ide?', 'emotional_offside', 'low'],
  ['sr', 'Volim te.', null, 'none'],
  ['sr', 'Nedostaješ mi.', null, 'none'],
  ['sr', 'Haha.', null, 'none'],
  ['sr', 'Hahaha.', null, 'none'],
  ['sr', 'Lol.', null, 'none'],
  ['sr', '?', null, 'none'],
  ['en', 'Leaving now.', 'time_wasting', 'high'],
  ['en', "I'm five minutes away.", 'time_wasting', 'high'],
  ['en', 'Almost there.', 'time_wasting', 'high'],
  ['en', 'Almost ready.', 'time_wasting', 'low'],
  ['en', 'Just a little longer.', 'time_wasting', 'low'],
  ['en', 'Back in 15 minutes.', null, 'none'],
  ['en', 'K.', 'dry_texting', 'high'],
  ['en', 'Okay.', 'dry_texting', 'high'],
  ['en', 'Sure.', 'dry_texting', 'high'],
  ['en', 'Fine.', 'dry_texting', 'high'],
  ['en', 'Mhm.', 'dry_texting', 'high'],
  ['en', 'Got it.', null, 'none'],
  ['en', 'Yeah.', null, 'none'],
  ['en', 'Great.', null, 'none'],
  ['en', 'Sorry, just saw this.', 'suspicious_excuse', 'high'],
  ['en', "Didn't see your message.", 'suspicious_excuse', 'high'],
  ['en', 'My phone died.', 'suspicious_excuse', 'high'],
  ['en', 'Just seeing this.', 'suspicious_excuse', 'low'],
  ['en', 'Seeing this now.', 'suspicious_excuse', 'low'],
  ['en', 'Just noticed this.', 'suspicious_excuse', 'low'],
  ['en', 'Seeing this now makes sense.', null, 'none'],
  ['en', "Didn't see that movie.", null, 'none'],
  ['en', 'You choose.', 'planning_foul', 'high'],
  ['en', 'Up to you.', 'planning_foul', 'high'],
  ['en', 'Anything is fine.', 'planning_foul', 'high'],
  ['en', 'None of those.', 'planning_foul', 'high'],
  ['en', 'Not then, not there.', 'planning_foul', 'low'],
  ['en', 'Whatever you want.', 'planning_foul', 'low'],
  ['en', "I don't know.", null, 'none'],
  ['en', 'So what are we?', 'emotional_offside', 'low'],
  ['en', 'Where is this going?', 'emotional_offside', 'low'],
  ['en', 'Who is she?', 'emotional_offside', 'low'],
  [
    'en',
    'Why did you like her photo?',
    'emotional_offside',
    'low',
  ],
  ['en', 'Are we together?', 'emotional_offside', 'low'],
  ['en', 'What is this between us?', 'emotional_offside', 'low'],
  ['en', 'I love you.', null, 'none'],
  ['en', 'I miss you.', null, 'none'],
  ['en', 'Haha.', null, 'none'],
  ['en', 'Hahaha.', null, 'none'],
  ['en', 'Lol.', null, 'none'],
  ['en', '?', null, 'none'],
] as const

const typedCategoryRules: readonly CategoryRule[] = categoryRules

describe('category suggestion', () => {
  it.each(requiredRoutingCases)(
    '%s routes "%s" to %s/%s',
    (locale, message, categoryId, confidence) => {
      expect(suggestCategory(locale, message)).toMatchObject({
        categoryId,
        confidence,
      })
    },
  )

  it('normalizes Serbian diacritics and punctuation', () => {
    expect(normalizeForMatching('  VAŽI.  ')).toBe('vazi')
  })

  it('ignores edge format characters without removing internal emoji joiners', () => {
    expect(normalizeForMatching('\u200B')).toBe('')
    expect(normalizeForMatching('\u200BVAŽI.\u200B')).toBe('vazi')
    expect(normalizeForMatching('👨‍👩‍👧‍👦')).toBe('👨‍👩‍👧‍👦')
  })

  it('treats standalone variation selectors as empty without damaging emoji sequences', () => {
    const heart = '❤️'
    const joinedEmoji = '👩‍❤️‍💋‍👩'

    expect(normalizeMessageForDisplay('\uFE0F')).toBe('')
    expect(normalizeForMatching('\uFE0F')).toBe('')
    expect(normalizeMessageForDisplay(heart)).toBe(heart)
    expect(normalizeMessageForDisplay(joinedEmoji)).toBe(
      joinedEmoji,
    )
  })

  it('matches concise replies padded with edge format characters', () => {
    for (const message of ['\u200Bok', 'ok\u200B']) {
      expect(suggestCategory('en', message)).toEqual({
        categoryId: 'dry_texting',
        confidence: 'high',
        matchedTriggerIds: ['en_short_reply'],
      })
    }
  })

  it('recognizes a high-confidence dry reply', () => {
    expect(suggestCategory('sr', 'Važi.')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['sr_vazi'],
    })
  })

  it('prefers a more specific time-wasting trigger', () => {
    expect(suggestCategory('sr', 'Krećem sad!')).toEqual({
      categoryId: 'time_wasting',
      confidence: 'high',
      matchedTriggerIds: ['sr_leaving_now'],
    })
  })

  it('recognizes Serbian without diacritics', () => {
    expect(
      suggestCategory('sr', 'Tek sad vidim, izvini.'),
    ).toMatchObject({
      categoryId: 'suspicious_excuse',
      confidence: 'high',
    })
  })

  it('keeps emotional offside low-confidence', () => {
    expect(suggestCategory('sr', 'A šta smo mi?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['sr_what_are_we_early'],
    })
  })

  it('keeps the Serbian status question low-confidence but distinct', () => {
    expect(suggestCategory('sr', 'Gde ovo vodi?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['sr_status_too_soon'],
    })
  })

  it('keeps the English status question low-confidence but distinct', () => {
    expect(suggestCategory('en', 'Where is this going?')).toEqual({
      categoryId: 'emotional_offside',
      confidence: 'low',
      matchedTriggerIds: ['en_status_too_soon'],
    })
  })

  it('recognizes independently authored English rules', () => {
    expect(
      suggestCategory('en', 'Sorry, just saw this.'),
    ).toMatchObject({
      categoryId: 'suspicious_excuse',
      confidence: 'high',
    })
  })

  it('routes a common short Serbian reply without pretending it was važi', () => {
    expect(suggestCategory('sr', 'OK.')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['sr_short_reply'],
    })
  })

  it('keeps missed-chance and broad observational cues out of suggestion', () => {
    expect(suggestCategory('sr', 'Hahaha.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })

    // Broad observational phrases must not become high-confidence excuse suggestions.
    expect(suggestCategory('sr', 'Nisam primetio novu frizuru.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('sr', 'E sad vidim šta si mislio.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', "Didn't notice the typo.")).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', 'Seeing this now makes sense.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })

  it('does not auto-select categories from broad unrelated phrases', () => {
    const cases = [
      ['sr', 'Nisam video taj film.'],
      ['sr', 'Telefon mi je bio na stolu.'],
      ['sr', 'Uskoro izlazi novi film.'],
      ['en', 'It doesn’t matter what happened.'],
      ['en', 'Wherever you go, I go.'],
    ] as const

    for (const [locale, message] of cases) {
      expect(suggestCategory(locale, message)).toEqual({
        categoryId: null,
        confidence: 'none',
        matchedTriggerIds: [],
      })
    }
  })

  it('normalizes thumbs-up skin-tone modifiers for reaction routing', () => {
    expect(suggestCategory('sr', '👍🏻')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['sr_reaction_only'],
    })
    expect(suggestCategory('en', '👍🏽')).toEqual({
      categoryId: 'dry_texting',
      confidence: 'high',
      matchedTriggerIds: ['en_reaction_only'],
    })
  })

  it('recognizes expanded planning and emotional-offside phrasing', () => {
    expect(suggestCategory('sr', 'Ne tad, ne tamo.')).toMatchObject({
      categoryId: 'planning_foul',
      confidence: 'low',
    })
    expect(suggestCategory('sr', 'Kuda ovo vodi?')).toMatchObject({
      categoryId: 'emotional_offside',
      confidence: 'low',
    })
  })

  it('matches phrases on normalized token boundaries', () => {
    expect(suggestCategory('sr', 'Kasnim 25 minuta.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
    expect(suggestCategory('en', 'Back in 15 minutes.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })

  it('maps every category rule to a compatible verdict bundle', () => {
    for (const rule of typedCategoryRules.filter(
      (candidate) => candidate.verdictSpecific !== false,
    )) {
      const variants = getVerdictVariants(
        rule.locale,
        rule.categoryId,
      )

      expect(
        variants.some((variant) =>
          variant.triggerIds?.includes(rule.triggerId),
        ),
      ).toBe(true)
    }
  })

  it('marks category-only cues as ineligible for specific verdicts', () => {
    expect(
      matchCategoryRules('sr', 'Sad vidim.')[0],
    ).toMatchObject({
      categoryId: 'suspicious_excuse',
      confidence: 'low',
      verdictSpecific: false,
    })

    expect(
      typedCategoryRules
        .filter((rule) => rule.verdictSpecific === false)
        .map((rule) => rule.triggerId),
    ).toEqual([
      'sr_dry_acknowledgment',
      'sr_partial_seen_excuse',
      'sr_open_choice',
      'sr_relationship_probe',
      'en_partial_seen_excuse',
      'en_open_choice',
      'en_relationship_probe',
    ])
  })

  it('returns no suggestion for an unmatched message', () => {
    expect(suggestCategory('sr', 'Vidimo se sutra.')).toEqual({
      categoryId: null,
      confidence: 'none',
      matchedTriggerIds: [],
    })
  })
})
