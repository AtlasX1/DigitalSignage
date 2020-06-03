import React, { Component } from 'react'
import options from './options'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles
} from '@material-ui/core'
import FormControlInput from '../../../../Form/FormControlInput'
import FormControlSelect from '../../../../Form/FormControlSelect'
import {
  identifyEndOfWord,
  identifyNumberDayOfWeekInMonth,
  identifyEndOfWordForDayOfMonth,
  ucFirst
} from '../../../../../utils/redoSchedule'
import { BlueButton, WhiteButton } from '../../../../Buttons'
import DaysCheckbox from './DaysCheckbox'
import { translate } from 'react-i18next'
import WrapperDatePicker from '../../../../Form/WrapperDatePicker'
import moment from 'moment'
import constants from '../../../../../constants/redoSchedule'

const textForm = {
  repeat: ['repeat', 'repetitions'],
  day: ['day', 'days'],
  month: ['month', 'months'],
  week: ['week', 'weeks'],
  year: ['year', 'years']
}

const styles = ({ palette, type }) => ({
  root: {
    margin: '0 12px 15px',
    paddingBottom: 0,
    border: `5px solid ${palette[type].scheduleSelector.root.border}`,
    background: palette[type].scheduleSelector.root.background,
    borderRadius: '4px',
    overflow: 'unset'
  },
  dialogTitle: {
    fontSize: '20px',
    color: palette[type].scheduleSelector.dialogTitle.color
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldInterval: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  labelInterval: {
    fontSize: '14px',
    color: palette[type].scheduleSelector.labelInterval.color,
    marginBottom: '10px'
  },
  repeatDays: {
    marginBottom: '20px'
  },
  ending: {},
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    height: '50px'
  },
  radio: {
    width: '20px',
    height: '20px',
    marginRight: '10px'
  },
  datePicker: {
    height: '38px',
    width: '90px',
    borderRadius: '4px',
    paddingLeft: '10px',
    border: `1px solid ${palette[type].formControls.input.border}`,
    background: palette[type].formControls.input.background,
    color: palette[type].formControls.input.color,
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  radioLabel: {
    color: palette[type].scheduleSelector.labelInterval.color,
    minWidth: '60px'
  },
  interval: {
    width: '80px'
  },
  period: {
    maxWidth: '90px',
    width: '90px'
  },
  w90px: {
    width: '90px'
  }
})

class DialogCustomSelect extends Component {
  constructor(props) {
    super(props)

    const { selectedDate } = this.props
    const selectedDays = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false
    }
    const day = moment(selectedDate).format('ddd').toLowerCase()

    this.state = {
      monthlyRecurrenceOptions: options.monthlyRecurrenceOptions,
      monthlyRecurrenceOption: constants.monthlyDay,
      period: constants.day,
      periods: options.periods,
      interval: 1,
      countRepeat: 1,
      endingDate: new Date(),
      ending: constants.never,
      selectedDays: { ...selectedDays, [day]: true }
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { selectedDate } = props
    const monthlyRecurrenceOptions = options.monthlyRecurrenceOptions.map(
      value => {
        switch (value.value) {
          case constants.monthlyDay:
            return {
              ...value,
              label: `Monthly - ${identifyEndOfWordForDayOfMonth(
                moment(selectedDate).format('DD')
              )}`
            }
          case constants.monthlyDayOfWeek:
            return {
              ...value,
              label: `Monthly ${identifyNumberDayOfWeekInMonth(selectedDate)}`
            }
          default:
            return value
        }
      }
    )
    return {
      ...state,
      monthlyRecurrenceOptions
    }
  }

  handleChangeSelectedDays = selectedDay => {
    const { selectedDays } = this.state
    const modifiedSelectedDays = {
      ...selectedDays,
      [selectedDay]: !selectedDays[selectedDay]
    }
    this.setState({
      selectedDays: modifiedSelectedDays
    })
    let hasSelectedDay = Object.keys(selectedDays).some(
      day => modifiedSelectedDays[day]
    )

    if (!hasSelectedDay) {
      const { selectedDate } = this.props
      const day = moment(selectedDate).format('ddd').toLowerCase()

      this.setState({
        selectedDays: {
          ...modifiedSelectedDays,
          [day]: true
        }
      })
    }
  }

  handleChange = ({ currentTarget: { id: key }, target: { value } }) => {
    switch (key) {
      case constants.countRepeat: {
        if (value > 0) {
          this.setState({
            [key]: Number.parseInt(value)
          })
        }
        break
      }
      case constants.interval: {
        const { periods } = this.state

        if (value > 0 && value < 10000) {
          this.setState({
            [key]: Number.parseInt(value)
          })
        }
        this.setState({
          periods: periods.map(period => ({
            ...period,
            label: identifyEndOfWord(value, textForm[period.value])
          }))
        })

        break
      }
      default: {
        this.setState({
          [key]: value
        })
        break
      }
    }
  }

  handleSubmitDialog = () => {
    const { handleSubmitDialog, selectedDate } = this.props
    const {
      monthlyRecurrenceOption,
      period,
      interval,
      countRepeat,
      endingDate,
      ending,
      selectedDays
    } = this.state

    let label

    if (interval > 1) {
      label = `Every ${interval} ${period}`
    } else {
      if (period !== constants.day) {
        label = `${ucFirst(period)}ly`
      } else {
        label = `Daily`
      }
    }

    if (period === constants.month) {
      if (monthlyRecurrenceOption === constants.monthlyDay) {
        label += ` ${identifyEndOfWordForDayOfMonth(
          moment(selectedDate).format('DD')
        )}`
      } else {
        label += ` ${identifyNumberDayOfWeekInMonth(selectedDate)}`
      }
    }

    if (period === constants.week) {
      let daysArray = []
      Object.keys(selectedDays).forEach(day => {
        if (selectedDays[day]) {
          daysArray.push(ucFirst(day))
        }
      })
      if (daysArray.length === 7) {
        label += ` - all days`
      } else if (
        daysArray.length === 5 &&
        daysArray.some(day => day !== 'Sut' || day !== 'Sun')
      ) {
        label += ` - work days`
      } else {
        label += ` - ${daysArray.join(`, `)}`
      }
    }

    if (ending === constants.date) {
      label += `, until ${moment(endingDate).format('LL')}`
    } else if (ending === constants.after) {
      label += `, ${countRepeat} ${identifyEndOfWord(countRepeat, [
        'time',
        'times'
      ])}`
    }

    handleSubmitDialog({
      label,
      interval: {
        value: interval,
        period: {
          type: period,
          value:
            period === constants.week
              ? selectedDays
              : period === constants.month
              ? monthlyRecurrenceOption
              : period
        }
      },
      ending: {
        type: ending,
        value:
          ending === constants.never
            ? ending
            : ending === constants.after
            ? countRepeat
            : endingDate
      }
    })

    this.setState({
      ending: constants.never
    })
  }

  handleDateChange = endingDate => {
    this.setState({ endingDate })
  }

  renderSubMenu = () => {
    const {
      period,
      selectedDays,
      monthlyRecurrenceOption,
      monthlyRecurrenceOptions
    } = this.state
    const { t, classes } = this.props
    const { handleChangeSelectedDays, handleChange } = this

    if (period !== constants.week && period !== constants.month) {
      return null
    }

    return (
      <>
        {period === constants.week ? (
          <>
            <Typography className={classes.labelInterval}>
              {t('Repeat days')}
            </Typography>
            <DaysCheckbox
              value={selectedDays}
              handleChange={handleChangeSelectedDays}
            />
          </>
        ) : (
          <FormControlSelect
            marginBottom={false}
            id="monthlyRecurrenceOption"
            style={{ marginTop: '20px' }}
            handleChange={handleChange}
            value={monthlyRecurrenceOption}
            options={monthlyRecurrenceOptions}
          />
        )}
      </>
    )
  }

  render() {
    const {
      period,
      periods,
      interval,
      countRepeat,
      endingDate,
      ending
    } = this.state

    const { classes, t, show, handleCloseDialog } = this.props

    const {
      handleSubmitDialog,
      handleDateChange,
      handleChange,
      renderSubMenu
    } = this

    return (
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth={true}
        maxWidth="xs"
        classes={{
          paper: classes.root
        }}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <Typography className={classes.dialogTitle}>
            {t('Event replay')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogContent}>
            <div className={classes.fieldInterval}>
              <Typography className={classes.labelInterval}>
                {t('Repeat at intervals')}
              </Typography>
              <FormControlInput
                id="interval"
                type="number"
                marginBottom={false}
                value={interval}
                className={classes.interval}
                handleChange={handleChange}
              />
              <FormControlSelect
                marginBottom={false}
                value={period}
                id="period"
                className={classes.period}
                handleChange={handleChange}
                options={periods}
              />
            </div>
            <div className={classes.repeatDays}>{renderSubMenu()}</div>
            <div className={classes.ending}>
              <div className={classes.radioOption}>
                <input
                  type="radio"
                  name="ending"
                  value="never"
                  checked={ending === 'never'}
                  id="ending"
                  onChange={handleChange}
                  className={classes.radio}
                />
                <Typography className={classes.radioLabel}>
                  {t('Never')}
                </Typography>
              </div>
              <div className={classes.radioOption}>
                <input
                  type="radio"
                  name="ending"
                  value="date"
                  id="ending"
                  onChange={handleChange}
                  className={classes.radio}
                />
                <Typography className={classes.radioLabel}>
                  {t('Date')}
                </Typography>
                <div className={classes.w90px}>
                  <WrapperDatePicker
                    selected={endingDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    disabled={ending !== 'date'}
                  />
                </div>
              </div>
              <div className={classes.radioOption}>
                <input
                  name="ending"
                  value="after"
                  type="radio"
                  id="ending"
                  onChange={handleChange}
                  className={classes.radio}
                />
                <Typography className={classes.radioLabel}>
                  {t('After')}
                </Typography>
                <FormControlInput
                  type="number"
                  marginBottom={false}
                  value={countRepeat}
                  className={classes.w90px}
                  id="countRepeat"
                  handleChange={handleChange}
                  disabled={ending !== 'after'}
                />
                <Typography
                  className={classes.radioLabel}
                  style={{ marginLeft: '5px' }}
                >
                  {t(`${identifyEndOfWord(countRepeat, textForm.repeat)}`)}
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <WhiteButton onClick={handleCloseDialog}>{t('Cancel')}</WhiteButton>
          <BlueButton onClick={handleSubmitDialog}>{t('Done')}</BlueButton>
        </DialogActions>
      </Dialog>
    )
  }
}

export default translate('translations')(withStyles(styles)(DialogCustomSelect))
