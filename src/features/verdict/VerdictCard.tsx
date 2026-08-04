import './verdict-card.css'

export type VerdictSeverity = 'red' | 'yellow'

type VerdictCardProps = {
  message: string
  reviewLine: string
  sanction: string
  offense: string
  explanation: string
  penalty: string
  caseId: string
  severity: VerdictSeverity
  playerName?: string
}

const severityLabels: Record<VerdictSeverity, string> = {
  red: 'Crveni karton',
  yellow: 'Žuti karton',
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
}: VerdictCardProps) {
  const messageSize = getMessageSize(message)

  return (
    <article
      className={[
        'verdict-card',
        `verdict-card--${severity}`,
        `verdict-card--message-${messageSize}`,
      ].join(' ')}
      lang="sr"
      aria-label={`${severityLabels[severity]}: ${offense}`}
    >
      <div className="verdict-card__decision-line" aria-hidden="true" />

      <header className="verdict-card__header">
        <p className="verdict-card__eyebrow">VAR REVIEW</p>
        <p className="verdict-card__case">CASE {caseId}</p>
      </header>

      <section className="verdict-card__evidence">
        <div className="verdict-card__evidence-meta">
          <p className="verdict-card__label">Dokaz A</p>
          {playerName ? (
            <p className="verdict-card__player">
              Igrač: <span>{playerName}</span>
            </p>
          ) : null}
        </div>

        <blockquote className="verdict-card__message">„{message}“</blockquote>
      </section>

      <section className="verdict-card__review">
        <p className="verdict-card__label">VAR provera</p>
        <p className="verdict-card__review-copy">{reviewLine}</p>
      </section>

      <section className="verdict-card__decision">
        <span className="verdict-card__severity-mark" aria-hidden="true">
          <span className="verdict-card__severity-lock" />
        </span>

        <p className="verdict-card__decision-kicker">Konačna odluka</p>
        <h2 className="verdict-card__sanction">{sanction}</h2>
        <p className="verdict-card__offense">{offense}</p>
      </section>

      <section className="verdict-card__explanation">
        <p className="verdict-card__label">Obrazloženje</p>
        <p className="verdict-card__explanation-copy">{explanation}</p>
      </section>

      <footer className="verdict-card__penalty">
        <p className="verdict-card__penalty-label">Kazna</p>
        <p className="verdict-card__penalty-copy">{penalty}</p>
        <p className="verdict-card__attribution">VAR for Messages</p>
      </footer>
    </article>
  )
}
