import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, List, ListItem, Typography } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    list: {
      padding: 0,
      overflow: 'hidden',
      borderRadius: 8
    },
    listItem: {
      height: 35,
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      borderBottomWidth: 1,
      borderBottomColor: palette[type].pages.reports.report.table.border,
      borderBottomStyle: 'solid',
      cursor: 'pointer',

      '&:hover': {
        background: palette[type].pages.reports.report.table.head.background
      },

      '&:last-child': {
        borderBottom: 0
      }
    },
    text: {
      fontSize: 12,
      color: '#74809A',
      letterSpacing: '-0.01px',
      position: 'relative',
      top: 1
    },
    icon: {
      marginRight: 14
    }
  }
}

const options = [
  { title: 'Sort Ascending', value: 'sortA', icon: 'icon-data-upload-5' },
  { title: 'Sort Descending', value: 'sortD', icon: 'icon-data-download-5' },
  {
    title: 'Group Rows by This Field',
    value: 'groupRows',
    icon: 'icon-layout-1'
  },
  {
    title: 'Group Columns by This Field',
    value: 'groupColumns',
    icon: 'icon-layout-5'
  },
  { title: 'Remove Column', value: 'remove', icon: 'icon-bin' }
]

const TableHeadCellPopup = ({ classes, handleClick, tableIndex, column }) => (
  <List className={classes.list}>
    {options.map((option, index) => (
      <ListItem
        key={index}
        className={classes.listItem}
        onClick={() => handleClick(option.value, tableIndex, column)}
      >
        <i className={[classes.icon, option.icon].join(' ')} />

        <Typography className={classes.text}>{option.title}</Typography>
      </ListItem>
    ))}
  </List>
)

TableHeadCellPopup.propTypes = {
  classes: PropTypes.object,
  handleClick: PropTypes.func,
  tableIndex: PropTypes.number,
  column: PropTypes.string
}

export default withStyles(styles)(TableHeadCellPopup)
