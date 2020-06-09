import React, { useMemo } from 'react'

import { withStyles } from '@material-ui/core'
import { ResponsivePie } from '@nivo/pie'
import AnimatedPie from './AnimatedPie'

const COLORS = [
  '#0076b9',
  '#3ca1db',
  'rgba(99, 180, 227, 0.6)',
  'rgba(99, 180, 227, 0.5)'
]

const styles = () => ({
  root: {
    height: 115
  }
})

const StoragePieChart = ({ chartData, classes, theme }) => {
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
        chartComponent={ResponsivePie}
        data={chartData}
        margin={{ top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 }}
        innerRadius={0.75}
        padAngle={1}
        colors={COLORS}
        theme={chartTheme}
        enableRadialLabels={false}
        enableSlicesLabels={false}
      />
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(StoragePieChart)
