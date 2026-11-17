import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/base.css'
import { App } from './App'

// iOS Safari only applies :active (pressed) styles when some touchstart
// listener exists on the page. This empty one turns them on.
document.addEventListener('touchstart', () => {}, { passive: true })

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

// HashRouter keeps the route after a "#" (…/fitness-tracker/#/history).
// GitHub Pages only serves real files, so a path like /fitness-tracker/history
// would 404 on refresh. Everything after "#" stays in the browser and never
// reaches the server, so the server only ever sees /fitness-tracker/.
createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
