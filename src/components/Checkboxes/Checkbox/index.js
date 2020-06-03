import { withStyles, Checkbox } from '@material-ui/core'

export default withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      color: palette[type].checkbox.color
    }
  }
})(Checkbox)
