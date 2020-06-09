import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { SliderInputRange, FormControlInput } from '../../Form'
import {
  BlueButton,
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import MediaHtmlCarousel from '../MediaHtmlCarousel'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#0A83C8'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const InfoMessageStyles = ({ typography }) => ({
  infoMessageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0 0 16px'
  },
  infoMessage: {
    marginLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        SignageCreator is an easy-to-use, web-based design tool to create
        stunning layouts and templates for digital signage.
      </div>
    </div>
  )
)

const styles = ({ palette, type, typography, formControls }) => {
  return {
    root: {
      margin: '15px 30px',
      fontFamily: typography.fontFamily
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px',
      marginBottom: 16
    },
    themeHeader: {
      padding: '0 15px',
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.card.header.color,
      fontSize: '12px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    themeOptions1: {
      padding: 15
    },
    authorizationContainer: {
      padding: 0
    },
    registerButton: {
      width: '124px',
      '& span': {
        fontSize: '14px'
      },
      '&:hover': {
        color: '#fff',
        background: '#006198',
        borderColor: '#006198'
      }
    },
    loginButton: {
      width: '114px'
    },
    registerContainer: {
      borderRight: `1px solid ${palette[type].sideModal.tabs.header.border}`
    },
    loginContainer: {
      paddingLeft: 16,
      paddingBottom: 16
    },
    formControlRootClass: {
      width: '264px'
    },
    previewMediaRow: {
      marginTop: 45
    },
    sliderInputLabel: {
      ...formControls.mediaApps.refreshEverySlider.label,
      lineHeight: '15px',
      marginRight: '15px'
    }
  }
}

class SignageCreator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOrientationType: 'Landscape'
    }
  }

  handleOrientationTypeChanges = (event, selectedOrientationType) =>
    this.setState({ selectedOrientationType })

  render() {
    const { t, classes } = this.props

    const { selectedOrientationType } = this.state

    return (
      <div className={classes.root}>
        <InfoMessage iconClassName={'icon-interface-information-1'} />
        <Grid container className={classes.authorizationContainer}>
          <Grid item xs={5} className={classes.registerContainer}>
            <Grid container direction="column">
              <Grid item>
                <Typography className={classes.themeHeaderText}>
                  If you are a new User ?
                </Typography>
              </Grid>
              <Grid item>
                <WhiteButton
                  fullWidth={true}
                  className={['hvr-radial-out', classes.registerButton].join(
                    ' '
                  )}
                >
                  {t('Register Now')}
                </WhiteButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7} className={classes.loginContainer}>
            <Grid container direction="column">
              <Grid item>
                <Typography className={classes.themeHeaderText}>
                  Already have an account?
                </Typography>
              </Grid>
              <Grid item>
                <FormControlInput
                  placeholder="Username"
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item>
                <FormControlInput
                  placeholder="Password"
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item>
                <BlueButton fullWidth={true} className={classes.loginButton}>
                  {t('Login Now')}
                </BlueButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <header>
                    <Typography className={classes.themeHeaderText}>
                      Theme
                    </Typography>
                  </header>
                </Grid>
                <Grid item>
                  <TabToggleButtonGroup
                    className={classes.tabToggleButtonContainer}
                    value={selectedOrientationType}
                    exclusive
                    onChange={this.handleOrientationTypeChanges}
                  >
                    <TabToggleButton value={'Landscape'}>
                      Landscape
                    </TabToggleButton>
                    <TabToggleButton value={'Portrait'}>
                      Portrait
                    </TabToggleButton>
                  </TabToggleButtonGroup>
                </Grid>
              </Grid>
            </header>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.themeOptions1}
            >
              <Grid item xs={12}>
                <MediaHtmlCarousel />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.previewMediaRow}
        >
          <Grid item>
            <Grid container justify="flex-start" alignItems="center">
              <Grid item>
                <Typography className={classes.sliderInputLabel}>
                  Refresh Every
                </Typography>
              </Grid>
              <Grid item>
                <SliderInputRange
                  step={1}
                  value={5}
                  label={''}
                  maxValue={150}
                  minValue={0}
                  handleChange={() => {}}
                  numberWraperStyles={{ width: 55 }}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(SignageCreator))
