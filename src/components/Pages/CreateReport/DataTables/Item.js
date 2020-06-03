import React from 'react'
import PropTypes from 'prop-types'

import { Grid, withStyles, Typography } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: '100%',
      height: 28,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.dataTables.item.border,
      borderRadius: 5,
      background:
        palette[type].pages.reports.generate.dataTables.item.background,
      padding: '0 15px'
    },
    title: {
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: palette[type].pages.reports.generate.dataTables.item.color
    },
    icon: {
      fontSize: 8,
      color: '#e9a3a1',
      cursor: 'pointer'
    }
  }
}

const Item = ({
  title,
  classes,
  marginBottom = true,
  handleClick = f => f
}) => (
  <Grid
    container
    justify="space-between"
    alignItems="center"
    className={classes.container}
    style={{ marginBottom: marginBottom ? 10 : 0 }}
  >
    <Typography className={classes.title}>{title}</Typography>
    <i onClick={handleClick} className={`icon-close ${classes.icon}`} />
  </Grid>
)

Item.propTypes = {
  title: PropTypes.string.isRequired,
  classes: PropTypes.object,
  marginBottom: PropTypes.bool,
  handleClick: PropTypes.func
}

export default withStyles(styles)(Item)
