import React, { useCallback, useMemo, useState } from 'react'

import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'

import WrapperDatePicker from '../../../../Form/WrapperDatePicker'

import { CheckboxSwitcher } from '../../../../Checkboxes'

import '../../../../../styles/forms/_datepicker.scss'

const styles = ({ palette, type }) => ({
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separator: {
    margin: '0 5px',
    color: palette[type].formControls.input.color
  },
  wrapDatePicker: {
    flexGrow: 1
  },
  wrapTimePicker: {
    flexGrow: 3,
    margin: '0 10px'
  },
  wrapDataRangePicker: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px'
  },
  checkboxAllDay: {
    alignSelf: 'flex-end'
  },
  playTimeCheckbox: {
    height: '28px'
  }
})

const DateRangePicker = ({
  startTime,
  endTime,
  startDate,
  endDate,
  handleChangeStartTime,
  handleChangeEndTime,
  handleChangeStartDate,
  handleChangeEndDate,
  classes,
  t
}) => {
  const [isTimeAllDay, setTimeAllDay] = useState(false)
  const handleChangeIsTimeAllDay = useCallback(value => {
    setTimeAllDay(value)
  }, [])

  const maxTime = useMemo(() => {
    const value = new Date()
    value.setHours(23)
    value.setMinutes(30)
    return value
  }, [])

  return (
    <div className={classes.wrapDataRangePicker}>
      <div className={classes.checkboxAllDay}>
        <CheckboxSwitcher
          label={t('All day')}
          switchBaseClass={classes.playTimeCheckbox}
          value={isTimeAllDay}
          handleChange={handleChangeIsTimeAllDay}
        />
      </div>
      <div className={classes.bar}>
        <div className={classes.wrapDatePicker}>
          <WrapperDatePicker
            selected={startDate}
            onChange={handleChangeStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd MMM yyyy"
          />
        </div>
        {isTimeAllDay || (
          <div className={classes.wrapTimePicker}>
            <WrapperDatePicker
              selected={startTime}
              onChange={handleChangeStartTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
            />
          </div>
        )}
        <Typography className={classes.separator}>TO</Typography>
        {isTimeAllDay || (
          <div className={classes.wrapTimePicker}>
            <WrapperDatePicker
              selected={endTime}
              onChange={handleChangeEndTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              minTime={endTime}
              maxTime={maxTime}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              alert={startDate > endDate}
            />
          </div>
        )}
        <div className={classes.wrapDatePicker}>
          <WrapperDatePicker
            selected={endDate}
            onChange={handleChangeEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd MMM yyyy"
            alert={startDate > endDate}
          />
        </div>
      </div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(DateRangePicker))
