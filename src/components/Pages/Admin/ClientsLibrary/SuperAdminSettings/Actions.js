import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { BlueButton } from '../../../../Buttons'

const styles = ({ palette, type }) => ({
  root: {
    padding: '25px 20px 15px',
    backgroundColor: palette[type].card.background,
    borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`
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
    borderColor: '#cbd3e3',
    boxShadow: 'none',
    backgroundImage: 'linear-gradient(to right, #ffffff, #fefefe)',
    color: '#818ca4'
  }
})

class Actions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onUpdateSettings: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { t, classes, onUpdateSettings } = this.props

    return (
      <Grid container wrap="nowrap" justify="flex-end" className={classes.root}>
        <Grid item className={classes.actionWrap}>
          <BlueButton
            fullWidth={true}
            className={classes.action}
            onClick={onUpdateSettings}
          >
            {t('Update Settings')}
          </BlueButton>
        </Grid>
        {/*<Grid item>*/}
        {/*  <WhiteButton*/}
        {/*    fullWidth={true}*/}
        {/*    className={`${classes.action} ${classes.actionDefault}`}*/}
        {/*  >*/}
        {/*    {t('Cancel')}*/}
        {/*  </WhiteButton>*/}
        {/*</Grid>*/}
      </Grid>
    )
  }
}

export default translate('translations')(withStyles(styles)(Actions))
