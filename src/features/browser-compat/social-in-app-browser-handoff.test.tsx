import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { createInitialAppState } from '../../app/app-state'
import { getUiCopy } from '../../content'
import { CreatorView } from '../creator/CreatorView'
import { VerdictView } from '../verdict/VerdictView'
import type { SocialInAppBrowser } from './detect-social-in-app-browser'

const verdict = {
  locale: 'sr',
  originalMessage: 'Evo me za pet minuta.',
  categoryId: 'time_wasting',
  severity: 'red',
  reviewLine: 'Da li je igrač uopšte krenuo?',
  sanction: 'Crveni karton',
  offense: 'Večnih pet minuta',
  explanation: 'Snimak potvrđuje prekršaj.',
  penalty: 'Fraza je suspendovana.',
  caseId: '#5MIN',
  variantId: 'sr_time_5min_red',
} as const

function readableText(html: string) {
  return html
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function renderCreator(browser: SocialInAppBrowser | null) {
  const creator = createInitialAppState('sr').creator

  return renderToStaticMarkup(
    <CreatorView
      socialInAppBrowser={browser}
      creator={creator}
      entryFocus="none"
      inspirationSetIndex={0}
      onLocaleChange={() => undefined}
      onMessageChange={() => undefined}
      onPlayerNameChange={() => undefined}
      onCategoryChange={() => undefined}
      onSubmit={() => ({})}
    />,
  )
}

function renderVerdict(browser: SocialInAppBrowser | null) {
  return renderToStaticMarkup(
    <VerdictView
      socialInAppBrowser={browser}
      verdict={verdict}
      onEdit={() => undefined}
      onShareCompleted={() => undefined}
      onShareFailed={() => undefined}
      onDownloadClicked={() => undefined}
      onReviewAnother={() => undefined}
    />,
  )
}

describe('social in-app browser handoff', () => {
  it.each(['instagram', 'tiktok'] as const)(
    'replaces the creator workflow for %s with only its platform instruction',
    (browser) => {
      const html = renderCreator(browser)
      const text = readableText(html)
      const copy = getUiCopy('sr').socialInAppBrowser
      const otherBrowser =
        browser === 'instagram' ? 'tiktok' : 'instagram'

      expect(html).toContain(
        'social-browser-handoff--creator',
      )
      expect(html).toContain('class="language-switch"')
      expect(html).not.toContain('class="creator-form"')
      expect(text).toContain(copy.instructions[browser])
      expect(text).not.toContain(
        copy.instructions[otherBrowser],
      )
      expect(text).toContain(copy.address)
    },
  )

  it('leaves the normal creator workflow unchanged', () => {
    const html = renderCreator(null)

    expect(html).toContain('class="creator-form"')
    expect(html).not.toContain('social-browser-handoff')
  })

  it('keeps the verdict card and replaces unreliable export controls', () => {
    const html = renderVerdict('instagram')
    const text = readableText(html)
    const copy = getUiCopy('sr')

    expect(html).toContain('class="verdict-card ')
    expect(html).toContain(
      'social-browser-handoff--verdict',
    )
    expect(html).toMatch(
      /id="social-browser-handoff-verdict-title" tabindex="-1"/,
    )
    expect(html).not.toContain(
      'verdict-view__button--share',
    )
    expect(html).not.toContain(
      'verdict-view__button--download',
    )
    expect(text).toContain(
      copy.socialInAppBrowser.verdict.body,
    )
    expect(text).toContain(copy.edit)
    expect(text).toContain(copy.reviewAnother)
  })

  it('leaves normal verdict export controls unchanged', () => {
    const html = renderVerdict(null)

    expect(html).toContain('verdict-view__button--share')
    expect(html).toContain('verdict-view__button--download')
    expect(html).not.toContain(
      'social-browser-handoff--verdict',
    )
  })
})
