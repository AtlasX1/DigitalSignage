import React, { useState } from 'react'
import { translate } from 'react-i18next'

import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

const styles = theme => ({
  screenPreviewModalWrap: {
    padding: '10px'
  },
  screenPreviewImage: {
    marginBottom: '15px'
  },
  progress: {
    color: '#1c5dca'
  },
  mediaDetails: {
    marginBottom: '10px'
  },
  mediaDetail: {
    lineHeight: '25px',
    color: '#535d73'
  },
  mediaDetailValue: {
    fontWeight: 'bold'
  }
})

const MediaPreviewModal = ({ t, classes, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { media } = props
  const dummyData = {
    owner: 'Mike Saied',
    name: 'Amber Theme 1',
    mediaFormat: 'Alert System',
    duration: '00:00:00',
    resolution: 'N/A'
  }

  return (
    <div className={classes.screenPreviewModalWrap}>
      <div className={classes.screenPreviewImage}>
        {!imageLoaded && (
          <CircularProgress
            size={30}
            thickness={5}
            className={classes.progress}
          />
        )}

        <img
          onLoad={() => setImageLoaded(true)}
          src={media.screenPreviewURL}
          alt=""
        />
      </div>
      <Grid container className={classes.mediaDetails}>
        <Grid item xs={6}>
          <Typography className={classes.mediaDetail}>{t('Owner')}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={[classes.mediaDetail, classes.mediaDetailValue].join(
              ' '
            )}
          >
            {dummyData.owner}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.mediaDetail}>{t('Name')}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={[classes.mediaDetail, classes.mediaDetailValue].join(
              ' '
            )}
          >
            {dummyData.name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.mediaDetail}>
            {t('Media Format')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={[classes.mediaDetail, classes.mediaDetailValue].join(
              ' '
            )}
          >
            {dummyData.mediaFormat}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.mediaDetail}>
            {t('Duration')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={[classes.mediaDetail, classes.mediaDetailValue].join(
              ' '
            )}
          >
            {dummyData.duration}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.mediaDetail}>
            {t('Resolution')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={[classes.mediaDetail, classes.mediaDetailValue].join(
              ' '
            )}
          >
            {dummyData.resolution && dummyData.resolution !== 'x'
              ? dummyData.resolution
              : t('Responsive')}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(MediaPreviewModal))
