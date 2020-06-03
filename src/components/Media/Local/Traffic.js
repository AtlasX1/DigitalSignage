import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { compose } from 'redux'
import { debounce as _debounce, get as _get } from 'lodash'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  CircularProgress,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import update from 'immutability-helper'

import { WhiteButton } from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
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
import { getLocation } from '../../../actions/configActions'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import FormControlChips from '../../Form/FormControlChips'
import FormControlSelect from '../../Form/FormControlSelect'

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '32px 25px',
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
    borderColor: palette[type].sideModal.action.button.border,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none',
    marginTop: '81px'
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
    backgroundColor: palette[type].pages.media.general.card.header.background
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.general.card.header.color,
    fontSize: '12px'
  },
  themeOptions1: {
    padding: '0 15px',
    margin: '12px 0'
  },
  mapViewClasses: {
    width: '230px',
    marginTop: '35px'
  },
  detailLabel: {
    color: '#74809a',
    fontSize: '13px',
    lineHeight: '15px',
    paddingRight: '15px'
  },
  inputLabel: {
    fontSize: '18px',
    display: 'block'
  },
  sliderInputRoot: {
    alignItems: 'center'
  },
  sliderInputClass: {
    width: 50,
    height: 38,
    fontSize: 14
  },
  sliderInputClassBig: {
    width: 70
  },
  sliderInputRootClass: {
    marginRight: 0
  },
  sliderInputLabel: {
    color: '#74809A',
    fontSize: '13px',
    lineHeight: '15px',
    marginRight: '15px'
  },
  marginBottom1: {
    marginBottom: '22px'
  },
  marginBottom2: {
    marginBottom: '25px'
  },
  reactSelectContainer: {
    '& .react-select__control': {
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: 12,

      '& .react-select__single-value': {
        color: '#9394A0'
      }
    }
  }
})

const images = {
  hereMap: require('../../../common/assets/maps/here_map_180x100.png'),
  mapquestMap: require('../../../common/assets/maps/mapquest_map_180x100.png'),
  tomtomMap: require('../../../common/assets/maps/tomtom_map_180x100.png'),
  googleMap: require('../../../common/assets/maps/traffic_google_map_180x100.png')
}

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#0A83C8'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => {
  return (
    <div className={classes.tabIconWrap}>
      <i className={iconClassName} />
    </div>
  )
})

const InfoMessageStyles = ({ typography }) => ({
  infoMessageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0 5px 25px'
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
  ({ iconClassName = '', classes }) => {
    return (
      <div className={classes.infoMessageContainer}>
        <TabIcon iconClassName={iconClassName} />
        <div className={classes.infoMessage}>
          Some of these live traffic map visualizations use the latest web
          technologies and therefore require up-to-date device hardware and
          firmware. These live traffic visualizations may not work on devices
          commissioned prior to 2017.
        </div>
      </div>
    )
  }
)

const validationSchema = Yup.object().shape({
  locationZipcode: Yup.string(),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

function genLocationLabel(name, state, country) {
  return [name, state, country].join(', ')
}

const Traffic = props => {
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.local)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const cities = configMediaCategory.cities || []

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [citySearchPage, setSearchPage] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [cityValue, setCityValue] = useState({})

  const initialFormValues = useRef({
    locationZipcode: '',
    locationType: 'city',
    mapView: 'hybrid',
    mapType: 'google_map',
    zoom: 12,
    refreshEvery: 3600,
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
        locationType,
        locationZipcode,
        zoom,
        refreshEvery,
        mapView,
        mapType
      } = values

      if (locationType !== 'auto' && !locationZipcode) {
        form.setFieldError('locationZipcode', 'Select location')
        return
      }

      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        attributes: {
          $set: {
            location_type: locationType,
            location: locationZipcode || null,
            zoom_level: zoom,
            refresh_every: refreshEvery,
            map_view: mapView,
            map_api_type: mapType
          }
        }
      })

      const actionOptions = {
        mediaName: 'local',
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

  const handleSlideClick = slide => {
    form.setFieldValue('mapType', slide.name)
  }

  const { setFieldValue } = form

  const setLocation = useCallback(
    city => {
      if (!city) return
      const { name, state, country, zipcode, id } = city
      setSelectedLocation([
        { value: id, label: genLocationLabel(name, state, country) }
      ])
      setFieldValue('locationZipcode', zipcode)
    },
    [setSelectedLocation, setFieldValue]
  )

  const handleCityChange = ({ target }) => {
    setLocation(cities.find(city => city.id === target.value))
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
      locationType,
      locationZipcode,
      zoom,
      refreshEvery,
      mapView,
      mapType
    } = form.values

    form.setTouched({ locationZipcode: true })
    try {
      locationType !== 'auto' &&
        (await validationSchema.validate(
          { locationZipcode },
          { strict: true, abortEarly: false }
        ))
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            location_type: locationType,
            location: locationZipcode,
            zoom_level: zoom,
            refresh_every: refreshEvery,
            map_view: mapView,
            map_api_type: mapType
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
          mediaName: 'local',
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
    dispatchAction(getLocation({ name: 'new' }))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (backendData && backendData.id) {
      const {
        location_type,
        location,
        zoom_level,
        refresh_every,
        map_view,
        map_api_type
      } = backendData.attributes

      dispatchAction(getLocation({ zipcode: location }))

      initialFormValues.current = {
        ...form.values,
        locationType: location_type,
        locationZipcode: location,
        zoom: zoom_level,
        refreshEvery: refresh_every,
        mapView: map_view,
        mapType: map_api_type,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    //get previously selected location
    if (cities.length === 1 && mode === 'edit' && form.values.locationZipcode) {
      setLocation(cities[0])
      dispatchAction(getLocation({ name: 'new' }))
    }
    // eslint-disable-next-line
  }, [form.values, cities])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Local', 'Traffic')
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

  useEffect(() => {
    citySearchPage !== 1 &&
      dispatchAction(getLocation({ ...cityValue, page: citySearchPage }))
    // eslint-disable-next-line
  }, [citySearchPage])

  const { values, errors, touched } = form
  return (
    <form className={classes.formWrapper}>
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="center" className={classes.marginBottom1}>
              <MediaHtmlCarousel
                settings={{
                  infinite: false
                }}
                activeSlide={values.mapType}
                slides={[
                  {
                    name: 'google_map',
                    content: (
                      <Tooltip title={'Google Map'} placement="top">
                        <img src={images.googleMap} alt={'googleMap'} />
                      </Tooltip>
                    )
                  },
                  {
                    name: 'here',
                    content: (
                      <Tooltip title={'Here'} placement="top">
                        <img src={images.hereMap} alt={'hereMap'} />
                      </Tooltip>
                    )
                  },
                  {
                    name: 'mapquest',
                    content: (
                      <Tooltip title={'Mapquest'} placement="top">
                        <img src={images.mapquestMap} alt={'mapquestMap'} />
                      </Tooltip>
                    )
                  },
                  {
                    name: 'tomtom',
                    content: (
                      <Tooltip title={'Tomtom'} placement="top">
                        <img src={images.tomtomMap} alt={'tomtomMap'} />
                      </Tooltip>
                    )
                  }
                ]}
                onSlideClick={handleSlideClick}
              />
            </Grid>

            <Grid container justify="center" className={classes.marginBottom2}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Location
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        label="Auto"
                        value={values.locationType === 'auto'}
                        handleChange={val =>
                          form.setFieldValue(
                            'locationType',
                            val ? 'auto' : 'city'
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </header>
                {values.locationType === 'city' && (
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.themeOptions1}
                  >
                    <Grid item>
                      <Typography className={classes.detailLabel}>
                        Enter City / Zip Code:
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <FormControlChips
                        isMulti={false}
                        name={'location'}
                        marginBottom={0}
                        customClass={classes.reactSelectContainer}
                        options={cities.map(item => ({
                          label: `${item.name}, ${item.state}, ${item.country}`,
                          value: item.id
                        }))}
                        values={selectedLocation}
                        error={errors.locationZipcode}
                        touched={touched.locationZipcode}
                        handleChange={handleCityChange}
                        handleBlur={() => setSearchPage(1)}
                        handleInputChange={handleCityInputChange}
                        handleMenuScrollToBottom={() =>
                          setSearchPage(citySearchPage + 1)
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      Zoom Level
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      maxValue={22}
                      minValue={1}
                      step={1}
                      label={''}
                      rootClass={classes.sliderInputRoot}
                      inputRootClass={classes.sliderInputRootClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      value={values.zoom}
                      onChange={value => form.setFieldValue('zoom', value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      Refresh Every
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      maxValue={21600}
                      minValue={3600}
                      step={1}
                      label={''}
                      rootClass={classes.sliderInputRoot}
                      inputRootClass={classes.sliderInputRootClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      value={values.refreshEvery}
                      onChange={value =>
                        form.setFieldValue('refreshEvery', value)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className={classes.mapViewClasses}>
                <FormControlSelect
                  custom
                  label="Map View"
                  marginBottom={false}
                  value={values.mapView}
                  options={[
                    { label: 'Road Map', value: 'roadmap' },
                    { label: 'Satellite', value: 'hybrid' }
                  ]}
                  handleChange={e =>
                    form.setFieldValue('mapView', e.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Grid container justify="flex-start">
              <Grid item>
                <WhiteButton className={classes.previewMediaBtn}>
                  <Typography
                    className={classes.previewMediaText}
                    onClick={handleShowPreview}
                  >
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
  )
}

Traffic.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Traffic.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Traffic)
