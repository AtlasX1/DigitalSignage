import React, { Fragment } from 'react'
import classNames from 'classnames'
import {
  withStyles,
  FormControl,
  InputLabel,
  NativeSelect,
  Select,
  MenuItem,
  Typography
} from '@material-ui/core'

import BootstrapInputBase from './InputBase'

import '../../styles/forms/_custom-select.scss'

const styles = theme => {
  const { palette, type, formControls } = theme
  return {
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    formControlRoot: {
      width: '100%'
    },
    marginBottom: {
      marginBottom: theme.spacing.unit * 2
    },
    bootstrapFormLabel: {
      fontSize: 16,
      color: palette[type].formControls.label.color,
      ...formControls.mediaApps.selectInput.label
    },
    bootstrapFormLabelFocus: {
      color: `${palette[type].formControls.label.activeColor} !important`
    },
    inputAlignCenter: {
      display: 'flex',
      alignItems: 'center',
      ...formControls.mediaApps.selectInput.input
    },
    selectMenuPaper: {
      borderRadius: 1,
      boxShadow: `0 2px 4px 0 ${palette[type].formControls.select.shadow}`,
      background: palette[type].formControls.select.background,
      padding: '0 15px'
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
    },
    nativeSelectDisabled: {
      color: 'rgba(1, 1, 1, 0.25) !important'
    },
    nativeSelectIcon: {
      color: palette[type].formControls.label.color
    },
    error: {
      color: 'red',
      fontSize: 9,
      position: 'absolute',
      bottom: -17,
      left: 5
    },
    inputError: {
      borderColor: 'red'
    },
    bootstrapFormLabelError: {
      color: 'red !important'
    },
    disabled: {
      color: 'rgb(84, 84, 84)',
      cursor: 'default',
      backgroundColor: palette[type].formControls.disabled.background
    },
    bootstrapInput: {
      padding: '9px 15px'
    }
  }
}

const FormControlSelect = ({
  classes,
  id = '',
  label = '',
  handleChange = f => f,
  value = '',
  options = [],
  marginBottom = true,
  inputClasses = {},
  formControlInputRootClass = '',
  formControlContainerClass = '',
  formControlLabelClass = '',
  formControlRootClass = '',
  formControlInputClass = '',
  multiple = false,
  addEmptyOption = true,
  placeholder = '',
  vertical = false,
  name = '',
  nativeSelectIconClassName = '',
  customMarginBottom,
  custom = false,
  customMenuPaperClassName = '',
  error = '',
  touched = false,
  showErrorText = true,
  disabled = false,
  ...props
}) => (
  <div className={classNames(classes.root, formControlContainerClass)}>
    <FormControl
      className={classNames(classes.formControlRoot, formControlRootClass, {
        [classes.marginBottom]: marginBottom
      })}
      style={{
        marginBottom: customMarginBottom
      }}
    >
      {label && (
        <InputLabel
          shrink
          htmlFor={id}
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
      {!custom && !multiple && (
        <NativeSelect
          value={value || placeholder}
          onChange={handleChange}
          disabled={disabled}
          input={
            <BootstrapInputBase
              id={id}
              value={value}
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              classes={{
                root: classNames(
                  classes.bootstrapRoot,
                  formControlInputRootClass,
                  inputClasses.root
                ),
                input: classNames(
                  classes.bootstrapInput,
                  formControlInputClass,
                  inputClasses.input,
                  {
                    [classes.inputError]: error && touched,
                    [classes.disabled]: disabled
                  }
                )
              }}
              onChange={e => handleChange(e, name)}
            />
          }
          classes={{
            disabled: classes.nativeSelectDisabled,
            icon: classNames(
              classes.nativeSelectIcon,
              nativeSelectIconClassName
            )
          }}
          {...props}
        >
          {placeholder && (
            <option value={placeholder} disabled>
              {placeholder}
            </option>
          )}
          {value === 'mix' && (
            <option value={'mix'} disabled>
              {'Mixed'}
            </option>
          )}
          {addEmptyOption && <option value="" />}
          {options ? (
            options.map((item, index) => (
              <option
                key={`${item.value}-${index}`}
                value={item.value}
                disabled={item.disabled || false}
              >
                {item.label}
              </option>
            ))
          ) : (
            <Fragment>
              <option value="" />
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </Fragment>
          )}
        </NativeSelect>
      )}

      {!custom && multiple && (
        <Select
          multiple
          displayEmpty
          value={value}
          input={
            <BootstrapInputBase name={id} id={id} classes={inputClasses} />
          }
          classes={{
            icon: classNames(
              classes.nativeSelectIcon,
              nativeSelectIconClassName
            )
          }}
          {...props}
          renderValue={selected => (selected.length ? 'Options' : placeholder)}
          onChange={e => handleChange(e, name)}
        >
          {options.map((item, index) => (
            <MenuItem key={`${item.value}-${index}`} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      )}

      {custom && (
        <Select
          value={value}
          onChange={e => handleChange(e)}
          name={props.name}
          disabled={disabled}
          input={
            <BootstrapInputBase
              name={id}
              id={id}
              classes={{
                root: formControlInputRootClass,
                input: classNames(
                  classes.inputAlignCenter,
                  inputClasses.input,
                  {
                    [classes.inputError]: error && touched
                  }
                )
              }}
            />
          }
          classes={{
            icon: classNames(
              classes.nativeSelectIcon,
              nativeSelectIconClassName
            )
          }}
          MenuProps={{
            classes: {
              paper: classNames(
                classes.selectMenuPaper,
                classes.selectMenuPaperTransform,
                customMenuPaperClassName // If need to move the popup dropdown use this class with !important transform value
              )
            }
          }}
        >
          {options.map((item, index) => (
            <MenuItem
              key={`${item.value}-${index}`}
              value={item.value}
              className={classes.menuItem}
              disabled={item.disabled}
              classes={{
                selected: classes.menuItemSelected
              }}
            >
              {item.label}

              {!!item.component && item.component}
            </MenuItem>
          ))}
        </Select>
      )}
      {showErrorText && error && touched && (
        <Typography className={classes.error}>{error}</Typography>
      )}
    </FormControl>
  </div>
)

export default withStyles(styles)(FormControlSelect)
