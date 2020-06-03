import { useMemo } from 'react'
import { useCanvasState } from '../canvas/CanvasProvider'

const CanvasReady = ({ children }) => {
  const [{ canvasReady }] = useCanvasState()

  return useMemo(() => {
    if (canvasReady) return children
    return null
    // eslint-disable-next-line
  }, [canvasReady])
}

export default CanvasReady
