import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { BlueButton, WhiteButton } from '../../../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '25px 20px 15px',
      backgroundColor: palette[type].pages.oem.addClient.actions.background,
      borderTop: `1px solid ${palette[type].pages.oem.addClient.actions.border}`
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
      borderColor: palette[type].pages.users.addUser.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].pages.users.addUser.button.background,
      color: palette[type].pages.users.addUser.button.color
    }
  }
}

class Actions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { t, classes } = this.props

    return (
      <Grid container wrap="nowrap" justify="flex-end" className={classes.root}>
        <Grid item className={classes.actionWrap}>
          <BlueButton fullWidth={true} className={classes.action}>
            {t('Add New Device')}
          </BlueButton>
        </Grid>
        <Grid item>
          <WhiteButton
            fullWidth={true}
            className={[classes.action, classes.actionDefault].join(' ')}
          >
            {t('Cancel')}
          </WhiteButton>
        </Grid>
      </Grid>
    )
  }
}

export default translate('translations')(withStyles(styles)(Actions))
