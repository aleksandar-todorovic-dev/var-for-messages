import { VerdictCard } from '../features/verdict/VerdictCard'
import './app.css'

const redVerdict = {
  message: 'Evo me za pet minuta.',
  reviewLine: 'Da li je igrač uopšte krenuo?',
  sanction: 'Crveni karton',
  offense: 'Za krađu vremena',
  explanation:
    'Snimak potvrđuje da je u trenutku slanja poruke još birao šta će da obuče.',
  penalty:
    'Oduzima mu se pravo da kaže „krećem“ do kraja sezone.',
  caseId: '#5MIN',
  severity: 'red' as const,
}

const yellowVerdict = {
  message: 'Važi.',
  reviewLine: 'Da li je ovo odgovor ili upozorenje?',
  sanction: 'Žuti karton',
  offense: 'Za odgovor bez pulsa',
  explanation: 'Jedna reč. Nula topline. Maksimalna tenzija.',
  penalty:
    'Sledeća poruka mora da sadrži glagol i makar jedan znak života.',
  caseId: '#DRY01',
  severity: 'yellow' as const,
}

const stressVerdict = {
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
  severity: 'red' as const,
  playerName: 'Aleksandar T. — Kapiten!',
}

const verdicts = [
  {
    id: 'red-short',
    label: 'Red · short message',
    value: redVerdict,
  },
  {
    id: 'yellow-short',
    label: 'Yellow · minimal reply',
    value: yellowVerdict,
  },
  {
    id: 'red-stress',
    label: 'Stress · 140 characters + 24-character name',
    value: stressVerdict,
  },
]

function App() {
  return (
    <main className="prototype-page">
      <header className="prototype-header">
        <p className="prototype-kicker">
          Phase 1A · Verdict-card prototype v3
        </p>

        <h1>Editorial Match Review</h1>

        <p>
          Polish kandidat: čitljiviji sekundarni tekst, jasniji
          prekršaj, player-name uz dokaz, jednostavniji footer,
          precizniji Decision Line lock i stvarni 1080 × 1350 canvas.
        </p>
      </header>

      <section className="prototype-grid" aria-label="Verdict prototypes">
        {verdicts.map((verdict) => (
          <div className="prototype-example" key={verdict.id}>
            <p className="prototype-example__label">{verdict.label}</p>
            <VerdictCard {...verdict.value} />
          </div>
        ))}
      </section>

      <section className="validation-tests" aria-label="Artifact validation">
        <div className="validation-test">
          <div className="validation-test__intro">
            <p className="prototype-kicker">Detached artifact test</p>
            <h2>Chat-preview scale</h2>
            <p>
              Provera da li pri umanjenju ostaju jasni poruka,
              Decision Line, disciplinska boja i velika presuda.
            </p>
          </div>

          <div className="preview-test__surface">
            <div className="preview-test__bubble">
              <p className="preview-test__sender">Prosleđena slika</p>
              <div className="preview-test__card">
                <VerdictCard {...redVerdict} />
              </div>
              <p className="preview-test__time">23:18</p>
            </div>
          </div>
        </div>

        <div className="validation-test validation-test--export">
          <div className="validation-test__intro">
            <p className="prototype-kicker">Export canvas test</p>
            <h2>1080 × 1350</h2>
            <p>
              Komponenta se ovde zaista renderuje na širini od 1080
              CSS piksela i zatim se samo vizuelno umanjuje za pregled.
            </p>
          </div>

          <div className="export-preview__surface">
            <div className="export-preview__frame">
              <div className="export-preview__canvas">
                <VerdictCard {...redVerdict} />
              </div>
            </div>
            <p className="export-preview__caption">
              Real canvas · 1080 × 1350
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
