import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { BlueButton, WhiteButton } from '../../../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 15px',
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: `1px solid ${palette[type].sideModal.action.border}`
    },
    actionWrap: {
      paddingRight: '12px'
    },
    action: {
      width: '160px',
      paddingTop: '9px',
      paddingBottom: '9px'
    },
    actionDefault: {
      width: '140px',
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color
    }
  }
}

const Actions = ({ t, classes, submitForm, buttonLabel, onCancel }) => (
  <Grid container wrap="nowrap" justify="flex-end" className={classes.root}>
    <Grid item className={classes.actionWrap}>
      <BlueButton
        fullWidth={true}
        className={classes.action}
        onClick={submitForm}
      >
        {buttonLabel}
      </BlueButton>
    </Grid>
    <Grid item>
      <WhiteButton
        fullWidth={true}
        className={[classes.action, classes.actionDefault].join(' ')}
        onClick={onCancel}
      >
        {t('Cancel')}
      </WhiteButton>
    </Grid>
  </Grid>
)

export default translate('translations')(withStyles(styles)(Actions))
