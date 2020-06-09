import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Line } from '@nivo/line'
import { BasicTooltip } from '@nivo/tooltip'
import { withTheme } from '@material-ui/core'
import { capitalize } from 'utils'
import _get from 'lodash/get'

const CustomReportLineChart = ({ chartData, theme, color = '#8884d8' }) => {
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

  useEffect(() => {
    setInitialRender(false)
  }, [])

  const tooltip = useCallback(props => {
    const point = _get(props, 'slice.points[0]', { data: {} })
    const id = _get(props, 'slice.id', 0)
    return (
      <BasicTooltip
        id={id}
        renderContent={() => (
          <>
            <div>{capitalize(point.data.xFormatted)}</div>
            <div style={{ color: point.borderColor }}>
              Value: {point.data.yFormatted}
            </div>
          </>
        )}
      />
    )
  }, [])

  return (
    <Line
      height={218}
      width={536}
      data={initialRender ? [] : [{ id: '', color, data: chartData }]}
      margin={{ top: 10, right: 10, bottom: 24, left: 64 }}
      theme={chartTheme}
      gridYValues={4}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickValues: 4
      }}
      colors={[color]}
      lineWidth={1}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={1}
      pointBorderColor={color}
      pointLabel="y"
      pointLabelYOffset={-24}
      areaOpacity={1}
      enableSlices="x"
      legends={[]}
      sliceTooltip={tooltip}
    />
  )
}

export default withTheme()(CustomReportLineChart)
