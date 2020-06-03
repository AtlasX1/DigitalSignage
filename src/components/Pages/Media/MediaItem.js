import React from 'react'
import { useDrag } from 'react-dnd'

import { withStyles, Grid, Typography, RootRef } from '@material-ui/core'

import Popup from 'components/Popup'
import { CircleIconButton } from 'components/Buttons'
import MediaPreviewModal from 'components/Pages/Media/MediaPreviewModal'
import LibraryTypeIcon from 'components/LibraryTypeIcon'

import { isEven } from 'utils'
import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    mediaItemWrap: {
      paddingRight: '30px'
    },
    mediaItem: {
      padding: '15px 0',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
      overflow: 'hidden'
    },
    infoWrap: {
      maxWidth: 'calc(100% - 36px)'
    },
    typeIconWrap: {
      marginRight: '25px'
    },
    mediaTitleWrap: {
      maxWidth: 'calc(100% - 61px)'
    },
    mediaTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '36px',
      color: palette[type].sideModal.tabs.item.titleColor,
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    moreIcon: {
      padding: '11px',
      fontSize: '14px',
      color: '#74809a'
    }
  }
}

const MediaItem = ({ classes, media, index }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.mediaGroupsItemTypes.MEDIA_ITEM,
      id: media.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={drag}>
      <Grid item xs={6} className={classes.mediaItemWrap} style={{ opacity }}>
        <Grid
          container
          justify="space-between"
          className={classes.mediaItem}
          wrap="nowrap"
        >
          <Grid item xs className={classes.infoWrap}>
            <Grid container wrap="nowrap">
              <Grid item>
                <LibraryTypeIcon
                  color={media.feature.color}
                  iconHelperClass={media.feature.icon}
                  wrapHelperClass={classes.typeIconWrap}
                />
              </Grid>
              <Grid item xs className={classes.mediaTitleWrap}>
                <Typography noWrap={true} className={classes.mediaTitle}>
                  {media.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Popup
              position={isEven(index) ? 'bottom center' : 'bottom right'}
              trigger={
                <CircleIconButton className={classes.moreIcon}>
                  <i className="icon-navigation-show-more-vertical" />
                </CircleIconButton>
              }
              contentStyle={{
                width: '267px',
                borderRadius: '6px'
              }}
            >
              <MediaPreviewModal media={media} />
            </Popup>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

export default withStyles(styles)(MediaItem)
