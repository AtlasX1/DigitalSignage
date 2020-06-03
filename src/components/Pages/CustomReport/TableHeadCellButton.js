import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { KeyboardArrowDown } from '@material-ui/icons'

import Popup from '../../Popup'
import TableHeadCellPopup from './TableHeadCellPopup'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      height: '100%',
      maxHeight: 40,
      padding: '0 12px',
      cursor: 'pointer',

      '&:hover': {
        background:
          palette[type].pages.reports.report.table.cell.hover.background
      }
    },
    text: {
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: '40px',
      color: '#74809A',
      letterSpacing: '-0.01px'
    },
    icon: {
      fontSize: 20
    }
  }
}

const contentStyle = {
  width: 206,
  borderRadius: 8,
  padding: 0
}

const arrowStyle = {
  left: 160
}

const TableHeadCellButton = ({
  classes,
  title,
  handleClick = f => f,
  tableIndex,
  column
}) => (
  <Popup
    position="bottom right"
    trigger={
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.container}
      >
        <Typography className={classes.text}>{title}</Typography>
        <KeyboardArrowDown className={classes.icon} />
      </Grid>
    }
    contentStyle={contentStyle}
    arrowStyle={arrowStyle}
  >
    <TableHeadCellPopup
      handleClick={handleClick}
      tableIndex={tableIndex}
      column={column}
    />
  </Popup>
)

TableHeadCellButton.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  handleClick: PropTypes.func,
  tableIndex: PropTypes.number,
  column: PropTypes.string
}

export default withStyles(styles)(TableHeadCellButton)
