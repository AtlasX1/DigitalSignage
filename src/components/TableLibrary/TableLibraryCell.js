import { withStyles, TableCell } from '@material-ui/core'

export default withStyles(({ palette, type }) => ({
  root: {
    color: palette[type].tableLibrary.body.cell.color,
    borderBottomColor: palette[type].tableLibrary.body.cell.border,
    padding: '0 20px'
  },
  head: {
    color: palette[type].tableLibrary.head.color
  }
}))(TableCell)
