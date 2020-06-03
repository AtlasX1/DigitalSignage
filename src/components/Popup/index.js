import React from 'react'
import PropTypes from 'prop-types'
import PopUp from 'reactjs-popup'
import update from 'immutability-helper'

import { withTheme } from '@material-ui/core'

const Popup = ({
  theme,
  trigger,
  on = 'hover',
  position = 'bottom center',
  children,
  arrow = true,
  contentStyle: cStyle = {},
  arrowStyle: aStyle = {},
  overlayStyle: oStyle = {},
  defaultOpen = false,
  open = null,
  onOpen = f => f,
  onClose = f => f,
  disabled = false,
  offsetX,
  offsetY
}) => {
  const { palette, type } = theme

  const contentStyle = {
    width: 'fit-content',
    border: 'none',
    backgroundColor: palette[type].dropdown.background,
    boxShadow: `0 2px 4px 0 ${palette[type].dropdown.shadow}`,
    borderRadius: 5,
    padding: 0
  }

  const arrowStyle = {
    border: 'none',
    boxShadow: 'rgba(0, 0, 0, 0.05) 1px 1px 1px',
    background: palette[type].dropdown.background
  }

  return (
    <PopUp
      on={on}
      position={position}
      trigger={trigger}
      arrow={arrow}
      open={open}
      onOpen={onOpen}
      offsetX={offsetX}
      offsetY={offsetY}
      onClose={onClose}
      defaultOpen={defaultOpen}
      contentStyle={update(contentStyle, { $merge: cStyle })}
      arrowStyle={update(arrowStyle, { $merge: aStyle })}
      overlayStyle={oStyle}
      disabled={disabled}
    >
      {children}
    </PopUp>
  )
}

Popup.propTypes = {
  on: PropTypes.oneOf(['click', 'hover', 'focus']),
  position: PropTypes.oneOf([
    'bottom center',
    'bottom left',
    'bottom right',
    'top center',
    'top left',
    'top right',
    'left center',
    'left top',
    'left bottom',
    'right center',
    'right top',
    'right bottom'
  ]),
  trigger: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  arrow: PropTypes.bool,
  contentStyle: PropTypes.object,
  arrowStyle: PropTypes.object,
  overlayStyle: PropTypes.object,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  disabled: PropTypes.bool
}

export default withTheme()(Popup)
