import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import FormControlReactSelect from './FormControlReactSelect'

const FormControlAutocomplete = ({
  handleInputChange,
  getOptions,
  selectComponent: SelectComponent,
  isSearchable,
  value,
  ...props
}) => {
  const [isLoading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const cache = useRef({})

  const onInputChangeHandler = value => {
    handleInputChange(value)
    loadNewOptions(value)
  }

  const loadNewOptions = async value => {
    if (getOptions) {
      setLoading(true)
      cache.current[value] = cache.current[value] || (await getOptions(value))
      setOptions(cache.current[value])
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNewOptions('')
    // eslint-disable-next-line
  }, [])

  const selectedOption = useMemo(() => {
    if (!value) {
      return []
    }

    const val = typeof value.value === 'undefined' ? value : value.value
    const option = options.find(o => o.value === val)

    if (option) {
      return [option]
    }

    return [{ value: val, label: val }]
  }, [value, options])

  return (
    <SelectComponent
      isLoading={isLoading}
      handleInputChange={onInputChangeHandler}
      isSearchable={isSearchable}
      options={[...options, ...selectedOption]}
      value={selectedOption}
      {...props}
    />
  )
}

FormControlAutocomplete.propTypes = {
  handleInputChange: PropTypes.func,
  getOptions: PropTypes.func,
  selectComponent: PropTypes.elementType,
  isSearchable: PropTypes.bool
}
FormControlAutocomplete.defaultProps = {
  handleInputChange: () => {},
  selectComponent: FormControlReactSelect,
  isSearchable: true
}
export default FormControlAutocomplete
