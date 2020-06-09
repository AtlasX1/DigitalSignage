import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import Tooltip from 'components/Tooltip'
import { ClientSettingsSettingsLoader } from '../../Loaders'
import { CheckboxSwitcher } from '../../Checkboxes'
import { Card } from '../../Card'

const styles = ({ palette, type }) => ({
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
  },
  settingsCard: {
    borderTop: `1px solid ${palette[type].pages.accountSettings.card.border}`
  },
  defaultScreenWrap: {
    overflow: 'hidden',
    borderRadius: '20px',
    margin: '8px 0'
  },
  defaultScreenOption: {
    padding: '5px 25px',
    backgroundColor: 'rgba(134, 141, 157, 0.34)',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer'
  },
  defaultScreenOptionSelected: {
    backgroundColor: '#0378ba'
  },
  card: {
    background: 'transparent'
  }
})

const SettingsDetails = ({
  t,
  classes,
  loading,
  playbackReporting,
  defaultScreen,
  emergencyNotification,
  onChangePlayback,
  onChangeDefaultScreen,
  onChangeEmergencyNotifications
}) => {
  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader={true}
      title={t('Settings')}
      rootClassName={`${classes.settingsCard} ${classes.card}`}
    >
      {loading ? (
        <ClientSettingsSettingsLoader />
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
                {t('Playback Reporting')}
              </Typography>
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                value={playbackReporting}
                handleChange={onChangePlayback}
              />
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
                <Tooltip
                  title={t(
                    'Select failover content on a device when no active Schedule is present'
                  )}
                >
                  {t('Default Screen')}
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item>
              <Grid container className={classes.defaultScreenWrap}>
                <Typography
                  className={classNames(classes.defaultScreenOption, {
                    [classes.defaultScreenOptionSelected]:
                      defaultScreen.isDisplayBlackScreen
                  })}
                  onClick={() => onChangeDefaultScreen(true)}
                >
                  {t('Black')}
                </Typography>
                <Typography
                  className={classNames(classes.defaultScreenOption, {
                    [classes.defaultScreenOptionSelected]: !defaultScreen.isDisplayBlackScreen
                  })}
                  onClick={() => onChangeDefaultScreen(false)}
                >
                  {t('Image')}
                </Typography>
              </Grid>
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
                {t('Enable Desktop Emergency Notification')}
              </Typography>
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                value={emergencyNotification}
                handleChange={onChangeEmergencyNotifications}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Card>
  )
}

SettingsDetails.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(SettingsDetails))
