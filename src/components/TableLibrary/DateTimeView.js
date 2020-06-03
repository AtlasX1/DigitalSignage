import React, { useMemo } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import moment from 'moment'
import classNames from 'classnames'

const styles = ({ type, palette }) => ({
  text: {
    color: palette[type].tableLibrary.body.cell.color
  },
  textSmall: {
    fontSize: '11px',
    lineHeight: '18px',
    color: '#9EA0AB'
  }
})

const DateTimeView = ({ date, classes }) => {
  const { formattedDate, formattedTime } = useMemo(() => {
    const dateTime = moment(date)
    return {
      formattedDate: dateTime.format('DD MMM YYYY'),
      formattedTime: dateTime.format('hh:mmA')
    }
  }, [date])

  if (!date) {
    return (
      <Grid>
        <Typography className={classes.text}>N/A</Typography>
      </Grid>
    )
  }

  return (
    <Grid>
      <Typography className={classes.text}>{formattedDate}</Typography>
      <Typography className={classNames(classes.text, classes.textSmall)}>
        {formattedTime}
      </Typography>
    </Grid>
  )
}

export default withStyles(styles)(DateTimeView)
