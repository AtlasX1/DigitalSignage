import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import {
  withStyles,
  Table,
  TableBody,
  Typography,
  Grid
} from '@material-ui/core'

import { TableLibraryHead } from '../TableLibrary'

import { stableSort, getSorting } from '../../utils'
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
    marginRight: '15px'
  },
  cellPaddings: {
    padding: '10px 15px !important'
  },
  footerTotal: {
    paddingTop: '24px',
    paddingRight: '20px',
    fontSize: '26px',
    fontWeight: 'bold',
    color: palette[type].tableLibrary.body.cell.color,
    textAlign: 'right'
  },
  footerTotalLabel: {
    fontSize: '13px',
    color: palette[type].tableLibrary.body.cell.color
  }
})

class ClientsByWidgetsTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  state = {
    order: 'desc',
    orderBy: 'alias'
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  clientsTotalCount = clients =>
    clients.reduce((acc, { total }) => acc + total, 0)

  render() {
    const { classes, t, clients } = this.props
    const { order, orderBy } = this.state

    const rows = [
      { id: 'alias', label: t('Type'), noPaddings: true },
      { id: 'total', label: t('Clients'), noPaddings: true, align: 'right' }
    ]

    return (
      <div className={classes.root}>
        <Table className={classes.table}>
          <TableLibraryHead
            noType={true}
            editRows={false}
            actionRow={false}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            rowCount={clients.length}
            columns={rows}
          />
          <TableBody>
            {stableSort(clients, getSorting(order, orderBy)).map(row => (
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
                  align="right"
                >
                  {row.total}
                </TableLibraryCell>
              </TableLibraryRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Typography className={classes.footerTotal}>
            {this.clientsTotalCount(clients)}{' '}
            <span className={classes.footerTotalLabel}>{t('Total')}</span>
          </Typography>
        </div>
      </div>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(ClientsByWidgetsTable)
)
