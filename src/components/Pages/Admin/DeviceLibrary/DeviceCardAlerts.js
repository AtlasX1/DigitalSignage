import React, { useCallback, useMemo } from 'react'
import { Grid, withStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

const styles = () => ({
  container: {
    height: 30,
    position: 'absolute',
    top: 20,
    left: 20
  },
  icon: {
    cursor: 'pointer'
  }
})

function DeviceCardAlerts({ classes, alertId, deviceId, handleAlertClick }) {
  const [alertTypes] = useSelector(({ config }) => [config.alertTypes.response])

  const triggeredAlert = useMemo(() => {
    return alertTypes.find(alert => alert.id === alertId) || {}
  }, [alertTypes, alertId])

  const onAlertClickHandler = useCallback(() => {
    handleAlertClick(triggeredAlert.name, deviceId)
  }, [handleAlertClick, triggeredAlert, deviceId])

  return (
    <Grid container className={classes.container}>
      <i
        onClick={onAlertClickHandler}
        className={classNames(triggeredAlert.icon, classes.icon)}
      />
    </Grid>
  )
}

export default withStyles(styles)(DeviceCardAlerts)
