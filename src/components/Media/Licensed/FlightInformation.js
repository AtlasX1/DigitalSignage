import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlSelect } from '../../Form'

import { CheckboxSwitcher } from '../../Checkboxes'

import { WhiteButton } from '../../Buttons'

import MediaThemeSelector from '../MediaThemeSelector'

import ExpansionPanel from '../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '35px 25px 0',
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
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    formControlRootClass: {
      width: '264px'
    },
    formContainer: {
      marginTop: '22px'
    },
    airlinesContainer: {
      padding: '0 20px'
    },
    airlineItem: {
      width: '234px',
      borderBottom: '1px solid #E4E9F3'
    },
    checkboxRootClass: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    previewMediaRow: {
      marginTop: '112px'
    },
    expansionContainer: {
      marginTop: '34px'
    },
    inputContainer: {
      padding: '0 10px',
      margin: '0 -10px'
    },
    formControlLabelClass: {
      fontSize: '13px'
    },
    expansionPanelLabelClass: {
      fontSize: '12px',
      color: palette[type].pages.media.licenced.color,
      fontWeight: '700'
    },
    formSelectLabelClass: {
      fontSize: '17px'
    }
  }
}

class FlightInformation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedThemeType: 'Modern'
    }
  }

  handleThemeTypeChanges = (event, selectedThemeType) =>
    this.setState({ selectedThemeType })

  render() {
    const { t, classes } = this.props
    const { selectedThemeType } = this.state

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <FormControlSelect
              label="Airport Code or Name"
              formControlLabelClass={classes.formSelectLabelClass}
              marginBottom={false}
            />
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.formContainer}
          justify="space-between"
        >
          <Grid item xs={6} className={classes.inputContainer}>
            <FormControlSelect
              label="Departure / Arrival: "
              formControlLabelClass={classes.formSelectLabelClass}
              marginBottom={false}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputContainer}>
            <FormControlSelect
              label="No of Hours: "
              formControlLabelClass={classes.formSelectLabelClass}
              marginBottom={false}
            />
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.expansionContainer}
        >
          <Grid item xs={12}>
            <ExpansionPanel
              expanded={true}
              title={'Theme'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid container justify="center">
                  <MediaThemeSelector
                    value={selectedThemeType}
                    onChange={this.handleThemeTypeChanges}
                  />
                </Grid>
              }
            />
            <ExpansionPanel
              expanded={false}
              title={'Layout'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid container>
                  <Grid item xs={12}></Grid>
                </Grid>
              }
            />
            <ExpansionPanel
              expanded={false}
              title={'Airline'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid
                  container
                  justify="space-between"
                  className={classes.airlinesContainer}
                >
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="Aeromexico"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="Southwest Airlines"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="Alaska Airlines"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="UPS"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="American Airlines"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="WestJet"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="Delta Air Lines"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                  <Grid item className={classes.airlineItem}>
                    <CheckboxSwitcher
                      label="Air France"
                      formControlRootClass={classes.checkboxRootClass}
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                </Grid>
              }
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
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(FlightInformation))
