import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { get as _get } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import MediaThemeSelector from '../MediaThemeSelector'
import {
  FormControlInput,
  FormControlPalettePicker,
  FormControlSelect,
  SliderInputRange
} from '../../Form'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import { MediaInfo, MediaTabActions } from '../index'
import TwitterSettings from './TwitterSettings'
import Tooltip from '@material-ui/core/Tooltip'
import { twitterPalettePresets } from 'utils/palettePresets'
import {
  clearMediaThemes,
  getThemeOfMediaFeatureById
} from 'actions/configActions'

const styles = ({ palette, type }) => ({
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
    marginBottom: '15px'
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
    marginTop: '34px'
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
    marginTop: '15px'
  },
  tweetSettingsContainer: {
    marginTop: '18px'
  },
  transitionContainer: {
    marginTop: '20px'
  },
  themeCardBodyContainer: {
    padding: '15px'
  },
  formControlLabelClass: {
    fontSize: '17px'
  },
  formControlInputClass: {
    fontSize: '14px !important',
    padding: '9px 15px !important'
  },
  marginTop1: {
    marginTop: '10px'
  },
  formInputLabel: {
    color: '#74809a',
    fontSize: '13px',
    lineHeight: '15px',
    paddingRight: '15px'
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
    marginBottom: '15px',
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
    maxWidth: '125px',
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
  },
  formLabelTooltip: {
    borderBottom: '1px dashed #0A83C8',
    '&:hover': {
      cursor: 'pointer',
      borderBottomStyle: 'solid'
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
  transitionSpeed: Yup.number().min(1).max(100),
  refreshEvery: Yup.number().min(5).max(360),
  tweetsCount: Yup.number().min(2).max(200),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const getFirstThemeSettings = values => {
  return {
    title: {
      font_size: values.title.fontSize,
      font_color: values.title.fontColor
    },
    handle: {
      font_size: values.handle.fontSize,
      font_color: values.handle.fontColor
    },
    time: {
      font_size: values.time.fontSize,
      font_color: values.time.fontColor
    },
    text: {
      font_size: values.text.fontSize,
      font_color: values.text.fontColor
    },
    text_link: {
      font_size: values.textlink.fontSize,
      font_color: values.textlink.fontColor
    },
    background: {
      odd_row: values.background.oddRow,
      even_row: values.background.evenRow,
      title: values.background.title
    }
  }
}

const parseThemeSettings = ({
  title = {},
  handle = {},
  time = {},
  text = {},
  text_link = {},
  background = {}
}) => ({
  title: {
    fontSize: title.font_size,
    fontColor: title.font_color
  },
  handle: {
    fontSize: handle.font_size,
    fontColor: handle.font_color
  },
  time: {
    fontSize: time.font_size,
    fontColor: time.font_color
  },
  text: {
    fontSize: text.font_size,
    fontColor: text.font_color
  },
  textlink: {
    fontSize: text_link.font_size,
    fontColor: text_link.font_color
  },
  background: {
    oddRow: background.odd_row,
    evenRow: background.even_row,
    title: background.title
  }
})

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
  const { configMediaCategory } = useSelector(({ config }) => config)
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.social)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const TwitterThemes = useSelector(({ config }) => {
    if (config.themeOfMedia && config.themeOfMedia.response) {
      return config.themeOfMedia.response
    }
    return []
  })

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [twitterThemes, setTwitterThemes] = useState([])

  const initialFormValues = useRef({
    twitter_handle: '',
    tweetsCount: 25,
    themeType: 'Legacy',
    theme: 0,
    transition: transitionOptions[0].toLowerCase(),
    transitionSpeed: 1,
    refreshEvery: 5,
    fontFamily: fonts[0].toLowerCase(),
    settingsType: 'title',
    settings: {
      title: {
        fontColor: 'rgba(246, 210, 210, 1)',
        fontSize: 12
      },
      handle: { fontColor: 'rgba(246, 210, 210, 1)', fontSize: 12 },
      time: { fontColor: 'rgba(0, 255, 205, 1)', fontSize: 12 },
      text: { fontColor: 'rgba(255, 0, 82, 1)', fontSize: 12 },
      textlink: { fontColor: 'rgba(255, 59, 0, 1)', fontSize: 12 },
      background: {
        oddRow: 'rgba(0, 255, 205, 1)',
        evenRow: 'rgba(255, 0, 82, 1)',
        title: 'rgba(255, 59, 0, 1)'
      }
    },
    selectedPreset: {},
    paletteType: 'Presets',
    palettePresets: twitterPalettePresets,
    customPalette: twitterPalettePresets[0],
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
        tweetsCount,
        refreshEvery,
        fontFamily,
        transition,
        transitionSpeed,
        settings,
        theme
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const firstThemeOptions = {
        number_of_tweets: tweetsCount,
        refresh_every: refreshEvery,
        font_family: fontFamily,
        twitter_handle,
        transition: transition,
        speed: transitionSpeed,
        theme_settings: getFirstThemeSettings(settings)
      }

      const requestData = update(postData, {
        featureId: { $set: featureId },
        themeId: { $set: theme },
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

  const handlePresetChange = preset => {
    const { palette } = preset
    form.setFieldValue('selectedPreset', preset)
    Object.keys(palette).forEach(key => {
      if (key === 'background') {
        form.setFieldValue(`settings.${key}.oddRow`, palette[key].value)
        form.setFieldValue(`settings.${key}.evenRow`, palette[key].value)
      } else form.setFieldValue(`settings.${key}.fontColor`, palette[key].value)
    })
  }

  const handleShowPreview = async () => {
    const {
      twitter_handle,
      tweetsCount,
      refreshEvery,
      fontFamily,
      transition,
      transitionSpeed,
      settings,
      theme
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
          themeId: theme,
          attributes: {
            number_of_tweets: tweetsCount,
            refresh_every: refreshEvery,
            font_family: fontFamily,
            twitter_handle: 'msn',
            transition: transition,
            speed: transitionSpeed,
            theme_settings: getFirstThemeSettings(settings)
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
    if (backendData && backendData.id) {
      const {
        background_color,
        content,
        fill_color,
        size,
        twitter_handle,
        number_of_tweets,
        speed,
        transition,
        theme_settings,
        font_family
      } = backendData.attributes

      initialFormValues.current = {
        ...form.values,
        content,
        size,
        bgColor: background_color,
        fillColor: fill_color,
        twitter_handle: twitter_handle,
        tweetsCount: number_of_tweets,
        transition: transition,
        transitionSpeed: speed,
        fontFamily: font_family,
        settings: parseThemeSettings(theme_settings),
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }

    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    // Twitter, Pinterest, Facebook, Instagram, Socialwall
    const id = getAllowedFeatureId(configMediaCategory, 'Social', 'Twitter')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
  }, [featureId, dispatchAction])

  useEffect(
    () => {
      if (
        _get(TwitterThemes, form.values.themeType) &&
        _get(TwitterThemes, form.values.themeType).length
      ) {
        form.setFieldValue('theme', TwitterThemes[form.values.themeType][0].id)
        setTwitterThemes(TwitterThemes[form.values.themeType])
      }
      mode !== 'edit' && setLoading(false)
    },
    // eslint-disable-next-line
    [TwitterThemes]
  )

  useEffect(
    () => {
      if (
        _get(TwitterThemes, form.values.themeType) &&
        _get(TwitterThemes, form.values.themeType).length
      ) {
        form.setFieldValue('theme', TwitterThemes[form.values.themeType][0].id)
        setTwitterThemes(TwitterThemes[form.values.themeType])
      }
    },
    // eslint-disable-next-line
    [form.values.themeType]
  )

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (mode === 'edit') {
      setLoading(true)
    }
  }, [mode])

  useEffect(
    () => () => {
      dispatchAction(clearMediaThemes())
    },
    // eslint-disable-next-line
    []
  )

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
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Tooltip
                  title={
                    <span>
                      e.g. If user id is <b>@userid</b>, enter userid without{' '}
                      <b>@</b> sign
                    </span>
                  }
                  placement="top"
                >
                  <FormControlInput
                    label="Twitter id:"
                    formControlRootClass={classes.formControlRootClass}
                    formControlLabelClass={classes.formControlLabelClass}
                    value={values.twitter_handle}
                    error={errors.twitter_handle}
                    touched={touched.twitter_handle}
                    handleChange={e =>
                      form.setFieldValue('twitter_handle', e.target.value)
                    }
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <FormControlInput
                  custom
                  label="No of tweets:"
                  formControlRootClass={classes.formControlRootClass}
                  formControlContainerClass={classes.formControlInputNumber}
                  formControlLabelClass={classes.formControlLabelClass}
                  formControlInputClass={classes.formControlInputClass}
                  value={values.tweetsCount}
                  error={errors.tweetsCount}
                  touched={touched.tweetsCount}
                  handleChange={value =>
                    form.setFieldValue('tweetsCount', value)
                  }
                />
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.themeContainer}>
              <MediaThemeSelector
                value={values.themeType}
                onChange={(e, val) => form.setFieldValue('themeType', val)}
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
                      <Tooltip title={theme.tooltip}>
                        <img src={theme.thumb} alt={theme.id} />
                      </Tooltip>
                    )
                  })),
                  activeSlide: values.theme,
                  onSlideClick: t => form.setFieldValue('theme', t.name)
                }}
              />
            </Grid>

            {values.theme === 18 && (
              <TwitterSettings
                classes={classes}
                activeTab={values.settingsType}
                data={{
                  values: values.settings,
                  touches: touched.settings,
                  errors: errors.settings
                }}
                onChange={form.setFieldValue}
              />
            )}

            {values.theme !== 18 && (
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
                        value={values.paletteType}
                        onChange={(e, val) => {
                          val && form.setFieldValue('paletteType', val)
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
                    {values.paletteType === 'Custom' ? (
                      <Grid item key={values.customPalette}>
                        <FormControlPalettePicker
                          id={values.customPalette.id}
                          preset={values.customPalette}
                          allowChangeColor={true}
                          selected={values.selectedPreset}
                          onSelectPalette={handlePresetChange}
                        />
                      </Grid>
                    ) : (
                      <>
                        {values.palettePresets.map(item => (
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
                              selected={values.selectedPreset}
                              onSelectPalette={handlePresetChange}
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
                    <FormControlSelect
                      custom
                      marginBottom={false}
                      value={values.fontFamily}
                      error={errors.fontFamily}
                      touched={touched.fontFamily}
                      inputClasses={{
                        input: classes.formControlInputClass
                      }}
                      handleChange={e =>
                        form.setFieldValue('fontFamily', e.target.value)
                      }
                      options={fonts.map(name => ({
                        component: (
                          <span style={{ fontFamily: name }}>{name}</span>
                        ),
                        value: name.toLowerCase()
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
                        <FormControlSelect
                          custom
                          value={values.transition}
                          error={errors.transition}
                          touched={touched.transition}
                          inputClasses={{
                            input: classes.formControlInputClass
                          }}
                          handleChange={e =>
                            form.setFieldValue('transition', e.target.value)
                          }
                          options={transitionOptions.map(name => ({
                            label: name,
                            value: name.toLowerCase()
                          }))}
                          marginBottom={false}
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
                          value={values.transitionSpeed}
                          error={errors.transitionSpeed}
                          touched={touched.transitionSpeed}
                          handleChange={val =>
                            form.setFieldValue('transitionSpeed', val)
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
                        <span className={classes.formLabelTooltip}>
                          Refresh Every
                        </span>
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      value={values.refreshEvery}
                      error={errors.refreshEvery}
                      touched={touched.refreshEvery}
                      onChange={val => form.setFieldValue('refreshEvery', val)}
                      label={''}
                      maxValue={150}
                      minValue={0}
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
