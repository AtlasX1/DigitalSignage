import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { Grid, Typography, withStyles } from '@material-ui/core'

import LibraryTypeIcon from '../../../../../../../../LibraryTypeIcon'

import moment from 'moment'

const styles = theme => {
  const { palette, type } = theme
  return {
    mediaItemWrap: {
      cursor: 'pointer'
    },
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
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor
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
      fontSize: '12px',
      lineHeight: '18px',
      color: '#9394a0'
    },
    mediaItemAction: {
      marginLeft: '20px'
    },
    selectedMedia: {
      boxShadow: 'inset 0 0 10px #3a8cff'
    }
  }
}

const MediaItem = ({ t, classes, item, noBorder, selected, onClick }) => {
  return (
    <Grid
      item
      xs={12}
      className={[
        classes.mediaItemWrap,
        selected === item.id ? classes.selectedMedia : ''
      ].join(' ')}
      onClick={onClick}
    >
      <div className={classes.mediaItemRef}>
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
                <Typography className={classes.mediaResolution}>
                  {t('Last Updated', {
                    lastUpdated: moment(item.updatedAt).format(
                      'DD MMM YYYY hh:mmA'
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

MediaItem.propTypes = {
  item: PropTypes.object.isRequired,
  noBorder: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(MediaItem))
