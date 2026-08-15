export function countCharacters(value: string) {
  return Array.from(value).length
}

function trimIgnorableEdges(value: string) {
  return value.replace(
    /^[\s\p{Cf}\p{Variation_Selector}]+|[\s\p{Cf}]+$/gu,
    '',
  )
}

export function normalizeMessageForDisplay(value: string) {
  return trimIgnorableEdges(
    value
      .replace(/\r\n?/g, '\n')
      .replace(/\s*\n+\s*/g, ' '),
  )
}

export function normalizePlayerName(value: string) {
  return trimIgnorableEdges(value)
}
