import React, { useMemo } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import moment from 'moment'
import classNames from 'classnames'

const styles = ({ type, typography }) => ({
  text: {
    ...typography.darkAccent[type]
  },
  textSmall: {
    ...typography.subtitle[type]
  }
})

const DateTimeView = ({ date, classes }) => {
  const { formattedDate, formattedTime } = useMemo(() => {
    const dateTime = moment(date)
    return {
      formattedDate: dateTime.format('MMM DD, YYYY'),
      formattedTime: dateTime.format('h:mmA')
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
