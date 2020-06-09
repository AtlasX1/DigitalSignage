import React, { useMemo, useCallback } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { withStyles } from '@material-ui/core'
import { capitalize } from 'utils'

const COLORS = ['#d0021b', '#f5a623', '#7ed321', '#4a90e2', '#9013fe']

const styles = ({ typography }) => ({
  root: {
    height: 300
  },
  tooltip: {
    fontSize: 14,
    lineHeight: '28px',
    fontFamily: typography.fontFamily
  }
})

const MediaBarChart = ({ chartData, classes, theme }) => {
  const chartTheme = useMemo(
    () => ({
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      axis: {
        ticks: {
          line: { fill: '#74809A' },
          text: { fill: '#74809A' }
        }
      },
      grid: {
        line: { stroke: '#74809A', strokeDasharray: '1 5' }
      }
    }),
    [theme.typography.fontFamily]
  )
  const tooltip = useCallback(
    ({ data }) => (
      <div className={classes.tooltip}>
        <div>{capitalize(data.name)}</div>
        <div>Value: {data.displayValue}</div>
      </div>
    ),
    [classes.tooltip]
  )
  return (
    <div className={classes.root}>
      <ResponsiveBar
        margin={{
          left: 80,
          bottom: 32
        }}
        data={chartData}
        indexBy="name"
        colorBy="index"
        colors={COLORS}
        enableLabel={false}
        borderRadius={3}
        padding={0.9}
        theme={chartTheme}
        gridYValues={3}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'name',
          legendPosition: 'middle',
          legendOffset: 100
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 4,
          legend: 'value',
          legendPosition: 'middle',
          legendOffset: -100
        }}
        tooltip={tooltip}
      />
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(MediaBarChart)
