import { withStyles, TableCell } from '@material-ui/core'

export default withStyles(({ palette, type }) => ({
  root: {
    color: palette[type].tableLibrary.body.cell.color,
    borderBottomColor: palette[type].tableLibrary.body.cell.border,
    paddingTop: '0px',
    paddingBottom: '0px'
  }
}))(TableCell)
