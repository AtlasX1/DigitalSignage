import React, { useState, useCallback } from 'react'
import { withStyles, Grid, CircularProgress } from '@material-ui/core'
import PlaylistMediaSelector from './PlaylistMediaSelector'

const styles = ({ palette, type }) => ({
  tabWrap: {
    height: '100%'
  },
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '100px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255,255,255,.5)',
    zIndex: 1
  },
  leftSide: {
    maxHeight: '100%'
  },
  mediaInfoWrap: {
    borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
  }
})

const MediaDropLayout = ({ classes, tabName, playlistId, children }) => {
  const [isLoading, setLoading] = useState(true)
  const [media, setMedia] = useState([])

  const getMediaItem = useCallback(
    id => {
      const item = media.find(item => item.id === id)

      return item
    },
    [media]
  )
  return (
    <Grid container className={classes.tabWrap}>
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid item xs={5} className={classes.leftSide}>
        <PlaylistMediaSelector
          tabName={tabName}
          playlistId={playlistId}
          setLoading={setLoading}
          media={media}
          setMedia={setMedia}
        />
      </Grid>
      <Grid item xs={7} className={classes.mediaInfoWrap}>
        {children({ playlistId, getMediaItem })}
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(MediaDropLayout)
