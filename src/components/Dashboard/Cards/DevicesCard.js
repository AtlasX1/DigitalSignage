import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'
import { Card } from '../../Card'
import { SingleHorizontalBarChart } from '../../Charts'

import { minTwoDigits, getUrlPrefix } from '../../../utils'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardWrapper: {
      width: 330,
      marginBottom: '20px'
    },
    cardTransparentBorder: {
      borderColor: 'transparent'
    },
    devicesChartLabelsWrap: {
      marginTop: '10px',
      marginBottom: '20px'
    },
    devicesChartLabel: {
      fontSize: '11px',
      color: '#888996',
      textTransform: 'uppercase'
    },
    devicesChartCount: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].charts.devices.countColor
    }
  }
}

const DevicesCard = ({
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
    lastMonth: { active: 0, inactive: 0 }
  })
  const [period, setPeriod] = useState('current')

  useEffect(() => {
    if (info.response && info.response.device) {
      setData(info.response.device)
    }
  }, [info])

  const handleChange = (e, p) => {
    if (p) setPeriod(p)
  }

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        title={t('Dashboard Card Title Devices')}
        menuItems={[
          {
            label: t('Devices Library dashboard action'),
            url: getUrlPrefix('device-library/list')
          }
        ]}
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
      >
        <SingleHorizontalBarChart
          width={270}
          height={32}
          chartData={[{ name: 'device', ...data[period] }]}
          fillColors={['#b2df63', '#dedede']}
        />
        <Grid
          container
          justify="space-between"
          className={classes.devicesChartLabelsWrap}
        >
          <Grid item>
            <Typography className={classes.devicesChartLabel}>
              {t('Active')}{' '}
              <span className={classes.devicesChartCount}>
                {minTwoDigits(data[period].active)}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.devicesChartLabel}>
              {t('Inactive')}{' '}
              <span className={classes.devicesChartCount}>
                {minTwoDigits(data[period].inactive)}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <TabToggleButtonGroup
            exclusive
            value={period}
            onChange={handleChange}
          >
            <TabToggleButton value="current">{t('Current')}</TabToggleButton>
            <TabToggleButton value="lastHour">{t('Last hour')}</TabToggleButton>
            <TabToggleButton value="lastMonth">
              {t('Last 30 days')}
            </TabToggleButton>
          </TabToggleButtonGroup>
        </Grid>
      </Card>
    </Grid>
  )
}

DevicesCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(DevicesCard))
)
