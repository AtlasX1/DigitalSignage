import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Tabs } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'

import { WysiwygEditor, FormControlInput } from '../../Form'
import { MediaInfo, MediaTabActions } from '../../Media'

import { SingleIconTab } from '../../Tabs'
import MediaHtmlCarousel from '../MediaHtmlCarousel'

const TabIconStyles = () => ({
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

export const SingleIconTabs = withStyles({
  scroller: {
    margin: '0'
  },
  indicator: {
    display: 'none'
  },
  flexContainer: {
    justifyContent: 'center'
  }
})(Tabs)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '15px 30px'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    tabToggleButtonGroup: {
      marginBottom: 15,
      justifyContent: 'center'
    },
    tabToggleButton: {
      width: '128px'
    },
    featureIconTabContainer: {
      justifyContent: 'center',
      marginLeft: 0
    },
    featureIconTab: {
      '&:not(:last-child)': {
        marginRight: '30px'
      }
    },
    marginTop1: {
      marginTop: 16
    },
    urlInputContainer: {
      padding: '0 15px'
    },
    labelClass: {
      fontSize: '1.0833rem'
    },
    mediaInfoContainer: {
      height: '100%'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: 'solid 1px #e4e9f3'
    }
  }
}

class AlertSystem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedAlertType: 'Emergency Alert',
      selectedFeatureType: 'hurricane'
    }
  }

  handleAlertTypeChanges = (event, selectedAlertType) =>
    this.setState({ selectedAlertType })
  handleFeatureTypeChanges = (event, selectedFeatureType) =>
    this.setState({ selectedFeatureType })

  getEmergencyAlertComponent = () => {
    const { classes } = this.props

    return (
      <>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <SingleIconTabs
                value={this.state.selectedFeatureType}
                onChange={this.handleFeatureTypeChanges}
                className={classes.featureIconTabContainer}
              >
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-cloudy-hurricane" />}
                  disableRipple={true}
                  value="hurricane"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-hotel-fire-alarm" />}
                  disableRipple={true}
                  value="fire"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-smiley-frown-2" />}
                  disableRipple={true}
                  value="amber"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-flood" />}
                  disableRipple={true}
                  value="flood"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-bomb" />}
                  disableRipple={true}
                  value="terror"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-earthquake" />}
                  disableRipple={true}
                  value="earthquake"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-hurricane-2" />}
                  disableRipple={true}
                  value="tornado"
                />
                <SingleIconTab
                  className={classes.featureIconTab}
                  icon={<TabIcon iconClassName="icon-cog-play" />}
                  disableRipple={true}
                  value="win"
                />
              </SingleIconTabs>
            </header>
            <MediaHtmlCarousel />
          </Grid>
        </Grid>
        <Grid container className={classes.marginTop1}>
          <Grid item xs={12}>
            <WysiwygEditor />
          </Grid>
        </Grid>
      </>
    )
  }

  getSelectedTabContent = () => {
    const { classes } = this.props

    switch (this.state.selectedAlertType) {
      case 'Emergency Alert':
        return this.getEmergencyAlertComponent()
      case 'CAP Alert':
        return (
          <Grid container justify="center">
            <Grid
              item
              xs={12}
              className={[
                classes.urlInputContainer,
                classes.themeCardWrap
              ].join(' ')}
            >
              <header className={classes.marginTop1}>
                <FormControlInput
                  label="CAP Alert URL:"
                  fullWidth={true}
                  formControlLabelClass={classes.labelClass}
                />
              </header>
            </Grid>
          </Grid>
        )
      default:
        return
    }
  }

  render() {
    const { classes } = this.props
    const { selectedAlertType } = this.state

    return (
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <TabToggleButtonGroup
                  className={classes.tabToggleButtonGroup}
                  value={selectedAlertType}
                  exclusive
                  onChange={this.handleAlertTypeChanges}
                >
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value="Emergency Alert"
                  >
                    Emergency Alert
                  </TabToggleButton>
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value="CAP Alert"
                  >
                    CAP Alert
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
            </Grid>
            {this.getSelectedTabContent()}
          </div>
        </Grid>
        <Grid item xs={5} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            justify="space-between"
            className={classes.mediaInfoContainer}
          >
            <Grid item>
              <MediaInfo />
            </Grid>
            <Grid item>
              <MediaTabActions />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default translate('translations')(withStyles(styles)(AlertSystem))
