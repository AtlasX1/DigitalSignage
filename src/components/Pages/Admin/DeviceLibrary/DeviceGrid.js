import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import { withStyles, Grid } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { TablePaper } from 'components/Paper'
import { DeviceCard } from 'components/Card'
import { TableLibraryFooter } from 'components/TableLibrary'
import { DeviceGridLoader } from 'components/Loaders'
import LoaderWrapper from 'components/LoaderWrapper'

import { roles } from 'utils/index'
import { useActions } from 'hooks/index'
import { getDeviceItemsAction } from 'actions/deviceActions'
import RemoveAlertsConfirm from 'components/Pages/Admin/DeviceLibrary/RemoveAlertsConfirm'
import {
  clearDisableDeviceAlertInfoAction,
  disableDeviceAlertAction
} from 'actions/alertActions'

const styles = () => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  tableWrapper: {
    padding: '5px 10px'
  },
  tableFooterWrap: {
    paddingLeft: '21px',
    backgroundColor: '#f9fafc',
    borderRadius: '0 0 8px 8px'
  },
  tableFooterCheckboxSelectAll: {
    marginRight: '10px'
  },
  tableFooterCircleIcon: {
    fontSize: '18px',
    color: '#adb7c9'
  }
})

const DeviceGrid = ({
  t,
  library,
  meta,
  filterParams,
  classes,
  getDeviceItemsAction,
  detailsReducer
}) => {
  const [disableDeviceAlertReducer] = useSelector(({ alert }) => [
    alert.disableDeviceAlert
  ])
  const [disableDeviceAlert, clearDisableDeviceAlertInfo] = useActions([
    disableDeviceAlertAction,
    clearDisableDeviceAlertInfoAction
  ])
  const [role, setRole] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [disableDeviceAlertModal, setDisableDeviceAlertModal] = useState({
    isOpen: false,
    alertName: null,
    deviceId: null
  })

  const { currentPage, lastPage, perPage } = meta

  useEffect(() => {
    if (detailsReducer.response) {
      setRole(roles.parse(detailsReducer.response.role))
    }
  }, [detailsReducer])

  useEffect(() => {
    const params = { ...filterParams }

    Object.keys(params).forEach(key => {
      params[key] === '' && delete params[key]
    })

    getDeviceItemsAction({
      ...params,
      page,
      limit: rowsPerPage
    })
  }, [getDeviceItemsAction, filterParams, page, rowsPerPage])

  useEffect(() => {
    if (library.response) {
      setData(library.response)
      setLoading(false)
    }
  }, [library])

  const handleSelectAllClick = useCallback(
    event => {
      if (event.target.checked) {
        const s = data.map(d => d.id)
        setSelected(s)
      } else {
        setSelected([])
      }
    },
    [setSelected, data]
  )
  const handlePageChange = useCallback(
    ({ selected }) => {
      setPage(selected + 1)
    },
    [setPage]
  )
  const handlePressJumper = useCallback(
    event => {
      if (event.target.value) {
        const page = parseInt(event.target.value, 10)
        setPage(page)
      }
    },
    [setPage]
  )
  const handleChangeRowsPerPage = useCallback(
    rowsPerPage => {
      setRowsPerPage(rowsPerPage)
    },
    [setRowsPerPage]
  )

  const openRemoveAlertsModalHandler = useCallback(
    (alertName, deviceId) => {
      setDisableDeviceAlertModal({
        isOpen: true,
        alertName: alertName,
        deviceId: deviceId
      })
    },
    [setDisableDeviceAlertModal]
  )

  const closeRemoveAlertsModalHandler = useCallback(() => {
    setDisableDeviceAlertModal({
      isOpen: false,
      alertName: null,
      deviceId: null
    })
  }, [setDisableDeviceAlertModal])

  const onRemoveAlertsModalClickHandler = useCallback(() => {
    disableDeviceAlert(disableDeviceAlertModal.deviceId)
  }, [disableDeviceAlertModal, disableDeviceAlert])

  const renderRemoveAlertsConfirm = useMemo(() => {
    return (
      <RemoveAlertsConfirm
        open={disableDeviceAlertModal.isOpen}
        handleClose={closeRemoveAlertsModalHandler}
        title={t('Remove alert confirm', {
          alertType: disableDeviceAlertModal.alertName
        })}
        handleClick={onRemoveAlertsModalClickHandler}
        reducer={disableDeviceAlertReducer}
        clearAction={clearDisableDeviceAlertInfo}
      />
    )
  }, [
    t,
    disableDeviceAlertModal,
    closeRemoveAlertsModalHandler,
    onRemoveAlertsModalClickHandler,
    disableDeviceAlertReducer,
    clearDisableDeviceAlertInfo
  ])

  const renderDeviceCards = useMemo(() => {
    return data.map(device => (
      <Grid item xs={3} key={`device-card-${device.id}`}>
        <DeviceCard
          role={role}
          id={device.id}
          device={device}
          selected={selected}
          isSelected={selected.includes(device.id)}
          setSelected={setSelected}
          handleAlertClick={openRemoveAlertsModalHandler}
        />
      </Grid>
    ))
  }, [data, role, selected, openRemoveAlertsModalHandler])

  return (
    <LoaderWrapper isLoading={isLoading} loader={<DeviceGridLoader />}>
      <TablePaper className={classes.root}>
        <Grid container className={classes.tableWrapper}>
          {renderDeviceCards}
        </Grid>
        <TableLibraryFooter
          page={currentPage}
          perPage={parseInt(perPage, 10)}
          pageCount={lastPage}
          data={data}
          selected={selected}
          rowsPerPage={rowsPerPage}
          handleSelect={handleSelectAllClick}
          onPageChange={handlePageChange}
          onPressJumper={handlePressJumper}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
        {renderRemoveAlertsConfirm}
      </TablePaper>
    </LoaderWrapper>
  )
}

DeviceGrid.propTypes = {
  library: PropTypes.object,
  classes: PropTypes.object
}

const mapStateToProps = ({ device, user }) => ({
  library: device.library,
  meta: device.meta,
  detailsReducer: user.details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceItemsAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(DeviceGrid))
  )
)
