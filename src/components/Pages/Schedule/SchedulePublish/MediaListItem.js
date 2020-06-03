import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'

import { withStyles, Grid, Typography, RootRef } from '@material-ui/core'

import LibraryTypeIcon from '../../../LibraryTypeIcon'
import { dndConstants } from '../../../../constants'
import moment from 'moment'

const styles = theme => {
  const { palette, type } = theme
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
      textAlign: 'center',
      marginRight: '15px'
    },
    mediaTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor,
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },

    rightSide: {
      textAlign: 'right'
    },
    mediaDuration: {
      fontSize: '14px',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor
    },
    mediaResolution: {
      fontSize: '11px',
      lineHeight: '18px',
      color: '#9EA0AB'
    },
    lastUpdated: {
      fontSize: '11px',
      lineHeight: '18px',
      color: '#9EA0AB'
    },
    mediaItemAction: {
      marginLeft: '20px'
    }
  }
}

const MediaListItem = ({ t, classes, media }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.schedulePublishItemTypes.MEDIA_ITEM,
      id: media.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

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
                />
              </Grid>
              <Grid item>
                <Typography noWrap={true} className={classes.mediaTitle}>
                  {media.title}
                </Typography>
                <Typography className={classes.lastUpdated}>
                  {t('Last Updated', {
                    lastUpdated: moment(media.updatedAt).format(
                      'DD MMM YYYY hh:mm'
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
              {t('Media Resolution', {
                resolution:
                  media.resolution && media.resolution !== 'x'
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
