import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { get as _get } from 'lodash'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import {
  CircularProgress,
  Grid,
  Tabs,
  Typography,
  withStyles
} from '@material-ui/core'

import { WhiteButton } from 'components/Buttons'
import { SingleIconTab } from 'components/Tabs'
import { SliderInputRange } from 'components/Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { MediaInfo, MediaTabActions } from '../index'

import { mediaConstants as constants } from 'constants/index'
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
import { getContentSourceOfMediaFeatureById } from 'actions/configActions'
import classNames from 'classnames'

const TabIconStyles = () => ({
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

export const SingleIconTabs = withStyles({
  scroller: {
    margin: '0'
  },
  indicator: {
    display: 'none'
  },
  flexContainer: {
    justifyContent: 'center'
  }
})(Tabs)

const styles = ({ palette, type }) => ({
  root: {
    margin: '22px 30px'
  },
  formWrapper: {
    position: 'relative',
    height: '100%'
  },
  tabContent: {
    height: '100%'
  },
  themeCardWrap: {
    border: `solid 1px ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.background,
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
    backgroundColor: palette[type].pages.media.card.header.background
  },
  tabToggleButtonGroup: {
    marginBottom: '19px',
    justifyContent: 'center'
  },
  tabToggleButton: {
    width: '128px'
  },
  featureIconTabContainer: {
    justifyContent: 'center',
    marginLeft: 0
  },
  featureIconTab: {
    '&:not(:last-child)': {
      marginRight: '15px'
    }
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
    marginTop: '58px'
  },
  inputClass: {
    width: 60,
    height: 38,
    fontSize: 14
  },
  inputRootClass: {
    alignItems: 'center'
  }
})

const validationSchema = Yup.object().shape({
  contentSourceId: Yup.number().required('Select Feed'),
  refresh_every: Yup.number(),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const Feeds = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onModalClose,
  onShowSnackbar,
  onShareStateCallback
}) => {
  const dispatchAction = useDispatch()
  const { configMediaCategory, contentSourceOfMediaFeature } = useSelector(
    ({ config }) => config
  )
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.licensed)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [isLoading, setLoading] = useState(true)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [contentTabs, setContentTabs] = useState([])

  const [selectedFeedId, setSelectedFeedId] = useState(null)
  const [selectedFeedContent, setSelectedFeedContent] = useState([])

  const initialFormValues = useRef({
    contentSourceId: null,
    refresh_every: 60,
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
      const { contentSourceId, refresh_every } = values

      const postData = createMediaPostData(values.mediaInfo, mode)

      const requestData = update(postData, {
        featureId: { $set: featureId },
        contentSourceId: { $set: contentSourceId },
        attributes: {
          $set: {
            refresh_every
          }
        }
      })

      const actionOptions = {
        mediaName: 'licensed',
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
    const { contentSourceId, refresh_every } = form.values
    form.setTouched({
      contentSourceId: true,
      refresh_every: true
    })

    try {
      await validationSchema.validate(
        { contentSourceId, refresh_every },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          contentSourceId,
          attributes: {
            refresh_every
          }
        })
      )
    } catch (e) {}
  }

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

  const handleFeedIdChange = (event, contentId) => {
    setSelectedFeedId(contentId)
    const content = contentTabs.find(i => i.id === contentId)
    setSelectedFeedContent(content.source)
  }

  const handleSlideClick = slide => {
    form.setFieldValue('contentSourceId', slide.value)
  }

  useEffect(() => {
    if (contentSourceOfMediaFeature.response) {
      const { response = [] } = contentSourceOfMediaFeature
      setContentTabs(response)

      if (response[0]) {
        setSelectedFeedId(response[0].id)

        if (mode === 'add') {
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
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      onShowSnackbar(t('Successfully added'))

      dispatchAction(
        clearAddedMedia({
          mediaName: 'licensed',
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
          mediaName: 'licensed',
          tabName: selectedTab
        })
      )
      onShowSnackbar(error.message)
      setFormSubmitting(false)

      form.setFieldValue('twitter_handle', form.values.twitter_handle)
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
    if (backendData && backendData.id) {
      !isLoading && setLoading(true)
      const {
        attributes: { refresh_every },
        contentSourceId
      } = backendData

      initialFormValues.current = {
        refresh_every,
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
      if (!configMediaCategory.response.length) return
      const id = getAllowedFeatureId(configMediaCategory, 'Licensed', 'Feeds')
      dispatchAction(getContentSourceOfMediaFeatureById(id))
      setFeatureId(id)
    },
    // eslint-disable-next-line
    [configMediaCategory]
  )

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

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
              {!!contentTabs.length && (
                <Grid item xs={12} className={classes.themeCardWrap}>
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
                          alt={content.tooltip}
                          key={`selected_feed_${index}`}
                        />
                      )
                    }))}
                    onSlideClick={handleSlideClick}
                    error={errors.contentSourceId}
                    touched={touched.contentSourceId}
                  />
                </Grid>
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
                <SliderInputRange
                  step={1}
                  value={values.refresh_every}
                  label={t('Refresh Every')}
                  tooltip={
                    'Frequency of content refresh during playback (in minutes)'
                  }
                  maxValue={3600}
                  minValue={60}
                  onChange={val => form.setFieldValue('refresh_every', val)}
                  labelAtEnd={false}
                  inputContainerClass={classes.inputContainerClass}
                  rootClass={classes.inputRootClass}
                  inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                />
              </Grid>
            </Grid>
          </div>
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

export default translate('translations')(withStyles(styles)(Feeds))
