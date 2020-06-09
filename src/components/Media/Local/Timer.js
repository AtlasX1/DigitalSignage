import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import update from 'immutability-helper'
import { useDispatch, useSelector } from 'react-redux'

import { get as _get, isObject as _isObject } from 'lodash'
import { translate } from 'react-i18next'
import moment from 'moment'
import draftToHtml from 'draftjs-to-html'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import { FormControlInput, FormControlSelect, WysiwygEditor } from '../../Form'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import { MediaInfo, MediaTabActions } from '../index'
import { mediaConstants as constants } from '../../../constants'

import {
  createMediaPostData,
  getMediaInfoFromBackendData,
  getMediaThemesSettings
} from '../../../utils/mediaUtils'

import { stringToNumber } from '../../../utils/numbers'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'

import MediaThemeSelector from '../MediaThemeSelector'
import {
  FormControlDateTimePicker,
  FormControlTimeDurationPicker,
  FormControlSketchColorPicker
} from '../../Form'
import useMediaTheme from 'hooks/useMediaTheme'

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

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '15px 30px',
      fontFamily: typography.fontFamily
    },
    formWrapper: {
      position: 'relative',
      height: '100%'
    },
    overflowColumnWrapper: {
      overflow: 'auto',
      maxHeight: '100%'
    },
    tabContent: {
      height: '100%'
    },
    colorPickerRootClass: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      width: '100%'
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
      boxShadow: 'none',
      marginTop: 30
    },
    previewMediaText: {
      ...typography.lightText[type]
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
    tabToggleButton: {
      width: '128px'
    },
    themeOptions1: {
      padding: '0 15px',
      margin: '12px 0'
    },
    formControlInput: {
      marginBottom: 0
    },
    formControlLabel: {
      fontSize: '12px',
      marginRight: '9px'
    },
    formControlSelectLabel: {
      fontSize: '1.0833rem'
    },
    marginTop: {
      marginTop: 16
    },
    marginTop2: {
      marginTop: 8
    },
    durationWrapper: {
      marginBottom: 9,
      textTransform: 'capitalize'
    },
    inputClass: {
      width: '100%'
    },
    errorMessage: {
      padding: '5px 20px',
      fontSize: 12,
      color: 'red'
    }
  }
}

const modes = [
  {
    label: 'Date',
    value: 'date'
  },
  {
    label: 'Duration',
    value: 'duration'
  },
  {
    label: 'Daily',
    value: 'daily'
  }
]

const validationSchema = Yup.object().shape({
  themeId: Yup.number().required('Select theme'),
  date: Yup.string().when('mode', {
    is: 'date',
    then: Yup.string().required('Select date')
  }),
  duration: Yup.string().when('mode', {
    is: 'duration',
    then: Yup.string().required('Enter timer duration')
  }),
  daily: Yup.string().when('mode', {
    is: 'daily',
    then: Yup.string().required('Enter timer duration')
  }),
  complete_text: Yup.string().required('Enter complete text'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const MediaTimer = props => {
  const {
    t,
    classes,
    mode,
    backendData,
    selectedTab,
    customClasses,
    onModalClose,
    onShareStateCallback
  } = props

  const dispatchAction = useDispatch()
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.local)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const initialFormState = useRef({
    themeType: 'Modern'
  })

  const [themeType, setThemeType] = useState(initialFormState.current.themeType)
  const [themes, setThemes] = useState([])

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [allowedThemeSetting, setAllowedThemeSetting] = useState(undefined)

  const [countUpDate, setCountUpDate] = useState(moment().format('YYYY-MM-DD'))
  const [countUpTime, setCountUpTime] = useState(moment().format('HH:mm:ss'))

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const { themes: themesReducer, featureId } = useMediaTheme('Local', 'Timer')

  const initialFormValues = useRef({
    themeId: undefined,
    type: 'countDown',
    mode: 'date',
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    duration: '00:00:00',
    daily: '00:00:00',
    format: '%D Days, %H:%M:%S',
    complete_text: '',
    font_family: '',
    font_color: '',
    theme_settings: {},
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
      const { themeId } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const timerData = prepareData()

      const requestData = update(postData, {
        themeId: { $set: themeId },
        featureId: { $set: featureId },
        attributes: {
          $set: {
            ...timerData
          }
        }
      })

      const actionOptions = {
        mediaName: 'local',
        tabName: selectedTab,
        data: requestData
      }

      try {
        if (mode === 'add') {
          dispatchAction(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatchAction(editMedia({ ...actionOptions, id: mediaId }))
        }

        setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('show', form.values.show)
      }
    }
  })

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
          mediaName: 'local',
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
    if (
      _get(themesReducer, themeType) &&
      _get(themesReducer, themeType).length &&
      !backendData
    ) {
      const allowedThemeSetting = getMediaThemesSettings(
        themesReducer[themeType][0].customProperties
      )
      const defaultThemeSetting = getMediaThemesSettings(
        themesReducer[themeType][0].customProperties,
        true
      )

      setAllowedThemeSetting(allowedThemeSetting)

      const newValues = {
        ...form.values,
        themeId: themesReducer[themeType][0].id,
        ...(defaultThemeSetting && { theme_settings: defaultThemeSetting })
      }
      if (!form.values.themeId) {
        initialFormValues.current = newValues
      }
      form.setValues(newValues)
    }

    if (
      _get(themesReducer, themeType) &&
      _get(themesReducer, themeType).length
    ) {
      setThemes(_get(themesReducer, themeType))
    }
    // eslint-disable-next-line
  }, [themesReducer, themeType])

  useEffect(() => {
    if (
      backendData &&
      backendData.id &&
      _get(themesReducer, themeType) &&
      _get(themesReducer, themeType).length
    ) {
      const { themeId, attributes } = backendData

      let theme = themesReducer.Modern.find(i => i.id === themeId)

      if (!theme) {
        initialFormState.current.themeType = 'Legacy'
        setThemeType('Legacy')
        theme = themesReducer.Legacy.find(i => i.id === themeId)
      }

      if (_get(theme, 'customProperties')) {
        const allowedThemeSetting = getMediaThemesSettings(
          theme.customProperties
        )
        setAllowedThemeSetting(allowedThemeSetting)
      }

      const content = htmlToDraft(attributes.complete_text)
      const contentState = ContentState.createFromBlockArray(
        content.contentBlocks
      )
      setEditorState(EditorState.createWithContent(contentState))

      if (attributes.mode !== 'date') {
        initialFormValues.current = {
          ...form.values,
          themeId,
          ...attributes,
          [attributes.mode]:
            attributes[`${attributes.mode}_hour`] +
            ':' +
            attributes[`${attributes.mode}_minute`] +
            ':' +
            attributes[`${attributes.mode}_second`],
          mediaInfo: getMediaInfoFromBackendData(backendData)
        }
      } else {
        initialFormValues.current = {
          ...form.values,
          themeId,
          ...attributes,
          mediaInfo: getMediaInfoFromBackendData(backendData)
        }
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData, themesReducer])

  useEffect(
    () => {
      form.setFieldValue('date', `${countUpDate} ${countUpTime}`)
    },
    // eslint-disable-next-line
    [countUpTime, countUpDate]
  )

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
  }

  const handleSlideClick = themeId => {
    const theme = themesReducer[themeType].find(i => i.id === themeId)

    const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
    const defaultThemeSetting = getMediaThemesSettings(
      theme.customProperties,
      true
    )

    setAllowedThemeSetting(allowedThemeSetting)

    form.setValues({
      ...form.values,
      themeId,
      ...(defaultThemeSetting && { theme_settings: defaultThemeSetting })
    })
  }

  const handleShowPreview = async () => {
    const {
      themeId,
      date,
      duration,
      daily,
      complete_text,
      font_family,
      font_color
    } = form.values

    form.setTouched({
      themeId: true,
      date: true,
      duration: true,
      daily: true,
      complete_text: true
    })
    try {
      const timerData = prepareData()

      await validationSchema.validate(
        { themeId, date, duration, daily, complete_text },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            ...timerData,
            ...(themeType === 'Modern' && {
              theme_settings: {
                font_family,
                font_color
              }
            })
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  const prepareData = () => {
    const {
      type,
      mode,
      date,
      duration,
      daily,
      format,
      theme_settings
    } = form.values

    if (type === 'countDown') {
      switch (mode) {
        case 'date':
          return {
            type,
            mode,
            format,
            date: date + ':00',
            complete_text: draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            ),
            theme_settings
          }
        case 'duration':
          return {
            type,
            mode,
            format,
            duration_hour: stringToNumber(duration.split(':')[0]),
            duration_minute: stringToNumber(duration.split(':')[1]),
            duration_second: stringToNumber(duration.split(':')[2]),
            complete_text: draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            ),
            theme_settings
          }
        case 'daily':
          return {
            type,
            mode,
            format,
            daily_hour: stringToNumber(daily.split(':')[0]),
            daily_minute: stringToNumber(daily.split(':')[1]),
            daily_second: stringToNumber(daily.split(':')[2]),
            complete_text: draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            ),
            theme_settings
          }
        default:
          break
      }
    } else {
      return {
        type,
        date,
        theme_settings
      }
    }
  }

  const getSelectedTabContent = () => {
    switch (form.values.type) {
      case 'countDown':
        return (
          <Grid
            container
            justify="space-between"
            spacing={16}
            className={classes.marginTop2}
          >
            <Grid item xs={6}>
              <FormControlSelect
                custom={true}
                label={'Mode'}
                marginBottom={false}
                formControlLabelClass={classes.formControlSelectLabel}
                formControlContainerClass={classes.selectInput}
                value={values.mode}
                error={errors.mode}
                touched={touched.mode}
                options={modes.map(({ label, value }) => ({
                  component: <span>{label}</span>,
                  value
                }))}
                handleChange={e => form.setFieldValue('mode', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              {values.mode === 'date' && (
                <FormControlDateTimePicker
                  label={'Date:'}
                  customClasses={{
                    labelWrapperClass: classes.durationWrapper,
                    buttonClass: classes.inputClass
                  }}
                  handleChange={val => form.setFieldValue(values.mode, val)}
                  initialValue={values.date}
                  error={form.date}
                  touched={form.date}
                  format={'YYYY-MM-DD'}
                />
              )}
              {values.mode !== 'date' && (
                <FormControlTimeDurationPicker
                  label={values.mode + ':'}
                  value={values[values.mode]}
                  customClasses={{
                    labelWrapperClass: classes.durationWrapper
                  }}
                  onChange={val => form.setFieldValue(values.mode, val)}
                />
              )}
            </Grid>
          </Grid>
        )
      case 'countUp':
        return (
          <Grid
            container
            justify="space-between"
            spacing={16}
            className={classes.marginTop2}
          >
            <Grid item xs={6}>
              <FormControlDateTimePicker
                label={'Date'}
                customClasses={{
                  labelWrapperClass: classes.durationWrapper,
                  buttonClass: classes.inputClass
                }}
                handleChange={val => setCountUpDate(val)}
                initialValue={countUpDate}
                error={form.date}
                touched={form.date}
                format={'YYYY-MM-DD'}
                isTime={false}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlTimeDurationPicker
                label={'Time'}
                value={countUpTime}
                customClasses={{
                  labelWrapperClass: classes.durationWrapper
                }}
                onChange={val => setCountUpTime(val)}
              />
            </Grid>
          </Grid>
        )
      default:
        return
    }
  }

  const getLegacyThemeContent = (item, key, parentKey) => {
    const colorFields = [
      'days_bg',
      'days_border',
      'hours_bg',
      'hours_border',
      'minutes_bg',
      'minutes_border',
      'seconds_bg',
      'seconds_border'
    ]

    const textFields = [
      'days_text',
      'hours_text',
      'minutes_text',
      'seconds_text'
    ]

    const valuePath =
      parentKey && values.theme_settings[parentKey]
        ? `theme_settings.${parentKey}.${key}`
        : `theme_settings.${key}`
    const value =
      parentKey && values.theme_settings[parentKey]
        ? values.theme_settings[parentKey][key]
        : values.theme_settings[key]

    if (Array.isArray(item)) {
      return (
        <Grid item xs={6} key={key}>
          <FormControlSelect
            label={t(key)}
            formControlContainerClass={classes.selectInput}
            custom={true}
            value={value}
            options={item.map(name => ({
              component: <span>{name}</span>,
              value: name
            }))}
            handleChange={e => form.setFieldValue(valuePath, e.target.value)}
          />
        </Grid>
      )
    } else if (key.includes('_color') || colorFields.includes(key)) {
      return (
        <Grid item xs={6} key={key}>
          <FormControlSketchColorPicker
            marginBottom={false}
            label={t(key)}
            formControlInputWrapClass={classes.inputClass}
            formControlInputRootClass={classes.inputClass}
            formControlInputClass={classes.inputClass}
            rootClass={classes.colorPickerRootClass}
            color={value}
            onColorChange={color => form.setFieldValue(valuePath, color)}
          />
        </Grid>
      )
    } else if (textFields.includes(key)) {
      return (
        <Grid item xs={6} key={key}>
          <FormControlInput
            label={t(key)}
            formControlRootClass={[
              classes.templateStyleInputRoot,
              classes.numberInput
            ].join(' ')}
            value={value}
            handleChange={e => form.setFieldValue(valuePath, e.target.value)}
            formControlInputClass={classes.formControlInputClass}
            formControlNumericInputRootClass={
              classes.formControlNumericInputRootClass
            }
          />
        </Grid>
      )
    } else if (!Array.isArray(item) && _isObject(item)) {
      return Object.keys(item).map(childKey =>
        getLegacyThemeContent(item[childKey], childKey, key)
      )
    } else return null
  }

  const { values, errors, touched } = form

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Timer Theme
                      </Typography>
                    </Grid>
                  </Grid>
                </header>
                <Grid container justify="space-between" alignItems="center">
                  {!!themes.length && (
                    <MediaThemeSelector
                      value={themeType}
                      onChange={(e, val) => setThemeType(val)}
                      carousel={{
                        customClasses: {
                          root: classes.sliderRoot,
                          sliderItem: classes.sliderItem
                        },
                        settings: {
                          infinite: false
                        },
                        slides: themes.map(theme => ({
                          name: theme.id,
                          content: (
                            <Tooltip title={theme.tooltip}>
                              <img src={theme.thumb} alt={theme.id} />
                            </Tooltip>
                          )
                        })),
                        activeSlide: values.themeId,
                        onSlideClick: t => handleSlideClick(t.name),
                        error: errors.themeId,
                        touched: touched.themeId
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop}>
              <Grid item>
                <TabToggleButtonGroup
                  value={values.type}
                  exclusive
                  onChange={(e, v) => form.setFieldValue('type', v)}
                >
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value={'countDown'}
                  >
                    Countdown
                  </TabToggleButton>
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value={'countUp'}
                  >
                    Countup
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.marginTop1}
            >
              {getSelectedTabContent()}
            </Grid>
            {themeType === 'Modern' && (
              <Grid
                container
                justify="space-between"
                className={classes.marginTop2}
                spacing={16}
              >
                <Grid item xs={6}>
                  <FormControlSelect
                    custom
                    label={'Font Family'}
                    marginBottom={false}
                    value={values.font_family}
                    inputClasses={{
                      input: classes.formControlInput
                    }}
                    handleChange={e =>
                      form.setFieldValue('font_family', e.target.value)
                    }
                    options={fonts.map(name => ({
                      component: (
                        <span style={{ fontFamily: name }}>{name}</span>
                      ),
                      value: name.toLowerCase()
                    }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlSketchColorPicker
                    marginBottom={false}
                    label={'Font Color'}
                    formControlInputWrapClass={classes.inputClass}
                    formControlInputClass={classes.inputClass}
                    rootClass={classes.colorPickerRootClass}
                    color={values.font_color}
                    onColorChange={color =>
                      form.setFieldValue(`font_color`, color)
                    }
                  />
                </Grid>
              </Grid>
            )}
            <Grid
              container
              justify="space-between"
              className={classes.marginTop2}
              spacing={16}
            >
              {!!allowedThemeSetting &&
                Object.keys(allowedThemeSetting).map(key =>
                  getLegacyThemeContent(allowedThemeSetting[key], key)
                )}
            </Grid>
            <Grid container className={classes.marginTop}>
              <Grid item>
                <WysiwygEditor
                  label={'Display text on countdown completion:'}
                  editorState={editorState}
                  onChange={e => {
                    form.setFieldValue('complete_text', 'value')
                    setEditorState(e.target.value)
                  }}
                />
                {touched.complete_text && errors.complete_text && (
                  <Typography className={classes.errorMessage}>
                    {errors.complete_text}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container justify="flex-start">
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
                onReset={() => {
                  form.resetForm(initialFormValues.current)
                  setThemeType(initialFormState.current.themeType)

                  const theme = themesReducer[
                    initialFormState.current.themeType
                  ].find(i => i.id === initialFormValues.current.themeId)
                  if (theme) {
                    const allowedThemeSetting = getMediaThemesSettings(
                      theme.customProperties
                    )

                    setAllowedThemeSetting(allowedThemeSetting)
                  }
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

MediaTimer.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

MediaTimer.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(MediaTimer))
