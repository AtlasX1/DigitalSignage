import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { createSelector } from 'reselect'
import classNames from 'classnames'
import { withSnackbar } from 'notistack'

import LoaderWrapper from 'components/LoaderWrapper'
import { CircularLoader } from 'components/Loaders'
import DeviceItemsCard from '../DeviceItemsCard'
import MediaItemsCard from '../MediaItemsCard'
import BottomActions from '../BottomActions'
import RecordInfoTooltip from '../RecordInfoTooltip'

import { capAlertDevicesSelector } from 'selectors/deviceSelectors'
import { mediaCapAlertSelector } from 'selectors/mediaSelectors'
import { associateCapAlertSelector } from 'selectors/alertSelectors'
import { getCapAlertDevices } from 'actions/deviceActions'
import { getMediaCapAlert } from 'actions/mediaActions'
import { associateCapAlert, resetAssociateCapAlert } from 'actions/alertActions'
import {
  isEmpty,
  isEqual,
  isFalsy,
  isSomeTruthy,
  isTruthy
} from 'utils/generalUtils'
import routeByName from 'constants/routes'
import getUrlPrefix from 'utils/permissionUrls'
import customSnackbar from 'hooks/useCustomSnackbar'

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
  },
  tabFooter: {
    height: '100%'
  }
})

const selector = createSelector(
  capAlertDevicesSelector,
  ({ isFetching, isFetched, items, error }) => ({
    isFetching,
    isFetched,
    items,
    error
  })
)

const mediaSelector = createSelector(
  mediaCapAlertSelector,
  ({ isFetching, isFetched, items, error }) => ({
    isMediaFetching: isFetching,
    isMediaFetched: isFetched,
    media: items,
    mediaError: error
  })
)

const associateSelector = createSelector(
  associateCapAlertSelector,
  ({ isFetching, isSuccess, error }) => ({
    isAssociateFetching: isFetching,
    isAssociateSuccess: isSuccess,
    associateError: error
  })
)

function CapAlertTab({ t, classes, enqueueSnackbar, closeSnackbar }) {
  const dispatch = useDispatch()
  const { isFetching, isFetched, items } = useSelector(selector)
  const { isMediaFetching, isMediaFetched, media } = useSelector(mediaSelector)
  const {
    isAssociateFetching,
    isAssociateSuccess,
    associateError
  } = useSelector(associateSelector)
  const [deviceId, setDeviceId] = useState([])
  const [mediaId, setMediaId] = useState(null)
  const [showError, setShowError] = useState(false)

  const devicesError = useMemo(() => isEmpty(deviceId), [deviceId])
  const mediaError = useMemo(() => isFalsy(mediaId), [mediaId])
  const emptyTitle = useMemo(() => t('List is empty'), [t])
  const showSnackbar = useMemo(() => {
    return customSnackbar(t, enqueueSnackbar, closeSnackbar)
  }, [t, enqueueSnackbar, closeSnackbar])

  useEffect(() => {
    if (isFalsy(isFetched)) {
      dispatch(getCapAlertDevices())
    }
  }, [dispatch, isFetched])

  useEffect(() => {
    if (isFalsy(isMediaFetched)) {
      dispatch(getMediaCapAlert())
    }
  }, [dispatch, isMediaFetched])

  useEffect(() => {
    return () => {
      dispatch(resetAssociateCapAlert())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAssociateSuccess) {
      showSnackbar('Successfully added')
    }
    if (associateError) {
      showSnackbar(associateError)
    }
  }, [isAssociateSuccess, associateError, showSnackbar])

  const handleMediaChange = useCallback(
    id => {
      setMediaId(prevState => {
        return isEqual(prevState, id) ? null : id
      })
    },
    [setMediaId]
  )

  const handleDevicesChange = useCallback(
    (value, id) => {
      setDeviceId(prevState => {
        return value
          ? [...prevState, id]
          : prevState.filter(selectedId => {
              return isFalsy(isEqual(selectedId, id))
            })
      })
    },
    [setDeviceId]
  )

  const handleSave = useCallback(
    password => {
      if (isSomeTruthy(devicesError, mediaError)) {
        return setShowError(true)
      }
      dispatch(
        associateCapAlert({
          mediaId,
          deviceId,
          password
        })
      )
    },
    [dispatch, devicesError, mediaError, setShowError, mediaId, deviceId]
  )

  const renderLoader = useMemo(() => {
    if (isFalsy(isAssociateFetching)) return null
    return <CircularLoader />
  }, [isAssociateFetching])

  if (isAssociateSuccess) {
    return <Redirect to={getUrlPrefix(routeByName.device.list)} />
  }

  return (
    <LoaderWrapper
      isLoading={isSomeTruthy(isFetching, isMediaFetching)}
      loader={<CircularLoader />}
    >
      {renderLoader}
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
                className={classNames(
                  'icon-interface-alert-triangle',
                  classes.tabHeaderIcon
                )}
              />
              {t('Associate CAP Alerts with devices')}
            </Typography>
          </header>
          <DeviceItemsCard
            title={t('Click devices to select')}
            data={items}
            selectedDevices={deviceId}
            onChange={handleDevicesChange}
            emptyTitle={emptyTitle}
            error={isTruthy(showError, devicesError)}
          />
          <MediaItemsCard
            data={media}
            onChange={handleMediaChange}
            selectedMedia={mediaId}
            error={isTruthy(showError, mediaError)}
          />
        </Grid>
        <Grid item>
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
              <BottomActions handleSave={handleSave} />
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
)(CapAlertTab)
