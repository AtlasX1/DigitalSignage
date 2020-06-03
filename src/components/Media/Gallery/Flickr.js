import React, { useCallback, useEffect, useState, useRef } from 'react'

import update from 'immutability-helper'

import { useFormik } from 'formik'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { get as _get } from 'lodash'

import { mediaConstants as constants } from '../../../constants'

import {
  withStyles,
  Grid,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import { MediaInfo, MediaTabActions } from '../index'

import {
  FormControlSelect,
  SliderInputRange,
  FormControlInput
} from '../../Form'

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

const images = {
  user1: require('../../../common/assets/images/flickr_step3.png'),
  user2: require('../../../common/assets/images/flickr_step4.png'),
  album1: require('../../../common/assets/images/flickr_album_step3.png'),
  album2: require('../../../common/assets/images/flickr_album_step4.png')
}

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

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '31px 25px',
    fontFamily: typography.fontFamily
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
    marginTop: '61px'
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
  tabToggleButton: {
    width: '128px'
  },
  tabToggleButtonContainer: {
    justifyContent: 'center',
    background: 'transparent',
    marginTop: '17px'
  },
  locationInput: {
    marginBottom: 0
  },
  sliderContainerClass: {
    alignItems: 'center'
  },
  sliderLabelClass: {
    marginRight: 4
  },
  sliderInputLabel: {
    color: '#74809A',
    fontSize: '13px',
    lineHeight: '15px',
    marginRight: '15px'
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
  marginTop1: {
    marginTop: '30px'
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
  formWrapper: {
    height: '100%'
  },
  tabContent: {
    height: '100%'
  },
  formControlNumericInputRootClass: {
    height: '38px !important',

    '& > span': {
      height: '38px !important'
    }
  },
  formControlInputClass: {
    fontSize: '14px !important'
  }
})

const validationSchema = Yup.object().shape({
  type: Yup.string().required(),
  flickr_user_id: Yup.string().when('type', {
    is: 'user_id',
    then: Yup.string().required('Enter Flickr User Id')
  }),
  album_id: Yup.string().when('type', {
    is: 'album',
    then: Yup.string().required('Enter Flickr Album Id')
  }),
  number_of_images: Yup.number().required().min(1).max(360),
  duration: Yup.number().required().min(5).max(5000),
  refresh_every: Yup.number().required().min(60).max(21600),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const imageTypes = [
  {
    label: 'Small square 75x75',
    value: 's'
  },
  {
    label: 'Large square 15x150',
    value: 'q'
  },
  {
    label: 'Thumbnail, 100 on longest side',
    value: 't'
  },
  {
    label: 'Small, 240 on longest side',
    value: 'm'
  },
  {
    label: 'Small, 320 on longest side',
    value: 'n'
  },
  {
    label: 'Medium 640, 640 on longest side',
    value: 'z'
  },
  {
    label: 'Medium 600, 800 on longest side',
    value: 'c'
  },
  {
    label: 'Original image',
    value: 'o'
  }
]

const Flickr = props => {
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

  const [
    configMediaCategory,
    addMediaReducer,
    mediaItemReducer
  ] = useSelector(state => [
    state.config.configMediaCategory,
    state.addMedia.gallery,
    state.media.mediaItem
  ])

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [showUserIdHelp, setShowUserIdHelp] = useState(false)
  const [showAlbumIdHelp, setShowAlbumIdHelp] = useState(false)

  const transitions = [
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
  ]
  const initialFormValues = useRef({
    type: 'user_id',
    flickr_user_id: '',
    album_id: '',
    image_tags: '',
    transition: 'random',
    image_type: 's',
    number_of_images: 1,
    refresh_every: 60,
    duration: 5,
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
        type,
        flickr_user_id,
        album_id,
        image_tags,
        transition,
        image_type,
        number_of_images,
        refresh_every,
        duration
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            type,
            flickr_user_id,
            album_id,
            image_tags,
            transition,
            image_type,
            number_of_images,
            refresh_every,
            duration
          }
        }
      })

      const actionOptions = {
        mediaName: 'gallery',
        tabName: selectedTab,
        data: requestData
      }

      try {
        await validationSchema.validate(
          {
            type,
            number_of_images,
            refresh_every,
            duration,
            ...(type === 'user_id' && { flickr_user_id }),
            ...(type === 'album' && { album_id })
          },
          { strict: true, abortEarly: false }
        )
        if (mode === 'add') {
          dispatchAction(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatchAction(editMedia({ ...actionOptions, id: mediaId }))
        }
        setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('type', form.values.type)
      }
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
        case 'attributes.flickr_user_id':
          formProp = 'flickr_user_id'
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
    const {
      type,
      flickr_user_id,
      album_id,
      image_tags,
      transition,
      image_type,
      number_of_images,
      refresh_every,
      duration
    } = form.values

    form.setTouched({
      type: true,
      duration: true,
      transition: true,
      image_type: true,
      number_of_images: true,
      ...(type === 'user_id' && { flickr_user_id: true }),
      ...(type === 'album' && { album_id: true })
    })

    try {
      await validationSchema.validate(
        {
          type,
          number_of_images,
          refresh_every,
          duration,
          ...(type === 'user_id' && { flickr_user_id }),
          ...(type === 'album' && { album_id })
        },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            type,
            flickr_user_id,
            album_id,
            image_tags,
            transition,
            image_type,
            number_of_images,
            refresh_every,
            duration
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
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
        type,
        flickr_user_id,
        album_id,
        image_tags,
        transition,
        image_type,
        number_of_images,
        refresh_every,
        duration
      } = backendData.attributes
      initialFormValues.current = {
        ...form.values,
        type,
        image_tags,
        transition,
        image_type,
        number_of_images,
        refresh_every,
        duration,
        ...(flickr_user_id && { flickr_user_id }),
        ...(album_id && { album_id }),
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Gallery', 'Flickr')
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
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <TabToggleButtonGroup
                  className={classes.tabToggleButtonContainer}
                  value={values.type}
                  exclusive
                  onChange={(e, val) => form.setFieldValue('type', val)}
                >
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value={'user_id'}
                  >
                    User ID
                  </TabToggleButton>
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value={'album'}
                  >
                    Album
                  </TabToggleButton>
                </TabToggleButtonGroup>
                <Grid
                  container
                  justify="space-between"
                  className={classes.themeOptions1}
                >
                  {values.type === 'user_id' ? (
                    <>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlInput
                          label={'Flickr User ID'}
                          formControlRootClass={classes.locationInput}
                          formControlLabelClass={classes.infoLabel}
                          placeholder={'User ID'}
                          value={values.flickr_user_id}
                          error={errors.flickr_user_id}
                          touched={touched.flickr_user_id}
                          handleChange={e =>
                            form.setFieldValue('flickr_user_id', e.target.value)
                          }
                          onClickLabel={() => setShowUserIdHelp(true)}
                          labelRightComponent={
                            <TabIcon
                              iconClassName={'icon-interface-information-1'}
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlInput
                          label={'Image Tags'}
                          formControlRootClass={classes.locationInput}
                          formControlLabelClass={classes.inputLabel}
                          placeholder={'Separate with a comma (" , ")'}
                          value={values.image_tags}
                          error={errors.image_tags}
                          touched={touched.image_tags}
                          handleChange={e =>
                            form.setFieldValue('image_tags', e.target.value)
                          }
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={6} className={classes.themeInputContainer}>
                      <FormControlInput
                        label={'Album Id'}
                        formControlRootClass={classes.locationInput}
                        formControlLabelClass={classes.infoLabel}
                        placeholder={'Album Id'}
                        value={values.album_id}
                        error={errors.album_id}
                        touched={touched.album_id}
                        handleChange={e =>
                          form.setFieldValue('album_id', e.target.value)
                        }
                        onClickLabel={() => setShowAlbumIdHelp(true)}
                        labelRightComponent={
                          <TabIcon
                            iconClassName={'icon-interface-information-1'}
                          />
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item xs={6} className={classes.themeInputContainer}>
                <FormControlSelect
                  custom
                  label={'Transition'}
                  formControlLabelClass={classes.inputLabel}
                  marginBottom={false}
                  value={values.transition}
                  error={errors.transition}
                  touched={touched.transition}
                  options={transitions}
                  handleChange={e =>
                    form.setFieldValue('transition', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} className={classes.themeInputContainer}>
                <FormControlSelect
                  custom
                  label={'Image Type'}
                  formControlLabelClass={classes.inputLabel}
                  marginBottom={false}
                  value={values.image_type}
                  error={errors.image_type}
                  touched={touched.image_type}
                  options={imageTypes}
                  handleChange={e =>
                    form.setFieldValue('image_type', e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems={'flex-end'}
              className={classes.marginTop1}
            >
              <Grid item xs={3} className={classes.themeInputContainer}>
                <FormControlInput
                  custom
                  label={'Number of Images'}
                  formControlLabelClass={classes.inputLabel}
                  formControlInputClass={classes.formControlInputClass}
                  formControlNumericInputRootClass={
                    classes.formControlNumericInputRootClass
                  }
                  marginBottom={false}
                  value={values.number_of_images}
                  error={errors.number_of_images}
                  touched={touched.number_of_images}
                  min={1}
                  max={360}
                  handleChange={val =>
                    form.setFieldValue('number_of_images', val)
                  }
                />
              </Grid>
              <Grid item xs={3} className={classes.themeInputContainer}>
                <FormControlInput
                  custom
                  label={'Duration'}
                  formControlLabelClass={classes.inputLabel}
                  formControlInputClass={classes.formControlInputClass}
                  formControlNumericInputRootClass={
                    classes.formControlNumericInputRootClass
                  }
                  marginBottom={false}
                  value={values.duration}
                  error={errors.duration}
                  touched={touched.duration}
                  min={5}
                  max={5000}
                  handleChange={val => form.setFieldValue('duration', val)}
                />
              </Grid>
              <Grid item xs={6}>
                <SliderInputRange
                  label={'Refresh Every'}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  labelAtEnd={false}
                  step={1}
                  value={values.refresh_every}
                  error={errors.refresh_every}
                  touched={touched.refresh_every}
                  maxValue={21600}
                  minValue={60}
                  onChange={val => form.setFieldValue('refresh_every', val)}
                  rootClass={classes.sliderContainerClass}
                  labelClass={classes.sliderLabelClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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
                  onClick={handleShowPreview}
                >
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={5}>
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
        open={showUserIdHelp}
        onClose={() => setShowUserIdHelp(false)}
        maxWidth={'md'}
        PaperProps={{
          className: classes.dialog
        }}
      >
        <DialogTitle className={classes.dialogTitle}>
          How to get Flickr User Id
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.dialogText}>
            1) Go to:{' '}
            <a href="https://www.flickr.com/">https://www.flickr.com/</a>
          </Typography>
          <Typography className={classes.dialogText}>
            2) Sign In or Sign Up with Flickr.
          </Typography>
          <Typography className={classes.dialogText}>
            3)
            <br />
            <img src={images.user1} alt="" />
          </Typography>
          <Typography className={classes.dialogText}>
            4)
            <br />
            <img src={images.user2} alt="" />
          </Typography>
          <Typography className={classes.dialogText}>
            Select Flickr User ID
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAlbumIdHelp}
        onClose={() => setShowAlbumIdHelp(false)}
        maxWidth={'md'}
        PaperProps={{
          className: classes.dialog
        }}
      >
        <DialogTitle className={classes.dialogTitle}>How to get</DialogTitle>
        <DialogContent>
          <Typography className={classes.dialogText}>
            1) Go to:{' '}
            <a href="https://www.flickr.com/">https://www.flickr.com/</a>
          </Typography>
          <Typography className={classes.dialogText}>
            2) Sign In or Sign Up with Flickr.
          </Typography>
          <Typography className={classes.dialogText}>
            3)
            <br />
            <img src={images.album1} alt="" />
          </Typography>
          <Typography className={classes.dialogText}>
            Click on Albums
          </Typography>
          <Typography className={classes.dialogText}>
            4) Click on any album from album list.
          </Typography>
          <Typography className={classes.dialogText}>
            5)
            <br />
            <img src={images.album2} alt="" />
          </Typography>
          <Typography className={classes.dialogText}>
            Select Flickr User Album Name
          </Typography>
        </DialogContent>
      </Dialog>
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Flickr))
