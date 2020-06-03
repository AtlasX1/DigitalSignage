import React, { useState, useEffect, useRef } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import _get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

import { mediaConstants as constants } from '../../../constants'
import { FormControlSelect, FormControlInput } from '../../Form'
import { CheckboxSwitcher } from '../../Checkboxes'
import { MediaInfo, MediaTabActions } from '../../Media'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  getMediaItemsAction
} from 'actions/mediaActions'

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '21px 25px',
    fontFamily: typography.fontFamily
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px',
    marginBottom: '15px'
  },
  formControlRootClass: {
    marginBottom: 0
  },
  themeOptions1: {
    padding: '0 15px',
    margin: '10px 0 14px'
  },
  inputItem: {
    padding: '0 10px',
    margin: '0 -10px'
  },
  lastUpdatedSwitch: {
    margin: '0 auto'
  },
  inputItemContainer: {
    padding: '0 6px',
    margin: '0 -6px'
  },
  marginTop1: {
    marginTop: '18px'
  },
  numberInput: {
    '& span': {
      width: '76px',
      height: '36px'
    }
  },
  formInputLabel: {
    color: '#74809a',
    fontSize: '13px',
    lineHeight: '15px',
    paddingRight: '15px'
  },
  formControlLabelClass: {
    fontSize: '12px',
    color: '#4C5057',
    fontWeight: '700'
  },
  mediaInfoContainer: {
    height: '100%'
  },
  tabContent: {
    height: '100%'
  },
  mediaInfoWrap: {
    borderLeft: 'solid 1px #e4e9f3'
  },
  formWrapper: {
    position: 'relative',
    height: '100%'
  },
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '100px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255,255,255,.5)',
    zIndex: 1
  },
  mediaActionsWrapper: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  formControlInputClass: {
    fontSize: '14px !important',
    padding: '9px 15px !important'
  }
})

const validationSchema = Yup.object().shape({
  device_input: Yup.string().required('Please, select device input'),
  input_type: Yup.string().required('Please, select input type'),
  ratio: Yup.string().required('Please, select ratio'),
  source_width: Yup.number()
    .integer('Enter valid integer')
    .required('Enter width'),
  source_height: Yup.number()
    .integer('Enter valid integer')
    .required('Enter height'),
  audio: Yup.boolean(),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const inputTypeOptions = ['HDMI', 'DVI-D', 'COMPONENT', 'DVI-A'].map(v => ({
  label: v,
  value: v
}))
const ratioOptions = ['16:9', '4:3', '3:2'].map(v => ({ label: v, value: v }))
const deviceInputOptions = [
  '/dev/video0',
  '/dev/video1',
  '/dev/video2'
].map(v => ({ label: v, value: v }))

const VideoInput = ({
  t,
  classes,
  mode,
  selectedTab,
  formData,
  backendData,
  onShowSnackbar,
  onModalClose
}) => {
  const [isLoading, setLoading] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const dispatchAction = useDispatch()
  const {
    configMediaCategory,
    addMediaReducer,
    mediaItemReducer
  } = useSelector(({ config, addMedia, media }) => ({
    configMediaCategory: config.configMediaCategory,
    addMediaReducer: addMedia.premium,
    mediaItemReducer: media.mediaItem
  }))

  const initialFormValues = useRef({
    device_input: deviceInputOptions[0].value,
    input_type: inputTypeOptions[0].value,
    ratio: ratioOptions[0].value,
    source_width: '',
    source_height: '',
    audio: false,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    validateOnBlur: true,
    validationSchema,
    onSubmit: ({ mediaInfo, ...attributes }) => {
      initialFormValues.current = { mediaInfo, ...attributes }
      const data = createMediaPostData(mediaInfo, mode)
      data.featureId = featureId
      data.attributes = attributes

      const actionOptions = {
        mediaName: 'premium',
        tabName: selectedTab,
        data
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        dispatchAction(editMedia({ ...actionOptions, id: backendData.id }))
      }
      setFormSubmitting(true)
    }
  })

  const handleBackendErrors = errors => {
    errors
      .map(({ name, value }) => ({
        name:
          name.split('attributes.')[1] ||
          (name === 'title'
            ? 'mediaInfo.title'
            : name.startsWith('group')
            ? 'mediaInfo.group'
            : name),
        value: value.join(' ')
      }))
      .forEach(({ name, value }) => {
        form.setFieldError(name, value)
      })
  }

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Premium', 'VideoInput')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    const values = _get(formData, 'values')
    if (values) {
      initialFormValues.current = {
        ...form.values,
        ...values
      }
      form.setValues(values)
    }
  }, [form, formData])

  useEffect(() => {
    if (mode === 'edit') {
      setLoading(true)
    }
  }, [mode])

  // Load data for editing
  useEffect(() => {
    if (backendData && backendData.id) {
      initialFormValues.current = {
        ...form.values,
        ...backendData.attributes,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  // Process request result
  useEffect(() => {
    const currentReducer = addMediaReducer[selectedTab]
    if (!formSubmitting || !currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'premium',
          tabName: selectedTab
        })
      )
      dispatchAction(getMediaItemsAction())
      if (autoClose) {
        onModalClose()
        setAutoClose(false)
      }
      setFormSubmitting(false)
    }

    if (error) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
      dispatchAction(
        clearAddedMedia({
          mediaName: 'premium',
          tabName: selectedTab
        })
      )
      onShowSnackbar(error.message)
      setFormSubmitting(false)
    }
    // eslint-disable-next-line
  }, [addMediaReducer])

  // Update media list
  useEffect(() => {
    if (!formSubmitting) return

    const { response, error, status } = mediaItemReducer
    if (response) {
      dispatchAction(getMediaItemsAction())
    }
    if (response || error) {
      setFormSubmitting(false)
    }

    if (status === 'successfully' && autoClose) {
      onModalClose()
      setAutoClose(false)
    }
    // eslint-disable-next-line
  }, [mediaItemReducer])

  const isButtonsDisabled =
    formSubmitting || (form.submitCount > 0 && !form.isValid)
  const changeField = name => value => form.setFieldValue(name, value)

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect
                  id="device_input"
                  label={t('Device Input')}
                  formControlContainerClass={classes.inputItem}
                  marginBottom={false}
                  options={deviceInputOptions}
                  value={form.values.device_input}
                  error={form.errors.device_input}
                  touched={form.touched.device_input}
                  handleChange={form.handleChange}
                />
              </Grid>
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect
                  id="input_type"
                  label={t('Input Type')}
                  formControlContainerClass={classes.inputItem}
                  marginBottom={false}
                  options={inputTypeOptions}
                  value={form.values.input_type}
                  error={form.errors.input_type}
                  touched={form.touched.input_type}
                  handleChange={form.handleChange}
                />
              </Grid>
              <Grid item xs={4} className={classes.inputItemContainer}>
                <FormControlSelect
                  id="ratio"
                  label={t('Ratio')}
                  formControlContainerClass={classes.inputItem}
                  marginBottom={false}
                  options={ratioOptions}
                  value={form.values.ratio}
                  error={form.errors.ratio}
                  touched={form.touched.ratio}
                  handleChange={form.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid
                  container
                  className={classes.themeOptions1}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          {t('Source Width')}
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={classNames(
                            classes.formControlRootClass,
                            classes.numberInput
                          )}
                          formControlInputClass={classes.formControlInputClass}
                          value={form.values.source_width}
                          error={form.errors.source_width}
                          touched={form.touched.source_width}
                          handleChange={changeField('source_width')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          {t('Source Height')}
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={classNames(
                            classes.formControlRootClass,
                            classes.numberInput
                          )}
                          formControlInputClass={classes.formControlInputClass}
                          value={form.values.source_height}
                          error={form.errors.source_height}
                          touched={form.touched.source_height}
                          handleChange={changeField('source_height')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <CheckboxSwitcher
                      label={t('Audio')}
                      formControlRootClass={classes.lastUpdatedSwitch}
                      formControlLabelClass={classes.formControlLabelClass}
                      labelPlacement="end"
                      value={form.values.audio}
                      error={form.errors.audio}
                      touched={form.touched.audio}
                      handleChange={changeField('audio')}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={5} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            justify="space-between"
            className={classes.mediaInfoContainer}
          >
            <Grid item>
              <MediaInfo
                values={form.values.mediaInfo}
                errors={form.errors.mediaInfo}
                touched={form.touched.mediaInfo}
                onControlChange={form.setFieldValue}
                onFormHandleChange={form.handleChange}
              />
            </Grid>
            <Grid item className={classes.mediaActionsWrapper}>
              <MediaTabActions
                mode={mode}
                disabled={isButtonsDisabled}
                onReset={() => form.resetForm(initialFormValues.current)}
                onAdd={form.handleSubmit}
                onAddAndClose={() => {
                  setAutoClose(true)
                  form.handleSubmit()
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

VideoInput.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShowSnackbar: f => f
}
export default translate('translations')(withStyles(styles)(VideoInput))
