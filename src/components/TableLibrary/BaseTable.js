import { Table, TableBody, withStyles } from '@material-ui/core'
import arrayMove from 'array-move'
import EmptyPlaceholder from 'components/EmptyPlaceholder'
import { LibraryLoader } from 'components/Loaders'
import { TablePaper } from 'components/Paper'
import { shapeOfMeta } from 'constants/initialLibraryState'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState } from 'react'
import { TableLibraryFooter, TableLibraryHead, TableLibraryRow } from './index'

const styles = theme => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  table: {
    minWidth: 1020,
    minHeight: 1000
  },
  name: {
    fontWeight: 'bold'
  }
})

const BaseTable = ({
  placeholderMessage = '',
  meta = shapeOfMeta,
  fetcher = f => f,
  deleteSelectedItems = f => f,
  children,
  noType = true,
  classes = {},
  columns = [],

  selectedList: {
    clear: clearSelectedList = f => f,
    selectedIds = [],
    isPageSelect = false,
    pageSelect = f => f
  },
  preferenceActions: {
    changeColumns = f => f,
    toggleDisplayColumn = f => f,
    changeRecordsPerPage = f => f
  }
}) => {
  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState('asc')

  const sortParams = useMemo(
    () =>
      orderBy
        ? {
            sort: orderBy,
            order
          }
        : {},
    [order, orderBy]
  )

  const handleRequestSort = useCallback(
    (event, column) => {
      fetcher({
        page: meta.currentPage,
        limit: meta.perPage,
        sort: column,
        order: order === 'asc' ? 'desc' : 'asc'
      })

      setOrderBy(column)
      setOrder(order === 'asc' ? 'desc' : 'asc')
    },
    [fetcher, meta.currentPage, meta.perPage, order]
  )

  const handleChangePage = useCallback(
    ({ selected }) => {
      fetcher({
        page: selected + 1,
        limit: meta.perPage,
        ...sortParams
      })
    },
    [fetcher, meta.perPage, sortParams]
  )

  const handleClickDeleteSelectedItems = useCallback(() => {
    deleteSelectedItems(selectedIds)
    clearSelectedList()
  }, [deleteSelectedItems, selectedIds, clearSelectedList])

  const handleChangeRowsPerPage = useCallback(
    limit => {
      fetcher(
        {
          page: 1,
          limit,
          ...sortParams
        },
        []
      )
      changeRecordsPerPage(limit)
    },
    [fetcher, changeRecordsPerPage, sortParams]
  )

  const handlePressJumper = useCallback(
    ({ target: { value }, key }) => {
      const page = Number.parseInt(value)

      if (key === 'Enter' && page <= meta.lastPage) {
        fetcher({
          page,
          limit: meta.perPage,
          ...sortParams
        })
      }
    },
    [fetcher, meta.lastPage, meta.perPage, sortParams]
  )

  const handleCustomizeTable = useCallback(
    (index, value) => {
      toggleDisplayColumn(index, value)
    },
    [toggleDisplayColumn]
  )

  const handleReorder = useCallback(
    ({ source, destination }) => {
      if (source && destination) {
        const { index: sInd } = source
        const { index: dInd } = destination

        const shiftedColumns = update(columns, {
          $set: arrayMove(columns, sInd, dInd)
        })

        changeColumns(shiftedColumns)
      }
    },
    [columns, changeColumns]
  )

  return meta.count ? (
    <TablePaper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableLibraryHead
            editRows
            order={order}
            orderBy={orderBy}
            allSelected={isPageSelect}
            onSelectAllClick={pageSelect}
            onRequestSort={handleRequestSort}
            rowCount={meta.count}
            columns={columns}
            noType={noType}
            handleColumnChange={handleCustomizeTable}
            handleReorder={handleReorder}
          />
          <TableBody>
            {children}
            <TableLibraryRow style={{ height: '100%' }} />
          </TableBody>
        </Table>
      </div>
      <TableLibraryFooter
        page={meta.currentPage}
        allSelected={isPageSelect}
        onSelectAllClick={pageSelect}
        handleSelect={pageSelect}
        pageCount={meta.lastPage}
        perPage={meta.perPage}
        onPageChange={handleChangePage}
        onPressJumper={handlePressJumper}
        handleClickDeleteSelectedItems={handleClickDeleteSelectedItems}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TablePaper>
  ) : meta.isLoading ? (
    <LibraryLoader />
  ) : (
    <EmptyPlaceholder text={placeholderMessage} />
  )
}

BaseTable.propTypes = {
  meta: PropTypes.object.isRequired,
  fetcher: PropTypes.func.isRequired,
  columns: PropTypes.array,
  deleteSelectedItems: PropTypes.func,
  placeholderMessage: PropTypes.string,
  noType: PropTypes.bool,

  selectedList: PropTypes.shape({
    clear: PropTypes.func,
    selectedIds: PropTypes.array,
    isPageSelect: PropTypes.bool,
    pageSelect: PropTypes.func
  }),

  preferenceActions: PropTypes.shape({
    changeRecordsPerPage: PropTypes.func,
    toggleDisplayColumn: PropTypes.func,
    changeColumns: PropTypes.func
  })
}

BaseTable.defaultProps = {
  selectedList: {},
  preferenceActions: {}
}

export default withStyles(styles)(BaseTable)
