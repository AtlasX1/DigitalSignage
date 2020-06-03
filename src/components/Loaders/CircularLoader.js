import React from 'react'
import { CircularProgress, Grid, withStyles } from '@material-ui/core'

const styles = () => ({
  loaderWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,.5)',
    zIndex: 1
  }
})

function CircularLoader({ classes }) {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.loaderWrapper}
    >
      <CircularProgress size={30} thickness={5} />
    </Grid>
  )
}

export default withStyles(styles)(CircularLoader)
