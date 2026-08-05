import {
  useEffect,
  useRef,
} from 'react'
import {
  getCategory,
  getUiCopy,
} from '../../content'
import type { GeneratedVerdict } from '../../shared/types/domain'
import { VerdictCard } from './VerdictCard'
import './verdict-view.css'

type VerdictViewProps = {
  verdict: GeneratedVerdict
  onEdit: () => void
  onReviewAnother: () => void
}

export function VerdictView({
  verdict,
  onEdit,
  onReviewAnother,
}: VerdictViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const copy = getUiCopy(verdict.locale)
  const category = getCategory(
    verdict.locale,
    verdict.categoryId,
  )

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main
      className={[
        'verdict-view',
        `verdict-view--${verdict.severity}`,
      ].join(' ')}
    >
      <header className="verdict-view__topbar">
        <div
          className="verdict-view__wordmark"
          aria-label="VAR for Messages"
        >
          <span aria-hidden="true">VAR</span>
          <strong>for Messages</strong>
        </div>

        <p>
          {copy.card.caseLabel} {verdict.caseId}
        </p>
      </header>

      <section className="verdict-view__layout">
        <div className="verdict-view__card">
          <VerdictCard
            locale={verdict.locale}
            message={verdict.originalMessage}
            playerName={verdict.playerName}
            reviewLine={verdict.reviewLine}
            sanction={verdict.sanction}
            offense={verdict.offense}
            explanation={verdict.explanation}
            penalty={verdict.penalty}
            caseId={verdict.caseId}
            severity={verdict.severity}
          />
        </div>

        <aside className="verdict-view__actions">
          <p className="verdict-view__kicker">
            {copy.card.finalDecisionLabel}
          </p>

          <h1 ref={headingRef} tabIndex={-1}>
            {verdict.sanction}
          </h1>

          <p className="verdict-view__offense">
            {verdict.offense}
          </p>

          <div className="verdict-view__meta">
            <span>{category?.label ?? verdict.offense}</span>
            <span>
              {copy.card.caseLabel} {verdict.caseId}
            </span>
          </div>

          <div className="verdict-view__buttons">
            <button
              className="verdict-view__button verdict-view__button--edit"
              type="button"
              onClick={onEdit}
            >
              <span aria-hidden="true">←</span>
              <span>{copy.edit}</span>
            </button>

            <button
              className="verdict-view__button verdict-view__button--new"
              type="button"
              onClick={onReviewAnother}
            >
              <span>{copy.reviewAnother}</span>
              <span aria-hidden="true">＋</span>
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}
