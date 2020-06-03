import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { get as _get } from 'lodash'

import { withStyles, Grid, Tooltip } from '@material-ui/core'
import { useCanvasState } from './canvas/CanvasProvider'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderTop: '1px solid rgba(151, 151, 151, 0.08)',
      height: 50,
      background: palette[type].pages.createTemplate.template.footer.background
    },
    itemContainer: {
      cursor: 'pointer',
      marginRight: '13px',
      '&:nth-child(even)': {
        marginRight: '40px'
      },
      '&:last-child': {
        marginRight: '0'
      }
    },
    item: {
      color: '#8897ac',
      '&:hover': {
        color: '#000'
      }
    },
    icon: {
      fontSize: '1.3em',

      '&:hover': {
        cursor: 'pointer',
        color: palette[type].pages.createTemplate.types.item.hover.color
      }
    },
    itemDisabled: {
      opacity: 0.5,

      '&:hover': {
        color: '#8897ac'
      }
    }
  }
}

const items = [
  { value: 'duplicate', iconClass: 'icon-file-copy', title: 'Duplicate' },
  { value: 'remove', iconClass: 'icon-bin', title: 'Remove' },
  { value: 'undo', iconClass: 'icon-text-undo', title: 'Undo' },
  { value: 'redo', iconClass: 'icon-text-redo', title: 'Redo' },
  { value: 'zoomIn', iconClass: 'icon-zoom-in', title: 'Zoom In' },
  { value: 'zoomOut', iconClass: 'icon-zoom-out', title: 'Zoom Out' },
  {
    value: 'moveForward',
    iconClass: 'icon-send-to-front',
    title: 'Move Forward'
  },
  { value: 'moveBack', iconClass: 'icon-send-to-back', title: 'Move Back' },
  { value: 'lock', iconClass: 'icon-lock-1', title: 'Lock' },
  { value: 'unlock', iconClass: 'icon-lock-2', title: 'Unlock' }
]

const FooterControls = ({ t, classes, rootClass = '' }) => {
  const [
    { canvas, canvasHandlers, canvasHistory, canvasZoom, activeObject }
  ] = useCanvasState()

  const checkActionDisabled = action => {
    switch (action) {
      case 'undo':
        return canvasHistory.index === 0
      case 'redo':
        return canvasHistory.index === canvasHistory.state.length - 1
      case 'zoomIn':
        return canvasZoom >= 10
      case 'zoomOut':
        return canvasZoom <= 0.5
      case 'lock':
        return !activeObject ? true : _get(activeObject, 'locked')
      case 'unlock':
        return !activeObject ? true : !_get(activeObject, 'locked')
      case 'moveForward':
        return !activeObject || _get(activeObject, 'isGuideLine')
          ? true
          : activeObject.getZIndex() === canvas._objects.length - 1
      case 'moveBack':
        return !activeObject || _get(activeObject, 'isGuideLine')
          ? true
          : activeObject.getZIndex() <= 1
      case 'remove':
      case 'duplicate':
        return !activeObject
      default:
        return false
    }
  }

  const handleControlClick = field => {
    const {
      undoChange,
      redoChange,
      setZoomIn,
      setZoomOut,
      copyActiveObject,
      deleteActiveObject,
      sendActiveObjectToForward,
      sendActiveObjectToBackwards,
      setLockObject,
      setUnlockObject
    } = canvasHandlers

    if (checkActionDisabled(field)) return false

    switch (field) {
      case 'undo':
        undoChange()
        break
      case 'redo':
        redoChange()
        break
      case 'duplicate':
        copyActiveObject(true)
        break
      case 'remove':
        deleteActiveObject()
        break
      case 'moveForward':
        sendActiveObjectToForward()
        break
      case 'moveBack':
        sendActiveObjectToBackwards()
        break
      case 'zoomIn':
        setZoomIn()
        break
      case 'zoomOut':
        setZoomOut()
        break
      case 'lock':
        setLockObject()
        break
      case 'unlock':
        setUnlockObject()
        break
      default:
        break
    }
  }

  return useMemo(() => {
    return (
      <Grid className={classNames(classes.container, rootClass)}>
        {items.map(item => (
          <div
            key={`button-template-action-${item.value}`}
            className={classes.itemContainer}
            onClick={() => handleControlClick(item.value)}
          >
            <Tooltip title={t(item.title)}>
              <div
                className={classNames(
                  classes.item,
                  classes.upper,
                  checkActionDisabled(item.value) && classes.itemDisabled
                )}
              >
                <i className={classNames(item.iconClass, classes.icon)} />
              </div>
            </Tooltip>
          </div>
        ))}
      </Grid>
    )
    // eslint-disable-next-line
  }, [canvasZoom, activeObject, canvasHistory.index])
}

FooterControls.propTypes = {
  classes: PropTypes.object.isRequired,
  rootClass: PropTypes.string,
  currentItemId: PropTypes.number,
  container: PropTypes.object,
  currentItem: PropTypes.object,
  multipleSelected: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(FooterControls))
