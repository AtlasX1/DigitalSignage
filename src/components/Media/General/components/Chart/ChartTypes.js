import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core'

import { Grid } from '@material-ui/core'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      padding: 15,
      fontFamily: typography.fontFamily
    },
    chartContainer: {},
    chartItem: {
      padding: '6px 20px 13px',
      fontSize: '12px',
      lineHeight: '14px',
      fontWeight: '600',
      color: palette[type].pages.media.general.chart.types.color,
      cursor: 'pointer',
      '&.active': {
        backgroundColor:
          palette[type].pages.media.general.chart.types.active.background,
        color: palette[type].pages.media.general.chart.types.active.color
      }
    },
    subChartContainer: {
      backgroundColor: palette[type].pages.media.general.chart.types.background,
      padding: '6px 0'
    },
    subChartItem: {
      padding: '20px 12px',
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500',
      color: palette[type].pages.media.general.chart.types.sub.color,
      cursor: 'pointer',
      '&.active': {
        backgroundColor:
          palette[type].pages.media.general.chart.types.sub.active.background,
        color: palette[type].pages.media.general.chart.types.sub.active.color,
        borderRadius: '7px'
      }
    }
  }
}

const ChartTypes = ({ classes, handleChartChanges }) => {
  const chartTypes = [
    {
      label: 'Line',
      items: [
        'Basic Bar',
        'Stacked Bar',
        'Bar with Negative',
        'Basic Column',
        'Stacked Column'
      ]
    },
    {
      label: 'Area',
      items: [
        'Stacked Bar',
        'Bar with Negative',
        'Basic Column',
        'Stacked Column',
        'Basic Bar'
      ]
    },
    {
      label: 'Bar',
      items: [
        'Bar with Negative',
        'Basic Column',
        'Stacked Column',
        'Basic Bar',
        'Stacked Bar'
      ]
    },
    {
      label: 'Pie',
      items: [
        'Basic Column',
        'Stacked Column',
        'Basic Bar',
        'Stacked Bar',
        'Bar with Negative'
      ]
    },
    {
      label: '3D',
      items: [
        'Stacked Column',
        'Basic Bar',
        'Stacked Bar',
        'Bar with Negative',
        'Basic Column'
      ]
    }
  ]
  const [selectedChart, setSelectedChart] = useState(0)
  const [selectedChartType, setSelectedChartType] = useState(0)

  useEffect(() => {
    setSelectedChartType(0)
  }, [selectedChart])

  useEffect(() => {
    handleChartChanges({
      chart: selectedChart,
      subChart: selectedChartType
    })
    //eslint-disable-next-line
  }, [selectedChart, selectedChartType])

  return (
    <div className={classes.root}>
      <Grid container justify="flex-start" className={classes.chartContainer}>
        {chartTypes.map((item, index) => (
          <Grid item key={index}>
            <div
              onClick={() => setSelectedChart(index)}
              className={[
                classes.chartItem,
                selectedChart === index ? 'active' : ''
              ].join(' ')}
            >
              {item.label}
            </div>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        justify="space-between"
        className={classes.subChartContainer}
      >
        {chartTypes[selectedChart].items.map((item, index) => (
          <Grid item key={index}>
            <div
              onClick={() => setSelectedChartType(index)}
              className={[
                classes.subChartItem,
                selectedChartType === index ? 'active' : ''
              ].join(' ')}
            >
              {item}
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default withStyles(styles)(ChartTypes)
