import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { translate } from 'react-i18next'
import momentTZ from 'moment-timezone'
import draftToHtml from 'draftjs-to-html'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'
import update from 'immutability-helper'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import Tooltip from '@material-ui/core/Tooltip'
import { useFormik } from 'formik'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'

import { WhiteButton } from '../../Buttons'
import { FormControlInput, SliderInputRange, WysiwygEditor } from '../../Form'
import MediaThemeSelector from '../MediaThemeSelector'
import ExpansionPanel from '../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import { MediaInfo, MediaTabActions } from '../index'
import FormControlSketchColorPicker from '../../Form/FormControlSketchColorPicker'
import FormControlReactSelect from '../../Form/FormControlReactSelect'

import {
  clearMediaThemes,
  getThemeOfMediaFeatureById,
  getTransitions
} from 'actions/configActions'
import {
  createMediaPostData,
  getAllowedFeatureId,
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
import { mediaConstants as constants } from '../../../constants'

const images = {
  step1: require('../../../common/assets/images/facebook_step2.png'),
  step2: require('../../../common/assets/images/facebook_step4.png'),
  step3: require('../../../common/assets/images/facebook_step5.png')
}

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
    padding: '0 5px 67px'
  },
  infoMessage: {
    marginLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  },
  marginTop: {
    marginTop: '20px'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        <div>
          Modern themes require up to date device hardware, as well as up to
          date firmware on your device. Legacy themes are currently supported,
          however they will be deprecated in the near future.
        </div>
        <div className={classes.marginTop}>
          Modern transition effects require up to date device hardware, as well
          as up to date firmware on your device. Legacy transition effects are
          no longer supported.
        </div>
        <div className={classes.marginTop}>
          Facebook APIs and integrations with 3rd party platform are undergoing
          changes. As a result we are experiencing intermittent service
          disruptions as we fetch data from Facebook. Thank you for your
          patience.
        </div>
      </div>
    </div>
  )
)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '31px 30px'
    },
    formWrapper: {
      height: '100%',
      maxHeight: 'calc(100% - 65px)'
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
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    featureIconTabContainer: {
      justifyContent: 'center'
    },
    featureIconTab: {
      '&:not(:last-child)': {
        marginRight: '15px'
      }
    },
    formControlInput: {
      width: '100%'
    },
    formControlInputClass: {
      fontSize: '14px !important',
      padding: '9px 15px !important'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background,
      marginBottom: '15px'
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.card.header.color,
      fontSize: '12px'
    },
    themeOptions1: {
      padding: '0 15px'
    },
    themeOptions2: {
      padding: '0 15px',
      marginTop: '31px'
    },
    themeOptions3: {
      padding: '0 15px',
      margin: '5px 0 29px'
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important',
      marginRight: '10px'
    },
    themeInputContainer: {
      padding: '0 4px',
      margin: '0 -4px'
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
    formControlLabel: {
      fontSize: '12px',
      color: '#74809A',
      marginRight: '19px'
    },
    formControlRootClass: {
      marginBottom: 0
    },
    palettePickerContainer: {
      marginBottom: '3px'
    },
    accountSettingsContainer: {
      margin: '12px 0 20px',
      padding: '0 15px'
    },
    transitionFormContainer: {
      padding: '15px 15px 17px'
    },
    dateRangeContainer: {
      padding: '15px 15px 17px'
    },
    facebookNameContainer: {
      marginBottom: '27px'
    },
    formControlLabelClass: {
      fontSize: '17px'
    },
    formInputLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px',
      paddingRight: '15px'
    },
    sliderInputClass: {
      width: '46px'
    },
    sliderInputLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      marginRight: '15px'
    },
    numberInput: {
      '& span': {
        width: '76px',
        height: '36px'
      }
    },
    inputContainer: {
      padding: '0 12px',
      margin: '0 -12px'
    },
    marginTop1: {
      marginTop: '10px'
    },
    marginTop2: {
      marginTop: '17px'
    },
    firstTabContent: {
      maxHeight: '100%',
      overflowX: 'auto'
    },
    bottomArea: {
      height: '4px',
      border: `1px solid ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].sideModal.background
    },
    formControlInputNumber: {
      '& .react-numeric-input': {
        width: '100%',
        height: '38px'
      }
    },
    menuPaperClass: {
      maxHeight: 300
    },
    colorPickerRootClass: {
      width: '100%'
    }
  }
}
const dates = [
  {
    label: 'Today',
    value: 1
  },
  {
    label: 'Last 7 Days',
    value: 7
  },
  {
    label: 'Last 15 Days',
    value: 15
  },
  {
    label: 'Last 30 Days',
    value: 30
  },
  {
    label: 'Last 60 Days',
    value: 60
  },
  {
    label: 'Last 90 Days',
    value: 90
  }
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
  themeId: Yup.number().required('Select theme'),
  page_name: Yup.string().required('Enter page Id'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Facebook = props => {
  const {
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
  } = props

  const dispatchAction = useDispatch()

  const [
    configMediaCategory,
    addMediaReducer,
    mediaItemReducer,
    transitionsReducer,
    themesReducer
  ] = useSelector(state => [
    state.config.configMediaCategory,
    state.addMedia.social,
    state.media.mediaItem,
    state.config.transitions,
    state.config.themeOfMedia.response
  ])

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [themes, setThemes] = useState([])
  const [transitionOptions, setTransitionOptions] = useState([])
  const [showUserIdHelp, setShowUserIdHelp] = useState(false)

  const [allowedThemeSetting, setAllowedThemeSetting] = useState(undefined)
  const [selectedThemeType, setSelectedThemeType] = useState('Modern')

  const initialFormValues = useRef({
    themeId: undefined,
    page_name: '',
    transition: {
      effect: 'up',
      duration: 50
    },
    date_range: {
      enable: false,
      days: 1,
      time_zone: momentTZ.tz.guess()
    },
    theme_settings: {},
    refresh_every: 3600,
    content1: EditorState.createEmpty(),
    content2: EditorState.createEmpty(),
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
        page_name,
        transition,
        date_range,
        refresh_every,
        theme_settings
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const attributes = {
        page_name,
        transition,
        date_range: {
          ...date_range,
          enable: date_range.days !== 1
        },
        refresh_every,
        content1: getEditorValueToHtml1,
        content2: getEditorValueToHtml2,
        theme_settings: {
          ...theme_settings,
          date_range: {
            ...date_range,
            enable: date_range.days !== 1
          },
          refresh_every,
          page_name
        }
      }

      const requestData = update(postData, {
        $merge: { featureId, themeId, attributes }
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

  const handleThemeTypeChanges = (event, selectedThemeType) =>
    selectedThemeType && setSelectedThemeType(selectedThemeType)

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
        case 'attributes.network':
          formProp = 'network'
          break
        default:
          break
      }
      formErrors[formProp] = errorMsg
    })
  }

  const handleShowPreview = async () => {
    const {
      themeId,
      page_name,
      transition,
      date_range,
      refresh_every,
      theme_settings
    } = form.values

    form.setTouched({
      themeId: true,
      page_name: true
    })

    try {
      await validationSchema.validate(
        { themeId, page_name },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            page_name,
            transition,
            date_range: {
              ...date_range,
              enable: date_range.days !== 1
            },
            refresh_every,
            content1: getEditorValueToHtml1,
            content2: getEditorValueToHtml2,
            theme_settings: {
              ...theme_settings,
              date_range: {
                ...date_range,
                enable: date_range.days !== 1
              },
              refresh_every,
              page_name
            }
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  const handleSlideClick = themeId => {
    const theme = (themesReducer[selectedThemeType] || []).find(
      i => i.id === themeId
    )
    if (!theme) {
      return
    }
    const defaultTheme = getMediaThemesSettings(theme.customProperties, true)
    const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
    setAllowedThemeSetting(allowedThemeSetting)

    form.setValues({
      ...form.values,
      themeId: theme.id,
      theme_settings: {
        post_time_color: 'rgba(0,0,0,1)',
        profile_color: 'rgba(0,0,0,1)',
        post_message_color: 'rgba(0,0,0,1)',
        likes_count_color: 'rgba(0,0,0,1)',
        comments_count_color: 'rgba(0,0,0,1)',
        location_color: 'rgba(0,0,0,1)',
        font_family: fonts[0],
        ...defaultTheme
      },
      transition: {
        effect: _get(defaultTheme, 'transition.effect') || 'no-transition',
        duration: _get(defaultTheme, 'transition.duration') || 50
      }
    })
  }

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

  const getEditorValueToHtml1 = useMemo(() => {
    return draftToHtml(convertToRaw(form.values.content1.getCurrentContent()))
  }, [form.values.content1])

  const getEditorValueToHtml2 = useMemo(() => {
    return draftToHtml(convertToRaw(form.values.content2.getCurrentContent()))
  }, [form.values.content2])

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
          mediaName: 'social',
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
          mediaName: 'social',
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
    if (!transitionsReducer.response.length) {
      dispatchAction(getTransitions())
    }

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
      _get(themesReducer, selectedThemeType) &&
      _get(themesReducer, selectedThemeType).length
    ) {
      const {
        themeId,
        attributes: {
          content1,
          content2,
          date_range,
          page_name,
          refresh_every,
          transition,
          font_color,
          font_family,
          theme_settings
        }
      } = backendData

      const theme = themesReducer[selectedThemeType].find(i => i.id === themeId)
      const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
      setAllowedThemeSetting(allowedThemeSetting)

      const contentBlock1 = htmlToDraft(content1)
      const contentBlock2 = htmlToDraft(content2)
      const contentState1 = ContentState.createFromBlockArray(
        contentBlock1.contentBlocks
      )
      const contentState2 = ContentState.createFromBlockArray(
        contentBlock2.contentBlocks
      )

      initialFormValues.current = {
        ...form.values,
        themeId,
        content1: EditorState.createWithContent(contentState1),
        content2: EditorState.createWithContent(contentState2),
        date_range,
        page_name,
        refresh_every,
        transition,
        font_color,
        font_family,
        theme_settings,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData, themesReducer])

  useEffect(() => {
    if (transitionsReducer.response) {
      setTransitionOptions(
        transitionsReducer.response.map(i => ({
          id: i.id,
          value: i.code,
          label: i.name
        }))
      )
    }
  }, [transitionsReducer])

  useEffect(
    () => {
      if (
        _get(themesReducer, selectedThemeType) &&
        _get(themesReducer, selectedThemeType).length &&
        !backendData
      ) {
        const allowedThemeSetting = getMediaThemesSettings(
          themesReducer[selectedThemeType][0].customProperties
        )
        setAllowedThemeSetting(allowedThemeSetting)

        const defaultTheme = getMediaThemesSettings(
          themesReducer[selectedThemeType][0].customProperties,
          true
        )

        form.setValues({
          ...form.values,
          themeId: themesReducer[selectedThemeType][0].id,
          theme_settings: defaultTheme
        })
        setLoading(false)
      }

      setThemes(_get(themesReducer, selectedThemeType, []))
    },
    // eslint-disable-next-line
    [themesReducer, selectedThemeType]
  )

  useEffect(() => {
    if (
      allowedThemeSetting &&
      Object.keys(allowedThemeSetting).length &&
      backendData
    ) {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [allowedThemeSetting])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Social', 'Facebook')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
  }, [featureId, dispatchAction])

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

  const { values, errors, touched } = form

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid container className={classes.tabContent}>
        <Grid item xs={7} className={classes.firstTabContent}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container className={classes.facebookNameContainer}>
              <Grid item xs>
                <FormControlInput
                  label="Facebook Name :"
                  onClickLabel={() => setShowUserIdHelp(true)}
                  labelRightComponent={
                    <TabIcon iconClassName={'icon-interface-information-1'} />
                  }
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={values.page_name}
                  error={errors.page_name}
                  touched={touched.page_name}
                  handleChange={e =>
                    form.setFieldValue('page_name', e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item xs={12}>
                <ExpansionPanel
                  expanded={true}
                  title={'Theme'}
                  children={
                    <Grid container justify="center">
                      <MediaThemeSelector
                        value={selectedThemeType}
                        onChange={handleThemeTypeChanges}
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
                          error: errors.themeId,
                          touched: touched.themeId,
                          activeSlide: values.themeId,
                          onSlideClick: t => handleSlideClick(t.name)
                        }}
                      />
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={false}
                  title={'Customize'}
                  children={
                    <Grid
                      container
                      className={classes.transitionFormContainer}
                      justify="space-between"
                    >
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlReactSelect
                          label={'Font Family'}
                          value={values.theme_settings.font_family}
                          inputClasses={{
                            input: classes.formControlInput
                          }}
                          handleChange={e =>
                            form.setFieldValue(
                              'theme_settings.font_family',
                              e.target.value
                            )
                          }
                          options={
                            _get(allowedThemeSetting, 'font_family')
                              ? allowedThemeSetting.font_family.map(name => ({
                                  label: (
                                    <span style={{ fontFamily: name }}>
                                      {name}
                                    </span>
                                  ),
                                  value: name
                                }))
                              : fonts.map(name => ({
                                  label: (
                                    <span style={{ fontFamily: name }}>
                                      {name}
                                    </span>
                                  ),
                                  value: name
                                }))
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlSketchColorPicker
                          label={'Сomments Сount Color'}
                          formControlInputWrapClass={classes.formControlInput}
                          formControlInputClass={classes.formControlInput}
                          rootClass={classes.colorPickerRootClass}
                          color={values.theme_settings.comments_count_color}
                          onColorChange={color =>
                            form.setFieldValue(
                              `theme_settings.comments_count_color`,
                              color
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlSketchColorPicker
                          label={'Likes Count Color'}
                          formControlInputWrapClass={classes.formControlInput}
                          formControlInputClass={classes.formControlInput}
                          rootClass={classes.colorPickerRootClass}
                          color={values.theme_settings.likes_count_color}
                          onColorChange={color =>
                            form.setFieldValue(
                              `theme_settings.likes_count_color`,
                              color
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlSketchColorPicker
                          label={'Post Message Color'}
                          formControlInputWrapClass={classes.formControlInput}
                          formControlInputClass={classes.formControlInput}
                          rootClass={classes.colorPickerRootClass}
                          color={values.theme_settings.post_message_color}
                          onColorChange={color =>
                            form.setFieldValue(
                              `theme_settings.post_message_color`,
                              color
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlSketchColorPicker
                          marginBottom={false}
                          label={'Post Title Color'}
                          formControlInputWrapClass={classes.formControlInput}
                          formControlInputClass={classes.formControlInput}
                          rootClass={classes.colorPickerRootClass}
                          color={values.theme_settings.post_time_color}
                          onColorChange={color =>
                            form.setFieldValue(
                              `theme_settings.post_time_color`,
                              color
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlSketchColorPicker
                          marginBottom={false}
                          label={'Profile Color'}
                          formControlInputWrapClass={classes.formControlInput}
                          formControlInputClass={classes.formControlInput}
                          rootClass={classes.colorPickerRootClass}
                          color={values.theme_settings.profile_color}
                          onColorChange={color =>
                            form.setFieldValue(
                              `theme_settings.profile_color`,
                              color
                            )
                          }
                        />
                      </Grid>
                      {values.themeId === 229 && (
                        <Grid
                          item
                          xs={6}
                          className={classes.themeInputContainer}
                        >
                          <FormControlSketchColorPicker
                            marginBottom={false}
                            label={'Location Color'}
                            formControlInputWrapClass={classes.formControlInput}
                            formControlInputClass={classes.formControlInput}
                            rootClass={classes.colorPickerRootClass}
                            color={values.theme_settings.location_color}
                            onColorChange={color =>
                              form.setFieldValue(
                                `theme_settings.location_color`,
                                color
                              )
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={false}
                  title={'Transition'}
                  children={
                    <Grid
                      container
                      className={classes.transitionFormContainer}
                      justify="space-between"
                    >
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlReactSelect
                          formControlLabelClass={classes.formControlLabelClass}
                          inputClasses={{
                            input: classes.formControlInput
                          }}
                          label={'Transition'}
                          value={values.transition.effect}
                          handleChange={e =>
                            form.setFieldValue(
                              'transition.effect',
                              e.target.value
                            )
                          }
                          options={transitionOptions}
                          marginBottom={0}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlInput
                          custom
                          label="Duration"
                          formControlRootClass={classes.formControlRootClass}
                          formControlContainerClass={
                            classes.formControlInputNumber
                          }
                          formControlLabelClass={classes.formControlLabelClass}
                          formControlInputClass={classes.formControlInput}
                          value={values.transition.duration}
                          handleChange={value =>
                            form.setFieldValue('transition.duration', value)
                          }
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={false}
                  title={'Date Range'}
                  children={
                    <Grid
                      container
                      justify="space-between"
                      className={classes.dateRangeContainer}
                    >
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlReactSelect
                          label={'Days :'}
                          marginBottom={0}
                          options={dates}
                          custom
                          value={values.date_range.days}
                          handleChange={e =>
                            form.setFieldValue(
                              'date_range.days',
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.themeInputContainer}>
                        <FormControlReactSelect
                          label={'Time Zone :'}
                          marginBottom={0}
                          custom
                          value={values.date_range.time_zone}
                          customMenuPaperClassName={classes.menuPaperClass}
                          handleChange={e =>
                            form.setFieldValue(
                              'date_range.time_zone',
                              e.target.value
                            )
                          }
                          options={momentTZ.tz.names().map(i => ({
                            label: i,
                            value: i
                          }))}
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={false}
                  title={'Content'}
                  children={
                    <Grid
                      container
                      justify="space-between"
                      className={classes.dateRangeContainer}
                    >
                      <Grid
                        item
                        xs={12}
                        className={classes.themeInputContainer}
                      >
                        <WysiwygEditor
                          label={'Content 1'}
                          name="content1"
                          editorState={form.values.content1}
                          onChange={form.handleChange}
                          toolbar={{
                            options: [
                              'inline',
                              'fontSize',
                              'fontFamily',
                              'colorPicker',
                              'remove',
                              'history'
                            ]
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className={classes.themeInputContainer}
                      >
                        <WysiwygEditor
                          label={'Content 2'}
                          name="content2"
                          editorState={form.values.content2}
                          onChange={form.handleChange}
                          toolbar={{
                            options: [
                              'inline',
                              'fontSize',
                              'fontFamily',
                              'colorPicker',
                              'remove',
                              'history'
                            ]
                          }}
                        />
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              className={[classes.marginTop2, classes.bottomArea].join(' ')}
            >
              <Grid item></Grid>
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
                    <Typography className={classes.sliderInputLabel}>
                      Refresh Every
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      value={values.refresh_every}
                      error={errors.refresh_every}
                      touched={touched.refresh_every}
                      onChange={val => form.setFieldValue('refresh_every', val)}
                      label={''}
                      maxValue={21600}
                      minValue={3600}
                      handleChange={() => {}}
                      inputClass={classes.sliderInputClass}
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

      <Dialog
        open={showUserIdHelp}
        onClose={() => setShowUserIdHelp(false)}
        maxWidth={'md'}
        PaperProps={{
          className: classes.dialog
        }}
      >
        <DialogTitle className={classes.dialogTitle}>
          How to get Facebook Page Name
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.dialogText}>
            1) Go to:
            <a href="https://www.facebook.com/">https://www.facebook.com/</a>
            and Log In
            <br />
          </Typography>
          <Typography className={classes.dialogText}>
            2) Search Page.
            <br />
            <img src={images.step1} alt="" />
            <br />
          </Typography>
          <Typography className={classes.dialogText}>
            3) Click on required page from search results.
            <br />
          </Typography>
          <Typography className={classes.dialogText}>
            4) Select Facebook Page Name.
            <br />
            <img src={images.step2} alt="" />
            <br />
          </Typography>
          <Typography className={classes.dialogText}>
            5) If Facebook page URL structured like this then the Page Name is
            38385348499983.
            <br />
            <img src={images.step3} alt="" />
          </Typography>
        </DialogContent>
      </Dialog>
    </form>
  )
}

Facebook.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Facebook.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Facebook))
