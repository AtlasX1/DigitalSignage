import React, { useCallback, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core'
import DateRangePicker from './DateRangePicker'
import { translate } from 'react-i18next'
import DialogCustomSelect from './DialogCustomSelect'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { WhiteButton } from 'components/Buttons'
import update from 'immutability-helper'
import { CheckboxSwitcher } from 'components/Checkboxes'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'
import { FormControlInput } from '../../../../Form'

const styles = ({ palette, type }) => ({
  scheduleInfoWrap: {
    padding: '20px',
    margin: '20px',
    borderRadius: '4px',
    border: `solid 5px ${palette[type].sideModal.content.border}`,
    background: palette[type].sideModal.groups.header.background
  },
  selected: {
    boxShadow: '0 0 2px 1px #0378ba'
  },
  daysWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dayButton: {
    padding: '5px 14px',
    minWidth: 'unset'
  },
  error: {
    color: 'red',
    border: `solid 5px #ce3636`,
    background: '#dc8383'
  }
})

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const range = [
  {
    label: 'Today',
    value: 'today'
  },
  {
    label: 'Tomorrow',
    value: 'tomorrow'
  },
  {
    label: 'This Week',
    value: 'thisWeek'
  },
  {
    label: 'Next 7 Days',
    value: '7days'
  },
  {
    label: 'This Month',
    value: 'thisMonth'
  },
  {
    label: 'Next 30 days',
    value: '30days'
  }
]

const RedoSchedule = ({
  classes,
  t,
  handleChange,
  values,
  errors,
  touched
}) => {
  const startDate = new Date(moment(values.startDate).format())
  const endDate = new Date(moment(values.endDate).format())
  const startTime = new Date(
    moment(`${values.startDate} ${values.startTime}`).format()
  )
  const endTime = new Date(
    moment(`${values.endDate} ${values.endTime}`).format()
  )

  const [isShowDialog, setShowDialog] = useState(false)
  const [selectedRange, setSelectedRange] = useState('today')

  const handleChangeStartTime = value => {
    handleChange({
      startTime: moment(value).format('HH:mm:ss')
    })
  }

  const handleChangeEndTime = value => {
    handleChange({
      endTime: moment(value).format('HH:mm:ss')
    })
  }

  const handleChangeStartDate = value => {
    handleChange({
      startDate: moment(value).format('YYYY-MM-DD')
    })
  }

  const handleChangeEndDate = value => {
    handleChange({
      endDate: moment(value).format('YYYY-MM-DD')
    })
  }

  const handleDayClick = value => {
    const arr = values.workingDays
    let wDays
    const isExist = arr.includes(value)

    if (!!isExist) {
      const index = arr.findIndex(i => i === value)
      wDays = update(arr, {
        $splice: [[index, 1]]
      })
    } else {
      wDays = update(arr, {
        $push: [value]
      })
    }

    handleChange({
      workingDays: wDays,
      ...(wDays.length < 7 && { allDay: false }),
      ...(wDays.length === 7 && { allDay: true })
    })
  }

  useEffect(
    () => {
      switch (selectedRange) {
        case 'today':
          handleChange({
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
          })
          break
        case 'tomorrow':
          handleChange({
            startDate: moment().add(1, 'days').format('YYYY-MM-DD'),
            endDate: moment().add(1, 'days').format('YYYY-MM-DD')
          })
          break
        case 'thisWeek':
          handleChange({
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().endOf('week').format('YYYY-MM-DD')
          })
          break
        case '7days':
          handleChange({
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(7, 'days').format('YYYY-MM-DD')
          })
          break
        case 'thisMonth':
          handleChange({
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().endOf('month').format('YYYY-MM-DD')
          })
          break
        case '30days':
          handleChange({
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(30, 'days').format('YYYY-MM-DD')
          })
          break
        default:
          break
      }
    },
    // eslint-disable-next-line
    [selectedRange]
  )

  const handleSubmitDialog = useCallback(custom => {
    setShowDialog(false)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setShowDialog(value => !value)
  }, [])

  const handleAllDatesChange = useCallback(
    value => {
      handleChange({
        allDate: value
      })
    },
    // eslint-disable-next-line
    []
  )
  const handleAllTimeChange = useCallback(
    value => {
      handleChange({
        allTime: value
      })
    },
    // eslint-disable-next-line
    []
  )

  return (
    <>
      <div className={classes.scheduleInfoWrap}>
        <DateRangePicker
          values={values}
          startTime={startTime}
          endTime={endTime}
          startDate={startDate}
          endDate={endDate}
          handleChangeStartTime={handleChangeStartTime}
          handleChangeEndTime={handleChangeEndTime}
          handleChangeStartDate={handleChangeStartDate}
          handleChangeEndDate={handleChangeEndDate}
          handleAllDatesChange={handleAllDatesChange}
          handleAllTimeChange={handleAllTimeChange}
        />
        {!values.allDate && (
          <div>
            {!!!values.specificDates.length && (
              <FormControlReactSelect
                id="type"
                label={''}
                fullWidth={true}
                value={selectedRange}
                marginBottom={16}
                options={range}
                handleChange={e => setSelectedRange(e.target.value)}
              />
            )}
            {!!values.specificDates.length && (
              <FormControlInput
                fullWidth={true}
                value={values.specificDates.join(' | ')}
                onClick={() => setShowDialog(true)}
              />
            )}
            <WhiteButton onClick={() => setShowDialog(true)}>
              Select custom dates
            </WhiteButton>
          </div>
        )}
      </div>
      <div
        className={[
          classes.scheduleInfoWrap,
          values.workingDays.length < 1 ? classes.error : ''
        ].join(' ')}
        style={{ padding: '0px 20px 20px 20px' }}
      >
        <CheckboxSwitcher
          label={t('All days')}
          switchBaseClass={classes.playTimeCheckbox}
          value={values.allDay}
          handleChange={val => {
            handleChange({
              allDay: val,
              ...(val && { workingDays: days }),
              ...(!val && { workingDays: [] })
            })
          }}
        />
        <div className={classes.daysWrapper}>
          {days.map(day => (
            <WhiteButton
              className={[
                classes.dayButton,
                values.workingDays.includes(day) ? classes.selected : ''
              ].join(' ')}
              key={day}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </WhiteButton>
          ))}
        </div>
      </div>
      <DialogCustomSelect
        show={isShowDialog}
        selectedDate={startDate}
        handleSubmitDialog={handleSubmitDialog}
        handleCloseDialog={handleCloseDialog}
        handleChange={val =>
          handleChange({
            specificDates: val
          })
        }
        values={values}
      />
    </>
  )
}

export default translate('translations')(withStyles(styles)(RedoSchedule))
