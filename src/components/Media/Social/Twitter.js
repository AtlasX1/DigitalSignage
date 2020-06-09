import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'

import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'

import * as Yup from 'yup'
import { cloneDeep as _cloneDeep, get as _get, isNull as _isNull } from 'lodash'
import { useFormik } from 'formik'

import update from 'immutability-helper'
import {
  withStyles,
  Grid,
  Typography,
  Tooltip as TooltipBase
} from '@material-ui/core'
import Tooltip from 'components/Tooltip'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'
import TwitterSettings from './TwitterSettings'
import {
  FormControlInput,
  FormControlPalettePicker,
  FormControlReactSelect,
  SliderInputRange
} from 'components/Form'
import MediaThemeSelector from '../MediaThemeSelector'
import { MediaInfo, MediaTabActions } from '../index'

import {
  createMediaPostData,
  getMediaInfoFromBackendData,
  getMediaThemesSettings
} from 'utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'

import { twitterPalettePresets } from 'utils/palettePresets'

import { clearMediaThemes } from 'actions/configActions'

import { mediaConstants as constants } from '../../../constants'
import useMediaTheme from 'hooks/useMediaTheme'

const styles = ({ palette, type, typography }) => ({
  root: {
    margin: '15px 30px'
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
  tabToggleButtonGroup: {
    marginBottom: 16
  },
  tabToggleButton: {
    width: 'auto'
  },
  tabToggleButtonContainer: {
    justifyContent: 'center',
    background: 'transparent'
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
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px'
  },
  themeCardBottom: {
    padding: '0 15px 15px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.header.background
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px'
  },
  formControlRootClass: {
    marginBottom: 0
  },
  themeContainer: {
    marginTop: 16
  },
  tweetSettingsContainer: {
    marginTop: 16
  },
  transitionContainer: {
    marginTop: 16
  },
  themeCardBodyContainer: {
    padding: '15px'
  },
  formControlLabelClass: {
    fontSize: '1.0833rem'
  },
  formControlInputClass: {
    fontSize: '14px !important',
    padding: '9px 15px !important'
  },
  marginTop1: {
    marginTop: 16
  },
  formInputLabel: {
    paddingRight: '15px',
    ...typography.lightText[type]
  },
  numberInput: {
    '& span': {
      width: '76px',
      height: '36px'
    }
  },
  marginLeft: {
    marginLeft: '12px'
  },
  sliderInputClass: {
    width: '46px'
  },
  inputContainer: {
    padding: '0 7px',
    margin: '0 -7px'
  },
  sliderRoot: {
    marginBottom: 16,
    '& .slick-prev': {
      left: '-25px'
    },
    '& .slick-next': {
      right: '-25px'
    }
  },
  sliderItem: {
    width: 'auto',
    height: '115px',
    padding: '5px 10px',
    border: '1px solid #e4e9f3'
  },
  formControlInputNumber: {
    '& .react-numeric-input': {
      width: '100%',
      height: '38px'
    }
  },
  colorPickerLabel: {
    color: '#74809A',
    fontSize: '13px',
    lineHeight: '15px',
    width: 'auto',
    paddingRight: '15px'
  },
  colorPickerRootClass: {
    marginBottom: '0px'
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
  }
})

const transitionOptions = [
  'Slide Up',
  'Slide Down',
  'Grow',
  'Cards',
  'Curl',
  'Wave',
  'Flip',
  'Fly',
  'Reverse FLY',
  'Helix',
  'Fan',
  'Papercut',
  'Twirl',
  'Tilt',
  'Zipper'
]

const fonts = [
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
]

const validationSchema = Yup.object().shape({
  twitter_handle: Yup.string().required('Enter field'),
  speed: Yup.number().min(1).max(100),
  refresh_every: Yup.number().min(5).max(360),
  number_of_tweets: Yup.number().min(2).max(200),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const getTooltip = key => {
  switch (key) {
    case 'title':
      return 'Twitter Title/Profile Label'
    case 'handle':
      return 'Twitter Name/Time'
    case 'text':
      return 'Tweet Text'
    case 'text_link':
      return 'Tweet Text Link/Profile Label Value'
    case 'profile':
      return 'Profile border'
    case 'time':
      return 'Time color'
    case 'background':
      return 'Background'
    default:
      return key
  }
}

const parsePalettes = skins => {
  const newPalettes = []

  skins.forEach((skin, index) => {
    newPalettes[index] = {}
    newPalettes[index].id = index + 1
    newPalettes[index].palette = {}

    Object.keys(skin).forEach(key => {
      newPalettes[index].palette[key] = {}

      newPalettes[index].palette[key].tooltip = getTooltip(key)
      newPalettes[index].palette[key].value =
        skin[key].color || skin[key].font_color || skin[key].border_color
    })
  })

  return newPalettes
}

const Twitter = props => {
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
  const [addMediaReducer, mediaItemReducer] = useSelector(state => [
    state.addMedia.social,
    state.media.mediaItem
  ])

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [twitterThemes, setTwitterThemes] = useState([])
  const [selectedPreset, setSelectedPreset] = useState({})
  const [paletteType, setPaletteType] = useState('Presets')
  const [palettePresets, setPalettePresets] = useState([])
  const [customPalette, setCustomPalette] = useState({})
  const [settingsType, setSettingsType] = useState('title')
  const [themeType, setThemeType] = useState('Legacy')

  const { themes: themesReducer, featureId } = useMediaTheme(
    'Social',
    'Twitter'
  )

  const initialFormValues = useRef({
    twitter_handle: '',
    number_of_tweets: 25,
    themeId: 0,
    refresh_every: 5,
    theme_settings: {
      transition: transitionOptions[0],
      speed: 1,
      font_family: fonts[0],
      skin: undefined,
      title: {
        font_color: 'rgba(246, 210, 210, 1)',
        font_size: 12
      },
      handle: { font_color: 'rgba(246, 210, 210, 1)', font_size: 12 },
      time: { font_color: 'rgba(0, 255, 205, 1)', font_size: 12 },
      text: { font_color: 'rgba(255, 0, 82, 1)', font_size: 12 },
      text_link: { font_color: 'rgba(255, 59, 0, 1)', font_size: 12 },
      profile: {
        border_color: 'rgba(0, 0, 0, 1)'
      },
      background: {
        odd_row: 'rgba(0, 255, 205, 1)',
        even_row: 'rgba(255, 0, 82, 1)',
        title: 'rgba(255, 59, 0, 1)',
        color: 'rgba(0, 255, 205, 1)'
      }
    },
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
        twitter_handle,
        number_of_tweets,
        refresh_every,
        font_family,
        transition,
        speed,
        theme_settings,
        themeId
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const firstThemeOptions = {
        number_of_tweets: number_of_tweets,
        refresh_every: refresh_every,
        font_family: font_family,
        twitter_handle,
        transition: transition,
        speed: speed,
        theme_settings
      }

      const requestData = update(postData, {
        featureId: { $set: featureId },
        themeId: { $set: themeId },
        attributes: {
          $set: firstThemeOptions
        }
      })

      const actionOptions = {
        mediaName: 'social',
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
        case 'attributes.twitter_handle':
          formProp = 'twitter_handle'
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

  const handlePresetChange = (preset, index = 0) => {
    const { palette } = preset
    form.setFieldValue('theme_settings.skin', index)
    setSelectedPreset(preset)
    setCustomPalette({ ..._cloneDeep(preset), id: 123 })
    Object.keys(palette).forEach(key => {
      if (themeType === 'Modern') {
        form.setFieldValue(`theme_settings.${key}`, palette[key].value)
      } else {
        if (key === 'background') {
          form.setFieldValue(
            `theme_settings.${key}.odd_row`,
            palette[key].value
          )
          form.setFieldValue(
            `theme_settings.${key}.even_row`,
            palette[key].value
          )
          form.setFieldValue(`theme_settings.${key}.color`, palette[key].value)
        } else if (key === 'profile') {
          form.setFieldValue(
            `theme_settings.${key}.border_color`,
            palette[key].value
          )
        } else
          form.setFieldValue(
            `theme_settings.${key}.font_color`,
            palette[key].value
          )
      }
    })
  }

  const handleShowPreview = async () => {
    const {
      twitter_handle,
      number_of_tweets,
      refresh_every,
      font_family,
      transition,
      speed,
      theme_settings,
      themeId
    } = values
    form.setTouched({
      twitter_handle: true
    })

    try {
      await validationSchema.validate(
        { twitter_handle },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            number_of_tweets,
            refresh_every,
            font_family,
            twitter_handle,
            transition,
            speed,
            theme_settings
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

  const handlePalettesChange = theme => {
    if (themeType === 'Legacy') {
      if (_get(theme, 'customProperties.other.conditions.skin')) {
        const palettes = parsePalettes(
          _get(theme, 'customProperties.other.conditions.skin')
        )
        setPalettePresets(_cloneDeep(palettes))
      }
    } else {
      setPalettePresets(_cloneDeep(twitterPalettePresets))
    }
  }

  const handleSlideClick = themeId => {
    if (
      _get(themesReducer, themeType) &&
      _get(themesReducer, themeType).length
    ) {
      const theme = themesReducer[themeType].find(i => i.id === themeId)
      let defaultTheme

      if (theme)
        defaultTheme = getMediaThemesSettings(theme.customProperties, true)

      handlePalettesChange(theme)

      form.setValues({
        ...form.values,
        themeId: themeId,
        ...(defaultTheme && { theme_settings: defaultTheme })
      })
    }
  }

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
      props.onShowSnackbar(error.message)
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
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (
      backendData &&
      backendData.id &&
      _get(themesReducer, themeType) &&
      _get(themesReducer, themeType).length
    ) {
      const {
        themeId,
        attributes: {
          number_of_tweets,
          refresh_every,
          theme_settings,
          twitter_handle
        }
      } = backendData

      const theme = themesReducer.Legacy.find(i => i.id === themeId)
      !theme && setThemeType('Modern')

      initialFormValues.current = {
        ...form.values,
        themeId,
        number_of_tweets,
        refresh_every,
        theme_settings,
        twitter_handle,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }

      handleSlideClick(themeId)

      form.setValues(initialFormValues.current)
    }

    // eslint-disable-next-line
  }, [backendData, themesReducer])

  useEffect(
    () => {
      if (
        _get(themesReducer, themeType) &&
        _get(themesReducer, themeType).length
      ) {
        _isNull(backendData) &&
          form.setFieldValue('themeId', themesReducer[themeType][0].id)

        const theme = themesReducer[themeType].find(
          i => i.id === form.values.themeId
        )

        handlePalettesChange(theme)

        setTwitterThemes(themesReducer[themeType])
      }
    },
    // eslint-disable-next-line
    [themesReducer, themeType]
  )

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(
    () => () => {
      dispatchAction(clearMediaThemes())
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      const { theme_settings } = form.values
      if (theme_settings && palettePresets.length) {
        const skin = _get(theme_settings, 'skin')

        if (skin >= 0 && skin !== 6) {
          setPaletteType('Presets')
          setSelectedPreset(palettePresets[skin])
          setCustomPalette(palettePresets[skin])
        } else {
          const preset = { ..._cloneDeep(palettePresets[0]), id: 123 }

          Object.keys(preset.palette).forEach(key => {
            if (_get(theme_settings, key)) {
              preset.palette[key].value =
                themeType === 'Legacy'
                  ? theme_settings[key.replace('_color', '')][
                      key === 'profile'
                        ? 'border_color'
                        : key === 'background'
                        ? 'color'
                        : 'font_color'
                    ]
                  : theme_settings[key]
            }
          })

          setPaletteType('Custom')
          setCustomPalette(preset)
          setSelectedPreset(preset)
        }
      }
    },
    // eslint-disable-next-line
    [palettePresets]
  )

  const { values, errors, touched, submitCount, isValid } = form
  const isButtonsDisable = formSubmitting || (submitCount > 0 && !isValid)

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <FormControlInput
                  label="Twitter id:"
                  tooltip={
                    <span>
                      e.g. If user id is <b>@userid</b>, enter userid without{' '}
                      <b>@</b> sign
                    </span>
                  }
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.twitter_handle}
                  error={errors.twitter_handle}
                  touched={touched.twitter_handle}
                  handleChange={e =>
                    form.setFieldValue('twitter_handle', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlInput
                  custom
                  label="No of tweets:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlContainerClass={classes.formControlInputNumber}
                  formControlLabelClass={classes.formControlLabelClass}
                  formControlInputClass={classes.formControlInputClass}
                  value={values.number_of_tweets}
                  error={errors.number_of_tweets}
                  touched={touched.number_of_tweets}
                  handleChange={value =>
                    form.setFieldValue('number_of_tweets', value)
                  }
                />
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.themeContainer}>
              <MediaThemeSelector
                value={themeType}
                onChange={(e, val) => val && setThemeType(val)}
                carousel={{
                  customClasses: {
                    root: classes.sliderRoot,
                    sliderItem: classes.sliderItem
                  },
                  settings: {
                    infinite: false
                  },
                  slides: twitterThemes.map(theme => ({
                    name: theme.id,
                    content: (
                      <TooltipBase title={theme.tooltip}>
                        <img src={theme.thumb} alt={theme.id} />
                      </TooltipBase>
                    )
                  })),
                  activeSlide: values.themeId,
                  onSlideClick: t => handleSlideClick(t.name)
                }}
              />
            </Grid>

            {values.themeId === 18 && (
              <TwitterSettings
                classes={classes}
                activeTab={settingsType}
                data={{
                  values: values.theme_settings,
                  touches: touched.theme_settings,
                  errors: errors.theme_settings
                }}
                onChange={form.setFieldValue}
                changeTab={setSettingsType}
              />
            )}

            {values.themeId !== 18 && (
              <Grid
                container
                justify="center"
                className={classes.transitionContainer}
              >
                <Grid item xs={12} className={classes.themeCardWrap}>
                  <Grid
                    container
                    justify="center"
                    className={classes.marginTop1}
                  >
                    <Grid item>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonGroup}
                        exclusive
                        value={paletteType}
                        onChange={(e, val) => {
                          val && setPaletteType(val)
                        }}
                      >
                        <TabToggleButton
                          className={classes.tabToggleButton}
                          value="Presets"
                        >
                          Presets
                        </TabToggleButton>
                        <TabToggleButton
                          className={classes.tabToggleButton}
                          value="Custom"
                        >
                          Custom
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    justify="center"
                    className={classes.themeCardBodyContainer}
                  >
                    {paletteType === 'Custom' ? (
                      <Grid item key={customPalette.id}>
                        <FormControlPalettePicker
                          id={customPalette.id}
                          preset={customPalette}
                          allowChangeColor={true}
                          selected={selectedPreset}
                          onSelectPalette={p => handlePresetChange(p, 6)}
                        />
                      </Grid>
                    ) : (
                      <>
                        {palettePresets.map((item, index) => (
                          <Grid
                            item
                            xs={6}
                            key={item.id}
                            className={classes.colorPaletteContainer}
                          >
                            <FormControlPalettePicker
                              id={item.id}
                              preset={item}
                              allowChangeColor={false}
                              selected={selectedPreset}
                              onSelectPalette={p =>
                                handlePresetChange(p, index)
                              }
                            />
                          </Grid>
                        ))}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid
              container
              justify="center"
              className={classes.transitionContainer}
            >
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid
                  container
                  alignItems="center"
                  className={[classes.themeCardBodyContainer].join(' ')}
                >
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Font Family
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <FormControlReactSelect
                      marginBottom={0}
                      value={values.theme_settings.font_family}
                      error={_get(errors, 'theme_settings.font_family')}
                      touched={_get(touched, 'theme_settings.font_family')}
                      inputClasses={{
                        input: classes.formControlInputClass
                      }}
                      handleChange={e =>
                        form.setFieldValue(
                          'theme_settings.font_family',
                          e.target.value
                        )
                      }
                      options={fonts.map(name => ({
                        label: (
                          <span style={{ font_family: name }}>{name}</span>
                        ),
                        value: name
                      }))}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              justify="center"
              className={classes.transitionContainer}
            >
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  className={[classes.themeCardBodyContainer].join(' ')}
                >
                  <Grid item xs={7} className={classes.inputContainer}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Transition
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlReactSelect
                          value={values.theme_settings.transition}
                          error={_get(errors, 'theme_settings.transition')}
                          touched={_get(touched, 'theme_settings.transition')}
                          inputClasses={{
                            input: classes.formControlInputClass
                          }}
                          handleChange={e =>
                            form.setFieldValue(
                              'theme_settings.transition',
                              e.target.value
                            )
                          }
                          options={transitionOptions.map(name => ({
                            label: name,
                            value: name
                          }))}
                          marginBottom={0}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} className={classes.inputContainer}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Transition Speed
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          min={1}
                          max={100}
                          value={values.theme_settings.speed}
                          error={_get(errors, 'theme_settings.speed')}
                          touched={_get(touched, 'theme_settings.speed')}
                          handleChange={val =>
                            form.setFieldValue('theme_settings.speed', val)
                          }
                          formControlRootClass={[
                            classes.formControlRootClass,
                            classes.numberInput
                          ].join(' ')}
                          formControlInputClass={classes.formControlInputClass}
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
                    <Tooltip
                      title={
                        'Frequency of content refresh during playback (in minutes)'
                      }
                      placement="top"
                    >
                      <Typography className={classes.formInputLabel}>
                        Refresh Every
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      value={values.refresh_every}
                      error={errors.refresh_every}
                      touched={touched.refresh_every}
                      onChange={val => form.setFieldValue('refresh_every', val)}
                      label={''}
                      maxValue={360}
                      minValue={5}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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
    </form>
  )
}

Twitter.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Twitter.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(Twitter)
