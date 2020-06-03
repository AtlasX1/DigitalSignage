import React, { useState, useEffect, useCallback } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
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

import {
  getDeviceMediaEmergencyAlert,
  clearGetDeviceMediaEmergencyAlertInfo
} from 'actions/alertActions'
import { useCustomSnackbar } from 'hooks/index'

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
    borderBottomWidth: 2,
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
    padding: '4px',
    color: '#afb7c7',
    transform: 'scale(0.9)'
  }
})

const EmergencyAlert = ({
  t,
  id,
  classes,
  alertTypesReducer,
  deviceMediaEmergencyAlertReducer,
  getDeviceMediaEmergencyAlert,
  clearGetDeviceMediaEmergencyAlertInfo,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [data, setData] = useState([])
  const [emergencyAlert, setEmergencyAlert] = useState([])
  const [dialog, setDialog] = useState(false)
  const [alertId, setAlertId] = useState(null)

  useEffect(() => {
    if (!deviceMediaEmergencyAlertReducer.response) {
      getDeviceMediaEmergencyAlert(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (alertTypesReducer.response) {
      setData(alertTypesReducer.response)
    }
    // eslint-disable-next-line
  }, [alertTypesReducer])

  useEffect(() => {
    if (deviceMediaEmergencyAlertReducer.response) {
      setEmergencyAlert(deviceMediaEmergencyAlertReducer.response)
      clearGetDeviceMediaEmergencyAlertInfo()
    } else if (deviceMediaEmergencyAlertReducer.error) {
      clearGetDeviceMediaEmergencyAlertInfo()
    }
    // eslint-disable-next-line
  }, [deviceMediaEmergencyAlertReducer])

  const findAlertMedia = useCallback(
    id => {
      const item = emergencyAlert.find(e => e.alertType.id === id)
      return item ? item.media : { title: 'Na' }
    },
    [emergencyAlert]
  )

  const openDialog = useCallback(
    id => {
      setAlertId(id)
      setDialog(true)
    },
    [setAlertId, setDialog]
  )

  return (
    <Grid container direction="column">
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
          {!!data.length && (
            <TableBody>
              {data.map(a => (
                <TableRow className={classes.tableRow} key={a.id}>
                  <TableCell className={classes.tableCell} align="center">
                    {a.name}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {findAlertMedia(a.id).title}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    <CircleIconButton
                      className={['hvr-grow', classes.circleIcon].join(' ')}
                      onClick={() => openDialog(a.id)}
                    >
                      <i className="icon-pencil-3" />
                    </CircleIconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {!data.length && (
          <Typography className={classes.noFoundText}>
            {t('No Records Found')}
          </Typography>
        )}
      </Grid>

      <Grid container justify="flex-end">
        <BlueButton>{t('OK')}</BlueButton>
      </Grid>

      {dialog && (
        <AlertMediaLibrary
          id={alertId}
          deviceId={id}
          open={dialog}
          selectedMediaId={findAlertMedia(alertId).id}
          handleClose={() => setDialog(false)}
          onFail={() => showSnackbar(t('Error'))}
          onSuccess={() => showSnackbar(t('Successfully added'))}
        />
      )}
    </Grid>
  )
}

const mapStateToProps = ({ config, alert }) => ({
  alertTypesReducer: config.alertTypes,
  deviceMediaEmergencyAlertReducer: alert.deviceMediaEmergencyAlert
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceMediaEmergencyAlert,
      clearGetDeviceMediaEmergencyAlertInfo
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(EmergencyAlert)
