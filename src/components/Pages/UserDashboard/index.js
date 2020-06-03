import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TemplatesCard from '../../Dashboard/Cards/TemplatesCard'
import SchedulesCard from '../../Dashboard/Cards/SchedulesCard'
import PlaylistCard from '../../Dashboard/Cards/PlaylistCard'
import BandwidthCard from '../../Dashboard/Cards/BandwidthCard'
import DevicesCard from '../../Dashboard/Cards/DevicesCard'
import StorageCard from '../../Dashboard/Cards/StorageCard'
import MediaUsageCard from '../../Dashboard/Cards/MediaUsageCard'
import LocationCard from '../../Dashboard/Cards/LocationCard'
import SupportCard from '../../Dashboard/Cards/SupportCard'
import NewsCard from '../../Dashboard/Cards/NewsCard'
import WeatherCard from '../../Dashboard/Cards/WeatherCard'
import DevicePreviewCard from '../../Dashboard/Cards/DevicePreviewCard'
import { DashboardLoader } from '../../Loaders'
import {
  getDashboardInfoAction,
  putDashboardInfoAction
} from '../../../actions/dashboardActions'
import Dashboard from '../../Dashboard'

const cardsMap = {
  templates: TemplatesCard,
  schedules: SchedulesCard,
  playlists: PlaylistCard,
  bandwidth: BandwidthCard,
  devices: DevicesCard,
  storage: StorageCard,
  media_usage: MediaUsageCard,
  locations: LocationCard,
  support: SupportCard,
  news: NewsCard,
  weather: WeatherCard,
  device_preview: DevicePreviewCard
}

const defaultCardsPositions = [
  {
    name: 'templates',
    x: 0,
    y: 0
  },
  {
    name: 'schedules',
    x: 0,
    y: 1
  },
  {
    name: 'playlists',
    x: 0,
    y: 2
  },
  {
    name: 'bandwidth',
    x: 0,
    y: 3
  },
  {
    name: 'devices',
    x: 0,
    y: 4
  },
  {
    name: 'storage',
    x: 1,
    y: 0
  },
  {
    name: 'media_usage',
    x: 1,
    y: 1
  },
  {
    name: 'locations',
    x: 1,
    y: 2
  },
  {
    name: 'device_preview',
    x: 2,
    y: 0
  },
  {
    name: 'weather',
    x: 2,
    y: 1
  },
  {
    name: 'support',
    x: 2,
    y: 2
  },
  {
    name: 'news',
    x: 2,
    y: 3
  }
]

class UserDashboard extends Component {
  static propTypes = {
    getDashboardInfoAction: PropTypes.func,
    putDashboardInfoAction: PropTypes.func,
    info: PropTypes.object,
    t: PropTypes.func.isRequired
  }

  state = {
    loading: true,
    cardsPositions: []
  }

  componentDidMount() {
    const { getDashboardInfoAction } = this.props
    getDashboardInfoAction()
  }

  componentDidUpdate(prevProps) {
    const { info } = this.props
    if (prevProps.info !== info && info.response) {
      const dashboardBlocks = info.response.dashboardBlocks
      const cardsPositions =
        dashboardBlocks.length < defaultCardsPositions.length
          ? defaultCardsPositions
          : dashboardBlocks
      this.setState({ loading: false, cardsPositions })
    }
  }

  handleUpdateColumns = cardsPositions => {
    const { putDashboardInfoAction } = this.props
    putDashboardInfoAction({ dashboardBlocks: cardsPositions })
    this.setState({ cardsPositions })
  }

  render() {
    const { info } = this.props
    const { loading, cardsPositions } = this.state

    return loading ? (
      <DashboardLoader />
    ) : (
      <Dashboard
        cards={cardsMap}
        positions={cardsPositions}
        onUpdateColumns={this.handleUpdateColumns}
        info={info.response}
      />
    )
  }
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDashboardInfoAction,
      putDashboardInfoAction
    },
    dispatch
  )

export default translate('translations')(
  connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
)
