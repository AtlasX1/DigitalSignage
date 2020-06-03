import React, { useState, useEffect, useCallback, useRef } from 'react'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import * as Yup from 'yup'
import { get as _get, isEmpty as _isEmpty } from 'lodash'

import { Scrollbars } from 'components/Scrollbars'

import {
  withStyles,
  Grid,
  Typography,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'

import {
  FormControlInput,
  FormControlSelect,
  SliderInputRange,
  FormControlPalettePicker,
  FormControlTimeDurationPicker
} from 'components/Form'

import ExpansionPanel from 'components/Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import { profilesPalettePresets } from 'utils/palettePresets'
import FileUpload from '../General/components/Upload/FileUpload'
import MediaThemeSelector from '../MediaThemeSelector'

import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  csvJSON,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  getMediaThemesSettings,
  ObjectToFormData
} from '../../../utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'

import {
  clearMediaThemes,
  getThemeOfMediaFeatureById,
  getTransitions
} from 'actions/configActions'

import { MediaInfo, MediaTabActions } from '../index'
import InlineEditor from './InlineEditor/InlineEditor'
import FormControlSketchColorPicker from 'components/Form/FormControlSketchColorPicker'
import { CheckboxSwitcher } from 'components/Checkboxes'

const sample = require('../../../common/assets/media/profiles.csv')

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
    padding: '0 5px 30px'
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
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        Modern transition effects require up to date device hardware, as well as
        up to date firmware on your device. Legacy transition effects are no
        longer supported.
      </div>
    </div>
  )
)

const DownloadIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const DownloadIcon = withStyles(DownloadIconStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.tabIconWrap}>
      <i className={iconClassName} />
    </div>
  )
)

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes }) => (
    <div className={classes.DownloadFileButtonContainer}>
      <DownloadIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const ProfileTab = ({ classes, number, name, position, image }) => (
  <Grid item xs={6} className={classes.cardContainer}>
    <div className={classes.workplaceCardContainer}>
      <div
        className={classes.workplaceCardImage}
        style={{ background: `url(${image})`, backgroundSize: 'cover' }}
      />
      <div className={classes.workplaceCardContentContainer}>
        <div className={classes.workplaceCardContentHeader}>{number}</div>
        <div className={classes.workplaceCardContent}>
          <span className={classes.workplaceCardContentTitle}>Name</span>
          <span className={classes.workplaceCardContentText}>{name}</span>
        </div>
        <div className={classes.workplaceCardContent}>
          <span className={classes.workplaceCardContentTitle}>Position</span>
          <span className={classes.workplaceCardContentText}>{position}</span>
        </div>
      </div>
    </div>
  </Grid>
)

const styles = ({ palette, type, formControls, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
    },
    formWrapper: {
      position: 'relative',
      height: '100%'
    },
    overflowColumnWrapper: {
      // overflow: 'auto',
      // maxHeight: '100%'
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
      marginTop: '31px'
    },
    themeCardWrap: {
      // border: `solid 1px ${palette[type].pages.media.card.border}`,
      // backgroundColor: palette[type].pages.media.card.background,
      // borderRadius: '4px',
      marginBottom: '10px',
      padding: '10px 0 18px'
    },
    themeCardWrap1: {
      // border: `solid 1px ${palette[type].pages.media.card.border}`,
      // backgroundColor: palette[type].pages.media.card.background,
      // borderRadius: '4px'
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
    themeOptions1: {
      padding: '0 20px'
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
    inputItem: {
      padding: '0 10px',
      margin: '0 -10px 24px'
    },
    themeInputContainer: {
      padding: '0 7px',
      margin: '0 -7px'
    },
    tabToggleButton: {
      width: '128px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent',
      marginBottom: '20px'
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
    formControlRootClass: {
      marginBottom: '0'
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
    formInputLabel: {
      color: '#74809a',
      fontSize: '13px',
      lineHeight: '15px',
      paddingRight: '15px'
    },
    negativeMargin: {
      marginBottom: '-15px'
    },
    numberInput: {
      '& span': {
        width: '76px',
        height: '36px'
      }
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
    formControlLabelClass: {
      fontSize: '17px'
    },
    marginTop1: {
      marginTop: '20px'
    },
    marginBottom1: {
      marginBottom: '10px'
    },
    marginBottom2: {
      marginBottom: '0px'
    },
    inputContainer: {
      padding: '0 8px',
      margin: '0 -8px'
    },
    transitionContainer: {
      padding: '15px 15px 0'
    },
    saveDialog: {
      width: '100%',
      maxWidth: 500
    },
    dialogTitle: {
      '& *': {
        color: `${palette[type].dialog.title}`
      }
    },
    cellPadding: {
      padding: 5
    },
    cardContainer: {
      padding: '0 4px',
      margin: '0 -4px 10px'
    },
    workplaceCardContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      position: 'relative',
      border: `1px solid ${palette[type].pages.media.gallery.poster.border}`,
      borderRadius: 2
    },
    workplaceCardImage: {
      width: 100,
      height: 76
    },
    workplaceCardContentContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      flexGrow: 1,
      padding: '7px 10px 0 10px',
      background: palette[type].pages.media.gallery.poster.background
    },
    workplaceCardContentHeader: {
      color: palette[type].pages.media.gallery.poster.header.color,
      fontSize: '14px',
      marginBottom: '11px',
      fontWeight: '700'
    },
    workplaceCardContent: {
      display: 'flex',
      flexFlow: 'row nowrap',
      marginBottom: '4px',
      '&:last-of-type': {
        marginBottom: 0
      }
    },
    workplaceCardContentTitle: {
      color: '#9394A0',
      fontSize: '12px',
      marginRight: '8px'
    },
    workplaceCardContentText: {
      color: palette[type].pages.media.gallery.poster.header.color,
      fontSize: '12px'
    },
    numericRoot: {
      ...formControls.mediaApps.numericInput.root
    },
    numericInput: {
      ...formControls.mediaApps.numericInput.input
    },
    columnWrap: {
      padding: '0 6px',
      margin: '0 -6px'
    },
    errorContainer: {
      padding: 15,
      color: 'red'
    }
  }
}

const validationSchema = mode =>
  Yup.object().shape({
    themeId: Yup.number().required('Select theme'),
    selected_mapping_value: Yup.array().of(
      Yup.object().shape({
        default_value: Yup.string().required(
          'Please map headers and set default values'
        )
      })
    ),
    file: Yup.mixed().when('source', {
      is: val => val === 'file' && mode !== 'edit',
      then: Yup.mixed()
        .required('A file is required')
        .test('fileFormat', 'Select .csv file', value => {
          return value && value[0] && ['text/csv'].includes(value[0].type)
        })
    }),
    url: Yup.string().when('source', {
      is: 'web',
      then: Yup.string().required()
    }),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

const assignments = [
  {
    component: <span>Name</span>,
    value: 'Name'
  },
  {
    component: <span>Position</span>,
    value: 'Position'
  },
  {
    component: <span>Description</span>,
    value: 'Description'
  },
  {
    component: <span>ImagePath</span>,
    value: 'ImagePath'
  }
]

const Profiles = props => {
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

  const [
    configMediaCategory,
    addMediaReducer,
    mediaItemReducer,
    themesReducer,
    transitionsReducer
  ] = useSelector(state => [
    state.config.configMediaCategory,
    state.addMedia.gallery,
    state.media.mediaItem,
    state.config.themeOfMedia.response,
    state.config.transitions
  ])

  const initialFormState = useRef({
    themeType: 'Modern'
  })
  const [isLoading, setLoading] = useState(true)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)

  const [selectedProfileFieldType, setSelectedProfileFieldType] = useState(
    'title'
  )
  const [profilesData, setProfilesData] = useState(undefined)

  const [selectedPalette, setSelectedPalette] = useState({})
  const [transitionOptions, setTransitionOptions] = useState([])

  const [themeType, setThemeType] = useState(initialFormState.current.themeType)
  const [themes, setThemes] = useState([])
  const [allowedThemeSetting, setAllowedThemeSetting] = useState({})

  const [isMapCsvDialog, setMapCsvDialog] = useState(false)
  const [isCsvMapped, setIsCsvMapped] = useState(false)
  const [isInlineEditorDialog, setInlineEditorDialog] = useState(false)

  const [prevThemeSettings, setPrevThemeSettings] = useState({})

  const initialFormValues = useRef({
    themeId: undefined,
    file: [],
    data: [
      {
        Name: '',
        Position: '',
        Description: '',
        ImagePath: ''
      }
    ],
    url: undefined,
    source: 'file',
    refresh_every: 3600,
    theme_settings: {},
    selected_mapping_value: [
      { select_value: 'Name', default_value: '' },
      { select_value: 'Position', default_value: '' },
      { select_value: 'Description', default_value: '' },
      { select_value: 'ImagePath', default_value: '' }
    ],
    mediaInfo: { ...constants.mediaInfoInitvalue }
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: validationSchema(mode),
    onSubmit: values => {
      initialFormValues.current = values
      const {
        themeId,
        file,
        data,
        url,
        source,
        refresh_every,
        theme_settings,
        selected_mapping_value
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        featureId: { $set: featureId },
        themeId: { $set: themeId },
        attributes: {
          $set: {
            source,
            refresh_every,
            theme_settings,
            transition: theme_settings.transition,
            transition_duration: theme_settings.transition_duration,
            animation_duration: theme_settings.animation_duration,
            selected_mapping_value,
            ...(source === 'web' && { url }),
            ...(source === 'inline_editor' && {
              data: data.map(item => ({
                ...item,
                ImagePath: item.ImagePath.id
              }))
            })
          }
        }
      })

      if (source === 'file') {
        requestData.file = file[0]
      }

      const getData = requestData => {
        let data = requestData
        if (source === 'file') {
          data = ObjectToFormData(requestData)
        }
        if (source === 'file' && mode === 'edit') {
          data.append('_method', 'PUT')
        }
        return data
      }

      const actionOptions = {
        mediaName: 'gallery',
        tabName: selectedTab,
        data: getData(requestData)
      }

      try {
        if (mode === 'add') {
          dispatchAction(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatchAction(
            editMedia({
              ...actionOptions,
              id: mediaId,
              ...(source === 'file' && mode === 'edit' && { method: 'POST' })
            })
          )
        }
        setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('type', form.values.type)
      }
    }
  })

  // ---- mothods

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
      file,
      data,
      url,
      source,
      refresh_every,
      theme_settings,
      selected_mapping_value
    } = form.values

    form.setTouched({
      themeId: true,
      file: true,
      url: true,
      data: true,
      source: true,
      transition: true,
      transition_duration: true,
      animation_duration: true,
      refresh_every: true,
      theme_settings: true,
      selected_mapping_value: true
    })

    try {
      await validationSchema(mode).validate(
        {
          themeId,
          file,
          source,
          data,
          url,
          refresh_every,
          theme_settings,
          selected_mapping_value
        },
        { strict: true, abortEarly: false }
      )

      const objectData = {
        featureId,
        themeId,
        ...(source === 'file' && { file: file[0] }),
        attributes: {
          source,
          refresh_every,
          theme_settings,
          transition: theme_settings.transition,
          transition_duration: theme_settings.transition_duration,
          animation_duration: theme_settings.animation_duration,
          selected_mapping_value,
          ...(source === 'web' && { url }),
          ...(source === 'inline_editor' && {
            data: data.map(item => ({
              ...item,
              ImagePath: item.ImagePath.id
            }))
          })
        }
      }

      const requestData =
        source === 'file' ? ObjectToFormData(objectData) : objectData

      dispatchAction(generateMediaPreview(requestData))
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

  const onSelectPalette = selectedPalette => {
    setSelectedPalette(selectedPalette)

    if (themeType === 'Modern') {
      form.setFieldValue(
        `theme_settings.description_color`,
        selectedPalette.palette.description.value
      )
      form.setFieldValue(
        `theme_settings.position_color`,
        selectedPalette.palette.position.value
      )
      form.setFieldValue(
        `theme_settings.title_color`,
        selectedPalette.palette.title.value
      )
    } else {
      form.setFieldValue(
        `theme_settings.description_color`,
        selectedPalette.palette.description.value
      )
      form.setFieldValue(
        `theme_settings.background_color`,
        selectedPalette.palette.position.value
      )
      form.setFieldValue(
        `theme_settings.title_color`,
        selectedPalette.palette.title.value
      )
    }
  }

  const handleProfileFieldTypeChanges = (event, selectedProfileFieldType) =>
    selectedProfileFieldType &&
    setSelectedProfileFieldType(selectedProfileFieldType)

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
      ...(defaultThemeSetting &&
        themeType === 'Modern' && {
          theme_settings: {
            description_color: 'rgba(188, 224, 172, 1)',
            title_color: 'rgba(88, 88, 88, 1)',
            position_color: 'rgba(88, 88, 88, 1)',
            title_font_family: 'Arial',
            description_font_family: 'Arial',
            position_font_family: 'Arial',
            title_font_size: 15,
            description_font_size: 15,
            position_font_size: 15,
            ...defaultThemeSetting
          }
        }),
      ...(defaultThemeSetting &&
        themeType === 'Legacy' && {
          theme_settings: {
            background_color: 'rgba(255, 137, 46, 1)',
            box_color: 'rgba(188, 224, 172, 1)',
            title_color: 'rgba(88, 88, 88, 1)',
            randomize_color: false,
            font_family: 'Arial',
            name_font_size: 15,
            description_font_size: 15,
            position_font_size: 15,
            ...defaultThemeSetting
          }
        }),
      ...(defaultThemeSetting &&
        !_get(form.values, ['selected_mapping_value', '0']) && {
          selected_mapping_value: defaultThemeSetting.selected_mapping_value
        })
    })
  }

  const handleSampleDownload = () => {
    window.open(sample)
  }

  const isValidUrl = string => {
    try {
      new URL(string)
    } catch (_) {
      return false
    }

    return true
  }

  // ---- effects

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    const values = _get(formData, 'values')
    if (values) {
      form.setValues(values)
    }
    if (!transitionsReducer.response.length) {
      dispatchAction(getTransitions())
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
      initialFormValues.current = {
        ...form.values,
        themeId,
        ...attributes,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData, themesReducer])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Gallery', 'Profiles')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      props.onShowSnackbar(t('Successfully added'))

      setProfilesData([])
      dispatchAction(
        clearAddedMedia({
          mediaName: 'gallery',
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
          mediaName: 'gallery',
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
      allowedThemeSetting &&
      Object.keys(allowedThemeSetting).length &&
      backendData
    ) {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [allowedThemeSetting])

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

      form.setValues({
        ...form.values,
        ...(defaultThemeSetting && { theme_settings: defaultThemeSetting }),
        ...(!_isEmpty(prevThemeSettings) && {
          theme_settings: prevThemeSettings
        })
      })

      setPrevThemeSettings(form.values.theme_settings)
      setLoading(false)
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
    () => () => {
      dispatchAction(clearMediaThemes())
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (_get(form.values.file, '[0]')) {
        const reader = new FileReader()
        reader.readAsText(form.values.file[0])
        reader.onload = () => {
          const parsedCsv = csvJSON(reader.result)
          setProfilesData(parsedCsv)
        }
      }
    },
    // eslint-disable-next-line
    [form.values.file]
  )

  useEffect(
    () => {
      if (form.values.url) {
        if (form.values.url.includes('.csv') && isValidUrl(form.values.url)) {
          const request = new XMLHttpRequest()
          request.open('GET', form.values.url, true)
          request.send(null)
          request.onreadystatechange = () => {
            if (request.responseText) {
              const parsedCsv = csvJSON(request.responseText)
              setProfilesData(parsedCsv)
            }
          }
          request.onerror = () => {
            form.setTouched({ url: true })
            form.setFieldError('url', 'Invalid URL')
          }
        } else {
          form.setTouched({ url: true })
          form.setFieldError('url', 'Enter valid url to .csv file')
        }
      }
    },
    // eslint-disable-next-line
    [form.values.url]
  )

  useEffect(
    () => {
      const { theme_settings } = form.values

      const option = profilesPalettePresets.find(({ palette }) => {
        return (
          palette.description.value === theme_settings.description_color &&
          palette.position.value ===
            theme_settings[
              themeType === 'Modern' ? 'position_color' : 'background_color'
            ] &&
          palette.title.value === theme_settings.title_color
        )
      })

      if (option) {
        setSelectedPalette(option)
      } else {
        setSelectedPalette({
          palette: {
            description: { value: theme_settings.description_color },
            position: {
              value:
                themeType === 'Modern'
                  ? theme_settings.position_color
                  : theme_settings.background_color
            },
            title: { value: theme_settings.title_color }
          }
        })
      }
    },
    // eslint-disable-next-line
    [
      form.values.theme_settings.description_color,
      form.values.theme_settings.position_color,
      form.values.theme_settings.title_color,
      form.values.theme_settings.background_color,
      profilesPalettePresets
    ]
  )

  // ---- render

  const getSelectedTabContent = () => {
    switch (form.values.source) {
      case 'file':
        return (
          <>
            <Grid container>
              <Grid item xs={12} style={{ marginTop: -30 }}>
                <FileUpload
                  multiple={false}
                  name="file"
                  files={form.values.file}
                  error={form.errors.file}
                  touched={form.touched.file}
                  noClick={false}
                  dropZoneText={'Select or Drop .csv file'}
                  onChange={form.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.marginBottom1}>
              <Grid item xs={12} className={classes.themeCardWrap1}>
                <header
                  className={classes.themeHeader}
                  onClick={handleSampleDownload}
                >
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Download Sample Files
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container>
                        <Grid item className={classes.fileTypeLabel}>
                          <DownloadFileButton
                            iconClassName="icon-download-harddisk"
                            text="CSV"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </header>
              </Grid>
            </Grid>
          </>
        )
      case 'web':
        return (
          <>
            <Grid container>
              <Grid item xs={12}>
                <FormControlInput
                  label="URL:"
                  formControlLabelClass={classes.formControlLabelClass}
                  value={form.values.url}
                  error={form.errors.url}
                  touched={form.touched.url}
                  handleChange={e => form.setFieldValue('url', e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.marginBottom1}>
              <Grid item xs={12} className={classes.themeCardWrap1}>
                <header className={classes.themeHeader}>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <Grid item>
                      <Typography className={classes.themeHeaderText}>
                        Download Sample Files
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container>
                        <Grid item className={classes.fileTypeLabel}>
                          <DownloadFileButton
                            iconClassName="icon-download-harddisk"
                            text="CSV"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </header>
              </Grid>
            </Grid>
          </>
        )
      case 'inline_editor':
        return null
      default:
        return
    }
  }

  const { values, errors, touched } = form

  const getMapError = () => {
    if (
      _get(errors, ['selected_mapping_value', '0', 'default_value']) &&
      touched.selected_mapping_value
    ) {
      return _get(errors, ['selected_mapping_value', '0', 'default_value'])
    }

    return ''
  }

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      {isLoading && (
        <div className={classes.loaderWrapper}>
          <CircularProgress size={30} thickness={5} />
        </div>
      )}
      <Grid container className={classes.tabContent}>
        <Grid item xs={7} className={classes.overflowColumnWrapper}>
          <Scrollbars>
            <div className={classes.root}>
              <InfoMessage iconClassName={'icon-interface-information-1'} />
              <Grid container justify="space-between">
                <Grid item xs={12}>
                  <ExpansionPanel
                    expanded={true}
                    title={'Theme'}
                    children={
                      <Grid
                        container
                        justify="center"
                        style={{ padding: '10px 0' }}
                      >
                        {!!themes.length && (
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
                    }
                  />

                  <ExpansionPanel
                    expanded={false}
                    title={'Data Source'}
                    error={
                      errors.file && touched.file
                        ? errors.file
                        : errors.url && touched.url
                        ? errors.url
                        : ''
                    }
                    children={
                      <Grid container>
                        <Grid item xs={12} className={classes.marginTop1}>
                          <TabToggleButtonGroup
                            className={classes.tabToggleButtonContainer}
                            value={values.source}
                            exclusive
                            onChange={(e, v) => {
                              if (v === 'inline_editor')
                                setInlineEditorDialog(true)

                              v && form.setFieldValue('source', v)
                            }}
                          >
                            <TabToggleButton
                              className={classes.tabToggleButton}
                              value={'file'}
                            >
                              Import File
                            </TabToggleButton>
                            <TabToggleButton
                              className={classes.tabToggleButton}
                              value={'web'}
                            >
                              Web Feed
                            </TabToggleButton>
                            <TabToggleButton
                              className={classes.tabToggleButton}
                              value={'inline_editor'}
                            >
                              Add/Edit Items
                            </TabToggleButton>
                          </TabToggleButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                          {getSelectedTabContent()}
                        </Grid>
                      </Grid>
                    }
                  />

                  <ExpansionPanel
                    expanded={false}
                    title={'Current Items'}
                    error={getMapError()}
                    disabled={true}
                    children={
                      <Grid container className={classes.transitionContainer}>
                        <Grid item xs={12}>
                          <WhiteButton
                            className={classes.previewMediaBtn}
                            onClick={() => setMapCsvDialog(true)}
                            disabled={!_get(profilesData, ['0'])}
                          >
                            MAP CSV HEADERS
                          </WhiteButton>
                        </Grid>
                        <Grid item xs={12} className={classes.marginTop1}>
                          <Grid container justify={'space-between'}>
                            {isCsvMapped &&
                              profilesData.map((item, index) => (
                                <ProfileTab
                                  number={index + 1}
                                  classes={classes}
                                  image={item.ImagePath}
                                  name={item.Name}
                                  position={item.Position}
                                  key={`poster_${index}`}
                                />
                              ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  />

                  <ExpansionPanel
                    expanded={false}
                    title={'Transitions'}
                    children={
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          className={[
                            classes.themeCardWrap,
                            classes.transitionContainer
                          ].join(' ')}
                        >
                          <Grid container justify="space-between">
                            <Grid
                              item
                              xs={4}
                              className={classes.inputContainer}
                            >
                              <FormControlSelect
                                label={'Transition'}
                                custom
                                value={values.theme_settings.transition}
                                error={
                                  errors.theme_settings &&
                                  errors.theme_settings.transition
                                }
                                touched={
                                  touched.theme_settings &&
                                  touched.theme_settings.transition
                                }
                                handleChange={e =>
                                  form.setFieldValue(
                                    'theme_settings.transition',
                                    e.target.value
                                  )
                                }
                                options={transitionOptions}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              className={classes.inputContainer}
                            >
                              <FormControlTimeDurationPicker
                                label={'Transition Duration'}
                                value={
                                  values.theme_settings.transition_duration
                                }
                                onChange={val =>
                                  form.setFieldValue(
                                    'theme_settings.transition_duration',
                                    val
                                  )
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              className={classes.inputContainer}
                            >
                              {values.theme_settings.animation_duration && (
                                <FormControlTimeDurationPicker
                                  label={'Animation Duration'}
                                  value={
                                    values.theme_settings.animation_duration
                                  }
                                  onChange={val =>
                                    form.setFieldValue(
                                      'theme_settings.animation_duration',
                                      val
                                    )
                                  }
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  />
                  <ExpansionPanel
                    expanded={false}
                    title={'Styles'}
                    children={
                      <Grid container className={classes.themeCardWrap}>
                        {themeType === 'Modern' ? (
                          <>
                            <Grid item xs={12}>
                              <TabToggleButtonGroup
                                className={classes.tabToggleButtonContainer}
                                value={selectedProfileFieldType}
                                exclusive
                                onChange={handleProfileFieldTypeChanges}
                              >
                                <TabToggleButton
                                  className={classes.tabToggleButton}
                                  value={'title'}
                                >
                                  Title
                                </TabToggleButton>
                                <TabToggleButton
                                  className={classes.tabToggleButton}
                                  value={'description'}
                                >
                                  Description
                                </TabToggleButton>
                                <TabToggleButton
                                  className={classes.tabToggleButton}
                                  value={'position'}
                                >
                                  Position
                                </TabToggleButton>
                              </TabToggleButtonGroup>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid
                                container
                                justify="space-between"
                                className={classes.themeOptions1}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  className={classes.columnWrap}
                                >
                                  <FormControlInput
                                    value={
                                      values.theme_settings[
                                        `${selectedProfileFieldType}_font_size`
                                      ]
                                    }
                                    label={'Font size'}
                                    max={150}
                                    min={5}
                                    handleChange={v =>
                                      form.setFieldValue(
                                        `theme_settings.${selectedProfileFieldType}_font_size`,
                                        v
                                      )
                                    }
                                    custom={true}
                                    formControlNumericInputRootClass={
                                      classes.numericRoot
                                    }
                                    formControlInputClass={classes.numericInput}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  className={classes.columnWrap}
                                >
                                  <FormControlSketchColorPicker
                                    label={'Font color'}
                                    color={
                                      values.theme_settings[
                                        `${selectedProfileFieldType}_color`
                                      ]
                                    }
                                    onColorChange={color =>
                                      form.setFieldValue(
                                        `theme_settings.${selectedProfileFieldType}_color`,
                                        color
                                      )
                                    }
                                    marginBottom={false}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  className={classes.columnWrap}
                                >
                                  {_get(
                                    allowedThemeSetting,
                                    `${selectedProfileFieldType}_font_family`
                                  ) && (
                                    <FormControlSelect
                                      custom
                                      label={'Font family'}
                                      marginBottom={false}
                                      value={
                                        values.theme_settings[
                                          `${selectedProfileFieldType}_font_family`
                                        ]
                                      }
                                      handleChange={e =>
                                        form.setFieldValue(
                                          `theme_settings.${selectedProfileFieldType}_font_family`,
                                          e.target.value
                                        )
                                      }
                                      options={allowedThemeSetting[
                                        `${selectedProfileFieldType}_font_family`
                                      ].map(name => ({
                                        component: (
                                          <span style={{ fontFamily: name }}>
                                            {name}
                                          </span>
                                        ),
                                        value: name
                                      }))}
                                    />
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          <Grid item xs={12}>
                            <Grid
                              container
                              justify="space-between"
                              className={classes.themeOptions1}
                            >
                              <Grid item xs={12}>
                                <Grid container justify={'space-between'}>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlInput
                                      value={
                                        values.theme_settings.name_font_size
                                      }
                                      label={'Name font size'}
                                      max={
                                        allowedThemeSetting.max_name_font_size
                                      }
                                      min={
                                        allowedThemeSetting.min_name_font_size
                                      }
                                      handleChange={v =>
                                        form.setFieldValue(
                                          `theme_settings.name_font_size`,
                                          v
                                        )
                                      }
                                      custom={true}
                                      formControlNumericInputRootClass={
                                        classes.numericRoot
                                      }
                                      formControlInputClass={
                                        classes.numericInput
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlInput
                                      value={
                                        values.theme_settings
                                          .description_font_size
                                      }
                                      label={'Description font size'}
                                      max={
                                        allowedThemeSetting.max_description_font_size
                                      }
                                      min={
                                        allowedThemeSetting.min_description_font_size
                                      }
                                      handleChange={v =>
                                        form.setFieldValue(
                                          `theme_settings.description_font_size`,
                                          v
                                        )
                                      }
                                      custom={true}
                                      formControlNumericInputRootClass={
                                        classes.numericRoot
                                      }
                                      formControlInputClass={
                                        classes.numericInput
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <FormControlInput
                                      value={
                                        values.theme_settings.position_font_size
                                      }
                                      label={'Position font size'}
                                      max={
                                        allowedThemeSetting.max_position_font_size
                                      }
                                      min={
                                        allowedThemeSetting.min_position_font_size
                                      }
                                      handleChange={v =>
                                        form.setFieldValue(
                                          `theme_settings.position_font_size`,
                                          v
                                        )
                                      }
                                      custom={true}
                                      formControlNumericInputRootClass={
                                        classes.numericRoot
                                      }
                                      formControlInputClass={
                                        classes.numericInput
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container justify={'space-between'}>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlSketchColorPicker
                                      label={'Title color'}
                                      color={values.theme_settings.title_color}
                                      onColorChange={color =>
                                        form.setFieldValue(
                                          `theme_settings.title_color`,
                                          color
                                        )
                                      }
                                      marginBottom={false}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlSketchColorPicker
                                      label={'Background color'}
                                      color={
                                        values.theme_settings.background_color
                                      }
                                      onColorChange={color =>
                                        form.setFieldValue(
                                          `theme_settings.background_color`,
                                          color
                                        )
                                      }
                                      marginBottom={false}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlSketchColorPicker
                                      label={'Box color'}
                                      color={values.theme_settings.box_color}
                                      onColorChange={color =>
                                        form.setFieldValue(
                                          `theme_settings.box_color`,
                                          color
                                        )
                                      }
                                      marginBottom={false}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container justify={'space-between'}>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    {_get(
                                      allowedThemeSetting,
                                      'font_family'
                                    ) && (
                                      <FormControlSelect
                                        custom
                                        label={'Font family'}
                                        value={
                                          values.theme_settings.font_family
                                        }
                                        handleChange={e =>
                                          form.setFieldValue(
                                            `theme_settings.font_family`,
                                            e.target.value
                                          )
                                        }
                                        options={allowedThemeSetting.font_family.map(
                                          name => ({
                                            component: (
                                              <span
                                                style={{ fontFamily: name }}
                                              >
                                                {name}
                                              </span>
                                            ),
                                            value: name
                                          })
                                        )}
                                      />
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  justify={'space-between'}
                                  alignItems={'center'}
                                >
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlInput
                                      value={
                                        values.theme_settings.columns_per_page
                                      }
                                      label={'Columns per page'}
                                      max={
                                        allowedThemeSetting.max_columns_per_page
                                      }
                                      min={
                                        allowedThemeSetting.min_columns_per_page
                                      }
                                      handleChange={v =>
                                        form.setFieldValue(
                                          `theme_settings.columns_per_page`,
                                          v
                                        )
                                      }
                                      custom={true}
                                      formControlNumericInputRootClass={
                                        classes.numericRoot
                                      }
                                      formControlInputClass={
                                        classes.numericInput
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <FormControlInput
                                      value={
                                        values.theme_settings.rows_per_page
                                      }
                                      label={'Rows per page'}
                                      max={
                                        allowedThemeSetting.max_rows_per_page
                                      }
                                      min={
                                        allowedThemeSetting.min_rows_per_page
                                      }
                                      handleChange={v =>
                                        form.setFieldValue(
                                          `theme_settings.rows_per_page`,
                                          v
                                        )
                                      }
                                      custom={true}
                                      formControlNumericInputRootClass={
                                        classes.numericRoot
                                      }
                                      formControlInputClass={
                                        classes.numericInput
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={classes.columnWrap}
                                  >
                                    <CheckboxSwitcher
                                      label={'Randomize color'}
                                      value={
                                        values.theme_settings.randomize_color
                                      }
                                      handleChange={value =>
                                        form.setFieldValue(
                                          'theme_settings.randomize_color',
                                          value
                                        )
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Grid
                            container
                            justify="center"
                            className={classes.negativeMargin}
                          >
                            {profilesPalettePresets.map(item => (
                              <Grid
                                item
                                xs={6}
                                key={item.id}
                                className={classes.colorPaletteContainer}
                              >
                                <FormControlPalettePicker
                                  preset={item}
                                  onSelectPalette={onSelectPalette}
                                  disabled={true}
                                  id={item.id}
                                  selected={selectedPalette}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    }
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
                    label={'Refresh Every'}
                    tooltip={
                      'Frequency of content refresh during playback (in minutes)'
                    }
                    labelAtEnd={false}
                    step={1}
                    value={+values.refresh_every}
                    error={errors.refresh_every}
                    touched={touched.refresh_every}
                    maxValue={21600}
                    minValue={3600}
                    onChange={val => form.setFieldValue('refresh_every', val)}
                    inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  />
                </Grid>
              </Grid>
            </div>
          </Scrollbars>
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

      <InlineEditor
        open={isInlineEditorDialog}
        data={form.values.data}
        onSave={val => {
          setProfilesData(val)
          form.setFieldValue('data', val)
          setInlineEditorDialog(false)
        }}
        onClose={() => setInlineEditorDialog(false)}
        onChange={form.setFieldValue}
      />

      <Dialog
        open={!!_get(profilesData, ['0']) && isMapCsvDialog}
        onClose={() => setMapCsvDialog(false)}
        maxWidth={false}
      >
        <DialogTitle>
          <Typography className={classes.dialogTitle}>
            CSV Label Assignment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Please assign your column headers their desire labels. Accepted
            values are provided in the dropdown,with a custom option at the end.
            You can also assign a default value to be used for a column if the
            cell is empty or blank.
          </Typography>

          <Table className={classes.marginTop2}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.cellPadding}>
                  Header Row
                </TableCell>
                <TableCell className={classes.cellPadding}>Fors Row</TableCell>
                <TableCell className={classes.cellPadding}>Assign to</TableCell>
                <TableCell className={classes.cellPadding}>
                  Default Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_get(profilesData, ['0']) &&
                Object.keys(profilesData[0]).map((headerKey, index) => (
                  <TableRow key={`table_row_${index}`}>
                    <TableCell className={classes.cellPadding}>
                      {headerKey}
                    </TableCell>
                    <TableCell className={classes.cellPadding}>
                      {profilesData[0][headerKey].id
                        ? profilesData[0][headerKey].url
                          ? profilesData[0][headerKey].url
                          : profilesData[0][headerKey].id
                        : profilesData[0][headerKey]}
                    </TableCell>
                    <TableCell className={classes.cellPadding}>
                      <FormControlSelect
                        formControlLabelClass={classes.formControlLabelClass}
                        custom
                        value={_get(values.selected_mapping_value, [
                          index,
                          'select_value'
                        ])}
                        handleChange={e => {
                          const newValue = values.selected_mapping_value
                          newValue[index].select_value = e.target.value
                          form.setFieldValue('selected_mapping_value', newValue)
                        }}
                        options={assignments}
                        marginBottom={false}
                      />
                    </TableCell>
                    <TableCell className={classes.cellPadding}>
                      <FormControlInput
                        formControlLabelClass={classes.formControlLabelClass}
                        value={_get(values.selected_mapping_value, [
                          index,
                          'default_value'
                        ])}
                        handleChange={e => {
                          const newValue = values.selected_mapping_value
                          newValue[index].default_value = e.target.value
                          form.setFieldValue('selected_mapping_value', newValue)
                        }}
                        error={errors.url}
                        touched={touched.url}
                        marginBottom={false}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <WhiteButton
            className={classes.previewMediaBtn}
            onClick={() => {
              setIsCsvMapped(true)
              setMapCsvDialog(false)
            }}
          >
            Save
          </WhiteButton>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Profiles))
