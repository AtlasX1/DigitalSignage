import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get as _get } from 'lodash'
import { Redirect } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { withStyles, Tooltip } from '@material-ui/core'

import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import {
  Webpage,
  RSS,
  MediaRSS,
  Youtube,
  Vimeo,
  StockQuote,
  Google,
  Radio,
  MicrosoftPowerBi
} from '../../../../../Media/Web'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../../../actions/mediaActions'
import MediaComponent from '../MediaComponent'

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
    tabWrap: {
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
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    }
  }
}

class AddMediaWebTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    ownTabName: 'web',
    selectedTab: 'weburl',
    contentStates: {
      rssfeed: {},
      mediarss: {},
      youtube: {},
      stockquote: {},
      googledocs: {},
      radio: {},
      vimeo: {},
      weburl: {},
      report: {}
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'
    const tabs = [
      { name: 'weburl', icon: 'icon-location-globe', tooltip: 'Web' },
      { name: 'rssfeed', icon: 'icon-share-rss-feed', tooltip: 'RSS feed' },
      {
        name: 'mediarss',
        icon: 'icon-share-rss-feed-box',
        tooltip: 'Media RSS'
      },
      { name: 'youtube', icon: 'icon-programming-video', tooltip: 'YouTube' },
      { name: 'vimeo', icon: 'icon-film-roll', tooltip: 'Vimeo' },
      {
        name: 'stockquote',
        icon: 'icon-business-graph-line-2',
        tooltip: 'Stock Quote'
      },
      {
        name: 'googledocs',
        icon: 'icon-folder-document',
        tooltip: 'Google Docs'
      },
      { name: 'radio', icon: 'icon-radio-1', tooltip: 'Radio' },
      {
        name: 'microsoftpowerbi',
        icon: 'icon-content-newspaper-2',
        tooltip: 'Microsoft Power BI'
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
    const { selectedTab } = this.state

    switch (selectedTab) {
      case 'weburl':
        return Webpage
      case 'rssfeed':
        return RSS
      case 'mediarss':
        return MediaRSS
      case 'youtube':
        return Youtube
      case 'vimeo':
        return Vimeo
      case 'stockquote':
        return StockQuote
      case 'googledocs':
        return Google
      case 'radio':
        return Radio
      case 'microsoftpowerbi':
        return MicrosoftPowerBi
      default:
        return Webpage
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
      <div className={classes.tabWrap}>
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
)(AddMediaWebTab)
