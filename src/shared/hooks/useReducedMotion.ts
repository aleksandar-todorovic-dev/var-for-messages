import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY =
  '(prefers-reduced-motion: reduce)'

function readReducedMotionPreference() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(readReducedMotionPreference)

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      REDUCED_MOTION_QUERY,
    )

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
