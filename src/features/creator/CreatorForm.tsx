import {
  useRef,
  type FormEvent,
} from 'react'
import type {
  CategoryDefinition,
  UiCopy,
} from '../../content'
import type {
  CreatorFieldErrors,
  CreatorState,
} from '../../app/app-state'
import type { IncidentCategoryId } from '../../shared/types/domain'
import { countCharacters } from '../../shared/utils/normalize-input'
import { CategoryPicker } from './CategoryPicker'
import {
  MESSAGE_LIMIT,
  PLAYER_NAME_LIMIT,
} from './validate-creator'

type CreatorFormProps = {
  creator: CreatorState
  categories: readonly CategoryDefinition[]
  copy: UiCopy
  preparedVariantId?: string
  onMessageChange: (message: string) => void
  onPlayerNameChange: (playerName: string) => void
  onCategoryChange: (
    categoryId: IncidentCategoryId,
  ) => void
  onSubmit: () => CreatorFieldErrors
}

export function CreatorForm({
  creator,
  categories,
  copy,
  preparedVariantId,
  onMessageChange,
  onPlayerNameChange,
  onCategoryChange,
  onSubmit,
}: CreatorFormProps) {
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const playerNameRef = useRef<HTMLInputElement>(null)
  const categoryGroupRef =
    useRef<HTMLFieldSetElement>(null)

  const messageLength = countCharacters(creator.message)
  const playerNameLength = countCharacters(
    creator.playerName,
  )

  function focusFirstError(errors: CreatorFieldErrors) {
    window.requestAnimationFrame(() => {
      if (errors.message) {
        messageRef.current?.focus()
        return
      }

      if (errors.playerName) {
        playerNameRef.current?.focus()
        return
      }

      if (errors.category) {
        categoryGroupRef.current?.focus()
      }
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = onSubmit()
    focusFirstError(errors)
  }

  return (
    <form
      className="creator-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="creator-form__decision-line" aria-hidden="true" />

      <div className="creator-field">
        <div className="creator-field__header">
          <label htmlFor="incident-message">
            {copy.messageLabel}
          </label>
          <span
            className={
              messageLength > MESSAGE_LIMIT
                ? 'character-count character-count--over'
                : 'character-count'
            }
          >
            {messageLength}/{MESSAGE_LIMIT}
          </span>
        </div>

        <textarea
          id="incident-message"
          ref={messageRef}
          rows={5}
          value={creator.message}
          placeholder={copy.messagePlaceholder}
          aria-invalid={Boolean(creator.errors.message)}
          aria-describedby={
            creator.errors.message
              ? 'message-error privacy-note'
              : 'privacy-note'
          }
          onChange={(event) =>
            onMessageChange(event.target.value)
          }
        />

        {creator.errors.message ? (
          <p className="field-error" id="message-error">
            {creator.errors.message}
          </p>
        ) : null}
      </div>

      <div className="creator-field creator-field--compact">
        <div className="creator-field__header">
          <label htmlFor="player-name">
            {copy.playerNameLabel}
          </label>
          <span
            className={
              playerNameLength > PLAYER_NAME_LIMIT
                ? 'character-count character-count--over'
                : 'character-count'
            }
          >
            {playerNameLength}/{PLAYER_NAME_LIMIT}
          </span>
        </div>

        <input
          id="player-name"
          ref={playerNameRef}
          type="text"
          value={creator.playerName}
          aria-invalid={Boolean(
            creator.errors.playerName,
          )}
          aria-describedby={
            creator.errors.playerName
              ? 'player-name-error'
              : undefined
          }
          onChange={(event) =>
            onPlayerNameChange(event.target.value)
          }
        />

        {creator.errors.playerName ? (
          <p className="field-error" id="player-name-error">
            {creator.errors.playerName}
          </p>
        ) : null}
      </div>

      <CategoryPicker
        categories={categories}
        copy={copy}
        selectedCategoryId={creator.selectedCategoryId}
        suggestedCategoryId={creator.suggestedCategoryId}
        suggestionConfidence={creator.suggestionConfidence}
        error={creator.errors.category}
        groupRef={categoryGroupRef}
        onChange={onCategoryChange}
      />

      <div className="creator-form__closing">
        <p className="creator-form__privacy" id="privacy-note">
          {copy.privacyNote}
        </p>

        <button className="creator-form__submit" type="submit">
          <span>{copy.reviewButton}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {preparedVariantId ? (
        <p className="creator-runtime-check" aria-live="polite">
          Runtime check · verdict bundle prepared ·{' '}
          <code>{preparedVariantId}</code>
        </p>
      ) : null}
    </form>
  )
}
