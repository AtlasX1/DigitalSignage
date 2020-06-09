import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, withStyles } from '@material-ui/core'
import { FormControlReactSelect } from 'components/Form/index'

const styles = () => ({
  paletteContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '15px',
    padding: '0 10px',
    cursor: 'pointer'
  }
})

const FormControlSelectSkin = ({ classes, options, ...props }) => {
  const transformOptions = useMemo(
    () =>
      options.map((preset, index) => ({
        value: index + 1,
        colors: Object.entries(preset).reduce(
          (accum, [name, value]) => [...accum, { tooltip: name, color: value }],
          []
        )
      })),
    [options]
  )

  const formatOptionLabel = useCallback(
    ({ value, colors }) => {
      return (
        <div className={classes.paletteContainer}>
          {colors.map(({ tooltip, color }) => {
            return (
              <Tooltip key={`color${value}-${tooltip}`} title={tooltip}>
                <div
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: '34px'
                  }}
                />
              </Tooltip>
            )
          })}
        </div>
      )
    },
    [classes.paletteContainer]
  )

  return (
    <FormControlReactSelect
      formatOptionLabel={formatOptionLabel}
      options={transformOptions}
      {...props}
    />
  )
}

FormControlSelectSkin.propTypes = {
  options: PropTypes.array
}

export default withStyles(styles)(FormControlSelectSkin)
