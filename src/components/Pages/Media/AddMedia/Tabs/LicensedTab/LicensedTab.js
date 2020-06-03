import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Tooltip } from '@material-ui/core'
import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import {
  SignageCreator,
  FlightInformation,
  Sports,
  Feeds,
  LiveTransit
} from '../../../../../Media/Licensed'
import { bindActionCreators, compose } from 'redux'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../../../actions/mediaActions'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { get as _get } from 'lodash'
import MediaComponent from '../MediaComponent'

const TabIconStyles = theme => ({
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
      flex: '1 1 auto'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: `solid 1px ${palette[type].sideModal.tabs.header.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    }
  }
}

class LicensedTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      ownTabName: 'licensed',
      selectedTab: 'flightstats',
      contentStates: {
        flightstats: {},
        signagecreator: {},
        licensedchannels: {},
        feeds: {},
        livetransit: {}
      }
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'
    const tabs = [
      { name: 'flightstats', icon: 'icon-airplane', tooltip: 'Flight Stats' },
      {
        name: 'signagecreator',
        icon: 'icon-food-menu',
        tooltip: 'Signage Creator'
      },
      {
        name: 'licensedchannels',
        icon: 'icon-window-rss-feed',
        tooltip: 'Licensed Channels'
      },
      { name: 'feeds', icon: 'icon-audio-control-play', tooltip: 'Feeds' },
      {
        name: 'livetransit',
        icon: 'icon-train-tunnel-1',
        tooltip: 'Live Transit'
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

  handleChange = (event, selectedTab) => {
    this.setState({ selectedTab })
  }

  getSelectedTabContent = () => {
    switch (this.state.selectedTab) {
      case 'flightstats':
        return SignageCreator
      case 'signagecreator':
        return FlightInformation
      case 'licensedchannels':
        return Sports
      case 'feeds':
        return Feeds
      case 'livetransit':
        return LiveTransit
      default:
        return SignageCreator
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
          mode={match.params.mode}
          backendData={_get(mediaItem, 'response', null)}
          formData={contentStates[selectedTab]}
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
)(LicensedTab)
