import { Grid, Typography, withStyles } from '@material-ui/core'
import { generateMediaPreview } from 'actions/mediaActions'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { MediaInfo, MediaTabActions } from '..'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  getMediaItemsAction
} from '../../../actions/mediaActions'
import { mediaConstants, timezones } from '../../../constants'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'
import { WhiteButton } from '../../Buttons'
import {
  FormControlChips,
  FormControlInput,
  FormControlReactSelect,
  FormControlSketchColorPicker
} from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import useMediaTheme from 'hooks/useMediaTheme'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      margin: '15px 30px',
      fontFamily: typography.fontFamily
    },
    formWrapper: {
      position: 'relative',
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
    tabToggleButton: {
      width: '128px'
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
      marginBottom: '38px'
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
    formControlSketchColorPickerLabelClass: {
      marginBottom: '0',
      fontSize: '16px'
    },
    labelClass: {
      fontSize: '16px',
      fontWeight: '300',
      marginBottom: 0,
      transform: 'translate(0, 1.5px) scale(0.75)',
      whiteSpace: 'nowrap'
    },
    formControlSketchColorPickerInputClass: {
      width: '100%'
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important',
      marginRight: '10px'
    },
    inputContainer: {
      marginBottom: 16
    },
    inputContainerShrink: {
      padding: '0 7px 0',
      margin: '0 0 16px',
      maxWidth: '275px'
    },
    formControlRootClass: {
      marginBottom: 0
    },
    switchContainerClass: {
      width: '160px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    inputClass: {
      width: '46px'
    },
    checkboxSwitcherLabelClass: {
      fontSize: '13px'
    },
    tabContent: {
      height: '100%'
    },
    reactSelectContainer: {
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0
      }
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
    }
  }
}

const durationOptions = [
  { label: '1', value: '1' },
  { label: '3', value: '3' },
  { label: '5', value: '5' },
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '60', value: '60' },
  { label: '120', value: '120' },
  { label: '180', value: '180' },
  { label: '240', value: '240' },
  { label: 'D', value: 'D' },
  { label: 'W', value: 'W' }
]

const StockQuote = ({
  t,
  classes,
  mode,
  formData,
  backendData,
  selectedTab,
  customClasses,
  onModalClose,
  onShareStateCallback,
  ...props
}) => {
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.web)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const { themes, featureId } = useMediaTheme('Web', 'StockQuote')
  const previewThemes = useMemo(() => themes.Legacy || [], [themes.Legacy])

  const initialFormValues = useRef({
    themeId: 23,
    symbol: '',
    symbols: [],
    default_interval: '5',
    color_theme: 'light',
    time_zone: 'America/New_York',
    hide_chart: false,
    chart_only: false,
    font_color: 'rgba(84, 20, 220, 0.33)',
    under_line_color: 'rgba(237, 240, 243, 0.33)',
    grid_line_color: 'rgba(233, 233, 234, 0.33)',
    active_ticker_background_color: 'rgba(255, 255, 255, 0.33)',
    trend_line_color: 'rgba(255,121, 101, 0.33)',
    mediaInfo: mediaConstants.mediaInfoInitvalue
  })

  const dispatch = useDispatch()
  const generatePreview = useCallback(
    payload => {
      dispatch(generateMediaPreview(payload))
    },
    [dispatch]
  )
  const addMediaItem = useCallback(
    payload => {
      dispatch(addMedia(payload))
    },
    [dispatch]
  )
  const editMediaItem = useCallback(
    payload => {
      dispatch(editMedia(payload))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!formSubmitting) return

    const { response, error, status } = mediaItemReducer
    if (response) {
      dispatch(getMediaItemsAction())
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
    if (!formSubmitting) return
    const currentReducer = addMediaReducer[selectedTab]
    if (!currentReducer) return

    const { response, error } = currentReducer
    if (response) {
      form.resetForm()
      props.onShowSnackbar(t('Successfully added'))

      dispatch(
        clearAddedMedia({
          mediaName: 'web',
          tabName: selectedTab
        })
      )
      dispatch(getMediaItemsAction())
      if (autoClose) {
        onModalClose()
        setAutoClose(false)
      }
      setFormSubmitting(false)
    }

    if (error) {
      dispatch(
        clearAddedMedia({
          mediaName: 'web',
          tabName: selectedTab
        })
      )
      props.onShowSnackbar(error.message)
      setFormSubmitting(false)
    }
    // eslint-disable-next-line
  }, [addMediaReducer])

  useEffect(() => {
    if (backendData && backendData.id) {
      initialFormValues.current = {
        ...backendData.attributes,
        themeId: backendData.themeId,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
      if (backendData.themeId === 24) {
        initialFormValues.current.symbols = backendData.attributes.symbols[0].map(
          value => ({
            label: value,
            value: value
          })
        )
        form.setFieldValue('symbols', initialFormValues.current.symbols)
      } else if (backendData.themeId === 25) {
        initialFormValues.current.symbols = backendData.attributes.symbols.map(
          value => ({
            label: value,
            value: value
          })
        )
        form.setFieldValue('symbols', initialFormValues.current.symbols)
      }
    }
    // eslint-disable-next-line
  }, [backendData])

  const validationSchema = Yup.object().shape({
    symbol: Yup.string().when('themeId', {
      is: 23,
      then: Yup.string().required('Please enter a stock symbol')
    }),
    symbols: Yup.array()
      .when('themeId', {
        is: 24,
        then: Yup.array()
          .min(2, 'Please enter at least two stock symbols')
          .required('Please enter a value')
      })
      .when('themeId', {
        is: 25,
        then: Yup.array()
          .min(2, 'Please enter at least two stock symbols')
          .required('Please enter a value')
      }),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Please enter a valid title')
    })
  })

  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      initialFormValues.current = values
      const {
        themeId,
        symbol,
        symbols,
        default_interval,
        color_theme,
        time_zone,
        hide_chart,
        chart_only,
        font_color,
        under_line_color,
        grid_line_color,
        active_ticker_background_color,
        trend_line_color,
        mediaInfo
      } = values
      const formInvalid = false
      if (formInvalid) {
        return
      } else {
        const postData = createMediaPostData(mediaInfo, mode)
        const requestData = update(postData, {
          title: { $set: mediaInfo.title },
          featureId: { $set: featureId },
          themeId: { $set: themeId },
          attributes: {
            $set: {
              default_interval: default_interval
            }
          }
        })

        switch (themeId) {
          case 23:
            requestData['attributes'] = {
              ...requestData.attributes,
              symbol: symbol,
              color_theme: color_theme,
              time_zone: time_zone
            }
            break
          case 24:
            requestData['attributes'] = {
              ...requestData.attributes,
              symbols: [symbols.map(({ label }) => label)],
              hide_chart: hide_chart,
              font_color: font_color,
              under_line_color: under_line_color,
              grid_line_color: grid_line_color,
              active_ticker_background_color: active_ticker_background_color,
              trend_line_color: trend_line_color
            }
            break
          case 25:
            requestData['attributes'] = {
              ...requestData.attributes,
              symbols: symbols.map(({ label }) => label),
              chart_only: chart_only,
              font_color: font_color,
              under_line_color: under_line_color,
              grid_line_color: grid_line_color,
              trend_line_color: trend_line_color
            }
            break
          default:
            return
        }

        const actionOptions = {
          mediaName: 'web',
          tabName: selectedTab,
          data: requestData
        }
        try {
          await validationSchema.validate(
            {
              ...(themeId === 23 && { symbol }),
              ...((themeId === 24 || themeId === 23) && { symbols })
            },
            { strict: true, abortEarly: false }
          )
          if (mode === 'add') {
            addMediaItem(actionOptions)
          } else {
            const mediaId = backendData.id
            editMediaItem({ ...actionOptions, id: mediaId })
          }
          setFormSubmitting(true)
        } catch (e) {
          console.error(e)
        }
      }
    }
  })

  const handleShowPreview = async () => {
    const { themeId, symbol, symbols } = form.values

    const previewPayload = {
      title: form.values.mediaInfo.title,
      featureId: featureId,
      themeId: form.values.themeId,
      attributes: {
        default_interval: form.values.default_interval
      }
    }

    switch (form.values.themeId) {
      case 23:
        previewPayload['attributes'] = {
          ...previewPayload.attributes,
          symbol: form.values.symbol,
          color_theme: form.values.color_theme,
          time_zone: form.values.time_zone
        }
        form.setTouched({ symbol: true })
        break
      case 24:
        previewPayload['attributes'] = {
          ...previewPayload.attributes,
          symbols: [form.values.symbols.map(({ label }) => label)],
          hide_chart: form.values.hide_chart,
          font_color: form.values.font_color,
          under_line_color: form.values.under_line_color,
          grid_line_color: form.values.grid_line_color,
          active_ticker_background_color:
            form.values.active_ticker_background_color,
          trend_line_color: form.values.trend_line_color
        }
        form.setTouched({ symbols: true })
        break
      case 25:
        previewPayload['attributes'] = {
          ...previewPayload.attributes,
          symbols: form.values.symbols.map(({ label }) => label),
          chart_only: form.values.chart_only,
          font_color: form.values.font_color,
          under_line_color: form.values.under_line_color,
          grid_line_color: form.values.grid_line_color,
          trend_line_color: form.values.trend_line_color
        }

        break
      default:
        return
    }

    if (themeId === 23 && !symbol.length) {
      return
    } else if ((themeId === 24 || themeId === 25) && symbols.length !== 2) {
      return
    } else {
      generatePreview(previewPayload)
    }
  }

  const disableSubmission =
    formSubmitting || (form.submitCount > 0 && !form.isValid)
  return (
    <Grid
      container
      component="form"
      className={classes.formWrapper}
      onSubmit={form.handleSubmit}
    >
      <Grid item xs={7} className={classes.tabContent}>
        <Grid>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography className={classes.themeHeaderText}>
                    {t('Theme')}
                  </Typography>
                </header>
                <Grid container>
                  <Grid item xs={12}>
                    <MediaHtmlCarousel
                      settings={{
                        infinite: false
                      }}
                      activeSlide={form.values.themeId}
                      slides={
                        previewThemes.length > 0
                          ? previewThemes.map(theme => {
                              return {
                                id: theme.id,
                                name: theme.id,
                                content: (
                                  <img
                                    src={theme.thumb}
                                    alt={theme.name}
                                    title={theme.tooltip}
                                  />
                                )
                              }
                            })
                          : []
                      }
                      onSlideClick={({ name }) =>
                        form.setFieldValue('themeId', name)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {form.values.themeId === 23 && (
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <FormControlInput
                    label={`${t('Ticker Symbol')}:`}
                    formControlLabelClass={classes.labelClass}
                    value={form.values.symbol}
                    handleChange={event =>
                      form.setFieldValue('symbol', event.target.value)
                    }
                    touched={form.touched.symbol}
                    error={form.errors.symbol}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlReactSelect
                    label={`${t('Default Interval')}:`}
                    formControlLabelClass={classes.labelClass}
                    value={{
                      label: form.values.default_interval,
                      value: form.values.default_interval
                    }}
                    handleChange={event =>
                      form.setFieldValue('default_interval', event.target.value)
                    }
                    options={durationOptions}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlReactSelect
                    label={`${t('Time Zone')}:`}
                    formControlLabelClass={classes.labelClass}
                    value={{
                      label: form.values.time_zone,
                      value: form.values.time_zone
                    }}
                    handleChange={event =>
                      form.setFieldValue('time_zone', event.target.value)
                    }
                    options={timezones}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlReactSelect
                    label={`${t('Color Theme')}:`}
                    formControlLabelClass={classes.labelClass}
                    value={{
                      label: form.values.color_theme,
                      value: form.values.color_theme
                    }}
                    handleChange={event =>
                      form.setFieldValue('color_theme', event.target.value)
                    }
                    options={[
                      { label: 'Light', value: 'light' },
                      { label: 'Dark', value: 'dark' }
                    ]}
                  />
                </Grid>
              </Grid>
            )}

            {(form.values.themeId === 24 || form.values.themeId === 25) && (
              <Grid container>
                <Grid container>
                  <Grid item xs={12} className={classes.inputContainer}>
                    <FormControlChips
                      name="symbols"
                      label={`${t('Ticker Symbols')}:`}
                      customClass={classes.reactSelectContainer}
                      formControlLabelClass={classes.labelClass}
                      options={
                        form.values.symbols.length
                          ? form.values.symbols.map(({ label }, index) => ({
                              label: label,
                              value: index
                            }))
                          : []
                      }
                      values={form.values.symbols}
                      touched={form.touched.symbols}
                      error={form.errors.symbols}
                      handleChange={event => {
                        if (
                          event.target.value.length < form.values.symbols.length
                        ) {
                          form.setFieldValue('symbols', event.target.value)
                        } else if (
                          form.values.symbols.length < 2 &&
                          event.target.value.length > form.values.symbols.length
                        ) {
                          form.setFieldValue(
                            'symbols',
                            event.target.value.map(({ label, value }) => ({
                              label: label,
                              value: !value ? label : value
                            }))
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.inputContainerShrink}>
                    <FormControlReactSelect
                      label={`${t('Default Interval')}:`}
                      formControlLabelClass={classes.labelClass}
                      value={{
                        label: form.values.default_interval,
                        value: form.values.default_interval
                      }}
                      handleChange={event =>
                        form.setFieldValue(
                          'default_interval',
                          event.target.value
                        )
                      }
                      options={durationOptions}
                    />
                  </Grid>
                  {form.values.themeId === 24 && (
                    <Grid item xs={6} className={classes.inputContainerShrink}>
                      <FormControlSketchColorPicker
                        label={t('Active Ticker Background')}
                        color={form.values.active_ticker_background_color}
                        onColorChange={color =>
                          form.setFieldValue(
                            'active_ticker_background_color',
                            color
                          )
                        }
                        formControlInputWrapClass={
                          classes.formControlSketchColorPickerInputClass
                        }
                        formControlLabelClass={classes.labelClass}
                        rootClass={classes.formControlInputClass}
                      />
                    </Grid>
                  )}
                </Grid>
                <Grid container>
                  <Grid item xs={6} className={classes.inputContainerShrink}>
                    <FormControlSketchColorPicker
                      label={t('Font Color')}
                      color={form.values.font_color}
                      onColorChange={color => {
                        form.setFieldValue('font_color', color)
                      }}
                      formControlInputWrapClass={
                        classes.formControlSketchColorPickerInputClass
                      }
                      formControlLabelClass={classes.labelClass}
                      rootClass={classes.formControlInputClass}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.inputContainerShrink}>
                    <FormControlSketchColorPicker
                      label={t('Underline Color')}
                      color={form.values.under_line_color}
                      onColorChange={color => {
                        form.setFieldValue('under_line_color', color)
                      }}
                      formControlInputWrapClass={
                        classes.formControlSketchColorPickerInputClass
                      }
                      formControlLabelClass={classes.labelClass}
                      rootClass={classes.formControlInputClass}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.inputContainerShrink}>
                    <FormControlSketchColorPicker
                      label={t('Grid Line Color')}
                      color={form.values.grid_line_color}
                      onColorChange={color => {
                        form.setFieldValue('grid_line_color', color)
                      }}
                      formControlInputWrapClass={
                        classes.formControlSketchColorPickerInputClass
                      }
                      formControlLabelClass={classes.labelClass}
                      rootClass={classes.formControlInputClass}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.inputContainerShrink}>
                    <FormControlSketchColorPicker
                      label={t('Trend Line Color')}
                      color={form.values.trend_line_color}
                      onColorChange={color => {
                        form.setFieldValue('trend_line_color', color)
                      }}
                      formControlInputWrapClass={
                        classes.formControlSketchColorPickerInputClass
                      }
                      formControlLabelClass={classes.labelClass}
                      rootClass={classes.formControlInputClass}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.inputContainer}>
                    <CheckboxSwitcher
                      label={t(
                        `${
                          form.values.themeId === 24
                            ? 'Hide Chart'
                            : 'Chart Only'
                        }`
                      )}
                      value={
                        form.values.themeId === 24
                          ? form.values.hide_chart
                          : form.values.chart_only
                      }
                      handleChange={checked =>
                        form.values.themeId === 24
                          ? form.setFieldValue('hide_chart', checked)
                          : form.setFieldValue('chart_only', checked)
                      }
                      switchContainerClass={classes.switchContainerClass}
                      formControlRootClass={classes.formControlRootClass}
                      formControlLabelClass={classes.checkboxSwitcherLabelClass}
                    />
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
                  onClick={() => handleShowPreview()}
                  className={classes.previewMediaBtn}
                >
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
            </Grid>
          </div>
        </Grid>
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
              disabled={disableSubmission}
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
  )
}

StockQuote.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

StockQuote.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(StockQuote))
