export type SocialInAppBrowser = 'instagram' | 'tiktok'

export function detectSocialInAppBrowser(
  userAgent: string,
): SocialInAppBrowser | null {
  const normalizedUserAgent = userAgent.toLowerCase()

  if (normalizedUserAgent.includes('instagram')) {
    return 'instagram'
  }

  if (
    normalizedUserAgent.includes('musical_ly') ||
    normalizedUserAgent.includes('tiktok') ||
    normalizedUserAgent.includes('trill_') ||
    normalizedUserAgent.includes('appname/trill')
  ) {
    return 'tiktok'
  }

  return null
}
