import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { Grid, InputLabel, withStyles } from '@material-ui/core'
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import classNames from 'classnames'
import { TransparentButton } from '../Buttons'
import Popup from '../Popup'
import FormControlInput from './FormControlInput'
import { numberToString } from '../../utils/numbers'

const styles = ({ type, palette, transitions, formControls }) => ({
  wrapperClass: {
    flexDirection: 'column'
  },
  input: {
    width: '100%'
  },
  pickerContainer: {
    width: 300,
    padding: '20px 30px'
  },
  pickerItem: {
    position: 'relative',
    padding: '30px 0'
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette[type].formControls.timeDuration.item.color,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none !important',
    margin: 0,

    MozAppearance: 'textfield',

    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none !important'
    },

    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none !important'
    },

    '&:focus': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: palette[type].formControls.input.background,
      border: `1px solid ${palette[type].formControls.input.border}`,
      color: palette[type].formControls.timeDuration.item.color,
      transition: transitions.create(['border-color', 'box-shadow']),
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  pickerInputContainer: {
    width: 60
  },
  pickerController: {
    position: 'absolute',
    borderRadius: '50%',
    minWidth: 47,
    width: 47,

    '&:first-child': {
      top: -15,
      left: 5
    },

    '&:last-child': {
      bottom: -15,
      left: 5
    }
  },
  formLabel: {
    ...formControls.mediaApps.timeDurationPicker.label,
    marginBottom: 7
  },
  pickerIcon: {
    // Safari fix
    height: 35
  }
})

const contentStyle = {
  transform: 'translateY(10px)'
}

const maxHours = 24
const maxMinutes = 60
const maxSeconds = 60

const MINUTES = 'MINUTES'
const SECONDS = 'SECONDS'

const FormControlTimeDurationPicker = ({
  t,
  id = '',
  classes,
  value = '00:00:00',
  label = t('Duration'),
  onChange = f => f,
  customClasses,
  formControlContainerClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  formControlInputRootClass = '',
  formControlInputClass = '',
  deepLabel = '',
  error,
  touched,
  disabled
}) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
    }
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    onChange(inputValue)
    // eslint-disable-next-line
  }, [inputValue])

  const [propHours, propsMinutes, propSeconds] = value.split(':')
  const [hours, setHours] = useState(+propHours)
  const [minutes, setMinutes] = useState(+propsMinutes)
  const [seconds, setSeconds] = useState(+propSeconds)

  const increment = (p, callback = f => f, l, t) => {
    if (p < l - 1) {
      callback(p + 1)
    } else {
      callback(0)
      if (t === MINUTES) {
        if (hours < maxHours - 1) setHours(hours + 1)
        else setHours(0)
      }
      if (t === SECONDS) {
        if (minutes < maxMinutes - 1) {
          setMinutes(minutes + 1)
        } else {
          setMinutes(0)
          if (hours < maxHours - 1) setHours(hours + 1)
          else setHours(0)
        }
      }
    }
  }

  const decrement = (p, callback = f => f, l, t) => {
    if (p > 0) {
      callback(p - 1)
    } else {
      callback(l - 1)
      if (t === MINUTES && hours > 0) setHours(hours - 1)
      if (t === SECONDS) {
        if (minutes > 0) {
          setMinutes(minutes - 1)
        } else {
          if (hours > 0) setHours(hours - 1)
          else setHours(maxHours - 1)
        }
      }
    }
  }

  useEffect(() => {
    setInputValue(
      `${numberToString(hours)}:${numberToString(minutes)}:${numberToString(
        seconds
      )}`
    )
  }, [hours, minutes, seconds])

  const handleChange = (e, callback, l) => {
    const value = +e.target.value
    if (value < l) callback(value)
    else callback(l - 1)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          container
          className={classNames(
            classes.wrapperClass,
            customClasses.wrapperClass
          )}
        >
          {label && !deepLabel && (
            <InputLabel
              shrink
              htmlFor={id}
              className={classNames(classes.formLabel, formControlLabelClass, {
                [classes.bootstrapFormLabelError]: error && touched
              })}
              classes={{
                focused: classes.bootstrapFormLabelFocus
              }}
            >
              {label}
            </InputLabel>
          )}
          <Grid item>
            <Popup
              arrow={false}
              on="click"
              contentStyle={contentStyle}
              position="bottom center"
              disabled={disabled}
              trigger={
                <FormControlInput
                  label={deepLabel ? deepLabel : null}
                  id={`form-control-time-picker-${id}`}
                  marginBottom={false}
                  fullWidth
                  value={inputValue}
                  placeholder="00:00:00"
                  handleChange={f => f}
                  formControlContainerClass={[
                    classes.input,
                    formControlContainerClass
                  ].join('')}
                  formControlRootClass={formControlRootClass}
                  formControlLabelClass={formControlLabelClass}
                  formControlInputRootClass={formControlInputRootClass}
                  formControlInputClass={formControlInputClass}
                  disabled={disabled}
                />
              }
            >
              <Grid
                container
                className={classes.pickerContainer}
                justify="space-between"
              >
                <Grid className={classes.pickerItem}>
                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() => increment(hours, setHours, maxHours)}
                  >
                    <ExpandLessIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>

                  <FormControlInput
                    id={`form-control-time-picker-${id}-hours`}
                    value={numberToString(hours)}
                    formControlInputClass={classes.pickerItemText}
                    formControlContainerClass={classes.pickerInputContainer}
                    marginBottom={false}
                    customiseDisabled={false}
                    handleChange={e => handleChange(e, setHours, maxHours)}
                    type="number"
                    pattern="\d+"
                  />

                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() => decrement(hours, setHours, maxHours)}
                  >
                    <ExpandMoreIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>
                </Grid>
                <Grid className={classes.pickerItem}>
                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() =>
                      increment(minutes, setMinutes, maxMinutes, MINUTES)
                    }
                  >
                    <ExpandLessIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>

                  <FormControlInput
                    id={`form-control-time-picker-${id}-minutes`}
                    value={numberToString(minutes)}
                    formControlInputClass={classes.pickerItemText}
                    formControlContainerClass={classes.pickerInputContainer}
                    marginBottom={false}
                    customiseDisabled={false}
                    handleChange={e => handleChange(e, setMinutes, maxMinutes)}
                    type="number"
                    pattern="\d+"
                  />

                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() =>
                      decrement(minutes, setMinutes, maxMinutes, MINUTES)
                    }
                  >
                    <ExpandMoreIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>
                </Grid>
                <Grid className={classes.pickerItem}>
                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() =>
                      increment(seconds, setSeconds, maxSeconds, SECONDS)
                    }
                  >
                    <ExpandLessIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>

                  <FormControlInput
                    id={`form-control-time-picker-${id}-seconds`}
                    value={numberToString(seconds)}
                    formControlInputClass={classes.pickerItemText}
                    formControlContainerClass={classes.pickerInputContainer}
                    marginBottom={false}
                    customiseDisabled={false}
                    handleChange={e => handleChange(e, setSeconds, maxSeconds)}
                    type="number"
                    pattern="\d+"
                  />

                  <TransparentButton
                    className={classes.pickerController}
                    onClick={() =>
                      decrement(seconds, setSeconds, maxSeconds, SECONDS)
                    }
                  >
                    <ExpandMoreIcon
                      fontSize="large"
                      className={classes.pickerIcon}
                    />
                  </TransparentButton>
                </Grid>
              </Grid>
            </Popup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

FormControlTimeDurationPicker.propTypes = {
  label: PropTypes.any,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  customClasses: PropTypes.object,
  disabled: PropTypes.bool
}

FormControlTimeDurationPicker.defaultProps = {
  customClasses: {}
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(FormControlTimeDurationPicker)
