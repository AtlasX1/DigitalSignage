import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import {
  WhiteButton,
  TabToggleButton,
  TabToggleButtonGroup
} from '../../Buttons'

import { CheckboxSwitcher } from '../../Checkboxes'

import { SingleIconTab, SingleIconTabs } from '../../Tabs'

import {
  FormControlSelect,
  SliderInputRange,
  FormControlInput
} from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'

const TabIconStyles = theme => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '20px 24px'
    },
    tabToggleButtonGroup: {
      marginTop: '14px',
      marginBottom: '20px'
    },
    tabToggleButton: {
      width: '128px'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: '32px'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    featureIconTabContainer: {
      justifyContent: 'center'
    },
    featureIconTab: {
      '&:not(:last-child)': {
        marginRight: '30px'
      }
    },
    formControlInput: {
      width: '100%'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px',
      marginBottom: '45px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.card.header.color
    },
    themeOptions1: {
      padding: '0 15px',
      marginTop: '22px'
    },
    themeOptions2: {
      padding: '0 15px',
      marginTop: '31px'
    },
    themeOptions3: {
      padding: '0 15px',
      margin: '5px 0 29px'
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important',
      marginRight: '10px'
    },
    themeInputContainer: {
      padding: '0 7px',
      margin: '0 -7px'
    },
    colorPaletteContainer: {
      display: 'flex',
      '&:nth-child(2n+1)': {
        paddingRight: '15px',
        justifyContent: 'flex-end'
      },
      '&:nth-child(2n)': {
        paddingLeft: '15px',
        justifyContent: 'flex-start'
      }
    },
    formControlLabelClass: {
      fontSize: '18px'
    },
    sliderInputLabelClass: {
      paddingRight: '15px',
      fontStyle: 'normal'
    },
    labelClass: {
      fontSize: '17px'
    },
    checkboxSwitcherLabelClass: {
      fontSize: '13px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    formControlSelectWrap: {
      marginBottom: '4px'
    },
    urlInputContainer: {
      padding: '0 15px'
    }
  }
}

class Youtube extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedFeatureType: 'folders',
      selectedCustomType: 'Video'
    }
  }

  handleFeatureTypeChanges = (event, selectedFeatureType) =>
    this.setState({ selectedFeatureType })
  handleCustomTypeChanges = (event, selectedCustomType) =>
    this.setState({ selectedCustomType })

  getSelectedTabContent = () => {
    const { classes } = this.props

    switch (this.state.selectedFeatureType) {
      case 'custom':
        return (
          <Grid container justify="center">
            <Grid item className={classes.marginTop1}>
              <TabToggleButtonGroup
                className={classes.tabToggleButtonGroup}
                value={this.state.selectedCustomType}
                exclusive
                onChange={this.handleCustomTypeChanges}
              >
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value="Video"
                >
                  Video
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value="Playlist"
                >
                  Playlist
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value="Channel"
                >
                  Channel
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value="Live Channel"
                >
                  Live Channel
                </TabToggleButton>
              </TabToggleButtonGroup>
            </Grid>
            <Grid item xs={12} className={classes.urlInputContainer}>
              {this.getSelectedCustomTypeContent()}
            </Grid>
          </Grid>
        )
      default:
        return (
          <Grid container>
            <Grid item xs={12}>
              <MediaHtmlCarousel />
            </Grid>
          </Grid>
        )
    }
  }

  getSelectedCustomTypeContent = () => {
    const { classes } = this.props

    switch (this.state.selectedCustomType) {
      case 'Video':
        return (
          <FormControlInput
            label="YouTube Video ID:"
            fullWidth={true}
            formControlLabelClass={classes.labelClass}
          />
        )
      case 'Playlist':
        return (
          <FormControlInput
            label="YouTube Playlist ID:"
            fullWidth={true}
            formControlLabelClass={classes.labelClass}
          />
        )
      case 'Channel':
        return (
          <FormControlInput
            label="YouTube Channel ID / Name:"
            fullWidth={true}
            formControlLabelClass={classes.labelClass}
          />
        )
      case 'Live Channel':
        return (
          <FormControlInput
            label="YouTube Channel ID / Name:"
            fullWidth={true}
            formControlLabelClass={classes.labelClass}
          />
        )
      default:
        return
    }
  }

  render() {
    const { t, classes } = this.props
    const { selectedFeatureType } = this.state

    return (
      <div className={classes.root}>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <SingleIconTabs
                value={selectedFeatureType}
                onChange={this.handleFeatureTypeChanges}
                className={classes.featureIconTabContainer}
              >
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-content-newspaper-2" />}
                  disableRipple={true}
                  value="folders"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-laptop-2" />}
                  disableRipple={true}
                  value="text"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-sport-football-helmet" />}
                  disableRipple={true}
                  value="code"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-books-apple" />}
                  disableRipple={true}
                  value="qr"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-kitchen-fork-spoon" />}
                  disableRipple={true}
                  value="chart"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-sunny" />}
                  disableRipple={true}
                  value="sunny"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-christmas-snowflake" />}
                  disableRipple={true}
                  value="snow"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-rewards-medal-4" />}
                  disableRipple={true}
                  value="medal"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-vote-heart" />}
                  disableRipple={true}
                  value="custom"
                />
              </SingleIconTabs>
            </header>
            {this.getSelectedTabContent()}
          </Grid>
        </Grid>

        <Grid
          container
          justify="space-between"
          className={classes.formControlSelectWrap}
        >
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlSelect
              label={'Transition'}
              formControlLabelClass={classes.labelClass}
            />
          </Grid>
          <Grid item xs={6} className={classes.themeInputContainer}>
            <FormControlSelect
              label={'Duration'}
              formControlLabelClass={classes.labelClass}
            />
          </Grid>
        </Grid>

        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <CheckboxSwitcher
              label="Mute Audio"
              switchContainerClass={classes.switchContainerClass}
              formControlRootClass={classes.formControlRootClass}
              formControlLabelClass={classes.checkboxSwitcherLabelClass}
            />
          </Grid>
          <Grid item>
            <SliderInputRange
              step={1}
              value={5}
              label={t('Number of Videos')}
              maxValue={150}
              minValue={0}
              handleChange={() => {}}
              labelAtEnd={false}
              inputContainerClass={classes.inputContainerClass}
              inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
              labelClass={classes.sliderInputLabelClass}
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
            <SliderInputRange
              step={1}
              value={5}
              label={t('Refresh Every')}
              tooltip={
                'Frequency of content refresh during playback (in minutes)'
              }
              maxValue={150}
              minValue={0}
              handleChange={() => {}}
              labelAtEnd={false}
              inputContainerClass={classes.inputContainerClass}
              inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(Youtube))
