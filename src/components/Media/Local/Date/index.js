import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import update from 'immutability-helper'

import { useFormik } from 'formik'
import { get as _get } from 'lodash'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'

import * as Yup from 'yup'

import {
  withStyles,
  Grid,
  Typography,
  CircularProgress,
  Tooltip
} from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../../Buttons'

import MediaHtmlCarousel from '../../MediaHtmlCarousel'

import { mediaConstants as constants } from '../../../../constants'

import { MediaInfo, MediaTabActions } from '../../index'

import FormControlDateTimePicker from '../../../Form/FormControlDateTimePicker'

import {
  clearMediaThemes,
  getThemeOfMediaFeatureById
} from '../../../../actions/configActions'

import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  getMediaThemesSettings
} from '../../../../utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../../actions/mediaActions'
import LegacyThemeContent from './LegacyThemeContent'
import ModernThemeContent from './ModerThemeContent'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      margin: '22px 25px',
      fontFamily: typography.fontFamily
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
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none',
      marginTop: '59px'
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
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    formControlRootClass: {
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: '0'
    },
    themeOptions1: {
      padding: '0 15px',
      margin: '12px 0'
    },
    inputItem: {
      padding: '0 10px',
      margin: '0 -10px 24px'
    },
    switchContainerClass: {
      width: '160px'
    },
    lastUpdatedSwitch: {
      margin: '0 auto'
    },
    mapViewClasses: {
      width: '230px',
      marginTop: '35px'
    },
    detailLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px'
    },
    fileTypeLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500',
      marginRight: '27px',
      '&:last-of-type': {
        marginRight: '0'
      }
    },
    showContentContainer: {
      padding: '0 15px',
      margin: '16px 0 20px'
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
      color: palette[type].pages.media.local.card.input.label.color
    },
    numberInput: {
      '& span': {
        width: 75,
        height: '28px'
      }
    },
    selectInput: {
      width: '210px',
      '& select': {
        height: '28px'
      }
    },
    colorInput: {
      width: 210,
      height: '28px'
    },
    periodTypeContainer: {
      margin: '14px 0 33px'
    },
    marginTop1: {
      marginTop: '24px'
    },
    marginTop2: {
      marginTop: '23px'
    },
    marginTop3: {
      marginTop: '12px'
    },
    marginRight1: {
      marginRight: '10px'
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
    templateContainer: {
      padding: '0 18px 28px'
    },
    borderBottom: {
      borderBottom: `1px solid ${palette[type].pages.media.local.card.border}`
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
    },
    formControlColorPickerInputClass: {
      fontSize: 14,
      height: '38px !important'
    }
  }
}

const validationSchema = Yup.object().shape({
  show: Yup.string().required(),
  themeId: Yup.number().required('Select theme'),
  selected_date: Yup.string().when('show', {
    is: 'selected_date',
    then: Yup.string().required('Select a date!')
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Date = props => {
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

  const DateThemes = useSelector(({ config }) => {
    if (config.themeOfMedia && config.themeOfMedia.response) {
      return config.themeOfMedia.response
    }
    return []
  })

  const initialFormState = useRef({
    themeType: 'Modern',
    selectedShowType: 'today',
    selectedPeriodType: 'date'
  })

  const [isLoading, setLoading] = useState(true)
  const [featureId, setFeatureId] = useState(null)
  const [themeType, setThemeType] = useState(initialFormState.current.themeType)
  const [selectedShowType, setSelectedShowType] = useState(
    initialFormState.current.selectedShowType
  )
  const [selectedPeriodType, setSelectedPeriodType] = useState(
    initialFormState.current.selectedPeriodType
  )
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [allowedThemeSetting, setAllowedThemeSetting] = useState({})
  const [dateThemes, setDateThemes] = useState([])

  const initialFormValues = useRef({
    mediaInfo: { ...constants.mediaInfoInitvalue },
    themeId: null,
    show: 'today',
    selected_date: '',
    theme_settings: {
      date: {
        height: null,
        text_size: null,
        text_color: '',
        font_family: 'Arial',
        background_color: ''
      },
      month: {
        height: null,
        text_size: null,
        text_color: '',
        font_family: 'Arial',
        background_color: ''
      },
      day: {
        height: null,
        text_size: null,
        text_color: '',
        font_family: 'Arial',
        background_color: ''
      }
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
      const { themeId, show, selected_date, theme_settings } = values
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        themeId: { $set: themeId },
        featureId: { $set: featureId },
        attributes: {
          $set: {
            show,
            ...(show !== 'today' && { selected_date }),
            theme_settings
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

  const handleDateTypeChanges = (event, themeType) => {
    if (themeType) {
      setThemeType(themeType)
    }
  }

  const handleShowTypeChanges = (event, selectedShowType) => {
    if (selectedShowType) {
      form.setFieldValue('show', selectedShowType)
      setSelectedShowType(selectedShowType)
    }
  }

  const handlePeriodTypeChanges = (event, selectedPeriodType) => {
    if (selectedPeriodType) {
      setSelectedPeriodType(selectedPeriodType)
    }
  }

  const getSelectedShowTypeContent = () => {
    switch (selectedShowType) {
      case 'today':
        return null
      case 'selected_date':
        return (
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.showContentContainer}
          >
            <Grid item xs={4}>
              <FormControlDateTimePicker
                handleChange={val => form.setFieldValue('selected_date', val)}
                initialValue={form.values.selected_date}
                error={form.errors.selected_date}
                touched={form.touched.selected_date}
                format={'YYYY-MM-DD'}
                isTime={false}
              />
            </Grid>
          </Grid>
        )
      default:
        return
    }
  }

  const handleSlideClick = themeId => {
    const theme = DateThemes[themeType].find(i => i.id === themeId)
    const defaultTheme = getMediaThemesSettings(theme.customProperties, true)
    const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
    setAllowedThemeSetting(allowedThemeSetting)

    if (allowedThemeSetting.hasOwnProperty('day')) {
      setSelectedPeriodType('day')
    } else {
      setSelectedPeriodType('date')
    }

    form.setValues({
      ...form.values,
      themeId: theme.id,
      theme_settings: defaultTheme
    })
  }

  const handleShowPreview = async () => {
    const { themeId, show, selected_date, theme_settings } = form.values

    form.setTouched({ show: true, themeId: true })
    if (show !== 'today') form.setTouched({ selected_date: true })
    try {
      await validationSchema.validate(
        { themeId, show, ...(show !== 'today' && { selected_date }) },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            show,
            ...(show !== 'today' && { selected_date }),
            theme_settings
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  useEffect(() => {
    if (
      backendData &&
      backendData.id &&
      _get(DateThemes, themeType) &&
      _get(DateThemes, themeType).length
    ) {
      const {
        themeId,
        attributes: { show, selected_date, theme_settings }
      } = backendData

      const theme = DateThemes[themeType].find(i => i.id === themeId)
      const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
      setAllowedThemeSetting(allowedThemeSetting)

      if (allowedThemeSetting.hasOwnProperty('day')) {
        initialFormState.current.selectedPeriodType = 'day'
        setSelectedPeriodType('day')
      } else {
        initialFormState.current.selectedPeriodType = 'date'
        setSelectedPeriodType('date')
      }

      initialFormValues.current = {
        themeId,
        show,
        theme_settings,
        mediaInfo: getMediaInfoFromBackendData(backendData),
        ...(selected_date && { selected_date })
      }
      form.setValues(initialFormValues.current)

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData, DateThemes])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Local', 'Date')
    setFeatureId(id)
  }, [configMediaCategory])

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
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    if (Object.keys(allowedThemeSetting).length && backendData) {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [allowedThemeSetting])

  useEffect(() => {
    if (
      _get(DateThemes, themeType) &&
      _get(DateThemes, themeType).length &&
      !backendData
    ) {
      const allowedThemeSetting = getMediaThemesSettings(
        DateThemes[themeType][0].customProperties
      )
      setAllowedThemeSetting(allowedThemeSetting)

      const defaultTheme = getMediaThemesSettings(
        DateThemes[themeType][0].customProperties,
        true
      )

      form.setValues({
        ...form.values,
        themeId: DateThemes[themeType][0].id,
        theme_settings: defaultTheme
      })
      setLoading(false)
    }

    if (_get(DateThemes, themeType) && _get(DateThemes, themeType).length) {
      setDateThemes(_get(DateThemes, themeType))
    }
    // eslint-disable-next-line
  }, [DateThemes, themeType])

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
    <form className={classes.formWrapper}>
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
                        Date Theme
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonContainer}
                        value={themeType}
                        exclusive
                        onChange={handleDateTypeChanges}
                      >
                        <TabToggleButton value={'Legacy'}>
                          Legacy
                        </TabToggleButton>
                        <TabToggleButton value={'Modern'}>
                          Modern
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>
                </header>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      {!!dateThemes.length && (
                        <MediaHtmlCarousel
                          settings={{
                            infinite: true
                          }}
                          activeSlide={values.themeId}
                          slides={dateThemes.map(theme => ({
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
                          error={errors.themeId}
                          touched={touched.themeId}
                          onSlideClick={val => handleSlideClick(val.name)}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Show
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonContainer}
                        value={selectedShowType}
                        exclusive
                        onChange={handleShowTypeChanges}
                      >
                        <TabToggleButton value={'today'}>
                          Show Today
                        </TabToggleButton>
                        <TabToggleButton value={'selected_date'}>
                          Show Selected Date
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                  </Grid>
                </header>
                {getSelectedShowTypeContent()}
              </Grid>
            </Grid>

            {themeType === 'Legacy' &&
              _get(allowedThemeSetting, selectedPeriodType) && (
                <LegacyThemeContent
                  classes={classes}
                  values={values}
                  allowedThemeSetting={allowedThemeSetting}
                  selectedPeriodType={selectedPeriodType}
                  handlePeriodTypeChanges={handlePeriodTypeChanges}
                  isLoading={isLoading}
                  errors={errors}
                  touched={touched}
                  handleChange={form.setFieldValue}
                />
              )}

            {themeType === 'Modern' &&
              !_get(allowedThemeSetting, selectedPeriodType) && (
                <ModernThemeContent
                  classes={classes}
                  values={values}
                  allowedThemeSetting={allowedThemeSetting}
                  isLoading={isLoading}
                  errors={errors}
                  touched={touched}
                  handleChange={form.setFieldValue}
                />
              )}

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
                disabled={isButtonsDisable}
                onReset={() => {
                  form.resetForm(initialFormValues.current)
                  setThemeType(initialFormState.current.themeType)
                  setSelectedShowType(initialFormState.current.selectedShowType)
                  setSelectedPeriodType(
                    initialFormState.current.selectedPeriodType
                  )
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

Date.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Date.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Date))
