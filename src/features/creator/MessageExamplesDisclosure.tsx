import type { UiCopy } from '../../content'
import type { InspirationSetIndex } from './inspiration-sets'

type MessageExamplesDisclosureProps = {
  copy: UiCopy['messageExamples']
  contentId: string
  expanded: boolean
  inspirationSetIndex: InspirationSetIndex
  onToggle: () => void
}

export function MessageExamplesDisclosure({
  copy,
  contentId,
  expanded,
  inspirationSetIndex,
  onToggle,
}: MessageExamplesDisclosureProps) {
  return (
    <div className="message-examples">
      <button
        className="message-examples__toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onToggle}
      >
        {copy.control}
      </button>

      <div
        className="message-examples__content"
        id={contentId}
        hidden={!expanded}
      >
        <ul className="message-examples__list">
          {copy.sets[inspirationSetIndex].map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
        <p className="message-examples__note">{copy.note}</p>
      </div>
    </div>
  )
}
