import React from 'react'
import classNames from 'classnames'
import { Typography, withStyles } from '@material-ui/core'

const styles = ({ palette, type }) => ({
  root: {
    border: `solid 1px ${palette[type].pages.media.general.card.border}`,
    width: '100%',
    borderRadius: '4px'
  },
  content: {
    padding: `22px 14px 44px 13px`
  },
  headerContainer: {
    padding: '16px 0 13px 12px',
    borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
    backgroundColor: palette[type].pages.media.general.card.header.background
  },
  headerText: {
    fontWeight: 'bold',
    color: palette[type].pages.media.general.card.header.color
  }
})

const Section = ({ title, children, className, contentClass, classes }) => {
  return (
    <div className={classNames(classes.root, className)}>
      <header className={classes.headerContainer}>
        <Typography className={classes.headerText}>{title}</Typography>
      </header>
      <div className={classNames(classes.content, contentClass)}>
        {children}
      </div>
    </div>
  )
}

export default withStyles(styles)(Section)
