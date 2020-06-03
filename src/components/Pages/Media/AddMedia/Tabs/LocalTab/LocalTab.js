import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Tooltip } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import {
  Weather,
  Traffic,
  ScheduleOfEvents,
  Clock,
  Date,
  Timer,
  Interest
} from '../../../../../Media/Local'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../../../actions/mediaActions'
import MediaComponent from '../MediaComponent'
import { get as _get } from 'lodash'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '24px',
    lineHeight: '18px'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', classes, tooltip }) => (
    <Tooltip title={tooltip}>
      <div className={classes.tabIconWrap}>
        <i className={iconClassName} />
      </div>
    </Tooltip>
  )
)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    tabHeader: {
      borderTop: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      borderBottom: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      backgroundColor: palette[type].sideModal.tabs.header.background
    },
    tabContentWrap: {
      flex: '1 1 auto',
      maxHeight: 'calc(100% - 65px)'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    }
  }
}

class AddMediaLocalTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    ownTabName: 'local',
    selectedTab: 'weather',
    contentStates: {
      traffic: {},
      events: {},
      clock: {},
      date: {},
      timer: {},
      pointofinterest: {},
      weather: {}
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'
    const tabs = [
      { name: 'weather', icon: 'icon-day-cloudy', tooltip: 'Weather' },
      { name: 'traffic', icon: 'icon-traffic-light-1', tooltip: 'Traffic' },
      {
        name: 'scheduleOfEvents',
        icon: 'icon-calendar-star',
        tooltip: 'Schedule Of Events'
      },
      { name: 'clock', icon: 'icon-alarm-clock', tooltip: 'Clock' },
      { name: 'date', icon: 'icon-calendar-1', tooltip: 'Date' },
      { name: 'timer', icon: 'icon-hourglass', tooltip: 'Timer' },
      {
        name: 'pointofinterest',
        icon: 'icon-location-map-pin',
        tooltip: 'Interest'
      }
    ]

    return tabs.map(({ name, icon, tooltip }, key) => {
      return (
        <SingleIconTab
          key={key + name}
          disabled={isEditMode && selectedTab !== name}
          icon={<TabIcon iconClassName={icon} tooltip={tooltip} />}
          disableRipple={true}
          value={name}
        />
      )
    })
  }

  getSelectedTabContent = () => {
    switch (this.state.selectedTab) {
      case 'traffic':
        return Traffic
      case 'events':
        return ScheduleOfEvents
      case 'clock':
        return Clock
      case 'date':
        return Date
      case 'timer':
        return Timer
      case 'pointofinterest':
        return Interest
      case 'weather':
        return Weather
      default:
        return Weather
    }
  }

  componentWillUnmount() {
    this._componentWillUnmount()
  }

  componentDidUpdate(prevProps) {
    this._componentDidUpdate(prevProps)
  }

  componentDidMount() {
    this._componentDidMount()
  }

  render() {
    const { classes, mediaItem, match } = this.props
    const { selectedTab, contentStates } = this.state
    const ContentTab = this.getSelectedTabContent()
    const { currentTab: currentTabParam } = match.params

    if (currentTabParam !== selectedTab) {
      const url = this.getCurrentUrlBySelectedTab()
      return <Redirect to={url} />
    }

    return (
      <div className={classes.root}>
        <header className={classes.tabHeader}>
          <SingleIconTabs value={selectedTab} onChange={this.handleTabChange}>
            {this.getHeaderTabs()}
          </SingleIconTabs>
        </header>
        <ContentTab
          customClasses={classes}
          selectedTab={selectedTab}
          formData={contentStates[selectedTab]}
          mode={match.params.mode}
          backendData={_get(mediaItem, 'response', null)}
          onShareStateCallback={this.handleShareStateCallback}
          onModalClose={this.setModalClose}
          onShowSnackbar={this.showSnackbar}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ media }) => ({
  mediaItem: media.mediaItem
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getMediaItemById,
      clearEditMedia,
      clearMediaItemStatus
    },
    dispatch
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(AddMediaLocalTab)
