import React, { useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useSelector } from 'react-redux'

import './styles/_content.scss'
import Canvas from './components/canvas'
import { useCanvasState } from './components/canvas/CanvasProvider'
import { SIDEBAR_WIDTH } from './constans'

const useStyles = makeStyles({
  root: {
    left: props => (props.isOpenLeftSidebar ? SIDEBAR_WIDTH : '0'),
    width: props =>
      props.isOpenLeftSidebar
        ? `calc(100% - ${SIDEBAR_WIDTH * 2}px)`
        : `calc(100% - ${SIDEBAR_WIDTH}px)`
  }
})

const Content = () => {
  const [canvasState] = useCanvasState()
  const [isOpenLeftSidebar] = useSelector(state => [
    state.editor.designGallery.isOpenLeftSidebar
  ])
  const duration = isOpenLeftSidebar ? 400 : 200
  const classes = useStyles({ isOpenLeftSidebar, duration })

  useEffect(() => {
    const { canvasHandlers } = canvasState
    if (canvasHandlers) {
      const { width, height } = canvasHandlers.getContentViewport()
      const sidebarWidth = isOpenLeftSidebar ? SIDEBAR_WIDTH : -SIDEBAR_WIDTH
      canvasHandlers.setCanvasSize(width - sidebarWidth, height)
      canvasHandlers.setCenterAll()
    }
    // eslint-disable-next-line
  }, [isOpenLeftSidebar])

  return useMemo(() => {
    return (
      <div className={`${classes.root} content`} tabIndex={100}>
        <Canvas />
      </div>
    )
    // eslint-disable-next-line
  }, [isOpenLeftSidebar])
}

export default Content
