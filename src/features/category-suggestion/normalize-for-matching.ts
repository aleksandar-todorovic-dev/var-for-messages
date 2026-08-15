import { normalizeMessageForDisplay } from '../../shared/utils/normalize-input'

export function normalizeForMatching(value: string) {
  return normalizeMessageForDisplay(value)
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
