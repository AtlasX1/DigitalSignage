import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].pages.schedule.timeline.border,
      backgroundColor: palette[type].tableLibrary.body.row.background,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pages.schedule.timeline.border,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '48px',
      width: '60px'
    },
    headerLines: {
      position: 'absolute',
      height: 10,
      width: 1,
      bottom: 0,
      backgroundColor: palette[type].pages.schedule.timeline.border
    }
  }
}

const TimelineCell = ({
  t,
  classes,
  timelineCellClassnames,
  header = false,
  children
}) => {
  return (
    <Grid item xs className={[classes.root, timelineCellClassnames].join(' ')}>
      {header &&
        [1, 2, 3].map(i => (
          <div
            key={i}
            className={classes.headerLines}
            style={{ left: i * 13.87 }}
          />
        ))}

      {children}
    </Grid>
  )
}

TimelineCell.propTypes = {
  classes: PropTypes.object.isRequired,
  timelineCellClassnames: PropTypes.string
}

export default translate('translations')(withStyles(styles)(TimelineCell))
