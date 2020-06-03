import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    margin: 'auto',
    borderRadius: '50%'
  },
  normal: {
    width: '14px',
    height: '14px'
  },
  big: {
    width: '22px',
    height: '22px'
  }
})

const ColorCircle = ({ classes, color, size = 'normal' }) => (
  <div
    className={`${classes.root} ${classes[size]}`}
    style={{ backgroundColor: color }}
  />
)

export default withStyles(styles)(ColorCircle)
