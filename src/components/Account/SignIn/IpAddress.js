import React from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { useIpAddress } from 'hooks/index'

function styles() {
  return {
    ipAddress: {
      marginBottom: '30px',
      color: '#74809a'
    }
  }
}

function IpAddress({ t, classes }) {
  const ip = useIpAddress()
  return (
    <Grid item>
      <Typography align="center" className={classes.ipAddress}>
        {t('Your IP address is being logged as', { IP: ip })}
      </Typography>
    </Grid>
  )
}

export default compose(translate('translations'), withStyles(styles))(IpAddress)
