import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DayPickerSingleDateController } from 'react-dates'
import { Grid, Typography, withStyles } from '@material-ui/core'

import FormControlInput from './FormControlInput'
import Popup from '../Popup'
import classNames from 'classnames'

const styles = () => {
  return {
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
    formLabelWrapper: {
      marginBottom: '10px'
    },
    formLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px',
      paddingRight: '15px'
    }
  }
}

const popupContentStyle = {
  padding: 20
}

const FormControlDateTimePicker = ({
  classes,
  handleChange = f => f,
  initialValue = '',
  isTime = true,
  format = 'YYYY:MM:DD',
  error = '',
  touched = false,
  label = '',
  customClasses = {}
}) => {
  const [value, setValue] = useState('')
  const [date, setDate] = useState(moment())
  const [time, setTime] = useState(moment().format('HH:mm'))

  useEffect(() => {
    if (initialValue && value !== initialValue) {
      const [d, t] = initialValue.split(' ')
      if (d && t) {
        setValue(initialValue)
        setTime(t.slice(0, 5))
        setDate(moment(d, format))
      }
    }
    // eslint-disable-next-line
  }, [initialValue])

  const handleDateChange = e => {
    setDate(e)
  }

  const changeValue = () => {
    if (isTime) {
      setValue(date.format(format) + ' ' + time)
    } else {
      setValue(date.format(format))
    }
  }

  useEffect(() => {
    changeValue()
    // eslint-disable-next-line
  }, [date])

  useEffect(() => {
    if (value) changeValue()
    // eslint-disable-next-line
  }, [time])

  useEffect(() => {
    if (value && value !== initialValue) handleChange(value)
    // eslint-disable-next-line
  }, [value])

  return (
    <Grid container>
      {label && (
        <Grid
          item
          xs={12}
          className={classNames(
            classes.formLabelWrapper,
            customClasses.labelWrapperClass
          )}
        >
          <Typography
            className={classNames(classes.formLabel, customClasses.labelClass)}
          >
            {label}
          </Typography>
        </Grid>
      )}
      <Popup
        on="click"
        position="bottom right"
        contentStyle={popupContentStyle}
        trigger={
          <div
            className={classNames(classes.button, customClasses.buttonClass)}
            onClick={() => {}}
          >
            <FormControlInput
              type="text"
              value={value}
              marginBottom={false}
              formControlContainerClass={classes.inputContainer}
              formControlInputClass={classes.inputInput}
              icon={
                <i
                  className={['icon-calendar-1', classes.inputIcon].join(' ')}
                />
              }
              error={error}
              touched={touched}
            />
          </div>
        }
      >
        <Grid container alignItems="center" justify="space-between">
          <DayPickerSingleDateController
            date={date}
            onDateChange={handleDateChange}
            isOutsideRange={day => moment().diff(day) > 0}
          />

          {isTime && (
            <FormControlInput
              formControlContainerClass={classes.marginL}
              marginBottom={false}
              type="time"
              value={time}
              handleChange={e => setTime(e.target.value)}
            />
          )}
        </Grid>
      </Popup>
    </Grid>
  )
}

FormControlDateTimePicker.propTypes = {
  classes: PropTypes.object,
  handleChange: PropTypes.func,
  initialValue: PropTypes.string,
  format: PropTypes.string,
  isTime: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool
}

export default withStyles(styles)(FormControlDateTimePicker)
