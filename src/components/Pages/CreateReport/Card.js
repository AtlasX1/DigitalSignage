import React from 'react'
import PropTypes from 'prop-types'

import { Grid, withStyles, Typography } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      width: '100%',
      height: 49,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.border,
      background: palette[type].pages.reports.generate.background,
      padding: '0 15px'
    },
    headerNoBorder: {
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none'
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: '-0.02px',
      color: palette[type].pages.reports.generate.color
    },
    content: {
      padding: '10px 15px',
      height: 'calc(100% - 49px)'
    },
    contentWithFooter: {
      height: 'calc(100% - 49px - 58px)'
    },
    container: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pages.reports.generate.border
    },
    containerNoBorder: {
      border: 'none'
    },
    footer: {
      height: 58,
      padding: '0 15px',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: palette[type].pages.reports.generate.border
    }
  }
}

const Card = ({
  classes,
  height,
  borderRadius,
  border = true,
  title = '',
  contentClassName = '',
  footer = null,
  children,
  overflow = false
}) => (
  <Grid
    container
    direction="column"
    style={{
      height,
      borderRadius,
      overflow: overflow ? 'visible' : 'hidden'
    }}
    className={[
      classes.container,
      !border ? classes.containerNoBorder : ''
    ].join(' ')}
  >
    <Grid
      container
      alignItems="center"
      className={[classes.header, !border ? classes.headerNoBorder : ''].join(
        ' '
      )}
    >
      <Typography className={classes.title}>{title}</Typography>
    </Grid>

    <Grid
      container
      direction="column"
      className={[
        classes.content,
        contentClassName,
        footer ? classes.contentWithFooter : ''
      ].join(' ')}
    >
      {children}
    </Grid>

    {footer && (
      <Grid container className={classes.footer}>
        {footer}
      </Grid>
    )}
  </Grid>
)

Card.propTypes = {
  title: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object,
  children: PropTypes.node,
  borderRadius: PropTypes.number,
  border: PropTypes.bool,
  contentClassName: PropTypes.string,
  footer: PropTypes.node,
  overflow: PropTypes.bool
}

export default withStyles(styles)(Card)
