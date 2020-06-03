import React from 'react'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import { bindActionCreators, compose } from 'redux'
import { withStyles, Tooltip } from '@material-ui/core'

import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import {
  SocialWall,
  Twitter,
  Pinterest,
  Facebook
} from '../../../../../Media/Social'
import MediaComponent from '../MediaComponent'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../../../actions/mediaActions'

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

class AddMediaSocialTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      ownTabName: 'social',
      selectedTab: 'socialwall',
      contentStates: {
        socialwall: {},
        twitter: {},
        pinterest: {},
        facebook: {}
      }
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'

    const tabs = [
      {
        name: 'socialwall',
        icon: 'icon-chat-bubble-circle-1',
        tooltip: 'Social Wall'
      },
      { name: 'twitter', icon: 'icon-origami-paper-bird', tooltip: 'Twitter' },
      { name: 'pinterest', icon: 'icon-pin-paper', tooltip: 'Pinterest' },
      { name: 'facebook', icon: 'icon-focus-face', tooltip: 'Facebook' }
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
      case 'twitter':
        return Twitter
      case 'pinterest':
        return Pinterest
      case 'facebook':
        return Facebook
      case 'socialwall':
      default:
        return SocialWall
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
)(AddMediaSocialTab)
