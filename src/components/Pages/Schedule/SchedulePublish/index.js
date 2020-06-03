import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { Card } from '../../../Card'
import { TabToggleButton, TabToggleButtonGroup } from '../../../Buttons'

import Actions from './Actions'
import ScheduleInfo from './ScheduleInfo'
import Contents from './Contents'
import Devices from './Devices'

import { createPlaylistPreviewMediaDummyData } from '../../../../utils'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => {
  const { palette, type } = theme
  return {
    schedulePublishContent: {
      height: '100%'
    },
    leftSide: {
      maxHeight: '100%',
      paddingLeft: '35px',
      paddingRight: '20px'
    },
    tabsWrap: {
      marginBottom: '20px'
    },

    mediaInfoWrap: {
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    },

    header: {
      marginBottom: '20px',
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.header.titleColor
    },
    contentsCardRoot: {
      height: 'calc(100% - 45px)',
      paddingBottom: 0
    },
    scheduleInfoWrap: {
      overflowX: 'auto'
    }
  }
}

class SchedulePublish extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      publishTypeSelected: 'contents',
      selectedDeviceIds: [],
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
      ]
    }
  }

  handlePublishTypeSelectedChanges = (event, publishTypeSelected) => {
    if (publishTypeSelected) {
      this.setState({ publishTypeSelected })
    }
  }

  getMediaItem = id => {
    const { media } = this.state

    const item = media.find(item => item.id === id)
    const index = media.indexOf(item)

    this.setState(
      update(this.state, {
        media: { $splice: [[index, 1]] }
      })
    )

    return item
  }

  handleSelectedDevicesChange = selectedDeviceIds => {
    this.setState({
      selectedDeviceIds
    })
  }

  render() {
    const { t, classes } = this.props
    const { media, selectedDeviceIds, publishTypeSelected } = this.state

    const contents = publishTypeSelected === 'contents'
    const devices = publishTypeSelected === 'devices'

    const title = publishTypeSelected === 'contents' ? 'Contents' : 'Devices'

    return (
      <SideModal
        width="100%"
        animated={false}
        title={t('Schedule & Publish')}
        leftBorderRadius
      >
        <Grid
          container
          wrap="nowrap"
          className={classes.schedulePublishContent}
        >
          <Grid item xs={8} className={classes.leftSide}>
            <Grid
              className={classes.tabsWrap}
              container
              alignContent="center"
              justify="center"
            >
              <Grid item>
                <TabToggleButtonGroup
                  exclusive
                  value={publishTypeSelected}
                  onChange={this.handlePublishTypeSelectedChanges}
                >
                  <TabToggleButton value="contents">
                    {t('Add Contents')}
                  </TabToggleButton>
                  <TabToggleButton value="devices">
                    {t('Select Devices')}
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
            </Grid>

            <Card
              icon={false}
              grayHeader={true}
              shadow={false}
              radius={false}
              removeSidePaddings={true}
              headerSidePaddings={true}
              removeNegativeHeaderSideMargins={true}
              title={t(title).toUpperCase()}
              headerClasses={[classes.header]}
              headerTextClasses={[classes.headerText]}
              rootClassName={classes.contentsCardRoot}
            >
              {contents && (
                <Contents media={media} getMediaItem={this.getMediaItem} />
              )}

              {devices && (
                <Devices
                  selectedDeviceIds={selectedDeviceIds}
                  onSelectedChange={this.handleSelectedDevicesChange}
                />
              )}
            </Card>
          </Grid>
          <Grid item xs={4} className={classes.mediaInfoWrap}>
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.mediaInfoContainer}
            >
              <Scrollbars>
                <Grid item className={classes.scheduleInfoWrap}>
                  <ScheduleInfo />
                </Grid>
              </Scrollbars>
              <Grid item>
                <Actions />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(SchedulePublish))
