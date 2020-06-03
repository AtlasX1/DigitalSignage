import { fabric } from 'fabric'

import {
  isEqual as _isEqual,
  isEqualWith as _isEqualWith,
  uniqueId as _uniqueId,
  isObject as _isObject,
  isEmpty as _isEmpty,
  find as _find,
  isUndefined as _isUndefined,
  filter as _filter
} from 'lodash'

import {
  TABS_NAMES,
  SAVED_OBJECT_OPTIONS,
  MAX_ZOOM,
  MIN_ZOOM,
  RULER_HEIGHT,
  FABRIC_EXAMPLE_TEXT,
  ALLOWED_SELECTION_STYLES
} from '../../../constans'

import { setSelectedBg } from 'actions/signageEditorActions'

class CanvasHandlers {
  constructor(props) {
    const {
      canvas,
      canvasHistory,
      canvasRuler,
      canvasUtils,
      setCanvasState,
      canvasZoom,
      dispatchAction
    } = props

    this.canvas = canvas
    this.canvasHistory = canvasHistory
    this.canvasRuler = canvasRuler
    this.canvasUtils = canvasUtils
    this.canvasZoom = canvasZoom
    this.setCanvasState = setCanvasState
    this.dispatchAction = dispatchAction

    this.attachEventListener()
  }

  sendActiveObjectToForward = () => {
    const { canvas, canvasHistory } = this
    const activeObject = canvas.getActiveObject()
    activeObject && canvas.bringForward(activeObject)
    canvasHistory.updateHistory()
  }

  sendActiveObjectToBackwards = () => {
    const { canvas, canvasHistory } = this
    const activeObject = canvas.getActiveObject()
    if (activeObject && this.getObjectIndex(activeObject) > 1) {
      canvas.sendBackwards(activeObject)
      canvasHistory.updateHistory()
    }
  }

  getTextBoxStyleValue = (obj, propName) => {
    const { selectionStart, selectionEnd, isEditing } = obj
    if (!isEditing) {
      let returnValue = obj[propName]
      if (!_isEmpty(obj.styles)) {
        const objectsWithAnotherValue = _filter(obj.styles, value => {
          return !!_filter(value, s => {
            if (_isUndefined(s[propName])) return false
            return s[propName] !== returnValue
          }).length
        }).length
        if (objectsWithAnotherValue) returnValue = 'mix'
      }
      return returnValue
    } else {
      let startPos = selectionStart,
        endPos = selectionEnd
      const selectedText = obj.getSelectedText().length

      if (!selectedText) {
        const { prevChar } = this.getPrevNextChars(obj)
        startPos = !selectionStart ? 0 : selectionStart - 1

        if (!selectionEnd) endPos = selectionEnd + 1
        if (prevChar === '\n') {
          startPos = startPos + 1
          endPos = endPos + 1
        }
      }

      const selectionStyles = obj.getSelectionStyles(startPos, endPos)
      const objectWithProp = selectionStyles.find(obj => {
        return !_isUndefined(obj[propName])
      })

      if (objectWithProp) {
        const propValue = objectWithProp[propName]
        const findedObjects = selectionStyles.filter(el => {
          return el[propName] === propValue
        })

        return selectionStyles.length === findedObjects.length
          ? propValue
          : 'mix'
      } else {
        return obj[propName] || null
      }
    }
  }

  getShadowProperties = shadow => {
    const { id, ...props } = shadow
    return props
  }

  getObjectsStyleValue = propName => {
    const activeObjects = this.canvas.getActiveObjects()
    const objectWithProp = activeObjects.find(obj => obj[propName])

    if (activeObjects.length === 1) {
      const obj = activeObjects[0]
      return this.getTextBoxStyleValue(obj, propName)
    }

    if (objectWithProp) {
      const propValue = objectWithProp[propName]
      const findedObjects = activeObjects.filter(obj => {
        const exception = (objValue = {}, othValue = {}) => {
          if (propName === 'shadow') {
            return _isEqual(
              this.getShadowProperties(objValue),
              this.getShadowProperties(othValue)
            )
          }
          return _isEqual(objValue, othValue)
        }

        return _isEqualWith(obj[propName], propValue, exception)
      })
      return findedObjects.length === activeObjects.length ? propValue : 'mix'
    }
    return null
  }

  // Set
  isTextBoxObjects = () => {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      if (activeObject.isType('textbox')) return true
      if (activeObject.isType('activeSelection')) {
        const { _objects } = activeObject
        const textBoxes = _objects.filter(obj => obj.isType('textbox'))
        if (textBoxes.length === _objects.length) return true
      }
    }
    return false
  }

  getAllowedSelectionStyles = styles => {
    const allowed = {},
      disallowed = {}

    if (_isObject(styles)) {
      Object.keys(styles).forEach(el => {
        if (ALLOWED_SELECTION_STYLES.includes(el)) {
          allowed[el] = styles[el]
        } else {
          disallowed[el] = styles[el]
        }
      })
    }
    return { allowed, disallowed }
  }

  setObjectsShadow = shadow => {
    const { canvas, canvasHistory } = this
    const activeObjects = canvas.getActiveObjects()
    activeObjects.forEach(obj => {
      obj.setShadow(shadow)
    })
    canvas.renderAll()
    canvasHistory.updateHistory()
    this.updateAtiveObjects()
  }

  getPrevNextChars = obj => {
    const { selectionStart, selectionEnd, text } = obj
    const prevChar = text.substring(selectionStart - 1, selectionStart)
    const nextChar = text.substring(selectionEnd, selectionEnd + 1)
    return { prevChar, nextChar }
  }

  setTextBoxStyles = (obj, styles) => {
    const { selectionStart, selectionEnd, isEditing, text } = obj
    const selectedText = obj.getSelectedText() || text
    let endPos = selectionEnd

    if (text.length === selectionEnd) endPos = selectionEnd + 1

    const { allowed, disallowed } = this.getAllowedSelectionStyles(styles)
    if (allowed && isEditing && selectedText.length) {
      obj.setSelectionStyles(allowed, selectionStart, endPos)
      if (disallowed) {
        obj.set(disallowed)
        Object.keys(disallowed).forEach(s => obj.removeStyle(s))
      }
    } else {
      obj.set(styles)
      Object.keys(styles).forEach(s => obj.removeStyle(s))
    }
    obj.setCoords()
  }

  setTextBoxProps = props => {
    const { canvas, canvasHistory } = this
    const activeObjects = canvas.getActiveObjects()
    const textBoxExist = activeObjects.find(o => o.isType('textbox'))
    if (textBoxExist) {
      activeObjects.forEach(obj => {
        if (!obj.isType('textbox')) return false
        this.setTextBoxStyles(obj, props)
      })
      canvas.renderAll()
      canvasHistory.updateHistory()
      this.updateAtiveObjects()
    }
  }

  getNewTextStyles = (obj, propName, value) => {
    let styles
    let currentValue = this.getTextBoxStyleValue(obj, propName)
    if (currentValue === 'mix') currentValue = false
    switch (value) {
      case 'bold':
        styles = {
          [propName]: currentValue === 'bold' ? 'normal' : 'bold'
        }
        break

      case 'italic':
        styles = {
          fontStyle: currentValue === 'italic' ? 'normal' : 'italic'
        }
        break
      case 'underline':
      case 'through':
        styles = {
          [propName]: !currentValue
        }
        break
      case 'caps':
        styles = {
          [propName]: !currentValue,
          text: !currentValue ? obj.text.toUpperCase() : obj.text.toLowerCase()
        }
        break
      default:
        styles = {}
    }
    return styles
  }
  setTextBoxStyle = (propName, value) => {
    const { canvas, canvasHistory, canvasUtils } = this
    const activeObjects = canvas.getActiveObjects()
    const textBoxObjects = activeObjects.filter(o => o.isType('textbox'))
    const unstyledObjects = textBoxObjects.filter(o => {
      return !canvasUtils.checkTextProp(o, value)
    })

    if (textBoxObjects.length) {
      const setStyleForObjects = objects => {
        objects.forEach(obj => {
          const newStyles = this.getNewTextStyles(obj, propName, value)
          this.setTextBoxStyles(obj, newStyles)
        })
      }

      if (unstyledObjects.length) {
        setStyleForObjects(unstyledObjects)
      } else {
        setStyleForObjects(textBoxObjects)
      }

      canvas.renderAll()
      canvasHistory.updateHistory()
      this.updateAtiveObjects()
    }
  }

  setObjectRotate = (direction, angle) => {
    const activeObject = this.canvas.getActiveObject()
    const newAngle = angle * (direction === 'rotateLeft' ? -1 : 1)
    activeObject.rotate(activeObject.angle + newAngle).setCoords()
    this.canvas.renderAll()
  }

  findByTop = (objects, top) => {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].top === top) return i
    }
  }

  findByPos = (objects, pos) => {
    var tops = []
    for (var i = 0; i < objects.length; i++) {
      tops.push(objects[i].top)
    }
    tops.sort((a, b) => a - b)
    return this.findByTop(objects, tops[pos])
  }

  setObjectAlign = (align, gap = 5) => {
    const { canvas } = this
    const frameLayer = this.getFrameLayer()
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return false

    if (activeObject.type === 'activeSelection') {
      const activeObjects = activeObject._objects
      const widthSelectionArea = activeObject.width
      const heightSelectionArea = activeObject.height

      const activeGroup = canvas.getActiveObjects()

      activeObjects.forEach(obj => {
        const objWidth = obj.getScaledWidth()
        const objHeight = obj.getScaledHeight()

        switch (align) {
          case 'alignLeft':
            obj.set({
              left: -(widthSelectionArea / 2),
              originX: 'left'
            })
            break
          case 'alignRight':
            obj.set({
              left: widthSelectionArea / 2 - objWidth,
              originX: 'left'
            })
            break
          case 'alignTop':
            obj.set({
              top: -(heightSelectionArea / 2),
              originY: 'top'
            })
            break
          case 'alignBottom':
            obj.set({
              top: heightSelectionArea / 2,
              originY: 'bottom'
            })
            break
          case 'alignHCenter':
            obj.set({
              left: 0 - objWidth / 2,
              originX: 'left'
            })
            break
          case 'alignVCenter':
            obj.set({
              top: 0 - objHeight / 2,
              originY: 'top'
            })
            break
          case 'alignHEventCenter':
          case 'alignVEventCenter':
            if (activeGroup && activeGroup.length >= 2) {
              const position = align === 'alignVEventCenter' ? 'top' : 'left'
              const getSize = item =>
                align === 'alignVEventCenter'
                  ? item.height * item.scaleY
                  : item.width * item.scaleX

              activeGroup.sort((a, b) => a[position] - b[position])

              activeGroup.forEach((object, index) => {
                if (index === 0) {
                  object.setCoords()
                } else {
                  object[position] =
                    activeGroup[index - 1][position] +
                    getSize(activeGroup[index - 1]) +
                    gap
                }

                object.setCoords()
              })
            }
            break
          default:
            obj.setCoords()
        }
        obj.setCoords()
      })

      const oldSelection = canvas.getActiveObjects()
      canvas.discardActiveObject()
      const sel = new fabric.ActiveSelection(oldSelection, { canvas })
      canvas.setActiveObject(sel)
    } else {
      const activeObjWidth = activeObject.getScaledWidth()

      switch (align) {
        case 'alignLeft':
          activeObject.set({
            left: frameLayer.left,
            originX: 'left'
          })
          break
        case 'alignRight':
          activeObject.set({
            left: frameLayer.left + frameLayer.width - activeObjWidth,
            originX: 'left'
          })
          break
        case 'alignTop':
          activeObject.set({
            top: frameLayer.top,
            originY: 'top'
          })
          break
        case 'alignBottom':
          activeObject.set({
            top: frameLayer.top + frameLayer.height,
            originY: 'bottom'
          })
          break
        case 'alignHCenter':
          activeObject.set({
            left: frameLayer.left + frameLayer.width / 2,
            originX: 'center'
          })
          break
        case 'alignVCenter':
          activeObject.set({
            top: frameLayer.top + frameLayer.height / 2,
            originY: 'center'
          })
          break
        default:
          activeObject.setCoords()
      }
      activeObject.setCoords()
    }
    this.canvas.renderAll()
    this.canvasHistory.updateHistory()
  }

  setListStyle = type => {
    const activeObject = this.canvas.getActiveObject()

    const allStyles = {
      bullet: '\u25CF',
      diamond: '\u25C8',
      invertedBullet: '\u25D8',
      triangularBullet: '\u25BA',
      disced: '\u25CB',
      squared: '\u25A0',
      dashed: '-',
      none: ''
    }
    var text = activeObject.text
    var textArray = text.split('\n')
    var tempStr = []
    textArray.forEach(text => {
      const firstLetter = text.substr(0, 1)
      const isStyleExist = _find(allStyles, s => s === firstLetter)

      if (isStyleExist) {
        tempStr.push(text.replace(firstLetter, allStyles.none))
      } else {
        tempStr.push(allStyles[type] + '' + text)
      }
    })
    activeObject.set({
      typeList: type,
      text: tempStr.join('\n')
    })

    this.canvas.renderAll()
    this.canvasHistory.updateHistory()
  }

  setLoading(status) {
    this.setCanvasState(state => ({
      ...state,
      isLoading: status
    }))
  }

  setLocalStorageConfig = config => {
    window.localStorage.setItem(
      'config',
      JSON.stringify(config) || this.getCanvasConfig()
    )
  }

  setCanvasBgImage(url, scalex = 1) {
    this.setLoading(true)
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const { width, height } = img
      const frameLayer = this.getFrameLayer()
      const canvasAspect = frameLayer.width / frameLayer.height
      const imgAspect = width / height

      let scaleFactor
      if (canvasAspect >= imgAspect) {
        scaleFactor = (frameLayer.width / width) * scalex
      } else {
        scaleFactor = (frameLayer.height / height) * scalex
      }

      fabric.util.loadImage(
        url,
        img => {
          const bg = new fabric.Image(img)
          bg.set({
            isBackground: true,
            originY: 'top',
            originX: 'left',
            top: frameLayer.top,
            left: frameLayer.left,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            strokeWidth: 0,
            clipPath: frameLayer,
            crossOrigin: 'Anonymous'
          })
          this.canvas.add(bg)
          this.setObjectAsBackground(bg)
          this.canvasHistory.updateHistory()
          this.setLoading(false)
        },
        null,
        { crossOrigin: 'Anonymous' }
      )
    }
    img.src = url
  }

  setCanvasBgPattern(url = '') {
    fabric.loadSVGFromURL(url, (objects, options) => {
      const frameLayer = this.getFrameLayer()
      const img = fabric.util.groupSVGElements(objects, options)
      const xAmount = frameLayer.width / img.width + 1
      const yAmount = frameLayer.height / img.height + 1
      const patterns = []
      for (let i = 1; i <= xAmount; i++) {
        for (let j = 1; j <= yAmount; j++) {
          img.clone(
            ((i, j) => {
              return clone => {
                clone.set({
                  left: i * img.width,
                  top: j * img.height
                })
                patterns.push(clone)
              }
            })(i, j)
          )
        }
      }
      const patternsGroup = new fabric.Group(patterns, {
        width: frameLayer.width,
        height: frameLayer.height,
        originX: 'left',
        originY: 'top',
        top: frameLayer.top,
        left: frameLayer.left,
        isBackground: true,
        selectable: false,
        hoverCursor: 'default',
        hasBorders: false,
        hasControls: false,
        hasCorners: false,
        clipPath: frameLayer
      })
      this.canvas.add(patternsGroup)
      this.setObjectAsBackground(patternsGroup)
      this.canvasHistory.updateHistory()
      return patternsGroup
    })
  }

  setBackground = ({ id, url, type }) => {
    this.deleteCanvasBg()
    if (type === TABS_NAMES.patterns) this.setCanvasBgPattern(url)
    if (type === TABS_NAMES.background) this.setCanvasBgImage(url)
    this.dispatchAction(setSelectedBg(id))
  }

  setObjectAsBackground(obj) {
    const { canvas } = this
    canvas.sendToBack(obj)
    canvas.bringForward(obj)
    canvas.renderAll()
  }

  setActiveObject(objects) {
    const { canvas } = this
    let activeSelection
    canvas.discardActiveObject()

    if (!objects.length) return false
    if (objects.length > 1) {
      activeSelection = new fabric.ActiveSelection(objects, {
        canvas
      })
    } else {
      activeSelection = objects[0]
    }

    this.canvas.setActiveObject(activeSelection)
    this.canvas.renderAll()
  }

  // Update
  updateObjectsIndex() {
    const { canvas } = this
    canvas.getObjects().forEach(obj => {
      if (!obj.excludeFromExport) canvas.bringToFront(obj)
      if (obj.isBackground) this.setObjectAsBackground(obj)
    })
    canvas.renderAll()
  }

  updateClipPath() {
    const { canvas } = this
    canvas.getObjects().forEach(obj => {
      if (obj.clipPath) obj.clipPath = this.getFrameLayer()
    })
    canvas.renderAll()
  }

  // undo
  loadCanvasByHistoryIndex(index) {
    this.canvasHistory.setHistoryIndex(index)

    this.canvas.loadFromJSON(this.canvasHistory.state[index], () => {
      this.updateClipPath()
    })
  }

  undoChange = () => {
    const { index } = this.canvasHistory.getHistory()
    const newIndex = index > 0 ? index - 1 : 0
    this.loadCanvasByHistoryIndex(newIndex)
  }

  redoChange = () => {
    const { index, state } = this.canvasHistory.getHistory()
    const newIndex = index >= state.length - 1 ? index : index + 1
    this.loadCanvasByHistoryIndex(newIndex)
  }

  // Copy/Paste
  copyActiveObject(duplicate = false) {
    const activeObject = this.canvas.getActiveObject()
    activeObject.clone(cloned => {
      this.canvas.clipboard = cloned
      duplicate && this.pasteClipboard()
    }, SAVED_OBJECT_OPTIONS)
  }

  pasteClipboard() {
    if (!this.canvas.clipboard) return
    this.canvas.clipboard.clone(clonedObj => {
      this.canvas.discardActiveObject()
      clonedObj.set({
        left: clonedObj.left + 50,
        top: clonedObj.top + 50
      })
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = this.canvas
        clonedObj.forEachObject(obj => {
          this.canvas.add(obj)
        })
        clonedObj.setCoords()
      } else {
        this.canvas.add(clonedObj)
      }

      this.canvas.setActiveObject(clonedObj)
      this.canvas.requestRenderAll()
      this.canvasHistory.updateHistory()
    }, SAVED_OBJECT_OPTIONS)
  }

  // GROUP / UNGROUP
  groupingObjects(objects, existGroup) {
    if (existGroup) {
      const objectToGrouping = this.canvas._objects.filter(o => {
        return o.groupedId === existGroup.id && !o.isRemoving
      })

      if (objectToGrouping.length > 1) {
        objectToGrouping.forEach(o => {
          // existGroup.add(o)
          existGroup.addWithUpdate(o)
          this.canvas.remove(o)
        })
        existGroup._objects.forEach(o => o.setCoords())
        existGroup.isUngrouped = false
        this.canvas.renderAll()
        return existGroup
      } else {
        objectToGrouping.forEach(o => {
          o.groupedId = null
        })
        this.canvas.remove(existGroup).renderAll()
      }
    } else {
      const group = new fabric.Group(objects, {
        id: _uniqueId(),
        subTargetCheck: true,
        originX: 'left',
        originY: 'top'
      })
      group.on(
        'mousedown',
        ({ target }) => {
          if (target.isUngrouped) {
            this.groupingObjects(objects, target)
          }
        },
        false
      )
      group.setControlsVisibility({
        mt: false,
        mb: false
      })
      return group
    }
  }

  ungroupingObjects(group) {
    group.isUngrouped = true
    group._restoreObjectsState()
    group.forEachObject(obj => {
      obj
        .set({
          groupedId: group.id
        })
        .setCoords()
      this.canvas.add(obj)
      group.remove(obj)
    })
    this.canvas.renderAll()
  }

  // Zoom
  checkViewportTransform() {
    const coords = this.canvas.viewportTransform
    return _isEqual(coords, [1, 0, 0, 1, 0, 0])
  }

  setZoom(point, zoom) {
    if (!point) point = this.canvas.getVpCenter()
    this.canvas.zoomToPoint(point, zoom)
    this.canvas.renderAll()

    // this.canvasRuler.api.setScale(zoom)
    this.canvasZoom = zoom
    this.setCanvasState(state => ({ ...state, canvasZoom: zoom }))
  }

  setZoomIn = (point, zoom = 0.25) => {
    const newZoom = this.canvas.getZoom() + zoom
    const minZoom = newZoom > MAX_ZOOM ? MAX_ZOOM : newZoom
    this.setZoom(point, minZoom)
  }

  setZoomOut = (point, zoom = -0.25) => {
    const newZoom = this.canvas.getZoom() + zoom
    const minZoom = newZoom < MIN_ZOOM ? MIN_ZOOM : newZoom
    this.setZoom(point, minZoom)
  }

  resetZoom() {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    this.setZoom(false, 1)
  }

  setZoomByScroll = event => {
    const { deltaY, offsetX, offsetY } = event
    const newZoom = (deltaY / 1000) * 2
    const isScrollDown = newZoom > 0
    const point = { x: offsetX, y: offsetY }

    isScrollDown
      ? this.setZoomOut(point, -newZoom)
      : this.setZoomIn(point, -newZoom)
  }

  // lock/unlock
  toggleLockObject(toLock = true) {
    const { canvas } = this
    const activeObjects = canvas.getActiveObjects()
    if (!activeObjects) return
    activeObjects.forEach(obj => {
      if (obj.lockMovementY && !toLock) {
        obj.lockMovementY = obj.lockMovementX = obj.lockScalingY = obj.lockScalingX = false
        obj.hasControls = true
        obj.hoverCursor = 'pointer'
        obj.locked = false
      }
      if (toLock) {
        obj.lockMovementY = obj.lockMovementX = obj.lockScalingY = obj.lockScalingX = true
        obj.hasControls = false
        obj.hoverCursor = 'default'
        obj.locked = true
        obj.lockedleft = obj.left
        obj.lockedtop = obj.top
      }
    })
    activeObjects.length > 1 && canvas.discardActiveObject()
    canvas.renderAll()
    this.canvasHistory.updateHistory()
  }

  setLockObject = () => {
    this.toggleLockObject(true)
  }

  setUnlockObject = () => {
    this.toggleLockObject(false)
  }

  handleCanvasMouseWheel = opt => {
    opt.e.preventDefault()
    opt.e.stopPropagation()

    if (opt.e.altKey || opt.e.ctrlKey) {
      this.setZoomByScroll(opt.e)
    } else {
      const distance = opt.e.deltaY < 0 ? 20 : -20
      const delta = opt.e.shiftKey
        ? { x: distance, y: 0 }
        : { x: 0, y: distance }
      this.canvas.relativePan(delta)
    }
  }

  updateAtiveObjects = () => {
    const activeObject = this.canvas.getActiveObject()
    this.setCanvasState(state => ({
      ...state,
      activeObject
    }))
  }

  handleCanvasSelection = props => {
    const { selected, target, deselected } = props
    if (deselected && deselected.length) {
      if (deselected[0].isType('textbox') && !deselected[0].text.length) {
        this.deleteActiveObject({ objects: deselected })
      }

      const deselectedId = deselected[0].groupedId
      if (deselectedId) {
        if (selected && deselectedId === selected[0].groupedId) return false

        const objects = this.canvas._objects
        const group = objects.find(o => o.id === deselectedId)
        const groupedObjects = objects.filter(
          el => el.groupedId === deselectedId
        )
        this.groupingObjects(groupedObjects, group)
      }
    }

    if (target) {
      // reset selection only for GROUP!
      if (target.type === 'activeSelection') {
        if (selected.find(o => o.locked || o.isGuideLine)) {
          const objects = selected
            .filter(obj => !obj.locked)
            .filter(obj => !obj.isGuideLine)
          this.setActiveObject(objects)
        }
      }
    }

    this.updateAtiveObjects()
  }

  handleCanvasKeyDown = e => {
    let charCode = String.fromCharCode(e.which).toLowerCase()

    if (e.which === 8 || e.which === 46) {
      e.preventDefault()
      this.deleteActiveObject()
    }
    if ((e.ctrlKey || e.metaKey) && charCode === 'c') {
      e.preventDefault()
      this.copyActiveObject()
    }
    if ((e.ctrlKey || e.metaKey) && charCode === 'v') {
      e.preventDefault()
      this.pasteClipboard()
    }

    if ((e.ctrlKey || e.metaKey) && charCode === 'a') {
      e.preventDefault()
      const objects = this.canvas.getObjects().filter(obj => !obj.isFrame)
      this.setActiveObject(objects)
    }

    if ((e.ctrlKey || e.metaKey) && charCode === 'd') {
      e.preventDefault()
      this.copyActiveObject(true)
    }

    if ((e.ctrlKey || e.metaKey) && charCode === 'z' && !e.shiftKey) {
      e.preventDefault()
      this.undoChange()
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && charCode === 'z') {
      e.preventDefault()
      this.redoChange()
    }
  }

  handleCanvasDblClick = e => {
    const { subTargets, target } = e
    if (target) {
      const isGroup = target.isType('group')
      if (isGroup && subTargets.length) {
        this.ungroupingObjects(target)
        this.setActiveObject(subTargets)
      }
    }
  }

  handleHighlightObject = (e, over) => {
    if (!over) return this.canvas.renderAll()

    const obj = e.target
    if (obj && !obj.isFrame && !obj.withoutRenderControls) {
      const activeObj = this.canvas.getActiveObject()
      if (!_isEqual(obj, activeObj)) {
        obj._renderControls(this.canvas.getContext(), {
          hasControls: false
        })
      }
    }
  }

  handleSelectionChanged = ({ target }) => {
    // target.selectionStart = 2
    // target.selectionEnd = 2
    // console.log('?', target.moveCursorDown(e => {
    // 	console.log('e', e)
    // }))
    // if () {
    // }
    target && this.updateAtiveObjects()
  }

  handleTextExited = e => {
    // const selectionStyles = e.target.styles
    // _map(selectionStyles, s => {
    //   console.log('s', s)
    // })
    // check all selection style and set style for object
  }

  attachEventListener() {
    const canvasContainer = document.querySelector('.design-gallery .content')
    canvasContainer.addEventListener('keydown', this.handleCanvasKeyDown, false)
    window.addEventListener('resize', this.handleCanvasResize, false)

    this.canvas.on({
      'text:selection:changed': this.handleSelectionChanged,
      'text:changed': this.handleSelectionChanged,
      'text:editing:exited': this.handleTextExited,
      'object:scaling': e => {
        const isGroup = e.target.isType('group')
        if (isGroup) {
          // scaling for TEXTBOX
          // const group = e.target
          // const groupObjects = group._objects
          // const w = group.width * group.scaleX,
          //   h = group.height * group.scaleY
          // group.set({
          //   height: h,
          //   width: w,
          //   scaleX: 1,
          //   scaleY: 1
          // })
        }
      },
      'object:modified': () => {
        this.canvasHistory.updateHistory()
      },
      'mouse:move': opt => {
        const { e, subTargets } = opt
        if (e.ctrlKey || e.metaKey) {
          if (subTargets && subTargets.length) {
            const subTarget = subTargets[0]

            if (subTarget.isType('textbox')) {
              // text decoradion
            } else {
              subTarget._renderControls(this.canvas.getContext(), {
                hasControls: false
              })
            }
          }
        }
      },
      'mouse:wheel': this.handleCanvasMouseWheel,
      'mouse:over': e => this.handleHighlightObject(e, true),
      'mouse:out': e => this.handleHighlightObject(e, false),
      'mouse:dblclick': this.handleCanvasDblClick,
      'selection:created': this.handleCanvasSelection,
      'selection:updated': this.handleCanvasSelection,
      'selection:cleared': this.handleCanvasSelection
    })
  }

  setCenterAll = (duration = 0) => {
    const { canvas, getPositionByOrigin, getFrameLayer } = this
    const frame = getFrameLayer()
    const oldTop = frame.top
    const oldLeft = frame.left
    const frameNewPosition = getPositionByOrigin(frame, 'center', 'center')

    if (duration) {
      frame.animate(frameNewPosition, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease['easeOutCubic'],
        duration,
        onComplete: () => frame.setCoords()
      })
    } else {
      frame.set(frameNewPosition).setCoords()
    }

    const diffTop = frameNewPosition.top - oldTop
    const diffLeft = frameNewPosition.left - oldLeft

    canvas.getObjects().forEach(obj => {
      const newOptions = {
        left: obj.left + diffLeft,
        top: obj.top + diffTop
      }
      if (!obj.isFrame) {
        if (duration) {
          obj.animate(newOptions, {
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease['easeOutCubic'],
            duration,
            onComplete: () => obj.setCoords()
          })
        } else {
          obj.set(newOptions).setCoords()
        }
      }
    })
    canvas.renderAll()
    // this.canvasRuler.api.setSize()
  }

  getPositionByOrigin = (obj, originX, originY) => {
    const { left, top } = this.canvas.getCenter()
    const point = new fabric.Point(left, top)
    const center = obj.translateToCenterPoint(point, originX, originY)
    const newPos = obj.translateToOriginPoint(center, obj.originX, obj.originY)
    return { left: newPos.x, top: newPos.y }
  }

  setCanvasSize = (width, height) => {
    this.canvas.setDimensions({ width, height })
    this.canvas.renderAll()
    // this.canvasRuler.api.setSize()
  }

  handleCanvasResize = () => {
    const { width, height } = this.getContentViewport()
    this.setCanvasSize(width, height)
    this.setCenterAll(100)
  }

  // Get
  getFrameLayer = () => {
    return this.canvas.getObjects().find(obj => obj.isFrame)
  }

  getCanvasConfig = () => {
    return JSON.stringify(this.canvas.toJSON(SAVED_OBJECT_OPTIONS))
  }

  getContentViewport() {
    const canvasContainer = this.canvas.wrapperEl.closest('.content')
    const { width, height } = canvasContainer.getBoundingClientRect()
    return {
      width,
      height
    }
  }

  getLocalStorageConfig() {
    return window.localStorage.getItem('config')
  }

  getObjectIndex(obj) {
    return this.canvas.getObjects().indexOf(obj)
  }

  applyCanvasConfig = config => {
    const { canvas } = this
    this.setLoading(true)
    canvas.clear()
    this.resetZoom()

    canvas.loadFromJSON(config, () => {
      canvas.renderAll.bind(canvas)
      this.canvasRuler.updateCanvasFrame()
      this.setCenterAll()
      this.updateClipPath()
      this.canvasHistory.updateHistory()
      this.setLoading(false)
    })
  }

  animateObjectIn({ obj, ownCenter, coords = {}, anim = true }) {
    const { canvas, canvasHistory } = this
    const { x, y } = canvas.getVpCenter()
    const currentZoom = canvas.getZoom()
    const endPosition = {
      x: coords.x ? coords.x - ownCenter.x : x - RULER_HEIGHT / 2 - ownCenter.x,
      y: coords.y ? coords.y - ownCenter.y : y - RULER_HEIGHT / 2 - ownCenter.y
    }
    const startYPosition = y - canvas.height / 2 / currentZoom

    obj
      .set({
        top: anim ? startYPosition : endPosition.y,
        left: endPosition.x
      })
      .setCoords()

    canvas.add(obj).setActiveObject(obj).renderAll()

    if (anim) {
      obj.animate('top', endPosition.y, {
        duration: 600,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: () => {
          obj.setCoords()
          canvas.renderAll()
          canvasHistory.updateHistory()
          // if (obj.isType('textbox')) {
          //   obj
          //     .enterEditing()
          //     .selectAll()
          //     .onCompositionEnd()
          // }
        },
        easing: fabric.util.ease['easeOutCubic']
      })
    }
  }

  // delete
  deleteActiveObject = (props = {}) => {
    let { objects, update = true } = props
    const { canvas, canvasHistory } = this
    if (!objects) objects = canvas.getActiveObjects()

    objects.forEach(o => o.set({ isRemoving: true }))
    canvas
      .discardActiveObject()
      .remove(...objects)
      .renderAll()
    update && canvasHistory.updateHistory()
  }

  // Remove
  deleteCanvasBg() {
    const { canvas } = this
    canvas
      .getObjects()
      .filter(obj => obj.isBackground === true)
      .forEach(el => canvas.remove(el))
    canvas.backgroundColor = ''
  }

  //add
  addSVG = (url, coords = {}) => {
    fabric.loadSVGFromURL(url, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options)
      svg.scaleToWidth(100).scaleToHeight(50).setCoords()

      const svgOwnCenter = {
        x: (svg.width * svg.scaleX) / 2,
        y: (svg.height * svg.scaleY) / 2
      }

      this.animateObjectIn({ obj: svg, ownCenter: svgOwnCenter, coords })
    })
  }

  addText = (font, coords = {}) => {
    let object
    const { family = 'Open Sans', fontSize, text } = font
    if (text) {
      const titleBox = new fabric.Textbox(text, {
        fontFamily: family,
        fontSize: +fontSize,
        lineHeight: 1,
        width: 250
        // auto size
      })
      object = titleBox

      titleBox.on('changed', () => {
        // titleBox.set('width', titleBox.dynamicMinWidth)
        // this.canvas.requestRenderAll()
      })
      // titleBox.on('editing:exited', () => {
      //   const { canvas } = this
      //   if (!titleBox.dynamicMinWidth) {
      //     canvas.remove(titleBox)
      //     canvas.requestRenderAll()
      //   }
      // })
    } else {
      const htxtBox = new fabric.Textbox(family, {
        fontFamily: family,
        fontSize: 60,
        lineHeight: 1,
        width: 700,
        height: 60,
        originX: 'left',
        originY: 'top',
        strokeWidth: 1
      })
      const ptxtBox = new fabric.Textbox(FABRIC_EXAMPLE_TEXT, {
        fontFamily: family,
        fontSize: 32,
        lineHeight: 1,
        width: 700,
        top: htxtBox.height,
        left: htxtBox.left,
        strokeWidth: 1
      })
      object = this.groupingObjects([htxtBox, ptxtBox])
    }

    const objectOwnCenter = {
      x: object.width / 2,
      y: object.height / 2
    }

    this.animateObjectIn({
      obj: object,
      ownCenter: objectOwnCenter,
      coords
    })
  }

  addTextCombination = (font, coords = {}) => {
    let object
    const { main, secondary, fontSize, text, secondaryText } = font
    if (text) {
      const titleBox = new fabric.Textbox(text, {
        fontFamily: main,
        fontSize: +fontSize,
        lineHeight: 1,
        width: 250
        // auto size
      })
      object = titleBox

      titleBox.on('changed', () => {})
    } else {
      const htxtBox = new fabric.Textbox(main + ' & ' + secondary, {
        fontFamily: main,
        fontSize: 60,
        lineHeight: 1,
        width: 700,
        height: 60,
        originX: 'left',
        originY: 'top',
        strokeWidth: 1
      })
      const ptxtBox = new fabric.Textbox(secondaryText, {
        fontFamily: secondary,
        fontSize: 32,
        lineHeight: 1,
        width: 700,
        top: htxtBox.height,
        left: htxtBox.left,
        strokeWidth: 1
      })
      object = this.groupingObjects([htxtBox, ptxtBox])
    }

    const objectOwnCenter = {
      x: object.width / 2,
      y: object.height / 2
    }

    this.animateObjectIn({
      obj: object,
      ownCenter: objectOwnCenter,
      coords
    })
  }

  addImage = (image, coords) => {
    this.setLoading(true)
    fabric.Image.fromURL(
      image.url,
      loadedImg => {
        if (loadedImg.width > 480) {
          loadedImg.scaleToWidth(480).setCoords()
        }
        const imgOwnCenter = {
          x: loadedImg.getScaledWidth() / 2,
          y: loadedImg.getScaledHeight() / 2
        }
        this.animateObjectIn({
          obj: loadedImg,
          ownCenter: imgOwnCenter,
          coords
        })
        this.setLoading(false)
      },
      { crossOrigin: 'Anonymous' }
    )
  }
}

export default CanvasHandlers
