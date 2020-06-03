import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import * as Yup from 'yup'
import _get from 'lodash/get'

import { useFormik } from 'formik'

import { mediaConstants as constants } from '../../../constants'

import {
  withStyles,
  Grid,
  Tabs,
  Typography,
  CircularProgress,
  Tooltip
} from '@material-ui/core'
import { CheckboxSwitcher } from '../../Checkboxes'

import { WhiteButton } from '../../Buttons'

import { SliderInputRange } from '../../Form'
import { MediaInfo, MediaTabActions } from '../index'
import { SingleIconTab } from '../../Tabs'
import MediaHtmlCarousel from '../MediaHtmlCarousel'

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

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: 16,
    lineHeight: '1em',
    minWidth: '1em'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ tooltip, iconClassName = '', classes }) => (
    <Tooltip title={tooltip}>
      <div className={classes.tabIconWrap}>
        <i className={iconClassName} />
      </div>
    </Tooltip>
  )
)

const styles = ({ palette, type, formControls }) => ({
  root: {
    margin: '21px 30px'
  },
  previewMediaBtn: {
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaRow: {
    marginTop: '19px'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  sliderRootClass: {
    ...formControls.mediaApps.refreshEverySlider.root
  },
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
    lineHeight: '15px',
    marginRight: 13
  },

  formWrapper: {
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
  }
})

const validationSchema = Yup.object().shape({
  allow_scrolling: Yup.boolean(),
  refresh_every: Yup.number().required().min(5).max(360),
  contentSourceId: Yup.number().required('Enter field'),
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter field')
  })
})

const CustomWidget = ({
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
}) => {
  const dispatchAction = useDispatch()
  const { configMediaCategory, contentSourceOfMediaFeature } = useSelector(
    ({ config }) => config
  )
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.custom)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const [isLoading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  const [featureId, setFeatureId] = useState(null)
  const [contentSources, setContentSources] = useState([])
  const [selectedAppId, setSelectedAppId] = useState(null)

  const initialFormValues = useRef({
    allow_scrolling: false,
    refresh_every: 5,
    contentSourceId: null,
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
      const { mediaInfo, contentSourceId, ...attributes } = values
      const data = createMediaPostData(mediaInfo, mode)
      data.featureId = featureId
      data.contentSourceId = contentSourceId
      data.attributes = attributes

      const actionOptions = {
        mediaName: 'custom',
        tabName: selectedTab,
        data
      }

      if (mode === 'add') {
        dispatchAction(addMedia(actionOptions))
      } else {
        dispatchAction(editMedia({ ...actionOptions, id: backendData.id }))
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
    const { mediaInfo, contentSourceId, ...attributes } = form.values

    try {
      await validationSchema.validate(
        {
          contentSourceId,
          ...attributes
        },
        {
          strict: true,
          abortEarly: false
        }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          contentSourceId,
          attributes
        })
      )
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
      const { contentSourceId, attributes } = backendData
      initialFormValues.current = {
        ...form.values,
        ...attributes,
        contentSourceId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    if (!configMediaCategory.response.length) return
    const id = getAllowedFeatureId(
      configMediaCategory,
      'Custom',
      'CustomWidget'
    )
    setFeatureId(id)
    dispatchAction(getContentSourceOfMediaFeatureById(id))
    // eslint-disable-next-line
  }, [configMediaCategory])

  useEffect(() => {
    const { response } = contentSourceOfMediaFeature

    if (backendData && backendData.id) {
      // Update selectedAppId
      if (response.length) {
        const selectedApp = response.find(
          ({ source }) =>
            source &&
            source.some(({ id }) => id === backendData.contentSourceId)
        )
        setSelectedAppId(selectedApp?.id || null)
      }
      setContentSources(response || [])
      return
    }

    if (!response.length) {
      setSelectedAppId(null)
      form.setFieldValue('contentSourceId', null)
      setContentSources([])
      return
    }
    const { id } = response[0]?.source[0] || {}
    setSelectedAppId(response[0].id)
    form.setFieldValue('contentSourceId', id)
    setContentSources(response)
    // eslint-disable-next-line
  }, [contentSourceOfMediaFeature, backendData])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  useEffect(() => {
    if (mode === 'edit' && !backendData?.id) {
      setLoading(true)
    }
  }, [mode, backendData])

  const handleAppIdChange = (event, contentId) => {
    const selectedApp = contentSources.find(({ id }) => id === contentId)
    setSelectedAppId(contentId)
    form.setFieldValue('contentSourceId', selectedApp.source[0]?.id || null)
  }

  const selectedSourceContent = useMemo(
    () => contentSources.find(({ id }) => id === selectedAppId)?.source || [],
    [contentSources, selectedAppId]
  )

  const isButtonsDisable =
    !form.values.contentSourceId ||
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
            <Grid container justify="space-between" alignItems="center">
              {contentSources.length > 0 && (
                <Grid item xs={12}>
                  <header>
                    <Tabs value={selectedAppId} onChange={handleAppIdChange}>
                      {contentSources.map(tab => (
                        <SingleIconTab
                          icon={
                            <TabIcon
                              iconClassName={classNames('fa', tab.icon)}
                              tooltip={tab.name}
                            />
                          }
                          disableRipple={true}
                          value={tab.id}
                          key={tab.id}
                        />
                      ))}
                    </Tabs>
                  </header>
                  <MediaHtmlCarousel
                    settings={{
                      infinite: false
                    }}
                    activeSlide={form.values.contentSourceId}
                    slides={selectedSourceContent.map(content => ({
                      name: content.id,
                      value: content.id,
                      content: (
                        <img
                          src={content.thumbUri}
                          alt={content.tooltip}
                          key={content.id}
                        />
                      )
                    }))}
                    onSlideClick={({ value }) =>
                      form.setFieldValue('contentSourceId', value)
                    }
                    error={form.errors.contentSourceId}
                    touched={form.touched.contentSourceId}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <CheckboxSwitcher
                  label="Allow Scrolling"
                  switchContainerClass={classes.switchContainerClass}
                  formControlRootClass={classes.formControlRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                  value={form.values.allow_scrolling}
                  handleChange={val =>
                    form.setFieldValue('allow_scrolling', val)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      {t('Refresh Every')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      maxValue={360}
                      minValue={5}
                      value={form.values.refresh_every}
                      error={form.errors.refresh_every}
                      touched={form.touched.refresh_every}
                      onChange={val => form.setFieldValue('refresh_every', val)}
                      label={''}
                      rootClass={classes.sliderRootClass}
                      numberWraperStyles={{ width: 55 }}
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
                values={form.values.mediaInfo}
                errors={form.errors.mediaInfo}
                touched={form.touched.mediaInfo}
                onControlChange={form.setFieldValue}
                onFormHandleChange={form.handleChange}
              />
            </Grid>
            <Grid container alignItems={'flex-end'}>
              <MediaTabActions
                mode={mode}
                disabled={isButtonsDisable}
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

export default compose(
  translate('translations'),
  withStyles(styles)
)(CustomWidget)
