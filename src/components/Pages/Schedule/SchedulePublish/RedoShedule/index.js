import React, { useCallback, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core'
import DateRangePicker from './DateRangePicker'
import { translate } from 'react-i18next'
import options from './options'
import FormControlSelect from '../../../../Form/FormControlSelect'
import DialogCustomSelect from './DialogCustomSelect'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { identifyNumberDayOfWeekInMonth } from '../../../../../utils/redoSchedule'
import constants from '../../../../../constants/redoSchedule'

const styles = ({ palette, type }) => ({
  scheduleInfoWrap: {
    padding: '20px',
    margin: '20px',
    border: `1px solid ${palette[type].sideModal.content.border}`,
    background: palette[type].sideModal.groups.header.background
  }
})

const RedoSchedule = ({ classes, t, handleChange }) => {
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [repetitionOptions, setRepetitionOptions] = useState(
    options.repetitionOptions
  )
  const [repetitionOption, setRepetitionOption] = useState(constants.daily)
  const [isShowDialog, setShowDialog] = useState(false)
  const [customOptions, setCustomOptions] = useState('')

  const handleChangeStartTime = useCallback(value => {
    setStartTime(value)
    setEndTime(value)
  }, [])
  const handleChangeEndTime = useCallback(value => {
    setEndTime(value)
  }, [])
  const handleChangeStartDate = useCallback(value => {
    setStartDate(value)
  }, [])
  const handleChangeEndDate = useCallback(value => {
    setEndDate(value)
  }, [])
  useEffect(() => {
    setRepetitionOptions(values => {
      return values.map(value => {
        switch (value.value) {
          case constants.weekly: {
            const date = moment(startDate).format('dddd')
            return {
              ...value,
              label: `Weekly - ${date}`
            }
          }
          case constants.monthly: {
            const date = identifyNumberDayOfWeekInMonth(startDate)
            return {
              ...value,
              label: `Monthly ${date}`
            }
          }
          case constants.everyYear: {
            const date = moment(startDate).format('DD MMM')
            return {
              ...value,
              label: `Every year ${date}`
            }
          }

          default:
            return value
        }
      })
    })
  }, [startDate])

  useEffect(() => {
    let value
    switch (repetitionOption) {
      case constants.weekly: {
        value = moment(startDate).format('dddd')
        break
      }
      case constants.monthly: {
        value = identifyNumberDayOfWeekInMonth(startDate)
        break
      }
      case constants.everyYear: {
        value = moment(startDate).format('DD MMM')
        break
      }

      default:
        value = ''
        break
    }

    handleChange({
      startDate: moment(startDate).format('LL'),
      endDate: moment(endDate).format('LL'),
      startTime: moment(startTime).format('HH:mm'),
      endTime: moment(endTime).format('HH:mm'),
      repetitionOption: {
        type: repetitionOption,
        value: repetitionOption === constants.custom ? customOptions : value
      }
    })
  }, [
    startDate,
    endDate,
    startTime,
    endTime,
    repetitionOption,
    handleChange,
    customOptions
  ])

  const handleSelectOption = useCallback(({ target: { value } }) => {
    setRepetitionOption(value)

    if (value === constants.other) {
      setShowDialog(value => !value)
    }
  }, [])

  const handleSubmitDialog = useCallback(custom => {
    setRepetitionOptions(values => {
      const hasCustomField = values
        .map(({ value }) => value)
        .some(s => s === constants.custom)
      if (!hasCustomField) {
        values.splice(-1, 0, { value: constants.custom, label: custom.label })
      } else {
        return values.map(field =>
          field.value === constants.custom
            ? { ...field, label: custom.label }
            : field
        )
      }
      return values
    })
    setCustomOptions(custom)
    setRepetitionOption(constants.custom)
    setShowDialog(false)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setShowDialog(value => !value)
  }, [])

  return (
    <div className={classes.scheduleInfoWrap}>
      <DateRangePicker
        startTime={startTime}
        endTime={endTime}
        startDate={startDate}
        endDate={endDate}
        handleChangeStartTime={handleChangeStartTime}
        handleChangeEndTime={handleChangeEndTime}
        handleChangeStartDate={handleChangeStartDate}
        handleChangeEndDate={handleChangeEndDate}
      />
      <div>
        <FormControlSelect
          id="category"
          value={repetitionOption}
          handleChange={handleSelectOption}
          options={repetitionOptions}
        />
        <DialogCustomSelect
          show={isShowDialog}
          selectedDate={startDate}
          handleSubmitDialog={handleSubmitDialog}
          handleCloseDialog={handleCloseDialog}
        />
      </div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(RedoSchedule))
