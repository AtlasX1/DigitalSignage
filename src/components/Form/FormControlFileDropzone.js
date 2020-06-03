import React from 'react'
import {
  withStyles,
  InputLabel,
  FormControl,
  Typography
} from '@material-ui/core'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import 'styles/forms/_number-input.scss'

const styles = ({ palette, type, spacing, transitions }) => ({
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
      marginTop: spacing.unit * 3
    }
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
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
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
  bootstrapInputError: {
    borderColor: 'red'
  },
  error: {
    color: 'red',
    fontSize: 9,
    position: 'absolute',
    bottom: -17,
    left: 5
  },
  helperText: {
    margin: 0
  }
})

const FormControlFileDropzone = ({
  classes,
  id = '',
  label = '',
  value = '',
  handleChange = f => f,
  formControlContainerClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  formControlNumericInputRootClass = '',
  icon = null,
  error = '',
  touched = false,
  labelRightComponent = null,
  showErrorText = true,
  marginBottom = true,
  onClickLabel,
  helperText = 'Drop a file here, or click to select files',
  dropzoneProps
}) => {
  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <FormControl
        className={classNames(classes.formControlRoot, formControlRootClass, {
          [classes.formControlMargin]: marginBottom
        })}
      >
        {labelRightComponent && (
          <div className={classes.labelRightComponentContainer}>
            {labelRightComponent}
          </div>
        )}
        {label && (
          <InputLabel
            shrink
            htmlFor={id}
            className={classNames(
              classes.bootstrapFormLabel,
              formControlLabelClass,
              {
                [classes.bootstrapFormLabelError]: error && touched
              }
            )}
            classes={{
              focused: classes.bootstrapFormLabelFocus
            }}
            onClick={() => onClickLabel && onClickLabel()}
          >
            {label}
          </InputLabel>
        )}
        <Dropzone {...dropzoneProps}>
          {({ getRootProps, getInputProps }) => (
            <div
              className={classNames(
                classes.bootstrapRoot,
                formControlNumericInputRootClass,
                classes.bootstrapInput,
                { [classes.bootstrapInputError]: error && touched }
              )}
            >
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className={classes.helperText}>{helperText}</p>
              </div>
            </div>
          )}
        </Dropzone>

        {!!icon && icon}
        {showErrorText && error && touched && (
          <Typography className={classes.error}>{error}</Typography>
        )}
      </FormControl>
    </div>
  )
}

export default withStyles(styles)(FormControlFileDropzone)
