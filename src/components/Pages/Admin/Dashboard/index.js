import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import {
  getDashboardInfoAction,
  putDashboardInfoAction
} from '../../../../actions/dashboardActions'
import SchedulesCard from '../../../Dashboard/Cards/SchedulesCard'
import AdminStorageCard from '../../../Dashboard/Cards/AdminStorageCard'
import PlaylistCard from '../../../Dashboard/Cards/PlaylistCard'
import { DashboardLoader } from '../../../Loaders'
import Dashboard from '../../../Dashboard'
import AccountsCard from '../../../Dashboard/Cards/AccountsCard'
import UsersCard from '../../../Dashboard/Cards/UsersCard'
import AdminDevicesCard from '../../../Dashboard/Cards/AdminDevicesCard'
import AdminMediaUsageCard from '../../../Dashboard/Cards/AdminMediaUsageCard'
import ClientsByWidgetsCard from '../../../Dashboard/Cards/ClientsByWidgetsCard'

const cardsMap = {
  storage: AdminStorageCard,
  schedules: SchedulesCard,
  playlists: PlaylistCard,
  accounts: AccountsCard,
  users: UsersCard,
  devices: AdminDevicesCard,
  media_usage: AdminMediaUsageCard,
  widget_stats: ClientsByWidgetsCard
}

const defaultCardsPositions = [
  {
    name: 'storage',
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
    name: 'accounts',
    x: 0,
    y: 3
  },
  {
    name: 'users',
    x: 0,
    y: 4
  },
  {
    name: 'devices',
    x: 1,
    y: 0
  },
  {
    name: 'media_usage',
    x: 1,
    y: 1
  },
  {
    name: 'widget_stats',
    x: 2,
    y: 0
  }
]

class AdminDashboard extends Component {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { info } = this.props
    if (prevProps.info !== info && info.response) {
      const dashboardBlocks = info.response.dashboardBlocks
      const cardsPositions =
        dashboardBlocks.length === 1 ? defaultCardsPositions : dashboardBlocks
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
  connect(mapStateToProps, mapDispatchToProps)(AdminDashboard)
)
