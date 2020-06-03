import React, { useState } from 'react'
import { translate } from 'react-i18next'
import 'react-dates/initialize'
import {
  CalendarDay,
  DayPickerRangeController,
  DayPickerSingleDateController
} from 'react-dates'
import moment from 'moment'

import {
  withStyles,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core'

import Popup from '../Popup'
import {
  CircleIconButton,
  TabToggleButton,
  TabToggleButtonGroup
} from '../Buttons'
import { FormControlInput } from './index'

import 'react-dates/lib/css/_datepicker.css'
import '../../styles/forms/_datepicker.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    bottomMargin: {
      marginBottom: theme.spacing.unit * 2
    },
    formControlWrap: {
      position: 'relative',
      width: '100%'
    },
    calendarIcon: {
      position: 'absolute',
      top: '3px',
      right: '10px',
      fontSize: '24px',
      color: '#74809a'
    },
    tabButtonsWrap: {
      padding: '10px 0'
    },
    pickerWrap: {
      width: '318px',
      borderRight: `solid 1px ${palette[type].formControls.multipleDatesPicker.border}`
    },
    multipleDates: {
      marginBottom: 0
    },
    dateRangeWrap: {
      width: '638px'
    },
    presetDatesList: {
      borderRight: `solid 1px ${palette[type].formControls.multipleDatesPicker.border}`,
      borderBottom: '0',
      height: '378px'
    },
    presetDate: {
      paddingTop: 0,
      paddingBottom: 0,
      borderBottom: `solid 1px ${palette[type].formControls.multipleDatesPicker.border}`,
      cursor: 'pointer',
      '&:last-child': {
        borderBottom: 0
      }
    },
    presetDateText: {
      fontSize: '13px',
      lineHeight: '42px',
      color: '#74809a'
    },
    selectedDates: {
      width: '318px',
      maxHeight: '295px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    selectedDate: {
      paddingLeft: '20px',
      borderBottom: `solid 1px ${palette[type].formControls.multipleDatesPicker.border}`
    },
    selectedDateText: {
      fontSize: '13px',
      lineHeight: '42px',
      color: '#74809a'
    },
    deleteDate: {
      fontSize: '18px',
      color: '#74809a'
    },
    bottomActionsContainer: {
      height: '37px',
      borderTop: `1px solid ${palette[type].formControls.multipleDatesPicker.border}`,
      padding: '0 25px'
    },
    clearAllButton: {
      color: '#74809a',
      fontSize: '12px',
      letterSpacing: '-0.01px',
      textTransform: 'none'
    }
  }
}

const thisWeek = {
  startOf: moment().startOf('isoWeek'),
  endOf: moment().endOf('isoWeek')
}
const nextWeek = {
  startOf: moment().add(1, 'week').startOf('isoWeek'),
  endOf: moment().add(1, 'week').endOf('isoWeek')
}
const thisMonth = {
  startOf: moment().startOf('month'),
  endOf: moment().endOf('month')
}
const nextMonth = {
  startOf: moment().add(1, 'month').startOf('month'),
  endOf: moment().add(1, 'month').endOf('month')
}
const thisYear = {
  startOf: moment().startOf('year'),
  endOf: moment().endOf('year')
}
const nextYear = {
  startOf: moment().add(1, 'year').startOf('year'),
  endOf: moment().add(1, 'year').endOf('year')
}

// const transformDatesToDays = dates => {
//   let days = []
//   let day = dates.startOf
//
//   while (day <= dates.endOf) {
//     days.push(day.toDate())
//     day = day.clone().add(1, 'd')
//   }
//
//   return days
// }

const FormControlMultipleDatesPicker = ({ t, classes, ...props }) => {
  const { bottomMargin = true } = props

  const [dates, setDates] = useState([])
  const [datePickerType, setDatePickerType] = useState('multipleDates')
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  })
  const [dateRangeInput, setDateRangeInput] = useState('startDate')

  const presets = [
    { date: moment(), label: t('Today') },
    { date: moment().add(1, 'day'), label: t('Tomorrow') },

    { label: t('This Week'), ...thisWeek },
    { label: t('Next Week'), ...nextWeek },

    { label: t('This Month'), ...thisMonth },
    { label: t('Next Month'), ...nextMonth },

    { label: t('This Year'), ...thisYear },
    { label: t('Next Year'), ...nextYear }
  ]

  const value =
    datePickerType === 'multipleDates'
      ? dates.map(date => date.format('YYYY/MM/DD')).join(', ')
      : `${
          dateRange.startDate ? dateRange.startDate.format('YYYY/MM/DD') : ''
        }-${dateRange.endDate ? dateRange.endDate.format('YYYY/MM/DD') : ''}`

  const handleChange = date => {
    if (moment.isMoment(date)) {
      setDatePickerType('multipleDates')

      const newDates = !!dates.find(d => d.isSame(date, 'day'))
        ? dates
        : [...dates, date]

      setDates(newDates)
    } else {
      setDatePickerType('dateRange')

      setDateRange({
        startDate: date.startDate,
        endDate: date.endDate
      })
    }
  }

  const deleteSelection = index => {
    const newDates = dates.filter((el, i) => i !== index)
    setDates(newDates)
  }

  const clearAll = () => {
    setDates([])
    setDateRange({})
    setDateRangeInput('startDate')
  }

  return (
    <Grid
      container
      alignItems="center"
      className={bottomMargin ? classes.bottomMargin : null}
    >
      <Popup
        on="click"
        trigger={
          <div className={classes.formControlWrap}>
            <FormControlInput
              readOnly
              id="dates"
              value={value}
              fullWidth={true}
              formControlRootClass={classes.multipleDates}
            />
            <i className={`icon-calendar-1 ${classes.calendarIcon}`} />
          </div>
        }
        contentStyle={{
          width: '753px',
          height: '378px',
          borderRadius: '6px'
        }}
        arrowStyle={{ right: '100px', left: 'auto' }}
        position="bottom right"
      >
        <div>
          <Grid container>
            <Grid item>
              <List
                component="nav"
                disablePadding={true}
                className={classes.presetDatesList}
              >
                {presets.map((preset, index) => {
                  return (
                    <ListItem
                      key={`preset-date-${index}`}
                      className={classes.presetDate}
                      onClick={() =>
                        handleChange(
                          preset.date || {
                            startDate: preset.startOf,
                            endDate: preset.endOf
                          }
                        )
                      }
                    >
                      <ListItemText
                        primary={preset.label}
                        classes={{ primary: classes.presetDateText }}
                      />
                    </ListItem>
                  )
                })}
              </List>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item container>
                  <Grid container justify="center">
                    <Grid item className={classes.tabButtonsWrap}>
                      <TabToggleButtonGroup
                        exclusive
                        value={datePickerType}
                        onChange={(event, type) => {
                          if (type) {
                            clearAll()
                            setDatePickerType(type)
                          }
                        }}
                      >
                        <TabToggleButton value="dateRange">
                          {t('Date Range')}
                        </TabToggleButton>
                        <TabToggleButton value="multipleDates">
                          {t('Custom Multiple Dates')}
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  {datePickerType === 'multipleDates' ? (
                    <Grid container>
                      <Grid
                        item
                        xs
                        className={`FormControlMultipleDatesPicker ${classes.pickerWrap}`}
                      >
                        <DayPickerSingleDateController
                          hideKeyboardShortcutsPanel={true}
                          numberOfMonths={1}
                          onDateChange={handleChange}
                          renderCalendarDay={props => {
                            const { day, modifiers } = props

                            if (modifiers) {
                              if (dates.includes(day)) {
                                modifiers.add('selected')
                              } else {
                                modifiers.delete('selected')
                              }
                            }

                            return (
                              <CalendarDay
                                {...props}
                                modifiers={new Set(modifiers)}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs className={classes.selectedDates}>
                        {!dates.length && (
                          <Typography
                            align="center"
                            className={classes.selectedDateText}
                          >
                            {t('No dates selected')}
                          </Typography>
                        )}
                        {dates.map((date, index) => (
                          <Grid
                            container
                            key={`date-${index}`}
                            justify="space-between"
                            className={classes.selectedDate}
                          >
                            <Grid item xs>
                              <Typography className={classes.selectedDateText}>
                                {date.format('DD MMM YYYY')}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <CircleIconButton
                                className={classes.deleteDate}
                                onClick={() => deleteSelection(index)}
                              >
                                <i className="icon-bin" />
                              </CircleIconButton>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container>
                      <Grid
                        item
                        xs
                        className={`FormControlMultipleDatesPicker ${classes.dateRangeWrap}`}
                      >
                        <Grid container justify="space-between">
                          <DayPickerRangeController
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                            onDatesChange={e => handleChange(e)}
                            focusedInput={dateRangeInput}
                            onFocusChange={input =>
                              setDateRangeInput(input || 'startDate')
                            }
                            hideKeyboardShortcutsPanel={true}
                          />
                          <DayPickerRangeController
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                            onDatesChange={e => handleChange(e)}
                            focusedInput={dateRangeInput}
                            onFocusChange={input =>
                              setDateRangeInput(input || 'startDate')
                            }
                            hideKeyboardShortcutsPanel={true}
                            initialVisibleMonth={() =>
                              moment().add(1, 'months')
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  className={classes.bottomActionsContainer}
                  justify="flex-end"
                >
                  <Button className={classes.clearAllButton} onClick={clearAll}>
                    Clear All
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Popup>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(FormControlMultipleDatesPicker)
)
