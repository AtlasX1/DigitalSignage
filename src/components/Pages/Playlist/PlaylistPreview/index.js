import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import moment from 'moment'

import { SideModal } from '../../../Modal'
import { WhiteButton } from '../../../Buttons'
import MediaPreviewList from './MediaPreviewList'
import PlaylistPreviewCard from './PlaylistPreviewCard'

import { createPlaylistPreviewMediaDummyData } from '../../../../utils'

const styles = theme => ({
  playlistPreviewDetails: {
    padding: '30px 30px 20px 35px',
    borderTop: '1px solid #e4e9f3',
    borderBottom: '1px solid #e4e9f3'
  },
  playlistPreviewContent: {
    height: 'calc(100% - 94px)'
  },

  playlistMediaWrap: {
    padding: '20px 20px 0 30px',
    borderRight: '1px solid #e4e9f3'
  },

  detailLabel: {
    fontSize: '13px',
    color: '#74809a'
  },
  detailValue: {
    fontSize: '16px',
    color: '#0f2147'
  },
  description: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0f2147'
  },

  playlistPreviewWrap: {
    padding: '20px 20px 10px'
  },
  playlistPreviewCardWrap: {
    height: '100%'
  },
  playlistPreviewCard: {
    // paddingRight: '30px',
  },
  playlistPreviewActions: {
    width: '100%',
    padding: '20px 0 30px',
    borderTop: '1px solid #e4e9f3'
  },

  actionWrap: {
    alignSelf: 'flex-end'
  },
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: '#0a83c8'
  }
})

class PlaylistPreview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      playlist: {
        title: 'Image Playlist',
        description: 'Dracon Solutions Consultant',
        duration: '00:00:10',
        createdBy: 'A Jay Mvix',
        createdOn: 1544093340,

        media: [
          createPlaylistPreviewMediaDummyData(
            'GALLERY',
            'Mvix Sample Demo',
            '00:00:55',
            '1920 x 1080',
            '23 Feb 2018 02:20PM'
          ),
          createPlaylistPreviewMediaDummyData(
            'CLOUD',
            'buildinglogo',
            'N/A',
            '1920 x 1080',
            '23 Feb 2018 02:20PM'
          ),
          createPlaylistPreviewMediaDummyData(
            'B',
            'Promotional Image',
            'N/A',
            '1920 x 1080',
            '23 Feb 2018 02:20PM'
          ),
          createPlaylistPreviewMediaDummyData(
            'GALLERY',
            'buildinglogo',
            '00:00:55',
            '1920 x 1080',
            '23 Feb 2018 02:20PM'
          )
        ]
      }
    }
  }

  render() {
    const { t, classes } = this.props
    const {
      playlist: { title, description, duration, createdBy, createdOn, media }
    } = this.state

    return (
      <SideModal
        width="78%"
        title={t('Preview modal title', { title })}
        closeLink="/playlist-library"
      >
        <Grid
          container
          justify="space-between"
          className={classes.playlistPreviewDetails}
        >
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={6}>
                <Typography className={classes.detailLabel}>
                  {t('Description')}
                </Typography>
                <Typography className={classes.description}>
                  {description}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.detailLabel}>
                  {t('Duration')}
                </Typography>
                <Typography className={classes.detailValue}>
                  {duration}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.detailLabel}>
                  {t('Created by')}
                </Typography>
                <Typography className={classes.detailValue}>
                  {createdBy}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.detailLabel}>
                  {t('Created on')}
                </Typography>
                <Typography className={classes.detailValue}>
                  {moment
                    .unix(createdOn)
                    .format(t('PlaylistPreview createdOn format'))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.actionWrap}>
            <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
              <i
                className={`${classes.iconColor} icon-navigation-show-more-vertical`}
              />
              {t('More table action')}
            </WhiteButton>
          </Grid>
        </Grid>
        <Grid container className={classes.playlistPreviewContent}>
          <Grid item xs={5} className={classes.playlistMediaWrap}>
            <MediaPreviewList media={media} />
          </Grid>
          <Grid item xs={7} className={classes.playlistPreviewWrap}>
            <Grid
              container
              direction="column"
              justify="space-between"
              className={classes.playlistPreviewCardWrap}
            >
              <Grid item className={classes.playlistPreviewCard}>
                <PlaylistPreviewCard media={media} />
              </Grid>
              <Grid item>
                <Grid
                  container
                  wrap="nowrap"
                  className={classes.playlistPreviewActions}
                ></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(PlaylistPreview))
