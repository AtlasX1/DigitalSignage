import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = () => ({
  typeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: '10px',
    textAlign: 'center'
  },
  typeIcon: {
    fontSize: '18px',
    lineHeight: '36px',
    color: '#fff'
  }
})

const DashboardIcon = ({
  classes,
  icon,
  color = '#6bb9ff',
  wrapHelperClass
}) => {
  const { typeIconWrap, typeIcon } = classes

  return (
    <div
      style={{ backgroundColor: color }}
      className={`${typeIconWrap}  ${wrapHelperClass}`}
    >
      <i className={`${typeIcon} ${icon}`} />
    </div>
  )
}

export default withStyles(styles)(DashboardIcon)
