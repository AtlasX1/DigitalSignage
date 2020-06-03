import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  CircularProgress,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'

import Card from '../Card'
import DeviceInfoRow from './DeviceInfoRow'
import {
  getDevicePreviewAction,
  clearGetDevicePreviewInfoAction
} from 'actions/deviceActions'
import { SingleHorizontalBarChart } from '../../Charts'
import { formatBytes } from '../../../utils'

const styles = ({ palette, type }) => ({
  cardRoot: {
    padding: 0,
    borderRadius: '7px',
    width: '100%'
  },
  moreInfoCardHeader: {
    padding: '0 20px',
    marginBottom: 0,
    borderBottom: `solid 1px ${palette[type].deviceCard.border}`,
    backgroundColor: palette[type].deviceCard.header.background,
    borderRadius: '8px 8px 0 0'
  },
  moreInfoCardHeaderText: {
    fontSize: '12px',
    lineHeight: '45px',
    color: palette[type].deviceCard.row.value
  },
  content: {
    padding: '20px'
  },
  screenshotWrap: {
    backgroundColor: '#3d3d3d'
  },
  screenshot: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
    zIndex: 11
  },
  noScreenshotText: {
    color: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    zIndex: 1
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative'
  },
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 236
  },
  capacity: {
    fontSize: '10px',
    color: '#535d73',
    textAlign: 'right'
  },
  colLeft: {
    paddingRight: 8
  },
  colRight: {
    paddingLeft: 8
  }
})

const DeviceMoreInfoCard = ({
  t,
  device,
  classes,
  previewReducer,
  getDevicePreviewAction,
  clearGetDevicePreviewInfoAction
}) => {
  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!previewReducer.response) {
      getDevicePreviewAction(device.id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (previewReducer.response) {
      setDetails(previewReducer.response)

      clearGetDevicePreviewInfoAction()
      setLoading(false)
    } else if (previewReducer.error) {
      clearGetDevicePreviewInfoAction()
    }
    // eslint-disable-next-line
  }, [previewReducer])

  return loading ? (
    <div className={classes.loaderWrapper}>
      <CircularProgress size={30} thickness={5} />
    </div>
  ) : (
    <Card
      icon={false}
      title={t('More Info')}
      rootClassName={classes.cardRoot}
      headerClasses={[classes.moreInfoCardHeader]}
      headerTextClasses={[classes.moreInfoCardHeaderText]}
    >
      <div className={classes.content}>
        <Grid container>
          <Grid item xs={6} className={classes.colLeft}>
            <div className={classes.screenshotWrap}>
              <Grid
                container
                className={classes.imageContainer}
                justify="center"
                alignItems="center"
              >
                <Typography className={classes.noScreenshotText}>
                  No Screenshot Available
                </Typography>

                {details.uri && (
                  <img
                    className={classes.screenshot}
                    src={details.uri}
                    alt=""
                  />
                )}
              </Grid>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.colRight}>
            <DeviceInfoRow title="RAM" customValueType>
              {device.ram && (
                <Grid item>
                  {!!device.ram && (
                    <SingleHorizontalBarChart
                      width={110}
                      height={16}
                      chartData={device.ram}
                      fillColors={['#b2df63', '#dedede']}
                    />
                  )}
                  <Typography className={classes.capacity}>
                    {t('RAM Capacity', {
                      freeSpace: formatBytes(
                        device.ram ? device.ram[0].freeSpace : 0,
                        0
                      ),
                      totalSpace: formatBytes(
                        device.ram ? device.ram[0].totalSpace : 0,
                        0
                      )
                    })}
                  </Typography>
                </Grid>
              )}
            </DeviceInfoRow>
            <DeviceInfoRow title="Device Hard Disk" customValueType>
              {device.hardwareDetails && (
                <Grid item>
                  {!!device.deviceHardDisk && (
                    <SingleHorizontalBarChart
                      width={110}
                      height={16}
                      chartData={device.deviceHardDisk}
                      fillColors={['#b2df63', '#dedede']}
                    />
                  )}
                  <Typography className={classes.capacity}>
                    {t('Hard Disk Capacity', {
                      freeSpace: formatBytes(
                        device.deviceHardDisk
                          ? device.deviceHardDisk[0].freeSpace
                          : 0,
                        0
                      ),
                      totalSpace: formatBytes(
                        device.deviceHardDisk
                          ? device.deviceHardDisk[0].totalSpace
                          : 0,
                        0
                      )
                    })}
                  </Typography>
                </Grid>
              )}
            </DeviceInfoRow>
            <DeviceInfoRow title="Processors">{device.cpu}</DeviceInfoRow>
            <DeviceInfoRow title="OS Version">{device.os}</DeviceInfoRow>
          </Grid>
          <Grid item xs={6} className={classes.colLeft}>
            <DeviceInfoRow title="Device Name">{device.name}</DeviceInfoRow>
            <DeviceInfoRow title="Device LAN IP">{device.lanIP}</DeviceInfoRow>
            <DeviceInfoRow title="Device WAN IP">{device.wanIP}</DeviceInfoRow>
            <DeviceInfoRow title="MAC address"></DeviceInfoRow>
          </Grid>
          <Grid item xs={6} className={classes.colRight}>
            <DeviceInfoRow title="Browser Version">
              {device.browser}
            </DeviceInfoRow>
            <DeviceInfoRow title="Description">
              {device.description}
            </DeviceInfoRow>
          </Grid>
        </Grid>
      </div>
    </Card>
  )
}

const mapStateToProps = ({ device }) => ({
  previewReducer: device.preview
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDevicePreviewAction,
      clearGetDevicePreviewInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(DeviceMoreInfoCard)
  )
)
