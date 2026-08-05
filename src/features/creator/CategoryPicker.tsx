import type { RefObject } from 'react'
import type { CategoryDefinition, UiCopy } from '../../content'
import type {
  IncidentCategoryId,
  SuggestionConfidence,
} from '../../shared/types/domain'

type CategoryPickerProps = {
  categories: readonly CategoryDefinition[]
  copy: UiCopy
  selectedCategoryId: IncidentCategoryId | null
  suggestedCategoryId: IncidentCategoryId | null
  suggestionConfidence: SuggestionConfidence
  error?: string
  groupRef: RefObject<HTMLFieldSetElement | null>
  onChange: (categoryId: IncidentCategoryId) => void
}

export function CategoryPicker({
  categories,
  copy,
  selectedCategoryId,
  suggestedCategoryId,
  suggestionConfidence,
  error,
  groupRef,
  onChange,
}: CategoryPickerProps) {
  const suggestedCategory = categories.find(
    (category) => category.id === suggestedCategoryId,
  )

  return (
    <fieldset
      className="category-picker"
      aria-describedby={
        error ? 'category-error' : undefined
      }
      aria-invalid={Boolean(error)}
      ref={groupRef}
      tabIndex={-1}
    >
      <legend>{copy.categoryPrompt}</legend>

      {suggestedCategory ? (
        <div className="category-suggestion" aria-live="polite">
          <p>
            <span>{copy.suggestionPrefix}</span>{' '}
            <strong>{suggestedCategory.label}</strong>
          </p>
          <span className="category-suggestion__meta">
            {suggestionConfidence === 'high'
              ? copy.changeIncident
              : copy.confirmIncident}
          </span>
        </div>
      ) : null}

      <div className="category-picker__options">
        {categories.map((category) => {
          const isSuggested =
            category.id === suggestedCategoryId

          return (
            <label
              className={[
                'category-option',
                selectedCategoryId === category.id
                  ? 'category-option--selected'
                  : '',
                isSuggested
                  ? 'category-option--suggested'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={category.id}
            >
              <input
                type="radio"
                name="incident-category"
                value={category.id}
                checked={selectedCategoryId === category.id}
                onChange={() => onChange(category.id)}
              />

              <span
                className="category-option__indicator"
                aria-hidden="true"
              />

              <span className="category-option__copy">
                <span className="category-option__heading">
                  <strong>{category.label}</strong>
                  {isSuggested ? (
                    <span className="category-option__suggested-mark">
                      VAR
                    </span>
                  ) : null}
                </span>

                <span className="category-option__description">
                  {category.description}
                </span>

                <span className="category-option__example">
                  {category.example}
                </span>
              </span>
            </label>
          )
        })}
      </div>

      {error ? (
        <p className="field-error" id="category-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
