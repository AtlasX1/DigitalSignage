import React, { useEffect, useState, useCallback, useRef } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { useFormik } from 'formik'
import { compose } from 'redux'
import { get as _get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { translate } from 'react-i18next'
import { Grid, Typography, withStyles } from '@material-ui/core'

import { mediaConstants as constants } from '../../../constants'
import { MediaInfo, MediaTabActions } from '../index'
import SliderInputRange from '../../Form/SliderInputRange'
import { WhiteButton } from '../../Buttons'
import FormControlInput from '../../Form/FormControlInput'
import FormControlSketchColorPicker from '../../Form/FormControlSketchColorPicker'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'

const styles = theme => {
  const { palette, type, formControls, typography } = theme
  return {
    root: {
      margin: '15px 30px'
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
    formControlInput: {
      width: '100%'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: 45
    },
    previewMediaText: {
      ...typography.lightText[type]
    },
    colorPickerLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      width: '105px',
      textAlign: 'right',
      marginRight: '10px'
    },
    colorPickerRootClass: {
      marginBottom: '0px'
    },
    colorPickerHexClass: {
      height: '24px',
      width: '38px'
    },
    formControlInputClass: {
      height: '28px',
      width: '102px',
      fontSize: '0.875rem',
      lineHeight: '14px'
    },
    colorPickerContainer: {
      marginBottom: '16px',
      '&:last-of-type': {
        marginBottom: '0'
      }
    },
    formControlInputWrap: {
      marginBottom: '16px'
    },
    sliderInputContainer: {
      marginBottom: '16px'
    },
    sliderInputLabel: {
      ...formControls.mediaApps.refreshEverySlider.label,
      lineHeight: '15px',
      marginRight: '15px'
    },
    sliderInputClass: {
      width: '46px'
    },
    formControlLabelClass: {
      fontSize: '1.0833rem',
      color: '#74809A'
    },
    error: {
      fontSize: '9px',
      color: 'red'
    },
    tabContent: {
      height: '100%'
    }
  }
}

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Enter field'),
  size: Yup.number().moreThan(100).required('Enter field'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Qr = props => {
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

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.general)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const featureId = useDetermineMediaFeatureId('General', 'QRCode')

  const initialFormValues = useRef({
    content: '',
    size: 0,
    bgColor: 'rgba(228, 233, 243, 1)',
    fillColor: 'rgba(0, 0, 0, 1)',
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
      const { content, size, bgColor, fillColor } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            content,
            size,
            background_color: bgColor,
            fill_color: fillColor
          }
        }
      })

      const actionOptions = {
        mediaName: 'general',
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
        case 'attributes.content':
          formProp = 'content'
          break
        case 'attributes.size':
          formProp = 'size'
          break
        case 'attributes.background_color':
          formProp = 'bgColor'
          break
        case 'attributes.fill_color':
          formProp = 'fillColor'
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
    const { content, size, bgColor, fillColor } = values

    form.setTouched({ content: true, size: true })
    try {
      await validationSchema.validate(
        { content, size },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            content,
            size,
            background_color: bgColor,
            fill_color: fillColor
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
          mediaName: 'general',
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
          mediaName: 'general',
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
        background_color,
        content,
        fill_color,
        size
      } = backendData.attributes

      initialFormValues.current = {
        content,
        size,
        bgColor: background_color,
        fillColor: fill_color,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const { values, errors, touched, submitCount, isValid } = form
  const isButtonsDisable = formSubmitting || (submitCount > 0 && !isValid)
  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container>
              <Grid item xs={12} className={classes.formControlInputWrap}>
                <FormControlInput
                  className={classes.formControlInput}
                  id="text-title"
                  fullWidth={true}
                  label={'Content'}
                  marginBottom={false}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.content}
                  error={errors.content}
                  touched={touched.content}
                  handleChange={e =>
                    form.setFieldValue('content', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} className={classes.sliderInputContainer}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      Size
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      maxValue={500}
                      minValue={0}
                      step={1}
                      label={''}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      value={values.size}
                      error={errors.size}
                      touched={touched.size}
                      onChange={value => form.setFieldValue('size', value)}
                    />
                  </Grid>
                  {errors.size && touched.size && (
                    <Grid item xs={12}>
                      <Typography className={classes.error}>
                        {errors.size}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.colorPickerContainer}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.colorPickerLabel}>
                      Background Color
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      rootClass={classes.colorPickerRootClass}
                      hexColorClass={classes.colorPickerHexClass}
                      formControlInputClass={classes.formControlInputClass}
                      color={values.bgColor}
                      error={errors.bgColor}
                      touched={touched.bgColor}
                      onColorChange={color =>
                        form.setFieldValue('bgColor', color)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.colorPickerContainer}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.colorPickerLabel}>
                      Fill Color
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      rootClass={classes.colorPickerRootClass}
                      hexColorClass={classes.colorPickerHexClass}
                      formControlInputClass={classes.formControlInputClass}
                      color={values.fillColor}
                      error={errors.fillColor}
                      touched={touched.fillColor}
                      onColorChange={color => {
                        form.setFieldValue('fillColor', color)
                      }}
                    />
                  </Grid>
                </Grid>
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
                    Preview Media
                  </Typography>
                </WhiteButton>
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

Qr.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Qr.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Qr)
