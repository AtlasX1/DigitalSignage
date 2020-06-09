import React, { useCallback, useMemo } from 'react'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'

const defaultOptions = [
  {
    label: 'Small(470px X 330px)',
    value: '470x330'
  },
  {
    label: 'Medium(620px X 420px)',
    value: '620x420'
  },
  {
    label: 'Large(820px X 520px)',
    value: '820x520'
  }
]

const FormControlSelectResolution = ({
  options = defaultOptions,
  width,
  nameWidth,
  height,
  nameHeight,
  onChange,
  ...rest
}) => {
  const computedValue = useMemo(() => `${width}x${height}`, [height, width])
  const handleChange = useCallback(
    ({ target: { value: resolution } }) => {
      const widthValue = Number.parseInt(resolution.split('x')[0])
      const heightValue = Number.parseInt(resolution.split('x')[1])
      onChange({ target: { value: widthValue, name: nameWidth } })
      onChange({ target: { value: heightValue, name: nameHeight } })
    },
    [nameHeight, nameWidth, onChange]
  )
  return (
    <FormControlReactSelect
      options={options}
      onChange={handleChange}
      value={computedValue}
      {...rest}
    />
  )
}

export default FormControlSelectResolution
