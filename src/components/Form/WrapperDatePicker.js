import React from 'react'
import DatePicker from 'react-datepicker'
import CustomInput from './CustomInputDatePicker'

const WrapperDatePicker = ({ alert, ...props }) => {
  return (
    <DatePicker
      {...props}
      className="customDatePickerWidth"
      customInput={<CustomInput alert={alert} />}
    />
  )
}

export default WrapperDatePicker
