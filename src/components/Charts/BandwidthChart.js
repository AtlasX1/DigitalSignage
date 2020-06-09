import React, { useMemo, memo } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'
import AnimatedPie from './AnimatedPie'

const COLORS = ['#0076b9', '#63B4E3']

const styles = ({ palette, type, typography }) => ({
  root: {
    position: 'relative',
    '& svg': {
      marginBottom: -115
    }
  },
  labels: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  count: {
    ...typography.lightAccent[type],
    bottom: '15px',
    fontSize: '1.125rem'
  },
  countLabel: {
    ...typography.lightText[type],
    bottom: 0,
    fontSize: '0.75rem'
  }
})

const BandwidthChart = ({ chartData, t, classes, theme }) => {
  const data = useMemo(
    () =>
      chartData && Object.values(chartData.data).length > 0 ? chartData : null,
    [chartData]
  )
  const chartTheme = useMemo(
    () => ({
      tooltip: {
        container: {
          fontFamily: theme.typography.fontFamily,
          fontSize: 12
        }
      }
    }),
    [theme.typography.fontFamily]
  )

  return (
    <div className={classes.root}>
      <AnimatedPie
        width={230}
        height={230}
        data={data ? data.data : []}
        startAngle={-90}
        endAngle={90}
        margin={{ top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 }}
        innerRadius={0.75}
        padAngle={1}
        colors={COLORS}
        theme={chartTheme}
        enableRadialLabels={false}
        enableSlicesLabels={false}
      />
      <Typography className={`${classes.labels} ${classes.count}`}>
        {data && data.remaining}
      </Typography>
      <Typography className={`${classes.labels} ${classes.countLabel}`}>
        {t('Remaining')}
      </Typography>
    </div>
  )
}

export default translate('translations')(
  withStyles(styles, { withTheme: true })(memo(BandwidthChart))
)
