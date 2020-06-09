import React, { useCallback, useMemo, useState } from 'react'
import WindowedSelect from 'react-windowed-select'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'
import classNames from 'classnames'
import { Grid, InputLabel, withStyles, withTheme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const styles = ({ palette, type }) => ({
  root: {
    position: 'relative'
  },
  bootstrapFormLabel: {
    fontSize: '1.0833rem',
    lineHeight: '24px',
    color: palette[type].formControls.label.color
  },
  error: {
    '& > div': {
      borderColor: 'red'
    }
  },
  errorText: {
    color: 'red',
    position: 'absolute',
    fontSize: 9,
    bottom: -17,
    left: 5
  },
  errorLabel: {
    color: 'red'
  }
})

const getStyles = ({ palette, type, typography }, isMulti, styles) => {
  const {
    container,
    control = {},
    input,
    placeholder,
    menu,
    menuPortal,
    noOptionsMessage,
    option = {},
    multiValue,
    indicatorsContainer = {},
    loadingMessage,
    multiValueLabel,
    multiValueRemove = {},
    singleValue
  } = styles
  return {
    container: () => ({
      width: '100%',
      position: 'relative',
      ...container
    }),
    control: (provided, state) => {
      const style = {
        ...provided,
        backgroundColor: palette[type].formControls.input.background,
        border: `1px solid ${palette[type].formControls.input.border}`,
        borderRadius: 4,
        boxSizing: 'border-box',
        padding: isMulti ? '6px 8px' : '1px 8px 1px 15px',
        maxHeight: isMulti ? 'inherit' : 38,
        ...control,

        '&:hover': {
          backgroundColor: palette[type].formControls.input.background,
          ...control['&:hover']
        },

        '& > div': {
          padding: 0,
          height: 30,
          ...control['& > div']
        }
      }

      if (state.isFocused) {
        style['border'] = '1px solid #80bdff'
        style['boxShadow'] = '0 0 0 0.2rem rgba(0,123,255,.25)'
      }

      return style
    },
    input: provided => ({
      ...provided,
      fontSize: 14,
      backgroundColor: palette[type].formControls.input.background,
      color: palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      ...input
    }),
    placeholder: provided => ({
      ...provided,
      fontSize: 14,
      color: palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      ...placeholder
    }),
    menu: provided => ({
      ...provided,
      zIndex: 9999,
      background: palette[type].formControls.select.background,
      ...menu
    }),
    menuPortal: provided => ({
      ...provided,
      zIndex: 9999,
      ...menuPortal
    }),
    noOptionsMessage: provided => ({
      ...provided,
      fontFamily: typography.fontFamily,
      color: palette[type].formControls.input.color,
      ...noOptionsMessage
    }),
    option: provided => ({
      ...provided,
      fontSize: 14,
      color: palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      background: palette[type].formControls.select.background,
      cursor: 'pointer',
      ...option,

      '&:hover': {
        background: palette[type].formControls.select.border,
        ...option['&:hover']
      }
    }),
    multiValue: provided => ({
      ...provided,
      display: 'inline-flex',
      alignItems: 'center',
      height: 25,
      borderRadius: 3,
      padding: '0 10px 0 12px',
      border: '1px solid #3cd480',
      background: 'rgba(60, 212, 128, 0.25)',
      marginRight: 5,
      marginBottom: 5,
      ...multiValue
    }),
    indicatorsContainer: provided => ({
      ...provided,
      padding: 0,
      ...indicatorsContainer,

      '& > div': {
        padding: 0,
        ...indicatorsContainer['& > div']
      }
    }),
    loadingMessage: provided => ({
      ...provided,
      fontFamily: typography.fontFamily,
      ...loadingMessage
    }),
    multiValueLabel: () => ({
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: typography.fontFamily,
      marginRight: 5,
      color: '#3cd480',
      userSelect: 'none',
      ...multiValueLabel
    }),
    multiValueRemove: () => ({
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      ...multiValueRemove,

      svg: {
        cursor: 'pointer',
        ...multiValueRemove.svg
      },

      'svg path': {
        fill: '#3cd480',
        ...multiValueRemove['svg path']
      }
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontFamily: typography.fontFamily,
      color: palette[type].formControls.input.color,
      fontSize: 14,
      opacity: state.isDisabled ? 0.5 : 1,
      ...singleValue
    })
  }
}

const FormControlChips = ({
  t,
  classes,
  label = '',
  marginBottom = 16,
  theme,
  options = [],
  name = 'tag',
  noOptionsMessage,
  placeholder = '',
  values = [],
  handleChange = f => f,
  isSearchable = true,
  isLoading = false,
  customClass = '',
  isMulti = true,
  disabled = false,
  formControlLabelClass = '',
  formControlContainerClass = '',
  handleInputChange = f => f,
  error = '',
  touched = false,
  handleMenuScrollToBottom = f => f,
  handleBlur = f => f,
  isClearable = false,
  components = {},
  formatOptionLabel,
  styles = {}
}) => {
  const [inputValue, setInputValue] = useState('')

  const customStyles = useMemo(() => getStyles(theme, isMulti, styles), [
    isMulti,
    theme,
    styles
  ])

  const onChangeHandler = useCallback(
    newValue => {
      if (isMulti) {
        handleChange({ target: { name, value: newValue || [], ...newValue } })
      } else {
        handleChange({
          target: { name, ...newValue }
        })
      }
    },
    [handleChange, isMulti, name]
  )

  const onInputChangeHandler = useCallback(
    value => {
      setInputValue(value)
      handleInputChange(value)
    },
    [handleInputChange]
  )

  const computedValue = useMemo(
    () =>
      typeof values === 'number' || typeof values === 'string'
        ? options.find(searchValue => searchValue.value === values) || []
        : values,
    [options, values]
  )

  const onKeyDownHandler = useCallback(
    e => {
      if (e.key === 'Enter') e.preventDefault()

      if (inputValue && e.key === 'Enter') {
        if (isMulti) {
          const item = options.find(({ label }) => label === inputValue)

          if (item) {
            handleChange({ target: { name, value: [...values, item] } })
          } else {
            handleChange({
              target: {
                name,
                value: [...values, { label: inputValue, value: '' }]
              }
            })
          }
          setInputValue('')
        } else {
          const item = options.find(({ label }) => label.includes(inputValue))
          setInputValue(item ? item.label : null)
          handleChange({
            target: { name, value: item ? item.value : null }
          })
        }
      }
    },
    [handleChange, inputValue, isMulti, name, options, values]
  )

  return (
    <Grid
      container
      style={{
        marginBottom
      }}
      className={classNames(classes.root, formControlContainerClass)}
    >
      {label && (
        <InputLabel
          shrink
          className={classNames(
            classes.bootstrapFormLabel,
            formControlLabelClass,
            {
              [classes.errorLabel]: error && touched
            }
          )}
        >
          {label}
        </InputLabel>
      )}

      <WindowedSelect
        styles={customStyles}
        isSearchable={isSearchable}
        isLoading={isLoading}
        isClearable={isClearable}
        className={classNames(customClass, {
          [classes.error]: error && touched
        })}
        classNamePrefix="react-select"
        noOptionsMessage={() => noOptionsMessage || t('No Options')}
        placeholder={placeholder}
        isMulti={isMulti}
        options={options}
        formatOptionLabel={formatOptionLabel}
        backspaceRemovesValue={false}
        components={{
          IndicatorSeparator: null,
          ...components
        }}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        value={computedValue}
        onChange={onChangeHandler}
        onBlur={handleBlur}
        menuPortalTarget={document.querySelector('body')}
        menuShouldScrollIntoView={false}
        inputValue={inputValue}
        onInputChange={onInputChangeHandler}
        onKeyDown={onKeyDownHandler}
        isDisabled={disabled}
      />
      {error && touched && (
        <Typography className={classes.errorText}>{error}</Typography>
      )}
    </Grid>
  )
}

FormControlChips.propTypes = {
  classes: PropTypes.object,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  marginBottom: PropTypes.number,
  options: PropTypes.array,
  noOptionsMessage: PropTypes.string,
  placeholder: PropTypes.string,
  values: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
    PropTypes.string
  ]),
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  handleInputChange: PropTypes.func,
  error: PropTypes.string,
  isSearchable: PropTypes.bool,
  touched: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  handleMenuScrollToBottom: PropTypes.func,
  handleBlur: PropTypes.func,
  isClearable: PropTypes.bool,
  components: PropTypes.object,
  styles: PropTypes.object
}

export default translate('translations')(
  withTheme()(withStyles(styles)(FormControlChips))
)
