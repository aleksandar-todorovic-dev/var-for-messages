import type { Locale } from '../types/domain'

export const LOCALE_STORAGE_KEY = 'var-for-messages:locale'

function isLocale(value: string | null): value is Locale {
  return value === 'sr' || value === 'en'
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'sr'
  }

  try {
    const storedLocale = window.localStorage.getItem(
      LOCALE_STORAGE_KEY,
    )

    if (isLocale(storedLocale)) {
      return storedLocale
    }
  } catch {
    // Storage may be blocked; browser locale remains a safe fallback.
  }

  return window.navigator.language.toLowerCase().startsWith('sr')
    ? 'sr'
    : 'en'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Locale persistence is optional and must never break the app.
  }
}
