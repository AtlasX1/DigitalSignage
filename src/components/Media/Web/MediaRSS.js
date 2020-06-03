import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { useFormik } from 'formik'
import { get as _get } from 'lodash'

import update from 'immutability-helper'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'

import { withStyles, Grid, Typography } from '@material-ui/core'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'

import { SingleIconTab, SingleIconTabs } from '../../Tabs'

import {
  FormControlSelect,
  SliderInputRange,
  FormControlInput,
  FormControlTimeDurationPicker
} from '../../Form'

import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { mediaConstants as constants } from '../../../constants'
import { MediaInfo, MediaTabActions } from '../index'

import {
  createMediaPostData,
  getAllowedFeatureId,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'

import {
  getContentSourceOfMediaFeatureById,
  getTransitions
} from 'actions/configActions'

import CircularProgress from '@material-ui/core/CircularProgress'

import { labelToSec, secToLabel } from 'utils/secToLabel'
import classNames from 'classnames'

const TabIconStyles = theme => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '20px 24px'
    },
    tabToggleButtonGroup: {
      marginBottom: '14px'
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
      marginTop: '50px'
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
        marginRight: '30px'
      }
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px',
      marginBottom: '45px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    themeInputContainer: {
      padding: '0 7px',
      margin: '0 -7px'
    },
    sliderInputLabelClass: {
      paddingRight: '15px',
      fontStyle: 'normal'
    },
    checkboxSwitcherLabelClass: {
      fontSize: '13px'
    },
    labelClass: {
      fontSize: '17px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    sliderInputRootClass: {
      alignItems: 'center'
    },
    inputClass: {
      width: '46px'
    },
    sliderInputClass: {
      width: 70,
      height: 38,
      fontSize: 14
    },
    mediaUrlContainer: {
      padding: '0 15px'
    },
    marginTop1: {
      marginTop: '14px'
    }
  }
}

const validationSchema = Yup.object().shape({
  contentSourceId: Yup.number().when('custom', {
    is: false,
    then: Yup.number().required('Select content source')
  }),
  media_rss_feed_url: Yup.string().when('custom', {
    is: true,
    then: Yup.string().required('Enter source link')
  }),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const MediaRSS = props => {
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
    contentSourceOfMediaFeature,
    addMediaReducer,
    mediaItemReducer,
    transitionsReducer
  ] = useSelector(state => [
    state.config.configMediaCategory,
    state.config.contentSourceOfMediaFeature,
    state.addMedia.web,
    state.media.mediaItem,
    state.config.transitions
  ])
  const initialFormState = useRef({
    selectedFeedId: null
  })

  const [isLoading, setLoading] = useState(true)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [transitionOptions, setTransitionOptions] = useState([])

  const [contentTabs, setContentTabs] = useState([])
  const [selectedFeedId, setSelectedFeedId] = useState(
    initialFormState.current.initialFormState
  )
  const [selectedFeedContent, setSelectedFeedContent] = useState([])

  const initialFormValues = useRef({
    contentSourceId: null,
    custom: false,
    media_rss_feed_url: '',
    duration: '00:00:05',
    transition: 'no-transition',
    refresh_every: 3600,
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
        media_rss_feed_url,
        duration,
        transition,
        refresh_every
      } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        featureId: { $set: featureId },
        contentSourceId: { $set: contentSourceId },
        attributes: {
          $set: {
            custom,
            duration: labelToSec(duration),
            transition,
            refresh_every,
            ...(custom && { media_rss_feed_url })
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

  const handleSlideClick = slide => {
    form.setFieldValue('contentSourceId', slide.value)
  }

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
        case 'attributes.media_rss_feed_url':
          formProp = 'media_rss_feed_url'
          break
        case 'attributes.duration':
          formProp = 'duration'
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
      media_rss_feed_url,
      duration,
      transition,
      refresh_every
    } = form.values

    form.setTouched({
      contentSourceId: true,
      media_rss_feed_url: true
    })

    try {
      await validationSchema.validate(
        { contentSourceId, media_rss_feed_url },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          contentSourceId,
          attributes: {
            custom,
            media_rss_feed_url,
            duration: labelToSec(duration),
            transition,
            refresh_every
          }
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  useEffect(() => {
    const values = _get(formData, 'values')
    if (values) {
      initialFormValues.current = {
        ...form.values,
        ...values
      }
      form.setValues(values)
    }
    if (!transitionsReducer.response.length) {
      dispatchAction(getTransitions())
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (backendData && backendData.id) {
      const { contentSourceId, attributes } = backendData

      initialFormValues.current = {
        ...attributes,
        duration: secToLabel(attributes.duration),
        contentSourceId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
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
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(configMediaCategory, 'Web', 'MediaRSS')
    setFeatureId(id)
  }, [configMediaCategory])

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

  useEffect(() => {
    if (featureId) {
      dispatchAction(getContentSourceOfMediaFeatureById(featureId))
    }
    // eslint-disable-next-line
  }, [featureId])

  useEffect(() => {
    if (contentSourceOfMediaFeature.response) {
      const { response = [] } = contentSourceOfMediaFeature
      setContentTabs(response)

      if (response[0]) {
        const { contentSourceId } = form.values
        const selectedFeed = contentSourceId
          ? response.find(
              ({ source }) =>
                source &&
                source.length &&
                source.some(({ id }) => id === contentSourceId)
            ) || response[0]
          : response[0]

        initialFormState.current.selectedFeedId = selectedFeed.id
        setSelectedFeedId(selectedFeed.id)

        if (mode === 'add') {
          initialFormValues.current.contentSourceId = response[0].source[0].id
          form.setFieldValue('contentSourceId', response[0].source[0].id)
        }
      }

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [contentSourceOfMediaFeature])

  useEffect(() => {
    if (contentTabs.length) {
      handleFeedIdChange({}, selectedFeedId)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [contentTabs])

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

  const { values, errors, touched } = form

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
            <Grid container justify="center">
              <TabToggleButtonGroup
                className={[
                  classes.tabToggleButtonContainer,
                  classes.marginTop1
                ].join(' ')}
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
                <Grid item xs={12}>
                  <FormControlInput
                    label="Media RSS feed URL:"
                    fullWidth={true}
                    formControlLabelClass={classes.labelClass}
                    value={values.media_rss_feed_url}
                    error={errors.media_rss_feed_url}
                    touched={touched.media_rss_feed_url}
                    handleChange={e =>
                      form.setFieldValue('media_rss_feed_url', e.target.value)
                    }
                  />
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  className={classes.themeCardWrap}
                  style={{ marginTop: 10 }}
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
                              key={`tab_${index}`}
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
                        onSlideClick={handleSlideClick}
                        error={errors.contentSourceId}
                        touched={touched.contentSourceId}
                      />
                    </div>
                  )}
                </Grid>
              )}
            </Grid>

            <Grid container justify="space-between">
              <Grid item xs={6} className={classes.themeInputContainer}>
                <FormControlSelect
                  formControlLabelClass={classes.formControlLabelClass}
                  label={'Transition'}
                  custom
                  value={values.transition}
                  error={errors.transition}
                  touched={touched.transition}
                  handleChange={e =>
                    form.setFieldValue('transition', e.target.value)
                  }
                  options={transitionOptions}
                  marginBottom={false}
                />
              </Grid>
              <Grid item xs={6} className={classes.themeInputContainer}>
                <FormControlTimeDurationPicker
                  label={'Duration'}
                  formControlLabelClass={classes.labelClass}
                  value={values.duration}
                  onChange={val => form.setFieldValue('duration', val)}
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
                  step={1}
                  value={values.refresh_every}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={21000}
                  minValue={3600}
                  onChange={val => form.setFieldValue('refresh_every', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
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

MediaRSS.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

MediaRSS.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(MediaRSS))
