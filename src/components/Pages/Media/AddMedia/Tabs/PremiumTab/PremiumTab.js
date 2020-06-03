import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
import { Redirect } from 'react-router-dom'
import { SingleIconTabs } from 'components/Tabs'
import MediaComponent from '../MediaComponent'
import _get from 'lodash/get'
import {
  AlertSystem,
  VideoInput,
  CourtDockets,
  BoxOffice,
  CurrencyExchange
} from 'components/Media/Premium'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from 'actions/mediaActions'

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
    }
  }
}

class AddMediaPremiumTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  COMPONENT_TABS = {
    videoinput: VideoInput,
    alertsystem: AlertSystem,
    dockets: CourtDockets,
    boxoffice: BoxOffice,
    currencyexchange: CurrencyExchange
  }

  constructor(props) {
    super(props)

    this.state = {
      ownTabName: 'premium',
      selectedTab: 'videoinput',
      contentStates: {
        alertsystem: {},
        videoInput: {},
        dockets: {},
        boxoffice: {},
        currencyexchange: {}
      }
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
    const { classes, match, mediaItem } = this.props
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

const mapStateToProps = ({ media, config }) => ({
  mediaItem: media.mediaItem,
  configMediaCategory: config.configMediaCategory
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
)(AddMediaPremiumTab)
