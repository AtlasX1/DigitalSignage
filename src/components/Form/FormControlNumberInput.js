import React from 'react'

import { withStyles, InputLabel, FormControl } from '@material-ui/core'

const styles = ({ spacing, palette, transitions, typography }) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControlRoot: {
    width: '100%',
    marginBottom: spacing.unit * 2
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '9px 15px',
    transition: transitions.create(['border-color', 'box-shadow']),
    fontFamily: typography.fontFamily,

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapTextAreaHeight: {
    height: '87px'
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  numberInputContainer: {
    position: 'relative',
    height: '36px',
    width: '76px',
    border: '1px solid #D4DCE7',
    borderRadius: '3px',
    paddingRight: '16px'
  },
  numberInput: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  numberInputControlsContainer: {
    position: 'absolute',
    right: '0',
    top: '5px',
    bottom: '5px',
    width: '18px',
    borderLeft: '1px solid #D4DCE7'
  }
})

const FormControlInput = ({
  classes,
  id = '',
  type = 'text',
  label = null,
  defaultValue = null,
  value = '',
  fullWidth = false,
  placeholder = null,
  formControlContainerClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  ...props
}) => (
  <div className={[classes.root, formControlContainerClass].join(' ')}>
    <FormControl
      className={[classes.formControlRoot, formControlRootClass].join(' ')}
    >
      {label && (
        <InputLabel
          shrink
          htmlFor={id}
          className={[classes.bootstrapFormLabel, formControlLabelClass].join(
            ' '
          )}
        >
          {label}
        </InputLabel>
      )}

      <div className={classes.numberInputContainer}>
        <input type="number" className={classes.numberInput} />
        <div className={classes.numberInputControlsContainer}>
          <button></button>
          <button></button>
        </div>
      </div>
    </FormControl>
  </div>
)

export default withStyles(styles)(FormControlInput)
