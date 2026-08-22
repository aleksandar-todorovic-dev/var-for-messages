import { useEffect, useRef } from 'react'
import {
  getCategories,
  getUiCopy,
  getVerdictVariantById,
} from '../../content'
import type {
  CreatorEntryFocus,
  CreatorFieldErrors,
  CreatorState,
} from '../../app/app-state'
import type {
  IncidentCategoryId,
  Locale,
} from '../../shared/types/domain'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import { LegalFooter } from '../legal/LegalFooter'
import { VerdictCard } from '../verdict/VerdictCard'
import { CreatorForm } from './CreatorForm'
import type { InspirationSetIndex } from './inspiration-sets'
import { LanguageSwitch } from './LanguageSwitch'
import './creator.css'
import './creator-qa.css'

type CreatorViewProps = {
  creator: CreatorState
  entryFocus: CreatorEntryFocus
  inspirationSetIndex: InspirationSetIndex
  onLocaleChange: (locale: Locale) => void
  onMessageChange: (message: string) => void
  onPlayerNameChange: (playerName: string) => void
  onCategoryChange: (
    categoryId: IncidentCategoryId,
  ) => void
  onSubmit: () => CreatorFieldErrors
}

const demoByLocale = {
  sr: {
    variantId: 'sr_time_5min_red',
    message: 'Evo me za pet minuta.',
  },
  en: {
    variantId: 'en_time_5min_red',
    message: 'I’m five minutes away.',
  },
} as const

export function CreatorView({
  creator,
  entryFocus,
  inspirationSetIndex,
  onLocaleChange,
  onMessageChange,
  onPlayerNameChange,
  onCategoryChange,
  onSubmit,
}: CreatorViewProps) {
  const copy = getUiCopy(creator.locale)
  const categories = getCategories(creator.locale)
  const demoConfig = demoByLocale[creator.locale]
  const demoVariant = getVerdictVariantById(
    creator.locale,
    demoConfig.variantId,
  )
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (entryFocus !== 'message') {
      return
    }

    const messageInput = messageInputRef.current

    if (!messageInput) {
      return
    }

    const scrollMessageIntoView = () => {
      if (document.activeElement !== messageInput) {
        return
      }

      messageInput.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      })
    }

    const animationFrame = window.requestAnimationFrame(
      scrollMessageIntoView,
    )
    const visualViewport = window.visualViewport

    visualViewport?.addEventListener(
      'resize',
      scrollMessageIntoView,
    )

    return () => {
      window.cancelAnimationFrame(animationFrame)
      visualViewport?.removeEventListener(
        'resize',
        scrollMessageIntoView,
      )
    }
  }, [entryFocus])

  if (!demoVariant) {
    throw new Error(
      `Missing creator demo variant: ${demoConfig.variantId}`,
    )
  }

  function handleHeroAction() {
    const messageInput = messageInputRef.current

    if (!messageInput) {
      return
    }

    // Keep focus synchronous so mobile browsers are allowed to open the
    // keyboard as a direct result of the user's tap.
    messageInput.focus({ preventScroll: true })

    window.requestAnimationFrame(() => {
      messageInput.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      })
    })
  }

  return (
    <main className="creator-page">
      <header className="creator-topbar">
        <div
          className="creator-wordmark"
          aria-label="VAR for Messages"
        >
          <span
            className="creator-wordmark__mark"
            aria-hidden="true"
          >
            VAR
          </span>
          <span>for Messages</span>
        </div>

        <LanguageSwitch
          locale={creator.locale}
          label={copy.languageLabel}
          onChange={onLocaleChange}
        />
      </header>

      <section className="creator-intro">
        <div className="creator-intro__copy">
          <p className="creator-kicker">
            {copy.creatorKicker}
          </p>
          <h1>{copy.headline}</h1>
          <p className="creator-intro__support">
            {copy.supportingText}
          </p>
          <button
            className="creator-intro__cta"
            type="button"
            onClick={handleHeroAction}
          >
            <span>{copy.heroCta}</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>

        <figure className="creator-demo">
          <figcaption>{copy.demoLabel}</figcaption>

          <div className="creator-demo__card">
            <VerdictCard
              locale={creator.locale}
              message={demoConfig.message}
              reviewLine={demoVariant.reviewLine}
              sanction={demoVariant.sanction}
              offense={demoVariant.offense}
              explanation={demoVariant.explanation}
              penalty={demoVariant.penalty}
              caseId={`#${demoVariant.caseCode}`}
              severity={demoVariant.severity}
            />
          </div>
        </figure>
      </section>

      <section
        className="creator-workspace"
        aria-labelledby="creator-form-title"
      >
        <div className="creator-workspace__intro">
          <p className="creator-kicker">
            {copy.newIncidentLabel}
          </p>
          <h2 id="creator-form-title">
            {copy.formHeadline}
          </h2>
        </div>

        <CreatorForm
          creator={creator}
          categories={categories}
          copy={copy}
          messageInputRef={messageInputRef}
          focusMessageOnMount={entryFocus === 'message'}
          inspirationSetIndex={inspirationSetIndex}
          onMessageChange={onMessageChange}
          onPlayerNameChange={onPlayerNameChange}
          onCategoryChange={onCategoryChange}
          onSubmit={onSubmit}
        />
      </section>

      <LegalFooter locale={creator.locale} />
    </main>
  )
}
