import React, { useCallback, useEffect, useState } from 'react'
import { FormControlSelectWithSearch } from 'components/Form/index'
import { debounce as _debounce } from 'lodash'
import { getLocation } from 'actions/configActions'
import { useDispatch, useSelector } from 'react-redux'

const FormControlSelectCities = ({ value, ...props }) => {
  const dispatchAction = useDispatch()
  const [cityValue, setCityValue] = useState({})
  const [receive, toggleReceive] = useState(false)
  const [citySearchPage, setSearchPage] = useState(1)

  const cities = useSelector(
    ({
      config: {
        configMediaCategory: { cities }
      }
    }) => cities
  )

  const handleCityInputChange = useCallback(
    _debounce(value => {
      if (value && !value.label) {
        const type = isNaN(value) ? 'name' : 'zipcode'

        setCityValue({ [type]: value })
        setSearchPage(1)
        dispatchAction(
          getLocation({
            [type]: value
          })
        )
      }
    }, 500),
    []
  )

  useEffect(() => {
    citySearchPage !== 1 &&
      dispatchAction(getLocation({ ...cityValue, page: citySearchPage }))
    // eslint-disable-next-line
  }, [citySearchPage])

  useEffect(() => {
    if (!receive && value) {
      setCityValue({ name: value })
      dispatchAction(
        getLocation({
          name: value
        })
      )
      toggleReceive(true)
    }
    // eslint-disable-next-line
  }, [value])

  return (
    <FormControlSelectWithSearch
      options={cities.map(item => ({
        label: `${item.name}, ${item.state}, ${item.country}`,
        value: item.name
      }))}
      handleInputChange={handleCityInputChange}
      handleMenuScrollToBottom={() => setSearchPage(citySearchPage + 1)}
      value={value}
      {...props}
    />
  )
}

export default FormControlSelectCities
