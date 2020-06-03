import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'

import { ClientSettingsSecurityLoader } from 'components/Loaders'
import { Card } from 'components/Card'
import { durationToTimeSpan } from 'utils'

const styles = ({ palette, type }) => ({
  card: {
    background: 'transparent'
  },
  detailRow: {
    borderBottom: `1px solid ${palette[type].pages.accountSettings.clientDetails.row.border}`
  },
  detailLabel: {
    color: '#74809a',
    lineHeight: '42px'
  },
  detailValue: {
    lineHeight: '42px',
    fontWeight: 'bold',
    color: palette[type].pages.accountSettings.clientDetails.row.valueColor
  }
})

const SecuritySettingsDetails = ({
  t,
  classes,
  is2faEnabled,
  autoLogoutTime,
  loading
}) => {
  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      title={t('Security Settings').toUpperCase()}
      rootClassName={classes.card}
    >
      {loading ? (
        <ClientSettingsSecurityLoader />
      ) : (
        <>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Two Factor Authentication(2FA)')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {is2faEnabled ? 'Enabled' : 'Disabled'}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Auto logout ( 24min - 8hr )')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {durationToTimeSpan(autoLogoutTime)}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Card>
  )
}

SecuritySettingsDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate('translations')(
  withStyles(styles)(SecuritySettingsDetails)
)
