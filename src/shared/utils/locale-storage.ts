import type { Locale } from '../types/domain'

export const LOCALE_STORAGE_KEY = 'var-for-messages:locale'

function isLocale(value: string | null): value is Locale {
  return value === 'sr' || value === 'en'
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'sr'
  }

  const storedLocale = window.localStorage.getItem(
    LOCALE_STORAGE_KEY,
  )

  if (isLocale(storedLocale)) {
    return storedLocale
  }

  return window.navigator.language.toLowerCase().startsWith('sr')
    ? 'sr'
    : 'en'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
