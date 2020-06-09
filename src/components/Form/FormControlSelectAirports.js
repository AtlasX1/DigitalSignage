import React, { useCallback, useEffect } from 'react'
import { debounce as _debounce } from 'lodash'
import { FormControlSelectWithSearch } from 'components/Form/index'
import { useDispatch, useSelector } from 'react-redux'
import { getAirports } from 'actions/configActions'
import { isEmpty } from 'lodash'

const FormControlSelectAirports = ({ value, ...props }) => {
  const airports = useSelector(
    ({
      config: {
        airports: { response }
      }
    }) => response
  ).map(({ airport }) => ({ value: airport, label: airport }))

  const dispatch = useDispatch()

  const handleChange = useCallback(
    _debounce(value => {
      if (value) {
        dispatch(
          getAirports({
            airport: value
          })
        )
      }
    }, 300),
    []
  )

  useEffect(
    () => {
      if (isEmpty(airports) && value) {
        dispatch(
          getAirports({
            airport: value.split(' - ')[1]
          })
        )
      }
    },
    // eslint-disable-next-line
    [value]
  )
  return (
    <FormControlSelectWithSearch
      options={airports}
      handleInputChange={handleChange}
      value={value}
      {...props}
    />
  )
}
export default FormControlSelectAirports
