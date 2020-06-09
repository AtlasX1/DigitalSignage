import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { translate } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { compose } from 'redux'
import { withSnackbar } from 'notistack'
import classNames from 'classnames'
import { createSelector } from 'reselect'
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  TableBody
} from '@material-ui/core'
import { BlueButton, CircleIconButton } from 'components/Buttons'
import AlertMediaLibrary from './AlertMediaLibrary'
import { CircularLoader } from 'components/Loaders'

import {
  getDeviceMediaEmergencyAlert,
  clearGetDeviceMediaEmergencyAlertInfo
} from 'actions/alertActions'
import { useCustomSnackbar } from 'hooks/index'
import { alertTypesSelectors } from 'selectors/configSelectors'
import { deviceMediaEmergencyAlertSelector } from 'selectors/alertSelectors'
import { isEmpty, isEqual, isFalsy } from 'utils/generalUtils'

const styles = ({ type, palette }) => ({
  table: {
    width: '100%'
  },
  tableHead: {
    background: palette[type].table.head.background
  },
  tableHeadText: {
    fontWeight: 600,
    color: palette[type].table.head.color
  },
  tableRow: {
    display: 'flex',
    whiteSpace: 'nowrap'
  },
  tableCell: {
    border: 'none',
    borderColor: palette[type].table.head.border,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    color: palette[type].table.body.cell.color,
    width: '33.3%',
    height: 45,
    maxHeight: 45,
    padding: '0 56px 0 24px',
    display: 'flex',
    alignItems: 'center',

    '&:last-child': {
      borderRight: 'none'
    }
  },
  tableCellFullWidth: {
    width: '100%'
  },
  noFoundText: {
    width: '100%',
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette[type].table.body.cell.color
  },
  tableContainer: {
    marginBottom: 20
  },
  circleIcon: {
    padding: 10,
    color: '#afb7c7',
    transform: 'scale(0.9)'
  }
})

const selector = createSelector(
  alertTypesSelectors,
  deviceMediaEmergencyAlertSelector,
  (alertTypes, emergencyAlertRequest) => [
    alertTypes.response,
    emergencyAlertRequest
  ]
)

function SingleRow({ classes, id, name, getTitle, onClick }) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell} align="center">
        {name}
      </TableCell>
      <TableCell className={classes.tableCell} align="center">
        {getTitle(id)}
      </TableCell>
      <TableCell className={classes.tableCell} align="center">
        <CircleIconButton
          className={classNames('hvr-grow', classes.circleIcon)}
          onClick={handleClick}
        >
          <i className="icon-pencil-3" />
        </CircleIconButton>
      </TableCell>
    </TableRow>
  )
}

const SingleRowMemoized = memo(SingleRow)

function EmergencyAlert({ t, id, classes, enqueueSnackbar, closeSnackbar }) {
  const dispatch = useDispatch()
  const [alertTypes, emergencyAlertRequest] = useSelector(selector)
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [items, setItems] = useState([])
  const [dialog, setDialog] = useState(false)
  const [alertId, setAlertId] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(getDeviceMediaEmergencyAlert(id))
    return () => {
      dispatch(clearGetDeviceMediaEmergencyAlertInfo())
    }
  }, [id, dispatch])

  useEffect(() => {
    const { response } = emergencyAlertRequest
    if (response) {
      setLoading(false)
      setItems(response)
    }
  }, [emergencyAlertRequest, setItems, setLoading])

  const getMediaTitle = useCallback(
    id => {
      const item = items.find(item => isEqual(item.alertType.id, id))
      return item ? item.media.title : 'N/A'
    },
    [items]
  )

  const getMediaId = useCallback(
    id => {
      const item = items.find(item => isEqual(item.alertType.id, id))
      return item ? item.media.id : null
    },
    [items]
  )

  const openDialog = useCallback(
    id => {
      setAlertId(id)
      setDialog(true)
    },
    [setAlertId, setDialog]
  )

  const renderRows = useMemo(() => {
    if (isEmpty(alertTypes)) {
      return (
        <TableRow className={classes.tableRow}>
          <TableCell
            className={classNames(
              classes.tableCell,
              classes.tableCellFullWidth
            )}
          >
            <Typography className={classes.noFoundText}>
              {t('No Records Found')}
            </Typography>
          </TableCell>
        </TableRow>
      )
    }
    return alertTypes.map(({ id, name }) => (
      <SingleRowMemoized
        key={id}
        id={id}
        name={name}
        classes={classes}
        getTitle={getMediaTitle}
        onClick={openDialog}
      />
    ))
  }, [t, alertTypes, getMediaTitle, openDialog, classes])

  const closeDialog = useCallback(() => {
    setDialog(false)
  }, [setDialog])

  const handleFail = useCallback(() => {
    showSnackbar(t('Error'))
  }, [showSnackbar, t])

  const handleSuccess = useCallback(() => {
    showSnackbar(t('Successfully added'))
    closeDialog()
  }, [showSnackbar, t, closeDialog])

  const renderDialog = useMemo(() => {
    if (isFalsy(dialog)) return null
    return (
      <AlertMediaLibrary
        id={alertId}
        deviceId={id}
        open={dialog}
        selectedMediaId={getMediaId(alertId)}
        handleClose={closeDialog}
        onFail={handleFail}
        onSuccess={handleSuccess}
      />
    )
  }, [dialog, alertId, id, getMediaId, closeDialog, handleFail, handleSuccess])

  const renderLoader = useMemo(() => {
    if (isFalsy(isLoading)) return null
    return <CircularLoader />
  }, [isLoading])

  return (
    <Grid container direction="column">
      {renderLoader}
      <Grid container direction="column" className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCell} align="center">
                <Typography className={classes.tableHeadText}>
                  {t('Alert type').toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell} align="center">
                <Typography className={classes.tableHeadText}>
                  {t('Media').toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell} align="center" />
            </TableRow>
          </TableHead>
          <TableBody>{renderRows}</TableBody>
        </Table>
      </Grid>
      <Grid container justify="flex-end">
        <BlueButton>{t('OK')}</BlueButton>
      </Grid>
      {renderDialog}
    </Grid>
  )
}

export default memo(
  compose(
    translate('translations'),
    withStyles(styles),
    withSnackbar
  )(EmergencyAlert)
)
