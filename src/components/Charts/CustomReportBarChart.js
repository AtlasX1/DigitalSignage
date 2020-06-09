import React, { useMemo, useCallback, useEffect, useState } from 'react'

import { Bar } from '@nivo/bar'
import { withTheme } from '@material-ui/core'
import { capitalize } from 'utils'

const COLORS = ['#d0021b', '#f5a623', '#7ed321', '#4a90e2', '#9013fe']

const CustomReportBarChart = ({
  chartData = [],
  theme,
  layout,
  barPadding = 0.075
}) => {
  const [initialRender, setInitialRender] = useState(true)

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
      tooltip: {
        container: {
          fontFamily: theme.typography.fontFamily,
          fontSize: 12
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
      <>
        <div>{capitalize(data.name)}</div>
        <div>Value: {data.value || 0}</div>
      </>
    ),
    []
  )

  useEffect(() => {
    setInitialRender(false)
  }, [])

  return (
    <Bar
      data={initialRender ? [] : chartData}
      height={218}
      width={536}
      borderRadius={3}
      indexBy="name"
      colorBy="index"
      margin={{
        left: 80,
        top: 10,
        right: 10,
        bottom: 44
      }}
      padding={1 - chartData.length * barPadding}
      layout={layout}
      colors={COLORS}
      theme={chartTheme}
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
      enableGridX={layout === 'horizontal'}
      enableLabel={false}
      labelSkipWidth={10}
      labelSkipHeight={12}
      legends={[]}
      tooltip={tooltip}
      animate={true}
    />
  )
}
export default withTheme()(CustomReportBarChart)
