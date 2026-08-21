export type ShareCapability = 'files' | 'text' | 'none'

export type ShareNavigator = {
  share?: (data?: ShareData) => Promise<void>
  canShare?: (data?: ShareData) => boolean
}

export type ShareVerdictResult = {
  status: 'shared' | 'cancelled' | 'unsupported'
  capability: ShareCapability
}

export function getShareCapability(
  navigatorLike: ShareNavigator,
  file: File,
): ShareCapability {
  if (!navigatorLike.share) {
    return 'none'
  }

  try {
    if (
      navigatorLike.canShare?.({
        files: [file],
      })
    ) {
      return 'files'
    }
  } catch {
    return 'text'
  }

  return 'text'
}

function isShareCancellation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  )
}

async function waitForVisibleFrame() {
  if (
    typeof document === 'undefined' ||
    typeof window === 'undefined' ||
    typeof window.requestAnimationFrame !== 'function'
  ) {
    return
  }

  await new Promise<void>((resolve) => {
    let finished = false
    let frameScheduled = false

    const finish = () => {
      if (finished) {
        return
      }

      finished = true
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )
      resolve()
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState !== 'visible' ||
        frameScheduled
      ) {
        return
      }

      frameScheduled = true

      try {
        window.requestAnimationFrame(() => {
          frameScheduled = false

          if (document.visibilityState === 'visible') {
            finish()
          }
        })
      } catch {
        finish()
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )
    handleVisibilityChange()
  })
}

export async function shareVerdictFile({
  navigatorLike,
  file,
  title,
  text,
}: {
  navigatorLike: ShareNavigator
  file: File
  title: string
  text: string
}): Promise<ShareVerdictResult> {
  const capability = getShareCapability(
    navigatorLike,
    file,
  )

  if (
    capability !== 'files' ||
    !navigatorLike.share
  ) {
    return {
      status: 'unsupported',
      capability,
    }
  }

  try {
    await navigatorLike.share({
      files: [file],
      title,
      text,
    })

    // Android can hand the payload to a native target while Chrome is
    // entering a hidden/frozen state. Complete the product flow only
    // after the page can reliably render UI and dispatch analytics.
    await waitForVisibleFrame()

    return {
      status: 'shared',
      capability,
    }
  } catch (error) {
    if (isShareCancellation(error)) {
      return {
        status: 'cancelled',
        capability,
      }
    }

    throw error
  }
}
