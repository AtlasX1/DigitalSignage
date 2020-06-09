import React, { useEffect, useState, useCallback, useRef } from 'react'

import PropTypes from 'prop-types'

import update from 'immutability-helper'
import { get as _get } from 'lodash'

import { useDispatch, useSelector } from 'react-redux'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlTimeDurationPicker } from 'components/Form'
import { FormControlSelect } from 'components/Form'

import FileUpload from './components/Upload/FileUpload'
import { MediaInfo, MediaTabActions } from '../index'

import { mediaConstants as constants } from '../../../constants'

import {
  createMediaPostData,
  getMediaInfoFromBackendData,
  ObjectToFormData
} from 'utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  getMediaItemsAction
} from 'actions/mediaActions'

import { getTransitions } from 'actions/configActions'
import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#0A83C8'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const InfoMessageStyles = ({ typography }) => ({
  infoMessageContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  infoMessage: {
    marginLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        Modern transition effects require up to date device hardware, as well as
        up to date firmware on your device. Legacy transition effects are no
        longer supported.
      </div>
    </div>
  )
)

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '15px 30px'
  },
  chartTypeContainer: {
    paddingBottom: '16px'
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
    marginTop: '52px',
    backgroundImage: palette[type].sideModal.action.button.background,
    borderColor: palette[type].sideModal.action.button.border,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.general.card.border}`,
    backgroundColor: palette[type].pages.media.general.card.background,
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
    backgroundColor: palette[type].pages.media.general.card.header.background,
    textAlign: 'center'
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.general.card.header.color,
    fontSize: '12px',
    fontFamily: typography.fontFamily
  },
  tabToggleButton: {
    width: '128px'
  },
  formControlLabelClass: {
    fontSize: '1.0833rem',
    color: '#74809A'
  }
})

const validationSchema = mode =>
  Yup.object().shape({
    files: Yup.array().when(mode, {
      is: val => val !== 'edit',
      then: Yup.array().required('Please, select file'),
      otherwise: Yup.array()
    }),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

const MS = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onShowSnackbar,
  onModalClose,
  onShareStateCallback
}) => {
  const dispatchAction = useDispatch()
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.general)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const transitionsReducer = useSelector(({ config }) => config.transitions)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [transitionOptions, setTransitionOptions] = useState([])

  const featureId = useDetermineMediaFeatureId('General', 'MSOffice')

  const initialFormValues = useRef({
    mediaInfo: { ...constants.mediaInfoInitvalue },
    files: [],
    transition: 'no-transition',
    duration: '00:00:00'
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: validationSchema(mode),
    onSubmit: async values => {
      initialFormValues.current = values
      const { files, transition, duration } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            transition,
            duration
          }
        }
      })

      if (files.length) {
        requestData.file = files[0]
      }

      const actionOptions = {
        mediaName: 'general',
        tabName: selectedTab,
        data: requestData.file ? ObjectToFormData(requestData) : requestData
      }

      try {
        if (mode === 'add') {
          dispatchAction(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatchAction(editMedia({ ...actionOptions, id: mediaId }))
        }

        setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('label', form.values.label)
      }
    }
  })

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),

    [form.values]
  )

  useEffect(() => {
    if (transitionsReducer.response) {
      setTransitionOptions(
        transitionsReducer.response.map(i => ({
          id: i.id,
          value: i.code,
          label: i.name
        }))
      )
    }
  }, [transitionsReducer])

  const handleBackendErrors = errors => {
    const formErrors = {
      mediaInfo: {}
    }
    errors.forEach(err => {
      const errorMsg = err.value[0]
      let formProp = null

      switch (err.name) {
        case 'mediaInfo.title':
          formProp = 'mediaInfo.title'
          break
        case 'mediaInfo.group':
          formProp = 'mediaInfo.group'
          break
        case 'file':
          formProp = 'files'
          break
        case 'attributes.label':
          formProp = 'label'
          break
        case 'attributes.duration':
          formProp = 'duration'
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

  useEffect(() => {
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer

    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

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
      onShowSnackbar(error.message)
      setFormSubmitting(false)
    }
    // eslint-disable-next-line
  }, [addMediaReducer])

  useEffect(() => {
    if (!formSubmitting) return

    const { response, error, status } = mediaItemReducer
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
    if (!transitionsReducer.response.length) {
      dispatchAction(getTransitions())
    }

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
        attributes: { transition, duration }
      } = backendData
      initialFormValues.current = {
        ...form.values,
        transition,
        duration,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const { values, errors, touched } = form

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <FileUpload
              multiple={false}
              name="files"
              files={values.files}
              error={errors.files}
              touched={touched.files}
              noClick={false}
              dropZoneText={t('Drop MS Office files')}
              onChange={form.handleChange}
            />

            <Grid
              container
              justify="center"
              className={classes.chartTypeContainer}
            >
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography className={classes.themeHeaderText}>
                    This widget will convert MS Office files into a format
                    compatible with Digital Signage
                  </Typography>
                </header>
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item xs={6} style={{ padding: '0 8px' }}>
                <FormControlSelect
                  formControlLabelClass={classes.formControlLabelClass}
                  label={'Transition'}
                  custom
                  value={values.transition}
                  error={errors.transition}
                  touched={touched.transition}
                  handleChange={e =>
                    form.setFieldValue('transition', e.target.value)
                  }
                  options={transitionOptions}
                  marginBottom={false}
                />
              </Grid>
              <Grid item xs={6} style={{ padding: '0 8px' }}>
                <FormControlTimeDurationPicker
                  value={values.duration}
                  onChange={val => form.setFieldValue('duration', val)}
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
                disabled={formSubmitting}
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

MS.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

MS.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(MS))
