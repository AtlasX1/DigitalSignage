import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { withSnackbar } from 'notistack'
import { useFormik } from 'formik'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles, Typography, Grid } from '@material-ui/core'
import classNames from 'classnames'

import { BlueButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import {
  FormControlInput,
  FormControlSelect,
  FormControlDateTimePicker
} from 'components/Form'

import {
  getDeviceReboot,
  putDeviceReboot,
  clearPutDeviceRebootInfo
} from 'actions/deviceActions'
import { useCustomSnackbar } from 'hooks/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    infoContainer: {
      marginBottom: 10
    },
    infoText: {
      flex: 1,
      fontSize: 15
    },
    infoLabel: {
      color: palette[type].pages.devices.rebootModal.info.label.color
    },
    infoValue: {
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
    }
  }
}

const info = [
  {
    name: 'name',
    label: 'Name'
  },
  {
    name: 'alias',
    label: 'Alias'
  },
  {
    name: 'nextReboot',
    label: 'Next Reboot'
  }
]

const RebootForm = ({
  t,
  id,
  classes,
  data = {},
  initialRebootValues = {},
  handleClose = f => f,
  getDeviceReboot,
  putRebootReducer,
  putDeviceReboot,
  clearPutDeviceRebootInfo,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)

  const form = useFormik({
    initialValues: {
      rebootChoice: '',
      ignoreMediaDownloading: false,
      rebootAfterValue: '',
      rebootAfterUnit: 'second',
      rebootAt: ''
    },
    onSubmit: values => {
      if (!values.rebootChoice) {
        form.setTouched({ rebootChoice: true })
        return
      }
      if (values.rebootChoice === 'after' && !values.rebootAfterValue) {
        form.setFieldError('rebootAfterValue', 'Error')
        return
      }

      const preparedTime =
        values.rebootChoice === 'at' ? `${values.rebootAt}:00` : ''

      const d = update(values, {
        rebootAt: { $set: preparedTime }
      })

      putDeviceReboot({
        id: id,
        data: d
      })
    }
  })

  useEffect(() => {
    form.setValues(initialRebootValues)
    // eslint-disable-next-line
  }, [initialRebootValues])

  useEffect(() => {
    if (putRebootReducer.response) {
      getDeviceReboot(id)

      showSnackbar(t('Successfully added'))
      handleClose()
      clearPutDeviceRebootInfo()
    } else if (putRebootReducer.error) {
      showSnackbar(t('Error'))
      clearPutDeviceRebootInfo()
    }
    // eslint-disable-next-line
  }, [putRebootReducer])

  const handleRebootChoiceChange = useCallback(
    (value, field) => {
      if (value) form.setFieldValue('rebootChoice', field, false)
      else form.setFieldValue('rebootChoice', '', false)
    },
    [form]
  )

  const handleIgnoreCheckboxChange = () => {
    form.setFieldValue(
      'ignoreMediaDownloading',
      !form.values.ignoreMediaDownloading,
      false
    )
  }

  const handleUnitChange = e => {
    form.setFieldValue('rebootAfterUnit', e.target.value, false)
  }

  const handleRebootAtChange = e => {
    form.setFieldValue('rebootAt', e, false)
  }

  return (
    <Grid container direction="column">
      {info.map((field, index) => (
        <Grid container key={index} className={classes.infoContainer}>
          <Typography
            className={classNames(classes.infoText, classes.infoLabel)}
          >
            {t(field.label)}:
          </Typography>
          <Typography
            className={classNames(classes.infoText, classes.infoValue)}
          >
            {data[field.name]}
          </Typography>
        </Grid>
      ))}

      <Grid container>
        <CheckboxSwitcher
          id="now"
          label={t('Reboot now')}
          labelPlacement="end"
          value={form.values.rebootChoice === 'now'}
          formControlLabelClass={classes.checkboxLabel}
          switchContainerClass={classes.checkboxContainer}
          handleChange={handleRebootChoiceChange}
          error={!form.values.rebootChoice && form.touched.rebootChoice}
        />
      </Grid>

      <Grid container alignItems="center">
        <CheckboxSwitcher
          id="after"
          label={t('Reboot after')}
          labelPlacement="end"
          value={form.values.rebootChoice === 'after'}
          formControlLabelClass={classes.checkboxLabel}
          switchContainerClass={classes.checkboxContainer}
          handleChange={handleRebootChoiceChange}
          error={!form.values.rebootChoice && form.touched.rebootChoice}
        />

        <Grid
          container
          className={classes.checkboxInputs}
          justify="space-between"
        >
          <FormControlInput
            value={form.values.rebootAfterValue}
            name="rebootAfterValue"
            handleChange={form.handleChange}
            error={form.errors.rebootAfterValue}
            touched={form.touched.rebootAfterValue}
            showErrorText={false}
            marginBottom={false}
            formControlContainerClass={classes.inputContainer}
          />

          <FormControlSelect
            value={form.values.rebootAfterUnit}
            handleChange={handleUnitChange}
            marginBottom={false}
            formControlContainerClass={classes.selectContainer}
            options={[
              { label: 'Seconds', value: 'second' },
              { label: 'Minutes', value: 'minute' },
              { label: 'Hours', value: 'hour' }
            ]}
          />
        </Grid>
      </Grid>

      <Grid container alignItems="center">
        <CheckboxSwitcher
          id="at"
          label={t('Reboot at')}
          labelPlacement="end"
          value={form.values.rebootChoice === 'at'}
          formControlLabelClass={classes.checkboxLabel}
          switchContainerClass={classes.checkboxContainer}
          handleChange={handleRebootChoiceChange}
          error={!form.values.rebootChoice && form.touched.rebootChoice}
        />

        <Grid
          container
          className={classes.checkboxInputs}
          justify="space-between"
        >
          <FormControlDateTimePicker
            handleChange={handleRebootAtChange}
            initialValue={form.values.rebootAt}
            error={form.errors.rebootAt}
            touched={form.touched.rebootAt}
          />
        </Grid>
      </Grid>

      <CheckboxSwitcher
        value={form.values.ignoreMediaDownloading}
        handleChange={handleIgnoreCheckboxChange}
        label={t('Ignore media downloading activity')}
        labelPlacement="end"
        formControlLabelClass={classes.checkboxLabel}
        switchContainerClass={classNames(
          classes.checkboxContainer,
          classes.containerMB
        )}
      />

      <Grid container justify="flex-end">
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

RebootForm.propTypes = {
  classes: PropTypes.object,
  handleClose: PropTypes.func,
  id: PropTypes.number,
  data: PropTypes.object,
  initialRebootValues: PropTypes.object,
  rebootReducer: PropTypes.object,
  putRebootReducer: PropTypes.object,
  clearPutDeviceRebootInfo: PropTypes.func
}

const mapStateToProps = ({ device }) => ({
  rebootReducer: device.reboot,
  putRebootReducer: device.putReboot
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceReboot,
      putDeviceReboot,
      clearPutDeviceRebootInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(RebootForm))
  )
)
