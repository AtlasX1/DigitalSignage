import React, { Fragment } from 'react'
import InputRange from 'react-input-range'
import NumericInput from 'react-numeric-input'
import classNames from 'classnames'
import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'
import 'react-input-range/lib/bundle/react-input-range.css'
import BootstrapInputBase from './InputBase'
import 'styles/forms/_slider-input-range.scss'

const styles = ({ palette, type, transitions, typography, formControls }) => ({
  inputRoot: {
    marginLeft: '10px'
  },
  input: {
    maxWidth: '76px',
    height: '28px',
    paddingRight: 0,
    textAlign: 'right',
    ...formControls.mediaApps.refreshEverySlider.input
  },
  label: {
    fontSize: '13px',
    fontStyle: 'italic',
    lineHeight: '28px',
    color: palette[type].formControls.label.color,
    marginRight: '16px',
    transform: 'translate(0, 1.5px) scale(0.75)',
    ...formControls.mediaApps.refreshEverySlider.label
  },
  labelLink: {
    borderBottom: '1px dashed #0A83C8',
    '&:hover': {
      cursor: 'pointer',
      borderBottomStyle: 'solid'
    }
  },
  error: {
    color: 'red',
    fontSize: 9
  },
  numericInput: {
    textAlign: 'right',
    color: palette[type].formControls.input.color,
    transition: transitions.create(['border-color', 'box-shadow']),
    fontFamily: typography.fontFamily,

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  inputContainerClass: {
    '& > .react-numeric-input': {
      marginLeft: '10px',
      ...formControls.mediaApps.refreshEverySlider.input
    }
  }
})

const SliderInputRange = ({ classes, ...props }) => {
  const {
    id,
    maxValue = 20,
    minValue = 1,
    step = 1,
    label = 'GB',
    labelAtEnd = true,
    rootClass = '',
    inputRangeContainerClass = '',
    inputRangeContainerSASS = '',
    inputContainerClass = '',
    inputRootClass = '',
    inputClass = '',
    labelClass = '',
    tooltip = '',
    input = true,
    formatLabel = () => '',
    value = 0,
    disabled = false,
    customInput = true,
    onChange = () => {},
    numberWraperStyles = {}
  } = props

  return (
    <Grid container className={rootClass} wrap="nowrap" justify="space-between">
      {label && !labelAtEnd && (
        <Grid item>
          {tooltip ? (
            <Tooltip title={tooltip} placement="top">
              <Typography className={classNames(classes.label, labelClass)}>
                <span className={classes.labelLink}>{label}</span>
              </Typography>
            </Tooltip>
          ) : (
            <Typography className={classNames(classes.label, labelClass)}>
              {label}
            </Typography>
          )}
        </Grid>
      )}
      <Grid
        item
        className={classNames(
          inputRangeContainerClass,
          inputRangeContainerSASS
        )}
      >
        <InputRange
          formatLabel={formatLabel}
          maxValue={maxValue}
          minValue={minValue}
          value={value}
          step={step}
          onChange={onChange}
          onChangeComplete={onChange}
          disabled={disabled}
        />
      </Grid>
      {input && (
        <Fragment>
          <Grid
            item
            className={classNames(
              classes.inputContainerClass,
              inputContainerClass
            )}
          >
            {customInput ? (
              <NumericInput
                style={{ wrap: numberWraperStyles }}
                strict
                min={minValue}
                max={maxValue}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={classes.numericInput}
              />
            ) : (
              <BootstrapInputBase
                id={id}
                type="number"
                classes={{
                  root: classNames(classes.inputRoot, inputRootClass),
                  input: classNames(classes.input, inputClass)
                }}
                inputProps={{
                  step,
                  min: minValue,
                  max: maxValue
                }}
                onChange={({ target: { value } }) =>
                  onChange(+value > maxValue ? maxValue : +value)
                }
                value={value}
                disabled={disabled}
              />
            )}
          </Grid>
          {label && labelAtEnd && (
            <Grid item>
              <Typography className={classNames(classes.label, labelClass)}>
                {label}
              </Typography>
            </Grid>
          )}
        </Fragment>
      )}
    </Grid>
  )
}

export default withStyles(styles)(SliderInputRange)
