/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getUiCopy } from '../../content'
import { LegalFooter } from './LegalFooter'
import {
  OPERATOR_NAME,
  PRIVACY_CONTACT,
  feedbackUrlByLocale,
  legalCopyByLocale,
} from './legal-content'

function privacyText(locale: 'sr' | 'en') {
  return legalCopyByLocale[locale].privacy.sections
    .flatMap((section) => [
      ...(section.paragraphs ?? []),
      ...(section.items ?? []),
    ])
    .join(' ')
}

function privacySectionText(
  locale: 'sr' | 'en',
  heading: string,
) {
  const section =
    legalCopyByLocale[locale].privacy.sections.find(
      (candidate) => candidate.heading === heading,
    )

  return section?.paragraphs?.join(' ') ?? ''
}

describe('bilingual legal surfaces', () => {
  it('keeps the locked creator privacy note in SR and EN', () => {
    expect(getUiCopy('sr').privacyNote).toBe(
      'Poruka i ime ostaju u tvom browseru. Ne unosi osetljive ili privatne podatke i koristi samo sadržaj koji smeš da koristiš i deliš.',
    )
    expect(getUiCopy('en').privacyNote).toBe(
      'Your message and player name stay in your browser. Don’t enter sensitive or private information, and only use content you’re allowed to use and share.',
    )
  })

  it.each([
    ['sr', 'https://tally.so/r/KYr5yV'],
    ['en', 'https://tally.so/r/ja86AE'],
  ] as const)(
    'renders legal, contact, notices, and feedback links for %s',
    (locale, feedbackUrl) => {
      const html = renderToStaticMarkup(
        <LegalFooter locale={locale} />,
      )

      expect(html).toContain(
        `href="mailto:${PRIVACY_CONTACT}"`,
      )
      expect(html).toContain(
        'href="/third-party-notices.txt"',
      )
      expect(html).toContain(`href="${feedbackUrl}"`)
      expect(html).toContain('target="_blank"')
      expect(html).toContain('rel="noopener noreferrer"')
      expect(html).toContain(
        legalCopyByLocale[locale].privacy.title,
      )
      expect(html).toContain(
        legalCopyByLocale[locale].terms.title,
      )
      expect(html).toContain(OPERATOR_NAME)
      expect(feedbackUrlByLocale[locale]).toBe(feedbackUrl)
    },
  )

  it('contains the locked independent/no-affiliation meanings', () => {
    expect(legalCopyByLocale.sr.affiliation).toBe(
      'VAR for Messages je nezavisna humoristička/parodijska aplikacija. Nije povezana sa FIFA, UEFA, IFAB, fudbalskim savezima, ligama, klubovima ili televizijskim emiterima.',
    )
    expect(legalCopyByLocale.en.affiliation).toBe(
      'VAR for Messages is an independent humor/parody application. It is not affiliated with FIFA, UEFA, IFAB, any football association, league, club, or broadcaster.',
    )
  })

  it('uses the non-anonymous feedback labels', () => {
    expect(legalCopyByLocale.sr.feedbackLink).toBe(
      'Povratne informacije',
    )
    expect(legalCopyByLocale.en.feedbackLink).toBe(
      'Feedback',
    )
  })

  it('accurately describes Tally identifiers and handling', () => {
    const srPrivacy = privacySectionText(
      'sr',
      'Opcione povratne informacije preko Tally-ja',
    )
    const enPrivacy = privacySectionText(
      'en',
      'Optional feedback through Tally',
    )

    expect(srPrivacy.toLowerCase()).not.toContain('anonim')
    expect(enPrivacy.toLowerCase()).not.toContain(
      'anonymous',
    )
    expect(srPrivacy).toContain(
      'Formular ne traži ime učesnika, email, telefon, društveni nalog, originalnu poruku, ime igrača, screenshot, audio ili video.',
    )
    expect(srPrivacy).toContain(
      'identifikatore podnošenja (Submission) i ispitanika (Respondent)',
    )
    expect(srPrivacy).toContain(
      'Respondent ID može ostati u localStorage-u kroz više formulara u istom Tally workspace-u',
    )
    expect(srPrivacy).toContain(
      'ne koristi te identifikatore da utvrdi stvarni identitet učesnika niti da pravi profil',
    )
    expect(srPrivacy).toContain(
      'Podacima iz formulara rukuje Tally kao eksterni provajder',
    )
    expect(srPrivacy).toContain(
      'najkasnije 30 dana posle odluke o pilotu',
    )
    expect(srPrivacy).toContain(
      'Ne obećavamo brisanje iz rezervnih kopija eksternog provajdera izvan onoga što možemo da kontrolišemo',
    )
    expect(enPrivacy).toContain(
      'The form does not ask for a participant name, email, phone number, social handle, original message, player name, screenshot, audio, or video.',
    )
    expect(enPrivacy).toContain(
      'technical Submission and Respondent identifiers',
    )
    expect(enPrivacy).toContain(
      'Respondent ID may persist in localStorage across forms in the same Tally workspace',
    )
    expect(enPrivacy).toContain(
      'does not use those identifiers to determine a participant’s real identity or build a profile',
    )
    expect(enPrivacy).toContain(
      'Form data is handled by Tally as the external provider',
    )
    expect(enPrivacy).toContain(
      'delete raw feedback from the active research dataset within 30 days after the pilot decision',
    )
    expect(enPrivacy).toContain(
      'cannot promise deletion from an external provider’s backups beyond what we control',
    )
  })

  it('describes Umami as privacy-minimized, not anonymous', () => {
    const srPrivacy = privacyText('sr')
    const enPrivacy = privacyText('en')

    expect(srPrivacy).toContain(
      'analitiku sa minimizovanim podacima',
    )
    expect(srPrivacy).toContain('umami.identify()')
    expect(srPrivacy).toContain('korisnički Distinct ID')
    expect(srPrivacy).toContain(
      'ne uvodi analitičke kolačiće',
    )
    expect(srPrivacy).toContain(
      'IP adresa, user agent i ID sajta',
    )
    expect(srPrivacy).toContain(
      'tehničke informacije o sesiji ili hash',
    )
    expect(srPrivacy).toContain(
      'sesije ne opisujemo kao apsolutno anonimne',
    )
    expect(enPrivacy).toContain('privacy-minimized analytics')
    expect(enPrivacy).toContain('umami.identify()')
    expect(enPrivacy).toContain('user Distinct ID')
    expect(enPrivacy).toContain('introduces no analytics cookies')
    expect(enPrivacy).toContain(
      'no session replay, heatmaps, or performance monitoring',
    )
    expect(enPrivacy).toContain(
      'IP address, user agent, and website ID',
    )
    expect(enPrivacy).toContain(
      'technical session information or a hash',
    )
    expect(enPrivacy).toContain(
      'do not describe sessions as absolutely anonymous',
    )
  })

  it('ships complete public license notices for the runtime graph', () => {
    const notices = readFileSync(
      new URL(
        '../../../public/third-party-notices.txt',
        import.meta.url,
      ),
      'utf8',
    )

    for (const runtimePackage of [
      '@fontsource/barlow-condensed 5.3.0',
      '@fontsource/inter 5.3.0',
      'html-to-image 1.11.13',
      'react 19.2.8',
      'react-dom 19.2.8',
      'scheduler 0.27.0',
    ]) {
      expect(notices).toContain(runtimePackage)
    }

    expect(notices).toContain(
      'SIL OPEN FONT LICENSE Version 1.1',
    )
    expect(notices).toContain(
      'Copyright (c) 2017-2025 W.Y.',
    )
    expect(notices).toContain(
      'Copyright (c) Meta Platforms, Inc. and affiliates.',
    )
  })
})
