import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { translate } from 'react-i18next'
import { mediaConstants as constants } from '../../../constants'
import update from 'immutability-helper'
import {
  withStyles,
  Grid,
  Typography,
  Tooltip,
  CircularProgress
} from '@material-ui/core'
import { get as _get } from 'lodash'

import { MediaInfo, MediaTabActions } from '..'
import {
  FormControlInput,
  SliderInputRange,
  FormControlSelect
} from 'components/Form'
import {
  TabToggleButtonGroup,
  TabToggleButton,
  WhiteButton
} from 'components/Buttons'
import { useFormik } from 'formik'

import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import { useSelector, useDispatch } from 'react-redux'
import * as Yup from 'yup'
import {
  generateMediaPreview,
  editMedia,
  addMedia,
  getMediaItemsAction,
  clearAddedMedia
} from 'actions/mediaActions'

const styles = ({ palette, type, formControls }) => ({
  root: {
    margin: '31px 25px'
  },
  tabToggleButtonGroup: {
    marginBottom: '19px'
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
    marginTop: '44px'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  featureIconTabContainer: {
    justifyContent: 'center'
  },
  featureIconTab: {
    '&:not(:last-child)': {
      marginRight: '15px'
    }
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px',
    marginBottom: '22px'
  },
  themeOptions1: {
    padding: '0 15px',
    margin: '25px 0 20px'
  },
  themeInputContainer: {
    padding: '0 7px',
    margin: '0 -7px'
  },
  tabToggleButtonContainer: {
    justifyContent: 'center',
    background: 'transparent',
    marginTop: '17px'
  },
  formControlInput: {
    width: '100%'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.header.background
  },
  themeHeader1: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    marginBottom: '15px'
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px'
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
  palettePickerContainer: {
    marginBottom: '9px'
  },
  marginTop1: {
    marginTop: '22px'
  },
  urlInputContainer: {
    padding: '0 15px'
  },
  labelClass: {
    fontSize: '17px'
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
  checkboxSwitcherLabelClass: {
    fontSize: '13px'
  },
  formControlInputWrap: {
    marginBottom: '12px'
  },
  tabContent: {
    height: '100%'
  },
  locationInput: {
    marginBottom: 0
  },
  sliderContainerClass: {
    alignItems: 'center'
  },
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
    marginRight: 0
  },
  inputLabel: {
    fontSize: '17px'
  },
  infoLabel: {
    fontSize: '17px',
    borderBottom: '1px dashed #0A83C8',
    '&:hover': {
      cursor: 'pointer',
      borderBottomStyle: 'solid'
    }
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
  },
  formControlNumericInputRootClass: {
    height: '38px !important',

    '& > span': {
      height: '38px !important'
    }
  },
  formControlInputClass: {
    ...formControls.mediaApps.numericInput.input
  },
  formControlContainerClass: {
    width: '48%'
  }
})

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
    padding: '0 5px 15px'
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

const Smugmug = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onModalClose,
  onShareStateCallback,
  ...props
}) => {
  const transitions = useMemo(
    () => [
      { label: t('No Transition'), value: 'random' },
      { label: t('Random'), value: 'no-transition' },
      { label: t('Fall'), value: 'new-fall' },
      { label: t('Room to Left'), value: 'room-to-left' },
      { label: t('Room to Right'), value: 'room-to-right' },
      { label: t('Room to Top'), value: 'room-to-top' },
      { label: t('Room to Bottom'), value: 'room-to-bottom' },
      { label: t('Slide Left'), value: 'fade-left-right' },
      { label: t('Slide Right'), value: 'fade-right-left' },
      { label: t('Slide Top'), value: 'fade-top-bottom' },
      { label: t('Slide Bottom'), value: 'fade-bottom-top' },
      { label: t('Scale Down/From Right'), value: 'scale-down-right' },
      { label: t('Scale Down/From Left'), value: 'scale-down-left' },
      { label: t('Scale Down/From Bottom'), value: 'scale-down-bottom' },
      { label: t('Scale Down/From Top'), value: 'scale-down-top' },
      { label: t('Scale Down/Scale Up'), value: 'scale-down-up' },
      { label: t('Flip Right'), value: '3D-flip-right' },
      { label: t('Flip Left'), value: '3D-flip-left' },
      { label: t('Flip Top'), value: '3D-flip-top' },
      { label: t('Flip Bottom'), value: '3D-flip-bottom' },
      { label: t('Carousel Left'), value: 'carousel-left' },
      { label: t('Carousel Right'), value: 'carousel-right' },
      { label: t('Carousel Top'), value: 'carousel-top' },
      { label: t('Carousel Bottom'), value: 'carousel-bottom' },
      { label: t('Fade'), value: 'simpleFade' }
    ],
    [t]
  )

  const [featureId, setFeatureId] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.gallery)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const dispatch = useDispatch()
  const generatePreview = useCallback(
    payload => {
      dispatch(generateMediaPreview(payload))
    },
    [dispatch]
  )
  const addMediaItem = useCallback(
    payload => {
      dispatch(addMedia(payload))
    },
    [dispatch]
  )
  const editMediaItem = useCallback(
    payload => {
      dispatch(editMedia(payload))
    },
    [dispatch]
  )

  const validationSchema = Yup.object().shape({
    type: Yup.string().required(),
    user_name: Yup.string().required('Enter Smugmug User Name'),
    album_name: Yup.string()
      .when('type', {
        is: 'album',
        then: Yup.string().required('Enter Smugmug Album')
      })
      .when('type', {
        is: 'folder',
        then: Yup.string().required('Enter Smugmug Album')
      }),
    number_of_images: Yup.number()

      .min(10)
      .max(100),
    duration: Yup.number()

      .min(5)
      .max(86400),
    refresh_every: Yup.number()

      .min(5)
      .max(360),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

  const initialFormValues = useRef({
    type: 'user',
    user_name: '',
    album_name: '',
    transition: '3D-flip-top',
    number_of_images: 10,
    duration: 5,
    refresh_every: 360,
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
      const {
        mediaInfo,
        type,
        user_name,
        album_name,
        transition,
        number_of_images,
        duration,
        refresh_every
      } = values
      const postData = createMediaPostData(mediaInfo, mode)
      const requestData = update(postData, {
        title: { $set: mediaInfo.title },
        featureId: { $set: featureId },
        attributes: {
          $set: {
            type: type,
            user_name: user_name,
            transition: transition,
            number_of_images: number_of_images,
            duration: duration,
            refresh_every: refresh_every
          }
        }
      })

      if (type === 'album' || type === 'folder') {
        requestData.attributes['album_name'] = album_name
      }

      const actionOptions = {
        mediaName: 'gallery',
        tabName: selectedTab,
        data: requestData
      }

      try {
        await validationSchema.validate(
          {
            type,
            user_name,
            refresh_every,
            number_of_images,
            transition,
            duration,
            ...((type === 'album' || type === 'folder') && { album_name })
          },
          { strict: true, abortEarly: false }
        )
        if (mode === 'add') {
          addMediaItem(actionOptions)
        } else {
          const mediaId = backendData.id
          editMediaItem({ ...actionOptions, id: mediaId })
        }
        setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('type', form.values.type)
      }
    }
  })

  useEffect(() => {
    if (!formSubmitting) return

    const { response, error, status } = mediaItemReducer
    if (response) {
      dispatch(getMediaItemsAction())
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
        case 'attributes.user_name':
          formProp = 'user_name'
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
      props.onShowSnackbar(t('Successfully added'))

      dispatch(
        clearAddedMedia({
          mediaName: 'gallery',
          tabName: selectedTab
        })
      )
      dispatch(getMediaItemsAction())
      if (autoClose) {
        onModalClose()
        setAutoClose(false)
      }
      setFormSubmitting(false)
    }

    if (error) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
      dispatch(
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
    if (backendData && backendData.id) {
      initialFormValues.current = {
        type: backendData.type,
        duration: backendData.duration,
        user_name: backendData.user_name,
        transition: backendData.transition,
        refresh_every: backendData.refresh_every,
        number_of_images: backendData.number_of_images,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  const { configMediaCategory } = useSelector(({ config }) => config)
  useEffect(() => {
    if (configMediaCategory.response.length) {
      setFeatureId(
        getAllowedFeatureId(configMediaCategory, 'Gallery', 'Smugmug')
      )
    }
  }, [configMediaCategory])

  const handleShowPreview = async () => {
    const {
      type,
      user_name,
      album_name,
      refresh_every,
      number_of_images,
      transition,
      duration
    } = form.values

    form.setTouched({
      user_name: true,
      refresh_every: true,
      number_of_images: true,
      duration: true,
      transition: true,
      ...((type === 'album' || type === 'folder') && { album_name: true })
    })

    try {
      await validationSchema.validate(
        {
          type,
          user_name,
          refresh_every,
          number_of_images,
          transition,
          duration,
          ...((type === 'album' || type === 'folder') && { album_name })
        },
        { strict: true, abortEarly: false }
      )
      const attributess = {
        type: type,
        user_name: user_name,
        refresh_every: refresh_every,
        number_of_images: number_of_images,
        transition: transition,
        duration: duration
      }

      if (type === 'album' || type === 'folder') {
        attributess['album_name'] = album_name
      }

      generatePreview({
        featureId: featureId,
        attributes: attributess
      })
    } catch (e) {
      console.error(e)
    }
  }

  const disableSubmission =
    formSubmitting || (form.submitCount > 0 && !form.isValid)
  return (
    <Grid
      container
      component="form"
      className={classes.formWrapper}
      onSubmit={form.handleSubmit}
    >
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid item xs={7} className={classes.tabContent}>
        <div className={classes.root}>
          <InfoMessage iconClassName={'icon-interface-information-1'} />
          <Grid container justify="center">
            <Grid item xs={12} className={classes.themeCardWrap}>
              <TabToggleButtonGroup
                className={classes.tabToggleButtonContainer}
                value={form.values.type}
                exclusive
                onChange={(_, value) => form.setFieldValue('type', value)}
              >
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={'user'}
                >
                  User Name
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={'album'}
                >
                  Album
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={'folder'}
                >
                  Folder
                </TabToggleButton>
              </TabToggleButtonGroup>
              <Grid
                container
                justify="space-between"
                className={classes.themeOptions1}
              >
                <FormControlInput
                  label={t('User Name')}
                  placeholder={'User Name'}
                  value={form.values.user_name}
                  error={form.errors.user_name}
                  touched={form.touched.user_name}
                  handleChange={event =>
                    form.setFieldValue('user_name', event.target.value)
                  }
                  formControlContainerClass={classes.formControlContainerClass}
                />
                {form.values.type === 'album' && (
                  <FormControlInput
                    label={t('Album')}
                    placeholder={'Album Name'}
                    value={form.values.album_name}
                    error={form.errors.album_name}
                    touched={form.touched.album_name}
                    handleChange={event =>
                      form.setFieldValue('album_name', event.target.value)
                    }
                    formControlContainerClass={
                      classes.formControlContainerClass
                    }
                  />
                )}
                {form.values.type === 'folder' && (
                  <FormControlInput
                    label={t('Folder')}
                    placeholder={'Folder Name'}
                    value={form.values.album_name}
                    error={form.errors.album_name}
                    touched={form.touched.album_name}
                    handleChange={event =>
                      form.setFieldValue('album_name', event.target.value)
                    }
                    formControlContainerClass={
                      classes.formControlContainerClass
                    }
                  />
                )}
              </Grid>
            </Grid>

            <Grid container justify="space-between">
              <Grid item xs={6} className={classes.themeInputContainer}>
                <FormControlSelect
                  custom
                  label={t('Transition')}
                  formControlLabelClass={classes.inputLabel}
                  marginBottom={false}
                  value={form.values.transition}
                  error={form.errors.transition}
                  touched={form.touched.transition}
                  options={transitions}
                  handleChange={event =>
                    form.setFieldValue('transition', event.target.value)
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems="flex-end"
              className={classes.marginTop1}
            >
              <Grid item xs={3} className={classes.themeInputContainer}>
                <FormControlInput
                  custom
                  label={t('Duration')}
                  formControlLabelClass={classes.inputLabel}
                  formControlInputClass={classes.formControlInputClass}
                  formControlNumericInputRootClass={
                    classes.formControlNumericInputRootClass
                  }
                  marginBottom={false}
                  value={form.values.duration}
                  error={form.errors.duration}
                  touched={form.touched.duration}
                  min={5}
                  max={86400}
                  handleChange={value => form.setFieldValue('duration', value)}
                />
              </Grid>

              <Grid item xs={3} className={classes.themeInputContainer}>
                <FormControlInput
                  custom
                  label={t('Number of Images')}
                  formControlLabelClass={classes.inputLabel}
                  formControlInputClass={classes.formControlInputClass}
                  formControlNumericInputRootClass={
                    classes.formControlNumericInputRootClass
                  }
                  marginBottom={false}
                  value={form.values.number_of_images}
                  error={form.errors.number_of_images}
                  touched={form.touched.number_of_images}
                  min={10}
                  max={100}
                  handleChange={value =>
                    form.setFieldValue('number_of_images', value)
                  }
                />
              </Grid>
              <Grid item xs={6} className={classes.themeInputContainer}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Tooltip
                      title={
                        'Frequency of content refresh during playback (in minutes)'
                      }
                      placement="top"
                    >
                      <Typography className={classes.sliderInputLabel}>
                        {t('Refresh Every')}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      value={form.values.refresh_every}
                      error={form.errors.refresh_every}
                      touched={form.touched.refresh_every}
                      label={''}
                      maxValue={360}
                      minValue={5}
                      onChange={value =>
                        form.setFieldValue('refresh_every', value)
                      }
                      numberWraperStyles={{ width: 55 }}
                      rootClass={classes.sliderContainerClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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
              <Grid item xs={6}>
                <WhiteButton
                  className={classes.previewMediaBtn}
                  onClick={handleShowPreview}
                >
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
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
              disabled={disableSubmission}
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
  )
}

export default translate('translations')(withStyles(styles)(Smugmug))
