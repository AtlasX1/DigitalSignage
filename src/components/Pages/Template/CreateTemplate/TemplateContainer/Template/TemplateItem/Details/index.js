import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { withStyles, Grid, Dialog } from '@material-ui/core'

import MediaDetails from './MediaDetails'
import TouchContent from './TouchContent'

const styles = {
  detailsWrap: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 111
  },
  detailsContainer: {
    display: 'flex'
  }
}

const Details = props => {
  const {
    classes,
    detailsType,
    open = false,
    closeHandler = f => f,
    itemId,
    featureId,
    title,
    media,
    touch
  } = props
  const isMediaDetails = detailsType === 'mediaDetails'
  const isTouchContent = detailsType === 'touchContent'

  return (
    <Dialog open={open} onClose={closeHandler} disableBackdropClick>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.detailsWrap}
      >
        <Grid item className={classes.detailsContainer}>
          {isMediaDetails && (
            <MediaDetails
              itemData={{
                itemId,
                featureId,
                title,
                media
              }}
              closeHandler={closeHandler}
            />
          )}
          {isTouchContent && (
            <TouchContent
              closeHandler={closeHandler}
              itemData={{
                touch
              }}
            />
          )}
        </Grid>
      </Grid>
    </Dialog>
  )
}

Details.propTypes = {
  detailsType: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func
}

export default translate('translations')(withStyles(styles)(Details))
