import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import { get as _get } from 'lodash'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Typography,
  InputLabel,
  Tooltip
} from '@material-ui/core'

import {
  DirectionToggleButton,
  DirectionToggleButtonGroup,
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'
import { SingleIconTab, SingleIconTabs } from 'components/Tabs'
import {
  FormControlInput,
  SliderInputRange,
  FormControlReactSelect,
  FormControlSketchColorPicker,
  FormControlSpeedInput
} from 'components/Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { MediaInfo, MediaTabActions } from '../index'
import { CheckboxSwitcher } from 'components/Checkboxes'

import { mediaConstants as constants } from 'constants/index'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import useMediaContentSource from 'hooks/useMediaContentSource'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ tooltip, iconClassName = '', classes }) => {
    const Tab = (
      <div className={classes.tabIconWrap}>
        <i className={iconClassName} />
      </div>
    )

    return tooltip ? <Tooltip title={tooltip}>{Tab}</Tooltip> : Tab
  }
)

const styles = theme => {
  const { palette, type, formControls, typography } = theme
  return {
    root: {
      margin: '15px 30px'
    },
    tabToggleButtonGroup: {
      marginBottom: 16
    },
    tabToggleButton: {
      width: '128px'
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
        marginRight: '30px'
      }
    },
    formControlInput: {
      width: '100%'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px',
      marginBottom: 16
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    themeHeaderText: {
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '14px;',
      color: palette[type].pages.media.card.header.color,
      marginBottom: '12px'
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important',
      marginRight: '10px'
    },
    formControlLabelClass: {
      fontSize: '1.0833rem',
      position: 'relative',
      flex: '1'
    },
    formControlLabelClass2: {
      fontSize: '14px'
    },
    sliderInputLabelClass: {
      ...formControls.mediaApps.refreshEverySlider.label,
      paddingRight: '15px',
      fontStyle: 'normal'
    },
    formControlRootClass: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    formControlRootClass1: {
      marginBottom: '14px'
    },
    formControlInputRootClass: {
      marginTop: '0px !important',
      flex: '1'
    },
    labelClass: {
      fontSize: '14px'
    },
    numberInput: {
      '& span': {
        width: '76px',
        height: '36px'
      }
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    inputClass: {
      width: '46px'
    },
    radioUrlContainer: {
      padding: '0 15px'
    },
    marginTop: {
      marginTop: 16
    },
    formControlInputClass: {
      fontSize: '14px !important',
      padding: '9px 15px !important'
    },
    layoutOption: { width: '100%', padding: 0, display: 'block', fontSize: 14 },
    layoutOptionInner: { padding: '6px 10px 6px 0px', background: '#ffffff' },
    layoutOptionTitle: { padding: 7, display: 'inline' },
    layoutOptionContent: { display: 'inline', marginLeft: 10 },
    layoutOptionContentInner: { marginLeft: 5 },
    hideCheckboxContainer: {
      padding: 0
    }
  }
}

const validationSchema = Yup.object().shape({
  contentSourceId: Yup.number().when('custom', {
    is: false,
    then: Yup.number().required('Select content source')
  }),
  rss_feed_url: Yup.string().when('custom', {
    is: true,
    then: Yup.string().required('Enter source link')
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

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

const animations = {
  up: [
    {
      label: 'Up',
      value: 'up'
    },
    {
      label: 'Grow',
      value: 'grow'
    },
    {
      label: 'Cards',
      value: 'cards'
    },
    {
      label: 'Curl',
      value: 'curl'
    },
    {
      label: 'Wave',
      value: 'wave'
    },
    {
      label: 'Flip',
      value: 'flip'
    },
    {
      label: 'Fly',
      value: 'fly'
    },
    {
      label: 'Reverse Fly',
      value: 'reverseFly'
    },
    {
      label: 'Helix',
      value: 'helix'
    },
    {
      label: 'Fan',
      value: 'fan'
    },
    {
      label: 'Papercut',
      value: 'papercut'
    },
    {
      label: 'Twirl',
      value: 'twirl'
    },
    {
      label: 'Tilt',
      value: 'tilt'
    },
    {
      label: 'Zipper',
      value: 'zipper'
    },
    {
      label: 'Bounce Up',
      value: 'bounceUp'
    },
    {
      label: 'Slide Up',
      value: 'slideUp'
    },
    {
      label: 'Continue scroll',
      value: 'continueScroll'
    }
  ],
  down: [
    {
      label: 'Down',
      value: 'down'
    },
    {
      label: 'Grow',
      value: 'grow'
    },
    {
      label: 'Cards',
      value: 'cards'
    },
    {
      label: 'Curl',
      value: 'curl'
    },
    {
      label: 'Wave',
      value: 'wave'
    },
    {
      label: 'Flip',
      value: 'flip'
    },
    {
      label: 'Fly',
      value: 'fly'
    },
    {
      label: 'Reverse Fly',
      value: 'reverseFly'
    },
    {
      label: 'Helix',
      value: 'helix'
    },
    {
      label: 'Fan',
      value: 'fan'
    },
    {
      label: 'Papercut',
      value: 'papercut'
    },
    {
      label: 'Twirl',
      value: 'twirl'
    },
    {
      label: 'Tilt',
      value: 'tilt'
    },
    {
      label: 'Zipper',
      value: 'zipper'
    },
    {
      label: 'Bounce Down',
      value: 'bounceDown'
    },
    {
      label: 'Flip X',
      value: 'flipX'
    },
    {
      label: 'Flip Y',
      value: 'flipY'
    },
    {
      label: 'Slide Down',
      value: 'slideDown'
    }
  ],
  left: [
    {
      label: 'Scrolling',
      value: 'scrolling'
    },
    {
      label: 'Bounce Left',
      value: 'bounceLeft'
    },
    {
      label: 'Rotate Down Left',
      value: 'rotateDownLeft'
    },
    {
      label: 'Rotate Up Left',
      value: 'rotateUpLeft'
    },
    {
      label: 'Slide Left',
      value: 'slideLeft'
    },
    {
      label: 'Speed In Left',
      value: 'speedInLeft'
    },
    {
      label: 'Zoom Left',
      value: 'zoomLeft'
    }
  ],
  right: [
    {
      label: 'Scrolling',
      value: 'scrolling'
    },
    {
      label: 'Bouce Right',
      value: 'bouceRight'
    },
    {
      label: 'Slide Right',
      value: 'slideRight'
    },
    {
      label: 'Roll Right',
      value: 'rollRight'
    },
    {
      label: 'Rotate Down Right',
      value: 'rotateDownRight'
    },
    {
      label: 'Rotate Up Right',
      value: 'rotateUpRight'
    },
    {
      label: 'Zoom Right',
      value: 'zoomRight'
    }
  ]
}

const layouts = classes => [
  {
    label: (
      <span className={classNames(classes.labelClass, classes.layoutOption)}>
        <div className={classes.layoutOptionInner}>
          <div className={classes.layoutOptionTitle}>
            <span>Weekly News </span>
          </div>
          <div className={classes.layoutOptionContent}>
            <span className={classes.layoutOptionContentInner}>
              Check out the bake sale in Wilma's garage
            </span>
          </div>
        </div>
      </span>
    ),
    value: 1
  },
  {
    label: (
      <span className={classNames(classes.labelClass, classes.layoutOption)}>
        <div className={classes.layoutOptionInner}>
          <div
            className={classes.layoutOptionTitle}
            style={{
              background: '#F44A56',
              color: '#FFF'
            }}
          >
            <span>Weekly News </span>
          </div>
          <div className={classes.layoutOptionContent}>
            <span className={classes.layoutOptionContentInner}>
              Check out the bake sale in Wilma's garage
            </span>
          </div>
        </div>
      </span>
    ),
    value: 2
  },
  {
    label: (
      <span className={classNames(classes.labelClass, classes.layoutOption)}>
        <div className={classes.layoutOptionInner}>
          <div
            className={classes.layoutOptionTitle}
            style={{
              background: '#27AE60',
              color: '#FFF'
            }}
          >
            <span>Weekly News </span>
          </div>
          <div className={classes.layoutOptionContent}>
            <span className={classes.layoutOptionContentInner}>
              Check out the bake sale in Wilma's garage
            </span>
          </div>
        </div>
      </span>
    ),
    value: 3
  }
]

const RSS = props => {
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

  const [addMediaReducer, mediaItemReducer] = useSelector(state => [
    state.addMedia.web,
    state.media.mediaItem
  ])

  const initialFormState = useRef({
    selectedFeedId: null
  })

  const { contentSources, featureId } = useMediaContentSource('Web', 'RSSFeed')

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const [contentTabs, setContentTabs] = useState([])
  const [selectedFeedId, setSelectedFeedId] = useState(
    initialFormState.current.selectedFeedId
  )
  const [selectedFeedContent, setSelectedFeedContent] = useState([])

  const [selectedTextType, setSelectedTextType] = useState('header')

  const initialFormValues = useRef({
    contentSourceId: null,
    custom: false,
    rss_feed_url: '',
    header: {
      font_size: 14,
      font_color: 'rgba(255, 255, 255, 1)',
      bg_color: 'rgba(274, 74, 86, 1)',
      hide: false
    },
    title: {
      font_size: 14,
      font_color: 'rgba(0, 0, 0, 1)',
      bg_color: 'rgba(255, 255, 255, 1)',
      hide: false
    },
    content: {
      font_size: 14,
      font_color: 'rgba(0, 0, 0, 1)',
      bg_color: 'rgba(255, 255, 255, 1)',
      hide: false
    },
    font_family: 'Arial',
    duration: 5,
    no_of_rss_feed: 'Multiple',
    no_of_rss_items: 3,
    speed: 1,
    layout: 1,
    direction: 'up',
    animation: 'up',
    refresh_every: 300,
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
        contentSourceId,
        custom,
        rss_feed_url,
        header,
        title,
        content,
        font_family,
        duration,
        no_of_rss_feed,
        no_of_rss_items,
        speed,
        layout,
        direction,
        animation,
        refresh_every
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        featureId: { $set: featureId },
        contentSourceId: { $set: contentSourceId },
        attributes: {
          $set: {
            custom,
            header,
            title,
            content,
            font_family,
            duration,
            no_of_rss_feed,
            no_of_rss_items,
            speed,
            layout,
            direction,
            animation,
            refresh_every,
            ...(custom && { rss_feed_url })
          }
        }
      })

      const actionOptions = {
        mediaName: 'web',
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

  const handleFeedIdChange = (event, contentId) => {
    setSelectedFeedId(contentId)
    const content = contentTabs.find(i => i.id === contentId)
    setSelectedFeedContent(content.source)
  }

  // ---- methods
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
        case 'attributes.rss_feed_url':
          formProp = 'media_rss_feed_url'
          break
        case 'contentSourceId':
          formProp = 'contentSourceId'
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
      contentSourceId,
      custom,
      rss_feed_url,
      header,
      title,
      content,
      font_family,
      duration,
      no_of_rss_feed,
      no_of_rss_items,
      speed,
      layout,
      direction,
      animation,
      refresh_every
    } = form.values

    form.setTouched({
      contentSourceId: true,
      rss_feed_url: true
    })

    try {
      await validationSchema.validate(
        { contentSourceId, rss_feed_url },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          contentSourceId,
          attributes: {
            custom,
            rss_feed_url,
            header,
            title,
            content,
            font_family,
            duration,
            no_of_rss_feed,
            no_of_rss_items,
            speed,
            layout,
            direction,
            animation,
            refresh_every
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  // ---- effects

  useEffect(() => {
    const values = _get(formData, 'values')
    if (values) {
      form.setValues(values)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (backendData && backendData.id) {
      const { contentSourceId, attributes } = backendData

      initialFormValues.current = {
        ...attributes,
        contentSourceId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(
    () => {
      if (form.values.custom) {
        form.setFieldValue('contentSourceId', undefined)
      }
    },
    // eslint-disable-next-line
    [form.values.custom]
  )

  useEffect(() => {
    if (contentSources) {
      setContentTabs(contentSources)

      if (contentSources[0]) {
        const { contentSourceId } = form.values
        const selectedFeed = contentSourceId
          ? contentSources.find(
              ({ source }) =>
                source &&
                source.length &&
                source.some(({ id }) => id === contentSourceId)
            ) || contentSources[0]
          : contentSources[0]

        initialFormState.current.selectedFeedId = selectedFeed.id
        setSelectedFeedId(selectedFeed.id)

        if (mode === 'add') {
          initialFormValues.current.contentSourceId =
            contentSources[0].source[0].id
          form.setFieldValue('contentSourceId', contentSources[0].source[0].id)
        }
      }
    }
    // eslint-disable-next-line
  }, [contentSources])

  useEffect(() => {
    if (contentTabs.length) {
      handleFeedIdChange({}, selectedFeedId)
    }
    // eslint-disable-next-line
  }, [contentTabs])

  // ----

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
          mediaName: 'web',
          tabName: selectedTab
        })
      )
      dispatchAction(getMediaItemsAction())
      if (autoClose) {
        onModalClose()
        setAutoClose(false)
      }
    }

    if (error) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
      dispatchAction(
        clearAddedMedia({
          mediaName: 'web',
          tabName: selectedTab
        })
      )
      onShowSnackbar(error.message)

      form.setFieldValue('mediaInfo.title', form.values.mediaInfo.title)
    }

    setFormSubmitting(false)
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

  useEffect(
    () => {
      form.setFieldValue('animation', animations[values.direction][0].value)
    },
    // eslint-disable-next-line
    [form.values.direction]
  )

  // ---- render

  const { values, errors, touched } = form

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <Grid container justify="center">
              <TabToggleButtonGroup
                className={classes.tabToggleButtonContainer}
                value={values.custom}
                onChange={(e, v) => form.setFieldValue('custom', v)}
                exclusive
              >
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={false}
                >
                  {t('Channels')}
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={true}
                >
                  {t('Custom')}
                </TabToggleButton>
              </TabToggleButtonGroup>

              {values.custom ? (
                <Grid item xs={12} className={classes.marginTop}>
                  <FormControlInput
                    label="Media RSS feed URL:"
                    fullWidth={true}
                    formControlLabelClass={classes.labelClass}
                    value={values.rss_feed_url}
                    error={errors.rss_feed_url}
                    touched={touched.rss_feed_url}
                    handleChange={e =>
                      form.setFieldValue('rss_feed_url', e.target.value)
                    }
                  />
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  className={classNames(
                    classes.themeCardWrap,
                    classes.marginTop
                  )}
                >
                  {!!contentTabs.length && (
                    <div>
                      <header className={classes.themeHeader}>
                        <SingleIconTabs
                          value={selectedFeedId}
                          onChange={handleFeedIdChange}
                          className={classes.featureIconTabContainer}
                        >
                          {contentTabs.map((tab, index) => (
                            <SingleIconTab
                              className={classes.featureIconTab}
                              icon={
                                <TabIcon
                                  iconClassName={classNames('fa', tab.icon)}
                                  tooltip={tab.alias}
                                />
                              }
                              disableRipple={true}
                              value={tab.id}
                              key={tab.id}
                            />
                          ))}
                        </SingleIconTabs>
                      </header>
                      <MediaHtmlCarousel
                        settings={{
                          infinite: false
                        }}
                        activeSlide={values.contentSourceId}
                        slides={selectedFeedContent.map((content, index) => ({
                          name: content.id,
                          value: content.id,
                          content: (
                            <img
                              src={content.thumbUri}
                              alt={content.name}
                              key={`selected_feed_${index}`}
                            />
                          )
                        }))}
                        onSlideClick={({ value }) =>
                          form.setFieldValue('contentSourceId', value)
                        }
                        error={errors.contentSourceId}
                        touched={touched.contentSourceId}
                      />
                    </div>
                  )}
                </Grid>
              )}
            </Grid>

            <Grid container justify="center">
              <Grid item>
                <TabToggleButtonGroup
                  className={classes.tabToggleButtonGroup}
                  value={selectedTextType}
                  exclusive
                  onChange={(e, v) => setSelectedTextType(v)}
                >
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value="header"
                  >
                    Header
                  </TabToggleButton>
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value="title"
                  >
                    Title
                  </TabToggleButton>
                  <TabToggleButton
                    className={classes.tabToggleButton}
                    value="content"
                  >
                    Content
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems="flex-end"
              spacing={16}
            >
              <Grid item xs={6}>
                <FormControlSketchColorPicker
                  marginBottom={false}
                  label={'Font Color'}
                  formControlInputWrapClass={classes.formControlInput}
                  formControlInputRootClass={classes.formControlInput}
                  formControlInputClass={classes.formControlInput}
                  rootClass={classes.formControlInput}
                  color={values[selectedTextType].font_color}
                  onColorChange={color =>
                    form.setFieldValue(`${selectedTextType}.font_color`, color)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlSketchColorPicker
                  marginBottom={false}
                  label={'Background Color'}
                  formControlInputWrapClass={classes.formControlInput}
                  formControlInputRootClass={classes.formControlInput}
                  formControlInputClass={classes.formControlInput}
                  rootClass={classes.formControlInput}
                  color={values[selectedTextType].bg_color}
                  onColorChange={color =>
                    form.setFieldValue(`${selectedTextType}.bg_color`, color)
                  }
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item className={classes.hideCheckboxContainer}>
                <CheckboxSwitcher
                  label="Hide"
                  value={values[selectedTextType].hide}
                  handleChange={val =>
                    form.setFieldValue(`${selectedTextType}.hide`, val)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlInput
                  label={'Font Size'}
                  custom={true}
                  min={5}
                  max={150}
                  value={values[selectedTextType].font_size}
                  error={_get(errors, `${selectedTextType}.font_size`)}
                  touched={_get(touched, `${selectedTextType}.font_size`)}
                  handleChange={val =>
                    form.setFieldValue(`${selectedTextType}.font_size`, val)
                  }
                  formControlRootClass={classNames(
                    classes.formControlRootClass,
                    classes.numberInput
                  )}
                  marginBottom={false}
                  formControlInputClass={classes.formControlInputClass}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlReactSelect
                  label={'Font Family'}
                  value={values.font_family}
                  error={errors.font_family}
                  touched={touched.font_family}
                  handleChange={e =>
                    form.setFieldValue('font_family', e.target.value)
                  }
                  options={fonts.map(name => ({
                    label: (
                      <span
                        className={classes.formControlLabelClass2}
                        style={{ fontFamily: name }}
                      >
                        {name}
                      </span>
                    ),
                    value: name
                  }))}
                />
              </Grid>
              <Grid item xs={6}>
                <SliderInputRange
                  step={1}
                  value={values.duration}
                  label={t('Duration')}
                  maxValue={3600}
                  minValue={5}
                  onChange={val => form.setFieldValue('duration', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputClass={classes.sliderInputClass}
                  numberWraperStyles={{ width: 55 }}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  labelClass={classes.sliderInputLabelClass}
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={12}>
                <FormControlReactSelect
                  label={'Theme Type'}
                  value={values.layout}
                  error={errors.layout}
                  touched={touched.layout}
                  handleChange={e =>
                    form.setFieldValue('layout', e.target.value)
                  }
                  options={layouts(classes)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlReactSelect
                  label={'Animation'}
                  value={values.animation}
                  error={errors.animation}
                  touched={touched.animation}
                  handleChange={e =>
                    form.setFieldValue('animation', e.target.value)
                  }
                  className={'test-animation-test'}
                  options={animations[values.direction]}
                />
              </Grid>
              <Grid item xs={6}>
                <Grid container alignItems="center">
                  <Grid item>
                    <InputLabel
                      shrink
                      variant="filled"
                      className={classes.inputLabel}
                    >
                      Direction
                    </InputLabel>
                  </Grid>
                  <Grid item>
                    <DirectionToggleButtonGroup
                      value={values.direction}
                      exclusive
                      onChange={(e, v) => form.setFieldValue('direction', v)}
                    >
                      <DirectionToggleButton value="left">
                        <TabIcon iconClassName="icon-arrow-left-1" />
                      </DirectionToggleButton>
                      <DirectionToggleButton value="right">
                        <TabIcon iconClassName="icon-arrow-right-1" />
                      </DirectionToggleButton>
                      <DirectionToggleButton value="up">
                        <TabIcon iconClassName="icon-arrow-up" />
                      </DirectionToggleButton>
                      <DirectionToggleButton value="down">
                        <TabIcon iconClassName="icon-arrow-down" />
                      </DirectionToggleButton>
                    </DirectionToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                {values.direction !== 'down' &&
                  values.animation === 'scrolling' && (
                    <Grid container>
                      <FormControlSpeedInput
                        maxValue={45}
                        minValue={1}
                        step={1}
                        value={values.speed}
                        onChange={val => form.setFieldValue('speed', val)}
                        inputContainerClass={classes.inputContainerClass}
                        inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                        labelClass={classes.sliderInputLabelClass}
                      />
                    </Grid>
                  )}
                {(values.direction === 'down' || values.direction === 'up') &&
                  values.animation === 'slideUp' && (
                    <FormControlReactSelect
                      label={'No. Of feeds display'}
                      value={values.no_of_rss_feed}
                      error={errors.no_of_rss_feed}
                      touched={touched.no_of_rss_feed}
                      handleChange={e =>
                        form.setFieldValue('no_of_rss_feed', e.target.value)
                      }
                      options={[
                        {
                          value: 'Multiple',
                          label: 'Multiple'
                        },
                        {
                          value: 'Single',
                          label: 'Single'
                        }
                      ]}
                    />
                  )}
                {(values.direction === 'down' || values.direction === 'up') &&
                  values.animation === 'zipper' && (
                    <FormControlInput
                      label={'No. Of feeds to display'}
                      custom={true}
                      min={1}
                      max={10}
                      value={values.no_of_rss_items}
                      error={errors.no_of_rss_items}
                      touched={touched.no_of_rss_items}
                      handleChange={val =>
                        form.setFieldValue('no_of_rss_items', val)
                      }
                      formControlRootClass={classNames(
                        classes.formControlRootClass,
                        classes.numberInput
                      )}
                      marginBottom={false}
                      formControlInputClass={classes.formControlInputClass}
                    />
                  )}
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
                  step={1}
                  value={values.refresh_every}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={21000}
                  minValue={300}
                  onChange={val => form.setFieldValue('refresh_every', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  labelClass={classes.sliderInputLabelClass}
                  rootClass={classes.sliderInputRootClass}
                />
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
                  handleFeedIdChange(
                    {},
                    initialFormState.current.selectedFeedId
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

RSS.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

RSS.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(RSS))
