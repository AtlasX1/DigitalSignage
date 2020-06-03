import React, { useState } from 'react'

import { translate } from 'react-i18next'

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

import { BlueButton } from '../../../../Buttons'

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
    display: 'flex'
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
  }
})

const MediaStatus = ({ t, classes }) => {
  const [data] = useState([])
  return (
    <Grid container direction="column">
      <Grid container direction="column" className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCell} align="center">
                <Typography className={classes.tableHeadText}>
                  {t('Media type').toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell} align="center">
                <Typography className={classes.tableHeadText}>
                  {t('Media title').toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell} align="center">
                <Typography className={classes.tableHeadText}>
                  {t('Status').toUpperCase()}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {!!data.length && (
            <TableBody>
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell} align="center">
                  1
                </TableCell>
                <TableCell className={classes.tableCell} align="center">
                  2
                </TableCell>
                <TableCell className={classes.tableCell} align="center">
                  3
                </TableCell>
              </TableRow>
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
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(MediaStatus))
