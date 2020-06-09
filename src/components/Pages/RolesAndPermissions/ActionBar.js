import { Grid, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React from 'react'
import { translate } from 'react-i18next'
import { BlueButton, WhiteButton } from '../../Buttons/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 20px',
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: palette[type].sideModal.action.border,
      marginTop: 'auto'
    },
    action: {
      paddingTop: '9px',
      paddingBottom: '9px',
      minwidth: '125px',
      marginRight: '12px'
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

const ActionBar = ({
  t,
  classes,
  actionName = '',
  onAction = f => f,
  onCancel = f => f
}) => {
  return (
    <Grid container wrap="nowrap" className={classes.root}>
      <BlueButton
        className={classes.action}
        onClick={onAction}
        fullWidth={false}
      >
        {actionName}
      </BlueButton>

      <WhiteButton
        onClick={onCancel}
        fullWidth={false}
        className={[
          'hvr-radial-out',
          classes.action,
          classes.actionCancel
        ].join(' ')}
      >
        {t('Cancel')}
      </WhiteButton>
    </Grid>
  )
}

ActionBar.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(ActionBar))
