import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = ({ palette, type }) => ({
  counterIcon: {
    color: '#74809a'
  },
  counterValue: {
    width: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: palette[type].formControls.input.color
  }
})

const FormControlCounter = ({
  value,
  rootClassName,
  inputValueClassName,
  name,
  id,
  classes,
  handleChange,
  onChange,
  min,
  max,
  step
}) => {
  const onInc = () => {
    const newValue = Number.isFinite(max)
      ? Math.min(value + step, max)
      : value + step

    onChange(newValue)
    handleChange({
      taget: {
        value: newValue,
        name
      }
    })
  }
  const onDec = () => {
    const newValue = Number.isFinite(min)
      ? Math.max(value - step, min)
      : value - step

    onChange(newValue)
    handleChange({
      target: {
        value: newValue,
        name
      }
    })
  }
  return (
    <Grid id={id} container className={rootClassName}>
      <Grid className={classes.counterIcon} item onClick={onDec}>
        <i className="icon-subtract-square-1" />
      </Grid>
      <Grid item>
        <Typography
          className={classNames(classes.counterValue, inputValueClassName)}
        >
          {value}
        </Typography>
      </Grid>
      <Grid className={classes.counterIcon} item onClick={onInc}>
        <i className="icon-add-square-1" />
      </Grid>
    </Grid>
  )
}

FormControlCounter.propTypes = {
  value: PropTypes.number,
  handleChange: PropTypes.func,
  onChange: PropTypes.func,
  rootClassName: PropTypes.string,
  inputValueClassName: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number
}
FormControlCounter.defaultProps = {
  value: 0,
  step: 1,
  handleChange: () => {},
  onChange: () => {}
}

export default withStyles(styles)(FormControlCounter)
