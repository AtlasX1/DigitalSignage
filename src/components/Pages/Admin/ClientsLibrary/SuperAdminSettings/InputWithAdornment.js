import React from 'react'

import { withStyles, InputAdornment } from '@material-ui/core'

import { FormControlInput } from '../../../../Form'
import { CircleIconButton } from '../../../../Buttons'

const styles = theme => ({
  adornmentBtn: {
    fontSize: '18px'
  },
  edit: {
    color: '#0a84c8'
  },
  delete: {
    color: '#d0021b'
  }
})

const InputWithAdornment = ({ t, classes, ...props }) => {
  return (
    <FormControlInput
      endAdornment={
        <InputAdornment position="end">
          <CircleIconButton
            className={[classes.adornmentBtn, classes.edit].join(' ')}
          >
            <i className="icon-pencil-3" />
          </CircleIconButton>
          <CircleIconButton
            className={[classes.adornmentBtn, classes.delete].join(' ')}
          >
            <i className="icon-bin" />
          </CircleIconButton>
        </InputAdornment>
      }
      {...props}
    />
  )
}

export default withStyles(styles)(InputWithAdornment)
