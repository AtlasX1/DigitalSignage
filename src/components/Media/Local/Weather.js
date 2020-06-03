import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { WhiteButton } from '../../Buttons'
import { FormControlSelect } from '../../Form'
import { CheckboxSwitcher } from '../../Checkboxes'
import MediaThemeSelector from '../MediaThemeSelector'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none',
      marginTop: '68px'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.background,
      borderRadius: '4px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.general.card.header.color,
      fontSize: '12px'
    },
    formControlRootClass: {
      width: '100%',
      justifyContent: 'space-between'
    },
    themeOptions1: {
      padding: '0 15px',
      margin: '12px 0'
    },
    inputItemContainer: {
      padding: '0 15px',
      margin: '0 -15px'
    },
    switchContainerClass: {
      width: '130px'
    },
    lastUpdatedSwitch: {
      margin: '0 auto'
    },
    detailLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px',
      paddingRight: '15px'
    },
    marginTop1: {
      marginTop: '10px'
    },
    marginTop2: {
      marginTop: '17px'
    },
    marginTop3: {
      marginTop: '25px'
    },
    marginTop4: {
      marginTop: '24px'
    },
    marginTop5: {
      marginTop: '16px'
    },
    marginTop6: {
      marginTop: '15px'
    },
    marginTop7: {
      marginTop: '12px'
    },
    marginRight: {
      marginRight: '30px'
    },
    elementsClass: {
      fontSize: '12px',
      fontWeight: '700',
      color: palette[type].pages.media.general.card.header.color
    },
    formsContainer: {
      paddingBottom: '22px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    }
  }
}

class Weather extends Component {
  constructor(props) {
    super(props)

    this.state = {
      useLocation: false,
      selectedThemeType: 'Modern'
    }
  }

  handleThemeTypeChanges = (event, selectedThemeType) =>
    this.setState({ selectedThemeType })

  handleChange = (field, value) => this.setState({ [field]: value })

  render() {
    const { t, classes } = this.props

    const { useLocation, selectedThemeType } = this.state

    return (
      <div className={classes.root}>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography className={classes.themeHeaderText}>
                    Location
                  </Typography>
                </Grid>
                <Grid item>
                  <CheckboxSwitcher
                    label="Auto"
                    value={useLocation}
                    handleChange={checked =>
                      this.handleChange('useLocation', checked)
                    }
                  />
                </Grid>
              </Grid>
            </header>
            {!useLocation && (
              <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.themeOptions1}
              >
                <Grid item>
                  <Typography className={classes.detailLabel}>
                    Enter City / Zip Code:
                  </Typography>
                </Grid>
                <Grid item xs>
                  <FormControlSelect marginBottom={false} />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid container justify="center" className={classes.marginTop6}>
          <MediaThemeSelector
            value={selectedThemeType}
            onChange={this.handleThemeTypeChanges}
          />
        </Grid>
        <Grid container alignItems="center" className={classes.formsContainer}>
          <Grid item xs={12} className={classes.marginTop3}>
            <Grid container justify="space-between">
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect
                  label="Number of Days"
                  marginBottom={false}
                />
              </Grid>
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect label="Temperature" marginBottom={false} />
              </Grid>
              <Grid item xs={4} className={classes.inputItemContainer}>
                <CheckboxSwitcher
                  label="Last Updated"
                  formControlRootClass={classes.lastUpdatedSwitch}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.marginTop4}>
            <Grid container justify="flex-start">
              <Grid
                item
                xs={4}
                className={[
                  classes.inputItemContainer,
                  classes.marginRight
                ].join(' ')}
              >
                <FormControlSelect label="Layout" marginBottom={false} />
              </Grid>
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect label="Size" marginBottom={false} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          className={classes.marginTop5}
        >
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Typography className={classes.elementsClass}>
                  Elements
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.marginTop7}>
            <Grid container>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Humidity"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Pressure"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Visibility"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Feels Like"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Precipitation"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxSwitcher
                  label="Wind"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="flex-start">
          <Grid item>
            <WhiteButton className={classes.previewMediaBtn}>
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(Weather))
