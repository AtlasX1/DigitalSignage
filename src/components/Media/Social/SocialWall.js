import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'

import {
  withStyles,
  Grid,
  Typography,
  CircularProgress,
  Tooltip
} from '@material-ui/core'

import {
  WhiteButton,
  TabToggleButton,
  TabToggleButtonGroup
} from '../../Buttons'

import {
  FormControlPalettePicker,
  FormControlInput,
  FormControlSelect,
  FormControlSpeedInput
} from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { socialWallPalettePresets } from '../../../utils/palettePresets'
import { useDispatch, useSelector } from 'react-redux'
import { MediaInfo, MediaTabActions } from '../index'
import { useFormik } from 'formik'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'
import update from 'immutability-helper'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import * as Yup from 'yup'
import { get as _get, isEmpty as _isEmpty } from 'lodash'
import {
  clearMediaThemes,
  getContentSourceOfMediaFeatureById,
  getThemeOfMediaFeatureById
} from '../../../actions/configActions'
import PropTypes from 'prop-types'
import SocialWallHelperDialog from './SocialWallHelperDialog'

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
    padding: '0 5px'
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
        Facebook APIs and integrations with 3rd party platform are undergoing
        changes. As a result we are experiencing intermittent service
        disruptions as we fetch data from Facebook. Thank you for your patience.
      </div>
    </div>
  )
)

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

const networks = [
  {
    value: 'deviantart',
    label: 'Deviantart',
    settings: {}
  },
  {
    value: 'facebook',
    label: 'Facebook',
    settings: {}
  },
  {
    value: 'flickr',
    label: 'Flickr',
    settings: {}
  },
  {
    value: 'google',
    label: 'Google',
    settings: {}
  },
  {
    value: 'pinterest',
    label: 'Pinterest',
    settings: {}
  },
  {
    value: 'rss',
    label: 'RSS',
    settings: {}
  },
  {
    value: 'soundcloud',
    label: 'SoundCloud',
    settings: {}
  },
  {
    value: 'stumbleupon',
    label: 'Stumbleupon',
    settings: {}
  },
  {
    value: 'tumblr',
    label: 'Tumblr',
    settings: {}
  },
  {
    value: 'twitter',
    label: 'Twitter',
    settings: {}
  },
  {
    value: 'vimeo',
    label: 'Vimeo',
    settings: {}
  },
  {
    value: 'vk',
    label: 'Vk',
    settings: {}
  }
]

const styles = ({ palette, type }) => ({
  root: {
    margin: '31px 30px'
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
    marginBottom: '19px'
  },
  tabToggleButton: {
    width: '128px'
  },
  previewMediaBtn: {
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaRow: {
    marginTop: '33px'
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
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.header.background,
    display: 'flex',
    alignItems: 'center'
  },
  addNetworkBtn: {
    height: 38,
    width: 38,
    minWidth: 38,
    padding: 0
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px'
  },
  themeHeaderInfoText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px',
    marginRight: 10,
    cursor: 'pointer'
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
    padding: '0 7px',
    margin: '0 -7px'
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
  marginTop1: {
    marginTop: '30px'
  },
  marginTop2: {
    marginTop: '10px'
  },
  marginTop3: {
    marginTop: '8px'
  },
  marginTop4: {
    marginTop: '16px'
  },
  marginTop5: {
    marginTop: '20px'
  },
  marginTop6: {
    marginTop: '18px'
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
  numberInput: {
    '& span': {
      width: '76px',
      height: '36px'
    }
  },
  templateStyleInputRoot: {
    marginBottom: '0'
  },
  formControlInputClass: {
    fontSize: '14px !important'
  },
  formContainer: {
    padding: '0 20px 15px'
  },
  formControlNumericInputRootClass: {
    '& > span': {
      height: '38px !important'
    }
  },
  inputContainer: {
    padding: '0 8px',
    margin: '0 -8px'
  },
  paddingLeft: {
    paddingLeft: '30px'
  },
  formControlSelectInput: {
    height: 38,
    fontSize: 14
  },
  speedInputLabel: {
    color: '#74809a'
  }
})

const validationSchema = Yup.object().shape({
  themeId: Yup.number().required('Select theme'),
  items_per_page: Yup.number().min(5).required('Enter field'),
  duration: Yup.number().min(1).max(150),
  network: Yup.array()
    .min(0)
    .of(
      Yup.object().shape({
        network: Yup.string().required('Select Network'),
        value: Yup.string().required('Enter feed value')
      })
    )
    .required(),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const SocialWall = props => {
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
  const { configMediaCategory } = useSelector(({ config }) => config)
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.social)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const wallThemes = useSelector(({ config }) => {
    if (
      config.themeOfMedia &&
      config.themeOfMedia.response &&
      config.themeOfMedia.response.Legacy
    ) {
      return config.themeOfMedia.response.Legacy
    }
    return []
  })

  const initialFormState = useRef({
    selectedPaletteType: 'presets',
    selectedPalette: {}
  })

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [isDialog, setIsDialog] = useState(false)

  const [selectedPaletteType, setSelectedPaletteType] = useState(
    initialFormState.current.selectedPaletteType
  )
  const [selectedPalette, setSelectedPalette] = useState(
    initialFormState.current.selectedPalette
  )

  const initialFormValues = useRef({
    themeId: undefined,
    items_per_page: 5,
    duration: 5,
    network: [
      {
        network: '',
        value: ''
      }
    ],
    theme_settings: {
      font_color: '#fff',
      link_color: '#076EB6',
      item_background_color: '#79858b',
      item_border_color: '#000',
      font_type: 'arial'
    },
    item_width: 140,
    breakpoint_width: 3,
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
        items_per_page,
        duration,
        network,
        theme_settings,
        item_width,
        breakpoint_width
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const attributes = {
        items_per_page,
        duration,
        network: prepareNetworks(network),
        theme_settings,
        item_width,
        breakpoint_width
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

  const onWallThemesChange = useCallback(() => {
    if (wallThemes.length && mode === 'add') {
      form.setValues(
        update(form.values, {
          themeId: { $set: wallThemes[0].id }
        })
      )
    }
    // eslint-disable-next-line
  }, [wallThemes, mode])

  useEffect(onWallThemesChange, [onWallThemesChange])

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
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
      items_per_page,
      duration,
      network,
      theme_settings,
      item_width,
      breakpoint_width
    } = values

    form.setTouched(
      update(form.touched, {
        $merge: {
          items_per_page: true,
          network: true,
          themeId: true
        }
      })
    )

    try {
      await validationSchema.validate(
        { items_per_page, network, themeId },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          themeId,
          attributes: {
            items_per_page,
            duration,
            network: prepareNetworks(network),
            theme_settings,
            item_width,
            breakpoint_width
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  const prepareNetworks = networks => {
    if (!Array.isArray(networks)) {
      return Object.entries(networks).reduce(
        (accum, [network, values]) => [
          ...accum,
          ...values.map(value => ({ network, value }))
        ],
        []
      )
    } else {
      return networks.reduce((accum, { network, value }) => {
        const prevValues = _isEmpty(accum[network]) ? [] : accum[network]
        return {
          ...accum,
          [network]: [...prevValues, value]
        }
      }, {})
    }
  }

  const onSelectPalette = selectedPalette => {
    const { palette } = selectedPalette
    setSelectedPalette(selectedPalette)
    Object.keys(palette).forEach(key =>
      form.setFieldValue(`theme_settings.${key}`, palette[key].value)
    )
  }
  const handlePaletteTypeChanges = (event, selectedPaletteType) =>
    setSelectedPaletteType(selectedPaletteType)

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
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Social', 'Socialwall')
    setFeatureId(id)
  }, [configMediaCategory])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (backendData && backendData.id) {
      const {
        themeId,
        attributes: {
          items_per_page,
          duration,
          network,
          theme_settings,
          item_width,
          breakpoint_width
        }
      } = backendData

      initialFormValues.current = {
        ...form.values,
        themeId,
        items_per_page,
        duration,
        network: prepareNetworks(network, true),
        theme_settings,
        item_width,
        breakpoint_width,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (featureId) {
      dispatchAction(getThemeOfMediaFeatureById(featureId))
      dispatchAction(getContentSourceOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

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
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="center" className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography className={classes.themeHeaderText}>
                    Theme
                  </Typography>
                </header>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    {!!wallThemes.length && (
                      <MediaHtmlCarousel
                        settings={{
                          infinite: true
                        }}
                        activeSlide={values.themeId}
                        slides={wallThemes.map(theme => ({
                          name: theme.id,
                          content: (
                            <Tooltip
                              key={theme.id}
                              title={theme.tooltip}
                              placement="top"
                            >
                              <img src={theme.thumb} alt={theme.tooltip} />
                            </Tooltip>
                          )
                        }))}
                        error={errors.themeId}
                        touched={touched.themeId}
                        onSlideClick={slide =>
                          form.setFieldValue('themeId', slide.name)
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop1}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography
                    className={classes.themeHeaderInfoText}
                    onClick={() => setIsDialog(true)}
                  >
                    Account Settings
                  </Typography>
                  <TabIcon iconClassName={'icon-interface-information-1'} />
                </header>
                {values.network.map((network, index) => (
                  <Grid
                    key={index}
                    container
                    alignItems="center"
                    justify="space-between"
                    className={classes.accountSettingsContainer}
                  >
                    <Grid item xs={5}>
                      <FormControlSelect
                        custom={true}
                        marginBottom={false}
                        value={network.network}
                        error={
                          errors.network && errors.network[index]
                            ? errors.network[index].network
                            : ''
                        }
                        touched={touched.network}
                        handleChange={e => {
                          const updatedNetworks = update(values.network, {
                            [index]: {
                              $set: {
                                network: e.target.value,
                                value: ''
                              }
                            }
                          })
                          form.setFieldValue('network', updatedNetworks)
                        }}
                        options={networks.map(({ value, label }) => ({
                          component: <span>{label}</span>,
                          value
                        }))}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <FormControlInput
                        formControlRootClass={classes.formControlRootClass}
                        error={
                          errors.network && errors.network[index]
                            ? errors.network[index].value
                            : ''
                        }
                        placeholder="ID"
                        touched={touched.network}
                        value={network.value}
                        handleChange={e => {
                          const updatedNetworks = update(values.network, {
                            [index]: {
                              $set: {
                                network: values.network[index].network,
                                value: e.target.value
                              }
                            }
                          })
                          form.setFieldValue('network', updatedNetworks)
                        }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <WhiteButton
                        className={classes.addNetworkBtn}
                        onClick={() => {
                          const updatedNetworks = update(values.network, {
                            $push: [
                              {
                                network: '',
                                value: ''
                              }
                            ]
                          })
                          form.setFieldValue('network', updatedNetworks)
                        }}
                      >
                        <i className={'icon-add-circle-1'} />
                      </WhiteButton>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop3}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid container justify="center" className={classes.marginTop2}>
                  <Grid item>
                    <TabToggleButtonGroup
                      className={classes.tabToggleButtonGroup}
                      value={selectedPaletteType}
                      exclusive
                      onChange={handlePaletteTypeChanges}
                    >
                      <TabToggleButton
                        className={classes.tabToggleButton}
                        value="presets"
                      >
                        Presets
                      </TabToggleButton>
                      <TabToggleButton
                        className={classes.tabToggleButton}
                        value="custom"
                      >
                        Custom
                      </TabToggleButton>
                    </TabToggleButtonGroup>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justify="center"
                  className={classes.palettePickerContainer}
                >
                  {selectedPaletteType === 'custom' ? (
                    <Grid item>
                      <FormControlPalettePicker
                        id={1}
                        preset={socialWallPalettePresets[0]}
                        allowChangeColor={true}
                        selected={selectedPalette}
                        onSelectPalette={onSelectPalette}
                      />
                    </Grid>
                  ) : (
                    socialWallPalettePresets.map(item => (
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
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop3}>
              <Grid
                item
                xs={12}
                className={[classes.themeCardWrap, classes.formContainer].join(
                  ' '
                )}
              >
                <Grid
                  container
                  justify="space-between"
                  className={classes.marginTop6}
                >
                  <Grid item xs={5} className={classes.inputContainer}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Number of Items
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={[
                            classes.templateStyleInputRoot,
                            classes.numberInput
                          ].join(' ')}
                          formControlInputClass={classes.formControlInputClass}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                          min={5}
                          max={100}
                          value={values.items_per_page}
                          error={errors.items_per_page}
                          touched={touched.items_per_page}
                          handleChange={val =>
                            form.setFieldValue('items_per_page', val)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={7} className={classes.inputContainer}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Font Family
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlSelect
                          custom
                          marginBottom={false}
                          value={values.theme_settings.font_type}
                          error={
                            errors.theme_settings
                              ? errors.theme_settings.font_type
                              : ''
                          }
                          touched={
                            touched.theme_settings &&
                            touched.theme_settings.font_type
                          }
                          handleChange={e =>
                            form.setFieldValue(
                              'theme_settings.font_type',
                              e.target.value
                            )
                          }
                          inputClasses={{
                            input: classes.formControlSelectInput
                          }}
                          options={fonts.map(name => ({
                            component: (
                              <span key={name} style={{ fontFamily: name }}>
                                {name}
                              </span>
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
                  justify="space-between"
                  className={classes.marginTop4}
                >
                  <Grid item xs={5} className={classes.inputContainer}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Breakpoint Width
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={[
                            classes.templateStyleInputRoot,
                            classes.numberInput
                          ].join(' ')}
                          formControlInputClass={classes.formControlInputClass}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                          min={1}
                          value={values.breakpoint_width}
                          error={errors.breakpoint_width}
                          touched={touched.breakpoint_width}
                          handleChange={val =>
                            form.setFieldValue('breakpoint_width', val)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={7} className={classes.inputContainer}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Width of Tile
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={[
                            classes.templateStyleInputRoot,
                            classes.numberInput
                          ].join(' ')}
                          formControlInputClass={classes.formControlInputClass}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                          min={1}
                          value={values.item_width}
                          error={errors.item_width}
                          touched={touched.item_width}
                          handleChange={val =>
                            form.setFieldValue('item_width', val)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justify="space-between"
                  className={classes.marginTop5}
                >
                  <Grid item xs={6} className={classes.paddingLeft}>
                    <FormControlSpeedInput
                      step={1}
                      value={values.duration}
                      maxValue={150}
                      minValue={1}
                      onChange={val => form.setFieldValue('duration', val)}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      labelClass={classes.speedInputLabel}
                      labelRightClass={classes.speedInputLabel}
                      labelLeftClass={classes.speedInputLabel}
                    />
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
                  setSelectedPaletteType(
                    initialFormState.current.selectedPaletteType
                  )
                  setSelectedPalette(initialFormState.current.selectedPalette)
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

      <SocialWallHelperDialog
        isDialogOpen={isDialog}
        onClose={() => setIsDialog(false)}
      />
    </form>
  )
}

SocialWall.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

SocialWall.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(SocialWall))
