import {
  CircularProgress,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import {
  getContentSourceOfMediaFeatureById,
  getThemeOfMediaFeatureById
} from 'actions/configActions'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import { get as _get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import * as Yup from 'yup'
import { MediaInfo, MediaTabActions } from '..'
import { mediaConstants } from '../../../constants'
import { radioPalettePresets } from '../../../utils/palettePresets'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import {
  FormControlInput,
  FormControlPalettePicker,
  FormControlSelect
} from '../../Form'
import { SingleIconTab, SingleIconTabs } from '../../Tabs'
import MediaHtmlCarousel from '../MediaHtmlCarousel'

const TabIconStyles = theme => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const CenteredIconTabsStyles = () => ({
  scroller: {
    margin: '0'
  },
  indicator: {
    display: 'none'
  },
  flexContainer: {
    justifyContent: 'center'
  }
})

const CenteredIconTabs = withStyles(CenteredIconTabsStyles)(SingleIconTabs)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '20px 24px'
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
    tabToggleButtonGroup: {
      marginBottom: '19px'
    },
    tabToggleButton: {
      width: '128px'
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
      marginBottom: '20px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background,
      minHeight: '64px'
    },
    themeHeaderContent: {
      minHeight: '92px'
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
    themeOptions1: {
      padding: '0 15px',
      marginBottom: '37px'
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
    formControlInput: {
      width: '100%'
    },
    formControlLabel: {
      fontSize: '12px',
      color: '#74809A',
      marginRight: '19px'
    },
    labelClass: {
      fontSize: '17px'
    },
    palettePickerContainer: {
      marginBottom: '9px'
    },
    marginTop1: {
      marginTop: '14px'
    },
    urlInputContainer: {
      padding: '0 15px'
    },

    tabContent: {
      height: '100%'
    },
    themeSliderContainer: {
      height: '200px'
    },
    themeSliderItem: {
      height: '100%'
    },

    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: '25px'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    }
  }
}

const Radio = ({
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
  const initialFormState = useRef({
    selectedPaletteType: 'Presets',
    selectedPalette: radioPalettePresets[0],
    customPalette: {
      id: 0,
      palette: {
        title: {
          tooltip: 'Title',
          value: 'rgba(255,255,255,1)'
        },
        subtitle: {
          tooltip: 'Subtitle',
          value: 'rgba(255,255,255,1)'
        },
        background: {
          tooltip: 'Background',
          value: 'rgba(0,0,0,1)'
        }
      }
    },
    theme: { id: 138, name: 'Radio theme 1' },
    station: { name: '', id: 123 }
  })
  const [selectedPaletteType, setSelectedPaletteType] = useState(
    initialFormState.current.selectedPaletteType
  )
  const [selectedPalette, setSelectedPalette] = useState(
    initialFormState.current.selectedPalette
  )
  const [customPalette, setCustomPalette] = useState(
    initialFormState.current.customPalette
  )

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const [featureId, setFeatureId] = useState(null)
  const [station, setStation] = useState(initialFormState.current.station)
  const [tabs, setTabs] = useState({})

  const [theme, setTheme] = useState(initialFormState.current.theme)

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.web)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const initialFormValues = useRef({
    tab: 'Pop',
    font_family: 'arial',
    radio_station_url: '',
    mediaInfo: mediaConstants.mediaInfoInitvalue
  })

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

  const { configMediaCategory, contentSourceOfMediaFeature } = useSelector(
    ({ config }) => config
  )

  const previewThemes = useSelector(({ config }) => {
    if (
      config.themeOfMedia &&
      config.themeOfMedia.response &&
      config.themeOfMedia.response.Legacy
    ) {
      return config.themeOfMedia.response.Legacy
    }
    return []
  })

  useEffect(() => {
    if (configMediaCategory.response.length) {
      setFeatureId(getAllowedFeatureId(configMediaCategory, 'Web', 'Radio'))
    }
  }, [configMediaCategory])

  useEffect(() => {
    if (featureId) {
      dispatch(getContentSourceOfMediaFeatureById(featureId))
      dispatch(getThemeOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    if (
      contentSourceOfMediaFeature.response &&
      contentSourceOfMediaFeature.response[0] &&
      contentSourceOfMediaFeature.response[0].source &&
      contentSourceOfMediaFeature.response[0].source.length
    ) {
      const reducedTabs = contentSourceOfMediaFeature.response.reduce(
        (accumulator, { name, description, source }) => {
          let tabIcon = ''
          switch (name) {
            case 'Pop':
              tabIcon = 'icon-radio-2'
              break
            case 'Jazz':
              tabIcon = 'icon-saxophone'
              break
            case 'News':
              tabIcon = 'icon-content-newspaper-2'
              break
            case 'Sports':
              tabIcon = 'icon-sport-football-helmet'
              break
            case 'Classical':
              tabIcon = 'icon-music-note-1'
              break
            case 'International':
              tabIcon = 'icon-boat-ship-1'
              break
            case 'Easy Listening':
              tabIcon = 'icon-coffee-cup-1'
              break
            case 'Seasonal':
              tabIcon = 'icon-christmas-snowflake'
              break

            case 'Rock':
              tabIcon = 'icon-skull'
              break
            case 'Electronic':
              tabIcon = 'icon-headphone-pulse'
              break
            case 'Rap':
              tabIcon = 'icon-leisure-dj-booth'
              break
            default:
              tabIcon = 'icon-music-note-12'
              break
          }
          accumulator[[name]] = {
            tabIcon: tabIcon,
            description: description,
            sources: source.map(({ id, name, thumbUri, thumbDimension }) => ({
              id: id,
              name: name,
              thumbUri: thumbUri,
              thumbDimension: thumbDimension
            }))
          }
          return accumulator
        },
        {}
      )
      setTabs(reducedTabs)
    }
  }, [contentSourceOfMediaFeature])

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
          mediaName: 'web',
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
    if (backendData && backendData.id) {
      initialFormValues.current = {
        tab: backendData.attributes.tab,
        font_family: backendData.attributes.font_family,
        title: backendData.title,
        featureId: backendData.featureId,
        themeId: backendData.themeId,
        contentSourceId: backendData.attributes.contentSourceId,
        radio_station_url: backendData.attributes.radio_station_url || '',
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      initialFormState.current.station = {
        name: backendData.attributes.stationName || '',
        id: backendData.attributes.contentSourceId
      }
      setStation(initialFormState.current.station)
      initialFormState.current.theme = backendData.attributes.theme
      setTheme(initialFormState.current.theme)
      initialFormState.current.selectedPaletteType =
        backendData.attributes.paletteData.type
      setSelectedPaletteType(initialFormState.current.selectedPaletteType)
      if (backendData.attributes.paletteData.type === 'Presets') {
        initialFormState.current.selectedPalette =
          radioPalettePresets[backendData.attributes.paletteData.data.id - 1]
        setSelectedPalette(initialFormState.current.selectedPalette)
      } else {
        initialFormState.current.customPalette =
          backendData.attributes.paletteData.data
        setCustomPalette(initialFormState.current.customPalette)
      }

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (mode === 'edit') {
      setLoading(true)
    }
  }, [mode])

  const validationSchema = Yup.object().shape({
    radio_station_url: Yup.string().when('tab', {
      is: 'custom',
      then: Yup.string()
        .url('Please enter a valid station URL')
        .required('Please enter a station URL')
    }),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      initialFormValues.current = values
      const { tab, font_family, radio_station_url, mediaInfo } = values
      const colorProps =
        selectedPaletteType === 'Presets'
          ? {
              radio_bg: selectedPalette.palette.background.value,
              radio_title_color: selectedPalette.palette.title.value,
              radio_subtitle_color: selectedPalette.palette.subtitle.value
            }
          : {
              radio_bg: customPalette.palette.background.value,
              radio_title_color: customPalette.palette.title.value,
              radio_subtitle_color: customPalette.palette.subtitle.value
            }

      const postData = createMediaPostData(mediaInfo, mode)
      const requestData = update(postData, {
        title: { $set: mediaInfo.title },
        featureId: { $set: featureId },
        themeId: { $set: theme.id },
        contentSourceId: { $set: station.id },
        attributes: {
          $set: {
            tab: tab,
            stationName: station.name,
            theme: theme,
            custom: tab === 'custom',
            radio_station_url: radio_station_url,
            font_family: font_family,
            paletteData: {
              type: selectedPaletteType,
              data:
                selectedPaletteType === 'Presets'
                  ? selectedPalette
                  : customPalette
            },
            color_properties: {
              skin: 0,
              ...colorProps
            }
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
          {
            radio_station_url
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
        console.error(e)
      }
    }
  })

  const handleShowPreview = async () => {
    const colorProps =
      selectedPaletteType === 'Presets'
        ? {
            radio_bg: selectedPalette.palette.background.value,
            radio_title_color: selectedPalette.palette.title.value,
            radio_subtitle_color: selectedPalette.palette.subtitle.value
          }
        : {
            radio_bg: customPalette.palette.background.value,
            radio_title_color: customPalette.palette.title.value,
            radio_subtitle_color: customPalette.palette.subtitle.value
          }

    const previewPayload = {
      title: form.values.mediaInfo.title,
      featureId: featureId,
      themeId: theme.id,
      attributes: {
        custom: form.values.tab === 'custom',
        radio_station_url: form.values.radio_station_url,
        font_family: form.values.font_family,
        color_properties: {
          skin: 0,
          ...colorProps
        }
      }
    }

    if (form.values.tab !== 'custom') {
      previewPayload['contentSourceId'] = station.id
    } else {
      form.setTouched({ radio_station_url: true })
    }

    const { radio_station_url } = form.values

    try {
      await validationSchema.validate(
        {
          radio_station_url
        },
        { strict: true, abortEarly: false }
      )
      if (form.errors.radio_station_url) {
        return
      } else {
        generatePreview(previewPayload)
      }
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
          <Grid container justify="center">
            <Grid item xs={12} className={classes.themeCardWrap}>
              <header className={classes.themeHeader}>
                {Object.values(tabs).length > 0 && (
                  <CenteredIconTabs
                    value={form.values.tab}
                    onChange={(_, tab) => form.setFieldValue('tab', tab)}
                    className={classes.featureIconTabContainer}
                  >
                    {Object.entries(tabs).map(([name, { tabIcon }], index) => (
                      <SingleIconTab
                        className={classes.featureIconTab}
                        icon={<TabIcon iconClassName={tabIcon} />}
                        disableRipple={true}
                        value={name}
                        key={`radio-tab-${index}`}
                      />
                    ))}
                    <SingleIconTab
                      className={classes.featureIconTab}
                      icon={<TabIcon iconClassName={'icon-settings-1'} />}
                      disableRipple={true}
                      value={'custom'}
                      key={`radio-tab-custom`}
                    />
                  </CenteredIconTabs>
                )}
              </header>
              {form.values.tab === 'custom' ? (
                <Grid
                  container
                  className={[
                    classes.themeHeaderContent,
                    classes.marginTop1
                  ].join(' ')}
                >
                  <Grid item xs={12} className={classes.urlInputContainer}>
                    <FormControlInput
                      label={`${t('Radio Station URL')}:`}
                      fullWidth={true}
                      formControlLabelClass={classes.labelClass}
                      touched={form.touched.radio_station_url}
                      error={form.errors.radio_station_url}
                      value={form.values.radio_station_url}
                      handleChange={event => {
                        form.setFieldValue(
                          'radio_station_url',
                          event.target.value
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container className={classes.themeHeaderContent}>
                  <Grid item xs={12}>
                    <MediaHtmlCarousel
                      settings={{
                        infinite: false
                      }}
                      onSlideClick={({ name, id }) =>
                        setStation({ name: name, id: id })
                      }
                      activeSlide={station.name}
                      slides={
                        tabs[form.values.tab] &&
                        tabs[form.values.tab].sources.map(
                          ({ id, name, thumbUri }, index) => ({
                            id: id,
                            name: name,
                            content: (
                              <img
                                src={thumbUri}
                                alt={name}
                                key={`radio-station-${index}`}
                              />
                            )
                          })
                        )
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} className={classes.themeCardWrap}>
              <header className={classes.themeHeader}>
                <Typography className={classes.themeHeaderText}>
                  {t('Theme')}
                </Typography>
              </header>
              <header className={classes.themeHeader1}>
                <Grid container>
                  <Grid item xs={12}>
                    <MediaHtmlCarousel
                      settings={{
                        infinite: false
                      }}
                      classes={{
                        sliderContainer: classes.themeSliderContainer,
                        sliderItem: classes.themeSliderItem
                      }}
                      onSlideClick={({ id, name }) =>
                        setTheme({ id: id, name: name })
                      }
                      activeSlide={theme.name}
                      slides={
                        previewThemes.length > 0
                          ? previewThemes.map(theme => {
                              return {
                                id: theme.id,
                                name: theme.name,
                                content: (
                                  <img
                                    src={theme.thumb}
                                    alt={theme.name}
                                    title={theme.tooltip}
                                  />
                                )
                              }
                            })
                          : []
                      }
                    />
                  </Grid>
                </Grid>
              </header>
              <Grid
                container
                className={classes.themeOptions1}
                alignItems="center"
              >
                <Grid item>
                  <Typography className={classes.formControlLabel}>
                    {t('Font Family')}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControlSelect
                    custom
                    marginBottom={false}
                    value={form.values.font_family}
                    inputClasses={{
                      input: classes.formControlInput
                    }}
                    handleChange={event =>
                      form.setFieldValue('font_family', event.target.value)
                    }
                    options={[
                      'Arial',
                      'Courier New',
                      'Times New Roman',
                      'Georgia',
                      'Alegreya Sans SC',
                      'Coiny',
                      'Indie Flower',
                      'Kanit',
                      'Kite One',
                      'Lobster',
                      'Montserrat',
                      'Pacifico',
                      'Poppins',
                      'Rasa'
                    ].map(name => ({
                      component: (
                        <span style={{ fontFamily: name }}>{name}</span>
                      ),
                      value: name.toLowerCase()
                    }))}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <TabToggleButtonGroup
                    className={classes.tabToggleButtonGroup}
                    value={selectedPaletteType}
                    exclusive
                    onChange={(_, paletteType) =>
                      setSelectedPaletteType(paletteType)
                    }
                  >
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value="Presets"
                    >
                      {t('preset')}
                    </TabToggleButton>
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value="Custom"
                    >
                      {t('Custom')}
                    </TabToggleButton>
                  </TabToggleButtonGroup>
                </Grid>
              </Grid>
              <Grid container className={classes.palettePickerContainer}>
                {selectedPaletteType === 'Presets' ? (
                  radioPalettePresets.map(item => (
                    <Grid
                      item
                      xs={6}
                      key={item.id}
                      className={classes.colorPaletteContainer}
                    >
                      <FormControlPalettePicker
                        preset={item}
                        onSelectPalette={({ id, palette }) =>
                          setSelectedPalette({ id: id, palette: palette })
                        }
                        disabled={selectedPaletteType === 'Presets'}
                        id={item.id}
                        selected={selectedPalette}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={6} className={classes.colorPaletteContainer}>
                    <FormControlPalettePicker
                      preset={customPalette}
                      onSelectPalette={({ id, palette }) =>
                        setCustomPalette({ id: id, palette: palette })
                      }
                      disabled={selectedPaletteType === 'Presets'}
                      id={0}
                      selected={customPalette}
                      allowChangeColor
                    />
                  </Grid>
                )}
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
                onClick={() => handleShowPreview()}
                className={classes.previewMediaBtn}
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
              onReset={() => {
                form.resetForm(initialFormValues.current)
                setSelectedPaletteType(
                  initialFormState.current.selectedPaletteType
                )
                setSelectedPalette(initialFormState.current.selectedPalette)
                setCustomPalette(initialFormState.current.customPalette)
                setTheme(initialFormState.current.theme)
                setStation(initialFormState.current.station)
              }}
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

Radio.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Radio.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Radio))
