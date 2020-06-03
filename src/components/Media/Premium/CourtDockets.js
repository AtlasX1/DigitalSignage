import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { useDispatch, useSelector } from 'react-redux'

import * as Yup from 'yup'
import { debounce as _debounce, get as _get } from 'lodash'
import axios from 'axios'
import update from 'immutability-helper'
import moment from 'moment'

import { Close as CloseIcon } from '@material-ui/icons'
import {
  withStyles,
  Grid,
  Typography,
  CircularProgress,
  Tooltip,
  InputLabel
} from '@material-ui/core'
import { useFormik } from 'formik'

import { mediaConstants as constants } from 'constants/index'
import { parseFileHeader } from 'utils/docketsFileParser'
import selectUtils from 'utils/select'
import { docketsPalettePresets } from 'utils/palettePresets'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'

import {
  SliderInputRange,
  FormControlInput,
  FormControlReactSelect,
  FormControlDateRangePickers,
  FormControlFileDropzone,
  FormControlPalettePicker,
  FormControlSpeedInput
} from 'components/Form'

import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData,
  getMediaThemesSettings,
  ObjectToFormData
} from 'utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import { getThemeOfMediaFeatureById } from 'actions/configActions'

import MediaThemeSelector from '../MediaThemeSelector'
import { MediaInfo, MediaTabActions } from 'components/Media'

import ExpansionPanel from 'components/Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import fileDownload from 'utils/fileDownload'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#4C5057'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes, onClick }) => (
    <div className={classes.DownloadFileButtonContainer} onClick={onClick}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const styles = ({ palette, type, formControls }) => {
  return {
    root: {
      margin: '22px 30px'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: '1rem'
    },
    marginTop8: {
      marginTop: 8
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
    expansionPanelLabelClass: {
      fontSize: '12px',
      color: palette[type].pages.media.premium.color,
      fontWeight: '700'
    },
    sliderRootClass: {
      ...formControls.mediaApps.refreshEverySlider.root
    },
    sliderInputLabel: {
      lineHeight: '15px',
      marginRight: '15px',
      ...formControls.mediaApps.refreshEverySlider.label
    },
    marginBottom1: {
      marginBottom: '15px'
    },
    dateInputsStyles1: {
      marginTop: '14px'
    },
    dateInputsStyles2: {
      marginTop: '20px',
      padding: '0 20px 35px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    dateInputsStyles3: {
      marginTop: '18px',
      padding: '0 20px'
    },
    tabToggleButtonGroup: {
      marginBottom: '19px',
      justifyContent: 'center'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    tabToggleButton: {
      width: '128px'
    },
    fileTypeLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500'
    },
    themeHeader: {
      padding: '0 15px'
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      fontSize: '12px',
      color: palette[type].pages.media.general.card.header.color
    },
    inputContainer: {
      padding: '0 15px'
    },
    mediaInfoContainer: {
      height: '100%'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: 'solid 1px #e4e9f3'
    },
    clearFileIcon: {
      alignSelf: 'flex-end',
      marginTop: '-1.25em',
      marginRight: '0.25em',
      cursor: 'pointer',
      zIndex: 1
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
      zIndex: 2
    },
    palettePickerContainer: {
      marginLeft: '2rem'
    },
    expansionPanelPalette: {
      width: '100%'
    },
    formNumericInput: {
      '& > span': {
        height: 38,
        width: '4em'
      }
    },
    formGroupPadding: {
      padding: '0 20px 35px'
    },
    tabToggleButtonMultiline: {
      '& > span': {
        lineHeight: 1.5
      }
    },
    wordBreak: {
      wordBreak: 'break-word'
    },
    mediaActionsWrapper: {
      display: 'flex',
      alignItems: 'flex-end'
    },
    speedInputLabelLeft: {
      margin: 0
    },
    numericRoot: {
      ...formControls.mediaApps.numericInput.root
    },
    numericInput: {
      ...formControls.mediaApps.numericInput.input
    },
    textInput: {
      ...formControls.mediaApps.textInput.input
    }
  }
}

const sampleDocketsContent = `Party Name,Case No.,Building,DateTime,Description / Hearing Type
*** SEALED ***,JA-2013-0000356,4B,2016-06-20 20:00:00,Motion - Court Set - Domestic
*** SEALED ***,JA-2013-0000357,4B,2016-06-21 20:00:00,Motion - Court Set - Domestic
*** SEALED ***,JA-2013-0000358,4B,2016-06-20 10:00:00,Motion - Court Set - Domestic
*** SEALED ***,JA-2013-0000396,5C,2016-06-22 20:00:00,Motion w/ Judge

`

const automatedDateOptions = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'day_after_tomorrow', label: 'Day-after tomorrow' },
  { value: 'today_tomorrow', label: 'Today + Tomorrow' },
  {
    value: 'today_tomorrow_and_day_after',
    label: 'Today / Tomorrow & Day-after'
  },
  { value: 'this_week', label: 'This week' },
  { value: 'next_seven_days', label: 'Next 7 days' }
]

const dataSourceTabs = {
  IMPORT_FILE: 'file',
  WEB_FEED: 'web'
}
const dateRangeTypeTabs = {
  AUTOMATED: 'automated',
  MANUAL: 'manual'
}
const themeTypeTabs = {
  MODERN: 'Modern',
  LEGACY: 'Legacy'
}

const transitionTypes = {
  SLIDESHOW: 'slideshow',
  SCROLL: 'scroll'
}

const paletteTypes = {
  PRESETS: 'presets',
  CUSTOM: 'custom'
}

const fontSettingTabs = {
  TITLE: 'title',
  HEADER: 'header',
  BODY: 'body'
}

const accordionTabs = {
  DATE_RANGE: 'date_range',
  GENERAL_SETTINGS: 'general_settings',
  COLOR_SETTINGS: 'color_settings',
  FONT_SETTINGS: 'font_settings',
  ANIMATION_SETTINGS: 'animation_settings'
}

const customPalettePreset = {
  id: -1,
  palette: {
    ...Object.keys(docketsPalettePresets[0].palette).reduce(
      (newPalette, key) => ({
        ...newPalette,
        [key]: { ...docketsPalettePresets[0].palette[key] }
      }),
      {}
    )
  }
}

const formDataTransformer = (data, selectedPalette, isPUT = false) => {
  const { palette } = selectedPalette
  if (palette) {
    data = update(data, {
      attributes: {
        title: {
          $merge: {
            bg_color: palette.titleBg.value,
            font_color: palette.title.value
          }
        },
        header: {
          $merge: {
            bg_color: palette.headerBg.value,
            font_color: palette.header.value
          }
        },
        body: {
          $merge: {
            bg_color: palette.bodyBg.value,
            font_color: palette.body.value
          }
        },
        selected_mapping_value: {
          $apply: values =>
            values.map(item => ({
              ...item,
              width: item.width || 20,
              default_value: item.default_value || ''
            }))
        },
        start_time: {
          $set:
            data.attributes.date_range_type === dateRangeTypeTabs.MANUAL
              ? data.attributes.start_time.format()
              : null
        },
        end_time: {
          $set:
            data.attributes.date_range_type === dateRangeTypeTabs.MANUAL
              ? data.attributes.end_time.format()
              : null
        }
      }
    })
  }
  if (isPUT) {
    data._method = 'PUT'
  }
  return data.attributes.source === dataSourceTabs.IMPORT_FILE
    ? ObjectToFormData(data, isPUT)
    : data
}

const findPalettePreset = ({ title, header, body }) => {
  const presetPalette = docketsPalettePresets.find(
    ({ palette }) =>
      palette.title.value === title.font_color &&
      palette.titleBg.value === title.bg_color &&
      palette.header.value === header.font_color &&
      palette.headerBg.value === header.bg_color &&
      palette.body.value === body.font_color &&
      palette.bodyBg.value === body.bg_color
  )

  if (presetPalette) {
    return presetPalette
  }
  customPalettePreset.palette = update(customPalettePreset.palette, {
    title: {
      $merge: {
        value: title.font_color
      }
    },
    titleBg: {
      $merge: {
        value: title.bg_color
      }
    },
    header: {
      $merge: {
        value: header.font_color
      }
    },
    headerBg: {
      $merge: {
        value: header.bg_color
      }
    },
    body: {
      $merge: {
        value: body.font_color
      }
    },
    bodyBg: {
      $merge: {
        value: body.bg_color
      }
    }
  })
  return customPalettePreset
}

const validationSchema = Yup.object().shape({
  source: Yup.string(),
  date_range_type: Yup.string(),
  themeId: Yup.number().typeError('Choose a theme').required('Choose a theme'),
  file: Yup.mixed().when('source', {
    is: dataSourceTabs.IMPORT_FILE,
    then: Yup.mixed()
      .test('notEmpty', 'Select a file', value => !!value)
      .test('fileType', 'Unsupported File Format', value =>
        ['csv', 'xml', 'json'].some(
          ext => value && value.type && value.type.includes(ext)
        )
      )
  }),
  data_url: Yup.string()
    .nullable()
    .when('source', {
      is: dataSourceTabs.WEB_FEED,
      then: Yup.string()
        .url('Enter valid URL')
        .required('Enter URL')
        .test('fileType', 'Unsupported Format', value =>
          ['csv', 'xml', 'json'].some(ext => value && value.endsWith(ext))
        )
    }),
  start_time: Yup.mixed().when('date_range_type', {
    is: dateRangeTypeTabs.MANUAL,
    then: Yup.mixed().required('Select date range')
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const SampleFileDownload = ({ classes }) => {
  return (
    <Grid item xs={12} className={classNames(classes.marginBottom1)}>
      <header className={classes.themeHeader}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.themeHeaderText}>
              Download Sample Files
            </Typography>
          </Grid>
          <Grid item className={classes.fileTypeLabel}>
            <DownloadFileButton
              onClick={() => fileDownload('sample.csv', sampleDocketsContent)}
              iconClassName="icon-download-harddisk"
              text="CSV"
            />
          </Grid>
        </Grid>
      </header>
    </Grid>
  )
}

const ColumnSettingForm = ({
  selectValueOptions,
  idx,
  colName,
  firstRow,
  form,
  classes
}) => {
  if (!selectValueOptions.length || idx < 0) {
    return null
  }
  const defaultSelectValue =
    selectValueOptions[idx % (selectValueOptions.length - 1)].value

  const mappingValue = form.values.selected_mapping_value[idx]
  const displayCustomLabel =
    mappingValue && mappingValue.select_value === 'Custom'

  return (
    <Grid item key={colName}>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <InputLabel shrink>Header Row</InputLabel>
          <Typography>{colName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <InputLabel shrink>First Row</InputLabel>
          <Typography>{firstRow}</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControlReactSelect
            label={'Assign To'}
            options={selectValueOptions}
            value={
              mappingValue ? mappingValue.select_value : defaultSelectValue
            }
            name={`selected_mapping_value[${idx}].select_value`}
            error={_get(
              form.errors,
              `selected_mapping_value[${idx}].select_value`,
              undefined
            )}
            touched={_get(
              form.touched,
              `selected_mapping_value[${idx}].select_value`,
              undefined
            )}
            handleChange={form.handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlInput
            label={'Default Value'}
            maxLength={50}
            value={mappingValue ? mappingValue.default_value : ''}
            name={`selected_mapping_value[${idx}].default_value`}
            error={_get(
              form.errors,
              `selected_mapping_value[${idx}].default_value`,
              undefined
            )}
            touched={_get(
              form.touched,
              `selected_mapping_value[${idx}].default_value`,
              undefined
            )}
            formControlInputClass={classes.textInput}
            handleChange={form.handleChange}
          />
        </Grid>
        {displayCustomLabel && (
          <Grid item xs={6}>
            <FormControlInput
              label={'Custom Label'}
              maxLength={50}
              value={mappingValue ? mappingValue.custom_label : ''}
              name={`selected_mapping_value[${idx}].custom_label`}
              error={_get(
                form.errors,
                `selected_mapping_value[${idx}].custom_label`,
                undefined
              )}
              touched={_get(
                form.touched,
                `selected_mapping_value[${idx}].custom_label`,
                undefined
              )}
              formControlInputClass={classes.textInput}
              handleChange={form.handleChange}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

const ColumnSettingTabs = ({
  fileHeader,
  form,
  selectValueOptions,
  classes
}) => {
  const [selectedColName, setSelectedColName] = useState(
    Object.keys(fileHeader)[0]
  )
  useEffect(() => {
    if (fileHeader) {
      setSelectedColName(Object.keys(fileHeader)[0])
    }
  }, [fileHeader])
  const onSelectedColNameChange = (e, val) => val && setSelectedColName(val)

  return !selectValueOptions.length ? null : (
    <Grid container justify="center">
      <Grid item className={classes.dateInputsStyles1}>
        {Object.keys(fileHeader)
          .reduce((items, colName, idx) => {
            if (idx % 4 === 0) {
              return [...items, [colName]]
            } else {
              items[items.length - 1].push(colName)
              return items
            }
          }, [])
          .map((colGroup, groupIdx) => (
            <TabToggleButtonGroup
              key={groupIdx}
              className={classNames(
                classes.tabToggleButtonContainer,
                classes.wordBreak,
                {
                  [classes.marginTop8]: groupIdx > 0
                }
              )}
              value={selectedColName}
              exclusive
              onChange={onSelectedColNameChange}
            >
              {colGroup.map((colName, idx) => (
                <TabToggleButton
                  key={colName + idx}
                  className={classNames(
                    classes.tabToggleButton,
                    classes.tabToggleButtonMultiline
                  )}
                  value={colName}
                >
                  {colName}
                </TabToggleButton>
              ))}
            </TabToggleButtonGroup>
          ))}
      </Grid>
      <Grid item xs={12} className={classes.marginTop8}>
        <ColumnSettingForm
          colName={selectedColName}
          idx={Object.keys(fileHeader).indexOf(selectedColName)}
          firstRow={fileHeader[selectedColName]}
          selectValueOptions={selectValueOptions}
          form={form}
          classes={classes}
        />
      </Grid>
    </Grid>
  )
}

const CourtDockets = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  onModalClose,
  onShowSnackbar,
  onShareStateCallback
}) => {
  const dispatchAction = useDispatch()
  const { configMediaCategory, themeOfMedia } = useSelector(
    ({ config }) => config
  )
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.premium)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const initialFormState = useRef({
    themeType: themeTypeTabs.LEGACY,
    paletteType: paletteTypes.PRESETS,
    selectedPalette: docketsPalettePresets[0]
  })

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [themeType, setThemeType] = useState(initialFormState.current.themeType)
  const [themes, setThemes] = useState([])
  const [allowedThemeSetting, setAllowedThemeSetting] = useState({})
  const [fileHeader, setFileHeader] = useState({})
  const [paletteType, setPaletteType] = useState(
    initialFormState.current.paletteType
  )
  const [selectedPalette, setSelectedPalette] = useState(
    initialFormState.current.selectedPalette
  )
  const [selectedFontSettingTab, setSelectedFontSettingTab] = useState(
    fontSettingTabs.TITLE
  )
  const [openedAccordionTab, setOpenedAccordionTab] = useState()
  const initialFormValues = useRef({
    themeId: null,
    source: dataSourceTabs.IMPORT_FILE,
    file: null,
    data_url: '',
    date_range_type: dateRangeTypeTabs.AUTOMATED,
    date_range: automatedDateOptions[0],
    start_time: null,
    end_time: null,
    transition_type: transitionTypes.SLIDESHOW,
    selected_mapping_value: [],

    duration: null,
    animation: null,
    speed: null,
    title: {},
    header: {},
    body: {},

    refresh_every: 300,
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
      const { mediaInfo, themeId, file, ...attributes } = values
      const data = createMediaPostData(mediaInfo, mode)
      data.featureId = featureId
      data.themeId = themeId
      data.file = file
      data.attributes = attributes

      const actionOptions = {
        mediaName: 'premium',
        tabName: selectedTab,
        data: formDataTransformer(
          data,
          paletteType === paletteTypes.CUSTOM
            ? customPalettePreset
            : selectedPalette,
          mode !== 'add'
        )
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        dispatchAction(
          editMedia({
            ...actionOptions,
            id: backendData.id,
            method:
              attributes.source === dataSourceTabs.IMPORT_FILE ? 'POST' : 'PUT'
          })
        )
      }
      setFormSubmitting(true)
    }
  })

  const handleBackendErrors = errors => {
    const formErrors = errors
      .map(({ name, value }) => ({
        name:
          name === 'title' || name.startsWith('group')
            ? 'mediaInfo'
            : name.split('attributes.')[1] || name,
        value:
          name === 'title'
            ? { title: value.join(' ') }
            : name.startsWith('group')
            ? { group: value.join(' ') }
            : value.join(' ')
      }))
      .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
    form.setErrors(formErrors)
  }

  const handleShowPreview = async () => {
    const { mediaInfo, themeId, file, ...attributes } = form.values

    form.setTouched({
      themeId: true,
      file: true,
      data_url: true,
      start_time: true,
      end_time: true
    })
    try {
      await validationSchema.validate(
        {
          themeId,
          file,
          ...attributes
        },
        {
          strict: true,
          abortEarly: false
        }
      )

      dispatchAction(
        generateMediaPreview(
          formDataTransformer(
            {
              featureId,
              themeId,
              file,
              attributes
            },
            paletteType === paletteTypes.CUSTOM
              ? customPalettePreset
              : selectedPalette
          )
        )
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  useEffect(() => {
    const currentReducer = addMediaReducer[selectedTab]
    if (!formSubmitting || !currentReducer) return

    const { response, error } = currentReducer

    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'custom',
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
          mediaName: 'custom',
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
    if (error) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
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
      form.setValues(values)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (backendData && backendData.id) {
      const { themeId, file, attributes } = backendData
      initialFormValues.current = {
        ...form.values,
        ...attributes,
        refresh_every:
          attributes.refresh_every && parseInt(attributes.refresh_every, 10),
        start_time: attributes.start_time
          ? moment(attributes.start_time)
          : null,
        end_time: attributes.end_time ? moment(attributes.end_time) : null,
        themeId,
        file,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Premium', 'Dockets')

    setFeatureId(id)
    dispatchAction(getThemeOfMediaFeatureById(id))
    // eslint-disable-next-line
  }, [configMediaCategory])

  useEffect(() => {
    const legacyThemes = _get(themeOfMedia, 'response.Legacy', [])
    const modernThemes = _get(themeOfMedia, 'Modern.Legacy', [])

    if (backendData && backendData.id) {
      const legacyTheme = legacyThemes.find(
        ({ id }) => id === backendData.themeId
      )
      const modernTheme = modernThemes.find(
        ({ id }) => id === backendData.themeId
      )

      const theme = modernTheme || legacyTheme || null

      form.setFieldValue('themeId', theme ? theme.id : null)
      initialFormState.current.themeType = modernTheme
        ? themeTypeTabs.MODERN
        : themeTypeTabs.LEGACY
      setThemeType(initialFormState.current.themeType)

      if (theme) {
        const allowedThemeSetting = getMediaThemesSettings(
          theme.customProperties
        )
        setAllowedThemeSetting(allowedThemeSetting)
      }

      const palette = findPalettePreset(backendData.attributes)
      initialFormState.current.paletteType =
        palette.id < 0 ? paletteTypes.CUSTOM : paletteTypes.PRESETS
      setPaletteType(initialFormState.current.paletteType)
      initialFormState.current.selectedPalette = palette
      setSelectedPalette(palette)
    }
    setThemes({
      [themeTypeTabs.MODERN]: modernThemes,
      [themeTypeTabs.LEGACY]: legacyThemes
    })

    // eslint-disable-next-line
  }, [themeOfMedia, backendData])

  useEffect(() => {
    if (mode === 'edit' && !backendData?.id) {
      setLoading(true)
    }
  }, [mode, backendData])

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

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )
  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const readDataUrlContent = useCallback(
    _debounce(data_url => {
      if (!data_url) {
        setFileHeader({})
        return
      }
      axios
        .get(data_url)
        .then(({ data, headers }) => {
          const fileHeader = parseFileHeader(data, headers['content-type'])
          setFileHeader(fileHeader)

          if (selectValueOptions.length) {
            Object.keys(fileHeader).forEach((colName, idx) =>
              form.setFieldValue(`selected_mapping_value[${idx}]`, {
                select_value:
                  selectValueOptions[idx % (selectValueOptions.length - 1)]
                    .value
              })
            )
          }
        })
        .catch(() => setFileHeader({}))
    }, 500),
    [setFileHeader]
  )

  useEffect(() => {
    if (form.values.source === dataSourceTabs.IMPORT_FILE) {
      if (!form.values.file) {
        setFileHeader({})
        return
      }
      const reader = new FileReader()
      reader.onload = function () {
        const content = reader.result
        const fileHeader = parseFileHeader(content, form.values.file.type)
        setFileHeader(fileHeader)

        if (selectValueOptions.length) {
          Object.keys(fileHeader).forEach((colName, idx) =>
            form.setFieldValue(`selected_mapping_value[${idx}]`, {
              select_value:
                selectValueOptions[idx % (selectValueOptions.length - 1)].value
            })
          )
        }
      }
      reader.readAsText(form.values.file)
    }
    if (form.values.source === dataSourceTabs.WEB_FEED) {
      readDataUrlContent(form.values.data_url)
    }
    //eslint-disable-next-line
  }, [
    form.values.file,
    form.values.source,
    form.values.data_url,
    readDataUrlContent,
    setFileHeader
  ])

  const onDataSourceChange = (event, type) =>
    type && form.setFieldValue('source', type)
  const onDateRangeTypeChange = (event, type) =>
    type && form.setFieldValue('date_range_type', type)
  const onThemeTypeChange = (event, type) => type && setThemeType(type)
  const onPaletteTypeChange = (event, type) => {
    type && setPaletteType(type)
  }
  const onFontSettingTabChange = (event, type) =>
    type && setSelectedFontSettingTab(type)

  const onSelectPalette = selectedPalette => {
    setSelectedPalette(selectedPalette)
  }

  const onAccordionTabChange = tab => val => {
    setOpenedAccordionTab(val ? tab : '')
  }

  const handleSlideClick = ({ value }) => {
    const theme = themes[themeType].find(({ id }) => id === value)

    if (!theme) {
      return
    }

    const allowedThemeSetting = getMediaThemesSettings(theme.customProperties)
    const defaultThemeSetting = getMediaThemesSettings(
      theme.customProperties,
      true
    )

    setAllowedThemeSetting(allowedThemeSetting)

    form.setValues({
      ...form.values,
      ...defaultThemeSetting,
      themeId: value,
      source: form.values.source
    })
  }

  const dataSourceTabContent = useMemo(() => {
    switch (form.values.source) {
      case dataSourceTabs.IMPORT_FILE:
        return (
          <>
            <Grid item xs={12}>
              <FormControlFileDropzone
                label="Select Data File:"
                formControlLabelClass={classes.formControlLabelClass}
                touched={form.touched.file}
                error={form.errors.file}
                helperText={
                  form.values.file ? form.values.file.name : undefined
                }
                icon={
                  form.values.file ? (
                    <CloseIcon
                      className={classes.clearFileIcon}
                      onClick={() => {
                        form.setFieldValue('file', null)
                      }}
                    />
                  ) : null
                }
                dropzoneProps={{
                  onDrop: files => {
                    if (files && files.length) {
                      form.setFieldValue('file', files[0])
                    }
                  },
                  accept: ['.csv', '.xml', '.json'],
                  multiple: false
                }}
              />
            </Grid>
            <SampleFileDownload classes={classes} />
          </>
        )
      case dataSourceTabs.WEB_FEED:
        return (
          <>
            <Grid item xs={12}>
              <FormControlInput
                label="Data URL:"
                name="data_url"
                value={form.values.data_url}
                handleChange={form.handleChange}
                touched={form.touched.data_url}
                error={form.errors.data_url}
                formControlInputClass={classes.textInput}
                formControlLabelClass={classes.formControlLabelClass}
              />
            </Grid>
            <SampleFileDownload classes={classes} />
          </>
        )
      default:
        return
    }
  }, [form, classes])

  const dateRangeTabContent = useMemo(() => {
    switch (form.values.date_range_type) {
      case dateRangeTypeTabs.AUTOMATED:
        return (
          <FormControlReactSelect
            name="date_range"
            options={
              allowedThemeSetting && allowedThemeSetting.date_range
                ? Object.keys(allowedThemeSetting.date_range).map(value => ({
                    value,
                    label: allowedThemeSetting.date_range[value]
                  }))
                : automatedDateOptions
            }
            value={form.values.date_range}
            error={form.errors.date_range}
            touched={form.touched.date_range}
            handleChange={form.handleChange}
          />
        )
      case dateRangeTypeTabs.MANUAL:
        return (
          <FormControlDateRangePickers
            anchorDirection="left"
            label=""
            startDate={form.values.start_time}
            endDate={form.values.end_time}
            onDatesChange={({ startDate, endDate }) => {
              form.setFieldValue('start_time', startDate)
              form.setFieldValue('end_time', endDate)
            }}
            error={form.errors.start_time}
            touched={form.touched.start_time}
          />
        )
      default:
        return
    }
  }, [form, allowedThemeSetting])

  const selectValueOptions = useMemo(() => {
    const options = (allowedThemeSetting.mapping_values || []).map(
      ({ select_value }) => ({
        value: select_value,
        label: select_value
      })
    )
    const colCount = Object.keys(fileHeader).length
    if (colCount) {
      Object.keys(fileHeader).forEach((colName, idx) => {
        const select_value = options[idx % (options.length - 1)].value
        form.setFieldValue(`selected_mapping_value[${idx}]`, {
          select_value
        })
      })
    }
    return options
    //eslint-disable-next-line
  }, [allowedThemeSetting])

  const paletteTabContent = useMemo(() => {
    switch (paletteType) {
      case paletteTypes.CUSTOM:
        return (
          <Grid item>
            <FormControlPalettePicker
              id={customPalettePreset.id}
              preset={customPalettePreset}
              allowChangeColor={true}
              selected={customPalettePreset}
            />
          </Grid>
        )
      case paletteTypes.PRESETS:
        return docketsPalettePresets.map(item => (
          <Grid
            item
            xs={6}
            key={item.id}
            className={classes.colorPaletteContainer}
          >
            <FormControlPalettePicker
              id={item.id}
              preset={item}
              onSelectPalette={onSelectPalette}
              allowChangeColor={false}
              selected={selectedPalette}
            />
          </Grid>
        ))
      default:
        return
    }
  }, [paletteType, selectedPalette, classes.colorPaletteContainer])

  const fontSettingTabContent = useMemo(() => {
    const fontOptions = _get(
      allowedThemeSetting,
      `${selectedFontSettingTab}.font_family`,
      []
    )
    const font_family = form.values[selectedFontSettingTab].font_family
    if (font_family && !fontOptions.includes(font_family)) {
      fontOptions.push(font_family)
    }
    return (
      <>
        <Grid item xs={6}>
          <FormControlInput
            custom
            type="number"
            label={'Font size'}
            min={_get(
              allowedThemeSetting,
              `${selectedFontSettingTab}.min_font_size`,
              undefined
            )}
            max={_get(
              allowedThemeSetting,
              `${selectedFontSettingTab}.max_font_size`,
              undefined
            )}
            value={form.values[selectedFontSettingTab].font_size}
            error={_get(
              form.errors,
              `${selectedFontSettingTab}.font_size`,
              undefined
            )}
            touched={_get(
              form.touched,
              `${selectedFontSettingTab}.font_size`,
              undefined
            )}
            formControlNumericInputRootClass={classNames(
              classes.numericRoot,
              classes.formNumericInput
            )}
            formControlInputClass={classes.numericInput}
            handleChange={val =>
              form.setFieldValue(`${selectedFontSettingTab}.font_size`, val)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlReactSelect
            label={'Font family'}
            options={fontOptions.map(selectUtils.nameToChipObj)}
            value={font_family}
            name={`${selectedFontSettingTab}.font_family`}
            error={_get(
              form.errors,
              `${selectedFontSettingTab}.font_family`,
              undefined
            )}
            touched={_get(
              form.touched,
              `${selectedFontSettingTab}.font_family`,
              undefined
            )}
            handleChange={form.handleChange}
          />
        </Grid>
      </>
    )
  }, [allowedThemeSetting, form, selectedFontSettingTab, classes])

  const animationTabContent = useMemo(() => {
    if (!allowedThemeSetting) {
      return
    }
    switch (form.values.transition_type) {
      case transitionTypes.SLIDESHOW:
        const animationOptions = allowedThemeSetting.animation
          ? Object.keys(allowedThemeSetting.animation).map(key => ({
              value: key,
              label: allowedThemeSetting.animation[key]
            }))
          : []
        const animation = form.values.animation
        if (animation && !animationOptions.includes(animation)) {
          animationOptions.push({ value: animation, label: animation })
        }
        return (
          <>
            <Grid item xs={6}>
              <FormControlInput
                custom
                type="number"
                label={'Duration'}
                min={allowedThemeSetting.min_duration}
                max={allowedThemeSetting.max_duration}
                value={form.values.duration}
                error={form.errors.duration}
                touched={form.touched.duration}
                formControlInputClass={classes.numericInput}
                formControlNumericInputRootClass={classNames(
                  classes.numericRoot,
                  classes.formNumericInput
                )}
                handleChange={val => form.setFieldValue('duration', val)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlReactSelect
                label={'Animation type'}
                options={animationOptions}
                value={animation}
                name={'animation'}
                error={form.errors.animation}
                touched={form.touched.animation}
                handleChange={form.handleChange}
              />
            </Grid>
          </>
        )
      case transitionTypes.SCROLL:
        return (
          <div>
            <FormControlSpeedInput
              labelAtEnd={false}
              step={1}
              value={form.values.speed}
              error={form.errors.speed}
              touched={form.touched.speed}
              maxValue={allowedThemeSetting.max_speed || 100}
              minValue={allowedThemeSetting.min_speed || 0}
              onChange={val => form.setFieldValue('speed', val)}
              inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
              inputContainerProps={{ justify: 'flex-start' }}
              labelLeftContainerClass={classes.speedInputLabelLeft}
            />
          </div>
        )
      default:
        return
    }
  }, [form, allowedThemeSetting, classes])

  const isButtonsDisable =
    !form.values.themeId ||
    formSubmitting ||
    (form.submitCount > 0 && !form.isValid)

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
            <Grid container justify="space-between">
              <Grid item xs={12}>
                <Grid container justify="center">
                  <MediaThemeSelector
                    className={classes.noBorder}
                    value={themeType}
                    onChange={onThemeTypeChange}
                    carousel={{
                      settings: {
                        infinite: false
                      },
                      activeSlide: form.values.themeId,
                      slides: (themes[themeType] || []).map(theme => ({
                        name: theme.id,
                        value: theme.id,
                        content: (
                          <Tooltip title={theme.tooltip}>
                            <img
                              src={theme.thumb}
                              alt={theme.tooltip}
                              key={theme.id}
                            />
                          </Tooltip>
                        )
                      })),
                      onSlideClick: handleSlideClick,
                      error: form.errors.themeId,
                      touched: form.touched.themeId
                    }}
                  />
                </Grid>

                <Grid
                  container
                  justify="center"
                  className={classNames(
                    classes.inputContainer,
                    classes.themeCardWrap,
                    classes.dateInputsStyles1
                  )}
                >
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Grid item className={classes.dateInputsStyles1}>
                        <TabToggleButtonGroup
                          className={classes.tabToggleButtonGroup}
                          value={form.values.source}
                          exclusive
                          onChange={onDataSourceChange}
                        >
                          <TabToggleButton
                            className={classes.tabToggleButton}
                            value={dataSourceTabs.IMPORT_FILE}
                          >
                            Import File
                          </TabToggleButton>
                          <TabToggleButton
                            className={classes.tabToggleButton}
                            value={dataSourceTabs.WEB_FEED}
                          >
                            Web Feed
                          </TabToggleButton>
                        </TabToggleButtonGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                  {dataSourceTabContent}
                </Grid>
                <ExpansionPanel
                  expanded={false}
                  isExpanded={openedAccordionTab === accordionTabs.DATE_RANGE}
                  onChange={onAccordionTabChange(accordionTabs.DATE_RANGE)}
                  className={classes.dateInputsStyles1}
                  title={'Date Range'}
                  formControlLabelClass={classNames(
                    classes.expansionPanelLabelClass
                  )}
                >
                  <Grid
                    container
                    justify="center"
                    className={classNames(
                      classes.marginBottom1,
                      classes.themeCardWrap,
                      classes.dateInputsStyles1
                    )}
                  >
                    <Grid item className={classes.dateInputsStyles1}>
                      <TabToggleButtonGroup
                        className={classes.tabToggleButtonContainer}
                        value={form.values.date_range_type}
                        exclusive
                        onChange={onDateRangeTypeChange}
                      >
                        <TabToggleButton
                          className={classes.tabToggleButton}
                          value={dateRangeTypeTabs.AUTOMATED}
                        >
                          Automated
                        </TabToggleButton>
                        <TabToggleButton
                          className={classes.tabToggleButton}
                          value={dateRangeTypeTabs.MANUAL}
                        >
                          Manual
                        </TabToggleButton>
                      </TabToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12} className={classes.dateInputsStyles2}>
                      {dateRangeTabContent}
                    </Grid>
                  </Grid>
                </ExpansionPanel>
              </Grid>

              {!!form.values.themeId && (
                <>
                  {Object.keys(fileHeader).length > 0 && (
                    <ExpansionPanel
                      expanded={false}
                      className={classes.expansionPanelPalette}
                      isExpanded={
                        openedAccordionTab === accordionTabs.GENERAL_SETTINGS
                      }
                      onChange={onAccordionTabChange(
                        accordionTabs.GENERAL_SETTINGS
                      )}
                      title={'Column Settings'}
                      formControlLabelClass={classes.expansionPanelLabelClass}
                    >
                      <Grid container justify="center">
                        <Grid
                          item
                          xs={12}
                          className={classNames(
                            classes.marginBottom1,
                            classes.themeCardWrap,
                            classes.dateInputsStyles1
                          )}
                        >
                          <Grid
                            container
                            justify="space-between"
                            className={classNames(
                              classes.dateInputsStyles1,
                              classes.formGroupPadding
                            )}
                          >
                            <ColumnSettingTabs
                              fileHeader={fileHeader}
                              form={form}
                              selectValueOptions={selectValueOptions}
                              classes={classes}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </ExpansionPanel>
                  )}
                  <ExpansionPanel
                    expanded={false}
                    className={classes.expansionPanelPalette}
                    isExpanded={
                      openedAccordionTab === accordionTabs.COLOR_SETTINGS
                    }
                    onChange={onAccordionTabChange(
                      accordionTabs.COLOR_SETTINGS
                    )}
                    title={'Color Settings'}
                    formControlLabelClass={classes.expansionPanelLabelClass}
                  >
                    <Grid container justify="center">
                      <Grid
                        item
                        xs={12}
                        className={classNames(
                          classes.marginBottom1,
                          classes.themeCardWrap,
                          classes.dateInputsStyles1
                        )}
                      >
                        <Grid container justify="center">
                          <Grid item className={classes.dateInputsStyles1}>
                            <TabToggleButtonGroup
                              className={classes.tabToggleButtonGroup}
                              value={paletteType}
                              exclusive
                              onChange={onPaletteTypeChange}
                            >
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={paletteTypes.PRESETS}
                              >
                                Presets
                              </TabToggleButton>
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={paletteTypes.CUSTOM}
                              >
                                Custom
                              </TabToggleButton>
                            </TabToggleButtonGroup>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="center"
                          className={classNames({
                            [classes.palettePickerContainer]:
                              paletteType === paletteTypes.PRESETS
                          })}
                        >
                          {paletteTabContent}
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanel>
                  <ExpansionPanel
                    expanded={false}
                    className={classes.expansionPanelPalette}
                    isExpanded={
                      openedAccordionTab === accordionTabs.FONT_SETTINGS
                    }
                    onChange={onAccordionTabChange(accordionTabs.FONT_SETTINGS)}
                    title={'Font Settings'}
                    formControlLabelClass={classes.expansionPanelLabelClass}
                  >
                    <Grid container justify="center">
                      <Grid
                        item
                        xs={12}
                        className={classNames(
                          classes.marginBottom1,
                          classes.themeCardWrap,
                          classes.dateInputsStyles1
                        )}
                      >
                        <Grid container justify="center">
                          <Grid item className={classes.dateInputsStyles1}>
                            <TabToggleButtonGroup
                              className={classes.tabToggleButtonGroup}
                              value={selectedFontSettingTab}
                              exclusive
                              onChange={onFontSettingTabChange}
                            >
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={fontSettingTabs.TITLE}
                              >
                                Title
                              </TabToggleButton>
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={fontSettingTabs.HEADER}
                              >
                                Header
                              </TabToggleButton>
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={fontSettingTabs.BODY}
                              >
                                Body
                              </TabToggleButton>
                            </TabToggleButtonGroup>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="space-between"
                          className={classes.formGroupPadding}
                        >
                          {fontSettingTabContent}
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanel>
                  <ExpansionPanel
                    expanded={false}
                    className={classes.expansionPanelPalette}
                    isExpanded={
                      openedAccordionTab === accordionTabs.ANIMATION_SETTINGS
                    }
                    onChange={onAccordionTabChange(
                      accordionTabs.ANIMATION_SETTINGS
                    )}
                    title={'Animation Settings'}
                    formControlLabelClass={classes.expansionPanelLabelClass}
                  >
                    <Grid container justify="center">
                      <Grid
                        item
                        xs={12}
                        className={classNames(
                          classes.marginBottom1,
                          classes.themeCardWrap,
                          classes.dateInputsStyles1
                        )}
                      >
                        <Grid container justify="center">
                          <Grid item className={classes.dateInputsStyles1}>
                            <TabToggleButtonGroup
                              className={classes.tabToggleButtonGroup}
                              value={form.values.transition_type}
                              exclusive
                              onChange={(e, val) =>
                                val &&
                                form.setFieldValue('transition_type', val)
                              }
                            >
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={transitionTypes.SLIDESHOW}
                              >
                                Slide show
                              </TabToggleButton>
                              <TabToggleButton
                                className={classes.tabToggleButton}
                                value={transitionTypes.SCROLL}
                              >
                                Scroll
                              </TabToggleButton>
                            </TabToggleButtonGroup>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="space-between"
                          className={classes.formGroupPadding}
                        >
                          {animationTabContent}
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanel>
                </>
              )}
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
                      {t('Refresh Every')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={10}
                      value={form.values.refresh_every}
                      error={form.errors.refresh_every}
                      touched={form.touched.refresh_every}
                      label={''}
                      maxValue={_get(
                        allowedThemeSetting,
                        'max_refresh_every',
                        21600
                      )}
                      minValue={_get(
                        allowedThemeSetting,
                        'min_refresh_every',
                        300
                      )}
                      onChange={val => form.setFieldValue('refresh_every', val)}
                      rootClass={classes.sliderRootClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={5} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            justify="space-between"
            className={classes.mediaInfoContainer}
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
            <Grid item className={classes.mediaActionsWrapper}>
              <MediaTabActions
                mode={mode}
                disabled={isButtonsDisable}
                onReset={() => {
                  form.resetForm(initialFormValues.current)
                  setThemeType(initialFormState.current.themeType)
                  setPaletteType(initialFormState.current.paletteType)
                  setSelectedPalette(initialFormState.current.selectedPalette)
                }}
                onAdd={form.handleSubmit}
                onAddAndClose={() => {
                  setAutoClose(true)
                  form.handleSubmit()
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default translate('translations')(withStyles(styles)(CourtDockets))
