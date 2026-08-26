import { describe, expect, it } from 'vitest'
import { detectSocialInAppBrowser } from './detect-social-in-app-browser'

describe('detectSocialInAppBrowser', () => {
  it.each([
    {
      browser: 'Instagram Android',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/AP3A.241105.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.0.0 Mobile Safari/537.36 Instagram 366.0.0.34.86 Android',
      expected: 'instagram',
    },
    {
      browser: 'Instagram iOS',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22D63 Instagram 366.0.0.20.93',
      expected: 'instagram',
    },
    {
      browser: 'TikTok Android musical_ly WebView',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/AP3A.241105.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.0.0 Mobile Safari/537.36 AppName/musical_ly app_version/39.4.3 BytedanceWebview/d8a21c6',
      expected: 'tiktok',
    },
    {
      browser: 'TikTok iOS musical_ly WKWebView',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22D63 musical_ly_39.4.0 WKWebView/1',
      expected: 'tiktok',
    },
    {
      browser: 'TikTok direct token',
      userAgent:
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Mobile Safari/537.36 TikTok 39.4.3',
      expected: 'tiktok',
    },
    {
      browser: 'TikTok current trill style',
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Mobile Safari/537.36 trill_39.4.3 AppName/trill',
      expected: 'tiktok',
    },
    {
      browser: 'Android Chrome',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
      expected: null,
    },
    {
      browser: 'Android Brave',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36 Brave/1.75.180',
      expected: null,
    },
    {
      browser: 'iOS Safari',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
      expected: null,
    },
    {
      browser: 'generic Android WebView',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/AP3A.241105.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.0.0 Mobile Safari/537.36',
      expected: null,
    },
    {
      browser: 'other ByteDance WebView',
      userAgent:
        'Mozilla/5.0 (Linux; Android 15; wv) AppleWebKit/537.36 Mobile Safari/537.36 BytedanceWebview/d8a21c6 AppName/other_app',
      expected: null,
    },
  ] as const)(
    'returns $expected for $browser',
    ({ userAgent, expected }) => {
      expect(detectSocialInAppBrowser(userAgent)).toBe(
        expected,
      )
    },
  )

  it('matches supported tokens case-insensitively', () => {
    expect(
      detectSocialInAppBrowser(
        'Mozilla/5.0 appname/TRILL',
      ),
    ).toBe('tiktok')
    expect(
      detectSocialInAppBrowser(
        'Mozilla/5.0 INSTAGRAM 366.0',
      ),
    ).toBe('instagram')
  })
})
