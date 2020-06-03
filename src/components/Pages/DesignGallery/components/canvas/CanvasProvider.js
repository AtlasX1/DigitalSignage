import React, { useContext, useState } from 'react'

const CanvasContext = React.createContext()
export const CanvasProvider = ({ children }) => {
  const [canvasState, setCanvasState] = useState({
    canvas: null,
    canvasReady: false,
    canvasHandlers: null,
    canvasHistory: {
      state: [],
      index: 0
    },
    canvasZoom: 1,
    activeObject: null,
    isLoading: false
  })

  return (
    <CanvasContext.Provider value={[canvasState, setCanvasState]}>
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvasState = () => useContext(CanvasContext)
