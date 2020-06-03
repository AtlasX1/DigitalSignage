import React from 'react'
import { LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  loadingText: {
    width: '100%',
    textAlign: 'center',
    padding: '10px 5px 0'
  },
  loadingLinearProgress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%'
  }
})

const CanvasBgSettingLoader = ({ itemsLength }) => {
  const classes = useStyles()
  return (
    <>
      {!itemsLength && <div className={classes.loadingText}>Loading ...</div>}
      <div className={classes.loadingLinearProgress}>
        <LinearProgress variant="query" />
      </div>
    </>
  )
}
export default CanvasBgSettingLoader
