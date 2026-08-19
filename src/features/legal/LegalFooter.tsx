import { useRef, type RefObject } from 'react'
import type { Locale } from '../../shared/types/domain'
import {
  COMMISSIONER_URL,
  OPERATOR_NAME,
  PRIVACY_CONTACT,
  feedbackUrlByLocale,
  legalCopyByLocale,
  type LegalSection,
} from './legal-content'
import './legal.css'

type LegalFooterProps = {
  locale: Locale
}

type NoticeDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>
  returnFocusRef: RefObject<HTMLAnchorElement | null>
  dialogId: string
  titleId: string
  title: string
  updated: string
  intro: string
  sections: readonly LegalSection[]
  closeLabel: string
  controller?: {
    controllerLabel: string
    countryLabel: string
    country: string
    contactLabel: string
  }
  commissionerLink?: string
}

function NoticeDialog({
  dialogRef,
  returnFocusRef,
  dialogId,
  titleId,
  title,
  updated,
  intro,
  sections,
  closeLabel,
  controller,
  commissionerLink,
}: NoticeDialogProps) {
  return (
    <dialog
      className="legal-dialog"
      ref={dialogRef}
      id={dialogId}
      aria-labelledby={titleId}
      onClose={() => returnFocusRef.current?.focus()}
    >
      <article className="legal-dialog__document">
        <header className="legal-dialog__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            <p>{updated}</p>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            {closeLabel}
          </button>
        </header>

        <p className="legal-dialog__intro">{intro}</p>

        {controller ? (
          <dl className="legal-dialog__controller">
            <div>
              <dt>{controller.controllerLabel}</dt>
              <dd>{OPERATOR_NAME}</dd>
            </div>
            <div>
              <dt>{controller.countryLabel}</dt>
              <dd>{controller.country}</dd>
            </div>
            <div>
              <dt>{controller.contactLabel}</dt>
              <dd>
                <a href={`mailto:${PRIVACY_CONTACT}`}>
                  {PRIVACY_CONTACT}
                </a>
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="legal-dialog__sections">
          {sections.map((section) => (
            <section key={section.heading}>
              <h3>{section.heading}</h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {commissionerLink ? (
          <p className="legal-dialog__authority-link">
            <a
              href={COMMISSIONER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {commissionerLink}
            </a>
          </p>
        ) : null}
      </article>
    </dialog>
  )
}

function openDialog(
  dialogRef: RefObject<HTMLDialogElement | null>,
) {
  if (!dialogRef.current?.open) {
    dialogRef.current?.showModal()
  }
}

export function LegalFooter({ locale }: LegalFooterProps) {
  const copy = legalCopyByLocale[locale]
  const privacyDialogRef =
    useRef<HTMLDialogElement>(null)
  const termsDialogRef = useRef<HTMLDialogElement>(null)
  const privacyLinkRef = useRef<HTMLAnchorElement>(null)
  const termsLinkRef = useRef<HTMLAnchorElement>(null)

  return (
    <footer className="legal-footer">
      <p className="legal-footer__affiliation">
        {copy.affiliation}
      </p>

      <nav aria-label={copy.footerLabel}>
        <a
          ref={privacyLinkRef}
          href={`#privacy-notice-${locale}`}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.preventDefault()
            openDialog(privacyDialogRef)
          }}
        >
          {copy.privacyLink}
        </a>
        <a
          ref={termsLinkRef}
          href={`#terms-notice-${locale}`}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.preventDefault()
            openDialog(termsDialogRef)
          }}
        >
          {copy.termsLink}
        </a>
        <a href={`mailto:${PRIVACY_CONTACT}`}>
          {copy.contactLink}
        </a>
        <a href="/third-party-notices.txt">
          {copy.noticesLink}
        </a>
        <a
          href={feedbackUrlByLocale[locale]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.feedbackLink}
        </a>
      </nav>

      <NoticeDialog
        dialogRef={privacyDialogRef}
        returnFocusRef={privacyLinkRef}
        dialogId={`privacy-notice-${locale}`}
        titleId={`privacy-title-${locale}`}
        title={copy.privacy.title}
        updated={copy.privacy.updated}
        intro={copy.privacy.intro}
        sections={copy.privacy.sections}
        closeLabel={copy.close}
        controller={{
          controllerLabel: copy.controllerLabel,
          countryLabel: copy.countryLabel,
          country: copy.country,
          contactLabel: copy.contactLabel,
        }}
        commissionerLink={copy.privacy.commissionerLink}
      />

      <NoticeDialog
        dialogRef={termsDialogRef}
        returnFocusRef={termsLinkRef}
        dialogId={`terms-notice-${locale}`}
        titleId={`terms-title-${locale}`}
        title={copy.terms.title}
        updated={copy.terms.updated}
        intro={copy.terms.intro}
        sections={copy.terms.sections}
        closeLabel={copy.close}
      />
    </footer>
  )
}
