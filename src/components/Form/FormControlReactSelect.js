import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { InputLabel, withStyles } from '@material-ui/core'

import FormControlChips from 'components/Form/FormControlChips'

const styles = ({ palette, type }) => ({
  bootstrapFormLabel: {
    fontSize: '1.0833rem',
    lineHeight: '24px',
    color: palette[type].formControls.label.color,
    whiteSpace: 'pre'
  },
  errorLabel: {
    color: 'red'
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
  topLabelMargin: {
    marginBottom: 0
  },
  bottomLabelMargin: {
    marginTop: '7px'
  }
})

const FormControlReactSelect = ({
  classes,
  onChange,
  value,
  labelPosition = 'top',
  label,
  formControlContainerClass,
  formControlLabelClass,
  error,
  touched,
  marginBottom = 0,
  isSearchable,
  ...props
}) => {
  return (
    <div
      className={classNames(formControlContainerClass, {
        [classes.leftLabel]: labelPosition === 'left',
        [classes.topLabel]: labelPosition === 'top',
        [classes.bottomLabel]: labelPosition === 'bottom',
        [classes.rightLabel]: labelPosition === 'right'
      })}
    >
      {label && (
        <InputLabel
          shrink
          className={classNames(
            classes.bootstrapFormLabel,
            formControlLabelClass,
            {
              [classes.errorLabel]: error && touched,
              [classes.alignLabel]:
                labelPosition === 'top' || labelPosition === 'bottom',
              [classes.topLabelMargin]: labelPosition === 'top',
              [classes.bottomLabelMargin]: labelPosition === 'bottom'
            }
          )}
          classes={{
            focused: classes.bootstrapFormLabelFocus,
            root: classes.label
          }}
        >
          {label}
        </InputLabel>
      )}

      <FormControlChips
        isMulti={false}
        isSearchable={isSearchable}
        handleChange={onChange}
        values={value}
        marginBottom={marginBottom}
        error={error}
        touched={touched}
        {...props}
      />
    </div>
  )
}

FormControlReactSelect.propTypes = {
  isSearchable: PropTypes.bool
}

FormControlReactSelect.defaultProps = {
  isSearchable: false
}

export default withStyles(styles)(FormControlReactSelect)
