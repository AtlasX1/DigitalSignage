import React, { useCallback } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

const styles = ({ palette, type }) => {
  const day = {
    borderRadius: '50%',
    backgroundColor: palette[type].daysCheckbox.background,
    display: 'flex',
    color: palette[type].daysCheckbox.titleColor,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    margin: '0 5px',
    userSelect: 'none'
  }
  return {
    wrapDays: {
      display: 'flex'
    },
    day,
    activeDay: {
      ...day,
      backgroundColor: palette[type].daysCheckbox.active
    }
  }
}
const days = [
  {
    label: 'Mon',
    attribute: 'mon'
  },
  {
    label: 'Tue',
    attribute: 'tue'
  },
  {
    label: 'Wed',
    attribute: 'wed'
  },
  {
    label: 'Thu',
    attribute: 'thu'
  },
  {
    label: 'Fri',
    attribute: 'fri'
  },
  {
    label: 'Sat',
    attribute: 'sat'
  },
  {
    label: 'Sun',
    attribute: 'sun'
  }
]

const DaysCheckbox = ({ t, classes, value, handleChange }) => {
  const handleClickDay = useCallback(
    event => {
      const selectedDay = event.target.getAttribute('data-day')
      if (selectedDay !== null) {
        handleChange(selectedDay)
      }
    },
    [handleChange]
  )

  return (
    <div className={classes.wrapDays} onClick={handleClickDay}>
      {days.map(({ label, attribute }) => (
        <div
          className={value[attribute] ? classes.activeDay : classes.day}
          key={`day-${attribute}`}
          data-day={attribute}
        >
          {t(label)}
        </div>
      ))}
    </div>
  )
}

DaysCheckbox.propTypes = {
  value: PropTypes.object.isRequired,
  t: PropTypes.func,
  classes: PropTypes.object,
  handleChange: PropTypes.func
}
DaysCheckbox.defaultProps = {
  value: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
  }
}

export default translate('translations')(withStyles(styles)(DaysCheckbox))
