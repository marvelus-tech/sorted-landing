import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import { registerSortedTools } from './webmcp-tools'

// Register WebMCP tools when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerSortedTools)
} else {
  registerSortedTools()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
