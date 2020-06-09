import { Grid, Typography, withStyles } from '@material-ui/core'
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
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import * as Yup from 'yup'
import { MediaInfo, MediaTabActions } from '..'
import { mediaConstants } from '../../../constants'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
import {
  FormControlInput,
  FormControlReactSelect,
  FormControlSketchColorPicker
} from '../../Form'
import MediaThemeSelector from '../MediaThemeSelector'
import useMediaTheme from 'hooks/useMediaTheme'

const styles = ({ palette, type, typography, formControls }) => {
  return {
    root: {
      padding: '15px 30px',
      fontFamily: typography.fontFamily,
      borderRight: `solid 1px ${palette[type].pages.media.card.border}`
    },
    formWrapper: {
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

    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },

    marginBottom: {
      marginBottom: 5
    },

    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.background,
      borderRadius: '4px'
    },
    themeCardHide: {
      display: 'none'
    },
    themeCardForm: { padding: '15px' },
    mediaThemeSelector: {
      border: 'none',
      borderRadius: '0px',
      background: 'none'
    },

    inputContainer: {
      padding: '0 8px'
    },
    label: {
      fontSize: '16px',
      fontWeight: '300',
      transform: 'translate(0, 1.5px) scale(0.75)',
      whiteSpace: 'nowrap'
    },

    switchContainerClass: {
      width: 'fit-content'
    },
    switchLabelClass: {
      fontSize: '13px'
    },

    formControlRootClass: {
      width: '100%',
      justifyContent: 'space-between'
    },
    formControlInputClass: {
      fontSize: '14px'
    },
    formControlNumericInputRootClass: {
      height: '38px !important',
      fontSize: '14px',
      '& > span': {
        height: '38px !important'
      }
    },

    sliderInputClass: {
      width: '46px'
    },
    sliderInputLabel: {
      ...formControls.mediaApps.refreshEverySlider.label,
      lineHeight: '15px',
      marginRight: '15px'
    },
    inputLabel: {
      fontSize: '12px',
      display: 'block',
      color: '#4C5057',
      marginRight: '10px'
    },
    formControlSelectLabelClass: {
      fontSize: '1.0833rem'
    },

    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none',
      marginTop: 45
    },
    previewMediaText: {
      ...typography.lightText[type]
    }
  }
}

const Clock = ({
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
  const intitialFromState = useRef({
    themeCategory: 'Modern'
  })
  const [themeCategory, setThemeCategory] = useState(
    intitialFromState.current.themeCategory
  )
  const [cities, setCities] = useState([])
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.local)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const { configMediaCategory } = useSelector(({ config }) => config)

  const { themes, featureId } = useMediaTheme('Local', 'Clock')
  const previewThemes = useMemo(() => {
    const analogThemes = themes.Analog || []
    const digitalThemes = themes.Digital || []
    if (!analogThemes.length || !digitalThemes.length) {
      return {}
    }
    return {
      analog: {
        Modern: analogThemes.length
          ? analogThemes.filter(({ tooltip }) =>
              new RegExp('^Modern+', 'i').test(tooltip)
            )
          : [],
        Legacy: analogThemes.length
          ? analogThemes.filter(({ tooltip }) =>
              new RegExp('^Legacy+', 'i').test(tooltip)
            )
          : []
      },
      digital: {
        Modern: digitalThemes.length
          ? digitalThemes.filter(({ tooltip }) =>
              new RegExp('^Modern+', 'i').test(tooltip)
            )
          : [],
        Legacy: digitalThemes.length
          ? digitalThemes.filter(({ tooltip }) =>
              new RegExp('^Legacy+', 'i').test(tooltip)
            )
          : []
      }
    }
  }, [themes])

  const initialFormValues = useRef({
    theme_type: 'analog',
    themeId: 0,
    use_system_time: true,
    city: 'Newport',
    date_format: 1,
    transparent_background: false,
    text: 'Arial',
    text_size: 15,
    text_color: 'rgba(255,255,255,1)',
    background: 'rgba(0,0,0,1)',
    border: 'rgba(0,0,0,1)',
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
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer

    if (response) {
      form.resetForm()
      props.onShowSnackbar(t('Successfully added'))

      dispatch(
        clearAddedMedia({
          mediaName: 'local',
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
    if (backendData && backendData.id) {
      initialFormValues.current = {
        ...backendData.attributes,
        themeId: backendData.themeId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      intitialFromState.current.themeCategory =
        backendData.attributes.themeCategory
      setThemeCategory(intitialFromState.current.themeCategory)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    setCities(
      configMediaCategory.cities && configMediaCategory.cities.length > 0
        ? configMediaCategory.cities
        : []
    )
  }, [configMediaCategory])

  const validationSchema = Yup.object().shape({
    themeId: Yup.number().required().moreThan(0, 'Please select a theme'),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Please enter a valid title')
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
      const {
        theme_type,
        themeId,
        use_system_time,
        city,
        date_format,
        transparent_background,
        text,
        text_size,
        text_color,
        background,
        border,
        mediaInfo
      } = values
      const postData = createMediaPostData(mediaInfo, mode)
      const requestData = update(postData, {
        title: { $set: mediaInfo.title },
        featureId: { $set: featureId },
        themeId: { $set: themeId },
        attributes: {
          $set: {
            theme_type: theme_type,
            themeCategory: themeCategory,
            use_system_time: use_system_time
          }
        }
      })

      if (!use_system_time && city.length > 0) {
        requestData.attributes['city'] = city
      }

      if (theme_type === 'digital') {
        requestData.attributes['date_format'] = date_format

        if (themeCategory === 'Legacy') {
          requestData.attributes = {
            ...requestData.attributes,
            text: text,
            text_size: text_size,
            text_color: text_color,
            border: border,
            background: background
          }
        }
        requestData.attributes[
          'transparent_background'
        ] = transparent_background
      }

      const actionOptions = {
        mediaName: 'local',
        tabName: selectedTab,
        data: requestData
      }

      try {
        if (mode === 'add') {
          await validationSchema.validate(
            {
              themeId
            },
            { strict: true, abortEarly: false }
          )
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
    const previewPayload = {
      title: form.values.mediaInfo.title,
      featureId: featureId,
      themeId: form.values.themeId,
      attributes: {
        theme_type: form.values.theme_type,
        use_system_time: form.values.use_system_time
      }
    }

    if (!form.values.use_system_time && form.values.city.length > 0) {
      previewPayload.attributes['city'] = form.values.city
    }

    if (form.values.theme_type === 'digital') {
      previewPayload.attributes['date_format'] = form.values.date_format

      if (themeCategory === 'Legacy') {
        previewPayload.attributes = {
          ...previewPayload.attributes,
          text: form.values.text,
          text_size: form.values.text_size,
          text_color: form.values.text_color,
          border: form.values.border,
          background: form.values.background
        }
      }
      previewPayload.attributes['transparent_background'] =
        form.values.transparent_background
    }

    const { themeId } = form.values
    form.setTouched({
      themeId: true
    })

    try {
      await validationSchema.validate(
        {
          themeId
        },
        { strict: true, abortEarly: false }
      )
      generatePreview(previewPayload)
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
      <Grid item xs={7} className={classes.root}>
        <Grid container justify="center">
          <Grid
            item
            xs={12}
            className={[classes.themeCardWrap, classes.marginBottom].join(' ')}
          >
            <header className={classes.themeHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography className={classes.themeHeaderText}>
                    {t('Clock Theme')}
                  </Typography>
                </Grid>
                <Grid item>
                  <TabToggleButtonGroup
                    className={classes.tabToggleButtonContainer}
                    value={form.values.theme_type}
                    exclusive
                    onChange={(_, value) =>
                      form.setFieldValue('theme_type', value)
                    }
                  >
                    <TabToggleButton value={'analog'}>
                      {t('Analog')}
                    </TabToggleButton>
                    <TabToggleButton value={'digital'}>
                      {t('Digital')}
                    </TabToggleButton>
                  </TabToggleButtonGroup>
                </Grid>
              </Grid>
            </header>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={12}>
                <MediaThemeSelector
                  classes={{ themeCardWrap: classes.mediaThemeSelector }}
                  value={themeCategory}
                  onChange={(_, value) => setThemeCategory(value)}
                  carousel={{
                    error: form.errors.themeId,
                    touched: form.touched.themeId,
                    settings: {
                      infinite: false
                    },
                    onSlideClick: ({ name }) =>
                      form.setFieldValue('themeId', name),
                    activeSlide: form.values.themeId,
                    slides:
                      Object.values(previewThemes).length > 0
                        ? previewThemes[[form.values.theme_type]][
                            themeCategory
                          ].map(theme => {
                            return {
                              name: theme.id,
                              tooltip: theme.tooltip,
                              thumbDimension: theme.thumbDimension,
                              content: (
                                <img src={theme.thumb} alt={theme.name} />
                              )
                            }
                          })
                        : []
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.marginBottom}>
          <Grid item>
            <CheckboxSwitcher
              label={t('Use System Time')}
              value={form.values.use_system_time}
              handleChange={checked =>
                form.setFieldValue('use_system_time', checked)
              }
              switchContainerClass={classes.switchContainerClass}
              formControlRootClass={classes.formControlRootClass}
              formControlLabelClass={classes.switchLabelClass}
            />
          </Grid>
        </Grid>
        <Grid container>
          {form.values.theme_type === 'analog'
            ? !form.values.use_system_time && (
                <Grid
                  item
                  xs={12}
                  className={[
                    classes.themeCardWrap,
                    classes.themeCardForm
                  ].join(' ')}
                >
                  <Grid item xs={12}>
                    <FormControlReactSelect
                      label={`${t('City')}:`}
                      placeholder={t('Select City')}
                      value={{
                        label: form.values.city,
                        value: form.values.city
                      }}
                      handleChange={event =>
                        form.setFieldValue('city', event.target.value)
                      }
                      formControlLabelClass={classes.label}
                      marginBottom={'16px'}
                      options={cities.map(item => ({
                        label: `${item.name}, ${item.state}, ${item.country}`,
                        value: item.name,
                        data: item
                      }))}
                    />
                  </Grid>
                </Grid>
              )
            : form.values.theme_type === 'digital' && (
                <Grid
                  item
                  container
                  xs={12}
                  className={[
                    classes.themeCardForm,
                    form.values.theme_type === 'digital' &&
                    themeCategory === 'Modern' &&
                    form.values.use_system_time
                      ? classes.themeCardHide
                      : classes.themeCardWrap
                  ].join(' ')}
                >
                  {!form.values.use_system_time && (
                    <Grid item xs={12}>
                      <FormControlReactSelect
                        label={`${t('City')}:`}
                        placeholder={t('Select City')}
                        value={{
                          label: form.values.city,
                          value: form.values.city
                        }}
                        handleChange={event =>
                          form.setFieldValue('city', event.target.value)
                        }
                        formControlLabelClass={classes.label}
                        marginBottom={'16px'}
                        options={cities.map(item => ({
                          label: `${item.name}, ${item.state}, ${item.country}`,
                          value: item.name,
                          data: item
                        }))}
                      />
                    </Grid>
                  )}
                  {themeCategory === 'Legacy' && (
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <FormControlReactSelect
                          label={t('Font Family')}
                          value={{
                            label: form.values.text,
                            value: form.values.text
                          }}
                          handleChange={event =>
                            form.setFieldValue('text', event.target.value)
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
                            label: name,
                            value: name
                          }))}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlSketchColorPicker
                          label={t('Font Color')}
                          color={form.values.text_color}
                          onColorChange={color => {
                            form.setFieldValue('text_color', color)
                          }}
                          formControlLabelClass={classes.label}
                          rootClass={classes.formControlInputClass}
                        />
                      </Grid>
                      <Grid item xs={3} className={classes.inputContainer}>
                        <FormControlInput
                          min={5}
                          max={50}
                          custom
                          marginBottom
                          label={t('Font Size')}
                          value={form.values.text_size}
                          handleChange={value =>
                            form.setFieldValue('text_size', value)
                          }
                          formControlLabelClass={classes.label}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                        />
                      </Grid>
                      <Grid item xs={3} className={classes.inputContainer}>
                        <FormControlInput
                          min={1}
                          max={11}
                          custom
                          marginBottom
                          label={t('Date Format')}
                          value={form.values.date_format}
                          handleChange={value =>
                            form.setFieldValue('date_format', value)
                          }
                          formControlLabelClass={classes.label}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.inputContainer}>
                        <FormControlSketchColorPicker
                          label={t('Border Color')}
                          color={form.values.border}
                          onColorChange={color => {
                            form.setFieldValue('border', color)
                          }}
                          formControlLabelClass={classes.label}
                          rootClass={classes.formControlInputClass}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.inputContainer}>
                        <CheckboxSwitcher
                          label={t('Transparent Background')}
                          value={form.values.transparent_background}
                          handleChange={checked =>
                            form.setFieldValue(
                              'transparent_background',
                              checked
                            )
                          }
                          switchContainerClass={classes.switchContainerClass}
                          formControlRootClass={classes.formControlRootClass}
                          formControlLabelClass={classes.switchLabelClass}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.inputContainer}>
                        {!form.values.transparent_background && (
                          <FormControlSketchColorPicker
                            label={t('Background Color')}
                            color={form.values.background}
                            onColorChange={color => {
                              form.setFieldValue('background', color)
                            }}
                            formControlLabelClass={classes.label}
                            rootClass={classes.formControlInputClass}
                          />
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
        </Grid>

        <Grid container justify="flex-start">
          <Grid item>
            <WhiteButton
              onClick={handleShowPreview}
              className={classes.previewMediaBtn}
            >
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>
        </Grid>
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
              disabled={disableSubmission}
              onReset={() => {
                form.resetForm(initialFormValues.current)
                setThemeCategory(intitialFromState.current.themeCategory)
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

Clock.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Clock.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Clock))
