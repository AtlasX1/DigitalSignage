import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'
import { Card } from '../../Card'
import { TwoPieChart } from '../../Charts'

import { minTwoDigits } from '../../../utils'
import classNames from 'classnames'
import FormControlSelect from '../../Form/FormControlSelect'

const styles = theme => {
  return {
    cardWrapper: {
      marginBottom: '20px',
      width: '100%'
    },
    devicesTab: {
      marginTop: '25px'
    },
    devicesTwoPieChartWrap: {
      paddingRight: '35px',
      marginRight: '35px',
      borderRight: '1px solid #e4e9f3'
    },
    devicesPieChartLabel: {
      marginTop: '10px',
      marginBottom: '30px',
      fontWeight: 'bold',
      color: '#888996',
      textAlign: 'center'
    },
    devicesFeatureInputsWrap: {
      paddingTop: '25px'
    },
    inActiveDevicesWrap: {
      marginTop: '10px',
      textAlign: 'right'
    },
    inActiveDevices: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2087c2'
    },
    inActiveDevicesLabel: {
      fontWeight: 'bold',
      color: '#888996'
    },
    coloredBox: {
      width: '125px',
      padding: '10px 0 15px',
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: '6px'
    },
    coloredBoxActiveOrange: {
      backgroundImage: 'linear-gradient(to bottom, #f29813, #ffb546)'
    },
    coloredBoxActiveBlue: {
      backgroundImage: 'linear-gradient(to bottom, #2981b8, #4e9ed1)'
    },
    coloredBoxActivePurple: {
      backgroundImage: 'linear-gradient(to bottom, #af7cc3, #c890de)'
    },
    coloredBoxInactive: {
      backgroundImage: 'linear-gradient(to bottom, #b7bdcb, #74809a)'
    },
    cardBoxesLabel: {
      fontWeight: 'bold',
      color: '#fff'
    },
    cardCount: {
      fontSize: '36px'
    },
    cardLabel: {
      fontSize: '13px',
      textTransform: 'uppercase'
    }
  }
}

const AdminDevicesCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({
    current: { active: 0, inactive: 0 },
    lastHour: { active: 0, inactive: 0 },
    lastMonth: { active: 0, inactive: 0 },
    byFirmware: { older_fw: 0, last_fw: 0 },
    byType: {}
  })
  const [period, setPeriod] = useState('current')
  const [devicesStatus, setDevicesStatus] = useState('active')

  const [typeOptions, setTypeOptions] = useState([])
  const [valueByType, setValueByType] = useState(0)
  const [deviceCount, setDeviceCount] = useState({ active: 0, inactive: 0 })
  const [pieChartOptions, setPieChartOptions] = useState({
    active: [],
    inactive: []
  })

  const transformTypesToOptions = useCallback(items => {
    return items.map(({ name: label, id: value }) => ({ label, value }))
  }, [])

  const transformTypesToPieChartOptions = useCallback(items => {
    const active = items.map(({ name, total }) => ({
      id: `${name} active`,
      label: `${name} active`,
      value: total.active
    }))
    const inactive = items.map(({ name, total }) => ({
      id: `${name} inactive`,
      label: `${name} inactive`,
      value: total.inactive
    }))
    return { active, inactive }
  }, [])

  useEffect(() => {
    if (info.response && info.response.device) {
      const devices = info.response.device
      const byTypeMap = devices.byType.reduce(
        (accum, item) => ({ ...accum, [item.id]: item }),
        {}
      )
      const transformedOptions = transformTypesToOptions(devices.byType)
      const defaultValue = transformedOptions[0].value
      const transformedPieChartOptions = transformTypesToPieChartOptions(
        devices.byType
      )

      setData({
        ...devices,
        byType: byTypeMap
      })
      setTypeOptions(transformedOptions)
      setValueByType(defaultValue)
      setDeviceCount(byTypeMap[defaultValue].total)
      setPieChartOptions(transformedPieChartOptions)
    }
  }, [info, transformTypesToOptions, transformTypesToPieChartOptions])

  const handlePeriodChange = useCallback((e, p) => {
    if (p) setPeriod(p)
  }, [])

  const handleTypeChange = useCallback(
    ({ currentTarget: { value } }) => {
      setValueByType(value)
      setDeviceCount(data.byType[value].total)
    },
    [data]
  )

  const onStatusChange = useCallback(({ currentTarget: { value } }) => {
    setDevicesStatus(value)
  }, [])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        rootClassName={classNames(hoverClassName, {
          [draggingClassName]: !!dragging
        })}
        title={t('Dashboard Card Title Devices')}
        menuItems={[{ label: t('Contact Us dashboard action'), url: '' }]}
      >
        <Grid container direction="column">
          <Grid item>
            <Grid container justify="space-between">
              <Grid item className={classes.devicesTwoPieChartWrap}>
                <TwoPieChart
                  chartData={[pieChartOptions.active, pieChartOptions.inactive]}
                  fillColors={['#2087c2', '#0076b9', '#b7bdcb']}
                />
                <Typography className={classes.devicesPieChartLabel}>
                  {t('Dashboard Chart Label Devices')}
                </Typography>
              </Grid>
              <Grid item className={classes.devicesTwoPieChartWrap}>
                <TwoPieChart
                  chartData={[
                    [
                      {
                        id: 'Older Fw',
                        label: 'Older Fw',
                        value: data.byFirmware.older_fw
                      },
                      {
                        id: 'Last Fw',
                        label: 'Last Fw',
                        value: data.byFirmware.last_fw
                      }
                    ],
                    [
                      {
                        id: 'Older Fw',
                        label: 'Older Fw',
                        value: data.byFirmware.older_fw
                      },
                      {
                        id: 'Last Fw',
                        label: 'Last Fw',
                        value: data.byFirmware.last_fw
                      }
                    ]
                  ]}
                  fillColors={['#f29813', '#0076b9', '#3ca1db', '#ffb546']}
                />
                <Typography className={classes.devicesPieChartLabel}>
                  {t('Dashboard Card Title Firmware Devices')}
                </Typography>
              </Grid>
              <Grid item xs>
                <Grid container justify="space-between">
                  <Grid
                    item
                    className={`${classes.coloredBox} ${classes.coloredBoxActiveOrange}`}
                  >
                    <Typography
                      className={`${classes.cardBoxesLabel} ${classes.cardCount}`}
                    >
                      {minTwoDigits(data[period].active)}
                    </Typography>
                    <Typography
                      className={`${classes.cardBoxesLabel} ${classes.cardLabel}`}
                    >
                      {t('Active')}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    className={`${classes.coloredBox} ${classes.coloredBoxInactive}`}
                  >
                    <Typography
                      className={`${classes.cardBoxesLabel} ${classes.cardCount}`}
                    >
                      {minTwoDigits(data[period].inactive)}
                    </Typography>
                    <Typography
                      className={`${classes.cardBoxesLabel} ${classes.cardLabel}`}
                    >
                      {t('Inactive')}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  className={classes.devicesFeatureInputsWrap}
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="stretch"
                >
                  <Grid item>
                    <FormControlSelect
                      fullWidth={true}
                      label={t('Feature')}
                      value={valueByType}
                      options={typeOptions}
                      handleChange={handleTypeChange}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlSelect
                      fullWidth={true}
                      label={t('Status')}
                      value={devicesStatus}
                      options={[
                        { label: t('Active'), value: 'active' },
                        { label: t('Inactive'), value: 'inactive' }
                      ]}
                      handleChange={onStatusChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container justify="space-between">
              <Grid item className={classes.devicesTab}>
                <TabToggleButtonGroup
                  value={period}
                  exclusive
                  onChange={handlePeriodChange}
                >
                  <TabToggleButton value="current">
                    {t('Current')}
                  </TabToggleButton>
                  <TabToggleButton value="lastHour">
                    {t('Last hour')}
                  </TabToggleButton>
                  <TabToggleButton value="lastMonth">
                    {t('Last 30 days')}
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
              <Grid item>
                <Typography className={classes.inActiveDevicesWrap}>
                  <span className={classes.inActiveDevices}>
                    {deviceCount[devicesStatus]}
                  </span>{' '}
                  <span className={classes.inActiveDevicesLabel}>
                    {devicesStatus === 'active'
                      ? t('Active Devices')
                      : t('Inactive Devices')}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

AdminDevicesCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool,
  info: PropTypes.object
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps)(AdminDevicesCard))
)
