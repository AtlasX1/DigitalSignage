import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { withSnackbar } from 'notistack'
import {
  withStyles,
  Dialog,
  Grid,
  Typography,
  IconButton
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { ModalPaper } from 'components/Paper'
import { BlueButton } from 'components/Buttons'

import { useCustomSnackbar, useActions } from 'hooks/index'
import { reducerUtils } from 'utils/index'
import { getDeviceItemsAction } from 'actions/deviceActions'

const styles = ({ palette, type }) => ({
  dialogPaper: {
    overflow: 'visible',
    background: 'transparent'
  },
  paper: {
    width: 400,
    padding: '25px 30px',
    position: 'relative'
  },
  title: {
    fontSize: 18,
    color: palette[type].pages.devices.rebootModal.title.color,
    marginBottom: 15
  },
  closeButton: {
    position: 'absolute',
    right: 30,
    top: 15
  },
  closeIcon: {
    color: palette[type].sideModal.header.titleColor
  },
  subtitle: {
    fontSize: 15,
    color: palette[type].pages.devices.rebootModal.title.color,
    marginBottom: 15
  }
})

const RemoveAlertsConfirm = ({
  t,
  classes,
  open = false,
  handleClose = f => f,
  enqueueSnackbar,
  closeSnackbar,
  title,
  handleClick,
  clearAction,
  reducer
}) => {
  const [getDeviceItems] = useActions([getDeviceItemsAction])
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const reducerSuccessHandler = useCallback(() => {
    clearAction()
    handleClose()
    getDeviceItems()
    showSnackbar('Successfully removed')
  }, [clearAction, handleClose, showSnackbar, getDeviceItems])

  useEffect(() => {
    reducerUtils.parse(reducer, reducerSuccessHandler)
  }, [reducer, reducerSuccessHandler])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      <ModalPaper className={classes.paper}>
        <Typography className={classes.title}>{t('Remove alert')}</Typography>

        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon className={classes.closeIcon} />
        </IconButton>

        <Grid container direction="column">
          <Typography className={classes.subtitle}>{title}</Typography>

          <Grid container justify="flex-end">
            <BlueButton onClick={handleClick}>{t('OK')}</BlueButton>
          </Grid>
        </Grid>
      </ModalPaper>
    </Dialog>
  )
}

RemoveAlertsConfirm.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleClick: PropTypes.func,
  clearAction: PropTypes.func,
  reducer: PropTypes.object,
  title: PropTypes.string
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar
)(RemoveAlertsConfirm)
