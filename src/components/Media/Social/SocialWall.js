import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'

import update from 'immutability-helper'
import { translate } from 'react-i18next'

import * as Yup from 'yup'
import {
  get as _get,
  isEmpty as _isEmpty,
  isArray as _isArray,
  cloneDeep as _cloneDeep
} from 'lodash'
import PropTypes from 'prop-types'

import { useFormik } from 'formik'

import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import {
  WhiteButton,
  TabToggleButton,
  TabToggleButtonGroup
} from 'components/Buttons'

import {
  FormControlPalettePicker,
  FormControlInput,
  FormControlSpeedInput,
  SliderInputRange,
  FormControlReactSelect
} from 'components/Form'

import MediaHtmlCarousel from '../MediaHtmlCarousel'

import { useDispatch, useSelector } from 'react-redux'
import { MediaInfo, MediaTabActions } from '../index'
import SocialWallHelperDialog from './SocialWallHelperDialog'

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

import { mediaConstants as constants } from '../../../constants'

import useMediaTheme from 'hooks/useMediaTheme'
import SocialWallNetworkSettings from './SocialWallNetworkSettings'
import moment from 'moment'

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
    padding: 0
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
    value: 'instagram',
    label: 'Instagram',
    network_settings: {
      instagram_images: [
        {
          value: 'thumbnail',
          label: 'Thumbnail'
        },
        {
          value: 'low_resolution',
          label: 'Low Resolution'
        },
        {
          value: 'standard_resolution',
          label: 'Standard Resolution'
        }
      ],
      instagram_comments: 0,
      instagram_likes: 0,
      instagram_output: 'title,thumb,text,comments,likes,user,share,info,tags'
    }
  },
  {
    value: 'twitter',
    label: 'Twitter',
    network_settings: {
      twitter_feeds: 'retweets,replies',
      twitter_output: 'thumb,text,user,share,info',
      twitter_images: 'thumb,small,medium,large',
      twitter_since_id: 3,
      twitter_max_id: 5
    }
  },
  {
    value: 'facebook',
    label: 'Facebook',
    network_settings: {
      facebook_pagefeed: [
        {
          value: 'posts',
          label: 'Posts'
        },
        {
          value: 'tagged',
          label: 'Tagged'
        },
        {
          value: 'feed',
          label: 'Feed'
        }
      ],
      facebook_image_width: [
        {
          value: '180',
          label: 'Thumb - 180px'
        },
        {
          value: '300',
          label: 'Tiny - 300px'
        },
        {
          value: '480',
          label: 'Very Small - 480px'
        },
        {
          value: '640',
          label: 'Small - 640px'
        },
        {
          value: '720',
          label: 'Medium - 720px'
        },
        {
          value: '800',
          label: 'Large - 800px'
        },
        {
          value: '960',
          label: 'Larger - 960px'
        },
        {
          value: '1280',
          label: 'X-Large - 1280px'
        },
        {
          value: '1600',
          label: 'XX-Large - 1600px'
        }
      ],
      facebook_datetime_from: moment().format('YYYY/MM/DD'),
      facebook_datetime_to: moment().format('YYYY/MM/DD'),
      facebook_comments: 3,
      facebook_likes: 5,
      facebook_output: 'title,thumb,text,comments,likes,user,share,info'
    }
  },
  {
    value: 'tumblr',
    label: 'Tumblr',
    network_settings: {
      tumblr_thumb: [
        {
          value: '75',
          label: 'Width: 75px'
        },
        {
          value: '100',
          label: 'Width: 100px'
        },
        {
          value: '250',
          label: 'Width: 250px'
        },
        {
          value: '400',
          label: 'Width: 400px'
        },
        {
          value: '500',
          label: 'Width: 500px'
        },
        {
          value: '1280',
          label: 'Width: 1280px'
        }
      ],
      tumblr_video: [
        {
          value: '250',
          label: 'Width: 250px'
        },
        {
          value: '400',
          label: 'Width: 400px'
        },
        {
          value: '500',
          label: 'Width: 500px'
        }
      ],
      tumblr_embed: false,
      tumblr_output: 'title,thumb,text,user,share,info'
    }
  },
  {
    value: 'vimeo',
    label: 'Vimeo',
    network_settings: {
      vimeo_thumb: [
        {
          value: 'small',
          label: 'Small - 100x75'
        },
        {
          value: 'medium',
          label: 'Medium - 200x150'
        },
        {
          value: 'large',
          label: 'Large - 640'
        }
      ],
      vimeo_output: 'title,thumb,text,user,share,info'
    }
  },
  {
    value: 'vk',
    label: 'Vk',
    network_settings: {
      vk_feed: [
        {
          value: 'owner',
          label: 'Owner'
        },
        {
          value: 'tagged',
          label: 'Tagged'
        },
        {
          value: 'all',
          label: 'All'
        }
      ],
      vk_image_width: [
        {
          value: '75',
          label: '75px'
        },
        {
          value: '130',
          label: '130px'
        },
        {
          value: '604',
          label: '604px'
        },
        {
          value: '807',
          label: '807px'
        },
        {
          value: '1280',
          label: '1280px'
        },
        {
          value: '2560',
          label: '2560px'
        }
      ],
      vk_output: 'thumb,text,stat,user,share,info'
    }
  },
  {
    value: 'flickr',
    label: 'Flickr',
    network_settings: {
      flickr_thumb: [
        {
          value: 's',
          label: 'Small square 75x75'
        },
        {
          value: 'q',
          label: 'Large square 150x150'
        },
        {
          value: 't',
          label: 'Tiny, 100 on longest side'
        },
        {
          value: 'm',
          label: 'Thumbnail. 240 on longest side'
        },
        {
          value: 'n',
          label: 'Small, 320 on longest side'
        },
        {
          value: 'z',
          label: 'Medium 640, 640 on longest side'
        },
        {
          value: 'c',
          label: 'Large, 800 on longest side'
        },
        {
          value: 'b',
          label: 'X-Large, 1024 on longest side'
        }
      ],
      flickr_output: 'title,thumb,text,user,share,info,tags'
    }
  },
  {
    value: 'google',
    label: 'Google'
  },
  {
    value: 'deviantart',
    label: 'Deviantart'
  },
  {
    value: 'soundcloud',
    label: 'SoundCloud',
    network_settings: {
      soundcloud_output: 'title,text,thumb,user,share,info,meta,tags'
    }
  },
  {
    value: 'linkedin',
    label: 'Linked In'
  },
  {
    value: 'pinterest',
    label: 'Pinterest',
    network_settings: {
      pinterest_image_width: [
        {
          value: '237',
          label: 'Thumb - 237px'
        },
        {
          value: '736',
          label: 'Large - 736px'
        }
      ],
      pinterest_output: 'title,thumb,text,user,share,info'
    }
  },
  {
    value: 'youtube',
    label: 'YouTube',
    network_settings: {
      youtube_thumb: 'default,medium,high,standard,maxres',
      youtube_output: 'title,thumb,text,user,share,info'
    }
  },
  {
    value: 'rss',
    label: 'RSS',
    network_settings: {
      rss_text: true,
      rss_output: 'title,thumb,text,user,tags,share,info'
    }
  }
]

const parsePalettes = skins => {
  const newPalettes = []

  skins.forEach((skin, index) => {
    newPalettes[index] = {}
    newPalettes[index].id = index + 1
    newPalettes[index].palette = {}

    Object.keys(skin).forEach(key => {
      newPalettes[index].palette[key] = {}

      newPalettes[index].palette[key].tooltip = getTooltip(key)
      newPalettes[index].palette[key].value = skin[key]
    })
  })

  return newPalettes
}

const getTooltip = key => {
  switch (key) {
    case 'font_color':
      return 'Font color'
    case 'item_background_color':
      return 'Item background color'
    case 'item_border_color':
      return 'Item border color'
    case 'link_color':
      return 'Link color'
    default:
      return key
  }
}

const styles = ({ palette, type, formControls, typography }) => ({
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
    marginTop: 45
  },
  previewMediaText: {
    ...typography.lightText[type]
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
  inputLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#74809a',
    transform: 'none !important',
    marginRight: '10px'
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
    marginBottom: 16
  },
  accountSettingsContainer: {
    padding: 15
  },
  marginTop: {
    marginTop: 16
  },
  sliderInputClass: {
    width: '46px'
  },
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
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
    padding: '0 15px 16px'
  },
  formControlNumericInputRootClass: {
    '& > span': {
      height: '38px !important'
    }
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
  scroll_speed: Yup.number().min(20).max(1000),
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.social)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const { themes, featureId } = useMediaTheme('Social', 'Socialwall')
  const wallThemes = useMemo(() => themes.Legacy || [], [themes.Legacy])

  const initialFormState = useRef({
    selectedPaletteType: 'presets',
    selectedPalette: {},
    palettePresets: []
  })

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [isDialog, setIsDialog] = useState(false)

  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [selectedNetworkSettings, setSelectedNetworkSettings] = useState(
    undefined
  )

  const [palettePresets, setPalettePresets] = useState(
    initialFormState.current.palettePresets
  )

  const [selectedPaletteType, setSelectedPaletteType] = useState(
    initialFormState.current.selectedPaletteType
  )
  const [selectedPalette, setSelectedPalette] = useState(
    initialFormState.current.selectedPalette
  )

  const initialFormValues = useRef({
    themeId: undefined,
    items_per_page: 5,
    scroll_speed: 20,
    network: [
      {
        network: '',
        value: ''
      }
    ],
    network_settings: {},
    theme_settings: {
      font_color: 'rgba(255,255,255,1)',
      link_color: 'rgba(255,255,255,1)',
      item_background_color: 'rgba(59, 68, 81, 1)',
      item_border_color: 'rgba(255,255,255,1)',
      font_type: 'arial'
    },
    item_width: 140,
    breakpoint_width: 3,
    refresh_every: 1,
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
        scroll_speed,
        network,
        theme_settings,
        item_width,
        refresh_every,
        breakpoint_width,
        network_settings
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)
      const attributes = {
        items_per_page,
        scroll_speed,
        network: prepareNetworks(network),
        theme_settings,
        item_width,
        refresh_every,
        breakpoint_width,
        network_settings
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
    if (!!wallThemes.length && !backendData) {
      const defaultTheme = getMediaThemesSettings(
        wallThemes[0].customProperties,
        true
      )

      !!defaultTheme &&
        form.setValues(
          update(form.values, {
            theme_settings: { $set: defaultTheme }
          })
        )
    }

    if (wallThemes.length && mode === 'add') {
      handleSlideClick(wallThemes[0].id)
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
      scroll_speed,
      network,
      theme_settings,
      item_width,
      refresh_every,
      breakpoint_width,
      network_settings
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
            scroll_speed,
            network: prepareNetworks(network),
            theme_settings,
            item_width,
            refresh_every,
            breakpoint_width,
            network_settings
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

  const isNetworkSettings = network =>
    networks.find(n => n.value === network) &&
    networks.find(n => n.value === network).network_settings

  const openNetworkSettings = network => {
    const settings = networks.find(n => n.value === network).network_settings

    const defaultSettings = () => {
      const temp = { ...settings }

      Object.keys(temp).forEach(key => {
        if (_isArray(temp[key])) {
          temp[key] = temp[key][0].value
        }
      })

      return temp
    }

    !form.values.network_settings[network] &&
      form.setFieldValue(`network_settings.${network}`, defaultSettings())

    setSelectedNetwork(network)
    setSelectedNetworkSettings(settings)
  }

  const handleNetworkSettingsSave = data => {
    form.setFieldValue(`network_settings.${selectedNetwork}`, data)

    setSelectedNetwork('')
  }

  const handleSlideClick = themeId => {
    if (wallThemes.length) {
      const theme = wallThemes.find(i => i.id === themeId)
      let defaultTheme

      if (theme)
        defaultTheme = getMediaThemesSettings(theme.customProperties, true)

      handlePalettesChange(themeId)

      form.setValues({
        ...form.values,
        themeId: themeId,
        ...(defaultTheme && { theme_settings: defaultTheme })
      })
    }
  }

  const handlePalettesChange = themeId => {
    const theme = wallThemes.find(i => i.id === themeId)

    if (_get(theme, 'customProperties.conditions.skin')) {
      const palettes = parsePalettes(
        _get(theme, 'customProperties.conditions.skin')
      )

      setPalettePresets(_cloneDeep(palettes))
    }
  }

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
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (backendData && backendData.id && wallThemes.length) {
      const {
        themeId,
        attributes: {
          items_per_page,
          scroll_speed,
          network,
          theme_settings,
          item_width,
          refresh_every,
          breakpoint_width,
          network_settings
        }
      } = backendData

      initialFormValues.current = {
        ...form.values,
        themeId,
        items_per_page,
        scroll_speed,
        network: prepareNetworks(network, true),
        theme_settings,
        item_width,
        breakpoint_width,
        refresh_every,
        network_settings,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }

      handlePalettesChange(themeId)

      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData, wallThemes])

  useEffect(
    () => {
      !selectedNetwork && setSelectedNetworkSettings(undefined)
    },
    // eslint-disable-next-line
    [selectedNetwork]
  )

  useEffect(
    () => {
      if (!!palettePresets.length) {
        const { theme_settings } = form.values

        const option = palettePresets.find(({ palette }) => {
          return (
            palette.font_color.value === theme_settings.font_color &&
            palette.link_color.value === theme_settings.link_color &&
            palette.item_background_color.value ===
              theme_settings.item_background_color &&
            palette.item_border_color.value === theme_settings.item_border_color
          )
        })

        if (option) {
          setSelectedPalette(option)
        } else {
          console.log('theme_settings', theme_settings)
          setSelectedPaletteType('custom')
          setSelectedPalette({
            palette: {
              font_color: { value: theme_settings.font_color },
              link_color: { value: theme_settings.link_color },
              item_background_color: {
                value: theme_settings.item_background_color
              },
              item_border_color: { value: theme_settings.item_border_color }
            }
          })
        }
      }
    },
    // eslint-disable-next-line
    [form.values.theme_settings, palettePresets]
  )

  const { values, errors, touched, submitCount, isValid } = form
  const isButtonsDisable = formSubmitting || (submitCount > 0 && !isValid)

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="center" className={classes.marginTop}>
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
                        onSlideClick={slide => handleSlideClick(slide.name)}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop}>
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
                {values.network.map((network, index) => {
                  return (
                    <Grid
                      key={index}
                      container
                      alignItems="center"
                      className={classes.accountSettingsContainer}
                      spacing={16}
                    >
                      <Grid item xs={5}>
                        <FormControlReactSelect
                          marginBottom={0}
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
                            label: <span>{label}</span>,
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
                      <Grid item xs={1}>
                        {isNetworkSettings(network.network) && (
                          <WhiteButton
                            className={classes.addNetworkBtn}
                            onClick={() => openNetworkSettings(network.network)}
                          >
                            <i className={'icon-settings-1'} />
                          </WhiteButton>
                        )}
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.marginTop}>
              <Grid item xs={12} className={classes.themeCardWrap}>
                <Grid container justify="center" className={classes.marginTop}>
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
                        preset={selectedPalette}
                        allowChangeColor={true}
                        selected={selectedPalette}
                        onSelectPalette={onSelectPalette}
                      />
                    </Grid>
                  ) : (
                    palettePresets.map(item => (
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
            <Grid container justify="center" className={classes.marginTop}>
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
                  className={classes.marginTop}
                  spacing={16}
                >
                  <Grid item xs={5}>
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
                  <Grid item xs={7}>
                    <Grid container alignItems="center" justify="flex-end">
                      <Grid item>
                        <Typography className={classes.formInputLabel}>
                          Font Family
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControlReactSelect
                          marginBottom={0}
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
                            label: (
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
                  <Grid item xs={5}>
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
                  <Grid item xs={7}>
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
                  className={classes.marginTop}
                >
                  <Grid item xs={6} className={classes.paddingLeft}>
                    <FormControlSpeedInput
                      step={20}
                      value={values.scroll_speed}
                      maxValue={1000}
                      minValue={20}
                      onChange={val => form.setFieldValue('scroll_speed', val)}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      labelClass={classes.speedInputLabel}
                      labelRightClass={classes.speedInputLabel}
                      labelLeftClass={classes.speedInputLabel}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SliderInputRange
                      label={'Refresh Every'}
                      tooltip={
                        'Frequency of content refresh during playback (in minutes)'
                      }
                      labelAtEnd={false}
                      step={1}
                      value={values.refresh_every}
                      error={errors.refresh_every}
                      touched={touched.refresh_every}
                      maxValue={360}
                      minValue={1}
                      onChange={val => form.setFieldValue('refresh_every', val)}
                      rootClass={classes.sliderContainerClass}
                      labelClass={classes.sliderLabelClass}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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

      <SocialWallNetworkSettings
        open={!!selectedNetwork}
        onClose={() => setSelectedNetwork('')}
        onSave={handleNetworkSettingsSave}
        settings={selectedNetworkSettings}
        values={values.network_settings[selectedNetwork]}
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
