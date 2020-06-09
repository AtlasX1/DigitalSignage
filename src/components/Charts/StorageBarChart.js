import React, { useMemo, useCallback } from 'react'

import { ResponsiveBar } from '@nivo/bar'
import { withStyles } from '@material-ui/core'
import { useTheme } from '@nivo/core'
import { capitalize } from 'utils'

const COLORS = ['#d0021b', '#f5a623', '#7ed321', '#4a90e2', '#9013fe']

const CustomTick = tick => {
  const theme = useTheme()

  const { value, barValue } = tick.format(tick.value)
  return (
    <g transform={`translate(${tick.x},${tick.y + 22})`}>
      <line style={{ ...theme.axis.ticks.line }} y1={-22} y2={-12} />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          ...theme.axis.ticks.text
        }}
      >
        {value}
      </text>
      {barValue != null && (
        <text
          y={-30}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            ...theme.axis.ticks.text
          }}
        >
          {barValue}
        </text>
      )}
    </g>
  )
}

const styles = ({ typography, type }) => ({
  root: {
    height: 140
  },
  tooltip: {
    ...typography.lightText[type],
    fontFamily: typography.fontFamily
  }
})

const StorageBarChart = ({ chartData, barWidth = 0.058, classes, theme }) => {
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
          bottom: 44
        }}
        data={chartData}
        indexBy="name"
        colorBy="index"
        colors={COLORS}
        enableLabel={false}
        padding={1 - chartData.length * barWidth}
        theme={chartTheme}
        borderRadius={3}
        gridYValues={4}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'name',
          legendPosition: 'middle',
          legendOffset: 100,
          renderTick: CustomTick,
          format: value => {
            const data = chartData.find(({ name }) => name === value)
            const maxValue = chartData.reduce(
              (max, data) => Math.max(data.value, max),
              0
            )
            return {
              value,
              barValue: data.value / maxValue < 0.01 ? data.displayValue : null
            }
          }
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

export default withStyles(styles, { withTheme: true })(StorageBarChart)
