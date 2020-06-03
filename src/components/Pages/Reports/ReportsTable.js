import React, { useCallback, useEffect } from 'react'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'

import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core'

import {
  TableLibraryRow,
  TableLibraryCell,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import BaseTable from 'components/TableLibrary/BaseTable'
import { Checkbox } from 'components/Checkboxes'
import UserPic from 'components/UserPic'
import EmailLink from 'components/EmailLink'

import useNotifyAnalyzer from 'hooks/tableLibrary/useNotifyAnalyzer'
import useIds from 'hooks/tableLibrary/useIds'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'

import {
  clearResponseInfo,
  deleteSelectedReports as deleteSelectedItems,
  getReportItemsAction as getItems
} from 'actions/reportActions'

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
  }
})

const initialColumns = [
  { id: 'userName', label: 'Name', display: true },
  { id: 'email', label: 'Email', display: true },
  { id: 'phone', label: 'Phone', align: 'center', display: true },
  { id: 'timeStamp', label: 'Time Stamp', align: 'center', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true },
  { id: 'IPAddress', label: 'IP Address', align: 'center', display: true }
]

const ReportsTable = ({
  t,
  classes,
  items,
  meta,
  getItems,
  enqueueSnackbar,
  closeSnackbar,
  clearResponseInfo,
  deleteSelectedItems,
  del,
  clone
}) => {
  const rowsIds = useIds(items)

  const selectedList = useSelectedList(rowsIds)

  const fetchItems = useCallback(
    () =>
      getItems({
        page: 1,
        limit: meta.perPage
      }),
    [getItems, meta.perPage]
  )

  useNotifyAnalyzer(
    fetchItems,
    clearResponseInfo,
    enqueueSnackbar,
    closeSnackbar,
    'Report',
    [del, clone]
  )

  useEffect(() => {
    getItems()
    //eslint-disable-next-line
  }, [])

  const handleSelect = useCallback(
    (event, rowId) => {
      selectedList.toggle(rowId)
    },
    [selectedList]
  )

  return (
    <BaseTable
      noType={false}
      meta={meta}
      fetcher={getItems}
      columns={initialColumns}
      deleteSelectedItems={deleteSelectedItems}
      selectedList={selectedList}
    >
      {items.map(row => {
        const isSelected = selectedList.isSelect(row.id)
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
              onClick={event => handleSelect(event, row.id)}
            >
              <Checkbox checked={isSelected} />
            </TableLibraryCell>
            <TableLibraryCell align="center" padding="checkbox">
              <UserPic
                status={row.status}
                role={row.type}
                userName={row.userName}
                imgSrc={row.picture}
              />
            </TableLibraryCell>

            {initialColumns
              .filter(({ display }) => display)
              .map(({ id: column }) => {
                switch (column) {
                  case 'userName':
                    return (
                      <TableLibraryCell key={column} className={classes.name}>
                        {row.userName}
                      </TableLibraryCell>
                    )
                  case 'email':
                    return (
                      <TableLibraryCell key={column}>
                        {row.email ? <EmailLink email={row.email} /> : ''}
                      </TableLibraryCell>
                    )
                  case 'phone':
                    return (
                      <TableLibraryCell key={column} align="center">
                        {row.phone}
                      </TableLibraryCell>
                    )
                  case 'timeStamp':
                    return (
                      <TableLibraryCell key={column} align="center">
                        <DateTimeView date={row.timeStamp} />
                      </TableLibraryCell>
                    )
                  case 'status':
                    return (
                      <TableLibraryCell key={column} align="center">
                        {row.status}
                      </TableLibraryCell>
                    )
                  case 'IPAddress':
                    return (
                      <TableLibraryCell key={column} align="center">
                        {row.IPAddress}
                      </TableLibraryCell>
                    )
                  default:
                    return null
                }
              })}
            <TableLibraryCell align="right">
              <TableLibraryRowActionButton actionLinks={[]} />
            </TableLibraryCell>
          </TableLibraryRow>
        )
      })}
    </BaseTable>
  )
}

const mapStateToProps = ({ report }) => ({
  items: report.library.response,
  meta: report.library.meta,
  del: report.del,
  clone: report.clone
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo,
      deleteSelectedItems
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(ReportsTable)
