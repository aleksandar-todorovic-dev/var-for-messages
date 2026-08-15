import {
  allCategories,
  allVerdictVariants,
  getCategories,
  getUiCopy,
  getVerdictVariants,
} from '.'
import {
  incidentCategoryIds,
  locales,
} from '../shared/types/domain'
import { countCharacters } from '../shared/utils/normalize-input'

const expectedVariantCounts = {
  time_wasting: 5,
  dry_texting: 5,
  suspicious_excuse: 4,
  planning_foul: 4,
  emotional_offside: 4,
  missed_chance: 4,
} as const

const contentBudgets = {
  reviewLine: 55,
  sanction: 18,
  offense: 32,
  explanation: 110,
  penalty: 90,
  caseCode: 8,
} as const

export function validateContentLibrary() {
  const issues: string[] = []
  const variantIds = new Set<string>()

  for (const locale of locales) {
    const categories = getCategories(locale)
    const copy = getUiCopy(locale)

    if (categories.length !== incidentCategoryIds.length) {
      issues.push(
        `${locale} must define ${incidentCategoryIds.length} categories.`,
      )
    }

    for (const categoryId of incidentCategoryIds) {
      const category = categories.find(
        (item) => item.id === categoryId,
      )

      if (!category) {
        issues.push(`${locale} is missing category ${categoryId}.`)
      }

      const variants = getVerdictVariants(locale, categoryId)

      const expectedVariantCount = expectedVariantCounts[categoryId]

      if (variants.length !== expectedVariantCount) {
        issues.push(
          `${locale}/${categoryId} must define exactly ${expectedVariantCount} variants.`,
        )
      }

      const fallbackVariants = variants.filter(
        (variant) => variant.fallback === true,
      )

      if (fallbackVariants.length !== 1) {
        issues.push(
          `${locale}/${categoryId} must define exactly 1 safe fallback variant.`,
        )
      }

      if (
        fallbackVariants.some(
          (variant) => (variant.triggerIds?.length ?? 0) > 0,
        )
      ) {
        issues.push(
          `${locale}/${categoryId} fallback must not have trigger IDs.`,
        )
      }
    }

    if (copy.reviewingStatuses.length !== 3) {
      issues.push(`${locale} must define exactly 3 review statuses.`)
    }
  }

  for (const category of allCategories) {
    if (!category.label.trim()) {
      issues.push(`${category.locale}/${category.id} has no label.`)
    }

    if (!category.description.trim()) {
      issues.push(
        `${category.locale}/${category.id} has no description.`,
      )
    }

    if (!category.example.trim()) {
      issues.push(`${category.locale}/${category.id} has no example.`)
    }
  }

  for (const variant of allVerdictVariants) {
    if (variantIds.has(variant.id)) {
      issues.push(`Duplicate variant ID: ${variant.id}.`)
    }

    variantIds.add(variant.id)

    const fields = [
      ['reviewLine', variant.reviewLine],
      ['sanction', variant.sanction],
      ['offense', variant.offense],
      ['explanation', variant.explanation],
      ['penalty', variant.penalty],
      ['caseCode', variant.caseCode],
    ] as const

    for (const [field, value] of fields) {
      if (!value.trim()) {
        issues.push(`${variant.id} has an empty ${field}.`)
      }

      if (countCharacters(value) > contentBudgets[field]) {
        issues.push(
          `${variant.id}.${field} exceeds ${contentBudgets[field]} characters.`,
        )
      }
    }

    if (!/^[A-Z0-9]+$/.test(variant.caseCode)) {
      issues.push(`${variant.id} has a non-ASCII case code.`)
    }

    for (const triggerId of variant.triggerIds ?? []) {
      if (!/^[a-z0-9_]+$/.test(triggerId)) {
        issues.push(
          `${variant.id} has an invalid trigger ID: ${triggerId}.`,
        )
      }
    }
  }

  return issues
}
