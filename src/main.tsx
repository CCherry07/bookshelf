import React from 'react'
import ReactDOM from 'react-dom/client'
import './bootstrap'
import App from './App'
import { AppProviders } from './utils/AppProviders'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)
