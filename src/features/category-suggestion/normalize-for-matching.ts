export function normalizeForMatching(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/[’‘`´']/g, '')
    .replace(/[“”„"]/g, ' ')
    .replace(/[.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
