import Badge from '@material-ui/core/Badge'
import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    fontSize: 'inherit'
  }
})

const CustomBadge = ({
  content = 0,
  color = 'secondary',
  max = 100000,
  children = <div> </div>,
  ...props
}) => {
  return (
    <Badge {...props} color={color} min={0} max={max} badgeContent={content}>
      {children}
    </Badge>
  )
}

export default withStyles(styles)(CustomBadge)
