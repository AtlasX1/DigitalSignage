import React, { useMemo } from 'react'

import TwoLevelPie from './TwoLevelPie'
import AnimatedPie from './AnimatedPie'
import { withTheme } from '@material-ui/core/styles'

const TwoPieChart = ({ chartData = [], fillColors, theme }) => {
  const innerPieData = chartData[0]
  const outerPieData = chartData[1]
  const innerColors = [...fillColors]
  const outerColors = innerColors.splice(innerColors.length - 1, 1)

  const chartTheme = useMemo(
    () =>
      theme
        ? {
            tooltip: {
              container: {
                fontFamily: theme.typography.fontFamily,
                fontSize: 12
              }
            }
          }
        : undefined,
    [theme]
  )

  return (
    <AnimatedPie
      chartComponent={TwoLevelPie}
      width={210}
      height={210}
      startAngle={90}
      endAngle={450}
      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      padAngle={1}
      theme={chartTheme}
      enableRadialLabels={false}
      enableSlicesLabels={false}
      innerPieProps={{
        colors: innerColors,
        data: innerPieData,
        outerRadius: 0.6
      }}
      outerPieProps={{
        innerRadius: 0.7,
        colors: outerColors,
        data: outerPieData
      }}
    />
  )
}

export default withTheme()(TwoPieChart)
