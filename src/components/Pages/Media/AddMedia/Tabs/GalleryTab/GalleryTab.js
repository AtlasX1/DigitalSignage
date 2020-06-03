import React from 'react'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'
import { withStyles, Tooltip } from '@material-ui/core'

import { SingleIconTabs, SingleIconTab } from 'components/Tabs'
import {
  StockPhotos,
  Profiles,
  WorkplacePosters,
  Quotes,
  Flickr,
  Picasa,
  Prezi,
  Smugmug
} from 'components/Media/Gallery'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from 'actions/mediaActions'
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

class AddMediaGalleryTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    ownTabName: 'gallery',
    selectedTab: 'picasa',
    contentStates: {
      picasa: {},
      flickr: {},
      quote: {},
      stockphotos: {},
      workplaceposters: {},
      prezi: {},
      profiles: {},
      smugmug: {}
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'
    const tabs = [
      { name: 'picasa', icon: 'icon-folder-image', tooltip: 'Picasa' },
      { name: 'flickr', icon: 'icon-cloud-image', tooltip: 'Flickr' },
      { name: 'quote', icon: 'icon-quote-closing', tooltip: 'Quote' },
      { name: 'stockphotos', icon: 'icon-camera-1', tooltip: 'Stockphotos' },
      {
        name: 'workplaceposters',
        icon: 'icon-wanted-poster',
        tooltip: 'Workplace Posters'
      },
      { name: 'prezi', icon: 'icon-business-whiteboard', tooltip: 'Prezi' },
      { name: 'profiles', icon: 'icon-picture-layer-3', tooltip: 'Profiles' },
      { name: 'smugmug', icon: 'icon-picture-layer-2', tooltip: 'SmugMug' }
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
      case 'stockphotos':
        return StockPhotos
      case 'profiles':
        return Profiles
      case 'workplaceposters':
        return WorkplacePosters
      case 'quote':
        return Quotes
      case 'flickr':
        return Flickr
      case 'picasa':
        return Picasa
      case 'prezi':
        return Prezi
      case 'smugmug':
        return Smugmug
      default:
        return StockPhotos
    }
  }

  componentWillUnmount() {
    this._componentWillUnmount()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
          mode={match.params.mode}
          selectedTab={selectedTab}
          formData={contentStates[selectedTab]}
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
)(AddMediaGalleryTab)
