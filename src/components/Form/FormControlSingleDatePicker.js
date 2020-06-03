import React, { useCallback, useMemo } from 'react'
import 'react-dates/initialize'
import { DayPickerSingleDateController } from 'react-dates'

import { withStyles, Grid } from '@material-ui/core'
import classNames from 'classnames'
import 'react-dates/lib/css/_datepicker.css'
import 'styles/forms/_datepicker.scss'
import Popup from 'components/Popup'
import FormControlInput from 'components/Form/FormControlInput'
import moment from 'moment'

const styles = () => ({
  inputContainer: {
    width: '100%',
    cursor: 'pointer'
  },
  inputInput: {
    cursor: 'pointer'
  },
  inputIcon: {
    color: '#74809a',
    position: 'absolute',
    right: 10,
    top: 9
  },
  button: {
    padding: 0,
    margin: 0,
    background: 'transparent',
    border: 0,
    outline: 'none'
  },
  marginL: {
    marginLeft: 10
  },
  shiftIcon: {
    top: 33
  },
  marginBottom: {
    marginBottom: 16
  }
})

const FormControlSingleDatePicker = ({
  classes,
  label,
  value,
  handleChange = f => f,
  error,
  touched,
  classContainer,
  name,
  format = 'YYYY-MM-DD',
  placeholder,
  noMargin,
  ...props
}) => {
  const handle = useCallback(
    value => {
      handleChange({ target: { name, value } })
    },
    [handleChange, name]
  )

  const formatValue = useMemo(() => moment(value).format(format), [
    format,
    value
  ])

  return (
    <Grid
      container
      className={classNames(classContainer, {
        [classes.marginBottom]: !noMargin
      })}
    >
      <Popup
        on="click"
        position="bottom right"
        trigger={
          <div className={classes.button}>
            <FormControlInput
              type="text"
              value={formatValue}
              marginBottom={false}
              formControlContainerClass={classes.inputContainer}
              formControlInputClass={classes.inputInput}
              icon={
                <i
                  className={classNames('icon-calendar-1', classes.inputIcon, {
                    [classes.shiftIcon]: label
                  })}
                />
              }
              placeholder={placeholder}
              error={error}
              touched={touched}
              label={label}
              {...props}
            />
          </div>
        }
      >
        <Grid container alignItems="center" justify="space-between">
          <DayPickerSingleDateController
            date={value}
            onDateChange={handle}
            isOutsideRange={day => moment().diff(day) > 0}
          />
        </Grid>
      </Popup>
    </Grid>
  )
}

export default withStyles(styles)(FormControlSingleDatePicker)
