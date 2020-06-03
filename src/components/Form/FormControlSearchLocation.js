import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormControlSelectWithSearch } from 'components/Form/index'
import { debounce as _debounce } from 'lodash'
import { getLocationInfo } from 'actions/configActions'
import { useDispatch, useSelector } from 'react-redux'

const FormControlSearchLocation = ({ ...props }) => {
  const [prevLocation, setPrevLocation] = useState(null)

  const dispatch = useDispatch()
  const locations = useSelector(
    ({
      config: {
        locationsInfo: { response: locations }
      }
    }) => locations
  )

  const handleInputChange = useCallback(
    _debounce(location => {
      if (location) dispatch(getLocationInfo(location))
    }, 100),
    []
  )

  useEffect(
    () => {
      if (
        props.value &&
        props.value !== prevLocation &&
        options.every(({ value }) => value !== props.value)
      ) {
        setPrevLocation(props.value)
        dispatch(getLocationInfo(props.value))
      }
    },
    //eslint-disable-next-line
    [props.value]
  )

  const options = useMemo(
    () =>
      locations.map(location => ({
        label: location.name,
        value: location.name,
        data: location
      })),
    [locations]
  )

  return (
    <FormControlSelectWithSearch
      handleInputChange={handleInputChange}
      options={options}
      {...props}
    />
  )
}

export default FormControlSearchLocation
