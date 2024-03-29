import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'
import { BlueButton, WhiteButton } from 'components/Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 20px',
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: `1px solid ${palette[type].sideModal.action.border}`
    },
    actionWrap: {
      paddingRight: '12px'
    },
    action: {
      paddingTop: '9px',
      paddingBottom: '9px'
    },
    actionDefault: {
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color
    }
  }
}

const FooterActions = props => {
  const {
    t,
    classes,
    onSave = f => f,
    onSaveAndClose = f => f,
    onCancel = f => f
  } = props

  return (
    <Grid container wrap="nowrap" className={classes.root}>
      <Grid item xs className={classes.actionWrap}>
        <BlueButton
          fullWidth={true}
          className={classes.action}
          onClick={onSaveAndClose}
        >
          {t('Save & Publish')}
        </BlueButton>
      </Grid>
      <Grid item xs className={classes.actionWrap}>
        <WhiteButton
          fullWidth={true}
          className={[classes.action, classes.actionDefault].join(' ')}
          onClick={onSave}
        >
          {t('Save & Create another')}
        </WhiteButton>
      </Grid>
      <Grid item xs>
        <WhiteButton
          fullWidth={true}
          className={[classes.action, classes.actionDefault].join(' ')}
          onClick={onCancel}
        >
          {t('Reset')}
        </WhiteButton>
      </Grid>
    </Grid>
  )
}

FooterActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onSaveAndClose: PropTypes.func,
  onCancel: PropTypes.func
}

export default translate('translations')(withStyles(styles)(FooterActions))
