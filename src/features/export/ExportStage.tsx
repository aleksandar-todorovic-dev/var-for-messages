import { forwardRef } from 'react'
import {
  VerdictCard,
  type DisplayFontId,
  type TextFontId,
  type VerdictCardContent,
} from '../verdict/VerdictCard'
import './export.css'

type ExportStageProps = {
  verdict: VerdictCardContent
  displayFont: DisplayFontId
  textFont: TextFontId
}

export const ExportStage = forwardRef<HTMLDivElement, ExportStageProps>(
  function ExportStage({ verdict, displayFont, textFont }, ref) {
    return (
      <div className="export-stage" aria-hidden="true">
        <div className="export-stage__canvas" ref={ref}>
          <VerdictCard
            {...verdict}
            displayFont={displayFont}
            textFont={textFont}
            exportMode
          />
        </div>
      </div>
    )
  },
)
