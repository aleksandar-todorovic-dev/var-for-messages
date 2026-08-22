import '@fontsource/barlow-condensed/latin-ext-900.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/inter/latin-ext-800.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeAnalytics } from './features/analytics/bootstrap.ts'
import { createRandomInspirationSetIndex } from './features/creator/inspiration-sets.ts'
import './shared/styles/global.css'
import App from './app/App.tsx'

const recruitmentSource = initializeAnalytics()
const inspirationSetIndex = createRandomInspirationSetIndex()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      inspirationSetIndex={inspirationSetIndex}
      recruitmentSource={recruitmentSource}
    />
  </StrictMode>,
)
