import React, { Component } from 'react'

import { Redirect } from 'react-router-dom'

import { get as _get } from 'lodash'

import {
  Button,
  withStyles,
  Tooltip,
  CircularProgress
} from '@material-ui/core'

import { SingleIconTab, SingleIconTabs } from 'components/Tabs'
import {
  AlertSystem,
  BoxOffice,
  CourtDockets,
  CurrencyExchange,
  VideoInput
} from 'components/Media/Premium'
import {
  Facebook,
  Pinterest,
  SocialWall,
  Twitter
} from 'components/Media/Social'
import {
  Google,
  MediaRSS,
  MicrosoftPowerBi,
  Radio,
  RSS,
  StockQuote,
  Vimeo,
  Webpage,
  Youtube
} from 'components/Media/Web'
import {
  Flickr,
  Picasa,
  Prezi,
  Profiles,
  Quotes,
  Smugmug,
  StockPhotos,
  WorkplacePosters
} from 'components/Media/Gallery'
import {
  Chart,
  Html,
  MS,
  Qr,
  Table,
  Text,
  Upload
} from 'components/Media/General'
import { ButtonApp } from 'components/Media/Kiosk'
import {
  Feeds,
  FlightInformation,
  LiveTransit
} from 'components/Media/Licensed'
import { CustomWidget, SunCity } from 'components/Media/Custom'
import {
  Clock,
  Date,
  Interest,
  ScheduleOfEvents,
  Timer,
  Traffic,
  Weather
} from 'components/Media/Local'
import { bindActionCreators, compose } from 'redux'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import {
  clearEditMedia,
  clearMediaItemStatus,
  getMediaItemById
} from '../../../../actions/mediaActions'
import PropTypes from 'prop-types'

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

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    loaderWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: '0',
      left: '0',
      backgroundColor: 'rgba(255,255,255,.5)',
      zIndex: 25
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

const exceptions = ['SignageCreator']

class MediaComponent extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  COMPONENT_TABS = {
    // Favorites

    // Custom
    suncity: SunCity,
    customwidget: CustomWidget,

    // Gallery
    stockphotos: StockPhotos,
    profiles: Profiles,
    workplaceposters: WorkplacePosters,
    quote: Quotes,
    flickr: Flickr,
    picasa: Picasa,
    prezi: Prezi,
    smugmug: Smugmug,

    // General
    file: Upload,
    text: Text,
    htmlcode: Html,
    qrcode: Qr,
    analytics: Chart,
    msoffice: MS,
    tables: Table,

    // Kiosk
    button: ButtonApp,

    // Licensed
    flightstats: FlightInformation,
    feeds: Feeds,
    livetransit: LiveTransit,

    // Local
    traffic: Traffic,
    events: ScheduleOfEvents,
    clock: Clock,
    date: Date,
    timer: Timer,
    pointofinterest: Interest,
    weather: Weather,

    // Premium
    videoinput: VideoInput,
    alertsystem: AlertSystem,
    dockets: CourtDockets,
    boxoffice: BoxOffice,
    currencyexchange: CurrencyExchange,

    // Social
    twitter: Twitter,
    pinterest: Pinterest,
    facebook: Facebook,
    socialwall: SocialWall,

    // Web
    weburl: Webpage,
    rssfeed: RSS,
    mediarss: MediaRSS,
    youtube: Youtube,
    vimeo: Vimeo,
    stockquote: StockQuote,
    googledocs: Google,
    radio: Radio,
    microsoftpowerbi: MicrosoftPowerBi
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedTab: 'file',

      contentStates: {
        // Favorites

        // Custom
        suncity: {},
        quotes: {},
        customwidget: {},

        // Gallery
        picasa: {},
        flickr: {},
        quote: {},
        stockphotos: {},
        workplaceposters: {},
        prezi: {},
        profiles: {},
        smugmug: {},

        // General
        qrcode: {},
        file: {},
        text: {},
        htmlcode: {},
        analytics: {},
        msoffice: {},
        tables: {},

        // Kiosk
        button: {},

        // Licensed
        flightstats: {},
        signagecreator: {},
        licensedchannels: {},
        feeds: {},
        livetransit: {},

        // Local
        traffic: {},
        events: {},
        clock: {},
        date: {},
        timer: {},
        pointofinterest: {},
        weather: {},

        // Premium
        alertsystem: {},
        videoInput: {},
        dockets: {},
        boxoffice: {},
        currencyexchange: {},

        // Social
        socialwall: {},
        twitter: {},
        pinterest: {},
        facebook: {},

        // Web
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
  }

  getCurrentUrlBySelectedTab = () => {
    const { selectedTab } = this.state
    const {
      mode: mediaModeParam,
      id: mediaId,
      ownTabName
    } = this.props.match.params
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
    const { ownTabName } = this.props.match.params
    const currentTab = _get(
      this.props.configMediaCategory,
      'response',
      []
    ).find(tab => tab.name.toLowerCase() === ownTabName)

    if (currentTab) {
      return currentTab.feature.filter(
        ({ name }) => !exceptions.some(ex => ex === name)
      )
    }

    return []
  }

  getHeaderTabs = () => {
    const { selectedTab } = this.state
    const { mode: mediaMode } = this.props.match.params
    const isEditMode = mediaMode === 'edit'

    return this.getFeatures().map(({ id, name, icon, alias }) => {
      return (
        <SingleIconTab
          key={id}
          disabled={
            (isEditMode && selectedTab !== name) || this.props.isPending
          }
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

  componentWillUnmount() {
    this.props.clearEditMedia()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mediaItem !== this.props.mediaItem) {
      this.handleEditResponse()
    }

    if (
      prevProps.match.params.ownTabName !== this.props.match.params.ownTabName
    ) {
      const tab = _get(this.getFeatures(), ['0', 'name'])
      this.setState({ selectedTab: tab ? tab.toLowerCase() : '' })
    }
  }

  componentDidMount() {
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

  render() {
    const { classes, mediaItem, match, isPending } = this.props
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

        {isPending && (
          <div className={classes.loaderWrapper}>
            <CircularProgress size={30} thickness={5} />
          </div>
        )}

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

const mapStateToProps = ({ media, config, appReducer }) => ({
  mediaItem: media.mediaItem,
  configMediaCategory: config.configMediaCategory,
  isPending: appReducer.isPending
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
)(MediaComponent)
