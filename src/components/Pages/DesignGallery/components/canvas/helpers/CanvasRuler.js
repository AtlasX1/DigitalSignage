import { fabric } from 'fabric'
const HALF_PIXEL = 0.5
const UNIT_INTERVALS = [
  0.001,
  0.002,
  0.005,
  0.01,
  0.02,
  0.05,
  0.1,
  0.2,
  0.5,
  1,
  2,
  5,
  10,
  20,
  50,
  100,
  200,
  500,
  1000,
  2000
]
const TINY_INTERVAL_THRESHOLD = 40
const MINIMUM_INTERVAL_PIXELS = 60
const MAXIMUM_INTERVAL_PIXELS = 200
const DIRECTION = {
  v: 'vertical',
  h: 'horizontal'
}

const Units = {
  PIXELS: 'PIXELS',
  INCHES: 'INCHES',
  CENTIMETERS: 'CENTIMETERS',
  METERS: 'METERS',
  decimalPlaces: { PIXELS: 0, INCHES: 3, CENTIMETERS: 2, METERS: 4 },
  toFixed: (units, num) => {
    const decimals = Units.decimalPlaces[units]
    return num.toFixed(decimals)
  },
  toFixedFloat: (units, num) => {
    const str = Units.toFixed(units, num)
    return parseFloat(str)
  }
}

class initScale {
  constructor(ruler) {
    this.tickColor = '#d0cfd1'
    this.labelColor = '#acb0b9'
    this.labelOffsetX = 3
    this.labelOffsetY = 11
    this.fontFamily = '"DINNextW1GRegular", Arial, sans-serif'
    this.fontSize = 10
    this.units = Units.PIXELS
    this.pixelsPerUnit = 1
    this.ruler = ruler
  }

  setThickness(thickness) {
    this.thickness = thickness
    this.tickDividerLength = this.thickness
    this.tickLargeLength = Math.floor(this.thickness / 3)
    this.tickSmallLength = Math.floor(this.thickness / 5)
  }

  setDimensions(width, height) {
    this.width = width
    this.height = height
  }

  chooseIntervalLength() {
    const _this = this

    const bestFit = UNIT_INTERVALS.find(function (interval, idx, arr) {
      const nextInterval = arr[idx + 1]
      const intervalScreenPixels =
        interval * _this.pixelsPerUnit * _this.pixelZoomRatio
      return (
        (interval >= _this.pixelZoomRatio &&
          intervalScreenPixels > MINIMUM_INTERVAL_PIXELS) ||
        nextInterval == null ||
        nextInterval * _this.pixelsPerUnit * _this.pixelZoomRatio >
          MAXIMUM_INTERVAL_PIXELS
      )
    })
    return bestFit * this.pixelsPerUnit
  }

  setPageViewport(frame, viewport) {
    const visiblePageWidth = viewport.br.x - viewport.tl.x
    this.startX = frame.oCoords.tl.x
    this.startY = frame.oCoords.tl.y
    this.pageWidth = frame.width
    this.pageHeight = frame.height
    this.pixelZoomRatio = this.width / visiblePageWidth
    this.pagePixelsPerInterval = this.chooseIntervalLength()
    this.screenPixelsPerInterval =
      this.pagePixelsPerInterval * this.pixelZoomRatio
  }

  draw(ctx) {
    // top ruler's scale
    ctx.save()
    ctx.transform(1, 0, 0, 1, 0, this.ruler.topRulerOffset)
    this._draw(ctx, 'x', this.startX, this.pageWidth)
    ctx.restore()

    // left ruler's scale
    ctx.save()
    ctx.scale(1, -1)
    ctx.rotate(-Math.PI / 2)
    ctx.transform(1, 0, 0, 1, this.ruler.leftRulerOffset, 0)
    this._draw(ctx, 'y', this.startY, this.pageHeight)
    ctx.restore()
  }

  _draw(ctx, axis, startingPoint, maxTickPos) {
    const isXAxis = axis === 'x'
    const _this$createTicks = this.createTicks(),
      ticks = _this$createTicks.ticks,
      gapSize = _this$createTicks.gapSize

    ctx.fillStyle = this.tickColor
    ctx.strokeStyle = this.tickColor
    ctx.font = 'normal normal '
      .concat(this.fontSize, 'px ')
      .concat(this.fontFamily)

    let shiftFirstTickWidth = 0
    for (var i = 0; i <= maxTickPos; i += this.pagePixelsPerInterval) {
      const firstTickPos = Math.ceil(this.pixelZoomRatio * (startingPoint + i))
      if (i === 0) {
        shiftFirstTickWidth = firstTickPos - Math.ceil(1 * (startingPoint + i))
      }
      const firstTickPosWithShift =
        firstTickPos - shiftFirstTickWidth + HALF_PIXEL

      ctx.save()
      ctx.transform(1, 0, 0, 1, firstTickPosWithShift, 0)
      ctx.beginPath()

      for (var j = 0; j < ticks.length; j++) {
        this.drawTick(ctx, j * gapSize, ticks[j])
      }

      ctx.stroke()
      ctx.restore()
      ctx.fillStyle = this.labelColor
      const labelOffsetX = this.labelOffsetX,
        labelOffsetY = this.labelOffsetY
      const label = Units.toFixedFloat(this.units, i / this.pixelsPerUnit)

      if (isXAxis) {
        ctx.fillText(
          ''.concat(label),
          firstTickPosWithShift + labelOffsetX,
          labelOffsetY
        )
      } else {
        ctx.scale(-1, 1)
        ctx.fillText(
          ''.concat(label),
          -firstTickPosWithShift + labelOffsetX,
          labelOffsetY
        )
        ctx.scale(-1, 1)
      }
    }
  }

  createTicks() {
    let gapSize
    let numTicks

    if (this.screenPixelsPerInterval <= TINY_INTERVAL_THRESHOLD) {
      gapSize = this.screenPixelsPerInterval / 5
      numTicks = 4
    } else {
      gapSize = this.screenPixelsPerInterval / 10
      numTicks = 9
    }

    const ticks = [this.tickDividerLength]

    for (var i = 1; i <= numTicks; i++) {
      if (i % 2 !== 0) {
        ticks.push(this.tickLargeLength)
      } else {
        ticks.push(this.tickSmallLength)
      }
    }

    return {
      gapSize,
      ticks
    }
  }

  drawTick(ctx, x, tickLength) {
    const fx = Math.floor(x)
    ctx.moveTo(fx, this.thickness - tickLength)
    ctx.lineTo(fx, this.thickness)
  }
}

const DEFAULT_RECT = [-1, -1, -1, -1]

class RulerPositionIndicator {
  constructor(ruler) {
    this.x = null
    this.y = null
    this.enabled = true
    this.visible = true
    this.color = '#d0cfd1'
    this._prevLeftRect = DEFAULT_RECT.slice()
    this._prevTopRect = DEFAULT_RECT.slice()
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.render = this.render.bind(this)
    this.clear = this.clear.bind(this)

    this.ruler = ruler
    this.canvas = this.ruler.canvas
    this.guideLine = this.ruler.guideLine
    this.canvas.on('after:render', this.render)
    this.canvas.on('mouse:move', this.onMouseMove)
    this.canvas.on('mouse:over', this.onMouseEnter)
    this.canvas.on('mouse:out', this.onMouseLeave)
  }

  dispose() {
    this.canvas.off('after:render', this.render)
    this.canvas.off('mouse:move', this.onMouseMove)
    this.canvas.off('mouse:over', this.onMouseEnter)
    this.canvas.off('mouse:out', this.onMouseLeave)
  }
  onMouseMove(opt) {
    this.x = opt.e.offsetX
    this.y = opt.e.offsetY
    this.render()
  }
  onMouseLeave(e) {
    if (!e.target) {
      this.visible = false
      this.clear()
    }
  }
  onMouseEnter() {
    this.visible = true
    this.render()
  }
  enable() {
    this.enabled = true
    this.render()
  }
  disable() {
    this.enabled = false
    this.clear()
    this._prevLeftRect = DEFAULT_RECT.slice()
    this._prevTopRect = DEFAULT_RECT.slice()
  }

  render() {
    const x = this.x,
      y = this.y,
      enabled = this.enabled,
      visible = this.visible
    const ctx = this.canvas.contextTop
    const { drawingDirection } = this.guideLine

    if (ctx == null || !enabled || !visible || x == null || y == null) {
      return
    }

    this.clear()
    const cornerSquareX = this.ruler.leftRulerOffset + this.ruler.thickness
    const cornerSquareY = this.ruler.topRulerOffset + this.ruler.thickness

    if (x < cornerSquareX && y < cornerSquareY) {
      return
    }

    ctx.save()
    ctx.strokeStyle = this.color
    ctx.beginPath()

    if (x > cornerSquareX && drawingDirection !== DIRECTION.v) {
      ctx.moveTo(x, this.ruler.topRulerOffset)
      ctx.lineTo(x, this.ruler.topRulerOffset + this.ruler.thickness)
    }

    if (y > cornerSquareY && drawingDirection !== DIRECTION.h) {
      ctx.moveTo(this.ruler.leftRulerOffset, y)
      ctx.lineTo(this.ruler.leftRulerOffset + this.ruler.thickness, y)
    }

    ctx.stroke()
    ctx.restore()
  }

  clear() {
    const ctx = this.canvas.contextTop
    const { drawingDirection } = this.guideLine

    if (ctx == null) {
      return
    }

    if (this._prevLeftRect[0] !== -1 && drawingDirection !== DIRECTION.h) {
      const p = this._prevLeftRect
      ctx.clearRect(p[0], p[1], p[2], p[3])
    }

    if (this._prevTopRect[0] !== -1 && drawingDirection !== DIRECTION.v) {
      const _p = this._prevTopRect
      ctx.clearRect(_p[0], _p[1], _p[2], _p[3])
    }

    this._prevLeftRect[0] = this.ruler.leftRulerOffset
    this._prevLeftRect[1] = 0
    this._prevLeftRect[2] = this.ruler.thickness
    this._prevLeftRect[3] = this.ruler.canvas.height
    this._prevTopRect[0] = 0
    this._prevTopRect[1] = this.ruler.topRulerOffset
    this._prevTopRect[2] = this.ruler.canvas.width
    this._prevTopRect[3] = this.ruler.thickness

    // this.guideLine.renderAll()
  }
}

class RulerGuideLine {
  drawingDirection = null
  constructor(canvas) {
    this.rulerPaths = {}
    this.canvas = canvas
    this.isRulerClicked = false
    this.ctxContainer = this.canvas.contextContainer
    this.canvas.on('mouse:wheel', this.handleMouseWheel)
    this.canvas.on('mouse:move', this.handleMouseMove)
    this.canvas.on('mouse:down', this.handleMouseDown)
    this.canvas.on('mouse:up', this.handleMouseUp)
    this.canvas.on('after:render', this.handleAfterRender)
  }

  createGuideLine = (direction, event) => {
    console.log(direction)
    const { x, y } = this.canvas.getPointer(event)
    const options = {
      fill: 'red',
      width: direction === DIRECTION.v ? 1 : 100000,
      height: direction === DIRECTION.h ? 1 : 100000,
      top: direction === DIRECTION.v ? 100000 / -2 : y,
      left: direction === DIRECTION.h ? 100000 / -2 : x
    }
    const line = new fabric.Rect(options)
    const lineGap = new fabric.Rect({
      fill: 'transparent',
      width: direction === DIRECTION.v ? 10 : 100000,
      height: direction === DIRECTION.h ? 10 : 100000,
      top: direction === DIRECTION.v ? 100000 / -2 - 5 : y - 5,
      left: direction === DIRECTION.h ? 100000 / -2 - 5 : x - 5
    })
    const group = new fabric.Group([lineGap, line], {
      isGuideLine: true,
      isDraggable: true,
      direction,
      hasBorders: false,
      hasControls: false,
      hasCorners: false,
      hoverCursor: direction === DIRECTION.v ? 'col-resize' : 'row-resize',
      lockMovementX: direction === DIRECTION.h ? true : false,
      lockMovementY: direction === DIRECTION.v ? true : false
    })
    this.updateGuideLineScale(group)
    this.canvas.add(group)
    this.canvas.setActiveObject(group)
    this.canvas.renderAll()
    return group
  }

  getActiveGuideline = () => {
    const activeObject = this.canvas.getActiveObject()
    if (!activeObject) return false

    if (activeObject.isGuideLine) {
      return activeObject
    }

    return false
  }

  updateGuideLineScale = guideline => {
    if (guideline.direction === DIRECTION.v)
      guideline.set({ scaleX: 1 / this.canvas.getZoom() })
    if (guideline.direction === DIRECTION.h)
      guideline.set({ scaleY: 1 / this.canvas.getZoom() })
  }

  getRulerDirection = e => {
    const { horizontal, vertical } = this.rulerPaths
    if (!horizontal || !vertical) return

    const mouseX = parseInt(e.offsetX)
    const mouseY = parseInt(e.offsetY)

    const isVRuler = this.ctxContainer.isPointInPath(vertical, mouseX, mouseY)
    const isHRuler = this.ctxContainer.isPointInPath(horizontal, mouseX, mouseY)

    if (isVRuler) {
      return DIRECTION.v
    }
    if (isHRuler) {
      return DIRECTION.h
    }

    return false
  }

  handleMouseWheel = props => {
    this.canvas._objects.forEach(item => {
      if (item.isGuideLine) {
        this.updateGuideLineScale(item)
      }
    })
  }

  handleMouseMove = props => {
    const line = this.getActiveGuideline()
    if (this.getActiveGuideline() && this.isRulerClicked) {
      const { x, y } = this.canvas.getPointer(props.e)
      const { direction } = line

      if (direction === DIRECTION.v) line.set({ left: x })
      if (direction === DIRECTION.h) line.set({ top: y })

      line.setCoords()
      this.canvas.renderAll()
    }
  }

  handleMouseDown = props => {
    const rulerDirection = this.getRulerDirection(props.e)

    if (!rulerDirection) return

    const line = this.getActiveGuideline()

    if (line) line.set({ isDragging: true })

    this.isRulerClicked = true
    this.canvas.selection = false

    this.drawingDirection = rulerDirection
    this.createGuideLine(this.drawingDirection, props.e)
  }

  handleMouseUp = props => {
    this.isRulerClicked = false

    const rulerDirection = this.getRulerDirection(props.e)

    const line = this.getActiveGuideline()
    if (line) {
      line.set({ isDragging: false })
      if (
        (line.direction === DIRECTION.h && rulerDirection === DIRECTION.h) ||
        (line.direction === DIRECTION.v && rulerDirection === DIRECTION.v)
      ) {
        this.canvas.remove(line)
      }
    }
  }

  handleAfterRender = () => {
    this.canvas._objects.forEach(item => {
      if (item.isGuideLine) {
        this.canvas.bringForward(item)
      }
    })
  }
}

const EditorRuler_HALF_PIXEL = 0.5

class CanvasRuler {
  constructor(canvas) {
    this.rulerMouseOver = false
    this.rulerPaths = null
    this.thickness = 26
    this.topRulerOffset = 0
    this.leftRulerOffset = 0
    this.rulerColor = '#f9f9f9'
    this.cornerSquareColor = '#d0cfd1'
    this.enabled = true
    this.onObjectSelected = this.onObjectSelected.bind(this)
    this.onSelectionCleared = this.onSelectionCleared.bind(this)
    this.render = this.render.bind(this)

    this.canvas = canvas
    this.updateCanvasFrame()
    this.scale = new initScale(this)
    this.scale.setThickness(this.thickness)
    this.guideLine = new RulerGuideLine(canvas)
    this.positionIndicator = new RulerPositionIndicator(this)
    this.canvas.on('mouse:move', this.handleMouseMove)
    this.canvas.on('object:selected', this.onObjectSelected)
    this.canvas.on('selection:cleared', this.onSelectionCleared)
    this.canvas.on('after:render', this.render)
  }

  dispose() {
    this.positionIndicator.dispose()
    this.canvas.off('object:selected', this.onObjectSelected)
    this.canvas.off('selection:cleared', this.onSelectionCleared)
    this.canvas.off('after:render', this.render)
  }

  enable() {
    if (this.enabled) {
      return
    }

    this.enabled = true
    this.positionIndicator.enable()
  }

  disable() {
    if (!this.enabled) {
      return
    }

    this.enabled = false
    this.positionIndicator.disable()
  }

  onObjectSelected() {
    this.render()
    this.positionIndicator.render()
  }

  onSelectionCleared() {
    this.render()
    this.positionIndicator.render()
  }

  render() {
    if (!this.enabled) {
      return
    }

    const ctx = this.canvas.contextContainer

    if (!this.canvasFrame || this.canvas.vptCoords.tl == null) {
      return
    }

    this.drawBackground(ctx)
    this.scale.setDimensions(this.canvas.width, this.canvas.height)
    this.scale.setPageViewport(this.canvasFrame, this.canvas.vptCoords)
    this.scale.draw(ctx)
    this.drawCornerSquare(ctx)
  }

  drawBackground(ctx) {
    const _this$canvas = this.canvas,
      width = _this$canvas.width,
      height = _this$canvas.height,
      leftRulerOffset = this.leftRulerOffset,
      topRulerOffset = this.topRulerOffset,
      thickness = this.thickness
    const x = leftRulerOffset + thickness - EditorRuler_HALF_PIXEL
    const y = topRulerOffset + thickness - EditorRuler_HALF_PIXEL
    ctx.fillStyle = this.rulerColor
    ctx.strokeStyle = this.scale.tickColor
    ctx.fillRect(0, topRulerOffset, width, thickness)
    ctx.fillRect(leftRulerOffset, 0, thickness, height)
    ctx.beginPath()
    ctx.moveTo(width, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, height)
    ctx.stroke()

    const topRulerPath = new Path2D()
    topRulerPath.rect(0, topRulerOffset, width, thickness)
    const leftRulerPath = new Path2D()
    leftRulerPath.rect(leftRulerOffset, 0, thickness, height)

    this.rulerPaths = {
      horizontal: topRulerPath,
      vertical: leftRulerPath
    }
    this.guideLine.rulerPaths = this.rulerPaths
  }

  drawCornerSquare(ctx) {
    ctx.save()
    ctx.transform(1, 0, 0, 1, this.leftRulerOffset, this.topRulerOffset)
    ctx.fillStyle = this.cornerSquareColor
    ctx.fillRect(0, 0, this.thickness, this.thickness)
    ctx.restore()
  }

  handleMouseMove = props => {
    if (!this.rulerPaths) return
    const ctx = this.canvas.contextContainer
    const mouseX = parseInt(props.e.offsetX)
    const mouseY = parseInt(props.e.offsetY)
    const { horizontal, vertical } = this.rulerPaths

    if (
      ctx.isPointInPath(vertical, mouseX, mouseY) ||
      ctx.isPointInPath(horizontal, mouseX, mouseY)
    ) {
      this.rulerMouseOver = true
      this.canvas.defaultCursor = 'pointer'
    } else {
      if (!this.rulerMouseOver) return

      this.rulerMouseOver = false
      this.canvas.defaultCursor = 'default'
    }
  }

  updateCanvasFrame() {
    this.canvasFrame = this.canvas.getObjects().find(obj => obj.isFrame)
  }
}

export default CanvasRuler
