import React, { useState, useCallback } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import { getMediaPreview, showMediaPreview } from 'actions/mediaActions'

import { disabledPreviewMediaFeatures } from 'constants/media'
import { withStyles, Grid, Typography, RootRef } from '@material-ui/core'

import LibraryTypeIcon from '../../../LibraryTypeIcon'
import { dndConstants } from '../../../../constants'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import { useDispatch, useSelector } from 'react-redux'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    mediaItem: {
      padding: '15px 0',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    mediaCheck: {
      marginRight: '20px',
      paddingTop: '5px'
    },
    typeIconWrap: {
      cursor: 'pointer',
      textAlign: 'center',
      marginRight: '15px'
    },
    mediaTitle: {
      maxWidth: '25ch',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'normal',
      ...typography.darkAccent[type]
    },

    rightSide: {
      textAlign: 'right'
    },
    mediaDuration: {
      ...typography.darkAccent[type]
    },
    mediaResolution: {
      ...typography.lightText[type],
      fontSize: '11px'
    },
    lastUpdated: {
      ...typography.lightText[type],
      fontSize: '11px'
    },
    mediaItemAction: {
      marginLeft: '20px'
    }
  }
}

const MediaListItem = ({ t, classes, media }) => {
  const dispatchAction = useDispatch()
  const mediaPreview = useSelector(({ media }) => media.preview)

  const [uid, setUid] = useState(uuidv4())
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.schedulePublishItemTypes.MEDIA_ITEM,
      id: media.id,
      uid
    },
    end: () => {
      setUid(uuidv4())
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handlePreviewClick = useCallback(() => {
    const { id, feature } = media
    if (disabledPreviewMediaFeatures.includes(feature.name)) {
      return
    }

    if (mediaPreview.id !== id || mediaPreview.error) {
      dispatchAction(getMediaPreview(id))
    } else {
      dispatchAction(showMediaPreview())
    }
  }, [dispatchAction, media, mediaPreview])

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={drag}>
      <Grid item xs={12} className={classes.mediaItem} style={{ opacity }}>
        <Grid container justify="space-between">
          <Grid item xs={7}>
            <Grid container alignContent="center" wrap="nowrap">
              <Grid item>
                <LibraryTypeIcon
                  type={media.type}
                  wrapHelperClass={classes.typeIconWrap}
                  onClick={handlePreviewClick}
                />
              </Grid>
              <Grid item>
                <Typography className={classes.mediaTitle}>
                  {media.title}
                </Typography>
                <Typography className={classes.lastUpdated}>
                  {t('Last Updated', {
                    lastUpdated: moment(media.updatedAt).format(
                      'DD MMM, YYYY, hh:mm'
                    )
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className={classes.rightSide}>
            <Typography className={classes.mediaDuration}>
              {media.duration}
            </Typography>
            <Typography className={classes.mediaResolution}>
              {(media.width || media.resolution) &&
                t('Media Resolution', {
                  resolution: media.width
                    ? `${media.width}x${media.height}`
                    : media.resolution && media.resolution !== 'x'
                    ? media.resolution
                    : t('Responsive')
                })}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

MediaListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(MediaListItem))
