import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core'
import { SingleIconTabs } from '../../../../../Tabs'
import { SunCity, CustomWidget } from '../../../../../Media/Custom'
import MediaComponent from '../MediaComponent'
import _get from 'lodash/get'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../../../actions/mediaActions'

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
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    }
  }
}
class AddMediaCustomTab extends MediaComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  COMPONENT_TABS = {
    suncity: SunCity,
    customwidget: CustomWidget
  }

  constructor(props) {
    super(props)

    this.state = {
      ownTabName: 'custom',
      selectedTab: 'suncity',
      contentStates: {
        suncity: {},
        profiles: {},
        workplaceposters: {},
        quotes: {},
        customwidget: {}
      }
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
)(AddMediaCustomTab)
