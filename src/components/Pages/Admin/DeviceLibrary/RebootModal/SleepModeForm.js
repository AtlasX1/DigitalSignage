import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { withSnackbar } from 'notistack'
import { useFormik } from 'formik'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles, Typography, Grid } from '@material-ui/core'
import classNames from 'classnames'
import * as Yup from 'yup'

import { BlueButton } from 'components/Buttons'
import { FormControlTimeDurationPicker } from 'components/Form'
import moment from 'moment'
import { CheckboxSwitcher } from 'components/Checkboxes'

import {
  getDeviceSleepMode,
  putDeviceSleepMode,
  clearPutDeviceSleepModeInfo
} from 'actions/deviceActions'
import { useCustomSnackbar } from 'hooks/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    infoContainer: {
      marginBottom: 10,
      alignItems: 'baseline'
    },
    infoText: {
      flex: 1,
      fontSize: 15
    },
    infoLabel: {
      color: palette[type].pages.devices.rebootModal.info.label.color
    },
    infoValue: {
      display: 'flex',
      alignItems: 'baseline',
      fontWeight: 600,
      color: palette[type].pages.devices.rebootModal.info.value.color
    },
    checkboxLabel: {
      fontSize: 15
    },
    checkboxContainer: {
      position: 'relative',
      left: -15,
      flex: 1
    },
    checkboxInputs: {
      flex: 1
    },
    inputContainer: {
      width: 75
    },
    selectContainer: {
      width: 'calc(100% - 95px)'
    },
    containerMB: {
      marginBottom: 25
    },
    button: {
      width: 100,

      '&:first-child': {
        marginRight: 10
      }
    },
    footer: {
      marginTop: '1rem'
    },
    switchContainerClass: {
      marginTop: '-1em'
    },
    formControlSeparator: {
      margin: '0 0.5rem'
    },
    formError: {
      marginTop: '-1em',
      lineHeight: '1em'
    },
    formErrorText: {
      color: 'red',
      fontSize: 9
    }
  }
}

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]
const getSleepModeFormValues = (initialValues = {}) => {
  const defaultTimeSpan = {
    startTime: '00:00:00',
    endTime: '23:59:59'
  }
  const getWeekDayInfo = ({ startTime, endTime }) => ({
    startTime,
    endTime,
    allDay:
      startTime === defaultTimeSpan.startTime &&
      endTime === defaultTimeSpan.endTime
  })
  return weekDays.reduce(
    (formValues, weekDay) => ({
      ...formValues,
      [weekDay]: getWeekDayInfo(initialValues[weekDay] || defaultTimeSpan)
    }),
    {}
  )
}

function SingleControl({
  t,
  classes,
  day,
  value,
  error,
  onAllDayChange,
  onSetStartTime,
  onSetEndTime
}) {
  return (
    <Grid container className={classes.infoContainer}>
      <Grid item xs={3}>
        <Typography className={classNames(classes.infoText, classes.infoLabel)}>
          {moment().day(day).format('dddd')}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <CheckboxSwitcher
          switchContainerClass={classes.switchContainerClass}
          label={t('All day')}
          value={value.allDay}
          handleChange={onAllDayChange(day)}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography
          component="div"
          className={classNames(classes.infoText, classes.infoValue)}
        >
          <FormControlTimeDurationPicker
            id={`${day}-start-time-picker`}
            label=""
            disabled={value.allDay}
            value={value.startTime}
            onChange={onSetStartTime(day)}
          />
          <span className={classes.formControlSeparator}>to</span>
          <FormControlTimeDurationPicker
            id={`${day}-end-time-picker`}
            label=""
            disabled={value.allDay}
            value={value.endTime}
            onChange={onSetEndTime(day)}
          />
        </Typography>
      </Grid>
      {error ? (
        <Grid item xs={6} className={classes.formError}>
          <Typography className={classes.formErrorText}>{error}</Typography>
        </Grid>
      ) : null}
    </Grid>
  )
}

const SingleControlMemoized = React.memo(SingleControl)

const validationSchema = Yup.object().shape(
  weekDays.reduce(
    (formValues, weekDay) => ({
      ...formValues,
      [weekDay]: Yup.object().test(
        weekDay,
        'Start time must be less than end time',
        ({ startTime, endTime }) =>
          moment(startTime, 'HH:mm:ss').isBefore(moment(endTime, 'HH:mm:ss'))
      )
    }),
    {}
  )
)

const SleepModeForm = ({
  t,
  id,
  classes,
  initialValues = {},
  handleClose = f => f,
  getDeviceSleepMode,
  putSleepModeReducer,
  putDeviceSleepMode,
  clearPutDeviceSleepModeInfo,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)

  const form = useFormik({
    initialValues: getSleepModeFormValues(initialValues),
    validationSchema,
    onSubmit: values => {
      const data = Object.keys(values)
        .filter(weekDay => !values[weekDay].allDay)
        .map(weekDay => ({
          startTime: values[weekDay].startTime,
          endTime: values[weekDay].endTime,
          day: weekDay
        }))

      putDeviceSleepMode({
        id,
        data
      })
    }
  })

  const { values, errors, setFieldValue, setValues, validateForm } = form

  useEffect(() => {
    setValues(getSleepModeFormValues(initialValues))
  }, [initialValues, setValues])

  useEffect(() => {
    validateForm()
  }, [values, validateForm])

  useEffect(() => {
    if (putSleepModeReducer.response) {
      getDeviceSleepMode(id)

      showSnackbar(t('Successfully added'))
      handleClose()
      clearPutDeviceSleepModeInfo()
    } else if (putSleepModeReducer.error) {
      showSnackbar(t('Error'))
      clearPutDeviceSleepModeInfo()
    }
    // eslint-disable-next-line
  }, [putSleepModeReducer])

  const onSetStartTime = useCallback(
    weekDay => startTime => {
      setFieldValue(`${weekDay}.startTime`, startTime, false)
    },
    [setFieldValue]
  )

  const onSetEndTime = useCallback(
    weekDay => endTime => {
      setFieldValue(`${weekDay}.endTime`, endTime, false)
    },
    [setFieldValue]
  )

  const onAllDayChange = useCallback(
    weekDay => value => {
      setFieldValue(
        weekDay,
        { startTime: '00:00:00', endTime: '23:59:59', allDay: value },
        false
      )
    },
    [setFieldValue]
  )

  const renderControls = useMemo(() => {
    return weekDays.map((day, index) => {
      return (
        <SingleControlMemoized
          t={t}
          classes={classes}
          key={index}
          day={day}
          value={values[day]}
          error={errors[day]}
          onAllDayChange={onAllDayChange}
          onSetEndTime={onSetEndTime}
          onSetStartTime={onSetStartTime}
        />
      )
    })
  }, [t, classes, values, errors, onAllDayChange, onSetEndTime, onSetStartTime])

  return (
    <Grid container direction="column">
      {renderControls}

      <Grid container justify="flex-end" className={classes.footer}>
        <BlueButton className={classes.button} onClick={handleClose}>
          {t('Cancel')}
        </BlueButton>
        <BlueButton className={classes.button} onClick={form.submitForm}>
          {t('Save')}
        </BlueButton>
      </Grid>
    </Grid>
  )
}

SleepModeForm.propTypes = {
  classes: PropTypes.object,
  handleClose: PropTypes.func,
  id: PropTypes.number,
  initialValues: PropTypes.object,
  sleepModeReducer: PropTypes.object,
  putSleepModeReducer: PropTypes.object,
  clearPutDeviceSleepModeInfo: PropTypes.func
}

const mapStateToProps = ({ device }) => ({
  sleepModeReducer: device.sleepMode,
  putSleepModeReducer: device.putSleepMode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceSleepMode,
      putDeviceSleepMode,
      clearPutDeviceSleepModeInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(SleepModeForm))
  )
)
