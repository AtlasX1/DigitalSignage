import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import MediaList from './MediaList'
import PlaybackContent from './PlaybackContent'
import { Scrollbars } from 'components/Scrollbars'

const styles = {
  contentsCardContainer: {
    height: 'calc(100% - 66px)'
  },
  mediaListItem: {
    height: '100%',
    overflowX: 'auto'
  }
}

const Contents = ({ classes, media, getMediaItem }) => (
  <Grid container className={classes.contentsCardContainer}>
    <Grid item xs={5} className={classes.mediaListItem}>
      <Scrollbars>
        <MediaList media={media} />
      </Scrollbars>
    </Grid>
    <Grid item xs={7}>
      <PlaybackContent media={media} getMediaItem={getMediaItem} />
    </Grid>
  </Grid>
)

Contents.propTypes = {
  classes: PropTypes.object,
  media: PropTypes.array,
  getMediaItem: PropTypes.func
}

export default withStyles(styles)(Contents)
