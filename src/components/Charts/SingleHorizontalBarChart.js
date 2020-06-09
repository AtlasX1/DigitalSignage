import React, { useMemo, useCallback } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'

import { Bar } from '@nivo/bar'
import { BasicTooltip } from '@nivo/tooltip'
import { capitalize } from 'utils'

const BarComponent = ({
  x,
  y,
  width,
  height,
  color,
  data,
  tooltip,
  showTooltip,
  hideTooltip,
  onMouseEnter,
  onMouseLeave
}) => {
  const handleTooltip = useCallback(e => showTooltip(tooltip(data), e), [
    showTooltip,
    tooltip,
    data
  ])
  const handleMouseEnter = useCallback(
    e => {
      onMouseEnter(data, e)
      showTooltip(tooltip(data), e)
    },
    [onMouseEnter, showTooltip, tooltip, data]
  )
  const handleMouseLeave = useCallback(
    e => {
      onMouseLeave(data, e)
      hideTooltip(e)
    },
    [onMouseLeave, hideTooltip, data]
  )

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleTooltip}
      onMouseLeave={handleMouseLeave}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        style={{ clipPath: `url(#horizontal-bar-clip)` }}
      />
    </g>
  )
}

const ClipPath = ({ width, height }) => {
  const clipPath = useMemo(() => {
    const borderRadius = height / 2
    return (
      <clipPath id={`horizontal-bar-clip`}>
        <rect
          width={width}
          height={height}
          rx={borderRadius}
          ry={borderRadius}
        ></rect>
      </clipPath>
    )
  }, [width, height])
  return clipPath
}

const styles = ({ typography }) => ({
  tooltip: {
    fontSize: 14,
    lineHeight: '28px',
    fontFamily: typography.fontFamily
  }
})

const SingleHorizontalBarChart = ({
  width,
  height,
  chartData = [],
  fillColors = [],
  tooltipColors = fillColors,
  chartWrapClassName = '',
  margin: {
    top: marginTop = 7,
    right: marginRight = 5,
    bottom: marginBottom = 7,
    left: marginLeft = 5
  } = {},
  classes
}) => {
  const tooltip = useCallback(
    ({ data, id }) => (
      <BasicTooltip
        id={id}
        renderContent={() => (
          <div className={classes.tooltip}>
            <div>{capitalize(data.name)}</div>
            <div style={{ color: tooltipColors[0] }}>
              Active: {data.active || 0}
            </div>
            <div style={{ color: tooltipColors[1] }}>
              Inactive: {data.inactive || 0}
            </div>
          </div>
        )}
      />
    ),
    [classes.tooltip, tooltipColors]
  )
  return (
    <div className={classNames(classes.root, chartWrapClassName)}>
      <Bar
        data={chartData}
        width={width}
        height={height}
        keys={['active', 'inactive']}
        indexBy="name"
        margin={{
          top: marginTop,
          right: marginRight,
          bottom: marginBottom,
          left: marginLeft
        }}
        layers={[ClipPath, 'bars']}
        padding={0}
        layout="horizontal"
        colors={chartData[0].active ? fillColors : [fillColors[1]]}
        axisBottom={null}
        axisLeft={null}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={10}
        labelSkipHeight={12}
        legends={[]}
        barComponent={BarComponent}
        tooltip={tooltip}
        animate={true}
      />
    </div>
  )
}
export default translate('translations')(
  withStyles(styles)(SingleHorizontalBarChart)
)
