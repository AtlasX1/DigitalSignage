import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { withStyles, Grid, Typography } from '@material-ui/core'

import Chart from './Chart'
import Table from './Table'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: 'calc(100% - 288px - 316px)',
      height: '100%',
      position: 'relative',

      '&::before': {
        content: '""',
        width: 4,
        height: 'calc(100% + 49px)',
        background: palette[type].pages.reports.generate.border,
        position: 'absolute',
        top: -49,
        left: 0
      }
    },
    containerBig: {
      width: 'calc(100% - 316px)'
    },
    text: {
      fontSize: 13,
      letterSpacing: '-0.01px'
    },
    textBlue: {
      color: '#0379bb'
    },
    title: {
      position: 'absolute',
      top: -34,
      left: 15
    }
  }
}

const Info = ({ t, classes, big }) => (
  <Grid
    container
    direction="column"
    className={[classes.container, big ? classes.containerBig : ''].join(' ')}
  >
    <Typography
      className={[classes.text, classes.textBlue, classes.title].join(' ')}
    >
      {t(
        'Previewing the limited number of records. Run the report to see everything'
      )}
    </Typography>

    <Chart />
    <Table autoWidth={big} />
  </Grid>
)

Info.propTypes = {
  classes: PropTypes.object,
  big: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(Info))
