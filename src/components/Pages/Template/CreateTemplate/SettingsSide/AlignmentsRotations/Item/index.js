import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Typography, withStyles } from '@material-ui/core'

const itemStyles = theme => {
  const { palette, type } = theme
  return {
    itemWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      minWidth: '25%',
      padding: '15px 0',
      '&.$highlight': {
        opacity: 0.75
      }
    },
    itemLabel: {
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      fontSize: '10px',
      maxWidth: '45px',
      textAlign: 'center',
      marginTop: '5px',
      opacity: '0.39'
    },
    disabledItem: {
      opacity: 0.4,
      cursor: 'initial'
    },
    highlight: {
      '&:hover': {
        opacity: 1,
        '& > $itemLabel': {
          opacity: 1,
          fontWeight: 'bold'
        }
      }
    }
  }
}

const Item = withStyles(itemStyles)(
  ({
    label,
    children,
    classes,
    wrapperClass = '',
    handleClick,
    disabled = false,
    highlight = true
  }) => (
    <div
      className={classNames(classes.itemWrapper, wrapperClass, {
        [classes.disabledItem]: disabled,
        [classes.highlight]: !disabled && highlight
      })}
      onClick={handleClick}
    >
      {children}
      <Typography className={classes.itemLabel}>{label}</Typography>
    </div>
  )
)

Item.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object,
  wrapperClass: PropTypes.string,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool
}

export default Item
