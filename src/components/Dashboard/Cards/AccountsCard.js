import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles, Grid, Typography } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'
import { Card } from '../../Card'
import { SingleHorizontalBarChart } from '../../Charts'
import { minTwoDigits } from '../../../utils'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardWrapper: {
      width: 330,
      marginBottom: '20px'
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

const AccountsCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({
    current: { active: 0, inactive: 0 },
    lastMonth: { active: 0, inactive: 0 }
  })
  const [period, setPeriod] = useState('current')

  useEffect(() => {
    if (info.response && info.response.client) {
      setData(info.response.client)
    }
  }, [info])

  const handleChange = (e, p) => {
    if (p) setPeriod(p)
  }

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        rootClassName={classNames(hoverClassName, {
          [draggingClassName]: !!dragging
        })}
        title={t('Dashboard Card Title Accounts')}
        menuItems={[{ label: t('Accounts Library dashboard action'), url: '' }]}
      >
        <SingleHorizontalBarChart
          width={270}
          height={32}
          chartData={[{ name: 'accounts', ...data[period] }]}
          fillColors={['#2087c2', '#dedede']}
        />
        <Grid
          container
          className={classes.devicesChartLabelsWrap}
          justify="space-between"
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
        <Grid container>
          <Grid item>
            <TabToggleButtonGroup
              value={period}
              exclusive
              onChange={handleChange}
            >
              <TabToggleButton value="current">{t('Current')}</TabToggleButton>
              <TabToggleButton value="lastMonth">
                {t('Last 30 days')}
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

AccountsCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(AccountsCard))
)
