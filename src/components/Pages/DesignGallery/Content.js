import React, { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useSelector } from 'react-redux'

import './styles/_content.scss'
import Canvas from './components/canvas'
import { useCanvasState } from './components/canvas/CanvasProvider'
import { SIDEBAR_SMALL_WIDTH, SIDEBAR_WIDTH } from './constans'

const useStyles = makeStyles({
  root: {
    left: props =>
      props.isOpenLeftSidebar
        ? SIDEBAR_WIDTH + SIDEBAR_SMALL_WIDTH
        : SIDEBAR_SMALL_WIDTH,
    width: props =>
      props.isOpenLeftSidebar || props.isOpenRightSidebar
        ? `calc(100% - ${SIDEBAR_WIDTH}px - ${SIDEBAR_SMALL_WIDTH}px)`
        : `calc(100% - ${SIDEBAR_SMALL_WIDTH}px)`
  }
})

const Content = () => {
  const [canvasState] = useCanvasState()
  const { canvasHandlers } = canvasState
  const [isIncreased, setIsIncreased] = useState(false)
  const [isOpenLeftSidebar, isOpenRightSidebar] = useSelector(state => [
    state.editor.designGallery.isOpenLeftSidebar,
    state.editor.designGallery.isOpenRightSidebar
  ])
  const duration = isOpenLeftSidebar ? 400 : 200
  const classes = useStyles({ isOpenLeftSidebar, isOpenRightSidebar, duration })

  useEffect(() => {
    if (!(isOpenRightSidebar || isOpenLeftSidebar)) {
      setIsIncreased(true)
    } else {
      setIsIncreased(false)
    }
    // eslint-disable-next-line
  }, [isOpenLeftSidebar, isOpenRightSidebar])

  useEffect(() => {
    if (canvasHandlers) {
      const { width, height } = canvasHandlers.getContentViewport()

      if (isIncreased) {
        canvasHandlers.setCanvasSize(width + SIDEBAR_WIDTH, height)
      } else {
        canvasHandlers.setCanvasSize(width - SIDEBAR_WIDTH, height)
      }

      canvasHandlers.setCenterAll()
    }
    // eslint-disable-next-line
  }, [isIncreased])

  return useMemo(() => {
    return (
      <div className={`${classes.root} content`} tabIndex={100}>
        <Canvas />
      </div>
    )
    // eslint-disable-next-line
  }, [isOpenLeftSidebar, isOpenRightSidebar])
}

export default Content
