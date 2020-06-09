import React, { useCallback } from 'react'
import { FormControlReactSelect } from 'components/Form/index'

const fonts = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Alegreya Sans SC', value: 'Alegreya Sans SC' },
  { label: 'Coiny', value: 'Coiny' },
  { label: 'Indie Flower', value: 'Indie Flower' },
  { label: 'Kanit', value: 'Kanit' },
  { label: 'Kite One', value: 'Kite One' },
  { label: 'Lobster', value: 'Lobster' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Rasa', value: 'Rasa' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Ubuntu', value: 'Ubuntu' },
  { label: 'Cabin', value: 'Cabin' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Rubik', value: 'Rubik' }
]

const FormControlSelectFont = ({ options = fonts, ...props }) => {
  const formatOptionLabel = useCallback(({ value, label }) => {
    return <div style={{ fontFamily: value }}>{label}</div>
  }, [])

  return (
    <FormControlReactSelect
      formatOptionLabel={formatOptionLabel}
      options={options}
      {...props}
    />
  )
}

export default FormControlSelectFont
