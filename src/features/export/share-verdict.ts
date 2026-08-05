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
