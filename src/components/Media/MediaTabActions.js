import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'

import { BlueButton, WhiteButton } from '../Buttons/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 20px',
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
    actionReset: {
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color,

      '&:hover': {
        color: '#fff'
        // background: '#006198',
        // borderColor: '#006198'
      }
    }
  }
}

class MediaTabActions extends Component {
  static propTypes = {
    mode: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onAdd: PropTypes.func,
    onAddAndClose: PropTypes.func,
    disabled: PropTypes.bool
  }

  render() {
    const {
      t,
      classes,
      mode,
      onAdd,
      onReset,
      onAddAndClose,
      disabled
    } = this.props

    return (
      <Grid container wrap="nowrap" className={classes.root}>
        <Grid item xs className={classes.actionWrap}>
          <BlueButton
            disabled={disabled}
            fullWidth={true}
            className={classes.action}
            onClick={() => onAdd()}
          >
            {mode === 'add' ? t('Add Media') : 'Save Media'}
          </BlueButton>
        </Grid>
        <Grid item xs className={classes.actionWrap}>
          <BlueButton
            disabled={disabled}
            fullWidth={true}
            className={classes.action}
            onClick={() => onAddAndClose()}
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
              classes.actionReset
            ].join(' ')}
            onClick={onReset}
          >
            {t('Reset')}
          </WhiteButton>
        </Grid>
      </Grid>
    )
  }
}

MediaTabActions.defaultProps = {
  mode: 'add',
  onAdd: () => {},
  onReset: () => {},
  onAddAndClose: () => {},
  disabled: false
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(MediaTabActions)
