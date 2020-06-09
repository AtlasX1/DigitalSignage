import React, { useEffect } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { get as _get } from 'lodash'

import { FormControlChips, FormControlInput } from 'components/Form'
import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { Scrollbars } from 'components/Scrollbars'
import RedoSchedule from './RedoShedule'

import { labelToSec, secToLabel } from 'utils/secToLabel'
import selectUtils from 'utils/select'

import * as tagsActions from 'actions/tagsActions'
import { getScheduleGroupsAction } from 'actions/scheduleActions'
import { TabToggleButton, TabToggleButtonGroup } from '../../../Buttons'

const deviceItem = (text, i, classes) => (
  <Grid
    key={`contents-item-${i}`}
    container
    className={classes.detailRow}
    justify="space-between"
    alignItems="center"
  >
    <Grid item>
      <Typography className={classes.detailLabel}>{text}</Typography>
    </Grid>
  </Grid>
)

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
      height: '100%'
    },
    detailRow: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    detailLabel: {
      color: '#74809a',
      lineHeight: '42px'
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
      height: 115,
      overflow: 'auto'
    },
    fieldError: {
      color: 'red',
      border: `solid 5px #ce3636`,
      background: '#dc8383'
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
    },
    reactSelectContainer: {
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    noPadding: {
      padding: 0
    }
  }
}

const ScheduleInfo = props => {
  const {
    t,
    classes,
    handleValueChange = (f, v) => {},
    values,
    errors,
    touched,
    selectedDevices
  } = props

  const dispatchAction = useDispatch()

  const groups = useSelector(({ schedule }) =>
    _get(schedule, 'groups.response.data')
  )
  const tags = useSelector(({ tags }) => _get(tags, 'items.response'))

  useEffect(
    () => {
      dispatchAction(
        getScheduleGroupsAction({
          limit: 9999
        })
      )
      dispatchAction(
        tagsActions.getItems({
          limit: 9999
        })
      )
    },
    // eslint-disable-next-line
    []
  )

  const totalDuration = secToLabel(
    values.scheduleContent
      .map(i => labelToSec(i.duration))
      .reduce((a, b) => a + b, 0)
  )

  const handleChangeRedoSchedule = value => {
    Object.keys(value).forEach(key => {
      handleValueChange(key, value[key])
    })
  }

  const handleStatusChange = val => {
    if (val) {
      handleValueChange('status', 'Active')
    } else handleValueChange('status', 'Inactive')
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
          value={values.scheduleType}
          onChange={(e, value) =>
            value && handleValueChange('scheduleType', value)
          }
        >
          <TabToggleButton value="Timed">{t('Timed')}</TabToggleButton>
          <TabToggleButton value="Failover">{t('Failover')}</TabToggleButton>
        </TabToggleButtonGroup>
      </Grid>

      <Card
        icon={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        removeSidePaddings={true}
        headerSidePaddings={true}
        rootClassName={classes.noPadding}
        removeNegativeHeaderSideMargins={true}
        title={t('Schedule Info').toUpperCase()}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerText]}
      >
        <Grid
          container
          className={classes.scheduleInfoRow}
          style={{ margin: '0 0 -20px 0' }}
        >
          <Grid item xs={4} className={classes.mediaStatus}>
            <Typography className={classes.boldTitle}>{t('Status')}</Typography>
            <CheckboxSwitcher
              label={t(values.status)}
              value={values.status === 'Active'}
              handleChange={handleStatusChange}
            />
          </Grid>
          <Grid item xs={8} className={classes.mediaNameTitle}>
            <FormControlInput
              id="media-name-title"
              label={t('Name / Title')}
              value={values.title}
              error={errors.title}
              touched={touched.title}
              handleChange={e => handleValueChange('title', e.target.value)}
              fullWidth={true}
            />
          </Grid>
        </Grid>

        {values.scheduleType === 'Timed' && (
          <RedoSchedule
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChangeRedoSchedule}
          />
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
            className={[
              classes.contentsCard,
              errors.scheduleContent && touched.scheduleContent
                ? classes.fieldError
                : ''
            ].join(' ')}
          >
            <Grid item className={classes.contentsCardHeader}>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography className={classes.boldTitle}>
                    {t('Content')}
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

            <Grid item className={classes.contentsList}>
              {!!!values.scheduleContent.length && (
                <Typography className={classes.noSelectedDevices}>
                  <i
                    className={`icon-interface-alert-triangle ${classes.noSelectedDevicesIcon}`}
                  />
                  {t('Content must be selected before scheduling')}
                </Typography>
              )}

              <Scrollbars>
                {!!values.scheduleContent.length &&
                  values.scheduleContent.map((content, index) => (
                    <Grid
                      key={`contents-item-${index}`}
                      container
                      className={classes.detailRow}
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography className={classes.detailLabel}>
                          {content.title}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography className={classes.detailValue}>
                          {content.duration}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Scrollbars>
            </Grid>
          </Grid>
        </div>

        <div className={classes.scheduleInfoRow}>
          <Grid
            container
            direction="column"
            wrap="nowrap"
            className={[
              classes.devicesCard,
              errors.deviceList && touched.deviceList ? classes.fieldError : ''
            ].join(' ')}
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
              <Scrollbars>
                {(!!!values.deviceList.length || !!!selectedDevices.length) && (
                  <Typography className={classes.noSelectedDevices}>
                    <i
                      className={`icon-interface-alert-triangle ${classes.noSelectedDevicesIcon}`}
                    />
                    {t('Devices must be selected before scheduling')}
                  </Typography>
                )}
                {!!selectedDevices.length
                  ? selectedDevices.map((device, index) =>
                      deviceItem(device.name, index, classes)
                    )
                  : !!values.deviceList.length
                  ? values.deviceList.map((deviceId, index) =>
                      deviceItem(deviceId, index, classes)
                    )
                  : null}
              </Scrollbars>
            </Grid>
          </Grid>
        </div>

        <div className={classes.scheduleInfoRow}>
          <FormControlChips
            isMulti={false}
            customClass={classes.reactSelectContainer}
            label={t('Create New / Add to Group')}
            options={selectUtils.convertArr(groups, selectUtils.toChipObj)}
            values={values.group.value ? values.group.value : values.group}
            handleChange={e => {
              const group = selectUtils
                .convertArr(groups, selectUtils.toChipObj)
                .find(i => i.value === e.target.value)
              handleValueChange('group', [group])
            }}
            error={errors.group}
            touched={touched.group}
          />
        </div>

        <div className={classes.scheduleInfoRow}>
          <FormControlChips
            customClass={classes.reactSelectContainer}
            label={t('Add Tags')}
            options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
            values={values.tag}
            error={errors.tag}
            touched={touched.tag}
            handleChange={e => handleValueChange('tag', e.target.value)}
            marginBottom={0}
          />
        </div>
      </Card>
    </>
  )
}

export default translate('translations')(withStyles(styles)(ScheduleInfo))
