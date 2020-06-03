import React from 'react'
import NumericInput from 'react-numeric-input'
import {
  withStyles,
  InputLabel,
  FormControl,
  Typography,
  Tooltip
} from '@material-ui/core'
import classNames from 'classnames'
import BootstrapInputBase from './InputBase'
import 'styles/forms/_number-input.scss'

const styles = ({ palette, type, spacing, transitions, typography }) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControlRoot: {
    width: '100%',
    position: 'relative'
  },
  formControlMargin: {
    marginBottom: spacing.unit * 2
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: '7px'
    }
  },
  bootstrapRootWithoutMargin: {
    marginTop: 'unset !important'
  },
  bootstrapInput: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: palette[type].formControls.input.background,
    border: `1px solid ${palette[type].formControls.input.border}`,
    color: palette[type].formControls.input.color,
    fontSize: 14,
    padding: '9px 15px',
    transition: transitions.create(['border-color', 'box-shadow']),
    fontFamily: typography.fontFamily,

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapInputError: {
    borderColor: 'red'
  },
  bootstrapTextAreaHeight: {
    height: '87px'
  },
  bootstrapFormLabel: {
    fontSize: 16,
    color: palette[type].formControls.label.color
  },
  labelRightComponentContainer: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  bootstrapFormLabelFocus: {
    color: `${palette[type].formControls.label.activeColor} !important`
  },
  bootstrapFormLabelError: {
    color: 'red !important'
  },
  error: {
    color: 'red',
    fontSize: 9,
    position: 'absolute',
    bottom: -17,
    left: 5
    // margin: '10px 0 0 0'
  },
  disabled: {
    color: 'rgb(84, 84, 84)',
    cursor: 'default',
    backgroundColor: palette[type].formControls.disabled.background
  },
  rightLabel: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  topLabel: {
    display: 'flex',
    flexDirection: 'column'
  },
  leftLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomLabel: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  label: {
    position: 'unset !important'
  },
  alignLabel: {
    alignSelf: 'flex-start'
  },
  labelLink: {
    position: 'unset !important',
    borderBottom: '1px dashed #0A83C8',
    '&:hover': {
      cursor: 'pointer',
      borderBottomStyle: 'solid'
    }
  }
})

const FormControlInput = ({
  classes,
  id = '',
  type = 'text',
  autocomplete = 'off',
  label = '',
  value = '',
  fullWidth = false,
  placeholder = null,
  min = 0,
  max = 9999999,
  formControlContainerClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  formControlInputRootClass = '',
  formControlInputClass = '',
  formControlNumericInputRootClass = '',
  multiline = false,
  handleChange = f => f,
  name,
  strict = true,
  disabled = false,
  custom = false,
  icon = null,
  error = '',
  touched = false,
  handleBlur = f => f,
  labelRightComponent = null,
  showErrorText = true,
  marginBottom = true,
  customiseDisabled = true,
  pattern,
  onClickLabel,
  labelPosition = 'top',
  tooltip = '',
  ...props
}) => {
  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <FormControl
        className={classNames(classes.formControlRoot, formControlRootClass, {
          [classes.formControlMargin]: marginBottom,
          [classes.leftLabel]: labelPosition === 'left',
          [classes.topLabel]: labelPosition === 'top',
          [classes.bottomLabel]: labelPosition === 'bottom',
          [classes.rightLabel]: labelPosition === 'right'
        })}
      >
        {labelRightComponent && (
          <div className={classes.labelRightComponentContainer}>
            {labelRightComponent}
          </div>
        )}

        {label ? (
          <Tooltip
            title={tooltip}
            disableHoverListener={!tooltip}
            placement="top"
          >
            <InputLabel
              shrink
              htmlFor={id}
              className={classNames(
                classes.bootstrapFormLabel,
                formControlLabelClass,
                {
                  [classes.bootstrapFormLabelError]: error && touched,
                  [classes.alignLabel]:
                    labelPosition === 'top' || labelPosition === 'bottom'
                }
              )}
              classes={{
                focused: classes.bootstrapFormLabelFocus,
                root: tooltip ? classes.labelLink : classes.label
              }}
              onClick={() => onClickLabel && onClickLabel()}
            >
              {label}
            </InputLabel>
          </Tooltip>
        ) : null}

        {custom ? (
          <div
            className={classNames(
              classes.bootstrapRoot,
              formControlNumericInputRootClass,
              {
                [classes.bootstrapRootWithoutMargin]: labelPosition !== 'top'
              }
            )}
          >
            <NumericInput
              strict={strict}
              min={min}
              max={max}
              value={value}
              disabled={disabled}
              name={name}
              onChange={val => handleChange(val, name)}
              className={classNames(
                classes.bootstrapInput,
                formControlInputClass,
                error && touched && classes.bootstrapInputError
              )}
            />
          </div>
        ) : (
          <BootstrapInputBase
            id={id}
            type={type}
            value={value}
            name={name}
            fullWidth={fullWidth}
            placeholder={placeholder}
            multiline={multiline}
            disabled={disabled}
            pattern={pattern}
            autoComplete={autocomplete}
            classes={{
              root: classNames(
                classes.bootstrapRoot,
                formControlInputRootClass,
                {
                  [classes.bootstrapRootWithoutMargin]: labelPosition !== 'top'
                }
              ),
              input: classNames(classes.bootstrapInput, formControlInputClass, {
                [classes.bootstrapTextAreaHeight]: multiline,
                [classes.bootstrapInputError]: error && touched,
                [classes.disabled]: disabled && customiseDisabled
              })
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
        )}

        {!!icon && icon}

        {showErrorText && error && touched && (
          <Typography className={classes.error}>{error}</Typography>
        )}
      </FormControl>
    </div>
  )
}

export default withStyles(styles)(FormControlInput)
