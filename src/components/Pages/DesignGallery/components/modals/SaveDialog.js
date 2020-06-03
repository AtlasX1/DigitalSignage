import React from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'

import {
  Dialog,
  DialogActions,
  Grid,
  IconButton,
  withStyles
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { Card } from 'components/Card'
import { BlueButton, WhiteButton } from 'components/Buttons'
import MediaInfo from 'components/Media/MediaInfo'

const styles = theme => {
  const { palette, type } = theme
  return {
    dialogRoot: {
      maxWidth: 550
    },
    cardRoot: {
      height: '100%',
      paddingBottom: '0',
      overflowY: 'auto'
    },
    header: {
      borderTop: '0',
      padding: '10px 0',
      borderBottom: '0',
      marginBottom: '0'
    },
    headerTitle: {
      fontSize: 14
    },
    cardCloseButton: {
      position: 'relative',
      right: '20px'
    },
    actionsRoot: {
      padding: '22px 44px',
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: palette[type].sideModal.action.border
    },
    actionWrap: {
      paddingRight: '12px'
    },
    action: {
      paddingTop: '9px',
      paddingBottom: '9px'
    },
    actionCancel: {
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color,

      '&:hover': {
        color: '#fff',
        background: '#006198',
        borderColor: '#006198'
      }
    }
  }
}

const SaveDialog = props => {
  const {
    t,
    classes,
    isShow,
    form,
    disabled,
    mode,
    onSave = () => {}, //save and clear all
    onSaveAndClose = () => {}, //save and open library
    onClose = () => {} // close dialog
  } = props

  const { values, errors, touched } = form

  return (
    <Dialog
      open={isShow}
      maxWidth={'md'}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        classes: { root: classes.dialogRoot }
      }}
    >
      <Card
        title={'Save Design'}
        grayHeader
        icon={false}
        shadow={false}
        rootClassName={classes.cardRoot}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerTitle]}
        titleComponent={
          <IconButton className={classes.cardCloseButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      >
        <MediaInfo
          title={null}
          values={values.mediaInfo}
          errors={errors.mediaInfo}
          touched={touched.mediaInfo}
          onControlChange={form.setFieldValue}
          onFormHandleChange={form.handleChange}
          dayPickerProps={{
            left: {
              orientation: 'vertical',
              anchorDirection: 'left'
            },
            right: {
              orientation: 'vertical',
              anchorDirection: 'right'
            }
          }}
        />
      </Card>
      <DialogActions>
        <Grid container wrap="nowrap" className={classes.actionsRoot}>
          <Grid item xs className={classes.actionWrap}>
            <BlueButton
              disabled={disabled}
              fullWidth={true}
              className={classes.action}
              onClick={onSave}
            >
              {mode === 'add' ? t('Add Design') : 'Save Design'}
            </BlueButton>
          </Grid>
          <Grid item xs className={classes.actionWrap}>
            <BlueButton
              disabled={disabled}
              fullWidth={true}
              className={classes.action}
              onClick={onSaveAndClose}
            >
              {mode === 'add' ? t('Add and Close') : t('Save and Close')}
            </BlueButton>
          </Grid>
          <Grid item xs>
            <WhiteButton
              fullWidth={true}
              className={[
                'hvr-radial-out',
                classes.action,
                classes.actionCancel
              ].join(' ')}
              onClick={onClose}
            >
              {t('Cancel')}
            </WhiteButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(SaveDialog)
