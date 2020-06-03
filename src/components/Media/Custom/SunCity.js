import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import {
  WhiteButton,
  TabToggleButton,
  TabToggleButtonGroup
} from '../../Buttons'

import {
  SliderInputRange,
  FormControlSelect,
  FormControlInput
} from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import ExpansionPanel from '../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#4C5057'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes }) => (
    <div className={classes.DownloadFileButtonContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '21px 30px'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: '19px'
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
      marginBottom: 0
    },
    tabToggleButtonGroup: {
      marginBottom: '19px',
      justifyContent: 'center'
    },
    tabToggleButton: {
      width: '128px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    dateInputsStyles1: {
      marginTop: '14px'
    },
    dateInputsStyles2: {
      marginTop: '20px',
      padding: '0 20px 35px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    dateInputsStyles3: {
      marginTop: '18px',
      padding: '0 20px'
    },
    durationContainerClass: {
      width: '142px'
    },
    expansionPanelLabelClass: {
      fontSize: '12px',
      color: palette[type].pages.media.custom.color,
      fontWeight: '700'
    },
    sliderInputLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      marginRight: '15px'
    },
    formControlLabelClass: {
      fontSize: '17px'
    },
    inputContainer: {
      padding: '20px 15px'
    },
    fileTypeLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      fontSize: '12px',
      color: palette[type].pages.media.general.card.header.color
    },
    marginBottom1: {
      marginBottom: '15px'
    }
  }
}

class SunCity extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedDataSourceType: 'Import File',
      selectedDateType: 'Automated'
    }
  }

  handleDateTypeChanges = (event, selectedDateType) =>
    this.setState({ selectedDateType })

  handleDataSourceType = (event, selectedDataSourceType) =>
    this.setState({ selectedDataSourceType })

  getSelectedTabContent = () => {
    const { classes } = this.props

    switch (this.state.selectedDataSourceType) {
      case 'Import File':
        return (
          <>
            <Grid item xs={12}>
              <FormControlInput
                label="Select Event File:"
                formControlLabelClass={classes.formControlLabelClass}
              />
            </Grid>
            <Grid
              item
              xs={12}
              className={[classes.themeCardWrap, classes.marginBottom1].join(
                ' '
              )}
            >
              <header className={classes.themeHeader}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography className={classes.themeHeaderText}>
                      Download Sample Files
                    </Typography>
                  </Grid>
                  <Grid item className={classes.fileTypeLabel}>
                    <DownloadFileButton
                      iconClassName="icon-download-harddisk"
                      text="CSV"
                    />
                  </Grid>
                </Grid>
              </header>
            </Grid>
          </>
        )
      case 'Web Feed':
        return (
          <>
            <Grid item xs={12}>
              <FormControlInput
                label="Event URL:"
                formControlLabelClass={classes.formControlLabelClass}
              />
            </Grid>
            <Grid
              item
              xs={12}
              className={[classes.themeCardWrap, classes.marginBottom1].join(
                ' '
              )}
            >
              <header className={classes.themeHeader}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography className={classes.themeHeaderText}>
                      Download Sample Files
                    </Typography>
                  </Grid>
                  <Grid item className={classes.fileTypeLabel}>
                    <DownloadFileButton
                      iconClassName="icon-download-harddisk"
                      text="CSV"
                    />
                  </Grid>
                </Grid>
              </header>
            </Grid>
          </>
        )
      case 'Inline Editor':
        return null
      default:
        return
    }
  }

  render() {
    const { t, classes } = this.props
    const { selectedDataSourceType, selectedDateType } = this.state

    return (
      <div className={classes.root}>
        <Grid container justify="space-between">
          <Grid item xs={12}>
            <ExpansionPanel
              expanded={true}
              title={'Theme'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid container justify="center">
                  <Grid item xs={12} className={classes.themeCardWrap}>
                    <MediaHtmlCarousel />
                  </Grid>
                </Grid>
              }
            />
            <ExpansionPanel
              expanded={false}
              title={'Facility'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid container>
                  <Grid item xs={12} className={classes.inputContainer}>
                    <FormControlSelect
                      label="Facility:"
                      formControlLabelClass={classes.formControlLabelClass}
                    />
                  </Grid>
                </Grid>
              }
            />
            <ExpansionPanel
              expanded={false}
              title={'Data Source'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid
                  container
                  justify="center"
                  className={classes.inputContainer}
                >
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Grid item>
                        <TabToggleButtonGroup
                          className={classes.tabToggleButtonGroup}
                          value={selectedDataSourceType}
                          exclusive
                          onChange={this.handleDataSourceType}
                        >
                          <TabToggleButton
                            className={classes.tabToggleButton}
                            value={'Import File'}
                          >
                            Import File
                          </TabToggleButton>
                          <TabToggleButton
                            className={classes.tabToggleButton}
                            value={'Web Feed'}
                          >
                            Web Feed
                          </TabToggleButton>
                          <TabToggleButton
                            className={classes.tabToggleButton}
                            value={'Inline Editor'}
                          >
                            Inline Editor
                          </TabToggleButton>
                        </TabToggleButtonGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.getSelectedTabContent()}
                </Grid>
              }
            />
            <ExpansionPanel
              expanded={false}
              title={'Date Range'}
              formControlLabelClass={classes.expansionPanelLabelClass}
              children={
                <Grid container className={classes.marginBottom1}>
                  <Grid item xs={12} className={classes.dateInputsStyles1}>
                    <TabToggleButtonGroup
                      className={classes.tabToggleButtonContainer}
                      value={selectedDateType}
                      exclusive
                      onChange={this.handleDateTypeChanges}
                    >
                      <TabToggleButton
                        className={classes.tabToggleButton}
                        value={'Automated'}
                      >
                        Automated
                      </TabToggleButton>
                      <TabToggleButton
                        className={classes.tabToggleButton}
                        value={'Manual'}
                      >
                        Manual
                      </TabToggleButton>
                    </TabToggleButtonGroup>
                  </Grid>
                  <Grid item xs={12} className={classes.dateInputsStyles2}>
                    <FormControlSelect
                      placeholder="This Week"
                      marginBottom={false}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.dateInputsStyles3}>
                    <FormControlSelect
                      label="Duration :"
                      placeholder="5"
                      formControlContainerClass={classes.durationContainerClass}
                      marginBottom={false}
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

export default translate('translations')(withStyles(styles)(SunCity))
