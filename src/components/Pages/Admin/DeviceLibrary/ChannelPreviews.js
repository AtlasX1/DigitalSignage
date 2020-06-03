import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { ChannelScreenPreviewsCard } from '../../../Card'

import { createChannelsDummyData, getUrlPrefix } from '../../../../utils'

const styles = theme => ({
  screenPreviewsWrap: {
    padding: '0 20px'
  },
  screenPreview: {
    padding: '0 10px 20px'
  }
})

class ChannelPreviews extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      channels: [
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        ),
        createChannelsDummyData(
          'Testing Channel 1',
          'Xhibit Clients',
          null,
          '18:00 CST, 31st Dec, 1969'
        )
      ]
    }
  }

  render() {
    const { t, classes } = this.props
    const { channels } = this.state

    return (
      <SideModal
        width="78%"
        title={t('Channel Previews')}
        closeLink={getUrlPrefix('device-library/grid')}
      >
        <Grid container className={classes.screenPreviewsWrap}>
          {channels.map((channel, index) => (
            <Grid
              item
              xs={4}
              key={`device-screen-preview-${index}`}
              className={classes.screenPreview}
            >
              <ChannelScreenPreviewsCard channel={channel} />
            </Grid>
          ))}
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(ChannelPreviews))
