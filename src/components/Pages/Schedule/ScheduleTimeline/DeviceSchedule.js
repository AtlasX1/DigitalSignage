import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withStyles, Grid, Typography, IconButton } from '@material-ui/core'

import Popup from '../../../Popup'

const styles = theme => {
  return {
    root: {
      position: 'absolute',
      backgroundColor: '#00bceb',
      height: 28,
      top: '50%',
      transform: 'translate(0, -50%)',
      borderRadius: 3,
      padding: '0 10px'
    },
    hours: {
      fontSize: 12,
      color: 'white',
      fontWeight: 'bold',
      marginRight: 20
    },
    contentTitle: {
      fontSize: 12,
      color: 'white'
    },
    contentWrap: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      marginRight: '20px'
    },
    filterIconRoot: {
      position: 'absolute',
      right: 5,
      bottom: 5,
      padding: 0,
      color: 'white',
      fontSize: 18
    }
  }
}

const dropdownStyle = {
  borderRadius: 6,
  width: 200,
  animation: 'fade-in 200ms'
}

const DeviceSchedule = ({ t, classes, schedule }) => {
  const startTime = moment(schedule.startTime, 'H').format('h A')
  const endTime = moment(schedule.endTime, 'H').format('h A')
  const startTimeHour = moment(schedule.startTime, 'H').hour()
  const endTimeHour = moment(schedule.endTime, 'H').hour()
  const cellWidth = 55.48

  return (
    <Grid
      container
      alignContent="center"
      className={classes.root}
      style={{
        width: cellWidth * (endTimeHour - startTimeHour),
        transform: `translate(${startTimeHour * cellWidth}px, -50%)`
      }}
    >
      <Grid
        container
        justify="flex-start"
        wrap="nowrap"
        className={classes.contentWrap}
      >
        <Typography
          className={classes.hours}
        >{`${startTime} - ${endTime}`}</Typography>
        <Typography className={classes.contentTitle}>
          {schedule.title}
        </Typography>
      </Grid>

      <Popup
        on="click"
        position="bottom right"
        contentStyle={dropdownStyle}
        trigger={
          <IconButton className={`hvr-grow ${classes.filterIconRoot}`}>
            <i className="icon-navigation-show-more-vertical" />
          </IconButton>
        }
      >
        <div />
      </Popup>
    </Grid>
  )
}

DeviceSchedule.propTypes = {
  classes: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(DeviceSchedule))
