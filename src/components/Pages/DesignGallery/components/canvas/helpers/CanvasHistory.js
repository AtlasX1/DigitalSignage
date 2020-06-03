import { SAVED_OBJECT_OPTIONS } from '../../../constans'

class CanvasHistory {
  constructor(canvas, setCanvasState) {
    this.canvas = canvas
    this.setCanvasState = setCanvasState
    this.initInitialState()
  }

  initInitialState() {
    const currentConfig = this.getCanvasConfig()
    this.state = [currentConfig]
    this.index = 0
  }

  getCanvasConfig = () => {
    return JSON.stringify(this.canvas.toJSON(SAVED_OBJECT_OPTIONS))
  }

  setHistory(state, index) {
    this.state = state
    this.index = index
  }

  getHistory() {
    return { state: this.state, index: this.index }
  }

  updateHistory() {
    const { index, state } = this
    const currentConfig = this.getCanvasConfig()

    const nextIndex = index + 1

    let newState = []
    if (nextIndex !== state.length) {
      newState = state.splice(0, nextIndex)
    } else {
      newState = state
    }

    this.setHistory([...newState, currentConfig], nextIndex)
    this.setCanvasStateContext()
  }

  setHistoryIndex(index) {
    this.index = index
    this.setCanvasStateContext()
  }

  setCanvasStateContext() {
    this.setCanvasState(stateContext => ({
      ...stateContext,
      canvasHistory: this.getHistory()
    }))
  }
}

export default CanvasHistory
