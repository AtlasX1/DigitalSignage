import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

import FormControlInput from 'components/Form/FormControlInput'
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

const CopyItemModal = ({
  t,
  data: { open, id, title: initialTitle },
  modalTitle = '',
  inputPlaceholder = '',
  classes,
  onClickSave = f => f,
  onCloseModal = f => f
}) => {
  const [title, setTitle] = useState(initialTitle)

  useEffect(() => setTitle(initialTitle), [initialTitle])

  const handleChange = useCallback(({ target: { value } }) => {
    setTitle(value)
  }, [])

  const handleSave = useCallback(() => {
    onClickSave({
      title,
      id,
      open
    })
    onCloseModal()
  }, [onClickSave, onCloseModal, open, id, title])

  const handleReset = useCallback(() => {
    setTitle(initialTitle)
  }, [setTitle, initialTitle])

  return useMemo(
    () => (
      <Dialog classes={{ paper: classes.container }} open={open} fullWidth>
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
        <DialogContent className={classes.content}>
          <FormControlInput
            label={t(inputPlaceholder)}
            placeholder={t(inputPlaceholder)}
            value={title}
            handleChange={handleChange}
          />
        </DialogContent>

        <DialogActions className={classes.actionBar}>
          <WhiteButton onClick={handleReset}>{t('Reset')}</WhiteButton>
          <BlueButton onClick={handleSave}>{t('Save')}</BlueButton>
        </DialogActions>
      </Dialog>
    ),
    [
      classes.actionBar,
      classes.close,
      classes.container,
      classes.content,
      classes.header,
      classes.title,
      handleChange,
      handleReset,
      handleSave,
      inputPlaceholder,
      modalTitle,
      onCloseModal,
      open,
      t,
      title
    ]
  )
}

CopyItemModal.propType = {
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

export default translate('translations')(withStyles(styles)(CopyItemModal))
