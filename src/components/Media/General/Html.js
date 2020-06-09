import React, { useCallback, useEffect, useState, useRef } from 'react'

import { translate } from 'react-i18next'

import { get as _get } from 'lodash'
import { Base64 } from 'js-base64'
import PropTypes from 'prop-types'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlSelect, SliderInputRange } from 'components/Form'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'
import { Scrollbars } from 'components/Scrollbars'

import { QuickStart, Code, Package } from './components/Html'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { mediaConstants as constants } from '../../../constants'
import {
  createMediaPostData,
  getMediaInfoFromBackendData,
  ObjectToFormData
} from '../../../utils/mediaUtils'
import update from 'immutability-helper'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { MediaInfo, MediaTabActions } from '../index'
import { CheckboxSwitcher } from '../../Checkboxes'
import useMediaContentSource from 'hooks/useMediaContentSource'

const styles = theme => {
  const { palette, type, formControls, typography } = theme
  return {
    root: {
      margin: '15px 30px'
    },
    columnWrap: {
      padding: '0 5px',
      margin: '0 -5px'
    },
    menuClass: {
      maxHeight: 300
    },
    tabToggleButton: {
      width: '128px'
    },
    formWrapper: {
      position: 'relative',
      height: '100%',
      maxHeight: '100%'
    },
    tabContent: {
      height: '100%'
    },
    firstTabContent: {
      // maxHeight: '100%',
      // overflowX: 'auto'
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
      borderColor: palette[type].sideModal.action.button.border,
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
    sliderInputLabel: {
      ...formControls.mediaApps.refreshEverySlider.label,
      lineHeight: '15px',
      marginRight: '15px'
    }
  }
}

const validationSchema = Yup.object().shape({
  contentSourceId: Yup.number().when('section', {
    is: 'quickStart',
    then: Yup.number().required('Select source')
  }),
  content: Yup.object().shape({
    html: Yup.string().when('sub_section', {
      is: 'htmlCssJs',
      then: Yup.string().required('Enter HTML body')
    }),
    text: Yup.string().when('sub_section', {
      is: sub_section =>
        sub_section === 'richText' || sub_section === 'plainText',
      then: Yup.string().required('Enter Text')
    })
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const editorThemes = [
  'ambiance',
  'chaos',
  'chrome',
  'clouds',
  'clouds_midnight',
  'crimson_editor',
  'dawn',
  'dreamweaver',
  'eclipse',
  'github',
  'idle_fingers',
  'iplastic',
  'katzenmilch',
  'kr_theme',
  'kuroir',
  'merbivore',
  'merbivore_soft',
  'mono_industrial',
  'monokai',
  'pastel_on_dark',
  'solarized_dark',
  'solarized_light',
  'sqlserver',
  'terminal',
  'textmate',
  'tomorrow',
  'tomorrow_night',
  'tomorrow_night_blue',
  'tomorrow_night_bright',
  'tomorrow_night_eighties',
  'twilight',
  'vibrant_ink',
  'xcode'
]

const directions = [
  'none',
  'topToBottom',
  'bottomToTop',
  'rightToLeft',
  'leftToRight'
]

const speed = ['slow', 'medium', 'fast']

const entranceEffects = [
  {
    component: <span>Bouncing Entrances</span>,
    value: 'Bouncing Entrances',
    disabled: true
  },
  {
    component: <span>bounceIn</span>,
    value: 'bounceIn'
  },
  {
    component: <span>bounceInDown</span>,
    value: 'bounceInDown'
  },
  {
    component: <span>bounceInLeft</span>,
    value: 'bounceInLeft'
  },
  {
    component: <span>bounceInRight</span>,
    value: 'bounceInRight'
  },
  {
    component: <span>bounceInUp</span>,
    value: 'bounceInUp'
  },
  {
    component: <span>Fading Entrances</span>,
    value: 'Fading Entrances',
    disabled: true
  },
  {
    component: <span>fadeIn</span>,
    value: 'fadeIn'
  },
  {
    component: <span>fadeInDown</span>,
    value: 'fadeInDown'
  },
  {
    component: <span>fadeInDownBig</span>,
    value: 'fadeInDownBig'
  },
  {
    component: <span>fadeInLeft</span>,
    value: 'fadeInLeft'
  },
  {
    component: <span>fadeInLeftBig</span>,
    value: 'fadeInLeftBig'
  },
  {
    component: <span>fadeInRight</span>,
    value: 'fadeInRight'
  },
  {
    component: <span>fadeInRightBig</span>,
    value: 'fadeInRightBig'
  },
  {
    component: <span>fadeInUp</span>,
    value: 'fadeInUp'
  },
  {
    component: <span>fadeInUpBig</span>,
    value: 'fadeInUpBig'
  },
  {
    component: <span>Flippers</span>,
    value: 'Flippers',
    disabled: true
  },
  {
    component: <span>flipInX</span>,
    value: 'flipInX'
  },
  {
    component: <span>flipInY</span>,
    value: 'flipInY'
  },
  {
    component: <span>Lightspeed</span>,
    value: 'Lightspeed',
    disabled: true
  },
  {
    component: <span>lightSpeedIn</span>,
    value: 'lightSpeedIn'
  },
  {
    component: <span>Rotating Entrances</span>,
    value: 'Rotating Entrances',
    disabled: true
  },
  {
    component: <span>rotateIn</span>,
    value: 'rotateIn'
  },
  {
    component: <span>rotateInDownLeft</span>,
    value: 'rotateInDownLeft'
  },
  {
    component: <span>rotateInDownRight</span>,
    value: 'rotateInDownRight'
  },
  {
    component: <span>rotateInUpLeft</span>,
    value: 'rotateInUpLeft'
  },
  {
    component: <span>rotateInUpRight</span>,
    value: 'rotateInUpRight'
  },
  {
    component: <span>Sliding Entrances</span>,
    value: 'Sliding Entrances',
    disabled: true
  },
  {
    component: <span>slideInUp</span>,
    value: 'slideInUp'
  },
  {
    component: <span>slideInDown</span>,
    value: 'slideInDown'
  },
  {
    component: <span>slideInLeft</span>,
    value: 'slideInLeft'
  },
  {
    component: <span>slideInRight</span>,
    value: 'slideInRight'
  },
  {
    component: <span>Zoom Entrances</span>,
    value: 'Zoom Entrances',
    disabled: true
  },
  {
    component: <span>zoomIn</span>,
    value: 'zoomIn'
  },
  {
    component: <span>zoomInDown</span>,
    value: 'zoomInDown'
  },
  {
    component: <span>zoomInLeft</span>,
    value: 'zoomInLeft'
  },
  {
    component: <span>zoomInRight</span>,
    value: 'zoomInRight'
  },
  {
    component: <span>zoomInUp</span>,
    value: 'zoomInUp'
  },
  {
    component: <span>Specials</span>,
    value: 'Specials',
    disabled: true
  },
  {
    component: <span>rollIn</span>,
    value: 'rollIn'
  },
  {
    component: <span>hinge</span>,
    value: 'hinge'
  },
  {
    component: <span>rollOut</span>,
    value: 'rollOut'
  }
]

const exitEffects = [
  {
    component: <span>Bouncing Exits</span>,
    value: 'Bouncing Exits',
    disabled: true
  },
  {
    component: <span>bounceOut</span>,
    value: 'bounceOut'
  },
  {
    component: <span>bounceOutDown</span>,
    value: 'bounceOutDown'
  },
  {
    component: <span>bounceOutLeft</span>,
    value: 'bounceOutLeft'
  },
  {
    component: <span>bounceOutRight</span>,
    value: 'bounceOutRight'
  },
  {
    component: <span>bounceOutUp</span>,
    value: 'bounceOutUp'
  },
  {
    component: <span>Fading Exits</span>,
    value: 'Fading Exits',
    disabled: true
  },
  {
    component: <span>fadeOut</span>,
    value: 'fadeOut'
  },
  {
    component: <span>fadeOutDown</span>,
    value: 'fadeOutDown'
  },
  {
    component: <span>fadeOutDownBig</span>,
    value: 'fadeOutDownBig'
  },
  {
    component: <span>fadeOutLeft</span>,
    value: 'fadeOutLeft'
  },
  {
    component: <span>fadeOutLeftBig</span>,
    value: 'fadeOutLeftBig'
  },
  {
    component: <span>fadeOutRight</span>,
    value: 'fadeOutRight'
  },
  {
    component: <span>fadeOutRightBig</span>,
    value: 'fadeOutRightBig'
  },
  {
    component: <span>fadeOutUp</span>,
    value: 'fadeOutUp'
  },
  {
    component: <span>fadeOutUpBig</span>,
    value: 'fadeOutUpBig'
  },
  {
    component: <span>Flippers</span>,
    value: 'Flippers',
    disabled: true
  },
  {
    component: <span>flipOutX</span>,
    value: 'flipOutX'
  },
  {
    component: <span>flipOutY</span>,
    value: 'flipOutY'
  },
  {
    component: <span>Lightspeed</span>,
    value: 'Lightspeed',
    disabled: true
  },
  {
    component: <span>lightSpeedOut</span>,
    value: 'lightSpeedOut'
  },
  {
    component: <span>Rotating Exits</span>,
    value: 'Rotating Exits',
    disabled: true
  },
  {
    component: <span>rotateOut</span>,
    value: 'rotateOut'
  },
  {
    component: <span>rotateOutDownLeft</span>,
    value: 'rotateOutDownLeft'
  },
  {
    component: <span>rotateOutDownRight</span>,
    value: 'rotateOutDownRight'
  },
  {
    component: <span>rotateOutUpLeft</span>,
    value: 'rotateOutUpLeft'
  },
  {
    component: <span>rotateOutUpRight</span>,
    value: 'rotateOutUpRight'
  },
  {
    component: <span>Sliding Exits</span>,
    value: 'Sliding Exits',
    disabled: true
  },
  {
    component: <span>slideOutUp</span>,
    value: 'slideOutUp'
  },
  {
    component: <span>slideOutDown</span>,
    value: 'slideOutDown'
  },
  {
    component: <span>slideOutLeft</span>,
    value: 'slideOutLeft'
  },
  {
    component: <span>slideOutRight</span>,
    value: 'slideOutRight'
  },
  {
    component: <span>Zoom Exits</span>,
    value: 'Zoom Exits',
    disabled: true
  },
  {
    component: <span>zoomOut</span>,
    value: 'zoomOut'
  },
  {
    component: <span>zoomOutDown</span>,
    value: 'zoomOutDown'
  },
  {
    component: <span>zoomOutLeft</span>,
    value: 'zoomOutLeft'
  },
  {
    component: <span>zoomOutRight</span>,
    value: 'zoomOutRight'
  },
  {
    component: <span>zoomOutUp</span>,
    value: 'zoomOutUp'
  },
  {
    component: <span>Specials</span>,
    value: 'Specials',
    disabled: true
  },
  {
    component: <span>hinge</span>,
    value: 'hinge'
  },
  {
    component: <span>rollOut</span>,
    value: 'rollOut'
  }
]

const Html = props => {
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
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.general)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const { contentSources, featureId } = useMediaContentSource(
    'General',
    'HtmlCode'
  )

  const initialFormValues = useRef({
    contentSourceId: undefined,
    section: 'quickStart',
    sub_section: 'htmlCssJs',
    animation: {
      enable: false,
      entrance: {
        effect: 'bounceIn',
        duration: 2
      },
      exit: {
        effect: 'bounceOut',
        duration: 3
      },
      content_show_duration: 30
    },
    content: {
      html: '',
      css: '',
      js: ''
    },
    scrolling: {
      direction: 'none',
      speed: 'slow'
    },
    editor: {
      theme: 'chrome'
    },
    refresh_every: 900,
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
        file,
        contentSourceId,
        section,
        sub_section,
        animation,
        content,
        scrolling,
        editor,
        refresh_every
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        $merge: {
          featureId,
          contentSourceId,
          attributes: {
            section,
            sub_section,
            content: {
              ...(section === 'quickStart' && {
                html: Base64.encode(content.html),
                css: Base64.encode(content.css),
                js: Base64.encode(content.js)
              }),
              ...(section === 'code' &&
                sub_section === 'htmlCssJs' && {
                  html: Base64.encode(content.html),
                  css: Base64.encode(content.css),
                  js: Base64.encode(content.js)
                }),
              ...(section === 'code' &&
                sub_section !== 'htmlCssJs' && {
                  text: Base64.encode(content.text)
                })
            },
            scrolling,
            editor,
            refresh_every,
            ...(section !== 'package' && { animation })
          }
        }
      })

      if (section === 'package') {
        requestData.file = file
      }

      const actionOptions = {
        mediaName: 'general',
        tabName: selectedTab,
        data:
          section === 'package' ? ObjectToFormData(requestData) : requestData
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        const mediaId = backendData.id
        dispatchAction(
          editMedia({
            ...actionOptions,
            id: mediaId,
            ...(section === 'package' && mode === 'edit' && { method: 'POST' })
          })
        )
      }

      setFormSubmitting(true)
    }
  })

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

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

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
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'general',
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
          mediaName: 'general',
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
    if (backendData && backendData.id) {
      const { contentSourceId, attributes } = backendData

      const html = _get(attributes, 'content.html')
      const css = _get(attributes, 'content.css')
      const js = _get(attributes, 'content.js')
      const text = _get(attributes, 'content.text')

      initialFormValues.current = {
        ...form.values,
        ...backendData.attributes,
        refresh_every: +attributes.refresh_every,
        content: {
          ...(!!html && { html: Base64.decode(html) }),
          ...(!!css && { css: Base64.decode(css) }),
          ...(!!js && { js: Base64.decode(js) }),
          ...(!!text && { text: Base64.decode(text) })
        },
        ...(!!contentSourceId && { contentSourceId }),
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(
    () => {
      if (!backendData) {
        if (form.values.section === 'quickStart') {
          form.setFieldValue('sub_section', 'htmlCssJs')
        }
        if (form.values.section === 'code') {
          form.setValues({
            ...form.values,
            contentSourceId: undefined,
            sub_section: 'htmlCssJs',
            content: {
              html: '',
              css: '',
              js: ''
            }
          })
        }
        if (form.values.section === 'package') {
          form.setFieldValue('sub_section', undefined)
        }
      }
    },
    // eslint-disable-next-line
    [form.values.section]
  )

  const handleShowPreview = async () => {
    const {
      file,
      contentSourceId,
      section,
      sub_section,
      animation,
      content,
      scrolling,
      editor,
      refresh_every
    } = values

    form.setTouched({
      contentSourceId: true,
      content: {
        html: true
      }
    })

    try {
      await validationSchema.validate(
        { contentSourceId, content },
        { strict: true, abortEarly: false }
      )

      const attributes = {
        section,
        sub_section,
        content: {
          ...(section === 'quickStart' && {
            html: Base64.encode(content.html),
            css: Base64.encode(content.css),
            js: Base64.encode(content.js)
          }),
          ...(section === 'code' &&
            sub_section === 'htmlCssJs' && {
              html: Base64.encode(content.html),
              css: Base64.encode(content.css),
              js: Base64.encode(content.js)
            }),
          ...(section === 'code' &&
            sub_section !== 'htmlCssJs' && {
              text: Base64.encode(content.text)
            })
        },
        scrolling,
        editor,
        refresh_every,
        ...(section !== 'package' && { animation })
      }

      const requestData = {
        ...(section === 'quickStart' && { contentSourceId }),
        featureId,
        attributes
      }

      if (section === 'package') {
        requestData.file = new Blob([file], { type: file.type })
      }

      dispatchAction(
        generateMediaPreview(
          section === 'package' ? ObjectToFormData(requestData) : requestData
        )
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  const getSelectedTabContent = () => {
    switch (form.values.section) {
      case 'quickStart':
        return (
          <QuickStart
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            onChange={form.setFieldValue}
            editorThemes={editorThemes}
            mediaSource={contentSources}
            mode={mode}
          />
        )
      case 'code':
        return (
          <Code
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            onChange={form.setFieldValue}
            editorThemes={editorThemes}
          />
        )
      case 'package':
        return (
          <Package
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            onChange={form.setFieldValue}
          />
        )
      default:
        return (
          <QuickStart
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            onChange={form.setFieldValue}
          />
        )
    }
  }

  const { values, errors, touched } = form

  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7} className={classes.firstTabContent}>
          <Scrollbars>
            <div className={classes.root}>
              <Grid container justify="center">
                <Grid item>
                  <TabToggleButtonGroup
                    value={values.section}
                    exclusive
                    onChange={(e, v) => v && form.setFieldValue('section', v)}
                  >
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value="quickStart"
                    >
                      Quick Start
                    </TabToggleButton>
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value="code"
                    >
                      Code
                    </TabToggleButton>
                    <TabToggleButton
                      className={classes.tabToggleButton}
                      value="package"
                    >
                      Package
                    </TabToggleButton>
                  </TabToggleButtonGroup>
                </Grid>
              </Grid>
              {getSelectedTabContent()}
              {values.section !== 'package' && (
                <Grid container justify={'space-between'}>
                  <Grid item xs={12}>
                    <CheckboxSwitcher
                      label={'Animation'}
                      handleChange={value =>
                        form.setFieldValue('animation.enable', value)
                      }
                      value={values.animation.enable}
                    />
                    {values.animation.enable && (
                      <>
                        <Grid container justify={'space-between'}>
                          <Grid item xs={6} className={classes.columnWrap}>
                            <FormControlSelect
                              custom
                              label={'Entrance Effect:'}
                              value={values.animation.entrance.effect}
                              customMenuPaperClassName={classes.menuClass}
                              error={
                                _get(errors, 'animation.entrance.effect') &&
                                errors.animation.entrance.effect
                              }
                              touched={
                                _get(touched, 'animation.entrance.effect') &&
                                touched.animation.entrance.effect
                              }
                              handleChange={e =>
                                form.setFieldValue(
                                  'animation.entrance.effect',
                                  e.target.value
                                )
                              }
                              options={entranceEffects}
                            />
                          </Grid>
                          <Grid item xs={6} className={classes.columnWrap}>
                            <Grid
                              container
                              justify="flex-start"
                              alignItems="center"
                              style={{ height: '100%' }}
                            >
                              <Grid item>
                                <Typography
                                  className={classes.sliderInputLabel}
                                >
                                  Duration:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <SliderInputRange
                                  step={1}
                                  value={values.animation.entrance.duration}
                                  label={''}
                                  maxValue={360}
                                  minValue={1}
                                  onChange={val =>
                                    form.setFieldValue(
                                      'animation.entrance.duration',
                                      val
                                    )
                                  }
                                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container justify={'space-between'}>
                          <Grid item xs={6} className={classes.columnWrap}>
                            <FormControlSelect
                              custom
                              label={'Exit Effect:'}
                              value={values.animation.exit.effect}
                              customMenuPaperClassName={classes.menuClass}
                              error={
                                _get(errors, 'animation.exit.effect') &&
                                errors.animation.exit.effect
                              }
                              touched={
                                _get(touched, 'animation.exit.effect') &&
                                touched.animation.exit.effect
                              }
                              handleChange={e =>
                                form.setFieldValue(
                                  'animation.exit.effect',
                                  e.target.value
                                )
                              }
                              options={exitEffects}
                            />
                          </Grid>
                          <Grid item xs={6} className={classes.columnWrap}>
                            <Grid
                              container
                              justify="flex-start"
                              alignItems="center"
                              style={{ height: '100%' }}
                            >
                              <Grid item>
                                <Typography
                                  className={classes.sliderInputLabel}
                                >
                                  Duration:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <SliderInputRange
                                  step={1}
                                  value={values.animation.exit.duration}
                                  label={''}
                                  maxValue={360}
                                  minValue={1}
                                  onChange={val =>
                                    form.setFieldValue(
                                      'animation.exit.duration',
                                      val
                                    )
                                  }
                                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ margin: '10px 0' }}
                        >
                          <Grid item>
                            <Typography className={classes.sliderInputLabel}>
                              Content Show Duration:
                            </Typography>
                          </Grid>
                          <Grid item>
                            <SliderInputRange
                              step={1}
                              value={values.animation.content_show_duration}
                              label={''}
                              maxValue={360}
                              minValue={1}
                              onChange={val =>
                                form.setFieldValue(
                                  'animation.content_show_duration',
                                  val
                                )
                              }
                              inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid container justify={'space-between'}>
                      <Grid item xs={6} className={classes.columnWrap}>
                        <FormControlSelect
                          custom
                          label={'Auto Scrolling:'}
                          value={values.scrolling.direction}
                          error={
                            _get(errors, 'scrolling.direction') &&
                            errors.scrolling.direction
                          }
                          touched={
                            _get(touched, 'scrolling.direction') &&
                            touched.scrolling.direction
                          }
                          handleChange={e =>
                            form.setFieldValue(
                              'scrolling.direction',
                              e.target.value
                            )
                          }
                          options={directions.map(i => ({
                            component: <span>{i}</span>,
                            value: i
                          }))}
                        />
                      </Grid>
                      {values.scrolling.direction !== 'none' && (
                        <Grid item xs={6} className={classes.columnWrap}>
                          <FormControlSelect
                            custom
                            label={'Scrolling Speed:'}
                            value={values.scrolling.speed}
                            error={
                              _get(errors, 'scrolling.speed') &&
                              errors.scrolling.speed
                            }
                            touched={
                              _get(touched, 'scrolling.speed') &&
                              touched.scrolling.speed
                            }
                            handleChange={e =>
                              form.setFieldValue(
                                'scrolling.speed',
                                e.target.value
                              )
                            }
                            options={speed.map(i => ({
                              component: <span>{i}</span>,
                              value: i
                            }))}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
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
                        label={''}
                        maxValue={21600}
                        minValue={900}
                        onChange={val =>
                          form.setFieldValue('refresh_every', val)
                        }
                        inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                      />
                    </Grid>
                  </Grid>
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
    </form>
  )
}

Html.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Html.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Html))
