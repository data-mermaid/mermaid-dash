import React from 'react'
import { Route } from 'react-router-dom'

import MermaidDash from './components/MermaidDash'
import { HistogramProvider } from './context/histogramContext'

function App() {
  return (
    <HistogramProvider>
      <Route path="/" component={MermaidDash} />
    </HistogramProvider>
  )
}

export default App
