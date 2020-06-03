import React, { useCallback, useState } from 'react'
import IntlTelInput from 'react-intl-tel-input'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  withStyles,
  InputLabel,
  FormControl,
  Typography
} from '@material-ui/core'

import 'react-intl-tel-input/dist/main.css'
import 'styles/forms/_tel-input.scss'

const styles = ({ palette, type, typography, spacing, transitions }) => {
  return {
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    formControlRoot: {
      width: '100%'
    },
    formControlRootM: {
      marginBottom: spacing.unit * 2
    },
    containerClassName: {
      fontFamily: typography.fontFamily,

      'label + &': {
        marginTop: spacing.unit * 3
      }
    },
    inputClassName: {
      width: '100%',
      borderRadius: 4,
      position: 'relative',
      backgroundColor: palette[type].formControls.input.background,
      border: `1px solid ${palette[type].formControls.input.border}`,
      color: palette[type].formControls.input.color,
      fontSize: 14,
      padding: '9px 15px',
      transition: transitions.create(['border-color', 'box-shadow']),

      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
      }
    },
    bootstrapInputError: {
      borderColor: 'red'
    },
    bootstrapFormLabel: {
      fontSize: 16,
      color: palette[type].formControls.label.color
    },
    bootstrapFormLabelError: {
      color: 'red'
    },
    error: {
      color: 'red',
      fontSize: 9,
      position: 'absolute',
      bottom: -17,
      left: 5
    }
  }
}

const FormControlTelInput = ({
  classes,
  fieldId = '',
  label = null,
  customClass = {},
  onChangeFlag = f => f,
  marginBottom = true,
  name,
  value = '',
  error,
  touched = false,
  onBlur = f => f,
  onChange = f => f,
  ...props
}) => {
  const {
    root: rootClass = '',
    container: containerClass = '',
    label: labelClass = '',
    input: inputClass = ''
  } = customClass

  const [isValid, toggleValid] = useState(true)

  const handleChangeFlag = useCallback(
    (...params) => {
      const valid = 3,
        value = 0
      toggleValid(params[valid])
      onChangeFlag(params)
      onChange({ target: { name, value: params[value] } })
    },
    [name, onChange, onChangeFlag]
  )

  const handlePhoneNumberBlur = useCallback(
    valid => {
      toggleValid(valid)
      onBlur({ target: { name } })
    },
    [onBlur, name]
  )

  const handleChange = useCallback(
    (valid, number) => {
      onChange({ target: { name, value: number } })
    },
    [name, onChange]
  )

  return (
    <div className={classes.root}>
      <FormControl
        className={classNames(classes.formControlRoot, rootClass, {
          [classes.formControlRootM]: marginBottom
        })}
      >
        {label && (
          <InputLabel
            shrink
            htmlFor={fieldId}
            className={classNames(classes.bootstrapFormLabel, labelClass, {
              [classes.bootstrapFormLabelError]:
                (error && touched) || (!isValid && !error && touched)
            })}
          >
            {label}
          </InputLabel>
        )}

        <IntlTelInput
          fieldId={fieldId}
          fieldName={name}
          containerClassName={classNames(
            'intl-tel-input',
            classes.containerClassName,
            containerClass
          )}
          inputClassName={classNames(
            'form-control',
            classes.inputClassName,
            inputClass,
            {
              [classes.bootstrapInputError]:
                (error && touched) || (!isValid && !error && touched)
            }
          )}
          autoPlaceholder={false}
          onSelectFlag={handleChangeFlag}
          value={value}
          onPhoneNumberChange={handleChange}
          onPhoneNumberBlur={handlePhoneNumberBlur}
          {...props}
        />
        {error && touched && (
          <Typography className={classes.error}>{error}</Typography>
        )}
        {!isValid && !error && touched && (
          <Typography className={classes.error}>Enter valid number</Typography>
        )}
      </FormControl>
    </div>
  )
}

FormControlTelInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default withStyles(styles)(FormControlTelInput)
