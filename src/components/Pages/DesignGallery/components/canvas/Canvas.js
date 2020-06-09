import React, { useEffect, useMemo } from 'react'
import { useDrop } from 'react-dnd'
import { makeStyles } from '@material-ui/styles'
import { CircularProgress, Tooltip } from '@material-ui/core'
import { Fullscreen as FullscreenIcon } from '@material-ui/icons'

import { TABS_NAMES } from '../../constans'
import { useCanvasState } from './CanvasProvider'

import CanvasInstance from './CanvasInstance'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    '& canvas': {
      position: 'relative',
      zIndex: 3,
      filter: props => (props.isLoading ? 'blur(3px)' : 'none'),
      transition: 'all .25s ease',
      transitionDuration: 'inherit'
    }
  },
  canvasLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  resetZoom: {
    position: 'absolute',
    top: 45,
    right: 30,
    cursor: 'pointer',
    fontSize: '1.3em',
    color: '#8897ac',
    zIndex: 5,
    opacity: props => (props.canvasZoom !== 1 ? 1 : 0),
    visibility: props => (props.canvasZoom !== 1 ? 'visible' : 'hidden'),
    transition: 'visibility .25s ease, opacity .25s ease',
    '&:hover': {
      color: '#1c5dca'
    }
  }
})

const acceptDropTypes = Object.keys(TABS_NAMES).map(key => TABS_NAMES[key])

const Canvas = () => {
  const dispatchAction = useDispatch()

  const [canvasState, setCanvasState] = useCanvasState()
  const { canvas, canvasZoom, canvasRuler, isLoading } = canvasState

  const [, drop] = useDrop({
    accept: acceptDropTypes,
    canDrop: (item, monitor) => {
      if (item.showAs === 'template') {
        item.isConfirmAction = true
        return false
      }
      return true
    },
    drop(item, monitor) {
      const {
        setBackground,
        addSVG,
        addText,
        addImage,
        applyCanvasConfig
      } = canvasState.canvasHandlers

      const { id, src, type, showAs } = item
      const { x, y } = monitor.getClientOffset()
      const pointerPosition = canvas.getPointer({ clientX: x, clientY: y })
      const url = src && (src.original || src.small)

      if (showAs === 'bg') setBackground({ id, url, type })
      if (showAs === 'svg') addSVG(url, pointerPosition)
      if (showAs === 'font') addText(item, pointerPosition)
      if (showAs === 'image') {
        addImage({ id, url: src.original }, pointerPosition)
      }
      if (showAs === 'template') {
        applyCanvasConfig(item.canvas)
      }
    }
  })
  const classes = useStyles({
    isLoading,
    canvasZoom
  })

  const handleResetZoom = () => {
    canvas && canvasState.canvasHandlers.resetZoom()
  }

  useEffect(() => {
    const newCanvasState = new CanvasInstance(setCanvasState, dispatchAction)
    setCanvasState(newCanvasState)
    // eslint-disable-next-line
  }, [])

  return useMemo(() => {
    return (
      <div className={classes.canvasWrapper} ref={drop}>
        <div>
          <canvas id="main-canvas" />
          <div className={classes.resetZoom}>
            <Tooltip title={'Fit to content'}>
              {<FullscreenIcon onClick={handleResetZoom} />}
            </Tooltip>
          </div>
        </div>
        {isLoading && (
          <div className={classes.canvasLoader}>
            <CircularProgress />
          </div>
        )}
      </div>
    )
    // eslint-disable-next-line
  }, [canvas, canvasZoom, isLoading, canvasRuler])
}

export default Canvas
