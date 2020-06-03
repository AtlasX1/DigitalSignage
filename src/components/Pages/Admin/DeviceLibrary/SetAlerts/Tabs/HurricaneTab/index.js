import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { useSelector } from 'react-redux'
import { compose } from 'redux'
import { withSnackbar } from 'notistack'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { isEmpty } from 'lodash'

import RecordInfoTooltip from './RecordInfoTooltip'
import HurricaneTabActions from './HurricaneTabActions'
import ItemsCard from '../ItemsCard'
import LoaderWrapper from 'components/LoaderWrapper'
import { CircularLoader } from 'components/Loaders'

import {
  getAlertDevicesByIdAction,
  clearGetAlertDevicesByIdInfoAction,
  postAlertTriggerAction,
  clearPostAlertTriggerInfoAction
} from 'actions/alertActions'
import { useActions, useCustomSnackbar } from 'hooks/index'
import { capitalize, getUrlPrefix } from 'utils/index'
import { routeByName } from 'constants/index'

const styles = ({ palette, type }) => ({
  tabWrap: {
    height: '100%',
    padding: '40px 0 0',
    borderTop: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabContentWrap: {
    padding: '0 30px',
    height: 'calc(100% - 166px)',
    maxHeight: 'calc(100% - 166px)'
  },
  tabFooterWrap: {},
  tabFooter: {
    height: '100%'
  },
  tabHeader: {
    marginBottom: '20px'
  },
  tabHeaderText: {
    fontSize: '14px',
    color: '#c07c0c'
  },
  tabHeaderIcon: {
    fontSize: '24px',
    marginRight: '10px',
    color: '#f5a623'
  }
})

const HurricaneTab = ({
  t,
  classes,
  match,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [
    alertTypes,
    alertDevicesReducer,
    postAlertTriggerReducer
  ] = useSelector(({ config, alert }) => [
    config.alertTypes.response,
    alert.alertDevices,
    alert.postAlertTrigger
  ])
  const [
    getAlertDevicesById,
    clearGetAlertDevicesByIdInfo,
    postAlertTrigger,
    clearPostAlertTriggerInfo
  ] = useActions([
    getAlertDevicesByIdAction,
    clearGetAlertDevicesByIdInfoAction,
    postAlertTriggerAction,
    clearPostAlertTriggerInfoAction
  ])

  const alertType = useMemo(() => match.params.id, [match.params.id])

  const [isLoading, setIsLoading] = useState(true)
  const [currentAlertId, setCurrentAlertId] = useState(null)
  const [selectedDevices, setSelectedDevices] = useState([])
  const [data, setData] = useState({
    readyToGo: [],
    disabledFeature: [],
    withoutMedia: []
  })

  const handleSelectDevice = useCallback(
    (value, id) => {
      if (value) {
        setSelectedDevices(
          update(selectedDevices, {
            $push: [id]
          })
        )
      } else {
        const i = selectedDevices.indexOf(id)
        setSelectedDevices(
          update(selectedDevices, {
            $splice: [[i, 1]]
          })
        )
      }
    },
    [setSelectedDevices, selectedDevices]
  )

  useEffect(() => {
    if (!isEmpty(alertTypes)) {
      const alertId = alertTypes.find(a => a.name.toLowerCase() === alertType)
        .id

      setIsLoading(true)
      setCurrentAlertId(alertId)
      getAlertDevicesById(alertId)
    }
    // eslint-disable-next-line
  }, [alertTypes, alertType])

  useEffect(() => {
    if (alertDevicesReducer.response) {
      setData(alertDevicesReducer.response)
      clearGetAlertDevicesByIdInfo()

      setIsLoading(false)
    } else if (alertDevicesReducer.error) {
      clearGetAlertDevicesByIdInfo()
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [alertDevicesReducer])

  const handleSaveClick = useCallback(
    password => {
      postAlertTrigger({
        id: currentAlertId,
        data: {
          deviceId: selectedDevices,
          password: password
        }
      })
    },
    [postAlertTrigger, currentAlertId, selectedDevices]
  )

  useEffect(() => {
    if (postAlertTriggerReducer.response) {
      clearPostAlertTriggerInfo()
      showSnackbar(t('Successfully changed'))
      history.push(getUrlPrefix(routeByName.device.list))

      setSelectedDevices([])
    } else if (postAlertTriggerReducer.error) {
      clearPostAlertTriggerInfo()
      showSnackbar(t('Password incorrect'))
    }
    // eslint-disable-next-line
  }, [postAlertTriggerReducer])

  return (
    <LoaderWrapper isLoading={isLoading} loader={<CircularLoader />}>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        className={classes.tabWrap}
      >
        <Grid item className={classes.tabContentWrap}>
          <header className={classes.tabHeader}>
            <Typography className={classes.tabHeaderText}>
              <i
                className={`icon-interface-alert-triangle ${classes.tabHeaderIcon}`}
              />
              {t('Alert trigger message for alert types', {
                alertType: capitalize(alertType)
              })}
            </Typography>
          </header>

          <ItemsCard
            title={t('Devices on which alert will be triggered')}
            data={data.readyToGo}
            selectedDevices={selectedDevices}
            handleChange={handleSelectDevice}
            emptyTitle={t('List is empty')}
          />

          <ItemsCard
            title={t('Devices with no media associated')}
            helpText={t('(Alert will not be triggered on following device(s))')}
            data={data.withoutMedia}
            noToggles
            emptyTitle={t('List is empty')}
          />
        </Grid>
        <Grid item className={classes.tabFooterWrap}>
          <Grid
            container
            direction="column"
            alignContent="stretch"
            justify="flex-end"
            className={classes.tabFooter}
          >
            <Grid item>
              <RecordInfoTooltip />
            </Grid>
            <Grid item>
              <HurricaneTabActions handleSave={handleSaveClick} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LoaderWrapper>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar
)(HurricaneTab)
