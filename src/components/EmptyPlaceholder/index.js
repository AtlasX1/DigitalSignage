import React from 'react'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'

const styles = ({ typography }) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh'
  },
  label: {
    color: '#888996',
    fontSize: '1rem',
    fontFamily: typography.fontFamily
  }
})

const EmptyPlaceholder = ({ classes, text, rootClassName }) => {
  return (
    <div className={classNames(classes.root, rootClassName)}>
      <span className={classes.label}>{text}</span>
    </div>
  )
}

export default withStyles(styles)(EmptyPlaceholder)
