import type { RefObject } from 'react'
import type { UiCopy } from '../../content'
import type { SocialInAppBrowser } from './detect-social-in-app-browser'
import './social-in-app-browser-handoff.css'

type SocialInAppBrowserHandoffProps = {
  browser: SocialInAppBrowser
  context: 'creator' | 'verdict'
  copy: UiCopy['socialInAppBrowser']
  headingRef?: RefObject<HTMLHeadingElement | null>
}

export function SocialInAppBrowserHandoff({
  browser,
  context,
  copy,
  headingRef,
}: SocialInAppBrowserHandoffProps) {
  const contextCopy = copy[context]
  const instruction = copy.instructions[browser]
  const headingId = `social-browser-handoff-${context}-title`
  const Heading = context === 'creator' ? 'h1' : 'h2'
  const platform =
    browser === 'instagram' ? 'Instagram' : 'TikTok'

  return (
    <section
      className={`social-browser-handoff social-browser-handoff--${context}`}
      aria-labelledby={headingId}
    >
      <div className="social-browser-handoff__lead">
        <p className="social-browser-handoff__kicker">
          {contextCopy.kicker}
        </p>
        <Heading
          ref={headingRef}
          className="social-browser-handoff__heading"
          id={headingId}
          tabIndex={headingRef ? -1 : undefined}
        >
          {contextCopy.heading}
        </Heading>
        <p className="social-browser-handoff__body">
          {contextCopy.body}
        </p>
      </div>

      <div className="social-browser-handoff__instruction">
        <p className="social-browser-handoff__platform">
          {platform}
        </p>
        <p className="social-browser-handoff__instruction-copy">
          {instruction}
        </p>
        <p className="social-browser-handoff__address">
          <span aria-hidden="true">↗</span>
          <strong>{copy.address}</strong>
        </p>
      </div>
    </section>
  )
}
