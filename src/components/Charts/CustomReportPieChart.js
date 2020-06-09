import React from 'react'

import { Typography, Grid, withStyles } from '@material-ui/core'
import AnimatedPie from './AnimatedPie'

const COLORS = ['#E69F00', '#09A69E', '#16325C', '#02A0DF']

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    container: {
      position: 'relative',
      fontFamily: typography.fontFamily
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
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <AnimatedPie
        width={218}
        height={218}
        data={chartData}
        innerRadius={0.75}
        padAngle={1}
        colors={COLORS}
        enableRadialLabels={false}
        enableSlicesLabels={false}
      />
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
