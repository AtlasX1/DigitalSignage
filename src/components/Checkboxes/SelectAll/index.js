import React from 'react'
import { withStyles, Checkbox } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      color: palette[type].checkbox.color
    }
  }
}

const CheckboxSelectAll = ({
  classes,
  indeterminate = null,
  checked = false,
  onChange = f => f,
  ...props
}) => (
  <Checkbox
    indeterminate={indeterminate}
    checked={checked}
    onChange={onChange}
    classes={{ root: classes.root }}
    {...props}
  />
)

export default withStyles(styles)(CheckboxSelectAll)
