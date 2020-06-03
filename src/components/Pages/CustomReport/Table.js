import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import {
  withStyles,
  Table as MatTable,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Grid
} from '@material-ui/core'

import { FormControlCheckbox } from '../../Form'
import TableHeadCellButton from './TableHeadCellButton'

const styles = ({ palette, type, typography }) => {
  return {
    text: {
      fontSize: 13,
      color: '#74809A',
      letterSpacing: '-0.01px',
      fontFamily: typography.fontFamily
    },
    head: {
      background: palette[type].pages.reports.report.table.head.background
    },
    row: {
      height: 40
    },
    rowSmall: {
      height: 33
    },
    cell: {
      padding: '0 12px',
      borderRightWidth: 1,
      borderRightColor: palette[type].pages.reports.report.table.border,
      borderRightStyle: 'solid',
      background: palette[type].pages.reports.report.table.cell.background,
      borderBottomColor: palette[type].pages.reports.report.table.border,

      '&:last-child': {
        borderRightWidth: 0
      },

      '&:first-child': {
        width: 236
      }

      // '&:nth-child(2)': {
      //   width: 143
      // },
      //
      // '&:nth-child(3)': {
      //   width: 161
      // },
      //
      // '&:nth-child(4)': {
      //   width: 174
      // },
      //
      // '&:nth-child(5)': {
      //   width: 185
      // },
      //
      // '&:nth-child(6)': {
      //   width: 206
      // },
      //
      // '&:nth-child(7)': {
      //   width: 119
      // }
    },
    cellNoBorder: {
      borderBottomWidth: 0
    },
    cellHeader: {
      background: palette[type].pages.reports.report.table.head.background,
      borderBottomWidth: 2,
      padding: 0
    },
    cellFirst: {
      background: palette[type].pages.reports.report.table.cell.first.background
    },
    checkboxRoot: {
      marginLeft: 0
    },
    checkboxLabel: {
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: '#74809A',
      fontWeight: 'bold',
      position: 'relative',
      top: 2
    },
    checkboxInputRoot: {
      marginRight: 5
    }
  }
}

const createData = (
  status,
  firstName,
  lastName,
  company,
  email,
  created,
  source
) => {
  return { status, firstName, lastName, company, email, created, source }
}

const Table = ({ t, classes }) => {
  const [tables, setTables] = useState([
    {
      owner: 'Jose Massey 123',
      columns: [
        { title: 'Lead Owner', value: 'leadOwner', active: true },
        { title: 'Lead Status', value: 'status', active: true },
        { title: 'First Name', value: 'firstName', active: true },
        { title: 'Last Name', value: 'lastName', active: true },
        { title: 'Company/Account', value: 'company', active: true },
        { title: 'Email', value: 'email', active: true },
        { title: 'Created Date', value: 'created', active: true },
        { title: 'Lead Source', value: 'source', active: true }
      ],
      data: [
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        )
      ]
    },
    {
      owner: 'Jose Massey 456',
      columns: [
        { title: 'Lead Owner', value: 'leadOwner', active: true },
        { title: 'Lead Status', value: 'status', active: true },
        { title: 'First Name', value: 'firstName', active: true },
        { title: 'Last Name', value: 'lastName', active: true },
        { title: 'Company/Account', value: 'company', active: true },
        { title: 'Email', value: 'email', active: true },
        { title: 'Created Date', value: 'created', active: true },
        { title: 'Lead Source', value: 'source', active: true }
      ],
      data: [
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        )
      ]
    },
    {
      owner: 'Jose Massey 768',
      columns: [
        { title: 'Lead Owner', value: 'leadOwner', active: true },
        { title: 'Lead Status', value: 'status', active: true },
        { title: 'First Name', value: 'firstName', active: true },
        { title: 'Last Name', value: 'lastName', active: true },
        { title: 'Company/Account', value: 'company', active: true },
        { title: 'Email', value: 'email', active: true },
        { title: 'Created Date', value: 'created', active: true },
        { title: 'Lead Source', value: 'source', active: true }
      ],
      data: [
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        ),
        createData(
          'Contacted',
          'Earl Curry',
          'Amanda Holland',
          'Basic Education',
          'candido_howe@dach.tv',
          '07 May 2019',
          'Trade Show Promotions'
        )
      ]
    }
  ])

  const handleClick = (action, tableIndex, column) => {
    const col = tables[tableIndex].columns.find(item => item.value === column)
    const index = tables[tableIndex].columns.indexOf(col)

    if (action === 'remove') {
      setTables(
        update(tables, {
          [tableIndex]: {
            columns: {
              [index]: {
                active: { $set: false }
              }
            }
          }
        })
      )
    }
  }

  return (
    <Grid container direction="column">
      {tables.map((table, tableIndex) => (
        <MatTable key={tableIndex}>
          <TableHead className={classes.head}>
            <TableRow className={classes.row}>
              {table.columns.map(
                (item, index) =>
                  item.active && (
                    <TableCell
                      key={index}
                      className={[classes.cell, classes.cellHeader].join(' ')}
                    >
                      <TableHeadCellButton
                        title={t(item.title)}
                        handleClick={handleClick}
                        tableIndex={tableIndex}
                        column={item.value}
                      />
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={classes.rowSmall}>
                {table.columns[0].active && (
                  <TableCell
                    className={[
                      classes.cell,
                      classes.cellFirst,
                      rowIndex !== table.data.length - 1
                        ? classes.cellNoBorder
                        : ''
                    ].join(' ')}
                  >
                    {rowIndex === 0 && (
                      <FormControlCheckbox
                        label={table.owner}
                        rootClassName={classes.checkboxRoot}
                        labelClassName={classes.checkboxLabel}
                        inputRootClassName={classes.checkboxInputRoot}
                      />
                    )}
                  </TableCell>
                )}
                {Object.keys(row).map(
                  (key, index) =>
                    table.columns.find(item => item.value === key).active && (
                      <TableCell key={index} className={classes.cell}>
                        <Typography className={classes.text}>
                          {row[key]}
                        </Typography>
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </MatTable>
      ))}
    </Grid>
  )
}

Table.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(Table))
