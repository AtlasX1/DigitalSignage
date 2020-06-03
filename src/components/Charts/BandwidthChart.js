import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#0076b9', '#63B4E3']

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      position: 'relative'
    },
    pieChartContainer: {
      position: 'relative',
      zIndex: 10
    },
    labels: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    count: {
      bottom: '15px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: palette[type].charts.bandwidth.titleColor
    },
    countLabel: {
      bottom: 0,
      fontSize: '10px',
      color: '#888996'
    }
  }
}

const BandwidthChart = ({ t, classes, chartData }) => {
  const [data, setData] = useState()

  const fontFamily = [
    '"Nunito Sans"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(',')

  useEffect(() => {
    if (chartData && Object.values(chartData.data).length > 0) {
      setData(chartData)
    }
  }, [chartData])

  return (
    <div className={classes.root}>
      <PieChart width={230} height={115} className={classes.pieChartContainer}>
        <Tooltip
          cursor={false}
          contentStyle={{
            fontSize: '14px',
            fontFamily
          }}
        />
        <Pie
          data={data && data.data}
          cx={110}
          cy={110}
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={110}
          paddingAngle={0}
          fill="#8884d8"
          dataKey="value"
        >
          {data &&
            data.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
      </PieChart>
      <Typography className={`${classes.labels} ${classes.count}`}>
        {data && data.remaining}
      </Typography>
      <Typography className={`${classes.labels} ${classes.countLabel}`}>
        {t('Remaining')}
      </Typography>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(BandwidthChart))
