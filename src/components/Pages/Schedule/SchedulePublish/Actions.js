import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { BlueButton, WhiteButton } from '../../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 15px',
      backgroundColor: palette[type].sideModal.action.background
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
      background: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color
    }
  }
}

const Actions = props => {
  const {
    t,
    classes,
    onSave = () => {},
    onSaveAndCreate = () => {},
    onCancel = () => {},
    edit = false
  } = props

  return (
    <Grid container wrap="nowrap" className={classes.root}>
      <Grid item xs className={classes.actionWrap}>
        <BlueButton
          fullWidth={true}
          className={classes.action}
          onClick={onSave}
        >
          {t('Save & Publish')}
        </BlueButton>
      </Grid>
      <Grid item xs className={classes.actionWrap}>
        <WhiteButton
          fullWidth={true}
          className={[classes.action, classes.actionDefault].join(' ')}
          onClick={onSaveAndCreate}
        >
          {t(edit ? 'Save' : 'Save & Create another')}
        </WhiteButton>
      </Grid>
      <Grid item xs>
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
}

Actions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(Actions))
