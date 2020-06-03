import React from 'react'
import PropTypes from 'prop-types'

import { FormControlLabel } from '@material-ui/core'

import { Checkbox } from '../Checkboxes'

const FormControlCheckbox = ({
  value = false,
  label = '',
  rootClassName = '',
  labelClassName = '',
  inputRootClassName = ''
}) => {
  return (
    <FormControlLabel
      value="end"
      control={
        <Checkbox
          classes={{
            root: inputRootClassName
          }}
        />
      }
      label={label}
      labelPlacement="end"
      classes={{
        root: rootClassName,
        label: labelClassName
      }}
    />
  )
}

FormControlCheckbox.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string,
  rootClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputRootClassName: PropTypes.string
}

export default FormControlCheckbox
