import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { translate } from 'react-i18next'

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

import { ModalPaper } from '../../../../Paper'
import { Close as CloseIcon } from '@material-ui/icons'
import { BlueButton } from '../../../../Buttons'

import {
  getMediaItemsAction,
  clearGetMediaItemsInfoAction
} from '../../../../../actions/mediaActions'

const styles = ({ palette, type }) => ({
  dialogPaper: {
    overflow: 'visible',
    background: 'transparent'
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
    background: palette[type].table.head.background
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
    whiteSpace: 'nowrap',

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
  cancelBtn: {
    marginRight: 20
  }
})

const CapAlertMediaLibrary = ({
  t,
  classes,
  open = false,
  selectedMediaId = null,
  handleClose = f => f,
  mediaLibraryReducer,
  getMediaItemsAction,
  clearGetMediaItemsInfoAction,
  onSuccess = f => f
}) => {
  const [data, setData] = useState([])
  const [selectedId, setSelectedId] = useState(selectedMediaId)

  useEffect(() => {
    getMediaItemsAction({
      featureId: 42
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (mediaLibraryReducer.response) {
      setData(mediaLibraryReducer.response.data)
      clearGetMediaItemsInfoAction()
    } else if (mediaLibraryReducer.error) {
      clearGetMediaItemsInfoAction()
    }
    // eslint-disable-next-line
  }, [mediaLibraryReducer])

  const handleSave = () => {
    if (selectedId) {
      const item = data.find(d => d.id === selectedId)
      onSuccess(item)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      <ModalPaper className={classes.paper}>
        <Typography className={classes.title}>
          {t('Cap Alert Media Library').toUpperCase()}
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
                      {t('Media title').toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center" />
                  <TableCell className={classes.tableCell} align="center" />
                </TableRow>
              </TableHead>
              {!!data.length && (
                <TableBody>
                  {data.map(m => (
                    <TableRow
                      className={[
                        classes.tableRow,
                        selectedId === m.id ? classes.tableRowSelected : ''
                      ].join(' ')}
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                    >
                      <TableCell className={classes.tableCell} align="center">
                        {m.title}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center" />
                      <TableCell className={classes.tableCell} />
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

CapAlertMediaLibrary.propTypes = {
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
  mediaLibraryReducer: media.library
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMediaItemsAction,
      clearGetMediaItemsInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(CapAlertMediaLibrary)
  )
)
