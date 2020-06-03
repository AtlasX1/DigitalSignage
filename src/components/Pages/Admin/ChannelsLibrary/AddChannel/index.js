import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../../Modal'
import { FormControlInput } from '../../../../Form'
import { BlueButton, WhiteButton } from '../../../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    addHelpPageWrap: {
      height: '100%'
    },
    addHelpPageDetails: {
      padding: '0 30px'
    },
    marginBottom40: {
      marginBottom: '40px'
    },
    embeddedCodeInput: {
      height: '100%'
    },
    addChannelActions: {
      width: '100%',
      padding: '15px 40px',
      borderTop: `1px solid ${palette[type].pages.users.addUser.border}`
    },
    actionWrap: {
      paddingRight: '16px'
    },
    action: {
      width: '142px',
      paddingTop: '9px',
      paddingBottom: '9px'
    },
    actionCancel: {
      borderColor: palette[type].pages.users.addUser.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].pages.users.addUser.button.background,
      color: palette[type].pages.users.addUser.button.color
    }
  }
}

class AddChannel extends Component {
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
      <SideModal
        width="35%"
        title={t('Add Channel')}
        closeLink="/system/channels-library"
      >
        <Grid
          container
          direction="column"
          justify="space-between"
          className={classes.addHelpPageWrap}
        >
          <Grid item xs className={classes.addHelpPageDetails}>
            <Grid container className={classes.marginBottom40}>
              <Grid item xs={12}>
                <FormControlInput
                  id="channel-name"
                  fullWidth={true}
                  label={t('Channel Name')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlInput
                  id="assign-client"
                  fullWidth={true}
                  label={t('Assign to Client')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlInput
                  id="embedded-code"
                  fullWidth={true}
                  multiline={true}
                  rows={35}
                  label={t('Embedded Code')}
                  formControlInputClass={classes.embeddedCodeInput}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container wrap="nowrap" className={classes.addChannelActions}>
              <Grid item className={classes.actionWrap}>
                <BlueButton className={classes.action}>
                  {t('Add Channel')}
                </BlueButton>
              </Grid>
              <Grid item className={classes.actionWrap}>
                <WhiteButton
                  className={[classes.action, classes.actionCancel].join(' ')}
                >
                  {t('Cancel')}
                </WhiteButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(AddChannel))
