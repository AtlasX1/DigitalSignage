import React from 'react'

import { Typography, Grid, withStyles } from '@material-ui/core'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#E69F00', '#09A69E', '#16325C', '#02A0DF']

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      position: 'relative'
    },
    label: {
      position: 'absolute',
      width: 'fit-content'
    },
    text: {
      fontSize: 23,
      color: palette[type].pages.reports.generate.info.chart.labelColor
    },
    textSmall: {
      fontSize: 15,
      color: palette[type].pages.reports.generate.info.chart.subColor
    }
  }
}

const CustomReportPieChart = ({ chartData, classes }) => {
  const fontFamily = [
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
  ].join(',')

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <PieChart width={218} height={218}>
        <Tooltip
          contentStyle={{
            fontSize: '14px',
            fontFamily
          }}
        />
        <Pie
          data={chartData}
          innerRadius={79}
          outerRadius={109}
          paddingAngle={0}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.label}
      >
        <Typography className={classes.text}>3500</Typography>
        <Typography className={classes.textSmall}>COMBINED</Typography>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(CustomReportPieChart)
