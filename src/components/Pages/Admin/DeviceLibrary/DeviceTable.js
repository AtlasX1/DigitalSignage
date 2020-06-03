import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
import { Checkbox } from 'components/Checkboxes'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import { ScreenPreviewModal } from 'components/Modal'
import { LibraryLoader } from 'components/Loaders'

import { sortByOrder, roles, getUrlPrefix } from 'utils'
import { routeByName } from 'constants/index'
import {
  getDeviceLibraryPrefAction,
  putDeviceLibraryPrefAction,
  getDeviceItemsAction
} from 'actions/deviceActions'

const styles = theme => {
  const { palette, type } = theme
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
      fontWeight: 'bold'
    },
    label: {
      fontSize: '11px',
      color: palette[type].tableLibrary.body.cell.color
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
  getDeviceLibraryPrefAction,
  putDeviceLibraryPrefAction,
  getDeviceItemsAction,
  onChangeSelection,
  library,
  meta,
  filterParams,
  preference,
  detailsReducer,
  match: { path }
}) => {
  const [role, setRole] = useState({})
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title')
  const [selected, setSelected] = useState([])
  const [statuses, setStatuses] = useState({})
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [emptyRowHeight, setEmptyRowHeight] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [reorderCount, setReorderCount] = useState(0)
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Name' },
    { id: 'city', label: 'Location', forRoles: ['org'] },
    { id: 'group', label: 'Group', forRoles: ['org'] },
    { id: 'account', label: 'Account', forRoles: ['system', 'enterprise'] },
    { id: 'updatedAt', label: 'Last Update', align: 'center' },
    { id: 'firmware', label: 'Firmware Version' },
    { id: 'status', label: 'Status', align: 'center' }
  ])

  const { currentPage, lastPage, perPage } = meta

  useEffect(() => {
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
  }, [getDeviceItemsAction, filterParams, page, rowsPerPage, order, orderBy])

  useEffect(() => {
    if (detailsReducer.response) {
      const parsedRole = roles.parse(detailsReducer.response.role)
      setRole(parsedRole)

      const newColumns = update(
        columns.filter(
          ({ forRoles }) => !forRoles || forRoles.some(r => parsedRole[r])
        ),
        {
          $apply: cols =>
            cols.map(col =>
              // Change Name col title for org users
              parsedRole.org && col.id === 'deviceName'
                ? update(col, { label: { $set: t('Name') } })
                : col
            )
        }
      )
      setColumns(newColumns)
    }
    // eslint-disable-next-line
  }, [detailsReducer])

  useEffect(() => {
    if (!preference.response) {
      getDeviceLibraryPrefAction()
    }

    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (library.response) {
      setData(library.response)
      setLoading(false)
    }

    //eslint-disable-next-line
  }, [library])

  useEffect(() => {
    if (preference.response) {
      const entity = preference.response.find(p => p.entity === 'DeviceLibrary')
      const newStatuses = entity && entity.gridColumn ? entity.gridColumn : {}
      const parsedRole = roles.parse(
        detailsReducer.response ? detailsReducer.response.role : {}
      )
      const newColumns = sortByOrder(
        newStatuses,
        columns.filter(
          ({ forRoles }) => !forRoles || forRoles.some(r => parsedRole[r])
        )
      )

      setStatuses(newStatuses)
      setColumns(newColumns)
    }

    //eslint-disable-next-line
  }, [preference])

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
    setRowsPerPage(rowsPerPage)
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

  const handleColumnChange = (index, value) => {
    const id = columns[index].id

    let data
    if (id in statuses) {
      data = update(statuses, {
        [id]: {
          $merge: { display: value }
        }
      })
    } else {
      data = update(statuses, {
        $merge: { [id]: { display: value } }
      })
    }

    putDeviceLibraryPrefAction(data)
  }

  const handleReorder = async result => {
    if (result.source !== null && result.destination !== null) {
      const column = columns[result.source.index]

      const index = result.source.index
      const destIndex = result.destination.index

      setColumns(
        update(columns, {
          $splice: [
            [index, 1],
            [destIndex, 0, column]
          ]
        })
      )
      setReorderCount(reorderCount + 1)
    }
  }

  useEffect(() => {
    if (reorderCount) {
      let newStatuses = statuses

      columns.forEach((c, i) => {
        if (newStatuses[c.id]) {
          newStatuses = update(newStatuses, {
            [c.id]: {
              $merge: { sortOrder: i }
            }
          })
        } else {
          newStatuses = update(newStatuses, {
            $merge: {
              [c.id]: {
                sortOrder: i
              }
            }
          })
        }
      })

      putDeviceLibraryPrefAction(newStatuses)
    }
    //eslint-disable-next-line
  }, [reorderCount])

  useEffect(() => {
    onChangeSelection(selected.length)
    //eslint-disable-next-line
  }, [selected])

  const filter = id => {
    return statuses[id] && statuses[id].display !== undefined
      ? statuses[id].display
      : true
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
            handleColumnChange={handleColumnChange}
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
                            <TableLibraryCell key={column.id}>
                              {row.city}, {row.state}
                            </TableLibraryCell>
                          )
                        case 'group':
                          return (
                            <TableLibraryCell key={column.id}>
                              {row.group
                                ? row.group.map(({ id, title }) => (
                                    <p key={id}>{title}</p>
                                  ))
                                : null}
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
                            <TableLibraryCell key={column.id}>
                              {row.firmware}
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
        perPage={parseInt(perPage, 10)}
        pageCount={lastPage}
        data={data}
        selected={selected}
        allSelected={selected.length === data.length}
        rowsPerPage={rowsPerPage}
        onSelectAllClick={handleSelectAllClick}
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
  getDeviceLibraryPrefAction: PropTypes.func,
  putDeviceLibraryPrefAction: PropTypes.func,
  getDeviceItemsAction: PropTypes.func,
  library: PropTypes.object,
  preference: PropTypes.object,
  detailsReducer: PropTypes.object
}

const mapStateToProps = ({ device, user }) => ({
  library: device.library,
  meta: device.meta,
  preference: device.preference,
  detailsReducer: user.details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceLibraryPrefAction,
      putDeviceLibraryPrefAction,
      getDeviceItemsAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(DeviceTable))
  )
)
