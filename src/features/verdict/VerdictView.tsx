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
import {
  downloadVerdictFile,
} from '../export/create-verdict-image'
import { ExportStage } from '../export/ExportStage'
import { LegalFooter } from '../legal/LegalFooter'
import {
  shareVerdictFile,
} from '../export/share-verdict'
import { useVerdictImage } from '../export/useVerdictImage'
import {
  VerdictCard,
  type VerdictCardContent,
} from './VerdictCard'
import './verdict-view.css'

type VerdictViewProps = {
  verdict: GeneratedVerdict
  onEdit: () => void
  onShareCompleted: () => void
  onShareFailed: () => void
  onDownloadClicked: () => void
  onReviewAnother: () => void
}

type ActiveAction = 'share' | 'download' | null

export function VerdictView({
  verdict,
  onEdit,
  onShareCompleted,
  onShareFailed,
  onDownloadClicked,
  onReviewAnother,
}: VerdictViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const exportNodeRef = useRef<HTMLDivElement>(null)
  const [activeAction, setActiveAction] =
    useState<ActiveAction>(null)
  const [actionMessage, setActionMessage] =
    useState<string | null>(null)
  const [actionError, setActionError] =
    useState<string | null>(null)

  const copy = getUiCopy(verdict.locale)
  const category = getCategory(
    verdict.locale,
    verdict.categoryId,
  )

  const cardContent: VerdictCardContent = {
    locale: verdict.locale,
    message: verdict.originalMessage,
    playerName: verdict.playerName,
    reviewLine: verdict.reviewLine,
    sanction: verdict.sanction,
    offense: verdict.offense,
    explanation: verdict.explanation,
    penalty: verdict.penalty,
    caseId: verdict.caseId,
    severity: verdict.severity,
  }

  const {
    status: imageStatus,
    error: imageError,
    result: imageResult,
    prepare,
    retry,
  } = useVerdictImage(
    exportNodeRef,
    verdict.caseId,
  )

  const imageReady =
    imageStatus === 'ready' && imageResult !== null
  const actionBusy = activeAction !== null

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  function resetActionFeedback() {
    setActionMessage(null)
    setActionError(null)
  }

  async function handleShare() {
    resetActionFeedback()
    setActiveAction('share')

    try {
      const image = imageResult ?? (await prepare())

      const result = await shareVerdictFile({
        navigatorLike: window.navigator,
        file: image.file,
        title: 'VAR for Messages',
        text: `${verdict.sanction}: ${verdict.offense}`,
      })

      if (result.status === 'unsupported') {
        downloadVerdictFile(image.file)
        setActionMessage(
          copy.actionStatus.fallbackDownloaded,
        )
        onDownloadClicked()

        return
      }

      if (result.status === 'cancelled') {
        setActionMessage(copy.actionStatus.cancelled)
        return
      }

      setActionMessage(copy.actionStatus.shared)
      onShareCompleted()
    } catch {
      setActionError(copy.errors.share)
      onShareFailed()
    } finally {
      setActiveAction(null)
    }
  }

  async function handleDownload() {
    resetActionFeedback()
    setActiveAction('download')

    try {
      const image = imageResult ?? (await prepare())

      downloadVerdictFile(image.file)
      setActionMessage(copy.actionStatus.downloaded)
      onDownloadClicked()
    } catch {
      setActionError(copy.errors.export)
    } finally {
      setActiveAction(null)
    }
  }

  function handleRetry() {
    resetActionFeedback()
    void retry().catch(() => {
      // The hook exposes the recoverable export error below.
    })
  }

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
          <h1
            ref={headingRef}
            className="verdict-view__announcement"
            tabIndex={-1}
          >
            {verdict.sanction}
          </h1>

          <VerdictCard {...cardContent} />
        </div>

        <aside className="verdict-view__actions">
          <div className="verdict-view__meta">
            <span>{category?.label ?? verdict.offense}</span>
            <span>
              {copy.card.caseLabel} {verdict.caseId}
            </span>
          </div>

          <div className="verdict-view__primary-action-zone">
            <div className="verdict-view__buttons verdict-view__buttons--primary">
              <button
                className="verdict-view__button verdict-view__button--share"
                type="button"
                disabled={!imageReady || actionBusy}
                onClick={handleShare}
              >
                <span>
                  {activeAction === 'share'
                    ? copy.actionStatus.sharing
                    : copy.share}
                </span>
                <span aria-hidden="true">↗</span>
              </button>

              <button
                className="verdict-view__button verdict-view__button--download"
                type="button"
                disabled={!imageReady || actionBusy}
                onClick={handleDownload}
              >
                <span>
                  {activeAction === 'download'
                    ? copy.actionStatus.preparing
                    : copy.download}
                </span>
                <span aria-hidden="true">↓</span>
              </button>
            </div>

            <div
              className="verdict-view__status"
              aria-live="polite"
            >
              {imageStatus === 'preparing' ? (
                <p>{copy.actionStatus.preparing}</p>
              ) : null}

              {imageStatus === 'error' || imageError ? (
                <div className="verdict-view__status-error">
                  <p>{copy.errors.export}</p>
                  <button type="button" onClick={handleRetry}>
                    {copy.actionStatus.retry}
                  </button>
                </div>
              ) : null}

              {actionMessage ? <p>{actionMessage}</p> : null}
              {actionError ? (
                <p className="verdict-view__status-error-copy">
                  {actionError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="verdict-view__buttons verdict-view__buttons--secondary">
            <button
              className="verdict-view__button verdict-view__button--edit"
              type="button"
              disabled={actionBusy}
              onClick={onEdit}
            >
              <span aria-hidden="true">←</span>
              <span>{copy.edit}</span>
            </button>

            <button
              className="verdict-view__button verdict-view__button--new"
              type="button"
              disabled={actionBusy}
              onClick={onReviewAnother}
            >
              <span>{copy.reviewAnother}</span>
              <span aria-hidden="true">＋</span>
            </button>
          </div>
        </aside>
      </section>

      <ExportStage
        ref={exportNodeRef}
        verdict={cardContent}
      />

      <LegalFooter locale={verdict.locale} />
    </main>
  )
}
