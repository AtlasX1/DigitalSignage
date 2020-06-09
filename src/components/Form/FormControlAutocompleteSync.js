import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import FormControlReactSelect from './FormControlReactSelect'

const FormControlAutocompleteSync = ({
  handleInputChange,
  options = [],
  selectComponent: SelectComponent,
  isSearchable,
  value,
  ...props
}) => {
  const onInputChangeHandler = value => {
    handleInputChange(value)
  }

  const selectedOption = useMemo(
    () => {
      if (!value) {
        return []
      }

      const val = typeof value.value === 'undefined' ? value : value.value
      const option = options.find(o => o.value === val)

      if (option) {
        return [option]
      }

      return [{ value: val, label: val }]
    },
    // eslint-disable-next-line
    [value]
  )

  return (
    <SelectComponent
      handleInputChange={onInputChangeHandler}
      isSearchable={isSearchable}
      options={options}
      value={selectedOption}
      {...props}
    />
  )
}

FormControlAutocompleteSync.propTypes = {
  handleInputChange: PropTypes.func,
  options: PropTypes.array,
  selectComponent: PropTypes.elementType,
  isSearchable: PropTypes.bool
}
FormControlAutocompleteSync.defaultProps = {
  handleInputChange: () => {},
  selectComponent: FormControlReactSelect,
  isSearchable: true
}
export default FormControlAutocompleteSync
