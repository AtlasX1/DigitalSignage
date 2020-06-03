import React, { useCallback, useState } from 'react'
import { FormControlInput } from 'components/Form/index'
import { IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { translate } from 'react-i18next'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    right: '1px',
    bottom: '14px'
  },
  input: {
    flexGrow: 1
  }
})

const FormControlPasswordInput = ({
  t,
  value = '',
  label = '',
  placeholder = '',
  name = '',
  touched = false,
  error = '',
  onChange = f => f,
  onBlur = f => f
}) => {
  const classes = useStyles()
  const [isVisible, toggleVisible] = useState(false)

  const handleToggle = useCallback(() => {
    toggleVisible(value => !value)
  }, [])

  return (
    <div className={classes.container}>
      <FormControlInput
        id="password"
        label={label}
        type={isVisible ? 'text' : 'password'}
        fullWidth
        formControlContainerClass={classes.input}
        value={value}
        name={name}
        touched={touched}
        error={error}
        placeholder={placeholder || label}
        handleChange={onChange}
        // handleBlur={onBlur}
      />
      <IconButton className={classes.icon} onClick={handleToggle}>
        {isVisible ? (
          <VisibilityOff fontSize="small" />
        ) : (
          <Visibility fontSize="small" />
        )}
      </IconButton>
    </div>
  )
}

export default translate('translations')(FormControlPasswordInput)
