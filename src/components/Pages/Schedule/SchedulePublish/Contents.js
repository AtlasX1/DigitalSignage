import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import MediaList from './MediaList'
import PlaybackContent from './PlaybackContent'

const styles = {
  contentsCardContainer: {
    height: 'calc(100% - 66px)'
  },
  mediaListItem: {
    height: '100%'
  }
}

const Contents = props => {
  const {
    classes,
    media,
    getMediaItem,
    handleTypeChange,
    type,
    handlePageChange,
    handleValueChange,
    page,
    loading,
    values,
    errors,
    touched
  } = props

  return (
    <Grid container className={classes.contentsCardContainer}>
      <Grid item xs={5} className={classes.mediaListItem}>
        <MediaList
          media={media}
          handleTypeChange={handleTypeChange}
          type={type}
          onPageChange={handlePageChange}
          page={page}
          loading={loading}
          values={values}
          errors={errors}
          touched={touched}
        />
      </Grid>
      <Grid item xs={7}>
        <PlaybackContent
          media={media}
          type={type}
          getMediaItem={getMediaItem}
          handleValueChange={handleValueChange}
          values={values}
          errors={errors}
          touched={touched}
        />
      </Grid>
    </Grid>
  )
}

Contents.propTypes = {
  classes: PropTypes.object,
  media: PropTypes.object,
  getMediaItem: PropTypes.func
}

export default withStyles(styles)(Contents)
