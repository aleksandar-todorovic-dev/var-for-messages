export function createCaseId(
  caseCode: string,
  occurrence = 1,
) {
  const normalizedCode = caseCode
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)

  if (!normalizedCode) {
    throw new Error('Case code must contain at least one ASCII character.')
  }

  if (occurrence <= 1) {
    return `#${normalizedCode}`
  }

  return `#${normalizedCode}-${String(occurrence).padStart(2, '0')}`
}
