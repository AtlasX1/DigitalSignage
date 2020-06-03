import React, { useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { FormControlReactSelect } from 'components/Form/index'
import classNames from 'classnames'

const fonts = [
  { label: 'Check out the bake sale...', value: 1 },
  { label: 'Check out the bake sale...', value: 2 },
  { label: 'Check out the bake sale...', value: 3 }
]

const styles = ({ type, palette }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 10px 4px 0',
    backgroundColor: palette[type].formControls.input.background
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: palette[type].formControls.input.background,
    padding: '0 6px',
    borderTop: '9px solid transparent',
    borderLeft: '9px solid red',
    borderBottom: '9px solid transparent'
  },
  triangle3: {
    width: 0,
    height: 0,
    backgroundColor: palette[type].formControls.input.background,
    padding: '0 6px',
    borderTop: '9px solid transparent',
    borderLeft: '9px solid green',
    borderBottom: '9px solid transparent'
  },
  greenBorder: {
    border: '2px solid green'
  }
})

const FormControlSelectTextTheme = ({ options = fonts, classes, ...props }) => {
  const formatOptionLabel = useCallback(
    ({ value, label }) => {
      return (
        <div
          className={classNames(classes.root, {
            [classes.greenBorder]: value === 3
          })}
        >
          {value !== 1 && (
            <div className={classNames(classes[`triangle${value}`])} />
          )}

          <div>{label}</div>
        </div>
      )
    },
    [classes]
  )

  return (
    <FormControlReactSelect
      formatOptionLabel={formatOptionLabel}
      options={options}
      {...props}
    />
  )
}

export default withStyles(styles)(FormControlSelectTextTheme)
