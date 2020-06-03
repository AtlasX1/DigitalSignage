import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { translate } from 'react-i18next'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { get as _get } from 'lodash'
import { compose } from 'redux'

import { WhiteButton } from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
import { FormControlInput } from '../../Form'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  getVimeoIdByLink
} from '../../../utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { MediaInfo, MediaTabActions } from '../index'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
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
    checkboxSwitcherLabelClass: {
      fontSize: '13px'
    },
    labelClass: {
      fontSize: '17px'
    },
    formControlInputWrap: {
      marginBottom: '12px'
    },
    tabContent: {
      height: '100%'
    }
  }
}

Yup.addMethod(Yup.string, 'vimeoUrl', function (message) {
  return this.test('isVimeoUrl', message, (url = '') => {
    const vimeoUrl = 'vimeo.com'
    const index = url.indexOf(vimeoUrl) + vimeoUrl.length + 1
    return url.includes(vimeoUrl) && url.substring(index, url.length)
  })
})

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Enter field').vimeoUrl('Incorrect input data'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Vimeo = props => {
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
    id: '',
    mute: false,
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
      const { id, mute } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const vimeoId = getVimeoIdByLink(id)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        muteAudio: { $set: mute ? 1 : 0 },
        attributes: {
          $set: {
            video_id: +vimeoId
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

      // mediaInfo errors
      switch (err.name) {
        case 'title':
          formProp = 'mediaInfo.title'
          break
        case 'group':
          formProp = 'mediaInfo.group'
          break
        case 'attributes.video_id':
          formProp = 'id'
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
    const { id } = values

    form.setTouched({ id: true })
    try {
      await validationSchema.validate(
        { id },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            video_id: getVimeoIdByLink(id)
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
      initialFormValues.current = {
        id: `https://vimeo.com/${backendData.attributes.video_id}`,
        mute: backendData.muteAudio,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Web', 'Vimeo')
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
                  label="Vimeo"
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.labelClass}
                  placeholder={'e.g. https://vimeo.com/136359242'}
                  value={values.id}
                  error={errors.id}
                  touched={touched.id}
                  handleChange={e => form.setFieldValue('id', e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <CheckboxSwitcher
                  label="Mute Audio"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.checkboxSwitcherLabelClass}
                  value={values.mute}
                  handleChange={val => form.setFieldValue('mute', val)}
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

Vimeo.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Vimeo.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Vimeo)
