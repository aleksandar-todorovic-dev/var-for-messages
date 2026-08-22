import type { Locale } from '../../shared/types/domain'
import {
  categoryRules,
  type CategoryRule,
} from './category-rules'
import { normalizeForMatching } from './normalize-for-matching'

export type TriggerMatch = Pick<
  CategoryRule,
  | 'triggerId'
  | 'locale'
  | 'categoryId'
  | 'confidence'
  | 'priority'
  | 'match'
  | 'suggest'
  | 'verdictSpecific'
>

function matchesNormalizedPhrase(
  normalizedMessage: string,
  normalizedValue: string,
) {
  return ` ${normalizedMessage} `.includes(` ${normalizedValue} `)
}

export function matchCategoryRules(
  locale: Locale,
  message: string,
): TriggerMatch[] {
  const normalizedMessage = normalizeForMatching(message)

  if (!normalizedMessage) {
    return []
  }

  return (categoryRules as readonly CategoryRule[])
    .filter((rule) => rule.locale === locale)
    .filter((rule) =>
      rule.values.some((value) => {
        const normalizedValue = normalizeForMatching(value)

        return rule.match === 'exact'
          ? normalizedMessage === normalizedValue
          : matchesNormalizedPhrase(
              normalizedMessage,
              normalizedValue,
            )
      }),
    )
    .map(
      ({
        triggerId,
        categoryId,
        confidence,
        priority,
        match,
        suggest,
        verdictSpecific,
        locale: ruleLocale,
      }) => ({
        triggerId,
        categoryId,
        confidence,
        priority,
        match,
        suggest,
        verdictSpecific,
        locale: ruleLocale,
      }),
    )
    .sort((left, right) => {
      if (left.priority !== right.priority) {
        return right.priority - left.priority
      }

      if (left.match !== right.match) {
        return left.match === 'exact' ? -1 : 1
      }

      return left.triggerId.localeCompare(right.triggerId)
    })
}
