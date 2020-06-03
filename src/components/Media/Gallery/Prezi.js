import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import update from 'immutability-helper'
import { useFormik } from 'formik'
import { compose } from 'redux'
import { get as _get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { translate } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import {
  CircularProgress,
  Dialog,
  Grid,
  Link,
  Typography,
  withStyles
} from '@material-ui/core'

import { mediaConstants as constants } from '../../../constants'
import { MediaInfo, MediaTabActions } from '../index'
import { WhiteButton } from '../../Buttons'
import FormControlInput from '../../Form/FormControlInput'
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
import { CheckboxSwitcher } from '../../Checkboxes'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

const images = {
  idLocation: require('../../../common/assets/images/prezi-id-location.png'),
  presentation1: require('../../../common/assets/images/presentation1.png'),
  presentation2: require('../../../common/assets/images/presentation2.png'),
  presentation3: require('../../../common/assets/images/presentation3.png')
}

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '25px',
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
  previewMediaRow: {
    marginTop: '28px'
  },
  themeInputContainer: {
    margin: '0 0 25px',
    '&.is-error': {
      '& $formInfoText': {
        marginTop: '20px'
      }
    }
  },
  formControlRoot: {
    marginBottom: 0
  },
  inputLabel: {
    fontSize: '17px'
  },
  formLabel: {
    fontSize: '13px',
    color: '#74809A',
    paddingRight: '15px'
  },
  labelLinkClass: {
    borderBottom: '1px dashed #0A83C8',
    '&:hover': {
      cursor: 'pointer',
      borderBottomStyle: 'solid'
    }
  },
  formControlInputNumber: {
    '& .react-numeric-input': {
      width: '100%',
      height: '38px'
    }
  },
  formInfoText: {
    fontStyle: 'italic',
    fontSize: '12px',
    color: '#A7A7A7'
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
  switchBaseClass: {
    height: 'auto'
  },
  formControlInputClass: {
    fontSize: '14px !important'
  },
  formControlNumericInputRootClass: {
    '& > span': {
      height: '38px !important'
    }
  }
})

const useTabIconStyles = makeStyles({
  tabIconWrap: {
    fontSize: '20px',
    lineHeight: '20px',
    padding: '0 13px',
    color: '#0A83C8',
    marginTop: props => (props.mt ? `${props.mt}px` : '0'),
    cursor: props => (props.onClick ? 'pointer' : 'default')
  }
})

export const TabIcon = ({ iconClassName = '', mt, onClick }) => {
  const classes = useTabIconStyles({ mt, onClick })
  return (
    <div className={classes.tabIconWrap} onClick={() => onClick()}>
      <i className={iconClassName} />
    </div>
  )
}

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Enter field'),
  duration: Yup.number().moreThan(4).lessThan(11).required('Enter field'),
  custom: Yup.bool(),
  width: Yup.number().when('custom', {
    is: true,
    then: Yup.number().required('Enter field').moreThan(249).lessThan(801),
    otherwise: Yup.number()
  }),
  height: Yup.number().when('custom', {
    is: true,
    then: Yup.number().required('Enter field').moreThan(249).lessThan(801),
    otherwise: Yup.number()
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Prezi = props => {
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.gallery)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [isShowPreziInfoDialog, setShowPreziInfoDialog] = useState(false)
  const [durationInfoShowDialog, setDurationInfoShowDialog] = useState(false)
  const initialFormValues = useRef({
    id: '',
    duration: 5,
    custom: false,
    width: 250,
    height: 250,
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
      const { id, duration, custom, width, height } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            prezi_id: id,
            duration,
            is_custom: custom,
            height,
            width
          }
        }
      })

      const actionOptions = {
        mediaName: 'gallery',
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
        case 'attributes.duration':
          formProp = 'duration'
          break
        case 'attributes.is_custom':
          formProp = 'custom'
          break
        case 'attributes.prezi_id':
          formProp = 'id'
          break
        case 'attributes.width':
          formProp = 'width'
          break
        case 'attributes.height':
          formProp = 'height'
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
    const { id, duration, custom, width, height } = values

    form.setTouched({ id: true, duration: true, width: true, height: true })
    try {
      await validationSchema.validate(
        { id, duration, width, height },
        { strict: true, abortEarly: false, context: { custom } }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            prezi_id: id,
            duration,
            is_custom: custom,
            height,
            width
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
          mediaName: 'gallery',
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
          mediaName: 'gallery',
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
        prezi_id,
        duration,
        is_custom,
        width,
        height
      } = backendData.attributes
      initialFormValues.current = {
        id: prezi_id,
        duration,
        custom: is_custom,
        width,
        height,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Gallery', 'Prezi')
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

  const { values, errors, touched } = form
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
              <Grid container justify="space-between">
                <Grid item xs={12}>
                  <Grid
                    container
                    alignItems="center"
                    className={classNames(classes.themeInputContainer, {
                      'is-error': form.errors.id && form.touched.id
                    })}
                  >
                    <Grid item xs>
                      <FormControlInput
                        label={'Prezi ID:'}
                        formControlRootClass={classes.formControlRoot}
                        formControlLabelClass={classes.inputLabel}
                        value={values.id}
                        error={errors.id}
                        touched={touched.id}
                        handleChange={e =>
                          form.setFieldValue('id', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TabIcon
                        mt={22}
                        iconClassName="icon-interface-alert-circle-1"
                        onClick={() => setShowPreziInfoDialog(true)}
                      />
                    </Grid>
                    <Grid container>
                      <Typography className={classes.formInfoText}>
                        *presentations must be set to <b>public</b>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={16}>
                <Grid item xs={6} className={classes.themeInputContainer}>
                  <FormControlInput
                    custom
                    withLabel
                    label={'Duration:'}
                    onClickLabel={() => setDurationInfoShowDialog(true)}
                    min={5}
                    max={30}
                    formControlRootClass={classes.formControlRootClass}
                    formControlContainerClass={classes.formControlInputNumber}
                    formControlLabelClass={classes.labelLinkClass}
                    formControlInputClass={classes.formControlInputClass}
                    formControlNumericInputRootClass={
                      classes.formControlNumericInputRootClass
                    }
                    value={values.duration}
                    error={errors.duration}
                    touched={touched.duration}
                    handleChange={val => form.setFieldValue('duration', val)}
                    marginBottom={0}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.themeInputContainer}>
                <CheckboxSwitcher
                  label="Custom:"
                  switchBaseClass={classes.switchBaseClass}
                  formControlRootClass={classes.formControlRootClass}
                  value={values.custom}
                  handleChange={val => form.setFieldValue('custom', val)}
                />
              </Grid>

              {values.custom && (
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <FormControlInput
                      custom
                      withLabel
                      label={'Width:'}
                      min={250}
                      max={800}
                      formControlRootClass={classes.formControlRootClass}
                      formControlContainerClass={classes.formControlInputNumber}
                      value={values.width}
                      error={errors.width}
                      touched={touched.width}
                      handleChange={val => form.setFieldValue('width', val)}
                      marginBottom={0}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlInput
                      custom
                      withLabel
                      label={'Height:'}
                      min={250}
                      max={800}
                      formControlRootClass={classes.formControlRootClass}
                      formControlContainerClass={classes.formControlInputNumber}
                      value={values.height}
                      error={errors.height}
                      touched={touched.height}
                      handleChange={val => form.setFieldValue('height', val)}
                      marginBottom={0}
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

      <Dialog
        open={durationInfoShowDialog}
        classes={{
          paper: classes.dialog
        }}
        maxWidth={false}
        onClose={() => setDurationInfoShowDialog(false)}
      >
        <Grid container direction="column" className={classes.dialogContainer}>
          <Typography className={classes.dialogTitle}>
            What is duration between Presentation steps?
          </Typography>

          <Typography className={classes.dialogText}>
            1) Login to your Prezi account, Go to: https://prezi.com/dashboard/
            and move your cursor to your created prezi presentation and click on
            view prezi
          </Typography>
          <Typography className={classes.dialogText}>
            2) This is your full Prezi Presentation
            <img src={images.presentation1} alt={'presentation1'} />
          </Typography>
          <Typography className={classes.dialogText}>
            3) Here is thefirst step of presentation
            <img src={images.presentation2} alt={'presentation2'} />
          </Typography>
          <Typography className={classes.dialogText}>
            4) Here is the second step of presentation and so on you may have
            more steps in your presentation
            <img src={images.presentation3} alt={'presentation3'} />
          </Typography>
          <Typography className={classes.dialogText}>
            5) Select duration in seconds you want between every steps of
            presentation
          </Typography>
        </Grid>
      </Dialog>
      <Dialog
        open={isShowPreziInfoDialog}
        classes={{
          paper: classes.dialog
        }}
        maxWidth={false}
        onClose={() => setShowPreziInfoDialog(false)}
      >
        <Grid container direction="column" className={classes.dialogContainer}>
          <DialogTitle className={classes.dialogTitle} disableTypography>
            How to get Prezi ID?
          </DialogTitle>
          <DialogContent>
            <Typography className={classes.dialogText}>
              1) Login to your Prezi account at &nbsp;
              <Link href="https://prezi.com/login" target="_blank">
                https://prezi.com/login
              </Link>
            </Typography>
            <Typography className={classes.dialogText}>
              2) Locate the presentation you would like to use and copy ID from
              the URL
            </Typography>
            <Typography className={classes.dialogText}>
              3) Select Your Prezi ID.
              <img src={images.idLocation} alt={'prezi-id-location'} />
            </Typography>
            <Typography className={classes.dialogText}>
              4) Prezi Preview can be slow &nbsp;
              <Link
                href="http://prezibase.com/optimize-prezi-make-it-load-faster"
                target="_blank"
              >
                http://prezibase.com/optimize-prezi-make-it-load-faster
              </Link>
            </Typography>
          </DialogContent>
        </Grid>
      </Dialog>
    </>
  )
}

Prezi.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Prezi.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Prezi)
