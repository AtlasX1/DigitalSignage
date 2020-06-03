import React from 'react'
import FormControlChips from 'components/Form/FormControlChips'

const FormControlSelectWithSearch = ({ onChange, value, ...props }) => {
  return (
    <FormControlChips
      values={value}
      handleChange={onChange}
      isMulti={false}
      {...props}
    />
  )
}

export default FormControlSelectWithSearch
