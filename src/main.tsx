import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* O Toaster vai exibir alertas pela aplicação caso chamar */}
    <Toaster richColors position='top-right'/>
  </React.StrictMode>,
)
