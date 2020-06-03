import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    margin: 'auto',
    borderRadius: '50%'
  },
  active: {
    backgroundColor: '#4fd688'
  },
  'white-label': {
    backgroundColor: '#f5a623'
  },
  STANDARD_CLIENT: {
    backgroundColor: '#0a83c8'
  },
  inactive: {
    backgroundColor: '#f53923'
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

const TypeCircle = ({
  classes,
  color,
  type = 'STANDARD_CLIENT',
  size = 'normal'
}) => (
  <div
    className={`${classes.root} ${classes[type]} ${classes[size]}`}
    style={{ backgroundColor: color }}
  />
)

export default withStyles(styles)(TypeCircle)
