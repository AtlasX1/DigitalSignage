import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import {
  withStyles,
  Typography,
  Table,
  TableBody,
  Button,
  Tooltip
} from '@material-ui/core'

import { withSnackbar } from 'notistack'

import { TablePaper } from 'components/Paper'

import {
  TableLibraryFooter,
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryHead,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import LibraryTagChips from '../../../../components/LibraryTagChips'
import { Checkbox } from 'components/Checkboxes'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import { ScreenPreviewModal } from 'components/Modal'
import { LibraryLoader } from 'components/Loaders'
import { roles, getUrlPrefix, stableSort } from 'utils'
import { routeByName, entityConstants } from 'constants/index'
import { getDeviceItemsAction } from 'actions/deviceActions'
import usePreference from 'hooks/tableLibrary/usePreference'
import arrayMove from 'array-move'
import axios from 'axios'

const styles = theme => {
  const { typography, type } = theme
  return {
    root: {
      width: '100%',
      boxShadow: 'none'
    },
    table: {
      minWidth: 1020,
      minHeight: '60vh'
    },
    name: {
      ...typography.darkAccent[type]
    },
    label: {
      ...typography.subtitle[type]
    },
    toggleApprovedIcon: {
      width: 24,
      height: 24,
      cursor: 'pointer'
    },

    typeIconWrap: {
      width: 36,
      height: 36,
      borderRadius: '10px'
    },
    typeIcon: {
      fontSize: '18px',
      lineHeight: '32px',
      color: '#fff'
    },

    docIconWrap: {
      backgroundImage: 'linear-gradient(to bottom, #6bb9ff, #3983ff)'
    },
    bIconWrap: {
      backgroundImage: 'linear-gradient(to bottom, #ffb24c, #ff7b25)'
    },
    rewardsIconWrap: {
      backgroundImage: 'linear-gradient(to bottom, #8b96ab, #535d73)'
    },
    teamviewerStatus: {
      fontSize: 18
    },
    teamviewerStatusActive: {
      color: '#0a83c8'
    }
  }
}

const initialColumns = [
  { id: 'name', label: 'Name' },
  { id: 'city', label: 'Location', forRoles: ['org'], align: 'center' },
  { id: 'group', label: 'Group', forRoles: ['org'], align: 'center' },
  { id: 'account', label: 'Account', forRoles: ['system', 'enterprise'] },
  { id: 'updatedAt', label: 'Last Update', align: 'center' },
  {
    id: 'firmware',
    label: 'Firmware Version',
    align: 'center',
    display: false
  },
  { id: 'tag', label: 'Tags', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' }
]

const DeviceNameViewCell = ({ row, role, classes }) => {
  return role.org ? (
    <>
      {row.alias} <Typography className={classes.label}>{row.name}</Typography>
    </>
  ) : (
    <>
      {row.name} <Typography className={classes.label}>{row.alias}</Typography>
    </>
  )
}

const DeviceTable = ({
  t,
  classes,
  enqueueSnackbar,
  getDeviceItemsAction,
  onChangeSelection,
  library,
  meta,
  filterParams,
  detailsReducer,
  match: { path }
}) => {
  const [role, setRole] = useState({})
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title')
  const [selected, setSelected] = useState([])
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [emptyRowHeight, setEmptyRowHeight] = useState(0)

  const { currentPage, lastPage } = meta

  const preference = usePreference({
    initialColumns,
    fetcher: getDeviceItemsAction,
    entity: entityConstants.DeviceLibrary,
    initialPerPage: 10,
    sort: orderBy,
    order
  })
  const rowsPerPage = preference.perPage
  const isDefaultColums = preference.isDefault
  const columns = useMemo(() => {
    return update(
      stableSort(
        preference.columns.filter(
          ({ forRoles }) => !forRoles || forRoles.some(r => role[r])
        ),
        (lhs, rhs) => (lhs.sortOrder || 0) - (rhs.sortOrder || 0)
      ),
      {
        $apply: cols =>
          cols.map(col =>
            // Change Name col title for org users
            role.org && col.id === 'deviceName'
              ? update(col, { label: { $set: t('Name') } })
              : col
          ),
        $apply: cols =>
          cols.map(col =>
            role.org && col.id === 'firmware' && isDefaultColums
              ? update(col, { display: { $set: false } })
              : col
          ),
        $apply: cols =>
          cols.map(col =>
            role.org && col.id === 'firmware'
              ? update(col, { label: { $set: t('Application Version') } })
              : col
          )
      }
    )
  }, [role, preference.columns, t])

  useEffect(() => {
    if (!library.response) {
      return
    }
    const params = { ...filterParams }

    Object.keys(params).forEach(key => {
      params[key] === '' && delete params[key]
    })

    getDeviceItemsAction({
      ...params,
      page,
      limit: rowsPerPage,
      sort: orderBy,
      order
    })
    // eslint-disable-next-line
  }, [getDeviceItemsAction, filterParams, page, rowsPerPage, order, orderBy])

  useEffect(() => {
    if (detailsReducer.response) {
      const parsedRole = roles.parse(detailsReducer.response.role)
      setRole(parsedRole)
    }
    // eslint-disable-next-line
  }, [detailsReducer])

  useEffect(() => {
    if (library.response) {
      setData(library.response)
      setLoading(false)
    }
    //eslint-disable-next-line
  }, [library])

  useEffect(() => {
    handleEmptyRow(meta)
  }, [meta])

  const handleRequestSort = useCallback(
    (event, property) => {
      const newOrderBy = property
      let newOrder = 'desc'

      if (orderBy === property && order === 'desc') {
        newOrder = 'asc'
      }

      setOrder(newOrder)
      setOrderBy(newOrderBy)
    },
    [order, orderBy]
  )

  const handleSelectAllClick = event =>
    event.target.checked
      ? setSelected(data.map(row => row.id))
      : setSelected([])

  const handleClick = (event, id) => {
    const index = selected.indexOf(id)

    if (index !== -1) {
      setSelected(
        update(selected, {
          $splice: [[index, 1]]
        })
      )
    } else {
      setSelected(
        update(selected, {
          $push: [id]
        })
      )
    }
  }

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1)
  }

  const handlePressJumper = event => {
    if (event.target.value) {
      const page = parseInt(event.target.value, 10)
      setPage(page)
    }
  }

  const handleChangeRowsPerPage = rowsPerPage => {
    setPage(1)
    preference.actions.changeRecordsPerPage(rowsPerPage)
  }

  const handleEmptyRow = ({ count }) => {
    const rowHeight = 90
    const tableHeight = window.innerHeight - 380
    const emptyRowHeight = tableHeight - count * rowHeight

    setEmptyRowHeight(emptyRowHeight)
  }

  const deleteRow = (media, index) => {
    setData(
      update(data, {
        $splice: [[index, 1]]
      })
    )

    enqueueSnackbar(`${media.deviceName} ${t('Snackbar is removed')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => addRow(media, index)
    })
  }

  const addRow = (row, index) => {
    setData(
      update(data, {
        $push: [row]
      })
    )

    enqueueSnackbar(`${row.deviceName} ${t('Snackbar is added')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => deleteRow(row, index)
    })
  }

  const handleReorder = async ({ source, destination }) => {
    if (!source || !destination) {
      return
    }
    const { actions, columns } = preference

    const visibleColumns = columns.filter(
      ({ forRoles }) => !forRoles || forRoles.some(r => role[r])
    )
    const sourceId = visibleColumns[source.index].id
    const destinationId = visibleColumns[destination.index].id

    const newColumns = stableSort(
      columns,
      (lhs, rhs) => (lhs.sortOrder || 0) - (rhs.sortOrder || 0)
    )
    let sIdx = -1
    let dIdx = -1

    newColumns.forEach(({ id }, idx) => {
      if (id === sourceId) {
        sIdx = idx
      }
      if (id === destinationId) {
        dIdx = idx
      }
    })

    const shiftedColumns = update(newColumns, {
      $set: arrayMove(columns, sIdx, dIdx)
    })

    actions.changeColumns(
      shiftedColumns.map((col, idx) => ({ ...col, sortOrder: idx }))
    )
  }

  useEffect(() => {
    onChangeSelection(selected.length)
    //eslint-disable-next-line
  }, [selected])

  const filter = id => {
    const status = preference.columns.find(status => status.id === id)

    return !status || status.display !== false
  }

  return loading ? (
    <LibraryLoader />
  ) : (
    <TablePaper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableLibraryHead
            editRows={true}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            selected={selected.length}
            allSelected={selected.length === data.length}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            columns={columns}
            filter={filter}
            handleColumnChange={preference.actions.toggleDisplayColumn}
            handleReorder={handleReorder}
          />
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableLibraryRow
                  key={row.id}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableLibraryCell
                    padding="checkbox"
                    onClick={event => handleClick(event, row.id)}
                  >
                    <Checkbox checked={selected.includes(row.id)} />
                  </TableLibraryCell>

                  <TableLibraryCell padding="none" align="right">
                    {row.teamviewerId && (
                      <ScreenPreviewModal screenPreview={row.teamviewerId}>
                        <Tooltip
                          title={t(
                            `Device Teamviewer ${
                              row.teamviewerStatus || 'offline'
                            } Tooltip title`
                          )}
                          placement="top"
                        >
                          <i
                            className={`icon-computer-screen-1 ${
                              classes.teamviewerStatus
                            } ${
                              row.teamviewerStatus === 'online'
                                ? classes.teamviewerStatusActive
                                : ''
                            }`}
                          />
                        </Tooltip>
                      </ScreenPreviewModal>
                    )}
                  </TableLibraryCell>
                  {columns
                    .filter(c => filter(c.id))
                    .map(column => {
                      switch (column.id) {
                        case 'name':
                          return (
                            <TableLibraryCell
                              key={column.id}
                              className={classes.name}
                            >
                              <DeviceNameViewCell
                                role={role}
                                classes={classes}
                                row={row}
                              />
                            </TableLibraryCell>
                          )
                        case 'city':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              {row.city}, {row.state}
                            </TableLibraryCell>
                          )
                        case 'group':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              {row.group
                                ? row.group.map(({ id, title }) => (
                                    <p key={id}>{title}</p>
                                  ))
                                : 'N/A'}
                            </TableLibraryCell>
                          )
                        case 'account':
                          return (
                            <TableLibraryCell key={column.id}>
                              {row.client.name}
                            </TableLibraryCell>
                          )
                        case 'updatedAt':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              <DateTimeView date={row.updatedAt} />
                            </TableLibraryCell>
                          )
                        case 'firmware':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              {row.firmware ? row.firmware : 'N/A'}
                            </TableLibraryCell>
                          )
                        case 'status':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              {row.status ? (
                                <ActiveStatusChip label={t('Active')} />
                              ) : (
                                <InactiveStatusChip label={t('Inactive')} />
                              )}
                            </TableLibraryCell>
                          )
                        case 'tag':
                          return (
                            <TableLibraryCell key={column.id} align="center">
                              <LibraryTagChips tags={row.tag} />
                            </TableLibraryCell>
                          )
                        default:
                          return null
                      }
                    })}
                  <TableLibraryCell align="right">
                    <TableLibraryRowActionButton
                      actionLinks={[
                        {
                          label: t('Edit action'),
                          to: getUrlPrefix(routeByName.device.goToEdit(row.id))
                        },
                        {
                          label: t('Notes'),
                          to: getUrlPrefix(routeByName.device.goToNote(row.id)),
                          render: role.system
                        },
                        {
                          label: t('Delete Device action'),
                          icon: 'icon-bin',
                          clickAction: () => deleteRow(row, index),
                          render: role.system
                        }
                      ]}
                    />
                  </TableLibraryCell>
                </TableLibraryRow>
              )
            })}
            {emptyRowHeight > 0 && (
              <TableLibraryRow style={{ height: emptyRowHeight }}>
                <TableLibraryCell colSpan={15} />
              </TableLibraryRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableLibraryFooter
        page={currentPage}
        perPage={rowsPerPage}
        pageCount={lastPage}
        data={data}
        selected={selected}
        allSelected={selected.length === data.length}
        onSelectAllClick={handleSelectAllClick}
        handleSelect={handleSelectAllClick}
        onPageChange={handlePageChange}
        onPressJumper={handlePressJumper}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TablePaper>
  )
}

DeviceTable.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  getDeviceItemsAction: PropTypes.func,
  library: PropTypes.object,
  detailsReducer: PropTypes.object
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

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(DeviceTable)
