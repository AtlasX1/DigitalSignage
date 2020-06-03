import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { Card } from '../../../Card'

const styles = theme => ({
  header: {
    marginBottom: '10px',
    paddingLeft: 0,
    border: 'solid 1px #e4e9f3',
    backgroundColor: '#f5f6fa'
  },
  headerText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: '#0f2147'
  },
  screenshotWrap: {
    marginBottom: '40px',
    backgroundColor: '#3d3d3d'
  },
  screenshot: {
    width: '100%',
    height: 'auto'
  },
  noScreenshot: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  noScreenshotText: {
    marginBottom: 0,
    lineHeight: '300px',
    color: 'rgba(255, 255, 255, 0.3)'
  },

  title: {
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0f2147'
  },
  listLabel: {
    paddingBottom: '10px',
    fontSize: '13px',
    color: '#74809a'
  },
  listValue: {
    paddingBottom: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#0f2147'
  }
})

class PlaylistPreviewCard extends Component {
  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      preview: {
        id: 'Cloud Base Solution',
        image: null,
        title: 'Cloud Base Solution',
        playlist: 'LocalHRManagers Playlist',
        group: 'Default',
        fileType: 'Image',
        resolution: '900 x 400',
        playtime: '00:00:10',
        noOfPlaytimes: 'Default',
        dayParting: '00:00:00 To 23:59:59'
      }
    }
  }

  render() {
    const { preview } = this.state
    const { t, classes } = this.props

    return (
      <Card
        icon={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        removeSidePaddings={true}
        headerSidePaddings={true}
        removeNegativeHeaderSideMargins={true}
        title={t('Preview').toUpperCase()}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerText]}
      >
        <Grid container>
          <Grid item xs={12}>
            <div
              className={[
                classes.screenshotWrap,
                !preview.image && classes.noScreenshot
              ].join(' ')}
            >
              {preview.image ? (
                <img
                  className={classes.screenshot}
                  src={preview.image}
                  alt=""
                />
              ) : (
                <Typography className={classes.noScreenshotText}>
                  No Screenshot Available
                </Typography>
              )}
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.title}>{preview.id}</Typography>

            <Grid container>
              <Grid item xs={6}>
                <Typography className={classes.listLabel}>{t('Id')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.id}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('Playlist')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.playlist}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('Group')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.group}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('File Type')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.fileType}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('Resolution')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.resolution}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('Playtime')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.playtime}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('No of Playtimes')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.noOfPlaytimes}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography className={classes.listLabel}>
                  {t('Day Parting')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.listValue}>
                  {preview.dayParting}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(PlaylistPreviewCard)
)
