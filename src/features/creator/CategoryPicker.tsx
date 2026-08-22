import {
  useState,
  type RefObject,
} from 'react'
import type {
  CategorySelectionSource,
} from '../../app/app-state'
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
  selectionSource: CategorySelectionSource
  error?: string
  groupRef: RefObject<HTMLFieldSetElement | null>
  onChange: (categoryId: IncidentCategoryId) => void
}

const optionsId = 'incident-category-options'

export function CategoryPicker({
  categories,
  copy,
  selectedCategoryId,
  suggestedCategoryId,
  suggestionConfidence,
  selectionSource,
  error,
  groupRef,
  onChange,
}: CategoryPickerProps) {
  const [pickerExpanded, setPickerExpanded] = useState(false)
  const suggestedCategory = categories.find(
    (category) => category.id === suggestedCategoryId,
  )
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  )
  const compactHighConfidence = Boolean(
    suggestedCategory &&
      suggestionConfidence === 'high' &&
      selectedCategoryId === suggestedCategoryId &&
      selectionSource === 'suggestion',
  )
  const compactManualSelection = Boolean(
    selectedCategory && selectionSource === 'manual',
  )
  const compactSelection =
    compactHighConfidence || compactManualSelection
  const showLowSuggestionGuidance = Boolean(
    suggestedCategory &&
      suggestionConfidence === 'low' &&
      selectionSource !== 'manual',
  )
  const showNoClearSuggestionGuidance =
    suggestedCategoryId === null &&
    suggestionConfidence === 'none' &&
    selectionSource !== 'manual'
  const compactCategory = compactManualSelection
    ? selectedCategory
    : compactHighConfidence
      ? suggestedCategory
      : undefined
  const showOptions = !compactSelection || pickerExpanded

  function handleCategoryChange(
    categoryId: IncidentCategoryId,
    preserveKeyboardFocus: boolean,
  ) {
    onChange(categoryId)
    setPickerExpanded(preserveKeyboardFocus)
  }

  return (
    <fieldset
      className={[
        'category-picker',
        compactSelection
          ? 'category-picker--compact-confirmed'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-describedby={
        error ? 'category-error' : undefined
      }
      aria-invalid={Boolean(error)}
      ref={groupRef}
      tabIndex={-1}
    >
      <legend
        className={
          compactSelection && !pickerExpanded
            ? 'category-picker__legend category-picker__legend--visually-hidden'
            : 'category-picker__legend'
        }
      >
        {copy.categoryPrompt}
      </legend>

      {compactCategory ? (
        <div className="category-suggestion category-suggestion--confirmed">
          <p aria-live="polite">
            <span>
              {compactManualSelection
                ? copy.selectedIncidentPrefix
                : copy.suggestionPrefix}
            </span>{' '}
            <strong>{compactCategory.label}</strong>
            <span
              className="category-suggestion__lock"
              aria-hidden="true"
            >
              ✓
            </span>
          </p>

          <button
            className="category-suggestion__toggle"
            type="button"
            aria-expanded={pickerExpanded}
            aria-controls={optionsId}
            onClick={() =>
              setPickerExpanded((expanded) => !expanded)
            }
          >
            {pickerExpanded
              ? copy.hideIncidents
              : copy.changeIncident}
          </button>
        </div>
      ) : suggestedCategory ? (
        <div className="category-suggestion">
          <p aria-live="polite">
            <span>{copy.suggestionPrefix}</span>{' '}
            <strong>{suggestedCategory.label}</strong>
            {showLowSuggestionGuidance ? (
              <>. {copy.lowSuggestionGuidance}</>
            ) : null}
          </p>
        </div>
      ) : null}

      {showNoClearSuggestionGuidance ? (
        <p className="category-picker__guidance">
          {copy.noClearSuggestionGuidance}
        </p>
      ) : null}

      {showOptions ? (
        <div
          className="category-picker__options category-picker__options--revealed"
          id={optionsId}
        >
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
                  onChange={(event) =>
                    handleCategoryChange(
                      category.id,
                      event.currentTarget.matches(
                        ':focus-visible',
                      ),
                    )
                  }
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
      ) : null}

      {error ? (
        <p className="field-error" id="category-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
