import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
import { CircularLoader } from 'components/Loaders'

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
import { isFalsy, takeTruth } from 'utils/generalUtils'

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
    color: palette[type].formControls.label.color,
    fontWeight: 600
  },
  passwordContainer: {
    width: 'calc(100% - 110px)'
  },
  passwordWrapper: {
    background:
      palette[type].pages.devices.alerts.mediaModal.cap.password.background,
    padding: 20,
    borderRadius: 3,
    marginBottom: 30
  },
  ipText: {
    fontSize: 12,
    color: palette[type].formControls.label.color,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center'
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
  const [selectedMedia, setSelectedMedia] = useState({})
  const [newSelectedMedia, setNewSelectedMedia] = useState({})
  const [dialog, setDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    ({ password }) => {
      const { id: mediaId } = newSelectedMedia
      if (mediaId) {
        setLoading(true)
        putDeviceMediaCapAlertAction({
          deviceId: id,
          data: {
            mediaId,
            password
          }
        })
      }
    },
    [newSelectedMedia, id, setLoading, putDeviceMediaCapAlertAction]
  )

  const form = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required()
    }),
    onSubmit: handleSubmit
  })

  useEffect(() => {
    if (!deviceMediaCapAlertReducer.response) {
      setLoading(true)
      getDeviceMediaCapAlertAction(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (deviceMediaCapAlertReducer.response) {
      const { media } = deviceMediaCapAlertReducer.response
      setSelectedMedia(media)
      clearGetDeviceMediaCapAlertInfoAction()
      setLoading(false)
    } else if (deviceMediaCapAlertReducer.error) {
      clearGetDeviceMediaCapAlertInfoAction()
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [deviceMediaCapAlertReducer])

  useEffect(() => {
    if (putDeviceMediaCapAlertReducer.response) {
      clearPutDeviceMediaCapAlertInfoAction()
      showSnackbar(t('Successfully changed'))

      form.resetForm()
      setLoading(false)
    } else if (putDeviceMediaCapAlertReducer.error) {
      clearPutDeviceMediaCapAlertInfoAction()
      showSnackbar(t('Error'))
      setLoading(false)
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

  const openDialog = useCallback(() => {
    setDialog(true)
  }, [setDialog])

  const closeDialog = useCallback(() => {
    setDialog(false)
  }, [setDialog])

  const renderDialog = useMemo(() => {
    if (isFalsy(dialog)) return null
    return (
      <CapAlertMediaLibrary
        open={dialog}
        handleClose={closeDialog}
        deviceId={id}
        selectedMediaId={takeTruth(newSelectedMedia.id, selectedMedia.id)}
        onSuccess={handleSelectMedia}
      />
    )
  }, [
    id,
    dialog,
    closeDialog,
    selectedMedia,
    newSelectedMedia,
    handleSelectMedia
  ])

  const renderLoader = useMemo(() => {
    if (isFalsy(isLoading)) return null
    return <CircularLoader />
  }, [isLoading])

  return (
    <Grid container direction="column">
      {renderLoader}
      <Grid
        container
        alignItems="flex-end"
        justify="space-between"
        className={classes.inputWrapper}
      >
        <FormControlInput
          label={t('Select Media')}
          value={takeTruth(
            newSelectedMedia.title,
            selectedMedia.title,
            t('No media selected')
          )}
          formControlContainerClass={classes.inputContainer}
          marginBottom={false}
          disabled
          customiseDisabled={false}
        />
        <BlueButton className={classes.button} onClick={openDialog}>
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
          marginBottom={false}
          name="password"
          type="password"
          value={form.values.password}
          error={form.errors.password}
          touched={form.touched.password}
          handleChange={form.handleChange}
          handleBlur={form.handleBlur}
          showErrorText={false}
          formControlContainerClass={classes.passwordContainer}
        />
      </Grid>
      <Typography className={classes.ipText}>
        Your IP Address 109.227.80.88 and Current Time 2020-01-26 05:01:52 will
        be recorded.
      </Typography>
      <Grid container justify="flex-end">
        <BlueButton onClick={form.submitForm}>{t('OK')}</BlueButton>
      </Grid>
      {renderDialog}
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
