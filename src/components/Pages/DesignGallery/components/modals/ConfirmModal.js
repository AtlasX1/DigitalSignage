import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'

import { BlueButton, WhiteButton } from '../../../../Buttons'

const ConfirmModal = ({
  title,
  contentText,
  isShow,
  onApply,
  onCancel,
  onClose
}) => {
  return (
    <Dialog
      open={isShow}
      maxWidth={'xs'}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WhiteButton onClick={onCancel}>Cancel</WhiteButton>
        <BlueButton onClick={onApply}>Apply</BlueButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModal
