import { fabric } from 'fabric'

const rotateImage = require('common/icons/sync-solid.svg')

const setPrototypes = canvas => {
  fabric.Object.prototype.fill = 'rgba(0,0,0,1)'
  fabric.Object.prototype.getZIndex = function () {
    return canvas.getObjects().indexOf(this)
  }
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.borderColor = '#0A84C9'
  fabric.Object.prototype.cornerStrokeColor = '#878787'
  fabric.Object.prototype.cornerColor = '#fff'
  fabric.Object.prototype.cornerSize = 9
  fabric.Object.prototype.rotatingPointOffset = 25

  fabric.IText.prototype.onKeyDown = (onKeyDown => {
    return function (e) {
      const activeObject = canvas.getActiveObject()

      if (e.keyCode === 13) {
        const { selectionStart, selectionEnd, isEditing } = activeObject
        if (isEditing) {
          const prevCharStyles = activeObject.getSelectionStyles(
            selectionStart - 1,
            selectionEnd
          )
          activeObject.setSelectionStyles(
            ...prevCharStyles,
            selectionStart,
            selectionEnd + 1
          )

          if (activeObject.typeList) {
            // 	console.log('typeList', activeObject.typeList)
          }
        }
      }
      onKeyDown.call(this, e)
    }
  })(fabric.IText.prototype.onKeyDown)
  fabric.Object.prototype.drawControls = function (ctx) {
    if (!this.hasControls) {
      return this
    }

    const wh = this._calculateCurrentDimensions(),
      width = wh.x,
      height = wh.y,
      scaleOffset = this.cornerSize,
      left = -(width + scaleOffset) / 2,
      top = -(height + scaleOffset) / 2,
      methodName = this.transparentCorners ? 'stroke' : 'fill'

    ctx.save()

    ctx.strokeStyle = ctx.fillStyle = this.cornerColor

    if (!this.transparentCorners) {
      ctx.strokeStyle = this.cornerStrokeColor
    }

    this._setLineDash(ctx, this.cornerDashArray, null)

    this._drawControl('tl', ctx, methodName, left, top)
    this._drawControl('tr', ctx, methodName, left + width, top)
    this._drawControl('bl', ctx, methodName, left, top + height)
    this._drawControl('br', ctx, methodName, left + width, top + height)

    if (!this.get('lockUniScaling')) {
      this._drawControl('mt', ctx, methodName, left + width / 2, top)
      this._drawControl('mb', ctx, methodName, left + width / 2, top + height)
      this._drawControl('mr', ctx, methodName, left + width, top + height / 2)
      this._drawControl('ml', ctx, methodName, left, top + height / 2)
    }

    if (this.hasRotatingPoint) {
      this._drawControl(
        'mtr',
        ctx,
        methodName,
        left + width / 2,
        top - this.rotatingPointOffset
      )

      const rotate = new Image()
      rotate.src = rotateImage

      ctx.beginPath()
      ctx.arc(
        left + width / 2 + 4.5,
        top - this.rotatingPointOffset + 4,
        8,
        Math.PI * 2,
        false
      )
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '878787'
      ctx.lineWidth = 1
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.globalAlpha = 0.6
      ctx.drawImage(
        rotate,
        left + width / 2 - 1,
        top - this.rotatingPointOffset - 1,
        11,
        11
      )
      ctx.fill()
    }

    ctx.restore()
    return this
  }
}

export default setPrototypes
