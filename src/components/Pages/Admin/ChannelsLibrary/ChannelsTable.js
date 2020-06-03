import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { withStyles, Table, TableBody, Button } from '@material-ui/core'

import { withSnackbar } from 'notistack'

import { TablePaper } from '../../../Paper'

import {
  TableLibraryFooter,
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryHead,
  TableLibraryRowActionButton
} from '../../../TableLibrary'
import { DropdownHover } from '../../../Dropdowns'
import { Checkbox } from '../../../Checkboxes'

import { stableSort, getSorting } from '../../../../utils'
import { channelsService } from '../../../../services'

const styles = theme => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  table: {
    minWidth: 1020,
    minHeight: '90vh'
  },
  name: {
    fontWeight: 'bold'
  },

  channelLayout: {
    marginRight: '20px',
    fontSize: '18px',
    color: '#0a83c8'
  },

  embeddedCodeTooltipWrapper: {
    width: '700px'
  },
  embeddedCodeWrapper: {
    padding: '15px 20px',
    height: '200px',
    overflowX: 'auto'
  }
})

class ChannelsTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired
  }

  state = {
    order: 'asc',
    orderBy: 'title',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    rows: [
      { id: 'channel', label: 'Name', active: true },
      { id: 'client', label: 'Client', active: true },
      { id: 'embeddedCode', label: 'Embedded Code', active: true }
    ]
  }

  async componentDidMount() {
    const data = await channelsService.getChannelsLibraryItems()
    this.setState({ data })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  deleteRow = (media, index) => {
    const { enqueueSnackbar, t } = this.props
    const { data } = this.state

    const newData = data.filter(el => el.id !== media.id)

    enqueueSnackbar(`${media.channel} ${t('Snackbar is removed')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.addRow(media, index)
    })

    this.setState({ data: newData })
  }

  addRow = (row, index) => {
    const { enqueueSnackbar, t } = this.props
    const { data: newData } = this.state

    newData.push(row)

    enqueueSnackbar(`${row.channel} ${t('Snackbar is added')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.deleteRow(row, index)
    })

    this.setState({ data: newData })
  }

  handleRowChange = (index, value) => {
    if (this.state.rows[index].active !== value) {
      this.setState(
        update(this.state, {
          rows: {
            [index]: {
              $merge: { active: value }
            }
          }
        })
      )
    }
  }

  handleReorder = result => {
    if (result.source !== null && result.destination !== null) {
      const [source, destination] = [
        result.source.index,
        result.destination.index
      ]
      const swap = (rows, source, destination) => {
        ;[rows[source], rows[destination]] = [rows[destination], rows[source]]
        return rows
      }
      this.setState({
        rows: swap(this.state.rows, source, destination)
      })
    }
  }

  render() {
    const { classes, t } = this.props
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      rows
    } = this.state
    this.props.selectionHandler(selected.length)
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <TablePaper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableLibraryHead
              editRows={true}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              columns={rows}
              noType={true}
              handleColumnChange={this.handleRowChange}
              handleReorder={this.handleReorder}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isSelected = this.isSelected(row.id)

                  return (
                    <TableLibraryRow
                      key={row.id}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      selected={isSelected}
                    >
                      <TableLibraryCell
                        padding="checkbox"
                        onClick={event => this.handleClick(event, row.id)}
                      >
                        <Checkbox checked={isSelected} />
                      </TableLibraryCell>
                      {rows.map(column => {
                        if (column.active) {
                          switch (column.id) {
                            case 'channel':
                              return (
                                <TableLibraryCell
                                  key={column.id}
                                  className={classes.name}
                                >
                                  <i
                                    className={`icon-layout-4 ${classes.channelLayout}`}
                                  />
                                  {row.channel}
                                </TableLibraryCell>
                              )
                            case 'client':
                              return (
                                <TableLibraryCell key={column.id}>
                                  {row.client}
                                </TableLibraryCell>
                              )
                            case 'embeddedCode':
                              return (
                                <TableLibraryCell key={column.id}>
                                  <DropdownHover
                                    dropSide="bottomRight"
                                    menuContainerClassName={
                                      classes.embeddedCodeTooltipWrapper
                                    }
                                    ButtonComponent={
                                      <div>
                                        <i className="icon-expand-vertical-7" />{' '}
                                        {t('Code')}
                                      </div>
                                    }
                                    MenuComponent={
                                      <div
                                        className={classes.embeddedCodeWrapper}
                                      >
                                        <code>
                                          {decodeURI(row.embededCode)}
                                        </code>
                                      </div>
                                    }
                                  />
                                </TableLibraryCell>
                              )
                            default:
                              break
                          }
                        }
                        return null
                      })}
                      <TableLibraryCell align="right">
                        <TableLibraryRowActionButton
                          actionLinks={[
                            { label: t('Edit action'), clickAction: f => f },
                            { divider: true },
                            {
                              label: t('Delete Channel action'),
                              icon: 'icon-bin',
                              clickAction: () => this.deleteRow(row, index)
                            }
                          ]}
                        />
                      </TableLibraryCell>
                    </TableLibraryRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableLibraryRow style={{ height: 49 * emptyRows }}>
                  <TableLibraryCell colSpan={15} />
                </TableLibraryRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TableLibraryFooter
          page={page}
          data={data}
          selected={selected}
          rowsPerPage={rowsPerPage}
          handleSelect={this.handleSelectAllClick}
          handleChangePage={this.handleChangePage}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </TablePaper>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(withSnackbar(ChannelsTable))
)
