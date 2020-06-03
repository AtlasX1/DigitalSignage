import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { get as _get } from 'lodash'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

import { MediaInfo, MediaTabActions } from '../index'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { WhiteButton } from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
import { FormControlInput, SliderInputRange } from '../../Form'

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '24px',
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
    width: '160px'
  },
  inputContainerClass: {
    margin: '0 10px'
  },
  inputClass: {
    width: '46px'
  },
  previewMediaRow: {
    marginTop: '42px'
  },
  sliderInputLabelClass: {
    paddingRight: '15px',
    fontStyle: 'normal'
  },
  checkboxSwitcherLabelClass: {
    fontSize: '13px'
  },
  labelClass: {
    fontSize: '17px'
  },
  formControlInputWrap: {
    marginBottom: '12px'
  }
})

Yup.addMethod(Yup.string, 'googleDocs', function (message) {
  return this.test('isGoogleDocs', message, (url = '') => {
    const urlRegx = new RegExp(
      '(docs.google.com)(://[A-Za-z]+-my.sharepoint.com)?',
      'i'
    )
    return urlRegx.test(url)
  })
})

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .required('Enter field')
    .googleDocs('Incorrect google docs url'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Google = props => {
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
    hideToolbar: false,
    refreshEvery: 60,
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
      const { url, hideToolbar, refreshEvery } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            google_document_url: url,
            refresh_every: refreshEvery,
            hide_toolbar: hideToolbar
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

  const handleBackendErrors = async errors => {
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
        case 'attributes.google_document_url':
          formProp = 'url'
          break
        case 'attributes.hide_toolbar':
          formProp = 'hideToolbar'
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
    const { url, hideToolbar, refreshEvery } = values

    form.setTouched({ url: true })
    try {
      await validationSchema.validate(
        { url },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            google_document_url: url,
            refresh_every: refreshEvery,
            hide_toolbar: hideToolbar
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
    if (backendData && backendData.id) {
      const {
        google_document_url,
        hide_toolbar,
        refresh_every
      } = backendData.attributes

      initialFormValues.current = {
        url: google_document_url,
        hideToolbar: hide_toolbar,
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
    const id = getAllowedFeatureId(configMediaCategory, 'Web', 'GoogleDocs')
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

  const { values, errors, touched, submitCount, isValid } = form
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
            <Grid container className={classes.formControlInputWrap}>
              <Grid item xs>
                <FormControlInput
                  label="Google Document URL:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.labelClass}
                  value={values.url}
                  error={errors.url}
                  touched={touched.url}
                  handleChange={e => form.setFieldValue('url', e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <CheckboxSwitcher
                  label="Hide Toolbar"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.checkboxSwitcherLabelClass}
                  value={values.hideToolbar}
                  handleChange={val => form.setFieldValue('hideToolbar', val)}
                />
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.previewMediaRow}
            >
              <Grid item>
                <WhiteButton
                  className={classes.previewMediaBtn}
                  onClick={() => handleShowPreview()}
                >
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
              <Grid item>
                <SliderInputRange
                  step={1}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={360}
                  minValue={5}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  value={values.refreshEvery}
                  error={errors.refreshEvery}
                  touched={touched.refreshEvery}
                  onChange={value => form.setFieldValue('refreshEvery', value)}
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

Google.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Google.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Google)
