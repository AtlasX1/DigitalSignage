import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid, Typography } from '@material-ui/core'

import FormControlTimeDurationPicker from './FormControlTimeDurationPicker'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      background:
        palette[type].formControls.multipleTimePicker.input.background,
      border: `1px solid ${palette[type].formControls.multipleTimePicker.input.border}`,
      borderRadius: 3,
      height: 28,
      width: '100%',
      overflow: 'hidden'
    },
    divider: {
      width: 30,
      height: '100%',
      border: `1px solid ${palette[type].formControls.multipleTimePicker.input.border}`,
      background: palette[type].formControls.multipleTimePicker.input.border
    },
    dividerLabel: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '-0.02px',
      color: palette[type].formControls.multipleTimePicker.label.color
    },
    input: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 85,
      height: '100%',
      border: 'none',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '-0.03px',
      color: palette[type].formControls.multipleTimePicker.input.color,
      textAlign: 'center',
      cursor: 'pointer'
    },
    inputSmall: {
      width: 60,
      fontSize: 11
    },
    dropdownListWrap: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      zIndex: 111
    },
    smallTimePicker: {
      width: 72,
      padding: '0 13px',
      height: 26,
      border: 0,
      fontSize: 11
    }
  }
}

const FormControlMultipleTimePicker = ({
  classes,
  small = false,
  onChange = f => f,
  fromValue: from = '00:00:00',
  toValue: to = '00:00:00'
}) => {
  const selectOption = useCallback(
    field => value => {
      if (field === 'from') {
        onChange([value, to])
      } else {
        onChange([from, value])
      }
    },
    [from, to, onChange]
  )

  return (
    <Grid
      container
      justify="space-between"
      className={[classes.container, small ? classes.containerSmall : ''].join(
        ' '
      )}
    >
      <Grid item>
        <FormControlTimeDurationPicker
          value={from}
          onChange={selectOption('from')}
          label={null}
          formControlInputClass={classes.smallTimePicker}
        />
      </Grid>
      <Grid
        item
        className={classes.divider}
        container
        justify="center"
        alignItems="center"
      >
        <Typography className={classes.dividerLabel}>TO</Typography>
      </Grid>
      <Grid item>
        <FormControlTimeDurationPicker
          value={to}
          formControlInputClass={classes.smallTimePicker}
          onChange={selectOption('to')}
          label={null}
          position={'bottom right'}
        />
      </Grid>
    </Grid>
  )
}

FormControlMultipleTimePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  small: PropTypes.bool
}

export default withStyles(styles)(FormControlMultipleTimePicker)
