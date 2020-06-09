import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import update from 'immutability-helper'

import selectUtils from '../../../utils/select'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { get as _get } from 'lodash'

import { mediaConstants as constants } from '../../../constants'

import { WhiteButton } from '../../Buttons'
import { FormControlSelect, SliderInputRange } from '../../Form'
import FormControlInput from '../../Form/FormControlInput'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { MediaInfo, MediaTabActions } from '../index'
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
    paddingBottom: 16
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

const styles = ({ palette, type, typography, formControls }) => ({
  root: {
    margin: '15px 30px',
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
    ...typography.lightText[type]
  },
  previewMediaRow: {
    marginTop: 45
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px'
  },
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
    lineHeight: '15px',
    marginRight: '15px'
  },
  marginTop1: {
    marginTop: 16
  },
  numberControls: {
    display: 'inline-block',
    width: '50%'
  },
  formWrapper: {
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
  formControlNumericInputRootClass: {
    ...formControls.mediaApps.numericInput.root
  },
  formControlInputClass: {
    ...formControls.mediaApps.numericInput.input
  },
  formControlInputLabel: {
    ...formControls.mediaApps.label
  },
  inputClass: {
    ...formControls.input,
    width: 60,
    paddingRight: 0
  },
  inputRootClass: {
    alignItems: 'center'
  }
})

const options = {
  provider: ['pixabay', 'pexels'],
  feature: ['popular', 'latest'],
  image_type: ['all', 'photo', 'illustration'],
  transition: [
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
  ],
  category: {
    pixabay: [
      'All',
      'fashion',
      'nature',
      'backgrounds',
      'science',
      'education',
      'people',
      'feelings',
      'religion',
      'health',
      'places',
      'animals',
      'industry',
      'food',
      'computer',
      'sports',
      'transportation',
      'travel',
      'buildings',
      'business',
      'music'
    ],
    pexels: [
      'flowers',
      'cooking',
      'happy',
      'people',
      'vacation',
      'sunset',
      'books',
      'wall',
      'finance',
      'blur',
      'computer',
      'photography',
      'portrait',
      'writing',
      'construction',
      'businessman',
      'interior',
      'tree',
      'abstract',
      'gift',
      'sea',
      'sport',
      'summer',
      'room',
      'universe',
      'mountains',
      'job',
      'person',
      'industry',
      'tools',
      'desktop wallpaper',
      'black-and-white',
      'communication',
      'phone',
      'mockup',
      'family',
      'map',
      'music',
      'fire',
      'laptop',
      'apple',
      'kitchen',
      'coffee',
      'running',
      'gym',
      'crowd',
      'website',
      'medical',
      'architecture',
      'marketing',
      'light',
      'house',
      'city',
      'animals',
      'car',
      'adventure',
      'HD wallpaper',
      'texture',
      'iphone',
      'new york',
      'building',
      'africa',
      'healthy',
      'winter',
      'school',
      'paint',
      'data',
      'team',
      'vintage',
      'river',
      'fun',
      'time',
      'fashion',
      'nature wallpaper',
      'notebook',
      'trees',
      'office',
      'food',
      'clouds',
      'road',
      'home',
      'forest',
      'wood',
      'group',
      'security',
      'night',
      'technology',
      'fitness',
      'street',
      'holiday',
      'paper',
      'clothes',
      'stars',
      'garden',
      'creative',
      'relax',
      'sky',
      'party',
      'space',
      'success',
      'earth',
      'art',
      'desert',
      'study',
      'desk',
      'work',
      'beauty',
      'yoga',
      'plane',
      'design',
      'face',
      'idea',
      'working',
      'student',
      'nature',
      'sun',
      'rain',
      'travel',
      'reading',
      'landscape',
      'water',
      'business',
      'grass',
      'money',
      'meeting',
      'training',
      'mobile',
      'internet',
      'camera',
      'social media',
      'green',
      'beach',
      'smartphone'
    ]
  }
}

const useSelectOptions = array =>
  useMemo(() => array.map(selectUtils.nameToChipObj), [array])

const validationSchema = Yup.object().shape({
  provider: Yup.string().test(
    'is-provider',
    'Select value from options',
    value => options.provider.includes(value)
  ),
  feature: Yup.string().when('provider', {
    is: 'pixabay',
    then: Yup.string().test('is-feature', 'Select value from options', value =>
      options.feature.includes(value)
    )
  }),
  category: Yup.object().shape({
    pixabay: Yup.string().when('provider', {
      is: 'pixabay',
      then: Yup.string().test(
        'is-pexels-category',
        'Select value from options',
        value => options.category.pexels.includes(value)
      )
    }),
    pexels: Yup.string().when('provider', {
      is: 'pixabay',
      then: Yup.string().test(
        'is-pexels-category',
        'Select value from options',
        value => options.category.pexels.includes(value)
      )
    })
  }),
  transition: Yup.string().test(
    'is-transition',
    'Select value from options',
    value => options.transition.includes(value)
  ),
  number_of_images: Yup.number().required().min(5).max(100),
  duration: Yup.number().required().min(5).max(5000),
  image_type: Yup.string().when('provider', {
    is: 'pixabay',
    then: Yup.string().test(
      'is-image-type',
      'Select value from options',
      value => options.image_type.includes(value)
    )
  }),
  refresh_every: Yup.number().required().min(60).max(21600),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const formToattributessTransformer = values =>
  update(values, {
    $unset:
      values.provider === options.provider[0] ? [] : ['feature', 'image_type'],
    category: {
      $set: values.category[values.provider]
    }
  })

const StockPhotos = ({
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.gallery)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const featureId = useDetermineMediaFeatureId('Gallery', 'StockPhotos')

  const initialFormValues = useRef({
    provider: options.provider[0],
    feature: options.feature[0],
    category: {
      pixabay: options.category.pixabay[0],
      pexels: options.category.pexels[0]
    },
    transition: 'random',
    number_of_images: 5,
    duration: 5,
    image_type: options.image_type[0],
    refresh_every: 60,
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async ({ mediaInfo, ...values }) => {
      initialFormValues.current = { mediaInfo, ...values }
      const data = createMediaPostData(mediaInfo, mode)
      data.featureId = featureId
      data.attributes = formToattributessTransformer(values)

      const actionOptions = {
        mediaName: 'gallery',
        tabName: selectedTab,
        data: data
      }
      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        dispatchAction(editMedia({ ...actionOptions, id: backendData.id }))
      }
      setFormSubmitting(true)
    }
  })

  const handleBackendErrors = errors => {
    const formErrors = errors
      .map(({ name, value }) => ({
        name:
          name === 'title'
            ? 'mediaInfo.title'
            : name.startsWith('group')
            ? 'mediaInfo.group'
            : name.split('attributes.')[1] || name,
        value:
          name === 'attributes.category'
            ? { [form.values.provider]: value.join(' ') }
            : value.join(' ')
      }))
      .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})

    form.setErrors(formErrors)
  }

  const handleShowPreview = async () => {
    const { mediaInfo, ...attributes } = form.values

    try {
      await validationSchema.validate(attributes, {
        strict: true,
        abortEarly: false
      })
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: formToattributessTransformer(attributes)
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
    const currentReducer = addMediaReducer[selectedTab]

    if (!formSubmitting || !currentReducer) return

    const { response, error } = currentReducer

    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

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
      const errors = _get(error, 'errors', [])
      handleBackendErrors(errors)
      dispatchAction(
        clearAddedMedia({
          mediaName: 'gallery',
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
    if (error) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
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
      initialFormValues.current = {
        ...form.values,
        ...update(backendData.attributes, {
          category: {
            $set: {
              pixabay:
                backendData.attributes.provider === 'pixabay'
                  ? backendData.attributes.category
                  : options.category.pixabay[0],
              pexels:
                backendData.attributes.provider === 'pexels'
                  ? backendData.attributes.category
                  : options.category.pexels[0]
            }
          }
        }),
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const setFieldValue = field => val => form.setFieldValue(field, val)

  const providerOptions = useSelectOptions(options.provider)
  const featureOptions = useSelectOptions(options.feature)
  const categoryOptions = {
    pixabay: useSelectOptions(options.category.pixabay),
    pexels: useSelectOptions(options.category.pexels)
  }
  const transitionOptions = useSelectOptions(options.transition)
  const imageTypeOptions = useSelectOptions(options.image_type)

  const isButtonsDisable =
    formSubmitting || (form.submitCount > 0 && !form.isValid)

  const isPixabayProvider = form.values.provider === options.provider[0]

  const renderTransitionField = (props = {}) => (
    <FormControlSelect
      id="transition"
      addEmptyOption={false}
      label={t('Transition')}
      marginBottom={false}
      options={transitionOptions}
      value={form.values.transition}
      error={form.errors.transition}
      touched={form.touched.transition}
      handleChange={form.handleChange}
      {...props}
    />
  )

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={16}
            >
              <Grid item xs={4}>
                <FormControlSelect
                  name="provider"
                  addEmptyOption={false}
                  label={t('Provider')}
                  marginBottom={false}
                  options={providerOptions}
                  value={form.values.provider}
                  error={form.errors.provider}
                  touched={form.touched.provider}
                  handleChange={form.handleChange}
                />
              </Grid>
              {isPixabayProvider && (
                <Grid item xs={4}>
                  <FormControlSelect
                    name="feature"
                    addEmptyOption={false}
                    label={t('Feature')}
                    marginBottom={false}
                    options={featureOptions}
                    value={form.values.feature}
                    error={form.errors.feature}
                    touched={form.touched.feature}
                    handleChange={form.handleChange}
                  />
                </Grid>
              )}
              <Grid item xs={4}>
                <FormControlSelect
                  key={form.values.provider}
                  name={`category.${form.values.provider}`}
                  addEmptyOption={false}
                  label={t('Category')}
                  marginBottom={false}
                  options={categoryOptions[form.values.provider]}
                  value={_get(form.values.category, form.values.provider, null)}
                  error={_get(form.errors.category, form.values.provider, null)}
                  touched={_get(
                    form.touched.category,
                    form.values.provider,
                    null
                  )}
                  handleChange={form.handleChange}
                />
              </Grid>
              {!isPixabayProvider && (
                <Grid item xs={4}>
                  {renderTransitionField()}
                </Grid>
              )}
              <Grid item xs={12}>
                <div className={classes.themeCardWrap}>
                  <MediaHtmlCarousel />
                </div>
              </Grid>
              {isPixabayProvider && (
                <Grid item xs={6}>
                  {renderTransitionField()}
                </Grid>
              )}
              {isPixabayProvider && (
                <Grid item xs={6}>
                  <FormControlSelect
                    name="image_type"
                    addEmptyOption={false}
                    label={t('Image Type')}
                    marginBottom={false}
                    options={imageTypeOptions}
                    value={form.values.image_type}
                    error={form.errors.image_type}
                    touched={form.touched.image_type}
                    handleChange={form.handleChange}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <FormControlInput
                  custom
                  label={t('Number of Images')}
                  formControlContainerClass={classes.numberControls}
                  formControlLabelClass={classes.formControlInputLabel}
                  formControlInputClass={classes.formControlInputClass}
                  formControlNumericInputRootClass={
                    classes.formControlNumericInputRootClass
                  }
                  marginBottom={false}
                  value={form.values.number_of_images}
                  error={form.errors.number_of_images}
                  touched={form.touched.number_of_images}
                  min={5}
                  max={100}
                  handleChange={setFieldValue('number_of_images')}
                />
                <FormControlInput
                  custom
                  label={t('Duration')}
                  formControlContainerClass={classes.numberControls}
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
                  max={5000}
                  handleChange={setFieldValue('duration')}
                />
              </Grid>
              <Grid item xs={6}>
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
                      onChange={setFieldValue('refresh_every')}
                      inputContainerClass={classes.inputContainerClass}
                      numberWraperStyles={{ width: 55 }}
                      rootClass={classes.inputRootClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      labelClass={classes.sliderInputLabelClass}
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

export default translate('translations')(withStyles(styles)(StockPhotos))
