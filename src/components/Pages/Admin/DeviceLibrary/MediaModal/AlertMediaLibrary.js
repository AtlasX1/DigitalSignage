import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import {
  withStyles,
  Dialog,
  Typography,
  IconButton,
  Table,
  Grid,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from '@material-ui/core'
import { ModalPaper } from 'components/Paper'
import { Close as CloseIcon } from '@material-ui/icons'
import { BlueButton } from 'components/Buttons'
import { CircularLoader } from 'components/Loaders'

import {
  getMediaItemsAction,
  clearGetMediaItemsInfoAction
} from 'actions/mediaActions'
import {
  putDeviceMediaEmergencyAlertAction,
  clearPutDeviceMediaEmergencyAlertInfoAction,
  getDeviceMediaEmergencyAlert
} from 'actions/alertActions'
import { isEmpty, isEqual, isFalsy, takeTruth } from 'utils/generalUtils'

const styles = ({ palette, type }) => ({
  dialogPaper: {
    overflow: 'visible',
    background: 'transparent',
    position: 'relative'
  },
  paper: {
    width: 600,
    padding: '25px 30px',
    position: 'relative'
  },
  title: {
    fontSize: 20,
    color: palette[type].pages.devices.rebootModal.title.color,
    marginBottom: 15
  },
  closeButton: {
    position: 'absolute',
    right: 30,
    top: 15
  },
  closeIcon: {
    color: palette[type].sideModal.header.titleColor
  },
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
    height: 45
  },
  tableRowSelected: {
    background: palette[type].table.body.row.selected.background
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
    whiteSpace: 'nowrap',

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
  cancelBtn: {
    marginRight: 20
  }
})

function SingleRow({ classes, id, isSelected, title, onClick }) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [id, onClick])
  return (
    <TableRow
      className={classNames(classes.tableRow, {
        [classes.tableRowSelected]: isSelected
      })}
      key={id}
      onClick={handleClick}
    >
      <TableCell className={classes.tableCell} align="center">
        {title}
      </TableCell>
      <TableCell className={classes.tableCell} align="center" />
      <TableCell className={classes.tableCell} />
    </TableRow>
  )
}

const SingleRowMemoized = memo(SingleRow)

const AlertMediaLibrary = ({
  t,
  id,
  open = false,
  handleClose = f => f,
  classes,
  libraryReducer,
  getMediaItemsAction,
  clearGetMediaItemsInfoAction,
  putDeviceMediaEmergencyAlertReducer,
  putDeviceMediaEmergencyAlertAction,
  clearPutDeviceMediaEmergencyAlertInfoAction,
  deviceId,
  getDeviceMediaEmergencyAlert,
  selectedMediaId = null,
  onSuccess = f => f,
  onFail = f => f
}) => {
  const [data, setData] = useState([])
  const [selectedId, setSelectedId] = useState(selectedMediaId)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMediaItemsAction({
      alertTypeId: id
    })
  }, [getMediaItemsAction, id])

  useEffect(() => {
    const { response, error } = libraryReducer
    if (response) {
      const { data } = response
      setData(takeTruth(data, []))
      clearGetMediaItemsInfoAction()
      setIsLoading(false)
    } else if (error) {
      clearGetMediaItemsInfoAction()
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [libraryReducer])

  const handleSave = useCallback(() => {
    if (selectedId) {
      putDeviceMediaEmergencyAlertAction({
        deviceId: deviceId,
        alertId: id,
        data: {
          mediaId: selectedId
        }
      })
    }
  }, [selectedId, putDeviceMediaEmergencyAlertAction, deviceId, id])

  useEffect(() => {
    if (putDeviceMediaEmergencyAlertReducer.response) {
      getDeviceMediaEmergencyAlert(deviceId)
      clearPutDeviceMediaEmergencyAlertInfoAction()
      onSuccess()
    } else if (putDeviceMediaEmergencyAlertReducer.error) {
      clearPutDeviceMediaEmergencyAlertInfoAction()
      onFail()
    }
    // eslint-disable-next-line
  }, [putDeviceMediaEmergencyAlertReducer])

  const renderRows = useMemo(() => {
    if (isEmpty(data)) {
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
    return data.map(({ id, title }) => (
      <SingleRowMemoized
        key={id}
        id={id}
        title={title}
        classes={classes}
        isSelected={isEqual(id, selectedId)}
        onClick={setSelectedId}
      />
    ))
  }, [data, selectedId, setSelectedId, classes, t])

  const renderLoader = useMemo(() => {
    if (isFalsy(isLoading)) return null
    return <CircularLoader />
  }, [isLoading])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      {renderLoader}
      <ModalPaper className={classes.paper}>
        <Typography className={classes.title}>
          {t('Alert media library').toUpperCase()}
        </Typography>

        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon className={classes.closeIcon} />
        </IconButton>

        <Grid container direction="column">
          <Grid container direction="column" className={classes.tableContainer}>
            <Table className={classes.table}>
              <TableHead className={classes.tableHead}>
                <TableRow className={classes.tableRow}>
                  <TableCell className={classes.tableCell} align="center">
                    <Typography className={classes.tableHeadText}>
                      {t('Type').toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    <Typography className={classes.tableHeadText}>
                      {t('Media title').toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center" />
                </TableRow>
              </TableHead>
              <TableBody>{renderRows}</TableBody>
            </Table>
          </Grid>

          <Grid container justify="flex-end">
            <BlueButton className={classes.cancelBtn} onClick={handleClose}>
              {t('Cancel')}
            </BlueButton>
            <BlueButton onClick={handleSave}>{t('OK')}</BlueButton>
          </Grid>
        </Grid>
      </ModalPaper>
    </Dialog>
  )
}

AlertMediaLibrary.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  classes: PropTypes.object,
  deviceId: PropTypes.number,
  selectedMediaId: PropTypes.number,
  onSuccess: PropTypes.func,
  onFail: PropTypes.func
}

const mapStateToProps = ({ media, alert }) => ({
  libraryReducer: media.library,
  putDeviceMediaEmergencyAlertReducer: alert.putDeviceMediaEmergencyAlert
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMediaItemsAction,
      clearGetMediaItemsInfoAction,
      putDeviceMediaEmergencyAlertAction,
      clearPutDeviceMediaEmergencyAlertInfoAction,
      getDeviceMediaEmergencyAlert
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(AlertMediaLibrary)
