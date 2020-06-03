import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { get as _get } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { translate } from 'react-i18next'
import { withStyles, Tooltip } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import {
  Upload,
  Text,
  Html,
  Qr,
  Chart,
  MS,
  Table
} from '../../../../../Media/General'
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
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    tabWrap: {
      height: '100%',
      flexWrap: 'nowrap'
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

class AddMediaGeneralTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    ownTabName: 'general',
    selectedTab: 'file',
    isAutoClosing: false,
    contentStates: {
      qrcode: {},
      file: {},
      text: {},
      htmlcode: {},
      analytics: {},
      msoffice: {},
      tables: {}
    }
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'
    const tabs = [
      { name: 'file', icon: 'icon-folders', tooltip: 'File' },
      { name: 'text', icon: 'icon-all-caps', tooltip: 'Text' },
      { name: 'htmlcode', icon: 'icon-angle-brackets', tooltip: 'Html Code' },
      { name: 'qrcode', icon: 'icon-qr-code-1', tooltip: 'QR Code' },
      {
        name: 'analytics',
        icon: 'icon-business-graph-bar-status',
        tooltip: 'Analytics'
      },
      {
        name: 'msoffice',
        icon: 'icon-file-office-document',
        tooltip: 'MS Office'
      },
      { name: 'tables', icon: 'icon-grid', tooltip: 'Tables' }
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
      case 'file':
        return Upload
      case 'text':
        return Text
      case 'htmlcode':
        return Html
      case 'qrcode':
        return Qr
      case 'analytics':
        return Chart
      case 'msoffice':
        return MS
      case 'tables':
        return Table
      default:
        return Upload
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
    const { mode: mediaModeParam, currentTab: currentTabParam } = match.params

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
          className={classes.content}
          mode={mediaModeParam}
          customClasses={classes}
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
)(AddMediaGeneralTab)
