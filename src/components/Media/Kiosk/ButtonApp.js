import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import update from 'immutability-helper'

import { useFormik } from 'formik'
import { get as _get } from 'lodash'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import * as Yup from 'yup'

import {
  withStyles,
  Grid,
  Typography,
  InputLabel,
  CircularProgress,
  Tooltip
} from '@material-ui/core'

import {
  FormControlInput,
  FormControlRadio,
  FormControlSelect,
  FormControlSketchColorPicker
} from '../../Form'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import MediaHtmlCarousel from '../MediaHtmlCarousel'

import { mediaConstants as constants } from '../../../constants'

import { MediaInfo, MediaTabActions } from '../index'

import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  getMediaThemesSettings
} from '../../../utils/mediaUtils'

import {
  clearMediaThemes,
  getThemeOfMediaFeatureById
} from '../../../actions/configActions'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'

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
  smallLoaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,.5)'
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
  tabToggleButtonContainer: {
    justifyContent: 'center',
    background: 'transparent'
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
  templateLabel: {
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: '600',
    padding: '8px 20px',
    background: palette[type].pages.media.local.card.header.background,
    borderTop: `1px solid ${palette[type].pages.media.local.card.border}`,
    borderBottom: `1px solid ${palette[type].pages.media.local.card.border}`,
    color: palette[type].pages.media.local.card.color
  },
  calendarBackground: {
    backgroundColor: palette[type].pages.media.local.card.background,
    width: '208px',
    height: '100%',
    margin: '0 auto',
    borderLeft: `1px solid ${palette[type].pages.media.local.card.border}`,
    borderRight: `1px solid ${palette[type].pages.media.local.card.border}`
  },
  inputLabel: {
    fontSize: '12px',
    display: 'block',
    width: '104px',
    color: palette[type].pages.media.local.card.input.label.color
  },
  numberInput: {
    '& span': {
      width: '75px',
      height: '28px'
    }
  },
  inputField: {
    width: '210px',
    '& input': {
      height: '28px'
    }
  },
  selectInput: {
    width: '210px',
    '& select': {
      height: '28px'
    }
  },
  periodTypeContainer: {
    margin: '14px 0 33px'
  },
  inputClasses: {
    input: {
      height: '28px'
    }
  },
  templateStyleInputRoot: {
    marginBottom: '0'
  },
  colorPickerRoot: {
    width: '210px',
    marginBottom: '0',

    '& input': {
      height: '28px'
    },

    '& span': {
      height: '24px'
    }
  },
  marginTop1: {
    marginTop: '20px'
  },
  marginTop2: {
    marginTop: '7px'
  },
  marginRight1: {
    marginRight: '10px'
  },
  borderBottom: {
    borderBottom: `1px solid ${palette[type].pages.media.local.card.border}`
  },
  templateContainer: {
    padding: '0 18px 28px'
  },
  skinsWrapper: {},
  buttonView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 130
  },
  formControlInputClass: {
    height: '38px !important',
    fontSize: '14px !important'
  },
  formControlNumericInputRootClass: {
    height: '38px !important',

    '& > span': {
      height: '38px !important'
    }
  }
})

const validationSchema = Yup.object().shape({
  label: Yup.string().max(25).required('Enter label'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const clickEffects = [
  {
    value: 'up',
    label: 'Up'
  },
  {
    value: 'none',
    label: 'None'
  },
  {
    value: 'downIn',
    label: 'Down In'
  },
  {
    value: 'leftIn',
    label: 'Left In'
  },
  {
    value: 'clickIn',
    label: 'Click In'
  },
  {
    value: 'rightIn',
    label: 'Right In'
  },
  {
    value: 'clickHover',
    label: 'Click Hover'
  },
  {
    value: 'topToDownHover',
    label: 'Top to Down Hover'
  },
  {
    value: 'leftToRightHover',
    label: 'Left to Right Hover'
  }
]

const additionalFonts = [
  'Arial',
  'Courier New',
  'Times New Roman',
  'Georgia',
  'ScandinavianVIBlack',
  'ScandinavianVILight'
]

const ButtonApp = props => {
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.kiosk)
  const ButtonThemes = useSelector(({ config }) => {
    if (
      config.themeOfMedia &&
      config.themeOfMedia.response &&
      config.themeOfMedia.response.Legacy
    ) {
      return config.themeOfMedia.response.Legacy
    }
    return []
  })
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const initialFormState = useRef({
    templateType: 'Preset'
  })

  const [isLoading, setLoading] = useState(true)
  const [isValueExist, setValueExist] = useState(false)
  const [templateType, setTemplateType] = useState(
    initialFormState.current.templateType
  )
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [defaultSkins, setDefaultSkins] = useState([])
  const [allowedSettings, setAllowedSettings] = useState({})

  const initialFormValues = useRef({
    mediaInfo: { ...constants.mediaInfoInitvalue },
    selectedSlide: null,
    label: '',
    icon: 'fa-info',
    themeSettings: {
      borderRadius: 0,
      fontFamily: '',
      textColor: '',
      background: '',
      clickEffect: '',
      skin: 0,
      shadowColor: ''
    }
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
        selectedSlide,
        icon,
        label,
        themeSettings: {
          borderRadius,
          fontFamily,
          textColor,
          background,
          clickEffect,
          skin,
          shadowColor
        }
      } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        themeId: { $set: selectedSlide },
        featureId: { $set: featureId },
        attributes: {
          $set: {
            label,
            icon,
            theme_settings: {
              border_radius: borderRadius,
              font_family: fontFamily,
              text_color: textColor,
              background_color: background,
              click_effect: clickEffect,
              skin: skin,
              shadow_color: shadowColor
            }
          }
        }
      })

      const actionOptions = {
        mediaName: 'kiosk',
        tabName: selectedTab,
        data: requestData
      }

      form.setTouched({ label: true })

      try {
        await validationSchema.validate(
          { label },
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
        form.setFieldValue('label', form.values.label)
      }
    }
  })

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

  const handleTemplateTypeChanges = (event, templateType) =>
    setTemplateType(templateType)

  const handleSlideClick = slide => {
    form.setFieldValue('selectedSlide', slide.name)
  }

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
        case 'attributes.label':
          formProp = 'label'
          break
        default:
          break
      }
      formErrors[formProp] = errorMsg
    })
  }

  const handleShowPreview = async () => {
    const {
      label,
      icon,
      selectedSlide,
      themeSettings: {
        borderRadius,
        fontFamily,
        textColor,
        background,
        clickEffect,
        skin,
        shadowColor
      }
    } = form.values

    form.setTouched({ label: true })
    try {
      await validationSchema.validate(
        { label },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId: selectedSlide,
          attributes: {
            label,
            icon,
            theme_settings: {
              border_radius: borderRadius,
              font_family: fontFamily,
              text_color: textColor,
              background_color: background,
              click_effect: clickEffect,
              skin: skin,
              shadow_color: shadowColor
            }
          }
        })
      )
    } catch (e) {
      console.log('e', e)
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
          mediaName: 'kiosk',
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
          mediaName: 'kiosk',
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
      setValueExist(true)
    }
    // WebFont.load({
    //   google: {
    //     families: fonts
    //   }
    // })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (backendData && backendData.id && ButtonThemes.length) {
      const {
        themeId,
        icon,
        attributes: {
          label,
          theme_settings: {
            border_radius,
            font_family,
            text_color,
            background_color,
            click_effect,
            skin,
            shadow_color
          }
        }
      } = backendData

      const theme = ButtonThemes.find(t => t.id === themeId)
      if (theme) {
        setAllowedSettings(getMediaThemesSettings(theme.customProperties))
        setDefaultSkins(theme.customProperties.other.conditions.skin)
      }

      initialFormValues.current = {
        ...form.values,
        label,
        icon: icon || 'fa-info',
        selectedSlide: themeId,
        themeSettings: {
          borderRadius: border_radius,
          fontFamily: font_family,
          textColor: text_color,
          background: background_color,
          clickEffect: click_effect,
          skin: skin,
          shadowColor: shadow_color
        },
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      setValueExist(true)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData, ButtonThemes])
  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    if (ButtonThemes.length && !isValueExist && !backendData) {
      const { customProperties } = ButtonThemes[0]
      if (customProperties) {
        setAllowedSettings(getMediaThemesSettings(customProperties))
        const {
          icon,
          label,
          other: {
            conditions: { skin: defaultSkins },
            default_values: {
              skin,
              background_color,
              border_radius,
              click_effect,
              font_family,
              shadow_color,
              text_color
            }
          }
        } = customProperties
        initialFormValues.current = {
          ...form.values,
          label,
          selectedSlide: ButtonThemes[0].id,
          icon: icon,
          themeSettings: {
            borderRadius: border_radius,
            fontFamily: font_family,
            textColor: text_color,
            background: background_color,
            clickEffect: click_effect,
            skin: skin,
            shadowColor: shadow_color
          }
        }
        form.setValues(initialFormValues.current)
        setDefaultSkins(defaultSkins)
        setLoading(false)
      }
    }
    // eslint-disable-next-line
  }, [ButtonThemes])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Kiosk', 'Button')
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

  useEffect(
    () => () => {
      dispatchAction(clearMediaThemes())
    },
    // eslint-disable-next-line
    []
  )

  const { values, errors, touched, submitCount, isValid } = form
  const isButtonsDisable = formSubmitting || (submitCount > 0 && !isValid)
  const selectedTheme = ButtonThemes.find(i => i.id === values.selectedSlide)

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
                  <Typography className={classes.themeHeaderText}>
                    Theme
                  </Typography>
                </header>
                {!ButtonThemes.length && (
                  <div className={classes.smallLoaderWrapper}>
                    <CircularProgress size={10} thickness={5} />
                  </div>
                )}
                {!!ButtonThemes.length && (
                  <MediaHtmlCarousel
                    settings={{
                      infinite: true
                    }}
                    activeSlide={values.selectedSlide}
                    slides={ButtonThemes.map(theme => ({
                      name: theme.id,
                      content: (
                        <Tooltip title={theme.tooltip} placement="top">
                          <img src={theme.thumb} alt={theme.tooltip} />
                        </Tooltip>
                      )
                    }))}
                    onSlideClick={handleSlideClick}
                  />
                )}
              </Grid>
            </Grid>
            <Grid container className={classes.marginTop2}>
              <Grid item xs={12}>
                <Typography className={classes.templateLabel}>
                  Template Style
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container className={classes.borderBottom}>
                  <Grid item xs={12}>
                    <TabToggleButtonGroup
                      className={[
                        classes.tabToggleButtonContainer,
                        classes.periodTypeContainer
                      ].join(' ')}
                      value={templateType}
                      exclusive
                      onChange={handleTemplateTypeChanges}
                    >
                      <TabToggleButton value={'Preset'}>Preset</TabToggleButton>
                      <TabToggleButton value={'Custom'}>Custom</TabToggleButton>
                    </TabToggleButtonGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container className={classes.templateContainer}>
                      <Grid item xs={4} container alignItems="center">
                        <InputLabel className={classes.inputLabel}>
                          Label
                        </InputLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControlInput
                          formControlRootClass={[
                            classes.templateStyleInputRoot,
                            classes.inputField
                          ].join(' ')}
                          value={values.label}
                          error={errors.label}
                          touched={touched.label}
                          handleChange={e =>
                            form.setFieldValue('label', e.target.value)
                          }
                          formControlInputClass={classes.formControlInputClass}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {templateType === 'Preset' && (
                    <Grid item xs={12} className={classes.skinsWrapper}>
                      <Grid container className={classes.templateContainer}>
                        <Grid item xs={12}>
                          <InputLabel className={classes.inputLabel}>
                            Skin
                          </InputLabel>
                        </Grid>
                        <Grid item xs={12}>
                          {defaultSkins.map((skin, index) => (
                            <FormControlRadio
                              key={index}
                              id={index}
                              item={{
                                value: index,
                                component: (
                                  <div
                                    className={classes.buttonView}
                                    style={{
                                      color: skin.text_color,
                                      borderRadius: skin.border_radius,
                                      backgroundColor:
                                        index !== 1 && selectedTheme
                                          ? _get(
                                              selectedTheme,
                                              'customProperties.theme_settings.background_color'
                                            )
                                          : 'transparent',
                                      border:
                                        index === 1 && selectedTheme
                                          ? `1px solid ${_get(
                                              selectedTheme,
                                              'customProperties.theme_settings.background_color',
                                              'transparent'
                                            )}`
                                          : 'none',
                                      width:
                                        index === defaultSkins.length - 1
                                          ? '50px'
                                          : ''
                                    }}
                                  >
                                    {values.label}
                                  </div>
                                )
                              }}
                              selected={values.themeSettings.skin}
                              onChange={val =>
                                form.setFieldValue(
                                  'themeSettings.skin',
                                  val.value
                                )
                              }
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {templateType === 'Custom' && (
                <Grid item xs={12}>
                  <Grid container className={classes.borderBottom}>
                    <Grid item xs>
                      <Grid container className={classes.templateContainer}>
                        <Grid item xs={12}>
                          <Grid
                            container
                            alignItems="center"
                            className={classes.marginTop1}
                          >
                            <Grid item xs={4}>
                              <InputLabel className={classes.inputLabel}>
                                Border Radius
                              </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControlInput
                                name={'themeSettings.borderRadius'}
                                custom={true}
                                formControlRootClass={[
                                  classes.templateStyleInputRoot,
                                  classes.numberInput
                                ].join(' ')}
                                min={allowedSettings.min_border_radius}
                                max={allowedSettings.max_border_radius}
                                value={values.themeSettings.borderRadius}
                                handleChange={(val, name) =>
                                  form.setFieldValue(name, val)
                                }
                                formControlNumericInputRootClass={
                                  classes.formControlNumericInputRootClass
                                }
                                formControlInputClass={
                                  classes.formControlInputClass
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            alignItems="center"
                            className={classes.marginTop1}
                          >
                            <Grid item xs={4}>
                              <InputLabel className={classes.inputLabel}>
                                Font Family
                              </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControlSelect
                                formControlContainerClass={classes.selectInput}
                                custom={true}
                                value={values.themeSettings.fontFamily}
                                error={
                                  errors.themeSettings &&
                                  errors.themeSettings.fontFamily
                                }
                                touched={
                                  touched.themeSettings &&
                                  touched.themeSettings.fontFamily
                                }
                                marginBottom={false}
                                options={[
                                  ...allowedSettings.font_family,
                                  ...additionalFonts
                                ].map(name => ({
                                  component: (
                                    <span style={{ fontFamily: name }}>
                                      {name}
                                    </span>
                                  ),
                                  value: name
                                }))}
                                handleChange={e =>
                                  form.setFieldValue(
                                    'themeSettings.fontFamily',
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            alignItems="center"
                            className={classes.marginTop1}
                          >
                            <Grid item xs={4}>
                              <InputLabel className={classes.inputLabel}>
                                Text Color
                              </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControlSketchColorPicker
                                rootClass={classes.colorPickerRoot}
                                color={values.themeSettings.textColor}
                                onColorChange={value =>
                                  form.setFieldValue(
                                    'themeSettings.textColor',
                                    value
                                  )
                                }
                                formControlInputClass={
                                  classes.formControlInputClass
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            alignItems="center"
                            className={classes.marginTop1}
                          >
                            <Grid item xs={4}>
                              <InputLabel className={classes.inputLabel}>
                                Background Color
                              </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControlSketchColorPicker
                                rootClass={classes.colorPickerRoot}
                                color={values.themeSettings.background}
                                onColorChange={value =>
                                  form.setFieldValue(
                                    'themeSettings.background',
                                    value
                                  )
                                }
                                formControlInputClass={
                                  classes.formControlInputClass
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            alignItems="center"
                            className={classes.marginTop1}
                          >
                            <Grid item xs={4}>
                              <InputLabel className={classes.inputLabel}>
                                Click Effect
                              </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControlSelect
                                custom
                                formControlContainerClass={classes.selectInput}
                                marginBottom={false}
                                value={values.themeSettings.clickEffect}
                                options={clickEffects}
                                handleChange={e =>
                                  form.setFieldValue(
                                    'themeSettings.clickEffect',
                                    e.target.value
                                  )
                                }
                                formControlInputClass={
                                  classes.formControlInputClass
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
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
                disabled={isButtonsDisable}
                onReset={() => {
                  form.resetForm(initialFormValues.current)
                  setTemplateType(initialFormState.current.templateType)
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
    </form>
  )
}

ButtonApp.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

ButtonApp.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default compose(translate('translations'), withStyles(styles))(ButtonApp)
