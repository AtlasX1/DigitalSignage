import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@material-ui/core'
import classNames from 'classnames'
import { TagChip } from '../Chip'
import BootstrapInputBase from './InputBase'

const styles = ({ palette, type, spacing }) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControlMargin: {
    marginBottom: spacing.unit * 2
  },
  formControl: {
    flexGrow: 1
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    marginRight: 20
  },
  noLabel: {
    marginTop: 1
  },
  bootstrapFormLabel: {
    fontSize: 18,
    color: palette[type].formControls.label.color
  },
  bootstrapFormLabelFocus: {
    color: `${palette[type].formControls.label.activeColor} !important`
  },
  bootstrapFormLabelError: {
    color: 'red !important'
  },
  disabled: {
    color: 'rgb(84, 84, 84)',
    cursor: 'default',
    backgroundColor: palette[type].formControls.disabled.background
  },
  bootstrapInputError: {
    borderColor: 'red'
  },
  error: {
    color: 'red',
    fontSize: 9,
    position: 'absolute',
    bottom: -17,
    left: 5
  },
  menuItem: {
    width: 'calc(100% + 30px)',
    height: 35,
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: palette[type].formControls.select.color,
    fontSize: 13,
    letterSpacing: '-0.01px',
    marginLeft: -15,
    position: 'relative',
    background: palette[type].formControls.select.background,

    '&::after': {
      content: '""',
      width: 'calc(100% - 30px)',
      height: 1,
      background: palette[type].formControls.select.border,
      position: 'absolute',
      bottom: 0
    },

    '&:last-child': {
      '&::after': {
        content: 'none'
      }
    },

    '&:hover': {
      backgroundColor: palette[type].formControls.select.active.background
    }
  },
  menuItemSelected: {
    backgroundColor: `${palette[type].formControls.select.active.background} !important`
  }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const FormControlMultiSelect = ({
  classes,
  label = '',
  name = 'multi-select',
  options = [],
  formControlLabelClass,
  formControlRootClass,
  formControlInputRootClass,
  formControlInputClass,
  controller: {
    values: { [name]: values },
    handleChange: onChange,
    errors: { [name]: error },
    touched: { [name]: touched }
  },
  disabled,
  showErrorText = true,
  marginBottom = true
}) => {
  const handleChange = useCallback(
    event => {
      onChange(event, name)
    },
    [onChange, name]
  )

  return (
    <div className={classes.root}>
      <FormControl
        className={classNames(classes.formControl, formControlRootClass, {
          [classes.formControlMargin]: marginBottom
        })}
      >
        {label && (
          <InputLabel
            shrink
            htmlFor={name}
            className={classNames(
              classes.bootstrapFormLabel,
              formControlLabelClass,
              {
                [classes.bootstrapFormLabelError]: error && touched
              }
            )}
            classes={{
              focused: classes.bootstrapFormLabelFocus
            }}
          >
            {label}
          </InputLabel>
        )}
        <Select
          multiple
          value={values}
          name={name}
          onChange={handleChange}
          input={
            <BootstrapInputBase
              id="select-multiple-chip"
              disabled={disabled}
              classes={{
                root: formControlInputRootClass,
                input: classNames(
                  classes.bootstrapInput,
                  formControlInputClass,
                  {
                    [classes.bootstrapInputError]: error && touched,
                    [classes.disabled]: disabled
                  }
                )
              }}
            />
          }
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(({ label }) => (
                <TagChip
                  key={`chip-tag-${label}`}
                  label={label}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options.length ? (
            options.map(item => (
              <MenuItem
                key={`tag-${item.label}`}
                value={item}
                className={classes.menuItem}
                classes={{
                  selected: classes.menuItemSelected
                }}
              >
                {item.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem>There are no items in this list</MenuItem>
          )}
        </Select>
        {showErrorText && error && touched && (
          <Typography className={classes.error}>{error}</Typography>
        )}
      </FormControl>
    </div>
  )
}

FormControlMultiSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  controller: PropTypes.object.isRequired
}

export default withStyles(styles)(FormControlMultiSelect)
