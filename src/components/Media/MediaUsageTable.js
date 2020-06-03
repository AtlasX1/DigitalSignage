import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Button,
  Typography,
  Grid
} from '@material-ui/core'

import { withSnackbar } from 'notistack'

import { TableLibraryHead, TableLibraryRowActionButton } from '../TableLibrary'

import { stableSort } from '../../utils'
import DashboardIcon from '../Dashboard/DashboardIcon'
import TableLibraryRow from '../TableLibrary/TableLibraryRow'
import TableLibraryCell from '../TableLibrary/TableLibraryCell'

const styles = ({ palette, type }) => ({
  root: {
    width: '100%'
  },
  name: {
    lineHeight: '36px',
    fontWeight: 'bold',
    color: palette[type].tableLibrary.body.cell.color
  },
  toggleApprovedIcon: {
    width: 24,
    height: 24,
    cursor: 'pointer'
  },
  typeIconWrap: {
    marginRight: '25px'
  },
  cellPaddings: {
    padding: '10px 15px !important'
  },
  footerTotal: {
    paddingTop: '24px',
    fontSize: '26px',
    fontWeight: 'bold',
    color: palette[type].tableLibrary.body.cell.color,

    '&:first-child': {
      paddingLeft: '80px'
    }
  },
  footerTotalMBLabel: {
    fontSize: '13px',
    color: palette[type].tableLibrary.body.cell.color,
    paddingLeft: 8
  }
})

class MediaUsageTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
    media: PropTypes.shape({
      summary: PropTypes.object,
      byType: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
  }

  state = {
    order: 'desc',
    orderBy: 'valid'
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  deleteRow = (row, index) => {
    const { enqueueSnackbar, t } = this.props

    enqueueSnackbar(`${row.alias} ${t('Snackbar is removed')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.addRow(row, index)
    })
  }

  addRow = (row, index) => {
    const { enqueueSnackbar, t } = this.props
    const { data: newData } = this.state

    newData.push(row)

    enqueueSnackbar(`${row.alias} ${t('Snackbar is added')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.deleteRow(row, index)
    })
  }

  desc(a, b, orderBy) {
    if (orderBy !== 'alias') {
      if (b.total[orderBy] < a.total[orderBy]) return -1
      if (b.total[orderBy] > a.total[orderBy]) return 1
      return 0
    }

    if (b[orderBy] < a[orderBy]) return -1
    if (b[orderBy] > a[orderBy]) return 1
    return 0
  }

  getSorting = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy)
  }

  render() {
    const {
      classes,
      t,
      media: { summary, byType }
    } = this.props
    const { order, orderBy } = this.state

    const rows = [
      { id: 'alias', label: t('Type'), noPaddings: true },
      { id: 'valid', label: t('Valid'), noPaddings: true, align: 'center' },
      { id: 'invalid', label: t('Invalid'), noPaddings: true, align: 'center' },
      { id: 'size', label: t('Size (MB)'), noPaddings: true, align: 'center' }
    ]

    return (
      <div className={classes.root}>
        <Table>
          <TableLibraryHead
            noType={true}
            editRows={false}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            rowCount={byType.length}
            columns={rows}
          />
          <TableBody>
            {stableSort(byType, this.getSorting(order, orderBy)).map(
              (row, index) => {
                return (
                  <TableLibraryRow key={row.id} hover tabIndex={-1}>
                    <TableLibraryCell
                      className={classes.cellPaddings}
                      align="center"
                    >
                      <Grid container>
                        <Grid item>
                          <DashboardIcon
                            color={row.color}
                            icon={row.icon}
                            wrapHelperClass={classes.typeIconWrap}
                          />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.name}>
                            {row.alias}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableLibraryCell>

                    <TableLibraryCell
                      className={classes.cellPaddings}
                      align="center"
                    >
                      {row.total.valid}
                    </TableLibraryCell>
                    <TableLibraryCell
                      className={classes.cellPaddings}
                      align="center"
                    >
                      {row.total.invalid}
                    </TableLibraryCell>
                    <TableLibraryCell
                      className={classes.cellPaddings}
                      align="center"
                    >
                      {row.total.size}
                    </TableLibraryCell>

                    <TableLibraryCell
                      className={classes.cellPaddings}
                      align="right"
                    >
                      <TableLibraryRowActionButton
                        actionLinks={[
                          {
                            label: t('Add to Playlist Media action'),
                            clickAction: f => f
                          },
                          { label: t('Edit action'), clickAction: f => f },
                          { divider: true },
                          {
                            label: t('Delete Media action'),
                            icon: 'icon-bin',
                            clickAction: () => this.deleteRow(row, index)
                          }
                        ]}
                      />
                    </TableLibraryCell>
                  </TableLibraryRow>
                )
              }
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className={classes.footerTotal}>
                {summary.total}
              </TableCell>
              <TableCell className={classes.footerTotal}>
                {summary.valid}
              </TableCell>
              <TableCell className={classes.footerTotal}>
                {summary.invalid}
              </TableCell>
              <TableCell className={classes.footerTotal}>
                {summary.size}
                <span className={classes.footerTotalMBLabel}>{t('MB')}</span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(withSnackbar(MediaUsageTable))
)
