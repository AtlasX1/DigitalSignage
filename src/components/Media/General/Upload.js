import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as Yup from 'yup'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import { get as _get } from 'lodash'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import {
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  withStyles
} from '@material-ui/core'
import { translate } from 'react-i18next'

import { mediaConstants as constants } from '../../../constants'
import { MediaInfo, MediaTabActions } from '../index'
import FileFromWebUrl from './components/Upload/FileFromWebUrl'
import LocalFilePath from './components/Upload/LocalFilePath'
import FileUpload from './components/Upload/FileUpload'
import Message from '../../Message/Message'
import SliderInputRange from '../../Form/SliderInputRange'
import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  ObjectToFormData
} from '../../../utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { CheckboxSwitcher } from '../../Checkboxes'

const styles = theme => {
  const { palette, type } = theme
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
    header: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
      marginBottom: '15px'
    },
    headerText: {
      lineHeight: '42px',
      color: '#74809a'
    },
    tabToggleButton: {
      paddingLeft: '35px',
      paddingRight: '35px'
    },
    previewMediaBtn: {
      marginTop: '20px',
      padding: '10px 25px 8px',
      border: `solid 1px ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    formControlRootClass: {
      marginBottom: '0'
    },
    formControlLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px',
      paddingRight: '15px'
    },
    numberInput: {
      '& span': {
        width: '76px',
        height: '36px'
      }
    },
    marginTop1: {
      marginTop: '20px'
    },
    inputContainer: {
      padding: '0 8px',
      margin: '0 -8px'
    },
    switchContainerClass: {
      width: '180px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    inputClass: {
      width: '60px'
    },
    sliderRangeContainer: {
      maxWidth: '400px'
    },
    dialog: {
      width: 674,
      background: palette[type].suggestionBox.background
    },
    dialogContainer: {
      width: '100%',
      height: '100%',
      '& img': {
        maxWidth: '100%',
        height: 'auto'
      }
    },
    dialogTitle: {
      fontSize: 22,
      letterSpacing: '-0.02px',
      color: palette[type].suggestionBox.title,
      fontWeight: 'bold'
    },
    dialogSubtitle: {
      fontSize: 14,
      letterSpacing: '-0.02px',
      color: palette[type].suggestionBox.subtitle,
      marginBottom: 26
    },
    dialogText: {
      marginBottom: '12px',
      '&:last-child': {
        marginBottom: 0
      }
    },
    tabContent: {
      height: '100%'
    }
  }
}

const checkOnPdf = files => {
  return files.filter(f => f.type === 'application/pdf').length
}

const validationSchema = mode =>
  Yup.object().shape({
    type: Yup.string(),
    files: Yup.array().when('type', {
      is: val => val === 'upload' && mode !== 'edit',
      then: Yup.array().required('Please, select file'),
      otherwise: Yup.array()
    }),
    webFileUrl: Yup.string().when('type', {
      is: val => val === 'web',
      then: Yup.string().required('Enter field'),
      otherwise: Yup.string()
    }),
    localFileUrl: Yup.string().when('type', {
      is: val => val === 'local',
      then: Yup.string().required('Enter field'),
      otherwise: Yup.string()
    }),
    duration: Yup.string().when('type', {
      is: val => val === 'local',
      then: Yup.string().required('Enter field'),
      otherwise: Yup.string()
    }),
    updateDuration: Yup.object()
      .shape({
        hours: Yup.number(),
        minutes: Yup.number(),
        seconds: Yup.number()
      })
      .nullable(),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

const Upload = props => {
  const {
    t,
    classes,
    mode,
    customClasses,
    selectedTab,
    formData,
    backendData,
    onModalClose,
    onShareStateCallback
  } = props
  const dispatchAction = useDispatch()
  const { configMediaCategory } = useSelector(({ config }) => config)
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.general)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const initialFormState = useRef({ activeTab: 'upload' })

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [activeTab, setActiveTab] = useState(initialFormState.current.activeTab)
  const [isShowDurationInfoDialog, setShowDurationInfoDialog] = useState(false)

  const initialFormValues = useRef({
    type: 'upload',
    files: [],
    sameForAll: false,
    webFileUrl: '',
    localFileUrl: '',
    duration: '00:00:00',
    updateDuration: '00:01:00',
    updateFrequency: '00:01:00',
    pageDuration: 60,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: validationSchema(mode),
    onSubmit: values => {
      initialFormValues.current = values
      const {
        type,
        files,
        pageDuration,
        webFileUrl,
        localFileUrl,
        duration,
        updateDuration,
        sameForAll
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      postData.featureId = featureId

      let uploadType = type
      let uploadFileUrl = webFileUrl
      let uploadUpdateDuration = updateDuration

      let requestData = {}
      if (uploadType === 'upload') {
        requestData = update(postData, {
          attributes: {
            $set: {
              type: 'upload'
            }
          }
        })

        if (_get(files, ['0'])) {
          if (files.length > 1) {
            requestData.file = files
            requestData.attributes.same_for_all = sameForAll
          } else {
            requestData.file = files[0]
          }
        }

        const isPDF = files.find(file => file.type === 'application/pdf')
        if (isPDF) requestData.attributes.page_duration = pageDuration
      } else if (uploadType === 'local') {
        requestData = update(postData, {
          attributes: {
            $set: {
              type: 'local',
              media_file_url: localFileUrl,
              media_file_duration: duration,
              media_update_duration: updateDuration
            }
          }
        })
      } else if (uploadType === 'web') {
        requestData = update(postData, {
          attributes: {
            $set: {
              type: 'web',
              media_file_url: uploadFileUrl,
              media_update_duration: uploadUpdateDuration
            }
          }
        })
      }

      const getData = requestData => {
        let data = requestData
        if (uploadType === 'upload' && requestData.file) {
          data = ObjectToFormData(requestData)
        }
        if (uploadType === 'upload' && mode === 'edit' && requestData.file) {
          data.append('_method', 'PUT')
        }
        return data
      }

      const actionOptions = {
        mediaName: 'general',
        tabName: selectedTab,
        data: getData(requestData)
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        const mediaId = backendData.id
        dispatchAction(
          editMedia({
            ...actionOptions,
            id: mediaId,
            ...(uploadType === 'upload' &&
              requestData.file &&
              mode === 'edit' && { method: 'POST' })
          })
        )
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
        case 'file':
          formProp = 'files'
          break
        case 'attributes.media_file_url':
          const { type } = values
          if (type === 'local') {
            formProp = 'localFileUrl'
          } else if (type === 'web') {
            formProp = 'webFileUrl'
          }
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
    if (!activeTab) return
    form.setFieldValue('type', activeTab)
    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    if (backendData && backendData.id) {
      const {
        attributes: {
          type,
          page_duration,
          media_file_url,
          media_file_duration,
          media_update_duration
        },
        originalName,
        mediaUrl
      } = backendData
      initialFormValues.current = {
        ...form.values,
        mediaUrl,
        duration: media_file_duration,
        updateDuration: media_update_duration,
        pageDuration: page_duration ? page_duration : values.pageDuration,
        originalName,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      if (type === 'local') {
        initialFormState.current.activeTab = 'local'
        initialFormValues.current.localFileUrl = media_file_url
        setActiveTab('local')
        form.setFieldValue('localFileUrl', media_file_url)
      }

      if (type === 'web') {
        initialFormState.current.activeTab = 'web'
        initialFormValues.current.webFileUrl = media_file_url
        setActiveTab('web')
        form.setFieldValue('webFileUrl', media_file_url)
      }

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'General', 'File')
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
  const isEditMode = !!_get(backendData, 'id', false)

  return (
    <>
      <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
        {isLoading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress size={30} thickness={5} />
          </div>
        )}
        <Grid container className={classes.tabContent}>
          <Grid item xs={7}>
            <div className={classes.root}>
              <header className={classes.header}>
                <Typography className={classes.headerText}>
                  {t('Select Media Type')}
                </Typography>
              </header>
              <Grid container justify="center">
                <Grid item>
                  <TabToggleButtonGroup
                    value={activeTab}
                    exclusive
                    onChange={(e, tab) => {
                      setActiveTab(tab)
                    }}
                  >
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value={'upload'}
                    >
                      {t('File Upload')}
                    </TabToggleButton>
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value={'web'}
                    >
                      {t('File from Web URL')}
                    </TabToggleButton>
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value={'local'}
                    >
                      {t('Local File Path')}
                    </TabToggleButton>
                  </TabToggleButtonGroup>
                </Grid>
              </Grid>

              <Grid container className={classes.tabContent}>
                {activeTab === 'web' && (
                  <FileFromWebUrl
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={form.setFieldValue}
                    onShowModal={val => setShowDurationInfoDialog(val)}
                  />
                )}

                {activeTab === 'local' && (
                  <LocalFilePath
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={form.setFieldValue}
                    onShowModal={val => setShowDurationInfoDialog(val)}
                  />
                )}

                {activeTab === 'upload' && (
                  <>
                    <FileUpload
                      multiple={!isEditMode}
                      name="files"
                      files={values.files}
                      error={errors.files}
                      touched={touched.files}
                      noClick={false}
                      onChange={form.handleChange}
                    />
                    {values.files.length > 1 && (
                      <Grid container className={classes.formGroup}>
                        <Grid item>
                          <CheckboxSwitcher
                            label="Same title for all"
                            switchContainerClass={classes.switchContainerClass}
                            formControlLabelClass={
                              classes.formControlLabelClass
                            }
                            value={values.sameForAll}
                            handleChange={val =>
                              form.setFieldValue('sameForAll', val)
                            }
                          />
                        </Grid>
                      </Grid>
                    )}
                    {!!checkOnPdf(values.files) && (
                      <>
                        <Message
                          fill
                          iconClassName={'icon-interface-information-1'}
                          messages={[
                            'NOTE: Page Scroll Duration apply only to pdf file.'
                          ]}
                        />

                        <Grid
                          container
                          className={classes.sliderRangeContainer}
                        >
                          <SliderInputRange
                            step={1}
                            value={values.pageDuration}
                            label={'Page Scroll Duration'}
                            maxValue={3600}
                            minValue={60}
                            onChange={val =>
                              form.setFieldValue('pageDuration', val)
                            }
                            labelAtEnd={false}
                            inputContainerClass={classes.inputContainerClass}
                            inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                          />
                        </Grid>
                      </>
                    )}
                    {values.originalName && (
                      <Typography>Old File: {values.originalName}</Typography>
                    )}
                  </>
                )}
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
                  onReset={() => {
                    form.resetForm(initialFormValues.current)
                    setActiveTab(initialFormState.current.activeTab)
                  }}
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
      <Dialog
        open={isShowDurationInfoDialog}
        classes={{
          paper: classes.dialog
        }}
        maxWidth={false}
        onClose={() => setShowDurationInfoDialog(false)}
      >
        <Grid container direction="column" className={classes.dialogContainer}>
          <DialogTitle className={classes.dialogTitle}>
            Media File Duration
          </DialogTitle>
          <DialogContent>
            <Typography className={classes.dialogText}>
              Media File Duration is required when selecting an audio or video
              file, as the CMS cannot determine the file duration. This duration
              will be used for controlling the length of playback for this file.
              This value can typically be found by right-clicking the file on
              your computer, and choosing "properties".
            </Typography>
          </DialogContent>
        </Grid>
      </Dialog>
    </>
  )
}

Upload.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Upload.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Upload)
