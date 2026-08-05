import { useEffect, useRef, useState } from 'react'
import {
  createVerdictImage,
  downloadVerdictFile,
  type VerdictImageResult,
} from '../features/export/create-verdict-image'
import { ExportStage } from '../features/export/ExportStage'
import {
  VerdictCard,
  type DisplayFontId,
  type TextFontId,
  type VerdictCardContent,
} from '../features/verdict/VerdictCard'
import './app.css'

type TestCase = {
  id: string
  label: string
  value: VerdictCardContent
}

const redVerdict: VerdictCardContent = {
  message: 'Evo me za pet minuta.',
  reviewLine: 'Da li je igrač uopšte krenuo?',
  sanction: 'Crveni karton',
  offense: 'Za krađu vremena',
  explanation:
    'Snimak potvrđuje da je u trenutku slanja poruke još birao šta će da obuče.',
  penalty:
    'Oduzima mu se pravo da kaže „krećem“ do kraja sezone.',
  caseId: '#5MIN',
  severity: 'red',
}

const yellowVerdict: VerdictCardContent = {
  message: 'Važi.',
  reviewLine: 'Da li je ovo odgovor ili upozorenje?',
  sanction: 'Žuti karton',
  offense: 'Za odgovor bez pulsa',
  explanation: 'Jedna reč. Nula topline. Maksimalna tenzija.',
  penalty:
    'Sledeća poruka mora da sadrži glagol i makar jedan znak života.',
  caseId: '#DRY01',
  severity: 'yellow',
}

const stressVerdict: VerdictCardContent = {
  message:
    'Krećem sad, samo da pronađem ključeve, napunim telefon, završim kafu i odlučim da li uopšte izlazim iz kuće u narednih pet minuta. Ozbiljno.',
  reviewLine: 'Da li poruka od 140 karaktera menja stanje na terenu?',
  sanction: 'Crveni karton',
  offense: 'Za produženo zagrevanje',
  explanation:
    'Analiza potvrđuje da je najviše energije potrošeno na objašnjenje zašto igrač još nije krenuo.',
  penalty:
    'Sledeće javljanje dozvoljeno je tek nakon fizičkog napuštanja kuće.',
  caseId: '#140MAX',
  severity: 'red',
  playerName: 'Aleksandar T. — Kapiten!',
}

const longBundleVerdict: VerdictCardContent = {
  message: 'Hahaha.',
  reviewLine: 'Da li je signal bio dovoljno jasan?',
  sanction: 'Crveni karton',
  offense: 'Za promašen flert',
  explanation:
    'Lopta je stigla pred prazan gol. Igrač je odgovorio sa „hahaha“ i promenio temu.',
  penalty:
    'Sledeći očigledan signal mora biti odigran iz prve.',
  caseId: '#FLIRT1',
  severity: 'red',
}

const testCases: TestCase[] = [
  {
    id: 'red-anchor',
    label: 'Anchor · kratka crvena',
    value: redVerdict,
  },
  {
    id: 'yellow-anchor',
    label: 'Anchor · kratka žuta',
    value: yellowVerdict,
  },
  {
    id: 'stress',
    label: 'Stress · 140 karaktera + ime',
    value: stressVerdict,
  },
  {
    id: 'long-bundle',
    label: 'Candidate · duži bundle',
    value: longBundleVerdict,
  },
]

const displayFonts: {
  id: DisplayFontId
  label: string
  description: string
}[] = [
  {
    id: 'barlow-condensed',
    label: 'Barlow Condensed',
    description: 'Najjača sportsko-editorijalna energija.',
  },
  {
    id: 'oswald',
    label: 'Oswald',
    description: 'Najuži i najstroži kandidat.',
  },
  {
    id: 'roboto-condensed',
    label: 'Roboto Condensed',
    description: 'Najneutralniji pouzdani baseline.',
  },
]

const textFonts: {
  id: TextFontId
  label: string
  description: string
}[] = [
  {
    id: 'inter',
    label: 'Inter',
    description: 'Kompaktan i savremen neutralni sloj.',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    description: 'Širi, mirniji i konzervativniji baseline.',
  },
]

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  return `${(bytes / 1024).toFixed(1)} KB`
}

function App() {
  const exportNodeRef = useRef<HTMLDivElement>(null)

  const [displayFont, setDisplayFont] =
    useState<DisplayFontId>('barlow-condensed')
  const [textFont, setTextFont] = useState<TextFontId>('inter')
  const [testCaseId, setTestCaseId] = useState(testCases[0].id)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] =
    useState<VerdictImageResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const selectedTestCase =
    testCases.find((testCase) => testCase.id === testCaseId) ?? testCases[0]

  function resetExportState() {
    setExportResult(null)
    setExportError(null)
    setPreviewUrl(null)
  }

  function handleDisplayFontChange(nextFont: DisplayFontId) {
    setDisplayFont(nextFont)
    resetExportState()
  }

  function handleTextFontChange(nextFont: TextFontId) {
    setTextFont(nextFont)
    resetExportState()
  }

  function handleTestCaseChange(nextTestCaseId: string) {
    setTestCaseId(nextTestCaseId)
    resetExportState()
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function generatePng() {
    const exportNode = exportNodeRef.current

    if (!exportNode) {
      setExportError('Export canvas nije pronađen.')
      return null
    }

    setIsExporting(true)
    setExportError(null)

    try {
      const result = await createVerdictImage(
        exportNode,
        selectedTestCase.value.caseId,
      )

      setExportResult(result)
      setPreviewUrl(URL.createObjectURL(result.blob))

      return result
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'PNG export nije uspeo.'

      setExportError(message)
      return null
    } finally {
      setIsExporting(false)
    }
  }

  async function handleDownload() {
    const result = exportResult ?? (await generatePng())

    if (result) {
      downloadVerdictFile(result.file)
    }
  }

  return (
    <main className="spike-page">
      <header className="spike-header">
        <p className="spike-kicker">Phase B · Font + export decision spike</p>
        <h1>Jedan sistem. Pet font kandidata. Jedan pravi PNG.</h1>
        <p>
          Ovaj branch ne redizajnira karticu. Proverava glifove, wrapping,
          isti DOM pri eksportu i stvarnu dimenziju od 1080 × 1350.
        </p>
      </header>

      <section className="spike-section" aria-labelledby="font-matrix-title">
        <div className="spike-section__intro">
          <p className="spike-kicker">Glyph + tone matrix</p>
          <h2 id="font-matrix-title">Prvo biramo glas, ne logo.</h2>
          <p>
            Posebno gledaj Đ/đ, širinu reči „KARTON“, ritam velikih slova i
            čitljivost sitnih utility labela.
          </p>
        </div>

        <div className="font-matrix">
          <div className="font-matrix__group">
            <h3>Display kandidati</h3>

            {displayFonts.map((font) => (
              <button
                className={[
                  'font-specimen',
                  `font-specimen--display-${font.id}`,
                  displayFont === font.id ? 'font-specimen--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={font.id}
                onClick={() => handleDisplayFontChange(font.id)}
                type="button"
              >
                <span className="font-specimen__meta">
                  <strong>{font.label}</strong>
                  <span>{font.description}</span>
                </span>
                <span className="font-specimen__display">ŽUTI KARTON</span>
                <span className="font-specimen__glyphs">
                  Č Ć Š Ž Đ — č ć š ž đ
                </span>
              </button>
            ))}
          </div>

          <div className="font-matrix__group">
            <h3>Neutralni kandidati</h3>

            {textFonts.map((font) => (
              <button
                className={[
                  'font-specimen',
                  `font-specimen--text-${font.id}`,
                  textFont === font.id ? 'font-specimen--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={font.id}
                onClick={() => handleTextFontChange(font.id)}
                type="button"
              >
                <span className="font-specimen__meta">
                  <strong>{font.label}</strong>
                  <span>{font.description}</span>
                </span>
                <span className="font-specimen__body">
                  „Četiri ćoška, žuti karton i Đorđe na gol-liniji.“
                </span>
                <span className="font-specimen__utility">
                  IGRAČ · DOKAZ A · OBRAZLOŽENJE
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="spike-section" aria-labelledby="live-card-title">
        <div className="spike-section__intro">
          <p className="spike-kicker">Live composition test</p>
          <h2 id="live-card-title">Izabrani par u realnoj kartici.</h2>
          <p>
            Menjaj test slučaj i proveri da font nije samo lep na jednoj
            kratkoj presudi.
          </p>
        </div>

        <div className="spike-controls">
          <label>
            <span>Test slučaj</span>
            <select
              value={testCaseId}
              onChange={(event) => handleTestCaseChange(event.target.value)}
            >
              {testCases.map((testCase) => (
                <option key={testCase.id} value={testCase.id}>
                  {testCase.label}
                </option>
              ))}
            </select>
          </label>

          <dl className="selection-summary">
            <div>
              <dt>Display</dt>
              <dd>
                {
                  displayFonts.find((font) => font.id === displayFont)
                    ?.label
                }
              </dd>
            </div>
            <div>
              <dt>Neutral</dt>
              <dd>
                {textFonts.find((font) => font.id === textFont)?.label}
              </dd>
            </div>
          </dl>
        </div>

        <div className="live-card">
          <VerdictCard
            {...selectedTestCase.value}
            displayFont={displayFont}
            textFont={textFont}
          />
        </div>
      </section>

      <section className="spike-section" aria-labelledby="export-title">
        <div className="spike-section__intro">
          <p className="spike-kicker">DOM → PNG test</p>
          <h2 id="export-title">Browser levo. Generisani PNG desno.</h2>
          <p>
            PNG mora da zadrži font, Đ/đ, Decision Line, wrapping, teksturu
            i tačnih 1080 × 1350 piksela.
          </p>
        </div>

        <div className="export-comparison">
          <figure className="export-sample">
            <figcaption>Live DOM · 1080 × 1350 umanjeno na 25%</figcaption>
            <div className="export-sample__frame">
              <div className="export-sample__canvas">
                <VerdictCard
                  {...selectedTestCase.value}
                  displayFont={displayFont}
                  textFont={textFont}
                  exportMode
                />
              </div>
            </div>
          </figure>

          <figure className="export-sample">
            <figcaption>Generisani PNG</figcaption>
            <div className="export-sample__frame">
              {previewUrl ? (
                <img
                  className="export-sample__image"
                  src={previewUrl}
                  alt="Generisani PNG verdict kartice"
                />
              ) : (
                <div className="export-sample__empty">
                  PNG će se pojaviti posle testa.
                </div>
              )}
            </div>
          </figure>
        </div>

        <div className="export-actions">
          <button
            className="export-actions__primary"
            disabled={isExporting}
            onClick={generatePng}
            type="button"
          >
            {isExporting ? 'Pravim PNG…' : 'Napravi test PNG'}
          </button>

          <button
            className="export-actions__secondary"
            disabled={isExporting}
            onClick={handleDownload}
            type="button"
          >
            Preuzmi PNG
          </button>
        </div>

        <div className="export-status" aria-live="polite">
          {exportError ? (
            <p className="export-status__error">{exportError}</p>
          ) : null}

          {exportResult ? (
            <dl>
              <div>
                <dt>Dimenzije</dt>
                <dd>
                  {exportResult.width} × {exportResult.height}
                </dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{exportResult.file.type}</dd>
              </div>
              <div>
                <dt>Veličina</dt>
                <dd>{formatFileSize(exportResult.file.size)}</dd>
              </div>
              <div>
                <dt>File</dt>
                <dd>{exportResult.file.name}</dd>
              </div>
            </dl>
          ) : (
            <p>
              Još nema rezultata. Prvi klik proverava i Blob i File
              konstrukciju.
            </p>
          )}
        </div>
      </section>

      <ExportStage
        ref={exportNodeRef}
        verdict={selectedTestCase.value}
        displayFont={displayFont}
        textFont={textFont}
      />
    </main>
  )
}

export default App
