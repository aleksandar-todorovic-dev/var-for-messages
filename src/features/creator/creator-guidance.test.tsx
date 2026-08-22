import { createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { appReducer } from '../../app/app-reducer'
import { createInitialAppState } from '../../app/app-state'
import type { CreatorState } from '../../app/app-state'
import { getCategories, getUiCopy } from '../../content'
import { CategoryPicker } from './CategoryPicker'
import { CreatorForm } from './CreatorForm'
import {
  inspirationSetIndexes,
  pickInspirationSetIndex,
  type InspirationSetIndex,
} from './inspiration-sets'
import { MessageExamplesDisclosure } from './MessageExamplesDisclosure'

const approvedSets = {
  sr: [
    [
      'Krećem sad.',
      'K.',
      'Nisam video poruku.',
      'Ti biraj.',
      'Gde ovo vodi?',
    ],
    [
      'Samo što nisam.',
      'Okej.',
      'Telefon mi se ugasio.',
      'Kako hoćeš.',
      'Ko ti je ona?',
    ],
    [
      'Stižem.',
      'Mhm.',
      'Nisam imao signal.',
      'Ništa od toga.',
      'Jesmo mi zajedno?',
    ],
  ],
  en: [
    [
      'Leaving now.',
      'Okay.',
      "Didn't see your message.",
      'You choose.',
      'Where is this going?',
    ],
    [
      'Almost there.',
      'Sure.',
      'My phone died.',
      'Whatever you want.',
      'Who is she?',
    ],
    [
      'Be there soon.',
      'Mhm.',
      'Had no signal.',
      'None of those.',
      'Are we together?',
    ],
  ],
} as const

function renderCreatorForm(
  creatorOverrides: Partial<CreatorState> = {},
  inspirationSetIndex: InspirationSetIndex = 0,
) {
  const locale = creatorOverrides.locale ?? 'sr'
  const creator = {
    ...createInitialAppState(locale).creator,
    ...creatorOverrides,
  }

  return renderToStaticMarkup(
    <CreatorForm
      creator={creator}
      categories={getCategories(locale)}
      copy={getUiCopy(locale)}
      messageInputRef={createRef<HTMLTextAreaElement>()}
      focusMessageOnMount={false}
      inspirationSetIndex={inspirationSetIndex}
      onMessageChange={() => undefined}
      onPlayerNameChange={() => undefined}
      onCategoryChange={() => undefined}
      onSubmit={() => ({})}
    />,
  )
}

function renderExamplesDisclosure(
  locale: 'sr' | 'en',
  expanded: boolean,
  inspirationSetIndex: InspirationSetIndex = 0,
) {
  return renderToStaticMarkup(
    <MessageExamplesDisclosure
      copy={getUiCopy(locale).messageExamples}
      contentId="message-examples-test"
      expanded={expanded}
      inspirationSetIndex={inspirationSetIndex}
      onToggle={() => undefined}
    />,
  )
}

function decodeHtml(value: string) {
  return value
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
}

function readableText(html: string) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,?!])/g, '$1')
    .trim()
}

function renderedExamples(html: string) {
  return [...html.matchAll(/<li>(.*?)<\/li>/g)].map(
    ([, example]) => decodeHtml(example),
  )
}

describe('creator examples disclosure', () => {
  it('starts collapsed with an accessible control/content association', () => {
    const html = renderCreatorForm()

    expect(html).toContain('aria-expanded="false"')
    expect(html).toMatch(
      /aria-controls="([^"]+)"[^>]*>Treba ti ideja\? Pogledaj primere<\/button>/,
    )

    const contentId = html.match(/aria-controls="([^"]+)"/)?.[1]

    expect(contentId).toBeTruthy()
    expect(html).toContain(`id="${contentId}" hidden=""`)
  })

  it('renders accessible expanded and collapsed states without changing the set', () => {
    const openHtml = renderExamplesDisclosure('sr', true, 1)
    const closedAgainHtml = renderExamplesDisclosure('sr', false, 1)

    expect(openHtml).toContain('aria-expanded="true"')
    expect(openHtml).toContain(
      'aria-controls="message-examples-test"',
    )
    expect(openHtml).toContain('id="message-examples-test"')
    expect(openHtml).not.toContain('hidden=""')
    expect(closedAgainHtml).toContain('aria-expanded="false"')
    expect(closedAgainHtml).toContain(
      'id="message-examples-test" hidden=""',
    )
    expect(renderedExamples(openHtml)).toEqual(
      approvedSets.sr[1],
    )
    expect(renderedExamples(closedAgainHtml)).toEqual(
      approvedSets.sr[1],
    )
  })

  it('contains exactly three approved five-message sets per locale', () => {
    expect(getUiCopy('sr').messageExamples.sets).toEqual(
      approvedSets.sr,
    )
    expect(getUiCopy('en').messageExamples.sets).toEqual(
      approvedSets.en,
    )

    for (const locale of ['sr', 'en'] as const) {
      expect(getUiCopy(locale).messageExamples.sets).toHaveLength(3)

      for (const set of getUiCopy(locale).messageExamples.sets) {
        expect(set).toHaveLength(5)
      }
    }
  })

  it.each(['sr', 'en'] as const)(
    'renders exactly one approved %s set at a time',
    (locale) => {
      for (const index of inspirationSetIndexes) {
        const html = renderExamplesDisclosure(locale, true, index)

        expect(renderedExamples(html)).toEqual(
          approvedSets[locale][index],
        )
        expect(renderedExamples(html)).toHaveLength(5)
      }
    },
  )

  it('maps deterministic random values to set indexes without statistical tests', () => {
    expect([
      pickInspirationSetIndex(0),
      pickInspirationSetIndex(0.32),
      pickInspirationSetIndex(1 / 3),
      pickInspirationSetIndex(0.65),
      pickInspirationSetIndex(2 / 3),
      pickInspirationSetIndex(0.999_999),
    ]).toEqual([0, 0, 1, 1, 2, 2])
  })

  it('keeps one passed set index stable through typing and category changes', () => {
    const initialHtml = renderCreatorForm({}, 1)
    const typedHtml = renderCreatorForm(
      {
        message: 'Kako hoćeš.',
        suggestedCategoryId: 'planning_foul',
        suggestionConfidence: 'low',
      },
      1,
    )
    const confirmedHtml = renderCreatorForm(
      {
        message: 'Kako hoćeš.',
        suggestedCategoryId: 'planning_foul',
        selectedCategoryId: 'planning_foul',
        suggestionConfidence: 'low',
        categorySelectionSource: 'manual',
      },
      1,
    )

    expect(renderedExamples(initialHtml)).toEqual(
      approvedSets.sr[1],
    )
    expect(renderedExamples(typedHtml)).toEqual(
      approvedSets.sr[1],
    )
    expect(renderedExamples(confirmedHtml)).toEqual(
      approvedSets.sr[1],
    )
  })

  it('preserves the selected index when the locale changes', () => {
    expect(
      renderedExamples(renderExamplesDisclosure('sr', true, 2)),
    ).toEqual(approvedSets.sr[2])
    expect(
      renderedExamples(renderExamplesDisclosure('en', true, 2)),
    ).toEqual(approvedSets.en[2])
  })

  it.each([
    [
      'sr',
      'Treba ti ideja? Pogledaj primere',
      'Primeri, ne kompletna lista.',
    ],
    [
      'en',
      'Need an idea? See examples',
      'Examples, not a complete list.',
    ],
  ] as const)(
    'keeps the exact %s control and quiet note',
    (locale, control, note) => {
      const text = readableText(
        renderExamplesDisclosure(locale, true),
      )

      expect(text).toContain(control)
      expect(text).toContain(note)
    },
  )

  it('keeps the message value independent from disclosure content', () => {
    const html = renderCreatorForm(
      { message: 'My own message stays here.' },
      2,
    )

    expect(html).toMatch(
      /<textarea[^>]*>My own message stays here\.<\/textarea>/,
    )
    expect(renderedExamples(html)).toEqual(approvedSets.sr[2])
    expect(html).not.toMatch(
      /<textarea[^>]*>(?:Stižem\.|Mhm\.|Jesmo mi zajedno\?)<\/textarea>/,
    )
  })
})

describe('high, low, and no-suggestion creator guidance', () => {
  it('renders neither guidance state for an empty message', () => {
    const html = renderCreatorForm()

    expect(html).not.toContain(
      getUiCopy('sr').lowSuggestionGuidance,
    )
    expect(html).not.toContain(
      getUiCopy('sr').noClearSuggestionGuidance,
    )
    expect(html).not.toContain('category-picker')
  })

  it.each([
    ['sr', 'Važi.', 'dry_texting', 'Dry reply'],
    ['en', 'Leaving now.', 'time_wasting', 'On My Way'],
  ] as const)(
    'keeps the compact HIGH state in %s without helper copy',
    (locale, message, categoryId, categoryLabel) => {
      const html = renderCreatorForm({
        locale,
        message,
        suggestedCategoryId: categoryId,
        selectedCategoryId: categoryId,
        suggestionConfidence: 'high',
        categorySelectionSource: 'suggestion',
      })

      expect(readableText(html)).toContain(
        `${getUiCopy(locale).suggestionPrefix} ${categoryLabel} ✓`,
      )
      expect(html).toContain('category-picker--compact-confirmed')
      expect(html).not.toContain(
        getUiCopy(locale).lowSuggestionGuidance,
      )
      expect(html).not.toContain(
        getUiCopy(locale).noClearSuggestionGuidance,
      )
    },
  )

  it.each([
    [
      'sr',
      'A šta smo mi?',
      'emotional_offside',
      'Emotivni ofsajd',
      'VAR sumnja na: Emotivni ofsajd. Potvrdi ili izaberi drugi incident.',
    ],
    [
      'en',
      'Are we together?',
      'emotional_offside',
      'Emotional Offside',
      'VAR suspects: Emotional Offside. Confirm it or choose another incident.',
    ],
  ] as const)(
    'renders the exact %s LOW state with open options',
    (locale, message, categoryId, categoryLabel, expectedCopy) => {
      const html = renderCreatorForm({
        locale,
        message,
        suggestedCategoryId: categoryId,
        suggestionConfidence: 'low',
      })

      expect(readableText(html)).toContain(expectedCopy)
      expect(html).toContain(`<strong>${categoryLabel}</strong>`)
      expect(html).toContain('category-option--suggested')
      expect(html).toContain('category-picker__options--revealed')
      expect(html.match(/type="radio"/g)).toHaveLength(6)
      expect(html).not.toContain('category-picker--compact-confirmed')
      expect(html).not.toContain(
        getUiCopy(locale).noClearSuggestionGuidance,
      )
    },
  )

  it.each([
    [
      'sr',
      'Vidimo se sutra.',
      'VAR nije siguran koji je incident. Izaberi ga ručno — poruka i dalje može na pregled.',
    ],
    [
      'en',
      'See you tomorrow.',
      "VAR isn't sure which incident this is. Choose it manually — the message can still be reviewed.",
    ],
  ] as const)(
    'renders the exact %s NONE state with open options',
    (locale, message, expectedCopy) => {
      const html = renderCreatorForm({ locale, message })

      expect(readableText(html)).toContain(expectedCopy)
      expect(html).toContain('category-picker__options--revealed')
      expect(html.match(/type="radio"/g)).toHaveLength(6)
      expect(html).not.toContain(
        getUiCopy(locale).lowSuggestionGuidance,
      )
    },
  )

  it.each([
    [
      'sr',
      'Kako hoćeš.',
      'planning_foul',
      'planning_foul',
      'low',
      'Svejedno, ali ne to',
    ],
    [
      'en',
      'See you tomorrow.',
      null,
      'missed_chance',
      'none',
      'Missed Sitter',
    ],
  ] as const)(
    'replaces prior %s LOW/NONE guidance with compact manual confirmation',
    (
      locale,
      message,
      suggestedCategoryId,
      selectedCategoryId,
      suggestionConfidence,
      categoryLabel,
    ) => {
      const html = renderCreatorForm({
        locale,
        message,
        suggestedCategoryId,
        selectedCategoryId,
        suggestionConfidence,
        categorySelectionSource: 'manual',
      })

      expect(readableText(html)).toContain(
        `${getUiCopy(locale).selectedIncidentPrefix} ${categoryLabel} ✓`,
      )
      expect(html).toContain('category-picker--compact-confirmed')
      expect(html).not.toContain(
        getUiCopy(locale).lowSuggestionGuidance,
      )
      expect(html).not.toContain(
        getUiCopy(locale).noClearSuggestionGuidance,
      )
    },
  )

  it('keeps the existing category descriptions and examples unchanged', () => {
    expect(
      getCategories('sr').map(({ description, example }) => ({
        description,
        example,
      })),
    ).toEqual([
      {
        description:
          'Dolazak je najavljen. Kretanje nije potvrđeno.',
        example: 'Evo me za pet minuta.',
      },
      {
        description:
          'Odgovor je stigao. Znak života još nije potvrđen.',
        example: 'Važi.',
      },
      {
        description: 'Loš izgovor koji snimak lako obara.',
        example: 'Tek sad vidim poruku.',
      },
      {
        description:
          'Izbor je prepušten grupi. Pravo veta je zadržano.',
        example: 'Meni je svejedno.',
      },
      {
        description:
          'Emotivna linija je povučena pre nego što je igra počela.',
        example: 'A šta smo mi?',
      },
      {
        description:
          'Pitanje je bilo otvoreno. Odgovor je završio pored gola.',
        example: 'Odgovor na sve osim na pitanje.',
      },
    ])

    expect(
      getCategories('en').map(({ description, example }) => ({
        description,
        example,
      })),
    ).toEqual([
      {
        description: 'Arrival announced. Movement not confirmed.',
        example: 'I’m five minutes away.',
      },
      {
        description:
          'A reply arrived. Signs of life remain under review.',
        example: 'K.',
      },
      {
        description:
          'An excuse the replay is unlikely to support.',
        example: 'Sorry, just saw this.',
      },
      {
        description:
          'The choice was outsourced. Veto rights were retained.',
        example: 'Anything is fine.',
      },
      {
        description:
          'The emotional line arrived before the match had settled.',
        example: 'So what are we?',
      },
      {
        description: 'The chance was open. The reply went wide.',
        example: 'A reply to everything except the question.',
      },
    ])
  })
})

describe('pending versus settled category guidance', () => {
  it('keeps HIGH behavior, then hides premature NONE while HIGH edits toward LOW', () => {
    let state = createInitialAppState('en')
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Leaving now.',
    })
    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'time_wasting',
      confidence: 'high',
    })

    const highHtml = renderCreatorForm(state.creator)

    expect(highHtml).toContain(
      'category-picker--compact-confirmed',
    )
    expect(highHtml).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )

    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Are we together?',
    })

    const pendingHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(true)
    expect(pendingHtml).not.toContain('category-picker')
    expect(pendingHtml).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )
    expect(pendingHtml).not.toContain(
      getUiCopy('en').lowSuggestionGuidance,
    )
    expect(pendingHtml).not.toContain('type="radio"')

    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'emotional_offside',
      confidence: 'low',
    })

    const lowHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(false)
    expect(lowHtml).toContain(
      getUiCopy('en').lowSuggestionGuidance,
    )
    expect(lowHtml.match(/type="radio"/g)).toHaveLength(6)
    expect(lowHtml).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )
  })

  it('does not show NONE guidance while LOW edits toward a settled NONE result', () => {
    let state = createInitialAppState('sr')
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Aha.',
    })
    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'dry_texting',
      confidence: 'low',
    })
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Vidimo se sutra.',
    })

    const pendingHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(true)
    expect(pendingHtml).not.toContain('category-picker')
    expect(pendingHtml).not.toContain(
      getUiCopy('sr').noClearSuggestionGuidance,
    )
    expect(pendingHtml).not.toContain('type="radio"')

    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: null,
      confidence: 'none',
    })

    const noneHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(false)
    expect(noneHtml).toContain(
      getUiCopy('sr').noClearSuggestionGuidance,
    )
    expect(noneHtml.match(/type="radio"/g)).toHaveLength(6)
  })

  it('removes settled NONE immediately while editing toward HIGH', () => {
    let state = createInitialAppState('en')
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'See you tomorrow.',
    })
    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: null,
      confidence: 'none',
    })

    expect(readableText(renderCreatorForm(state.creator))).toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )

    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Leaving now.',
    })

    const pendingHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(true)
    expect(pendingHtml).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )
    expect(pendingHtml).not.toContain('category-picker')

    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'time_wasting',
      confidence: 'high',
    })

    const highHtml = renderCreatorForm(state.creator)

    expect(state.creator.categorySuggestionPending).toBe(false)
    expect(highHtml).toContain(
      'category-picker--compact-confirmed',
    )
    expect(highHtml).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )
  })

  it('keeps rapid non-manual edits pending until the newest result settles', () => {
    let state = createInitialAppState('en')
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Are we together?',
    })
    state = appReducer(state, {
      type: 'SET_MESSAGE',
      message: 'Leaving now.',
    })

    expect(state.creator.message).toBe('Leaving now.')
    expect(state.creator.categorySuggestionPending).toBe(true)
    expect(renderCreatorForm(state.creator)).not.toContain(
      'category-picker',
    )

    state = appReducer(state, {
      type: 'APPLY_CATEGORY_SUGGESTION',
      categoryId: 'time_wasting',
      confidence: 'high',
    })

    expect(state.creator.message).toBe('Leaving now.')
    expect(state.creator.categorySuggestionPending).toBe(false)
    expect(renderCreatorForm(state.creator)).toContain(
      'category-picker--compact-confirmed',
    )
  })
})

describe('CategoryPicker guidance boundary', () => {
  it('does not render LOW or NONE guidance for a high-confidence boundary state', () => {
    const html = renderToStaticMarkup(
      <CategoryPicker
        categories={getCategories('en')}
        copy={getUiCopy('en')}
        selectedCategoryId={null}
        suggestedCategoryId="dry_texting"
        suggestionConfidence="high"
        selectionSource={null}
        groupRef={createRef<HTMLFieldSetElement>()}
        onChange={() => undefined}
      />,
    )

    expect(html).not.toContain(
      getUiCopy('en').lowSuggestionGuidance,
    )
    expect(html).not.toContain(
      getUiCopy('en').noClearSuggestionGuidance,
    )
    expect(html).toContain('VAR suspects:')
  })
})
