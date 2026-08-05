import {
  getCategories,
  getUiCopy,
  getVerdictVariantById,
} from '../../content'
import type {
  CreatorFieldErrors,
  CreatorState,
} from '../../app/app-state'
import type {
  GeneratedVerdict,
  IncidentCategoryId,
  Locale,
} from '../../shared/types/domain'
import { VerdictCard } from '../verdict/VerdictCard'
import { CreatorForm } from './CreatorForm'
import { LanguageSwitch } from './LanguageSwitch'
import './creator.css'

type CreatorViewProps = {
  creator: CreatorState
  preparedVerdict: GeneratedVerdict | null
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
  preparedVerdict,
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

  if (!demoVariant) {
    throw new Error(
      `Missing creator demo variant: ${demoConfig.variantId}`,
    )
  }

  return (
    <main className="creator-page">
      <header className="creator-topbar">
        <div className="creator-wordmark" aria-label="VAR for Messages">
          <span className="creator-wordmark__mark" aria-hidden="true">
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
          <p className="creator-kicker">{copy.creatorKicker}</p>
          <h1>{copy.headline}</h1>
          <p>{copy.supportingText}</p>
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
          <p className="creator-kicker">{copy.newIncidentLabel}</p>
          <h2 id="creator-form-title">{copy.formHeadline}</h2>
        </div>

        <CreatorForm
          creator={creator}
          categories={categories}
          copy={copy}
          preparedVariantId={
            preparedVerdict?.variantId
          }
          onMessageChange={onMessageChange}
          onPlayerNameChange={onPlayerNameChange}
          onCategoryChange={onCategoryChange}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  )
}
