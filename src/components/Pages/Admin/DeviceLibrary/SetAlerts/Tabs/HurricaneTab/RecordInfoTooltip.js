import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    recordInfoTooltipWrap: {
      paddingLeft: '55px',
      background: palette[type].pages.devices.alerts.tabs.recordInfo.background
    },
    recordInfoTooltipText: {
      lineHeight: '60px',
      color: palette[type].pages.devices.alerts.tabs.recordInfo.color
    },
    recordInfoTooltipIcon: {
      marginRight: '20px',
      fontSize: '24px',
      lineHeight: '60px'
    }
  }
}

const RecordInfoTooltip = ({ t, classes }) => (
  <div className={classes.recordInfoTooltipWrap}>
    <Typography className={classes.recordInfoTooltipText}>
      <i
        className={`icon-interface-information ${classes.recordInfoTooltipIcon}`}
      />
      {t('Your IP Address and Current Time will be recorded', {
        IP: '67.225.171.7',
        currentTime: '2018-10-29 23:11:22'
      })}
    </Typography>
  </div>
)

export default translate('translations')(withStyles(styles)(RecordInfoTooltip))
