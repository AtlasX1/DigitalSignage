import React, { memo } from 'react'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'

const styles = () => ({
  link: {
    textDecoration: 'inherit',
    color: 'inherit'
  }
})

const EmailLink = ({
  email,
  subject = 'Xhibit Signage Information',
  className,
  classes,
  ...props
}) => {
  return (
    <a
      className={classNames(className, classes.link)}
      href={`mailto:${email}?subject=${subject}`}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {email}
    </a>
  )
}

export default memo(withStyles(styles)(EmailLink))
