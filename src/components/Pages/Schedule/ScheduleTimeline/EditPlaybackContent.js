import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { Card } from '../../../Card'
import { BlueButton, WhiteButton } from '../../../Buttons'

import Contents from '../SchedulePublish/Contents'

import { createPlaylistPreviewMediaDummyData } from '../../../../utils'

const styles = theme => {
  const { palette, type } = theme
  return {
    schedulePublishContent: {
      height: '100%',
      overflow: 'auto'
    },
    leftSide: {
      width: '100%',
      maxHeight: 'calc(100% - 90px)',
      paddingLeft: '35px',
      paddingRight: '20px'
    },
    header: {
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`,
      padding: 20
    },
    contentsCardRoot: {
      height: 'calc(100% - 45px)',
      paddingBottom: 0
    },
    scheduleInfoWrap: {
      overflowX: 'auto'
    },
    buttonsContainer: {
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: palette[type].sideModal.action.border,
      padding: '35px 20px 20px 20px'
    },
    actionWrap: {
      paddingRight: '12px'
    },
    action: {
      minWidth: '120px'
    }
  }
}

const EditPlaybackContent = ({ t, classes }) => {
  const [media, setMedia] = useState([
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
      'GALLERY',
      'PDF Sample Content',
      '00:00:55',
      '1920 x 1080',
      '01 Oct 2018 05:42AM'
    )
  ])

  const getMediaItem = id => {
    const item = media.find(item => item.id === id)
    const index = media.indexOf(item)

    setMedia([
      ...media.slice(0, index),
      ...media.slice(index + 1, media.length)
    ])

    return item
  }

  return (
    <SideModal
      width="64%"
      title={t('Edit Playback Content')}
      closeLink="/schedule-timeline"
      headerClassName={classes.header}
      leftBorderRadius
    >
      <Grid
        container
        justify="space-between"
        className={classes.schedulePublishContent}
      >
        <Grid item className={classes.leftSide}>
          <Card
            icon={false}
            shadow={false}
            radius={false}
            removeSidePaddings={true}
            removeNegativeHeaderSideMargins={true}
            headerTextClasses={[classes.headerText]}
            rootClassName={classes.contentsCardRoot}
          >
            <Contents media={media} getMediaItem={getMediaItem} />
          </Card>
        </Grid>
        <Grid
          item
          container
          justify="flex-end"
          className={classes.buttonsContainer}
        >
          <Grid item className={classes.actionWrap}>
            <BlueButton
              fullWidth={true}
              className={classes.action}
              onClick={() => {}}
            >
              {t('Update')}
            </BlueButton>
          </Grid>
          <Grid item>
            <WhiteButton
              fullWidth={true}
              component={Link}
              to="/schedule-timeline"
              className={[
                'hvr-radial-out',
                classes.action,
                classes.actionCancel
              ].join(' ')}
            >
              {t('Cancel')}
            </WhiteButton>
          </Grid>
        </Grid>
      </Grid>
    </SideModal>
  )
}

EditPlaybackContent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(
  withStyles(styles)(EditPlaybackContent)
)
