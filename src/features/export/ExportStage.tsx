import { forwardRef } from 'react'
import {
  VerdictCard,
  type VerdictCardContent,
} from '../verdict/VerdictCard'
import './export.css'

type ExportStageProps = {
  verdict: VerdictCardContent
}

export const ExportStage = forwardRef<
  HTMLDivElement,
  ExportStageProps
>(function ExportStage({ verdict }, ref) {
  return (
    <div className="export-stage" aria-hidden="true">
      <div className="export-stage__canvas" ref={ref}>
        <VerdictCard {...verdict} exportMode />
      </div>
    </div>
  )
})
