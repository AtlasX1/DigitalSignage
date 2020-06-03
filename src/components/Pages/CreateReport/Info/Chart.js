import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import ChartSettingsButton from './ChartSettingsButton'
import {
  CustomReportPieChart,
  CustomReportBarChart,
  CustomReportVerticalBarChart,
  CustomReportLineChart
} from '../../../Charts'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      height: 289,
      position: 'relative',
      borderBottomWidth: 7,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pages.reports.generate.border
    }
  }
}

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
]

const Chart = ({ classes }) => {
  const [chart, setChart] = useState('pie')

  const pie = chart === 'pie'
  const bar = chart === 'bar'
  const line = chart === 'line'
  const horBar = chart === 'horBar'

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <ChartSettingsButton chart={chart} setChart={setChart} />

      {pie && <CustomReportPieChart chartData={chartData} />}
      {bar && <CustomReportVerticalBarChart chartData={chartData} />}
      {line && <CustomReportLineChart chartData={chartData} />}
      {horBar && <CustomReportBarChart chartData={chartData} />}
    </Grid>
  )
}

Chart.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(Chart)
