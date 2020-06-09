import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles
} from '@material-ui/core'
import { BlueButton, WhiteButton } from '../../../../Buttons'
import { translate } from 'react-i18next'
import moment from 'moment'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import update from 'immutability-helper'

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

const DialogCustomSelect = props => {
  const {
    classes,
    t,
    show,
    handleCloseDialog,
    handleSubmitDialog,
    handleChange,
    values
  } = props

  const selectedDays = values.specificDates.map(
    d => new Date(moment(d).format())
  )

  const handleDateChange = (day, { selected }) => {
    let dateArr
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      )
      dateArr = update(selectedDays, {
        $splice: [[selectedIndex, 1]]
      })
    } else {
      dateArr = update(selectedDays, {
        $push: [day]
      })
    }

    handleChange(dateArr.map(date => moment(date).format('YYYY-MM-DD')))
  }

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
          <DayPicker
            selectedDays={selectedDays}
            onDayClick={handleDateChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <WhiteButton onClick={handleCloseDialog}>{t('Cancel')}</WhiteButton>
        <BlueButton onClick={handleSubmitDialog}>{t('Done')}</BlueButton>
      </DialogActions>
    </Dialog>
  )
}

export default translate('translations')(withStyles(styles)(DialogCustomSelect))
