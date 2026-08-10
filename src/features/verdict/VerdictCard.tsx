import { getUiCopy } from '../../content'
import type {
  LaunchSeverity,
  Locale,
} from '../../shared/types/domain'
import './verdict-card.css'

export type VerdictSeverity = LaunchSeverity

export type VerdictCardContent = {
  message: string
  reviewLine: string
  sanction: string
  offense: string
  explanation: string
  penalty: string
  caseId: string
  severity: VerdictSeverity
  playerName?: string
  locale?: Locale
  originLabel?: string
}

type VerdictCardProps = VerdictCardContent & {
  exportMode?: boolean
}

function getMessageSize(message: string) {
  const length = Array.from(message.trim()).length

  if (length <= 40) {
    return 'short'
  }

  if (length <= 90) {
    return 'medium'
  }

  return 'long'
}

function getQuotationMarks(locale: Locale) {
  return locale === 'sr'
    ? { open: '„', close: '“' }
    : { open: '“', close: '”' }
}

export function VerdictCard({
  message,
  reviewLine,
  sanction,
  offense,
  explanation,
  penalty,
  caseId,
  severity,
  playerName,
  locale = 'sr',
  originLabel = 'varformessages.com',
  exportMode = false,
}: VerdictCardProps) {
  const messageSize = getMessageSize(message)
  const copy = getUiCopy(locale).card
  const quotationMarks = getQuotationMarks(locale)

  return (
    <article
      className={[
        'verdict-card',
        `verdict-card--${severity}`,
        `verdict-card--message-${messageSize}`,
        exportMode ? 'verdict-card--export' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      lang={locale === 'sr' ? 'sr-Latn' : 'en'}
      aria-label={`${sanction}: ${offense}`}
    >
      <div className="verdict-card__decision-line" aria-hidden="true" />

      <header className="verdict-card__header">
        <p className="verdict-card__eyebrow">
          {copy.reviewLabel}
        </p>
        <p className="verdict-card__case">
          {copy.caseLabel} {caseId}
        </p>
      </header>

      <section className="verdict-card__evidence">
        <div className="verdict-card__evidence-meta">
          <p className="verdict-card__label">
            {copy.evidenceLabel}
          </p>
          {playerName ? (
            <p className="verdict-card__player">
              {copy.playerLabel}: <span>{playerName}</span>
            </p>
          ) : null}
        </div>

        <blockquote className="verdict-card__message">
          {quotationMarks.open}
          {message}
          {quotationMarks.close}
        </blockquote>
      </section>

      <section className="verdict-card__review">
        <p className="verdict-card__label">
          {copy.reviewCheckLabel}
        </p>
        <p className="verdict-card__review-copy">
          {reviewLine}
        </p>
      </section>

      <section className="verdict-card__decision">
        <span
          className="verdict-card__severity-mark"
          aria-hidden="true"
        >
          <span className="verdict-card__severity-lock" />
        </span>

        <p className="verdict-card__decision-kicker">
          {copy.finalDecisionLabel}
        </p>
        <h2 className="verdict-card__sanction">
          {sanction}
        </h2>
        <p className="verdict-card__offense">
          {offense}
        </p>
      </section>

      <section className="verdict-card__explanation">
        <p className="verdict-card__label">
          {copy.explanationLabel}
        </p>
        <p className="verdict-card__explanation-copy">
          {explanation}
        </p>
      </section>

      <footer className="verdict-card__penalty">
        <p className="verdict-card__penalty-label">
          {copy.penaltyLabel}
        </p>
        <p className="verdict-card__penalty-copy">
          {penalty}
        </p>
        <p className="verdict-card__attribution">
          <span>VAR for Messages</span>
          {originLabel ? (
            <>
              <span
                className="verdict-card__attribution-separator"
                aria-hidden="true"
              >
                ·
              </span>
              <span className="verdict-card__origin">
                {originLabel}
              </span>
            </>
          ) : null}
        </p>
      </footer>
    </article>
  )
}
