import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { WhiteButton } from '../../Buttons'
import {
  FormControlSelect,
  SliderInputRange,
  FormControlInput
} from '../../Form'

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
    padding: '0 5px 44px'
  },
  infoMessage: {
    marginLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  },
  marginTop: {
    marginTop: '20px'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        <div>
          Picasa is no longer officially supported by Google, and future
          compatibility or availability of this widget is not guaranteed.
        </div>
        <div className={classes.marginTop}>
          Modern transition effects require up to date device hardware, as well
          as up to date firmware on your device. Legacy transition effects are
          no longer supported.
        </div>
      </div>
    </div>
  )
)

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '30px 25px',
      fontFamily: typography.fontFamily
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    previewMediaRow: {
      marginTop: '61px'
    },
    themeInputContainer: {
      padding: '0 7px',
      margin: '0 -7px'
    },
    tabToggleButton: {
      width: '128px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent',
      marginTop: '17px'
    },
    picasaInput: {
      marginBottom: 0
    },
    inputLabel: {
      fontSize: '17px'
    },
    marginTop1: {
      marginTop: '30px'
    },
    sliderInputLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      marginRight: '15px'
    }
  }
}

class Picasa extends Component {
  render() {
    const { t, classes } = this.props

    return (
      <div className={classes.root}>
        <InfoMessage iconClassName={'icon-interface-information-1'} />
        <Grid container justify="space-between">
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlInput
              label={'Picasa User ID'}
              formControlRootClass={classes.picasaInput}
              formControlLabelClass={classes.inputLabel}
            />
          </Grid>
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlInput
              label={'Picasa Album ID'}
              formControlRootClass={classes.picasaInput}
              formControlLabelClass={classes.inputLabel}
            />
          </Grid>
        </Grid>
        <Grid container justify="space-between" className={classes.marginTop1}>
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlSelect
              label={'Transition'}
              marginBottom={false}
              formControlLabelClass={classes.inputLabel}
            />
          </Grid>
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlSelect
              label={'Duration'}
              marginBottom={false}
              formControlLabelClass={classes.inputLabel}
            />
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.previewMediaRow}
        >
          <Grid item>
            <WhiteButton className={classes.previewMediaBtn}>
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>
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

export default translate('translations')(withStyles(styles)(Picasa))
