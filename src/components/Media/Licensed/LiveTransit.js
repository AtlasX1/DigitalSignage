import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'

import {
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import MediaHtmlCarousel from '../MediaHtmlCarousel'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'
import update from 'immutability-helper'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { useDispatch, useSelector } from 'react-redux'
import { debounce as _debounce, get as _get } from 'lodash'
import {
  getLocation,
  getThemeOfMediaFeatureById
} from '../../../actions/configActions'
import { MediaInfo, MediaTabActions } from '../index'
import SliderInputRange from '../../Form/SliderInputRange'
import { FormControlInput } from '../../Form'
import FormControlChips from '../../Form/FormControlChips'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '22px 30px'
    },
    formWrapper: {
      position: 'relative',
      height: '100%'
    },
    tabContent: {
      height: '100%'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    cardContent: {
      padding: 15
    },
    themeHeader: {
      padding: '5px 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    tabToggleButtonGroup: {
      marginBottom: '19px',
      justifyContent: 'center'
    },
    tabToggleButton: {
      width: '128px'
    },
    featureIconTabContainer: {
      justifyContent: 'center',
      marginLeft: 0
    },
    featureIconTab: {
      '&:not(:last-child)': {
        marginRight: '15px'
      }
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
      marginTop: '58px'
    },
    marginTop1: {
      marginTop: '22px'
    },
    formControlRootClass: {
      width: '100%',
      justifyContent: 'space-between'
    },
    formControlInputNumber: {
      '& .react-numeric-input': {
        width: '100%',
        height: '38px'
      }
    },
    formControlLabelClass: {
      fontSize: '17px'
    }
  }
}

const validationSchema = Yup.object().shape({
  themeId: Yup.number().required('Select Theme'),
  refresh_every: Yup.number(),
  location_type: Yup.string(),
  location: Yup.string().required('Enter field'),
  latitude: Yup.number().required('Enter field'),
  longitude: Yup.number().required('Enter field'),
  transit_title: Yup.string().required('Enter field'),
  description: Yup.string().required('Enter field'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const LiveTransit = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onModalClose,
  onShowSnackbar,
  onShareStateCallback
}) => {
  const dispatchAction = useDispatch()
  const { configMediaCategory } = useSelector(({ config }) => config)
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.licensed)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const cities = configMediaCategory.cities || []

  const TransitThemes = useSelector(({ config }) => {
    if (config.themeOfMedia && config.themeOfMedia.response) {
      return config.themeOfMedia.response
    }
    return []
  })

  const initialFormState = useRef({
    themeType: 'Light'
  })
  const [isLoading, setLoading] = useState(true)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [themeType, setThemeType] = useState(initialFormState.current.themeType)
  const [citySearchPage, setSearchPage] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState([])
  const [cityValue, setCityValue] = useState({})
  const [themes, setThemes] = useState([])

  const initialFormValues = useRef({
    themeId: undefined,
    refresh_every: 60,
    location_type: 'address',
    location: 'ABC',
    latitude: 0,
    longitude: 0,
    display_stops_within: 250,
    transit_title: '',
    description: '',
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
      const {
        themeId,
        refresh_every,
        location_type,
        location,
        latitude,
        longitude,
        transit_title,
        display_stops_within,
        description
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        featureId: { $set: featureId },
        themeId: { $set: themeId },
        attributes: {
          $set: {
            refresh_every,
            location_type,
            location,
            latitude,
            longitude,
            display_stops_within,
            range: display_stops_within,
            title: transit_title,
            description
          }
        }
      })

      const actionOptions = {
        mediaName: 'licensed',
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
      themeId,
      refresh_every,
      location_type,
      location,
      latitude,
      longitude,
      transit_title,
      display_stops_within,
      description
    } = form.values
    form.setTouched({
      themeId: true,
      refresh_every: true,
      location_type: true,
      location: true,
      latitude: true,
      longitude: true,
      transit_title: true,
      description: true
    })

    try {
      await validationSchema.validate(
        {
          themeId,
          refresh_every,
          location_type,
          location,
          latitude,
          longitude,
          transit_title,
          description
        },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            refresh_every,
            location_type,
            location,
            latitude,
            longitude,
            display_stops_within,
            range: display_stops_within,
            title: transit_title,
            description
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

  const handleCityChange = ({ target }) => {
    const { latitude, longitude, name, state, country } = target.value.data
    setSelectedLocation([{ ...target.value }])
    form.setFieldValue('latitude', latitude)
    form.setFieldValue('longitude', longitude)
    form.setFieldValue('location', `${name}, ${state}, ${country}`)
  }

  const handleCityInputChange = _debounce(value => {
    if (value && !value.label) {
      const type = isNaN(value) ? 'name' : 'zipcode'

      setCityValue({ [type]: value })
      setSearchPage(1)
      dispatchAction(
        getLocation({
          [type]: value
        })
      )
    }
  }, 500)

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
          mediaName: 'licensed',
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
          mediaName: 'licensed',
          tabName: selectedTab
        })
      )
      onShowSnackbar(error.message)
      setFormSubmitting(false)

      form.setFieldValue('twitter_handle', form.values.twitter_handle)
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
    dispatchAction(getLocation({ name: 'new' }))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    citySearchPage !== 1 &&
      dispatchAction(getLocation({ ...cityValue, page: citySearchPage }))
    // eslint-disable-next-line
  }, [citySearchPage])

  useEffect(() => {
    if (backendData && backendData.id) {
      !isLoading && setLoading(true)
      const {
        attributes: {
          description,
          display_stops_within,
          latitude,
          location,
          location_type,
          longitude,
          range,
          refresh_every,
          title
        },
        themeId
      } = backendData

      const cityName = location.split(',')[0]

      dispatchAction(getLocation({ name: cityName }))

      initialFormValues.current = {
        ...form.values,
        description,
        display_stops_within,
        latitude,
        location,
        location_type,
        longitude,
        range,
        refresh_every,
        transit_title: title,
        themeId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      setLoading(false)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    //get previously selected location
    if (mode === 'edit' && form.values.latitude && form.values.longitude) {
      const city = cities.find(
        i =>
          i.longitude === form.values.longitude &&
          i.latitude === form.values.latitude
      )

      setSelectedLocation([
        {
          label: form.values.location,
          value: city ? city.id : 0,
          data: city ? city : {}
        }
      ])
      // dispatchAction(getLocation({ name: 'new' }))
    }
    // eslint-disable-next-line
  }, [form.values, cities])

  useEffect(
    () => {
      if (!configMediaCategory.response.length) return
      const id = getAllowedFeatureId(
        configMediaCategory,
        'Licensed',
        'LiveTransit'
      )
      setFeatureId(id)
    },
    // eslint-disable-next-line
    [configMediaCategory]
  )

  useEffect(
    () => {
      if (
        _get(TransitThemes, themeType) &&
        _get(TransitThemes, themeType).length
      ) {
        const { themeId } = form.values
        if (
          themeId &&
          !TransitThemes[themeType].some(({ id }) => id === themeId)
        ) {
          initialFormState.current.themeType =
            themeType === 'Light' ? 'Dark' : 'Light'
          setThemeType(initialFormState.current.themeType)
        } else {
          setThemes(TransitThemes[themeType])
        }
      }
      mode !== 'edit' && setLoading(false)
    },
    // eslint-disable-next-line
    [TransitThemes]
  )

  useEffect(
    () => {
      if (
        _get(TransitThemes, themeType) &&
        _get(TransitThemes, themeType).length
      ) {
        setThemes(TransitThemes[themeType])
      }
    },
    // eslint-disable-next-line
    [themeType]
  )

  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const { values, errors, touched } = form
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
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Live Transit Theme
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonContainer}
                        value={themeType}
                        exclusive
                        onChange={(e, val) => setThemeType(val)}
                      >
                        <TabToggleButton value={'Light'}>Light</TabToggleButton>
                        <TabToggleButton value={'Dark'}>Dark</TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>
                </header>
                {!!themes.length && (
                  <MediaHtmlCarousel
                    settings={{
                      infinite: false
                    }}
                    activeSlide={values.themeId}
                    slides={themes.map(theme => ({
                      name: theme.id,
                      content: (
                        <Tooltip
                          title={theme.tooltip}
                          placement="top"
                          key={theme.id}
                        >
                          <img src={theme.thumb} alt={theme.tooltip} />
                        </Tooltip>
                      )
                    }))}
                    onSlideClick={val =>
                      form.setFieldValue('themeId', val.name)
                    }
                  />
                )}
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Address
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonContainer}
                        value={values.location_type}
                        exclusive
                        onChange={(e, val) =>
                          form.setFieldValue('location_type', val)
                        }
                      >
                        <TabToggleButton value={'address'}>
                          Address
                        </TabToggleButton>
                        <TabToggleButton value={'coordinates'}>
                          Coordinates
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>
                </header>
                <Grid container className={classes.cardContent}>
                  {values.location_type === 'address' ? (
                    <Grid item xs={12}>
                      <FormControlChips
                        isMulti={false}
                        name={'location'}
                        marginBottom={0}
                        customClass={classes.reactSelectContainer}
                        options={cities.map(item => ({
                          label: `${item.name}, ${item.state}, ${item.country}`,
                          value: item.id,
                          data: item
                        }))}
                        values={selectedLocation}
                        error={errors.location}
                        touched={touched.location}
                        handleChange={handleCityChange}
                        handleBlur={() => setSearchPage(1)}
                        handleInputChange={handleCityInputChange}
                        handleMenuScrollToBottom={() =>
                          setSearchPage(citySearchPage + 1)
                        }
                      />
                    </Grid>
                  ) : (
                    <Grid container justify="space-between">
                      <Grid item xs={5}>
                        <FormControlInput
                          custom={true}
                          label="Longitude:"
                          strict={false}
                          formControlRootClass={classes.formControlRootClass}
                          formControlContainerClass={
                            classes.formControlInputNumber
                          }
                          formControlLabelClass={classes.formControlLabelClass}
                          value={values.longitude}
                          error={errors.longitude}
                          touched={touched.longitude}
                          marginBottom={false}
                          handleChange={val =>
                            form.setFieldValue('longitude', val)
                          }
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <FormControlInput
                          custom={true}
                          label="Latitude:"
                          strict={false}
                          formControlRootClass={classes.formControlRootClass}
                          formControlContainerClass={
                            classes.formControlInputNumber
                          }
                          formControlLabelClass={classes.formControlLabelClass}
                          value={values.latitude}
                          error={errors.latitude}
                          touched={touched.latitude}
                          marginBottom={false}
                          handleChange={val =>
                            form.setFieldValue('latitude', val)
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container className={classes.marginTop1}>
              <Grid item xs={12}>
                <FormControlInput
                  label="Title:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlContainerClass={classes.formControlInputNumber}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.transit_title}
                  error={errors.transit_title}
                  touched={touched.transit_title}
                  handleChange={e =>
                    form.setFieldValue('transit_title', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlInput
                  label="Description:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlContainerClass={classes.formControlInputNumber}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.description}
                  error={errors.description}
                  touched={touched.description}
                  handleChange={e =>
                    form.setFieldValue('description', e.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <SliderInputRange
                  step={1}
                  value={values.display_stops_within}
                  label={`Display stop within ${values.display_stops_within} meters`}
                  tooltip={'Distance range (in minutes)'}
                  maxValue={2500}
                  minValue={250}
                  onChange={val =>
                    form.setFieldValue('display_stops_within', val)
                  }
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
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
              <Grid item>
                <SliderInputRange
                  step={1}
                  value={values.refresh_every}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={3600}
                  minValue={60}
                  onChange={val => form.setFieldValue('refresh_every', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                />
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
                disabled={formSubmitting}
                onReset={() => {
                  form.resetForm(initialFormValues.current)
                  setThemeType(initialFormState.current.themeType)
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
  )
}

export default translate('translations')(withStyles(styles)(LiveTransit))
