import React, { useState, useEffect, useCallback, useRef } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { WhiteButton } from '../../Buttons'
import { MediaInfo, MediaTabActions } from '../index'

import { useFormik } from 'formik'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import * as Yup from 'yup'
import { get as _get } from 'lodash'

import {
  FormControlInput,
  FormControlSelect,
  SliderInputRange
} from '../../Form'
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
    alignItems: 'flex-start',
    padding: '0 0 16px'
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

const styles = ({ palette, type, formControls, typography }) => ({
  root: {
    margin: '15px 30px'
  },
  tabToggleButtonGroup: {
    marginBottom: 16
  },
  tabToggleButton: {
    width: '128px'
  },
  previewMediaBtn: {
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
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
  featureIconTabContainer: {
    justifyContent: 'center'
  },
  featureIconTab: {
    '&:not(:last-child)': {
      marginRight: '15px'
    }
  },
  formControlInput: {
    width: '100%'
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px',
    marginBottom: 16
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.header.background,
    marginBottom: 16
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px'
  },
  inputLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#74809a',
    transform: 'none !important',
    marginRight: '10px'
  },
  colorPaletteContainer: {
    display: 'flex',
    '&:nth-child(2n+1)': {
      paddingRight: '15px',
      justifyContent: 'flex-end'
    },
    '&:nth-child(2n)': {
      paddingLeft: '15px',
      justifyContent: 'flex-start'
    }
  },
  formControlLabel: {
    fontSize: '12px',
    color: '#74809A',
    marginRight: '19px'
  },
  formControlRootClass: {
    marginBottom: 0
  },
  themeCardBodyContainer: {
    padding: 15
  },
  marginTop1: {
    marginTop: 16
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
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
    lineHeight: '15px',
    marginRight: '15px'
  },
  formControlLabelClass: {
    fontSize: '1.0833rem'
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
  formControlInputClass: {
    fontSize: '14px !important',
    padding: '9px 15px !important'
  },
  inputContainerClass: {
    margin: '0 10px'
  },
  sliderInputRootClass: {
    alignItems: 'center'
  }
})

const validationSchema = Yup.object().shape({
  pinterest_user_name: Yup.string().required('Enter field'),
  board_name: Yup.string().required('Enter field'),
  transition: Yup.string().required('Enter field'),
  number_of_images: Yup.number().min(5).max(500).required('Enter field'),
  duration: Yup.number().min(5).max(300).required('Enter field'),
  refresh_every: Yup.number().min(60).max(21600).required('Enter field'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const transitionOptions = [
  '3D-flip-bottom',
  '3D-flip-left',
  '3D-flip-right',
  '3D-flip-top',
  'carousel-bottom',
  'carousel-left',
  'carousel-right',
  'carousel-top',
  'fade-bottom-top',
  'fade-left-right',
  'fade-right-left',
  'fade-top-bottom',
  'new-fall',
  'no-transition',
  'random',
  'room-to-bottom',
  'room-to-left',
  'room-to-right',
  'room-to-top',
  'scale-down-bottom',
  'scale-down-left',
  'scale-down-right',
  'scale-down-top',
  'scale-down-up',
  'simpleFade'
].map(x => ({ label: x, value: x }))

const Pinterest = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onModalClose,
  onShareStateCallback,
  onShowSnackbar
}) => {
  const dispatchAction = useDispatch()
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.social)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const featureId = useDetermineMediaFeatureId('Social', 'Pinterest')

  const initialFormValues = useRef({
    pinterest_user_name: '',
    board_name: '',
    transition: 'new-fall',
    number_of_images: 5,
    duration: 5,
    refresh_every: 60,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: ({ mediaInfo, ...attributes }) => {
      initialFormValues.current = { mediaInfo, ...attributes }
      const data = createMediaPostData(mediaInfo, mode)
      data.featureId = featureId
      data.attributes = attributes

      const actionOptions = {
        mediaName: 'social',
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

  const handleShowPreview = async () => {
    const { mediaInfo, ...attributes } = form.values

    form.setTouched({
      pinterest_user_name: true,
      board_name: true
    })

    try {
      await validationSchema.validate(attributes, {
        strict: true,
        abortEarly: false
      })
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

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
    const currentReducer = addMediaReducer[selectedTab]
    if (!formSubmitting || !currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'social',
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
          mediaName: 'social',
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

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (backendData && backendData.id) {
      const { attributes } = backendData

      initialFormValues.current = {
        ...form.values,
        ...attributes,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  const isButtonsDisable =
    formSubmitting || (form.submitCount > 0 && !form.isValid)

  const changeField = name => value => form.setFieldValue(name, value)

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="space-between" spacing={16}>
              <Grid item xs={6}>
                <FormControlInput
                  id="pinterest_user_name"
                  label={t('Pinterest User Name')}
                  formControlLabelClass={classes.formControlLabelClass}
                  formControlRootClass={classes.formControlRootClass}
                  value={form.values.pinterest_user_name}
                  error={form.errors.pinterest_user_name}
                  touched={form.touched.pinterest_user_name}
                  handleChange={form.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlInput
                  id="board_name"
                  label={t('Board Name')}
                  formControlLabelClass={classes.formControlLabelClass}
                  formControlRootClass={classes.formControlRootClass}
                  value={form.values.board_name}
                  error={form.errors.board_name}
                  touched={form.touched.board_name}
                  handleChange={form.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid container className={classes.themeCardBodyContainer}>
                  <Grid item xs={7}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          {t('Transition')}
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlSelect
                          id="transition"
                          marginBottom={false}
                          options={transitionOptions}
                          value={form.values.transition}
                          error={form.errors.transition}
                          touched={form.touched.transition}
                          handleChange={form.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          {t('No of Images')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={classNames(
                            classes.formControlRootClass,
                            classes.numberInput
                          )}
                          formControlInputClass={classes.formControlInputClass}
                          min={5}
                          max={500}
                          value={form.values.number_of_images}
                          error={form.errors.number_of_images}
                          touched={form.touched.number_of_images}
                          handleChange={changeField('number_of_images')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={7} />
                  <Grid item xs={5} className={classes.marginTop1}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item className={classes.marginLeft}>
                        <Typography className={classes.formInputLabel}>
                          {t('Duration')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={classNames(
                            classes.formControlRootClass,
                            classes.numberInput
                          )}
                          formControlInputClass={classes.formControlInputClass}
                          min={5}
                          max={300}
                          value={form.values.duration}
                          error={form.errors.duration}
                          touched={form.touched.duration}
                          handleChange={changeField('duration')}
                        />
                      </Grid>
                    </Grid>
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
                  onClick={handleShowPreview}
                >
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
              <Grid item>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      {t('Refresh Every')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={10}
                      value={form.values.refresh_every}
                      error={form.errors.refresh_every}
                      touched={form.touched.refresh_every}
                      label={''}
                      maxValue={21600}
                      minValue={60}
                      inputContainerClass={classes.inputContainerClass}
                      onChange={changeField('refresh_every')}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      rootClass={classes.sliderInputRootClass}
                    />
                  </Grid>
                </Grid>
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
                values={form.values.mediaInfo}
                errors={form.errors.mediaInfo}
                touched={form.touched.mediaInfo}
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

export default translate('translations')(withStyles(styles)(Pinterest))
