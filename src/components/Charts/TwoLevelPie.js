import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import pure from 'recompose/pure'
import withPropsOnChange from 'recompose/withPropsOnChange'
import setDisplayName from 'recompose/setDisplayName'
import {
  withTheme,
  withDimensions,
  getLabelGenerator,
  Container,
  SvgWrapper,
  bindDefs
} from '@nivo/core'
import { getInheritedColorGenerator } from '@nivo/colors'
import { Pie, PieLayout } from '@nivo/pie'
import { BasicTooltip } from '@nivo/tooltip'

const PieSlice = ({
  data,

  path,
  color,
  fill,
  borderWidth,
  borderColor,

  showTooltip,
  hideTooltip,
  onClick,
  onMouseEnter,
  onMouseLeave,
  tooltipFormat,
  tooltip,

  theme
}) => {
  const handleTooltip = e =>
    showTooltip(
      <BasicTooltip
        id={data.label}
        value={data.value}
        enableChip={true}
        color={color}
        theme={theme}
        format={tooltipFormat}
        renderContent={
          typeof tooltip === 'function'
            ? tooltip.bind(null, { color, ...data })
            : null
        }
      />,
      e
    )
  const handleMouseEnter = e => {
    onMouseEnter(data, e)
    handleTooltip(e)
  }
  const handleMouseLeave = e => {
    onMouseLeave(data, e)
    hideTooltip(e)
  }

  return (
    <path
      key={data.id}
      d={path}
      fill={fill}
      strokeWidth={borderWidth}
      stroke={borderColor}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleTooltip}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    />
  )
}

PieSlice.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,

  path: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,

  tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  tooltip: PropTypes.func,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,

  theme: PropTypes.shape({
    tooltip: PropTypes.shape({}).isRequired
  }).isRequired
}

const PieSliceEnhanced = compose(
  withPropsOnChange(['data', 'onClick'], ({ data, onClick }) => ({
    onClick: event => onClick(data, event)
  })),
  pure
)(PieSlice)

const TwoLevelPie = ({
  innerPieProps = {},
  outerPieProps = {},
  data,
  sortByValue,

  startAngle,
  endAngle,
  padAngle,
  fit,
  innerRadius,
  cornerRadius,

  // dimensions
  margin,
  width,
  height,
  outerWidth,
  outerHeight,

  colors,
  colorBy,

  // border
  borderWidth,
  borderColor: _borderColor,

  // styling
  theme,
  defs,
  fill,

  // interactivity
  isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  tooltipFormat,
  tooltip
}) => {
  const borderColor = getInheritedColorGenerator(_borderColor, theme)

  return (
    <PieLayout
      width={width}
      height={height}
      data={data}
      sortByValue={sortByValue}
      startAngle={startAngle}
      endAngle={endAngle}
      fit={fit}
      padAngle={padAngle}
      innerRadius={innerRadius}
      cornerRadius={cornerRadius}
      colors={colors}
      colorBy={colorBy}
      {...innerPieProps}
    >
      {outer => (
        <PieLayout
          width={width}
          height={height}
          data={data}
          sortByValue={sortByValue}
          startAngle={startAngle}
          endAngle={endAngle}
          fit={fit}
          padAngle={padAngle}
          innerRadius={innerRadius}
          cornerRadius={cornerRadius}
          colors={colors}
          colorBy={colorBy}
          {...outerPieProps}
        >
          {inner => {
            const boundDefs = bindDefs(
              defs,
              [...inner.arcs, outer.arcs],
              fill,
              {
                dataKey: 'data'
              }
            )

            return (
              <Container
                isInteractive={isInteractive}
                theme={theme}
                animate={false}
              >
                {({ showTooltip, hideTooltip }) => (
                  <SvgWrapper
                    width={outerWidth}
                    height={outerHeight}
                    margin={margin}
                    defs={boundDefs}
                    theme={theme}
                  >
                    <g
                      transform={`translate(${inner.centerX},${inner.centerY})`}
                    >
                      {inner.arcs.map(arc => (
                        <PieSliceEnhanced
                          key={arc.data.id}
                          data={arc.data}
                          path={inner.arcGenerator(arc)}
                          color={arc.color}
                          fill={arc.fill ? arc.fill : arc.color}
                          borderWidth={borderWidth}
                          borderColor={borderColor(arc)}
                          showTooltip={showTooltip}
                          hideTooltip={hideTooltip}
                          tooltipFormat={tooltipFormat}
                          tooltip={tooltip}
                          onClick={onClick}
                          onMouseEnter={onMouseEnter}
                          onMouseLeave={onMouseLeave}
                          theme={theme}
                        />
                      ))}
                      <g
                        transform={
                          innerPieProps.outerRadius
                            ? `scale(${innerPieProps.outerRadius})`
                            : undefined
                        }
                      >
                        {outer.arcs.map(arc => (
                          <PieSliceEnhanced
                            key={arc.data.id}
                            data={arc.data}
                            path={outer.arcGenerator(arc)}
                            color={arc.color}
                            fill={arc.fill ? arc.fill : arc.color}
                            borderWidth={borderWidth}
                            borderColor={borderColor(arc)}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                            tooltipFormat={tooltipFormat}
                            tooltip={tooltip}
                            onClick={onClick}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            theme={theme}
                          />
                        ))}
                      </g>
                    </g>
                  </SvgWrapper>
                )}
              </Container>
            )
          }}
        </PieLayout>
      )}
    </PieLayout>
  )
}

TwoLevelPie.propTypes = {
  ...Pie.propTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.number.isRequired
    })
  )
}

const enhance = Component =>
  compose(
    defaultProps(Pie.defaultProps),
    withTheme(),
    withDimensions(),
    withPropsOnChange(['radialLabel'], ({ radialLabel }) => ({
      getRadialLabel: getLabelGenerator(radialLabel)
    })),
    withPropsOnChange(['sliceLabel'], ({ sliceLabel }) => ({
      getSliceLabel: getLabelGenerator(sliceLabel)
    })),
    pure
  )(Component)

export default setDisplayName('TwoLevelPie')(enhance(TwoLevelPie))
