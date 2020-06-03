import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'

const styles = () => ({
  screenPreviewModalWrap: {
    width: '385px',
    padding: '15px 10px'
  },
  progress: {
    color: '#1c5dca'
  },
  scheduleDetail: {
    lineHeight: '25px',
    color: '#535d73'
  },
  scheduleDetailValue: {
    fontWeight: 'bold'
  }
})

const ScheduleDetailsModal = ({ t, classes, ...props }) => {
  const { schedule } = props
  const dummyData = {
    workingDays: 'All Days',
    devices: '',
    playbackContent: 'Media : Clock2'
  }

  return (
    <Grid container className={classes.screenPreviewModalWrap}>
      <Grid item xs={4}>
        <Typography className={classes.scheduleDetail}>
          {t('Status')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {schedule.status ? (
          <ActiveStatusChip label={t('Active')} />
        ) : (
          <InactiveStatusChip label={t('Inactive')} />
        )}
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.scheduleDetail}>
          {t('Duration')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          className={[classes.scheduleDetail, classes.scheduleDetailValue].join(
            ' '
          )}
        >
          {schedule.duration}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.scheduleDetail}>
          {t('Working Days')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          className={[classes.scheduleDetail, classes.scheduleDetailValue].join(
            ' '
          )}
        >
          {dummyData.workingDays}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.scheduleDetail}>
          {t('Devices')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          className={[classes.scheduleDetail, classes.scheduleDetailValue].join(
            ' '
          )}
        >
          {dummyData.devices}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.scheduleDetail}>
          {t('Playback Content')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          className={[classes.scheduleDetail, classes.scheduleDetailValue].join(
            ' '
          )}
        >
          {dummyData.playbackContent}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(ScheduleDetailsModal)
)
