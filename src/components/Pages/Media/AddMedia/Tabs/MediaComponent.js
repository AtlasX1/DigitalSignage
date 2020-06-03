import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { SingleIconTab } from '../../../../Tabs'
import { withStyles, Tooltip, CircularProgress } from '@material-ui/core'
import _get from 'lodash/get'

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

const LoadingTabStyles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem'
  }
})

const LoadingTab = withStyles(LoadingTabStyles)(({ classes }) => (
  <div className={classes.root}>
    <CircularProgress />
  </div>
))

class MediaComponent extends Component {
  getCurrentUrlBySelectedTab = () => {
    const { selectedTab, ownTabName } = this.state
    const { mode: mediaModeParam, id: mediaId } = this.props.match.params
    return mediaId
      ? `/media-library/media/${mediaModeParam}/${ownTabName}/${selectedTab}/${mediaId}`
      : `/media-library/media/${mediaModeParam}/${ownTabName}/${selectedTab}`
  }

  setModalClose = () => {
    const { history } = this.props
    history && history.push('/media-library')
  }

  showSnackbar = title => {
    const { enqueueSnackbar, closeSnackbar, t } = this.props
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  getFeatures = () => {
    const { ownTabName } = this.state
    const currentTab = _get(
      this.props.configMediaCategory,
      'response',
      []
    ).find(tab => tab.name.toLowerCase() === ownTabName)
    return currentTab ? currentTab.feature : []
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'

    return this.getFeatures().map(({ id, name, icon, alias }) => {
      return (
        <SingleIconTab
          key={id}
          disabled={isEditMode && selectedTab !== name}
          icon={<TabIcon iconClassName={icon} tooltip={alias} />}
          disableRipple={true}
          value={name.toLowerCase()}
        />
      )
    })
  }

  getSelectedTabContent = () => {
    const { selectedTab } = this.state
    const isTabAllowed = this.getFeatures().some(
      tab => tab.name.toLowerCase() === selectedTab
    )

    if (!isTabAllowed || !this.COMPONENT_TABS) {
      return LoadingTab
    }
    return (
      this.COMPONENT_TABS[selectedTab] ||
      this.COMPONENT_TABS[Object.keys(this.COMPONENT_TABS)[0]]
    )
  }

  handleTabChange = (event, newTab) => {
    const { getContentTabState } = this
    const { selectedTab, contentStates } = this.state

    if (getContentTabState) {
      const currentContentTabState =
        this.getContentTabState && this.getContentTabState()

      this.setState({
        selectedTab: newTab,
        contentStates: {
          ...contentStates,
          [selectedTab]: currentContentTabState
        }
      })
    } else {
      this.setState({
        selectedTab: newTab
      })
    }
  }

  handleShareStateCallback = f => (this.getContentTabState = f)

  handleEditResponse = () => {
    const { mediaItem, t } = this.props
    const { error, status } = mediaItem
    if (status === 'successfully') {
      this.showSnackbar(t('Successfully changed'))
      this.props.clearMediaItemStatus()
    }
    if (status === 'error' && error) {
      this.showSnackbar(error.message || t('Error'))
      this.props.clearMediaItemStatus()
    }
  }

  _componentWillUnmount() {
    this.props.clearEditMedia()
  }

  _componentDidUpdate(prevProps) {
    if (prevProps.mediaItem !== this.props.mediaItem) {
      this.handleEditResponse()
    }
  }

  _componentDidMount() {
    const { selectedTab } = this.state
    const { getMediaItemById, match } = this.props
    const { currentTab, id: mediaId, mode: mediaMode } = match.params

    if (currentTab && currentTab !== selectedTab) {
      this.setState({ selectedTab: currentTab })
    }

    if (mediaMode === 'edit' && mediaId) {
      getMediaItemById(mediaId)
    }
  }
}

export default MediaComponent
