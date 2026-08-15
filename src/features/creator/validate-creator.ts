import type { UiCopy } from '../../content'
import {
  countCharacters,
  normalizeMessageForDisplay,
  normalizePlayerName,
} from '../../shared/utils/normalize-input'
import type {
  CreatorFieldErrors,
  CreatorState,
} from '../../app/app-state'

export const MESSAGE_LIMIT = 140
export const PLAYER_NAME_LIMIT = 24

export function validateCreator(
  creator: CreatorState,
  copy: UiCopy,
): CreatorFieldErrors {
  const errors: CreatorFieldErrors = {}
  const normalizedMessage = normalizeMessageForDisplay(
    creator.message,
  )
  const normalizedPlayerName = normalizePlayerName(
    creator.playerName,
  )

  if (!normalizedMessage) {
    errors.message = copy.validation.emptyMessage
  } else if (
    countCharacters(normalizedMessage) > MESSAGE_LIMIT
  ) {
    errors.message = copy.validation.messageTooLong
  }

  if (
    countCharacters(normalizedPlayerName) >
    PLAYER_NAME_LIMIT
  ) {
    errors.playerName = copy.validation.playerNameTooLong
  }

  if (normalizedMessage && !creator.selectedCategoryId) {
    errors.category = copy.validation.missingCategory
  }

  return errors
}

export function hasCreatorErrors(errors: CreatorFieldErrors) {
  return Object.values(errors).some(Boolean)
}
