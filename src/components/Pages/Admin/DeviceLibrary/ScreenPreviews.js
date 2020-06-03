import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import DeviceScreenPreviewsCard from '../../../Card/DeviceScreenPreviewsCard'

import {
  createDeviceScreenPreviewDummyData,
  getUrlPrefix
} from '../../../../utils'

const styles = theme => ({
  screenPreviewsWrap: {
    padding: '0 20px'
  },
  screenPreview: {
    padding: '0 10px 20px'
  }
})

class ScreenPreviews extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      devices: [
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        }),
        createDeviceScreenPreviewDummyData('Device 2 in Germony', {
          lastUpdated: '18:00 CST, 31st Dec, 1969'
        })
      ]
    }
  }

  render() {
    const { t, classes } = this.props
    const { devices } = this.state

    return (
      <SideModal
        width="78%"
        title={t('Screen Previews')}
        closeLink={getUrlPrefix('device-library/grid')}
      >
        <Grid container className={classes.screenPreviewsWrap}>
          {devices.map((device, index) => (
            <Grid
              item
              xs={4}
              key={`device-screen-preview-${index}`}
              className={classes.screenPreview}
            >
              <DeviceScreenPreviewsCard device={device} />
            </Grid>
          ))}
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(ScreenPreviews))
