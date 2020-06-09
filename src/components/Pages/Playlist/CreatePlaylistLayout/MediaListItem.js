import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import { translate } from 'react-i18next'
import uuidv4 from 'uuid/v4'

import { Grid, Typography, withStyles } from '@material-ui/core'

import LibraryTypeIcon from 'components/LibraryTypeIcon'

import { dndConstants } from 'constants/index'
import moment from 'moment'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    mediaItemRef: {
      padding: '15px 13px 0 13px'
    },
    mediaItem: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
      paddingBottom: '15px'
    },
    noBorder: {
      borderBottom: '0'
    },
    mediaCheck: {
      marginRight: '20px',
      paddingTop: '5px'
    },
    typeIconWrap: {
      textAlign: 'center',
      marginRight: '25px'
    },
    mediaTitle: {
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
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

const MediaListItem = ({ t, classes, item, noBorder }) => {
  const [uid, setUid] = useState(uuidv4())
  const [, drag] = useDrag({
    item: {
      type: dndConstants.createTemplateItemTypes.MEDIA_ITEM,
      id: item.id,
      uid
    },
    end: () => {
      setUid(uuidv4())
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  return (
    <Grid item xs={12} className={classes.mediaItemWrap}>
      <div className={classes.mediaItemRef} ref={drag}>
        <Grid
          container
          className={[classes.mediaItem, noBorder ? classes.noBorder : ''].join(
            ' '
          )}
          justify="space-between"
        >
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={2}>
                <LibraryTypeIcon
                  type={item.type ? item.type : item.feature}
                  wrapHelperClass={classes.typeIconWrap}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography className={classes.mediaTitle}>
                  {item.title}
                </Typography>
                <Typography className={classes.lastUpdated}>
                  {t('Last Updated', {
                    lastUpdated: moment(item.updatedAt).format(
                      'DD MMM, YYYY, hh:mm'
                    )
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.rightSide}>
            <Typography className={classes.mediaDuration}>
              {item.duration}
            </Typography>
            <Typography className={classes.mediaResolution}>
              {t('Media Resolution', {
                resolution:
                  item.resolution && item.resolution !== 'x'
                    ? item.resolution
                    : t('Responsive')
              })}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Grid>
  )
}

MediaListItem.propTypes = {
  item: PropTypes.object.isRequired,
  noBorder: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(MediaListItem))
