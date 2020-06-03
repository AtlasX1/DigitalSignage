import { fabric } from 'fabric'

import { initCenteringGuidelines, initAligningGuidelines } from '../../utils'
import { SIDEBAR_WIDTH, SIDEBAR_SMALL_WIDTH } from '../../constans'
import setPrototypes from './helpers/FabricPrototypes'
import CanvasHistory from './helpers/CanvasHistory'
import CanvasUtils from './helpers/CanvasUtils'
import CanvasHandlers from './helpers/CanvasHandlers'
import CanvasRuler from './helpers/CanvasRuler'

class CanvasInstance {
  canvasHistory = {}
  canvasReady = false
  canvasRuler = null
  constructor(setCanvasState, dispatchAction) {
    this.setCanvasState = setCanvasState
    this.dispatchAction = dispatchAction

    this.initCanvas()
    this.initCanvasRuler()
    this.initCanvasUtils()
    this.initCanvasHistory(this.setCanvasState)
    this.initCanvasHandlers(this)
    this.initCanvasZoom()
    this.canvasReady = true
  }

  initCanvas() {
    const viewport = window.document
      .querySelector('.design-gallery')
      .getBoundingClientRect()

    this.canvas = new fabric.Canvas('main-canvas', {
      width: viewport.width - SIDEBAR_SMALL_WIDTH - SIDEBAR_WIDTH,
      height: viewport.height,
      preserveObjectStacking: true,
      stopContextMenu: true
    })
    this.addCanvasFrame()
    setPrototypes(this.canvas)
  }

  initCanvasHistory(setCanvasState) {
    this.canvasHistory = new CanvasHistory(this.canvas, setCanvasState)
  }

  initCanvasUtils() {
    this.canvasUtils = new CanvasUtils()
  }

  initCanvasHandlers(props) {
    this.canvasHandlers = new CanvasHandlers(props)
  }

  initCanvasRuler() {
    this.canvasRuler = new CanvasRuler(this.canvas)
    this.initGuideLines()
  }

  initGuideLines() {
    initCenteringGuidelines(this.canvas)
    initAligningGuidelines(this.canvas)
  }

  initCanvasZoom() {
    this.canvasZoom = Math.floor((this.canvas.width / 1920) * 10) / 10
    this.canvasHandlers.setZoom(false, this.canvasZoom)
  }

  addCanvasFrame() {
    const frame = new fabric.Rect({
      width: 1920,
      height: 1080,
      fill: '#fff',
      isFrame: true,
      absolutePositioned: true,
      backgroundColor: '#fff',
      selectable: false,
      hoverCursor: 'default',
      hasBorders: false,
      hasControls: false,
      hasCorners: false
    })

    this.canvas.add(frame)
    this.canvas.viewportCenterObject(frame)
  }
}

export default CanvasInstance
