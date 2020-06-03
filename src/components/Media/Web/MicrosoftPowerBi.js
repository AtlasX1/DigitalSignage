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
import { FormControlInput } from '../../Form'
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
import SliderInputRange from '../../Form/SliderInputRange'
import { MediaInfo, MediaTabActions } from '../index'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { TabIcon } from '../Gallery/Prezi'

const images = {
  p1: require('../../../common/assets/images/Power_bi1.png'),
  p2: require('../../../common/assets/images/Power_bi2.png'),
  p3: require('../../../common/assets/images/Power_bi3.png'),
  p4: require('../../../common/assets/images/Power_bi4.png')
}

const styles = ({ palette, type, typography }) => ({
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
    width: '60px'
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
  labelClass: {
    fontSize: '17px'
  },
  formControlLabelClass: {
    fontSize: '13px'
  },
  dialog: {
    background: palette[type].dialog.background,
    border: `1px solid ${palette[type].dialog.border}`
  },
  dialogTitle: {
    '& *': {
      color: `${palette[type].dialog.title}`
    }
  },
  dialogText: {
    color: palette[type].dialog.text,
    marginBottom: '12px',
    '&:last-child': {
      marginBottom: 0
    }
  }
})

const validationSchema = Yup.object().shape({
  report_url: Yup.string()
    .url('This field must be a valid URL')
    .required('Enter field'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const MicrosoftPowerBi = props => {
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
  const [showMicrosoftDialog, setMicrosoftDialog] = useState(false)

  const initialFormValues = useRef({
    report_url: '',
    refreshEvery: 300,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      initialFormValues.current = values
      const { report_url, refreshEvery } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            report_url: report_url,
            refresh_every: refreshEvery
          }
        }
      })
      const actionOptions = {
        mediaName: 'web',
        tabName: selectedTab,
        data: requestData
      }

      try {
        await validationSchema.validate(
          { report_url },
          { strict: true, abortEarly: false }
        )
        if (mode === 'add') {
          dispatchAction(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatchAction(editMedia({ ...actionOptions, id: mediaId }))
        }

        setFormSubmitting(true)
      } catch (e) {}
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
        case 'attributes.report_url':
          formProp = 'report_url'
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
    const { report_url, refreshEvery } = values

    form.setTouched({ report_url: true })
    try {
      await validationSchema.validate(
        { report_url },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            report_url,
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
      const { report_url, refresh_every } = backendData.attributes

      initialFormValues.current = {
        report_url: report_url,
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
    const id = getAllowedFeatureId(
      configMediaCategory,
      'Web',
      'MicrosoftPowerBi'
    )
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
            <Grid container alignItems="center">
              <Grid item xs>
                <FormControlInput
                  label="Published Report URL:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.labelClass}
                  value={values.report_url}
                  error={errors.report_url}
                  touched={touched.report_url}
                  handleChange={e =>
                    form.setFieldValue('report_url', e.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <TabIcon
                  mt={22}
                  iconClassName="icon-interface-alert-circle-1"
                  onClick={() => setMicrosoftDialog(true)}
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
                  maxValue={3600}
                  minValue={300}
                  onChange={val => form.setFieldValue('refreshEvery', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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

      <Dialog
        PaperProps={{
          className: classes.dialog
        }}
        open={showMicrosoftDialog}
        onClose={() => setMicrosoftDialog(false)}
        maxWidth={'md'}
      >
        <DialogTitle className={classes.dialogTitle}>
          How to get published URL?
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.dialogText}>
            Login to Microsoft Power Bi Account, Go to:{' '}
            <a href="https://powerbi.microsoft.com/en-us/landing/signin/">
              https://powerbi.microsoft.com/en-us/landing/signin/
            </a>{' '}
            and Open a report in your workspace
          </Typography>
          <Typography className={classes.dialogText}>
            1) Now go to File menu and select Publish to the web option
            <br />
            <img src={images.p1} alt={'p1'} />
          </Typography>
          <Typography className={classes.dialogText}>
            2) Review the dialog content and select Create embed code.
            <br />
            <img src={images.p2} alt={'p2'} />
          </Typography>
          <Typography className={classes.dialogText}>
            3) Review the warning, as shown here, and confirm that the data is
            okay to embed in a public website. If it is, select Publish.
            <br />
            <img src={images.p3} alt={'p3'} />
          </Typography>
          <Typography className={classes.dialogText}>
            4) A dialog appears with a link. You can send this link in an email,
            embed it in code such as an iFrame, or paste it directly into a web
            page or blog.
            <br />
            <img src={images.p3} alt={'p4'} />
          </Typography>
        </DialogContent>
      </Dialog>
    </form>
  )
}

MicrosoftPowerBi.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

MicrosoftPowerBi.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(MicrosoftPowerBi)
