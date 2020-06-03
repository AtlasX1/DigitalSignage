import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import { FormControlSelect, SliderInputRange } from '../../Form'

import { GoogleCalendar, ImportFile, WebFeed } from './components/Events/index'

import MediaThemeSelector from '../MediaThemeSelector'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none',
      marginTop: '37px'
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
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    themeOptions1: {
      padding: '0 15px',
      margin: '12px 0'
    },
    marginTop1: {
      marginTop: '27px'
    },
    marginTop2: {
      marginTop: '21px'
    },
    marginTop3: {
      marginTop: '22px'
    },
    marginTop4: {
      marginTop: '10px'
    },
    marginTop5: {
      marginTop: '17px'
    },
    sliderInputLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      marginRight: '15px'
    },
    sliderRootClass: {
      marginTop: '24px'
    },
    inputContainer: {
      padding: '0 10px',
      margin: '0 -10px'
    }
  }
}

class ScheduleOfEvents extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedEventType: 'Import File',
      selectedDateRangeType: 'Automated',
      selectedThemeType: 'Modern'
    }
  }

  handleEventTypeChanges = (event, selectedEventType) =>
    this.setState({ selectedEventType })
  handleDateRangeChanges = (event, selectedDateRangeType) =>
    this.setState({ selectedDateRangeType })
  handleThemeTypeChanges = (event, selectedThemeType) =>
    this.setState({ selectedThemeType })

  getSelectedTabContent = () => {
    switch (this.state.selectedEventType) {
      case 'Google Calendar':
        return <GoogleCalendar />
      case 'Import File':
        return <ImportFile />
      case 'Web Feed':
        return <WebFeed />
      case 'Inline Editor':
        return null
      default:
        return
    }
  }

  render() {
    const { t, classes } = this.props

    const {
      selectedEventType,
      selectedDateRangeType,
      selectedThemeType
    } = this.state

    return (
      <div className={classes.root}>
        <Grid container justify="center">
          <MediaThemeSelector
            value={selectedThemeType}
            onChange={this.handleThemeTypeChanges}
          />
        </Grid>
        <Grid container justify="center" className={classes.marginTop1}>
          <Grid item>
            <TabToggleButtonGroup
              className={classes.tabToggleButtonContainer}
              value={selectedEventType}
              exclusive
              onChange={this.handleEventTypeChanges}
            >
              <TabToggleButton value={'Google Calendar'}>
                Google Calendar
              </TabToggleButton>
              <TabToggleButton value={'Import File'}>
                Import File
              </TabToggleButton>
              <TabToggleButton value={'Web Feed'}>Web Feed</TabToggleButton>
              <TabToggleButton value={'Inline Editor'}>
                Inline Editor
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
        {this.getSelectedTabContent()}
        <Grid container justify="center" className={classes.marginTop2}>
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography className={classes.themeHeaderText}>
                    Date Range
                  </Typography>
                </Grid>
                <Grid item>
                  <TabToggleButtonGroup
                    className={classes.tabToggleButtonContainer}
                    value={selectedDateRangeType}
                    exclusive
                    onChange={this.handleDateRangeChanges}
                  >
                    <TabToggleButton value={'Automated'}>
                      Automated
                    </TabToggleButton>
                    <TabToggleButton value={'Manual'}>Manual</TabToggleButton>
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
                <FormControlSelect marginBottom={false} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          className={classes.marginTop3}
        >
          <Grid item xs={6} className={classes.inputContainer}>
            <FormControlSelect label="Duration" marginBottom={false} />
          </Grid>
          <Grid item xs={6} className={classes.inputContainer}>
            <Grid
              container
              justify="flex-start"
              alignItems="center"
              className={classes.sliderRootClass}
            >
              <Grid item>
                <Typography className={classes.sliderInputLabel}>
                  Refresh Every
                </Typography>
              </Grid>
              <Grid item>
                <SliderInputRange
                  maxValue={100}
                  minValue={0}
                  step={1}
                  label={''}
                  numberWraperStyles={{ width: 55 }}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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

export default translate('translations')(withStyles(styles)(ScheduleOfEvents))
