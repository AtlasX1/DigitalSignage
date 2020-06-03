import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'

import Actions from './Actions'
import PlaylistInformation from './PlaylistInformation'
import PlaylistItems from './PlaylistItems'
import CollectionsMatchCard from './CollectionsMatchCard'

import { createPlaylistPreviewMediaDummyData } from '../../../../utils'

const styles = theme => ({
  createPlaylistContent: {
    height: '100%'
  },
  leftSide: {
    maxHeight: '100%',
    paddingLeft: '35px'
  },

  mediaInfoWrap: {
    borderLeft: `solid 1px ${
      theme.palette[theme.type].sideModal.content.border
    }`
  },
  mediaInfoContainer: {
    height: '100%',
    position: 'relative'
  },
  bottomActions: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
})

class SmartPlaylist extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      isExactMatch: false,
      media: [
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'Mvix Sample Demo Content 02',
          '00:00:55',
          '1920 x 1080',
          '23 Feb 2018 02:20PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'CLOUD',
          'buildinglogo',
          'N/A',
          '1920 x 1080',
          '20 Jul 2018 02:03AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'B',
          'Promotional Image',
          'N/A',
          '1920 x 1080',
          '17 Nov 2018 08:41PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'buildinglogo',
          '00:00:55',
          '1920 x 1080',
          '07 Feb 2018 03:32AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'buildinglogo',
          '00:00:55',
          '1920 x 1080',
          '21 Jul 2018 05:45PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'DOC',
          'There Is No Competition',
          '00:00:55',
          '1920 x 1080',
          '10 Sep 2018 10:34PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'REWARDS',
          'UnitedAirlines-OPEN',
          '00:00:55',
          '1920 x 1080',
          '04 Jul 2018 06:31AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'Feedback Management',
          '00:00:55',
          '1920 x 1080',
          '22 Feb 2018 10:07AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'PDF Sample Content',
          '00:00:55',
          '1920 x 1080',
          '01 Oct 2018 05:42AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'Mvix Sample Demo Content 02',
          '00:00:55',
          '1920 x 1080',
          '23 Feb 2018 02:20PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'CLOUD',
          'buildinglogo',
          'N/A',
          '1920 x 1080',
          '20 Jul 2018 02:03AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'B',
          'Promotional Image',
          'N/A',
          '1920 x 1080',
          '17 Nov 2018 08:41PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'buildinglogo',
          '00:00:55',
          '1920 x 1080',
          '07 Feb 2018 03:32AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'buildinglogo',
          '00:00:55',
          '1920 x 1080',
          '21 Jul 2018 05:45PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'DOC',
          'There Is No Competition',
          '00:00:55',
          '1920 x 1080',
          '10 Sep 2018 10:34PM'
        ),
        createPlaylistPreviewMediaDummyData(
          'REWARDS',
          'UnitedAirlines-OPEN',
          '00:00:55',
          '1920 x 1080',
          '04 Jul 2018 06:31AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'Feedback Management',
          '00:00:55',
          '1920 x 1080',
          '22 Feb 2018 10:07AM'
        ),
        createPlaylistPreviewMediaDummyData(
          'GALLERY',
          'PDF Sample Content',
          '00:00:55',
          '1920 x 1080',
          '01 Oct 2018 05:42AM'
        )
      ],
      collectionsTags: [
        { label: '1080p', color: 'purple' },
        { label: 'Corporate', color: 'blue' },
        { label: 'Demo Data Content', color: 'green' },
        { label: 'TIMET', color: 'green' },
        { label: 'Video', color: 'orange' },
        { label: 'Professional', color: 'pink' },
        { label: '1080p', color: 'purple' },
        { label: 'Corporate', color: 'blue' },
        { label: 'Demo Data Content', color: 'green' },
        { label: 'TIMET', color: 'green' },
        { label: 'Demo Data Content', color: 'green' },
        { label: 'TIMET', color: 'green' },
        { label: 'Video', color: 'orange' },
        { label: 'Professional', color: 'pink' }
      ]
    }
  }

  render() {
    const { t, classes } = this.props
    const { media, isExactMatch, collectionsTags } = this.state

    return (
      <SideModal
        width="90%"
        title={t('Smart Playlist')}
        closeLink="/playlist-library"
      >
        <Grid container wrap="nowrap" className={classes.createPlaylistContent}>
          <Grid item xs={6} className={classes.leftSide}>
            <CollectionsMatchCard
              isExactMatch={isExactMatch}
              collectionsTags={collectionsTags}
            />
          </Grid>
          <Grid item xs={6} className={classes.mediaInfoWrap}>
            <Grid
              container
              direction="column"
              className={classes.mediaInfoContainer}
            >
              <Grid item>
                <PlaylistItems media={media} />
              </Grid>
              <Grid item>
                <PlaylistInformation />
              </Grid>
              <Grid item className={classes.bottomActions}>
                <Actions />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(SmartPlaylist))
