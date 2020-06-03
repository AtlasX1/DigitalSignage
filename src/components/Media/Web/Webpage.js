import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { compose } from 'redux'
import * as Yup from 'yup'
import { get as _get } from 'lodash'
import { useFormik } from 'formik'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

import { WhiteButton } from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
import { FormControlInput } from '../../Form'
import SliderInputRange from '../../Form/SliderInputRange'
import { MediaInfo, MediaTabActions } from '../index'

import { mediaConstants as constants } from 'constants/index'
import { completeUrl } from 'utils/urlUtils'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '24px 25px',
      fontFamily: typography.fontFamily
    },
    formWrapper: {
      position: 'relative',
      height: '100%'
    },
    tabContent: {
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
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    formControlRootClass: {
      marginBottom: 0
    },
    switchContainerClass: {
      width: '180px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    inputClass: {
      width: 70,
      height: 38,
      fontSize: 14
    },
    previewMediaRow: {
      marginTop: '42px'
    },
    formGroup: {
      marginTop: '12px'
    },
    sliderInputLabelClass: {
      paddingRight: '15px',
      fontStyle: 'normal'
    },
    sliderInputRootClass: {
      alignItems: 'center'
    },
    labelClass: {
      fontSize: '17px'
    },
    formControlLabelClass: {
      fontSize: '13px'
    }
  }
}

const validationSchema = Yup.object().shape({
  url: Yup.string().url('Please enter valid url').required('Enter field'),
  allowParams: Yup.boolean(),
  params: Yup.string().when('allowParams', {
    is: true,
    then: Yup.string().required('Enter field'),
    otherwise: Yup.string()
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Webpage = props => {
  const {
    t,
    classes,
    mode,
    formData,
    backendData,
    selectedTab,
    customClasses,
    onModalClose,
    onShareStateCallback
  } = props
  const dispatchAction = useDispatch()
  const { configMediaCategory } = useSelector(({ config }) => config)
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.web)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)

  const initialFormValues = useRef({
    url: '',
    allowScroll: false,
    allowParams: false,
    params: '',
    refreshEvery: 900,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: values => {
      initialFormValues.current = values
      const { url, allowScroll, allowParams, params, refreshEvery } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            web_page_url: url,
            allow_scrolling: allowScroll,
            parameters_enabled: allowParams,
            parameters: params,
            refresh_every: refreshEvery
          }
        }
      })
      const actionOptions = {
        mediaName: 'web',
        tabName: selectedTab,
        data: requestData
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        const mediaId = backendData.id
        dispatchAction(editMedia({ ...actionOptions, id: mediaId }))
      }

      setFormSubmitting(true)
    }
  })

  const {
    setFieldValue,
    setFieldTouched,
    values,
    errors,
    touched,
    submitCount,
    isValid
  } = form

  const handleBackendErrors = errors => {
    const formErrors = {
      mediaInfo: {}
    }
    errors.forEach(err => {
      const errorMsg = err.value[0]
      let formProp = null

      switch (err.name) {
        case 'title':
          formProp = 'mediaInfo.title'
          break
        case 'group':
          formProp = 'mediaInfo.group'
          break
        case 'attributes.web_page_url':
          formProp = 'url'
          break
        case 'attributes.allow_scrolling':
          formProp = 'allowScroll'
          break
        case 'attributes.parameters_enabled':
          formProp = 'allowParams'
          break
        case 'attributes.refresh_every':
          formProp = 'refreshEvery'
          break
        default:
          break
      }
      formErrors[formProp] = errorMsg
    })

    Object.keys(formErrors).forEach(key => {
      form.setFieldError(key, formErrors[key])
    })
  }

  const handleShowPreview = async () => {
    const { url, allowScroll, allowParams, params, refreshEvery } = values

    form.setTouched({ url: true, params: true })
    try {
      await validationSchema.validate(
        { url, params },
        { strict: true, abortEarly: false, context: { allowParams } }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            web_page_url: url,
            allow_scrolling: allowScroll,
            parameters_enabled: allowParams,
            parameters: params,
            refresh_every: refreshEvery
          }
        })
      )
    } catch (e) {}
  }

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

  useEffect(() => {
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      props.onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'web',
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
          mediaName: 'web',
          tabName: selectedTab
        })
      )
      props.onShowSnackbar(error.message)
      setFormSubmitting(false)
    }
    // eslint-disable-next-line
  }, [addMediaReducer])

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

  useEffect(() => {
    const values = _get(formData, 'values')
    if (values) {
      initialFormValues.current = {
        ...form.values,
        ...values
      }
      form.setValues(values)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (backendData && backendData.id) {
      const {
        web_page_url,
        allow_scrolling,
        parameters_enabled,
        parameters,
        refresh_every
      } = backendData.attributes

      initialFormValues.current = {
        url: web_page_url,
        allowScroll: allow_scrolling,
        allowParams: parameters_enabled,
        params: parameters || '',
        refreshEvery: refresh_every,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Web', 'WebUrl')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (mode === 'edit') {
      setLoading(true)
    }
  }, [mode])

  const onBlurHandler = useCallback(
    event => {
      const { name, value } = event.target
      setFieldTouched(name, true)
      setFieldValue(name, completeUrl(value), true)
    },
    [setFieldTouched, setFieldValue]
  )

  const isButtonsDisable = formSubmitting || (submitCount > 0 && !isValid)
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
            <Grid container>
              <Grid item xs>
                <FormControlInput
                  name="url"
                  label="Web Page URL"
                  tooltip="Enter a full WebURL accessible via https, example: https://www.wikipedia.com"
                  placeholder="https://example.com"
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.labelClass}
                  value={values.url}
                  error={errors.url}
                  touched={touched.url}
                  handleChange={form.handleChange}
                  handleBlur={onBlurHandler}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.formGroup}>
              <Grid item>
                <CheckboxSwitcher
                  label="Allow Scrolling"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.allowScroll}
                  handleChange={val => form.setFieldValue('allowScroll', val)}
                />
              </Grid>
              <Grid item>
                <CheckboxSwitcher
                  label="Parameterized Post"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.allowParams}
                  handleChange={val => form.setFieldValue('allowParams', val)}
                />
              </Grid>
            </Grid>

            {values.allowParams && (
              <Grid container className={classes.formGroup}>
                <Grid item xs>
                  <FormControlInput
                    label="Parameters"
                    formControlRootClass={classes.formControlRootClass}
                    formControlLabelClass={classes.labelClass}
                    value={values.params}
                    error={errors.params}
                    touched={touched.params}
                    placeholder={'param1=value1&param2=value2&param3=value3'}
                    handleChange={e =>
                      form.setFieldValue('params', e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            )}
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.previewMediaRow}
            >
              <Grid item>
                <WhiteButton className={classes.previewMediaBtn}>
                  <Typography
                    className={classes.previewMediaText}
                    onClick={() => handleShowPreview()}
                  >
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
              <Grid item>
                <SliderInputRange
                  step={1}
                  value={values.refreshEvery}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={21600}
                  minValue={900}
                  onChange={val => form.setFieldValue('refreshEvery', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  rootClass={classes.sliderInputRootClass}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={5} className={customClasses.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            justify="space-between"
            className={customClasses.mediaInfoContainer}
          >
            <Grid item>
              <MediaInfo
                values={values.mediaInfo}
                errors={errors.mediaInfo}
                touched={touched.mediaInfo}
                onControlChange={form.setFieldValue}
                onFormHandleChange={form.handleChange}
              />
            </Grid>
            <Grid container alignItems={'flex-end'}>
              <MediaTabActions
                mode={mode}
                disabled={isButtonsDisable}
                onReset={() => form.resetForm(initialFormValues.current)}
                onAdd={form.handleSubmit}
                onAddAndClose={() => {
                  form.handleSubmit()
                  setAutoClose(true)
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

Webpage.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Webpage.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Webpage)
