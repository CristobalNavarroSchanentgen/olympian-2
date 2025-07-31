import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initializeEventSystem } from './utils/event-system-init'
import { initializeBrowserLogger } from "./utils/browser-logger-init"
import "./index.css"

// Initialize event system before rendering
initializeEventSystem()
initializeBrowserLogger()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
