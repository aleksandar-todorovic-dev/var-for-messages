import { getVerdictVariants } from '../../content'
import type { VerdictVariant } from '../../content'
import type {
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
} from '../../shared/types/domain'
import { createCaseId } from '../../shared/utils/create-case-id'
import {
  normalizeMessageForDisplay,
  normalizePlayerName,
} from '../../shared/utils/normalize-input'
import { matchCategoryRules } from '../category-suggestion/match-category-rules'

type SelectVerdictVariantInput = {
  locale: Locale
  categoryId: IncidentCategoryId
  message: string
  lastVariantId?: string
}

type GenerateVerdictInput = SelectVerdictVariantInput & {
  playerName?: string
  caseOccurrence?: number
}

function excludeLastVariant(
  variants: readonly VerdictVariant[],
  lastVariantId?: string,
) {
  if (!lastVariantId || variants.length <= 1) {
    return variants
  }

  const alternatives = variants.filter(
    (variant) => variant.id !== lastVariantId,
  )

  return alternatives.length > 0 ? alternatives : variants
}

function selectNextFallbackVariant(
  variants: readonly VerdictVariant[],
  lastVariantId?: string,
) {
  if (!lastVariantId || variants.length <= 1) {
    return variants[0]
  }

  const lastVariantIndex = variants.findIndex(
    (variant) => variant.id === lastVariantId,
  )

  if (lastVariantIndex === -1) {
    return variants[0]
  }

  return variants[(lastVariantIndex + 1) % variants.length]
}

export function selectVerdictVariant({
  locale,
  categoryId,
  message,
  lastVariantId,
}: SelectVerdictVariantInput): VerdictVariant {
  const categoryVariants = getVerdictVariants(locale, categoryId)

  if (categoryVariants.length === 0) {
    throw new Error(
      `Missing verdict variants for ${locale}/${categoryId}.`,
    )
  }

  const triggerMatches = matchCategoryRules(locale, message).filter(
    (match) => match.categoryId === categoryId,
  )

  for (const match of triggerMatches) {
    const specificVariants = categoryVariants.filter((variant) =>
      variant.triggerIds?.includes(match.triggerId),
    )

    if (specificVariants.length > 0) {
      return excludeLastVariant(
        specificVariants,
        lastVariantId,
      )[0]
    }
  }

  const safeFallbackVariants = categoryVariants.filter(
    (variant) =>
      variant.fallback === true ||
      !variant.triggerIds ||
      variant.triggerIds.length === 0,
  )

  if (safeFallbackVariants.length > 0) {
    return selectNextFallbackVariant(
      safeFallbackVariants,
      lastVariantId,
    )
  }

  return selectNextFallbackVariant(categoryVariants, lastVariantId)
}

export function generateVerdict({
  locale,
  categoryId,
  message,
  playerName = '',
  lastVariantId,
  caseOccurrence = 1,
}: GenerateVerdictInput): GeneratedVerdict {
  const normalizedMessage = normalizeMessageForDisplay(message)

  if (!normalizedMessage) {
    throw new Error('Cannot generate a verdict from an empty message.')
  }

  const variant = selectVerdictVariant({
    locale,
    categoryId,
    message: normalizedMessage,
    lastVariantId,
  })

  const normalizedPlayerName = normalizePlayerName(playerName)

  return {
    locale,
    originalMessage: normalizedMessage,
    playerName: normalizedPlayerName || undefined,
    categoryId,
    severity: variant.severity,
    reviewLine: variant.reviewLine,
    sanction: variant.sanction,
    offense: variant.offense,
    explanation: variant.explanation,
    penalty: variant.penalty,
    caseId: createCaseId(variant.caseCode, caseOccurrence),
    variantId: variant.id,
  }
}
