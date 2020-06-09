import React from 'react'
import { translate } from 'react-i18next'
import { withStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { compose } from 'redux'

const styles = ({ palette, type }) => ({
  recordInfoTooltipWrap: {
    paddingLeft: 55,
    background: palette[type].pages.devices.alerts.tabs.recordInfo.background
  },
  recordInfoTooltipText: {
    lineHeight: '60px',
    color: palette[type].pages.devices.alerts.tabs.recordInfo.color
  },
  recordInfoTooltipIcon: {
    marginRight: 20,
    fontSize: 24,
    lineHeight: '60px'
  }
})

function RecordInfoTooltip({ t, classes }) {
  return (
    <div className={classes.recordInfoTooltipWrap}>
      <Typography className={classes.recordInfoTooltipText}>
        <i
          className={classNames(
            'icon-interface-information',
            classes.recordInfoTooltipIcon
          )}
        />
        {t('Your IP Address and Current Time will be recorded', {
          IP: '67.225.171.7',
          currentTime: '2018-10-29 23:11:22'
        })}
      </Typography>
    </div>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(RecordInfoTooltip)
