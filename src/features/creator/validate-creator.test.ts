import { describe, expect, it } from 'vitest'
import { getUiCopy } from '../../content'
import { createInitialAppState } from '../../app/app-state'
import {
  hasCreatorErrors,
  validateCreator,
} from './validate-creator'

describe('validateCreator', () => {
  it('requires the message before asking for a category', () => {
    const state = createInitialAppState('sr')
    const errors = validateCreator(
      state.creator,
      getUiCopy('sr'),
    )

    expect(errors.message).toBeDefined()
    expect(errors.category).toBeUndefined()
  })

  it('requires a category once a message exists', () => {
    const state = createInitialAppState('sr')
    state.creator.message = 'Vidimo se večeras.'

    const errors = validateCreator(
      state.creator,
      getUiCopy('sr'),
    )

    expect(errors.message).toBeUndefined()
    expect(errors.category).toBeDefined()
  })

  it('accepts a valid creator state', () => {
    const state = createInitialAppState('sr')
    state.creator.message = 'Važi.'
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('sr'),
    )

    expect(hasCreatorErrors(errors)).toBe(false)
  })

  it('rejects visually empty zero-width-only messages', () => {
    const state = createInitialAppState('sr')
    state.creator.message = '​'
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('sr'),
    )

    expect(errors.message).toBe(
      getUiCopy('sr').validation.emptyMessage,
    )
  })

  it('rejects visually empty variation-selector-only messages', () => {
    const state = createInitialAppState('en')
    state.creator.message = '\uFE0F'
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('en'),
    )

    expect(errors.message).toBe(
      getUiCopy('en').validation.emptyMessage,
    )
  })

  it('validates the same trimmed message content shown by the counter', () => {
    const state = createInitialAppState('en')
    state.creator.message = `${' '.repeat(141)}ok`
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('en'),
    )

    expect(errors.message).toBeUndefined()
  })

  it('uses Unicode-aware message limits', () => {
    const state = createInitialAppState('en')
    state.creator.message = '😀'.repeat(141)
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('en'),
    )

    expect(errors.message).toBe(
      getUiCopy('en').validation.messageTooLong,
    )
  })

  it('rejects a player name above 24 characters', () => {
    const state = createInitialAppState('sr')
    state.creator.message = 'Krećem.'
    state.creator.playerName = 'A'.repeat(25)
    state.creator.selectedCategoryId = 'time_wasting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('sr'),
    )

    expect(errors.playerName).toBeDefined()
  })

  it('accepts 24 visible player-name characters with edge format padding', () => {
    const state = createInitialAppState('en')
    state.creator.message = 'ok'
    state.creator.playerName = `\u200B${'A'.repeat(24)}`
    state.creator.selectedCategoryId = 'dry_texting'

    const errors = validateCreator(
      state.creator,
      getUiCopy('en'),
    )

    expect(errors.playerName).toBeUndefined()
  })
})
