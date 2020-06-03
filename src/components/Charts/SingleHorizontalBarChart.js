import React, { useMemo, useRef } from 'react'
import { translate } from 'react-i18next'

import { withStyles } from '@material-ui/core'

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const styles = () => ({
  root: {
    position: 'relative',
    zIndex: 10,
    borderRadius: '15px'
  }
})

let chartCounter = 0

const SingleHorizontalBarChart = ({
  width,
  height,
  classes,
  chartData = [],
  fillColors = [],
  chartWrapClassName = '',
  roundedCorners = true
}) => {
  const chartId = useRef(chartCounter++)
  const fontFamily = useMemo(
    () =>
      [
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
      ].join(','),
    []
  )

  const displayClipPath = useMemo(() => {
    if (!roundedCorners) {
      return null
    }

    const yOffset = height / 10 + 4
    const clipPathHeight = Math.floor(height - 2 * yOffset)

    return (
      <clipPath id={`horizontal-bar-clip-${chartId.current}`}>
        <rect
          x="5"
          y={yOffset}
          width={width - 10}
          height={clipPathHeight}
          rx={clipPathHeight / 2}
        ></rect>
      </clipPath>
    )
  }, [width, height, roundedCorners])

  const barStyle = useMemo(
    () =>
      roundedCorners
        ? { clipPath: `url(#horizontal-bar-clip-${chartId.current})` }
        : undefined,
    [roundedCorners]
  )

  return (
    <div className={[classes.root, chartWrapClassName].join(' ')}>
      <BarChart
        width={width}
        height={height}
        data={chartData}
        layout="vertical"
        stackOffset="expand"
      >
        {displayClipPath}
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" hide />
        <Tooltip
          cursor={false}
          contentStyle={{
            fontSize: '14px',
            fontFamily
          }}
        />
        <Bar
          dataKey="active"
          stackId="a"
          fill={fillColors[0]}
          style={barStyle}
        />
        <Bar
          dataKey="inactive"
          stackId="a"
          fill={fillColors[1]}
          style={barStyle}
        />
      </BarChart>
    </div>
  )
}

export default translate('translations')(
  withStyles(styles)(SingleHorizontalBarChart)
)
