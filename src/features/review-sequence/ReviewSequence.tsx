import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  getCategory,
  getUiCopy,
} from '../../content'
import type { GeneratedVerdict } from '../../shared/types/domain'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import './review-sequence.css'

type ReviewStep = 'scan' | 'lock' | 'reveal'

type ReviewSequenceProps = {
  verdict: GeneratedVerdict
  onComplete: () => void
}

const reviewStepIndex: Readonly<Record<ReviewStep, number>> = {
  scan: 0,
  lock: 1,
  reveal: 2,
}

function getQuotationMarks(locale: GeneratedVerdict['locale']) {
  return locale === 'sr'
    ? { open: '„', close: '“' }
    : { open: '“', close: '”' }
}

export function ReviewSequence({
  verdict,
  onComplete,
}: ReviewSequenceProps) {
  const prefersReducedMotion = useReducedMotion()
  const [step, setStep] = useState<ReviewStep>(
    prefersReducedMotion ? 'reveal' : 'scan',
  )
  const headingRef = useRef<HTMLHeadingElement>(null)
  const onCompleteRef = useRef(onComplete)

  const copy = getUiCopy(verdict.locale)
  const category = getCategory(
    verdict.locale,
    verdict.categoryId,
  )
  const quotationMarks = getQuotationMarks(verdict.locale)
  const activeStepIndex = reviewStepIndex[step]

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    headingRef.current?.focus()

    const timers: number[] = []

    if (prefersReducedMotion) {
      timers.push(
        window.setTimeout(() => setStep('reveal'), 0),
        window.setTimeout(() => {
          onCompleteRef.current()
        }, 280),
      )
    } else {
      timers.push(
        window.setTimeout(() => setStep('scan'), 0),
        window.setTimeout(() => setStep('lock'), 400),
        window.setTimeout(() => setStep('reveal'), 800),
        window.setTimeout(() => {
          onCompleteRef.current()
        }, 1200),
      )
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [prefersReducedMotion])

  return (
    <main
      className={[
        'review-sequence',
        `review-sequence--${verdict.severity}`,
        `review-sequence--${step}`,
      ].join(' ')}
    >
      <header className="review-sequence__topbar">
        <div
          className="review-sequence__wordmark"
          aria-label="VAR for Messages"
        >
          <span aria-hidden="true">VAR</span>
          <strong>for Messages</strong>
        </div>

        <p>
          {copy.card.caseLabel} {verdict.caseId}
        </p>
      </header>

      <section className="review-sequence__stage">
        <p className="review-sequence__kicker">
          {copy.card.reviewLabel}
        </p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          aria-live="polite"
        >
          {copy.reviewingStatuses[activeStepIndex]}
        </h1>

        <div className="review-sequence__evidence">
          <div
            className="review-sequence__decision-line"
            aria-hidden="true"
          />

          <p className="review-sequence__evidence-label">
            {copy.card.evidenceLabel}
          </p>

          <blockquote>
            {quotationMarks.open}
            {verdict.originalMessage}
            {quotationMarks.close}
          </blockquote>

          <div className="review-sequence__evidence-meta">
            <span>{category?.label ?? verdict.offense}</span>
            {verdict.playerName ? (
              <span>
                {copy.card.playerLabel}: {verdict.playerName}
              </span>
            ) : null}
          </div>
        </div>

        <ol
          className="review-sequence__steps"
          aria-hidden="true"
        >
          {copy.reviewingStatuses.map((status, index) => (
            <li
              className={
                index <= activeStepIndex
                  ? 'review-sequence__step review-sequence__step--active'
                  : 'review-sequence__step'
              }
              key={status}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{status}</strong>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
