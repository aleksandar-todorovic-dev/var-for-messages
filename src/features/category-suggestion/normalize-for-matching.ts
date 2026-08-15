export function normalizeForMatching(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/[’‘`´']/g, '')
    .replace(/[“”„"]/g, ' ')
    .replace(/[.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
