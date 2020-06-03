import { TableRow, withStyles } from '@material-ui/core'

export default withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      backgroundColor: palette[type].tableLibrary.body.row.background,
      height: 90
    },
    hover: {
      backgroundColor: palette[type].tableLibrary.body.row.hover
    },
    selected: {
      backgroundColor: palette[type].tableLibrary.body.row.hover
    }
  }
})(TableRow)
