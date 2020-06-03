import React, { useCallback } from 'react'
import {
  withStyles,
  FormGroup,
  FormControlLabel,
  Switch
} from '@material-ui/core'
import classNames from 'classnames'
const styles = theme => ({
  iOSSwitchBase: {
    transform: 'translateX(-2px)',
    color: theme.palette[theme.type].default,
    '&$iOSChecked': {
      color: theme.palette[theme.type].default,
      '& + $iOSBar': {
        backgroundColor: '#41cb71'
      }
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp
    })
  },
  iOSChecked: {
    transform: 'translateX(6px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none'
    }
  },
  iOSDisabled: {
    opacity: '0.5'
  },
  iOSBar: {
    borderRadius: 13,
    width: 24,
    height: 15,
    backgroundColor: '#535d73',
    opacity: 1,
    transition: theme.transitions.create('background-color')
  },
  iOSIcon: {
    width: 7,
    height: 7,
    boxShadow: 'none',
    marginTop: 0
  },
  labelWrap: {
    marginLeft: 0,
    marginRight: 0
  },
  label: {
    fontSize: '12px',
    color: '#74809a',
    textTransform: 'capitalize'
  },
  labelError: {
    color: 'red'
  }
})

const CheckboxSwitcher = ({
  classes,
  label,
  id = 0,
  name = '',
  value = false,
  switchContainerClass = '',
  switchRootClass = '',
  switchBaseClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  disabled = false,
  labelPlacement = 'start',
  handleChange = f => f,
  error
}) => {
  const handleToggle = useCallback(
    (event, value) => {
      if (name) {
        handleChange({ target: { value, name } })
      } else {
        handleChange(value, id)
      }
    },
    [id, name, handleChange]
  )

  return (
    <FormGroup row className={switchContainerClass}>
      <FormControlLabel
        classes={{
          root: classNames(classes.labelWrap, formControlRootClass),
          label: classNames(classes.label, formControlLabelClass, {
            [classes.labelError]: error
          })
        }}
        label={label}
        labelPlacement={labelPlacement}
        control={
          <Switch
            disabled={disabled}
            disableRipple
            value="checked"
            checked={value}
            onChange={handleToggle}
            classes={{
              root: switchRootClass,
              switchBase: classNames(classes.iOSSwitchBase, switchBaseClass),
              bar: classes.iOSBar,
              icon: classes.iOSIcon,
              checked: classes.iOSChecked,
              disabled: classes.iOSDisabled
            }}
          />
        }
      />
    </FormGroup>
  )
}

export default withStyles(styles)(CheckboxSwitcher)
