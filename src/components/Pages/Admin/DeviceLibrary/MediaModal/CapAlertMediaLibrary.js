import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { createSelector } from 'reselect'
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
import { Close as CloseIcon } from '@material-ui/icons'
import classNames from 'classnames'

import { ModalPaper } from 'components/Paper'
import { BlueButton } from 'components/Buttons'
import { CircularLoader } from 'components/Loaders'

import { getMediaCapAlert } from 'actions/mediaActions'
import { isEmpty, isEqual, isFalsy } from 'utils/generalUtils'
import { mediaCapAlertSelector } from 'selectors/mediaSelectors'

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

function SingleRow({ id, title, isSelected, onClick, classes }) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])
  return (
    <TableRow
      className={classNames(classes.tableRow, {
        [classes.tableRowSelected]: isSelected
      })}
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

const selector = createSelector(
  mediaCapAlertSelector,
  ({ isFetching, isFetched, items, error }) => ({
    isFetching,
    isFetched,
    items,
    error
  })
)

function CapAlertMediaLibrary({
  t,
  classes,
  open,
  selectedMediaId,
  handleClose,
  onSuccess
}) {
  const dispatch = useDispatch()
  const { isFetching, isFetched, items } = useSelector(selector)
  const [selectedId, setSelectedId] = useState(selectedMediaId)

  useEffect(() => {
    if (isFalsy(isFetched)) {
      dispatch(getMediaCapAlert())
    }
  }, [dispatch, isFetched])

  const handleSave = useCallback(() => {
    if (selectedId) {
      onSuccess(
        items.find(({ id }) => {
          return isEqual(id, selectedId)
        })
      )
    }
  }, [selectedId, onSuccess, items])

  const renderRows = useMemo(() => {
    if (isEmpty(items)) {
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
    return items.map(({ id, title }) => (
      <SingleRowMemoized
        key={id}
        id={id}
        title={title}
        classes={classes}
        onClick={setSelectedId}
        isSelected={isEqual(id, selectedId)}
      />
    ))
  }, [classes, items, t, selectedId])

  const renderLoader = useMemo(() => {
    if (isFalsy(isFetching)) return null
    return <CircularLoader />
  }, [isFetching])

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

CapAlertMediaLibrary.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  classes: PropTypes.object,
  deviceId: PropTypes.number,
  selectedMediaId: PropTypes.number,
  onSuccess: PropTypes.func
}

CapAlertMediaLibrary.defaultProps = {
  onSuccess: f => f,
  open: false,
  selectedMediaId: null
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(CapAlertMediaLibrary)
