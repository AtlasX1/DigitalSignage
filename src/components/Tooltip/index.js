import React from 'react'
import classNames from 'classnames'
import { Tooltip as MaterialTooltip, withStyles } from '@material-ui/core'

const styles = () => ({
  labelWrapper: {
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#0378ba',
    cursor: 'pointer'
  }
})

const Tooltip = ({
  classes,
  containerClassName,
  children,
  disableHoverListener = false,
  ...props
}) => (
  <MaterialTooltip disableHoverListener={disableHoverListener} {...props}>
    <div
      className={classNames(
        { [classes.labelWrapper]: !disableHoverListener },
        containerClassName
      )}
    >
      {children}
    </div>
  </MaterialTooltip>
)

export default withStyles(styles)(Tooltip)
