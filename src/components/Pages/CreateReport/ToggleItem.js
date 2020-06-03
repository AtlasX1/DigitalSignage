import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import Switcher from '../../Checkboxes/Switcher'

const styles = {
  container: {
    '&:last-child': {
      marginBottom: '0 !important'
    }
  },
  switcherContainer: {
    width: '100%'
  },
  switcherLabelRoot: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  switcherBase: {
    width: 7,
    height: 15
  },
  switcherRoot: {
    width: 20
  }
}

const ToggleItem = ({
  classes,
  title = '',
  value = false,
  marginBottom = 10
}) => (
  <Grid
    container
    justify="space-between"
    className={classes.container}
    style={{
      marginBottom
    }}
  >
    <Switcher
      label={title}
      value={value}
      switchContainerClass={classes.switcherContainer}
      formControlRootClass={classes.switcherLabelRoot}
      switchBaseClass={classes.switcherBase}
      switchRootClass={classes.switcherRoot}
    />
  </Grid>
)

ToggleItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.bool,
  classes: PropTypes.object,
  marginBottom: PropTypes.number
}

export default withStyles(styles)(ToggleItem)
