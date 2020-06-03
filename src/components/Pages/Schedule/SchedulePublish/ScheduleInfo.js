import React, { useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlInput, FormControlSelect } from '../../../Form'
import { Card } from '../../../Card'
import { CheckboxSwitcher } from '../../../Checkboxes'
import RedoSchedule from './RedoShedule'
import { TabToggleButtonGroup, TabToggleButton } from 'components/Buttons'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      margin: '0 20px',
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].sideModal.groups.header.background
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.groups.header.titleColor
    },
    scheduleInfoRow: {
      margin: '20px 0',
      padding: '0 20px'
    },
    tabsWrap: {
      marginBottom: '20px'
    },
    scheduleInfoCard: {
      padding: '20px',
      border: `1px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.groups.header.background
    },
    boldTitle: {
      fontWeight: 'bold',
      color: palette[type].pages.schedule.boldTitle
    },
    mediaStatus: {
      paddingTop: '10px',
      paddingLeft: '15px'
    },
    mediaNameTitle: {
      marginLeft: '20px',
      paddingTop: '10px',
      paddingLeft: '20px',
      borderLeft: `1px solid ${palette[type].sideModal.content.border}`
    },
    playTimeTitle: {
      lineHeight: '28px'
    },
    playTimeCheckbox: {
      height: '28px'
    },
    daysSelectCard: {
      padding: '10px 15px'
    },
    daysSelectHeader: {
      marginBottom: '10px'
    },
    daysSelectTitle: {
      lineHeight: '28px'
    },
    daysSelectCheckbox: {
      height: '28px'
    },
    contentsCardWrap: {
      height: '170px'
    },
    contentsCard: {
      height: '100%',
      borderRadius: '4px',
      border: `solid 5px ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.groups.header.background
    },
    contentsCardHeader: {
      padding: '15px 15px 10px',
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`
    },
    contentsTotal: {
      fontSize: '11px',
      color: '#0378ba'
    },
    contentsList: {
      overflowX: 'auto'
    },
    detailRow: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    detailLabel: {
      color: '#74809a'
    },
    detailValue: {
      lineHeight: '42px',
      fontWeight: 'bold',
      color: '#0f2147'
    },
    devicesCard: {
      height: '100%',
      borderRadius: '4px',
      border: `solid 5px ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.groups.header.background
    },
    devicesCardHeader: {
      padding: '15px 15px 10px',
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`
    },
    devicesList: {
      padding: '15px'
    },
    noSelectedDevices: {
      borderRadius: '4px',
      backgroundColor: '#fff9f0',
      fontSize: '14px',
      lineHeight: '65px',
      color: '#f5a623',
      textAlign: 'center'
    },
    noSelectedDevicesIcon: {
      fontSize: '20px',
      color: '#f5a623'
    }
  }
}

const PlaylistInformation = ({ t, classes }) => {
  const [scheduleType, setScheduleType] = useState('timed')
  const totalDuration = '00:05:35'
  const contents = [
    {
      label: 'Title',
      duration: '00:00:55'
    },
    {
      label: 'Tips For Designing An Effective Business Card',
      duration: '00:00:25'
    },
    {
      label: 'Buy Youtube Views',
      duration: '00:00:55'
    },
    {
      label: 'Title',
      duration: '00:00:55'
    },
    {
      label: 'Tips For Designing An Effective Business Card',
      duration: '00:00:25'
    }
  ]
  const handleChangeRedoSchedule = value => {
    // TODO implement logic
  }

  const toggleScheduleType = value => {
    setScheduleType(value)
  }

  return (
    <>
      <Grid
        className={classes.tabsWrap}
        container
        alignContent="center"
        justify="center"
      >
        <TabToggleButtonGroup
          exclusive
          value={scheduleType}
          onChange={(_, value) => toggleScheduleType(value)}
        >
          <TabToggleButton value="timed">{t('Timed')}</TabToggleButton>
          <TabToggleButton value="failover">{t('Failover')}</TabToggleButton>
        </TabToggleButtonGroup>
      </Grid>

      <Card
        icon={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        removeSidePaddings={true}
        headerSidePaddings={true}
        removeNegativeHeaderSideMargins={true}
        title={t('Schedule Info').toUpperCase()}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerText]}
      >
        <Grid container className={classes.scheduleInfoRow}>
          <Grid item className={classes.mediaStatus}>
            <Typography className={classes.boldTitle}>{t('Status')}</Typography>
            <CheckboxSwitcher label={t('Active')} />
          </Grid>
          <Grid item xs className={classes.mediaNameTitle}>
            <FormControlInput
              id="media-name-title"
              label={t('Name / Title')}
              fullWidth={true}
            />
          </Grid>
        </Grid>

        {scheduleType === 'timed' && (
          <RedoSchedule handleChange={handleChangeRedoSchedule} />
        )}

        <div
          className={[classes.scheduleInfoRow, classes.contentsCardWrap].join(
            ' '
          )}
        >
          <Grid
            container
            direction="column"
            wrap="nowrap"
            className={classes.contentsCard}
          >
            <Grid item className={classes.contentsCardHeader}>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography className={classes.boldTitle}>
                    {t('Contents')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={[classes.boldTitle, classes.contentsTotal].join(
                      ' '
                    )}
                  >
                    {t('Total duration', { totalDuration })}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Scrollbars>
              <Grid item className={classes.contentsList}>
                {contents.map((content, index) => (
                  <Grid
                    key={`contents-item-${index}`}
                    container
                    className={classes.detailRow}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography className={classes.detailLabel}>
                        {content.label}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.detailValue}>
                        {content.duration}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Scrollbars>
          </Grid>
        </div>

        <div className={classes.scheduleInfoRow}>
          <Grid
            container
            direction="column"
            wrap="nowrap"
            className={classes.devicesCard}
          >
            <Grid item className={classes.devicesCardHeader}>
              <Grid container>
                <Grid item>
                  <Typography className={classes.boldTitle}>
                    {t('Devices')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.devicesList}>
              <Typography className={classes.noSelectedDevices}>
                <i
                  className={`icon-interface-alert-triangle ${classes.noSelectedDevicesIcon}`}
                />
                {t('Devices must be selected before scheduling')}
              </Typography>
            </Grid>
          </Grid>
        </div>

        <div className={classes.scheduleInfoRow}>
          <FormControlSelect
            id="group"
            fullWidth={true}
            label={t('Create New / Add to Group')}
          />
        </div>

        <div className={classes.scheduleInfoRow}>
          <FormControlSelect id="tags" fullWidth={true} label={t('Add Tags')} />
        </div>
      </Card>
    </>
  )
}

export default translate('translations')(
  withStyles(styles)(PlaylistInformation)
)
