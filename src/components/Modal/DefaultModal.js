import React, { useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  DialogContent,
  withStyles
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BlueButton, WhiteButton } from 'components/Buttons'

const styles = ({ palette, type }) => ({
  container: {
    background: palette[type].body.background,
    boxShadow: `0px 11px 15px -7px ${palette[type].dialog.shadow}20,
                  0px 24px 38px 3px ${palette[type].dialog.shadow}14,
                  0px 9px 46px 8px ${palette[type].dialog.shadow}12`
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: palette[type].dialog.header.background,
    borderBottom: `solid 1px ${palette[type].dialog.border}`,
    padding: '15px 20px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: palette[type].dialog.title
  },
  close: {
    width: '46px',
    height: '46px',
    margin: '0px',
    padding: '0px',
    color: palette[type].dialog.closeButton
  },
  content: {
    background: palette[type].dialog.background,
    padding: '10px 20px 5px',
    minHeight: '77px'
  },
  actionBar: {
    display: 'flex',
    alignItems: 'flex-end',
    background: palette[type].dialog.header.background,
    borderTop: `solid 1px ${palette[type].dialog.border}`,
    padding: '24px 16px',
    margin: '0px'
  }
})

const DefaultModal = ({
  t,
  modalTitle = '',
  classes,
  onClickSave = f => f,
  onCloseModal = f => f,
  children,
  contentClass,
  open = false,
  maxWidth,
  actions
}) => {
  const handleSave = useCallback(() => {
    onClickSave()
    onCloseModal()
  }, [onClickSave, onCloseModal])

  return useMemo(
    () => (
      <Dialog
        classes={{ paper: classes.container }}
        open={open}
        maxWidth={maxWidth}
        fullWidth
      >
        <DialogTitle className={classes.header} disableTypography>
          <Grid item container direction="column">
            <Typography className={classes.title} component="h2">
              {t(modalTitle)}
            </Typography>
          </Grid>

          <IconButton className={classes.close} onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classNames(contentClass, classes.content)}>
          {children}
        </DialogContent>

        {actions ? (
          <DialogActions className={classes.actionBar}>{actions}</DialogActions>
        ) : (
          <DialogActions className={classes.actionBar}>
            <WhiteButton onClick={onCloseModal}>{t('Cancel')}</WhiteButton>
            <BlueButton onClick={handleSave}>{t('Save')}</BlueButton>
          </DialogActions>
        )}
      </Dialog>
    ),
    [
      classes.container,
      classes.header,
      classes.title,
      classes.close,
      classes.content,
      classes.actionBar,
      open,
      maxWidth,
      t,
      modalTitle,
      onCloseModal,
      contentClass,
      children,
      actions,
      handleSave
    ]
  )
}

DefaultModal.propType = {
  data: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string
  }),
  modalTitle: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  onClickSave: PropTypes.func,
  onCloseModal: PropTypes.func
}

export default translate('translations')(withStyles(styles)(DefaultModal))
