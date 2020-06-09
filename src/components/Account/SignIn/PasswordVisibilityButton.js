import React, { memo } from 'react'
import { IconButton, withStyles } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

function styles() {
  return {
    passwordVisibility: {
      position: 'absolute',
      top: '3px',
      right: '130px'
    }
  }
}

function createAttrs(className, onClick) {
  return {
    className,
    onClick
  }
}

function PasswordVisibilityButton({ onClick, classes, isVisible }) {
  const attrs = createAttrs(classes.passwordVisibility, onClick)

  if (isVisible) {
    return (
      <IconButton {...attrs}>
        <VisibilityOff fontSize="small" />
      </IconButton>
    )
  }

  return (
    <IconButton {...attrs}>
      <Visibility fontSize="small" />
    </IconButton>
  )
}

export default memo(withStyles(styles)(PasswordVisibilityButton))
