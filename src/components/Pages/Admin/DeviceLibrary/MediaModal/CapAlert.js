import React, { useEffect, useState, useCallback } from 'react'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormControlInput } from '../../../../Form'
import { BlueButton } from 'components/Buttons'
import CapAlertMediaLibrary from './CapAlertMediaLibrary'

import {
  getDeviceMediaCapAlertAction,
  clearGetDeviceMediaCapAlertInfoAction,
  putDeviceMediaCapAlertAction,
  clearPutDeviceMediaCapAlertInfoAction
} from 'actions/alertActions'
import {
  getFeatureMediaItemsAction,
  clearGetFeatureMediaItemsInfoAction
} from 'actions/mediaActions'
import { useCustomSnackbar } from 'hooks/index'

const styles = ({ type, palette }) => ({
  inputContainer: {
    width: 'calc(100% - 100px)'
  },
  button: {
    width: 90,
    height: 38
  },
  inputWrapper: {
    marginBottom: 20
  },
  passwordLabel: {
    width: 100,
    color: palette[type].formControls.label.color
  },
  passwordContainer: {
    width: 'calc(100% - 110px)'
  },
  passwordWrapper: {
    background:
      palette[type].pages.devices.alerts.mediaModal.cap.password.background,
    padding: '20px 10px',
    borderRadius: 3,
    marginBottom: 30
  },
  ipText: {
    color: palette[type].formControls.label.color,
    marginBottom: 20
  }
})

const CapAlert = ({
  t,
  id,
  classes,
  deviceMediaCapAlertReducer,
  getDeviceMediaCapAlertAction,
  clearGetDeviceMediaCapAlertInfoAction,
  putDeviceMediaCapAlertReducer,
  putDeviceMediaCapAlertAction,
  clearPutDeviceMediaCapAlertInfoAction,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [data, setData] = useState({ media: {} })
  const [dialog, setDialog] = useState(false)
  const [newSelectedMedia, setNewSelectedMedia] = useState({})

  const form = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required()
    }),
    onSubmit: values => {
      if (newSelectedMedia.id) {
        putDeviceMediaCapAlertAction({
          deviceId: id,
          data: {
            mediaId: newSelectedMedia.id,
            password: values.password
          }
        })
      }
    }
  })

  useEffect(() => {
    if (!deviceMediaCapAlertReducer.response) {
      getDeviceMediaCapAlertAction(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (deviceMediaCapAlertReducer.response) {
      setData(deviceMediaCapAlertReducer.response)
      clearGetDeviceMediaCapAlertInfoAction()
    } else if (deviceMediaCapAlertReducer.error) {
      clearGetDeviceMediaCapAlertInfoAction()
    }
    // eslint-disable-next-line
  }, [deviceMediaCapAlertReducer])

  useEffect(() => {
    if (putDeviceMediaCapAlertReducer.response) {
      clearPutDeviceMediaCapAlertInfoAction()
      showSnackbar(t('Successfully changed'))

      form.resetForm()
    } else if (putDeviceMediaCapAlertReducer.error) {
      clearPutDeviceMediaCapAlertInfoAction()
      showSnackbar(t('Password incorrect'))
    }
    // eslint-disable-next-line
  }, [putDeviceMediaCapAlertReducer])

  const handleSelectMedia = useCallback(
    media => {
      setNewSelectedMedia(media)
      setDialog(false)
    },
    [setNewSelectedMedia, setDialog]
  )

  return (
    <Grid container direction="column">
      <Grid
        container
        alignItems="flex-end"
        justify="space-between"
        className={classes.inputWrapper}
      >
        <FormControlInput
          label={t('Select Media')}
          value={
            newSelectedMedia.title || data.media.title || t('No media selected')
          }
          formControlContainerClass={classes.inputContainer}
          marginBottom={false}
          disabled
          customiseDisabled={false}
        />
        <BlueButton className={classes.button} onClick={() => setDialog(true)}>
          <i className="icon-pencil-3" />
        </BlueButton>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.passwordWrapper}
      >
        <Typography className={classes.passwordLabel}>Password:</Typography>
        <FormControlInput
          formControlContainerClass={classes.passwordContainer}
          marginBottom={false}
          controlName="password"
          type="password"
          value={form.values.password}
          error={form.errors.password}
          touched={form.touched.password}
          handleChange={form.handleChange}
          handleBlur={form.handleBlur}
          showErrorText={false}
        />
      </Grid>

      <Typography className={classes.ipText}>
        Your IP Address 109.227.80.88 and Current Time 2020-01-26 05:01:52 will
        be recorded.
      </Typography>

      <Grid container justify="flex-end">
        <BlueButton onClick={form.submitForm}>{t('OK')}</BlueButton>
      </Grid>

      {dialog && (
        <CapAlertMediaLibrary
          open={dialog}
          handleClose={() => setDialog(false)}
          deviceId={id}
          selectedMediaId={data.media.id}
          onSuccess={handleSelectMedia}
        />
      )}
    </Grid>
  )
}

const mapStateToProps = ({ alert, media }) => ({
  deviceMediaCapAlertReducer: alert.deviceMediaCapAlert,
  featureMediaItemsReducer: media.featureMediaItems,
  putDeviceMediaCapAlertReducer: alert.putDeviceMediaCapAlert
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceMediaCapAlertAction,
      clearGetDeviceMediaCapAlertInfoAction,
      getFeatureMediaItemsAction,
      clearGetFeatureMediaItemsInfoAction,
      putDeviceMediaCapAlertAction,
      clearPutDeviceMediaCapAlertInfoAction
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(CapAlert)
