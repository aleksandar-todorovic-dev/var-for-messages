import type {
  IncidentCategoryId,
  Locale,
} from '../shared/types/domain'
import type {
  CategoryDefinition,
  UiCopy,
  VerdictVariant,
} from './content-types'
import { enCategories } from './en/categories'
import { enVerdicts } from './en/verdicts'
import { srCategories } from './sr/categories'
import { srVerdicts } from './sr/verdicts'
import { uiCopyByLocale } from './ui-copy'

const categoriesByLocale: Readonly<
  Record<Locale, readonly CategoryDefinition[]>
> = {
  sr: srCategories,
  en: enCategories,
}

const verdictsByLocale: Readonly<
  Record<Locale, readonly VerdictVariant[]>
> = {
  sr: srVerdicts,
  en: enVerdicts,
}

export const allCategories = [...srCategories, ...enCategories] as const
export const allVerdictVariants = [...srVerdicts, ...enVerdicts] as const

export function getCategories(locale: Locale) {
  return categoriesByLocale[locale]
}

export function getCategory(
  locale: Locale,
  categoryId: IncidentCategoryId,
) {
  return categoriesByLocale[locale].find(
    (category) => category.id === categoryId,
  )
}

export function getUiCopy(locale: Locale): UiCopy {
  return uiCopyByLocale[locale]
}

export function getVerdictVariants(
  locale: Locale,
  categoryId?: IncidentCategoryId,
) {
  const variants = verdictsByLocale[locale]

  if (!categoryId) {
    return variants
  }

  return variants.filter(
    (variant) => variant.categoryId === categoryId,
  )
}

export function getVerdictVariantById(
  locale: Locale,
  variantId: string,
) {
  return verdictsByLocale[locale].find(
    (variant) => variant.id === variantId,
  )
}

export type {
  CategoryDefinition,
  UiCopy,
  VerdictVariant,
} from './content-types'
