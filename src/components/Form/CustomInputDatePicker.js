import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = ({ palette, type, typography }) => ({
  root: {
    height: '38px',
    borderRadius: '4px',
    paddingLeft: '10px',
    flexGrow: 1,
    border: `1px solid ${palette[type].formControls.input.border}`,
    background: palette[type].formControls.input.background,
    color: palette[type].formControls.input.color,
    width: '100%',
    fontFamily: typography.fontFamily,

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  alert: {
    borderColor: '#ffa5a2'
  }
})

const CustomInputDatePicker = ({ value, onClick, classes, alert }) => (
  <button
    className={[classes.root, alert ? classes.alert : ''].join(' ')}
    onClick={onClick}
  >
    {value}
  </button>
)

export default withStyles(styles)(CustomInputDatePicker)
