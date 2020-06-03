import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import Typography from '@material-ui/core/Typography'
import { unstable_Box as Box } from '@material-ui/core/Box'

import { TABS_NAMES } from '../../constans'
import { useCanvasState } from '../canvas/CanvasProvider'

const TypesTextItem = ({ item, classes }) => {
  const [{ canvasHandlers }] = useCanvasState()
  const { type, text, fontSize } = item
  const [{ opacity }, dragRef] = useDrag({
    item: { ...item, showAs: 'font', type: TABS_NAMES.fonts },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  })

  return useMemo(() => {
    return (
      <div
        ref={dragRef}
        style={{ opacity }}
        className={classes.title}
        onClick={() => canvasHandlers.addText(item)}
      >
        <Typography component={type}>
          <Box component="span" fontSize={fontSize}>
            {text}
          </Box>
        </Typography>
      </div>
    )
    // eslint-disable-next-line
  }, [canvasHandlers])
}

TypesTextItem.propTypes = {
  item: PropTypes.object,
  classes: PropTypes.object
}

export default TypesTextItem
