import React, { useCallback } from 'react'
import { withStyles, Tooltip } from '@material-ui/core'
import classNames from 'classnames'

const styles = ({ palette, type }) => ({
  root: {
    display: 'flex',
    backgroundColor: 'grey',
    borderRadius: '5px',
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.54)',
    boxShadow: '1px 1px 9px -3px rgba(0,0,0,0.77)',
    width: 35,
    height: 40
  }
})

const IconCard = ({ icon, classes, className, onClick = f => f }) => {
  const handleClick = useCallback(() => {
    onClick(icon)
  }, [icon, onClick])

  return (
    <Tooltip title={icon} placement="top">
      <div
        className={classNames(classes.root, className)}
        onClick={handleClick}
      >
        <div className={icon} />
      </div>
    </Tooltip>
  )
}

export default withStyles(styles)(IconCard)
