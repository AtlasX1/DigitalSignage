import { Grid, Typography, withStyles } from '@material-ui/core'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from 'actions/mediaActions'
import {
  getQuoteCategoriesAction,
  getQuotesAction,
  postQuoteAction
} from 'actions/quoteActions'
import { CheckboxSwitcher } from 'components/Checkboxes'
import Popup from 'components/Popup'
import { Scrollbars } from 'components/Scrollbars'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import { get as _get } from 'lodash'
import React, { useEffect, useState, useMemo } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import * as Yup from 'yup'
import { MediaInfo, MediaTabActions } from '..'
import { durationArray, mediaConstants } from '../../../constants'
import {
  BlueButton,
  CircleIconButton,
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import {
  FormControlInput,
  FormControlReactSelect,
  FormControlSketchColorPicker
} from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import useMediaTheme from 'hooks/useMediaTheme'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '15px 30px',
      fontFamily: typography.fontFamily
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
      zIndex: 1
    },
    tabContent: {
      height: '100%',
      borderRight: `solid 1px ${palette[type].pages.media.card.border}`
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    tabToggleButton: {
      width: '128px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent',
      marginTop: 16
    },
    filterForm: {
      padding: '25px 17px'
    },
    searchAction: {
      width: '90%'
    },
    quotesListContainer: {
      paddingLeft: '20px',
      position: 'relative',
      margin: '0px',
      zIndex: 1,
      '& li': {
        position: 'relative',
        fontSize: '12px',
        lineHeight: '20px',
        color: palette[type].pages.media.gallery.quote.color,
        padding: '12px 15px',

        '&:nth-child(2n+1)': {
          '&:before': {
            position: 'absolute',
            display: 'block',
            content: "''",
            background: palette[type].pages.media.gallery.quote.background,
            top: 0,
            left: '-20px',
            right: 0,
            bottom: 0,
            zIndex: -1
          }
        }
      }
    },
    headerText: {
      fontSize: '16px',
      lineHeight: '19px',
      color: palette[type].pages.media.card.header.color,
      fontWeight: 'bold',
      marginTop: 16
    },

    headerFormWrapper: {
      padding: '15px 30px',
      borderBottom: `solid 1px ${palette[type].pages.media.card.border}`
    },

    addCustomQuoteWrap: {
      paddingLeft: 16
    },
    alignBottom: {
      alignSelf: 'flex-end',
      paddingBottom: '16px'
    },
    addCustomQuoteBtn: {
      width: '100%',
      maxHeight: '38px',
      padding: '10px 31px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      boxShadow: 'none',
      borderRadius: '4px'
    },
    addCustomQuoteText: {
      fontSize: '14px',
      color: palette[type].sideModal.action.button.color
    },

    customFormContainer: {
      padding: 15
    },
    inputContainerCustom: {
      paddingLeft: '16px'
    },
    circleIcon: {
      color: '#afb7c7'
    },

    formControlInputClass: {
      fontSize: '14px !important'
    },
    inputContainer: {
      padding: '0 8px'
    },
    inputClass: {
      width: '172px'
    },
    label: {
      color: palette[type].formControls.label.color,
      fontSize: '16px',
      fontWeight: '300',
      transform: 'none'
    },
    labelTransform: {
      transform: 'translate(0, 1.5px) scale(0.75)',
      whiteSpace: 'nowrap'
    },
    checkBoxlabel: {
      fontSize: '13px'
    },

    previewMediaRow: {
      marginTop: 25
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      ...typography.lightText[type]
    }
  }
}
const initialValues = {
  type: 'select',
  author: '',
  category: '',
  limit: 10,
  is_owner: false,
  total_time: '00:00:10',
  custom_quote: {
    quote: '',
    author: '',
    category: { label: 'Inspiration', value: 17 }
  },
  settings: 'theme',
  theme_settings: {
    font_color: 'rgba(255,255,255,1)',
    font_family: 'Arial'
  }
}

const Quotes = ({
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
  const [theme, setTheme] = useState(60)
  const [quotes, setQuotes] = useState([])
  const [userQuotes, setUserQuotes] = useState([])

  const [categories, setCategories] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.gallery)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const { storeQuotes, storeQuoteCategories } = useSelector(
    ({ quoteReducer }) => ({
      storeQuotes:
        quoteReducer.items.response &&
        quoteReducer.items.response.length &&
        quoteReducer.items.response,
      storeQuoteCategories:
        quoteReducer.categories.response &&
        quoteReducer.categories.response.length &&
        quoteReducer.categories.response
    })
  )

  const { themes, featureId } = useMediaTheme('Gallery', 'Quote')
  const previewThemes = useMemo(() => themes.Legacy || [], [themes.Legacy])

  const dispatch = useDispatch()
  // eslint-disable-next-line
  useEffect(() => void dispatch(getQuotesAction()), [])
  // eslint-disable-next-line
  useEffect(() => void dispatch(getQuoteCategoriesAction()), [])

  useEffect(() => {
    if (storeQuotes && storeQuotes.length) {
      if (
        mode === 'edit' &&
        backendData &&
        backendData.attributes &&
        backendData.attributes.selected_quotes &&
        backendData.attributes.selected_quotes.length
      ) {
        setFilteredQuotes(
          storeQuotes.filter(({ id }) =>
            backendData.attributes.selected_quotes.includes(id)
          )
        )
      } else {
        setQuotes(storeQuotes.slice(0, 50))
      }
    } // eslint-disable-next-line
  }, [storeQuotes])

  useEffect(() => {
    if (storeQuoteCategories && storeQuoteCategories.length) {
      setCategories(storeQuoteCategories)
    }
  }, [storeQuoteCategories])

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
          mediaName: 'gallery',
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
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
      dispatch(
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
    if (backendData && backendData.id) {
      form.setValues({
        ...initialValues,
        type: backendData.attributes.type,
        author: backendData.attributes.author,
        limit: backendData.attributes.limit,
        settings: backendData.attributes.settings,
        theme_settings: backendData.attributes.theme_settings,
        total_time: backendData.attributes.total_time,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      })
      setTheme(backendData.themeId)
      if (
        backendData.attributes.user_quotes &&
        backendData.attributes.user_quotes.length
      ) {
        setUserQuotes(backendData.attributes.user_quotes)
      }
    }
    // eslint-disable-next-line
  }, [backendData])

  const validationSchema = Yup.object().shape({
    custom_quote: Yup.object().shape({
      quote: Yup.string(),
      author: Yup.string().when('quote', {
        is: field => field !== undefined,
        then: Yup.string().required('Enter field')
      }),
      category: Yup.object().shape({
        value: Yup.string().required('Enter field')
      })
    }),
    mediaInfo: Yup.object().shape({
      title: Yup.string().required('Enter field')
    })
  })

  const form = useFormik({
    initialValues: {
      ...initialValues,
      featureId: featureId,
      mediaInfo: mediaConstants.mediaInfoInitvalue
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async ({
      type,
      limit,
      settings,
      theme_settings,
      total_time,
      mediaInfo
    }) => {
      const postData = createMediaPostData(mediaInfo, mode)
      const requestData = update(postData, {
        title: { $set: mediaInfo.title },
        featureId: { $set: featureId },
        themeId: { $set: theme },
        attributes: {
          $set: {
            type: type,
            settings: settings,
            total_time: total_time,
            theme_settings: theme_settings
          }
        }
      })

      if (type === 'select') {
        requestData.attributes['selected_quotes'] =
          filteredQuotes.length &&
          filteredQuotes[0].quote !== t('No matching quotes found')
            ? filteredQuotes.map(({ id }) => id).slice(0, limit)
            : quotes.length && quotes.map(({ id }) => id).slice(0, limit)
      } else if (type === 'random') {
        requestData.attributes['limit'] = limit
      }

      if (userQuotes.length > 0) {
        requestData.attributes['user_quotes'] = userQuotes
      }

      const actionOptions = {
        mediaName: 'gallery',
        tabName: selectedTab,
        data: requestData
      }

      try {
        if (mode === 'add') {
          await validationSchema.validate(
            {
              mediaInfo
            },
            { strict: true, abortEarly: false }
          )
          dispatch(addMedia(actionOptions))
        } else {
          const mediaId = backendData.id
          dispatch(editMedia({ ...actionOptions, id: mediaId }))
        }
        setFormSubmitting(true)
      } catch (e) {
        console.error(e)
      }
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

  const handleSearchSubmit = () => {
    const {
      author: formAuthor,
      category: { label: formCategory, value: formCategoryId }
    } = form.values

    if (formAuthor || formCategory) {
      const filtered = form.values.is_owner
        ? userQuotes.filter(({ author, categoryId }) => {
            if (formAuthor && formCategory) {
              return author === formAuthor && categoryId === formCategoryId
            } else if (formAuthor) {
              return author === formAuthor
            } else if (formCategory) {
              return categoryId === formCategoryId
            } else {
              return false
            }
          })
        : quotes
            .filter(({ author, category: { title: category } }) => {
              if (formAuthor && formCategory) {
                return author === formAuthor && category === formCategory
              } else if (formAuthor) {
                return author === formAuthor
              } else if (formCategory) {
                return category === formCategory
              } else {
                return false
              }
            })
            .slice(0, form.values.limit)
      setFilteredQuotes(
        !filtered.length
          ? [{ quote: t('No matching quotes found') }]
          : [...filtered]
      )
    } else if (form.values.is_owner) {
      setFilteredQuotes(userQuotes.slice(0, form.values.limit))
    }
  }

  const handleSearchReset = () => {
    setFilteredQuotes([])
    form.setFieldValue('author', '')
    form.setFieldValue('category', '')
    form.setFieldValue('limit', 10)
    form.setFieldValue('is_owner', false)
    form.setFieldValue('type', 'select')
  }

  const handleAddCustomQuote = async () => {
    const { quote, author, category } = form.values.custom_quote
    if (quote && quote.length) {
      form.setTouched({
        quote: true,
        author: true,
        category: true
      })

      try {
        await validationSchema.validate(
          {
            quote,
            author,
            category
          },
          { strict: true, abortEarly: false }
        )

        if (!form.errors.custom_quote) {
          const newQuote = {
            quote: quote,
            author: author,
            id: quotes.length ? quotes[0].id + 1 : 1,
            categoryId: category.value
          }
          dispatch(postQuoteAction({ ...newQuote, categoryId: category.value }))
          newQuote['category'] = {
            id: category.value,
            title: category.label
          }
          setQuotes([newQuote, ...quotes])
          setUserQuotes([...userQuotes, newQuote])

          form.setFieldValue('custom_quote', {
            quote: '',
            author: '',
            category: { label: 'Inspiration', value: 17 }
          })
          form.setTouched({
            quote: false
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleShowPreview = async () => {
    const { type, limit, theme_settings, total_time, mediaInfo } = form.values
    const previewPayload = {
      title: mediaInfo.title,
      featureId: featureId,
      themeId: theme,
      attributes: {
        type: type,
        total_time: total_time,
        theme_settings: theme_settings
      }
    }

    if (type === 'select') {
      const excludedQuotes = userQuotes.map(({ id }) => id)
      previewPayload.attributes['selected_quotes'] =
        filteredQuotes.length &&
        filteredQuotes[0].quote !== t('No matching quotes found')
          ? filteredQuotes
              .filter(({ id }) => !excludedQuotes.includes(id))
              .map(({ id }) => id)
              .slice(0, limit)
          : quotes.length &&
            quotes
              .filter(({ id }) => !excludedQuotes.includes(id))
              .map(({ id }) => id)
              .slice(0, limit)
    } else if (type === 'random') {
      previewPayload.attributes['limit'] = limit
    }

    try {
      if (previewPayload.attributes.selected_quotes.length) {
        dispatch(generateMediaPreview(previewPayload))
      } else {
        return
      }
    } catch (e) {
      console.error(e)
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
        <Grid
          container
          alignItems="center"
          className={classes.headerFormWrapper}
        >
          <Grid item xs={1}>
            <Popup
              position="bottom left"
              style={{
                borderRadius: 6,
                width: 315,
                animation: 'fade-in 200ms'
              }}
              on="click"
              trigger={
                <CircleIconButton className={`hvr-grow ${classes.circleIcon}`}>
                  <i className="icon-settings-1" />
                </CircleIconButton>
              }
            >
              <Grid className={classes.filterForm}>
                <FormControlInput
                  fullWidth={true}
                  label={t('Author')}
                  value={form.values.author}
                  formControlLabelClass={[
                    classes.label,
                    classes.labelTransform
                  ].join(' ')}
                  handleChange={event =>
                    form.setFieldValue('author', event.target.value)
                  }
                />
                <FormControlReactSelect
                  label={t('Category')}
                  value={form.values.category}
                  isSearchable={true}
                  formControlLabelClass={[
                    classes.label,
                    classes.labelTransform
                  ].join(' ')}
                  marginBottom={16}
                  handleChange={event =>
                    form.setFieldValue('category', event.target.value)
                  }
                  options={
                    categories.length > 0
                      ? categories.map(({ id, title }) => ({
                          label: title,
                          value: { label: title, value: id }
                        }))
                      : []
                  }
                />
                <FormControlReactSelect
                  label={t('Limit')}
                  value={{
                    value: form.values.limit,
                    label: form.values.limit
                  }}
                  formControlLabelClass={[
                    classes.label,
                    classes.labelTransform
                  ].join(' ')}
                  marginBottom={16}
                  options={[10, 20, 30, 40, 50].map(option => ({
                    value: option,
                    label: option
                  }))}
                  handleChange={event =>
                    form.setFieldValue('limit', event.target.value)
                  }
                />
                <CheckboxSwitcher
                  label={t('Created By Me')}
                  formControlLabelClass={classes.checkBoxlabel}
                  value={form.values.is_owner}
                  handleChange={value => form.setFieldValue('is_owner', value)}
                />
                <CheckboxSwitcher
                  label={t('Random')}
                  value={form.values.type === 'random'}
                  formControlLabelClass={classes.checkBoxlabel}
                  handleChange={random =>
                    form.setFieldValue('type', random ? 'random' : 'select')
                  }
                />
                <Grid style={{ marginTop: '10px' }} container>
                  <Grid item xs={6}>
                    <BlueButton
                      onClick={handleSearchSubmit}
                      className={classes.searchAction}
                    >
                      {t('Search Action')}
                    </BlueButton>
                  </Grid>
                  <Grid item xs={6}>
                    <WhiteButton
                      onClick={handleSearchReset}
                      className={classes.searchAction}
                    >
                      {t('Search Reset Action')}
                    </WhiteButton>
                  </Grid>
                </Grid>
              </Grid>
            </Popup>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <FormControlInput
                marginBottom={form.values.custom_quote.quote.length}
                fullWidth
                label={`${
                  form.values.custom_quote.quote.length ? t('Quote') : ''
                }`}
                value={form.values.custom_quote.quote}
                error={
                  form.errors.custom_quote && form.errors.custom_quote.quote
                }
                touched={form.touched.quote}
                formControlLabelClass={[
                  classes.label,
                  classes.labelTransform
                ].join(' ')}
                handleChange={event =>
                  form.setFieldValue('custom_quote.quote', event.target.value)
                }
              />
            </Grid>
            {form.values.custom_quote.quote.length > 0 && (
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <FormControlInput
                    marginBottom
                    fullWidth
                    label={t('Author')}
                    value={form.values.custom_quote.author}
                    error={
                      form.errors.custom_quote &&
                      form.errors.custom_quote.author
                    }
                    touched={form.touched.author}
                    formControlLabelClass={[
                      classes.label,
                      classes.labelTransform
                    ].join(' ')}
                    handleChange={event =>
                      form.setFieldValue(
                        'custom_quote.author',
                        event.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={6} className={classes.inputContainerCustom}>
                  <FormControlReactSelect
                    fullWidth
                    label={t('Category')}
                    value={form.values.custom_quote.category}
                    isSearchable={true}
                    error={
                      form.errors.custom_quote &&
                      form.errors.custom_quote.category
                    }
                    touched={form.touched.category}
                    formControlLabelClass={[
                      classes.label,
                      classes.labelTransform
                    ].join(' ')}
                    handleChange={event =>
                      form.setFieldValue(
                        'custom_quote.category',
                        event.target.value
                      )
                    }
                    options={
                      categories.length > 0
                        ? categories.map(({ id, title }) => ({
                            label: title,
                            value: { label: title, value: id }
                          }))
                        : []
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid
            item
            xs={5}
            className={`${classes.addCustomQuoteWrap} ${
              form.values.custom_quote.quote.length > 0
                ? classes.alignBottom
                : ''
            }`}
          >
            <WhiteButton
              onClick={handleAddCustomQuote}
              className={classes.addCustomQuoteBtn}
            >
              <Typography className={classes.addCustomQuoteText}>
                {t('Add Custom Quote')}
              </Typography>
            </WhiteButton>
          </Grid>
        </Grid>

        <div className={classes.root}>
          <Typography className={classes.headerText}>
            {t('Search Quote')}
          </Typography>

          <Grid container>
            <Grid style={{ paddingBottom: 16 }} item xs={12}>
              <Scrollbars style={{ height: '370px' }}>
                <ol className={classes.quotesListContainer}>
                  {filteredQuotes.length > 0
                    ? filteredQuotes.map(({ quote }, index) => (
                        <li key={`quote-item-${index}`}>{quote}</li>
                      ))
                    : quotes.length > 0 &&
                      quotes.map(({ quote }, index) => (
                        <li key={`quote-item-${index}`}>{quote}</li>
                      ))}
                </ol>
              </Scrollbars>
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} className={classes.themeCardWrap}>
              <TabToggleButtonGroup
                className={classes.tabToggleButtonContainer}
                value={form.values.settings}
                exclusive
                onChange={(_, value) => form.setFieldValue('settings', value)}
              >
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={'custom'}
                >
                  Custom
                </TabToggleButton>
                <TabToggleButton
                  className={classes.tabToggleButton}
                  value={'theme'}
                >
                  Theme
                </TabToggleButton>
              </TabToggleButtonGroup>
              {form.values.settings === 'theme' ? (
                <Grid container>
                  <Grid item xs={12}>
                    <MediaHtmlCarousel
                      settings={{
                        infinite: false
                      }}
                      onSlideClick={({ name }) => setTheme(name)}
                      activeSlide={theme}
                      slides={
                        previewThemes.length > 0
                          ? previewThemes.map(theme => {
                              return {
                                name: theme.id,
                                tooltip: theme.tooltip,
                                thumbDimension: theme.thumbDimension,

                                content: (
                                  <img src={theme.thumb} alt={theme.name} />
                                )
                              }
                            })
                          : []
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid className={classes.customFormContainer} container>
                  <Grid item container xs={12}>
                    <Grid item xs={7} className={classes.inputContainer}>
                      <FormControlReactSelect
                        label={t('Font Family')}
                        value={{
                          label: form.values.theme_settings.font_family,
                          value: form.values.theme_settings.font_family
                        }}
                        handleChange={event =>
                          form.setFieldValue(
                            'theme_settings.font_family',
                            event.target.value
                          )
                        }
                        inputClasses={{
                          input: classes.formControlInputClass
                        }}
                        options={[
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
                        ].map(name => ({
                          component: (
                            <span style={{ fontFamily: name }}>{name}</span>
                          ),
                          label: name,
                          value: name
                        }))}
                      />
                    </Grid>
                    <Grid item xs={5} className={classes.inputContainer}>
                      <FormControlSketchColorPicker
                        marginBottom
                        label={t('Font Color')}
                        color={form.values.theme_settings.font_color}
                        onColorChange={color => {
                          form.setFieldValue('theme_settings.font_color', color)
                        }}
                        formControlLabelClass={[
                          classes.label,
                          classes.labelTransform
                        ].join(' ')}
                        formControlInputWrapClass={classes.formControlInput}
                        formControlInputRootClass={classes.formControlInput}
                        formControlInputClass={classes.formControlInput}
                        rootClass={classes.formControlInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            justify="space-between"
            alignItems="flex-end"
            className={classes.previewMediaRow}
          >
            <Grid item>
              <WhiteButton
                onClick={handleShowPreview}
                className={classes.previewMediaBtn}
              >
                <Typography className={classes.previewMediaText}>
                  {t('Preview Media')}
                </Typography>
              </WhiteButton>
            </Grid>
            <Grid item>
              <FormControlReactSelect
                label={t('Total Time')}
                formControlContainerClass={classes.inputClass}
                formControlLabelClass={classes.formControlLabelClass}
                value={{
                  label: form.values.total_time,
                  value: form.values.total_time
                }}
                error={form.errors.total_time}
                touched={form.touched.total_time}
                handleChange={event =>
                  form.setFieldValue('total_time', event.target.value)
                }
                options={durationArray.map(({ label }) => ({
                  label: label,
                  value: label
                }))}
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
              onClose={onModalClose}
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

export default translate('translations')(withStyles(styles)(Quotes))
