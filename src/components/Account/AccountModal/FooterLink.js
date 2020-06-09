import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'

function styles() {
  return {
    inlineWrapper: {
      display: 'inline-block'
    },
    footerLink: {
      display: 'inline-block',
      color: '#0076b9',
      textDecoration: 'none'
    },
    footerLinkMargin: {
      margin: '0 10px'
    },
    footerLinkText: {
      fontSize: 13,
      color: '#0076b9'
    }
  }
}

function createAttrs(href, target, rel) {
  return {
    href,
    target,
    rel
  }
}

function FooterLink({ href, label, classes, inline }) {
  const attrs = createAttrs(href, '_blank', 'noopener noreferrer')
  if (inline) {
    return (
      <a {...attrs} className={classes.footerLink}>
        {label}
      </a>
    )
  }
  return (
    <Grid item>
      <a
        {...attrs}
        className={classNames(classes.footerLink, classes.footerLinkMargin)}
      >
        <Typography className={classes.footerLinkText}>{label}</Typography>
      </a>
    </Grid>
  )
}

FooterLink.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
  classes: PropTypes.object,
  inline: PropTypes.bool
}

export default withStyles(styles)(FooterLink)
