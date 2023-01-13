import PropTypes from 'prop-types'
import React, { createContext, useReducer } from 'react'

const initialHistogramState = [
  { x: 2, y: 0, label: 0 },
  { x: 4, y: 0, label: 0 },
  { x: 6, y: 0, label: 0 },
  { x: 8, y: 0, label: 0 },
  { x: 10, y: 0, label: 0 },
  { x: 12, y: 0, label: 0 },
  { x: 14, y: 0, label: 0 },
  { x: 16, y: 0, label: 0 },
  { x: 18, y: 0, label: 0 },
  { x: 20, y: 0, label: 0 },
  { x: 22, y: 0, label: 0 },
  { x: 24, y: 0, label: 0 },
  { x: 26, y: 0, label: 0 },
  { x: 28, y: 0, label: 0 },
  { x: 30, y: 0, label: 0 },
  { x: 32, y: 0, label: 0 },
  { x: 34, y: 0, label: 0 },
  { x: 36, y: 0, label: 0 },
  { x: 38, y: 0, label: 0 },
  { x: 40, y: 0, label: 0 },
  { x: 42, y: 0, label: 0 },
  { x: 44, y: 0, label: 0 },
  { x: 46, y: 0, label: 0 },
  { x: 48, y: 0, label: 0 },
  { x: 50, y: 0, label: 0 },
  { x: 52, y: 0, label: 0 },
  { x: 54, y: 0, label: 0 },
  { x: 56, y: 0, label: 0 },
  { x: 58, y: 0, label: 0 },
  { x: 60, y: 0, label: 0 },
  { x: 62, y: 0, label: 0 },
  { x: 64, y: 0, label: 0 },
  { x: 66, y: 0, label: 0 },
  { x: 68, y: 0, label: 0 },
  { x: 70, y: 0, label: 0 },
  { x: 72, y: 0, label: 0 },
  { x: 74, y: 0, label: 0 },
  { x: 76, y: 0, label: 0 },
  { x: 78, y: 0, label: 0 },
  { x: 80, y: 0, label: 0 },
  { x: 82, y: 0, label: 0 },
  { x: 84, y: 0, label: 0 },
  { x: 86, y: 0, label: 0 },
  { x: 88, y: 0, label: 0 },
  { x: 90, y: 0, label: 0 },
  { x: 92, y: 0, label: 0 },
  { x: 94, y: 0, label: 0 },
  { x: 96, y: 0, label: 0 },
  { x: 98, y: 0, label: 0 },
  { x: 100, y: 0, label: 0 },
]
const HistogramContext = createContext(initialHistogramState)
const { Provider } = HistogramContext

const HistogramProvider = ({ children }) => {
  const [histogram, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'update':
        return action.histogram
      default:
        throw new Error()
    }
  }, initialHistogramState)

  const setHistogram = updatedHistogram => dispatch({ type: 'update', histogram: updatedHistogram })

  return <Provider value={{ histogram, setHistogram, dispatch }}>{children}</Provider>
}

HistogramProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { HistogramContext, HistogramProvider }
