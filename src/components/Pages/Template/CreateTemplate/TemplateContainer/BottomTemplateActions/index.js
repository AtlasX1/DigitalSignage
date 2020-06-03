import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Tooltip } from '@material-ui/core'

import {
  copyTemplateItem,
  deleteTemplateItem,
  moveTemplateItemForward,
  moveTemplateItemBack,
  zoomInTemplateContainer,
  zoomOutTemplateContainer,
  lockTemplateItem,
  unlockTemplateItem
} from '../../../../../../actions/createTemplateActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: `solid 1px ${palette[type].pages.createTemplate.border}`,
      background: palette[type].pages.createTemplate.template.footer.background
    },
    itemContainer: {
      cursor: 'pointer',
      marginRight: '13px',
      height: '25px',
      '&:nth-child(even)': {
        marginRight: '40px'
      },
      '&:last-child': {
        marginRight: '0'
      }
    },
    item: {
      color: '#8897ac',
      transform: 'translateY(-2px)',

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
  { value: 'copy', iconClass: 'icon-file-copy', title: 'Copy' },
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

const BottomTemplateActions = ({
  t,
  classes,
  rootClass = '',
  currentItem,
  currentItemId,
  container,
  multipleSelected,
  ...props
}) => {
  const handleClick = field => {
    switch (field) {
      case 'copy':
        props.copyTemplateItem(currentItemId)
        break
      case 'remove':
        props.deleteTemplateItem(currentItemId)
        break
      case 'moveForward':
        props.moveTemplateItemForward(currentItemId)
        break
      case 'moveBack':
        props.moveTemplateItemBack(currentItemId)
        break
      case 'zoomIn':
        props.zoomInTemplateContainer()
        break
      case 'zoomOut':
        props.zoomOutTemplateContainer()
        break
      case 'lock':
        props.lockTemplateItem(currentItemId)
        break
      case 'unlock':
        props.unlockTemplateItem(currentItemId)
        break
      default:
        break
    }
  }

  const disabled = action => {
    if (['zoomIn', 'zoomOut'].includes(action)) {
      if (!container.videoWall.active) {
        return true
      } else if (action === 'zoomIn' && container.videoWall.zoomed) {
        return true
      } else if (action === 'zoomOut' && !container.videoWall.zoomed) {
        return true
      }
    } else if (['undo', 'redo'].includes(action)) {
      return true
    } else {
      if (currentItemId === -1) {
        return true
      }

      if (multipleSelected && action !== 'remove') {
        return true
      }

      if (currentItem.locked && action !== 'unlock') {
        return true
      }

      if (action === 'lock' && currentItem.locked) {
        return true
      } else if (action === 'unlock' && !currentItem.locked) {
        return true
      }
    }

    return false
  }

  return (
    <Grid className={[classes.container, rootClass].join(' ')}>
      {items.map(item => (
        <div
          key={`button-template-action-${item.value}`}
          className={classes.itemContainer}
          onClick={() =>
            disabled(item.value) ? false : handleClick(item.value)
          }
        >
          <Tooltip title={t(item.title)}>
            <div
              className={[
                classes.item,
                classes.upper,
                disabled(item.value) ? classes.itemDisabled : ''
              ].join(' ')}
            >
              <i className={[item.iconClass, classes.icon].join(' ')} />
            </div>
          </Tooltip>
        </div>
      ))}
    </Grid>
  )
}

BottomTemplateActions.propTypes = {
  classes: PropTypes.object.isRequired,
  rootClass: PropTypes.string,
  currentItemId: PropTypes.number,
  container: PropTypes.object,
  currentItem: PropTypes.object,
  multipleSelected: PropTypes.bool
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      copyTemplateItem,
      deleteTemplateItem,
      moveTemplateItemForward,
      moveTemplateItemBack,
      zoomInTemplateContainer,
      zoomOutTemplateContainer,
      lockTemplateItem,
      unlockTemplateItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(BottomTemplateActions))
)
