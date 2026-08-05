export function countCharacters(value: string) {
  return Array.from(value).length
}

export function normalizeMessageForDisplay(value: string) {
  return value
    .trim()
    .replace(/\r\n?/g, '\n')
    .replace(/\s*\n+\s*/g, ' ')
}

export function normalizePlayerName(value: string) {
  return value.trim()
}
