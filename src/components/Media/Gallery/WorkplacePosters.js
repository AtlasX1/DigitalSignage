import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import update from 'immutability-helper'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { get as _get } from 'lodash'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'

import { WhiteButton } from '../../Buttons'
import { FormControlSelect, FormControlInput } from '../../Form'
import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { mediaConstants as constants, durationArray } from '../../../constants'

import { Grid, Typography, withStyles } from '@material-ui/core'

import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from '../../../utils/mediaUtils'

import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction
} from '../../../actions/mediaActions'

import { getTransitions } from '../../../actions/configActions'

import { MediaInfo, MediaTabActions } from '../index'
import { labelToSec, secToLabel } from '../../../utils/secToLabel'
import useMediaContentSource from 'hooks/useMediaContentSource'

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
    paddingBottom: 16
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
        Modern transition effects require up to date device hardware, as well as
        up to date firmware on your device. Legacy transition effects are no
        longer supported.
      </div>
    </div>
  )
)

const PosterTab = ({
  classes,
  number,
  poster_duration,
  transition,
  image,
  onDelete
}) => (
  <Grid item xs={6} className={classes.cardContainer}>
    <div className={classes.workplaceCardContainer}>
      <div
        className={classes.workplaceCardImage}
        style={{ background: `url(${image})` }}
      />
      <div className={classes.workplaceCardContentContainer}>
        <div className={classes.workplaceCardContentHeader}>{number}</div>
        <div className={classes.workplaceCardContent}>
          <span className={classes.workplaceCardContentTitle}>Time</span>
          <span className={classes.workplaceCardContentText}>
            {poster_duration}
          </span>
        </div>
        <div className={classes.workplaceCardContent}>
          <span className={classes.workplaceCardContentTitle}>Transition</span>
          <span className={classes.workplaceCardContentText}>{transition}</span>
        </div>
      </div>
      <button
        onClick={e => {
          e.preventDefault()
          onDelete()
        }}
        className={classes.closeButton}
      >
        <i className={'icon-close'} />
      </button>
    </div>
  </Grid>
)

const styles = ({ palette, type, typography, formControls }) => ({
  root: {
    margin: '15px 30px',
    fontFamily: typography.fontFamily
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
  previewMediaText: {
    ...typography.lightText[type]
  },
  previewMediaRow: {
    marginTop: 45
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
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.media.card.header.color,
    fontSize: '12px'
  },
  workplaceCardContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    position: 'relative',
    border: `1px solid ${palette[type].pages.media.gallery.poster.border}`,
    borderRadius: 2
  },
  workplaceCardImage: {
    width: 100,
    height: 76
  },
  workplaceCardContentContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flexGrow: 1,
    padding: '7px 10px 0 10px',
    background: palette[type].pages.media.gallery.poster.background
  },
  workplaceCardContentHeader: {
    color: palette[type].pages.media.gallery.poster.header.color,
    fontSize: '14px',
    marginBottom: '11px',
    fontWeight: '700'
  },
  workplaceCardContent: {
    display: 'flex',
    flexFlow: 'row nowrap',
    marginBottom: '4px',
    '&:last-of-type': {
      marginBottom: 0
    }
  },
  workplaceCardContentTitle: {
    color: '#9394A0',
    fontSize: '12px',
    marginRight: '8px'
  },
  workplaceCardContentText: {
    color: palette[type].pages.media.gallery.poster.header.color,
    fontSize: '12px'
  },
  cardContainer: {
    padding: '0 4px',
    margin: '0 -4px 10px'
  },
  cardsContainer: {
    padding: '18px 10px 0'
  },
  marginBottom1: {
    marginBottom: '5px'
  },
  sliderInputClass: {
    width: '46px'
  },
  sliderInputLabel: {
    ...formControls.mediaApps.refreshEverySlider.label,
    lineHeight: '15px',
    marginRight: '15px'
  },
  cardPreviewContainer: {
    padding: 0,
    margin: 0,
    height: '100%'
  },
  workplacePreviewCardContentContainer: {
    position: 'absolute',
    background: 'rgba(250,250,253,0.9)',
    border: 0,
    bottom: 0,
    width: '100%'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    cursor: 'pointer'
  },
  formControlLabelClass: {
    fontSize: '1.0833rem'
  },
  formControlInputClass: {
    padding: '5px 26px 5px 7px'
  }
})

const validationSchema = Yup.object().shape({
  posters: Yup.array().min(1).required('Select Poster')
})

const WorkplacePosters = ({
  t,
  classes,
  mode,
  customClasses,
  selectedTab,
  formData,
  backendData,
  onModalClose,
  onShareStateCallback,
  onShowSnackbar
}) => {
  const dispatchAction = useDispatch()
  const addMediaReducer = useSelector(({ addMedia }) => addMedia.gallery)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)
  const transitionsReducer = useSelector(({ config }) => config.transitions)

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [autoClose, setAutoClose] = useState(false)
  // const [featureId, setFeatureId] = useState(null)
  const [transitionOptions, setTransitionOptions] = useState([])
  const [mediaPosters, setMediaPosters] = useState([])

  const { contentSources, featureId } = useMediaContentSource(
    'Gallery',
    'WorkplacePosters'
  )
  const initialFormValues = useRef({
    posters: [],
    duration: 10,
    totalDuration: '00:00:00',
    transition: 'no-transition',
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
      const postData = createMediaPostData(values.mediaInfo, mode)
      const requestData = update(postData, {
        $merge: {
          featureId: featureId,
          duration: values.totalDuration,
          attributes: {
            posters: update(values.posters, {
              $apply: posters => {
                return posters.map(poster => {
                  return update(poster, {
                    $merge: {
                      poster_duration: secToLabel(values.duration),
                      transition: values.transition
                    }
                  })
                })
              }
            })
          }
        }
      })

      const actionOptions = {
        mediaName: 'gallery',
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
        case 'attributes.posters':
          formProp = 'posters'
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
    const { posters } = form.values

    form.setTouched({ posters: true })
    try {
      await validationSchema.validate(
        { posters },
        { strict: true, abortEarly: false }
      )
      dispatchAction(
        generateMediaPreview({
          featureId,
          attributes: {
            posters
          },
          duration: form.values.totalDuration
        })
      )
    } catch (e) {}
  }

  const isPosterInPosters = useCallback((posters, id) => {
    return !!posters.find(poster => poster.content_source_id === id)
  }, [])

  const createPoster = useCallback((id, image) => {
    return { content_source_id: id, image: image }
  }, [])

  const handleSlideClick = useCallback(
    slide => {
      const isPresent = isPosterInPosters(form.values.posters, slide.name)
      form.setValues(
        update(form.values, {
          totalDuration: {
            $apply: totalDuration => {
              return !isPresent
                ? secToLabel(
                    form.values.duration * (form.values.posters.length + 1)
                  )
                : totalDuration
            }
          },
          posters: {
            $apply: posters => {
              return !isPresent
                ? update(posters, {
                    $push: [createPoster(slide.name, slide.image)]
                  })
                : posters
            }
          }
        })
      )
    },
    [form, isPosterInPosters, createPoster]
  )

  const handleDeleteItem = useCallback(
    index => {
      form.setValues(
        update(form.values, {
          totalDuration: {
            $set: secToLabel(
              form.values.duration * (form.values.posters.length - 1)
            )
          },
          posters: {
            $splice: [[index, 1]]
          }
        })
      )
    },
    [form]
  )

  const handleShareState = useCallback(
    () => ({
      values: form.values
    }),
    [form.values]
  )

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
          mediaName: 'gallery',
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
          mediaName: 'gallery',
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
    if (!transitionsReducer.response.length) {
      dispatchAction(getTransitions())
    }

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
    if (backendData && backendData.id) {
      const {
        duration,
        attributes: { posters }
      } = backendData

      initialFormValues.current = {
        duration: labelToSec(posters[0].poster_duration),
        posters,
        totalDuration: duration,
        transition: posters[0].transition,
        mediaInfo: getMediaInfoFromBackendData(backendData)
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  useEffect(() => {
    const posters = _get(contentSources, '[0].source', [])

    if (posters && posters.length) {
      setMediaPosters(
        posters.map(i => ({
          content_source_id: i.id,
          image: i.thumbUri
        }))
      )
    }
  }, [contentSources])

  useEffect(() => {
    onShareStateCallback(handleShareState)
  }, [handleShareState, onShareStateCallback])

  const handleTransitionChange = useCallback(
    event => {
      form.setValues(
        update(form.values, {
          transition: { $set: event.target.value }
        })
      )
    },
    [form]
  )

  const handleDurationChange = useCallback(
    event => {
      const { value } = event.target
      form.setValues(
        update(form.values, {
          duration: { $set: value },
          totalDuration: {
            $set: secToLabel(value * form.values.posters.length)
          }
        })
      )
    },
    [form]
  )

  const { values, errors, touched } = form
  return (
    <form className={classes.formWrapper} onSubmit={form.handleSubmit}>
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography className={classes.themeHeaderText}>
                    Select from Template
                  </Typography>
                </header>
                <Grid container>
                  <Grid item xs={12}>
                    <MediaHtmlCarousel
                      multiple={true}
                      settings={{
                        infinite: false
                      }}
                      activeSlide={values.posters.map(
                        poster => poster.content_source_id
                      )}
                      slides={mediaPosters.map(poster => ({
                        name: poster.content_source_id,
                        image: poster.image,
                        content: <img src={poster.image} alt={poster.tooltip} />
                      }))}
                      onSlideClick={handleSlideClick}
                      touched={touched.posters}
                      error={errors.posters}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {!!values.posters.length && (
              <Grid container justify="center">
                <Grid item xs={12} className={classes.themeCardWrap}>
                  <header className={classes.themeHeader}>
                    <Typography className={classes.themeHeaderText}>
                      Selected Workplace Posters:
                    </Typography>
                  </header>
                  <Grid
                    container
                    justify="space-between"
                    className={[
                      classes.marginBottom1,
                      classes.cardsContainer
                    ].join(' ')}
                  >
                    {values.posters.map((poster, index) => (
                      <PosterTab
                        number={index + 1}
                        poster_duration={secToLabel(values.duration)}
                        transition={values.transition}
                        classes={classes}
                        image={poster.image}
                        onDelete={() => handleDeleteItem(index)}
                        key={`poster_${index}`}
                      />
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={16}
            >
              <Grid item xs={4}>
                <FormControlSelect
                  label="Transition:"
                  marginBottom={false}
                  formControlLabelClass={classes.formControlLabelClass}
                  custom
                  value={values.transition}
                  error={errors.transition}
                  touched={touched.transition}
                  handleChange={handleTransitionChange}
                  options={transitionOptions}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlSelect
                  label="Poster Duration:"
                  marginBottom={false}
                  formControlLabelClass={classes.formControlLabelClass}
                  custom
                  value={values.duration}
                  error={errors.duration}
                  touched={touched.duration}
                  handleChange={handleDurationChange}
                  options={durationArray}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlInput
                  label="Total Poster Duration:"
                  value={values.totalDuration}
                  disabled
                  marginBottom={false}
                  formControlLabelClass={classes.formControlLabelClass}
                  formControlInputClass={classes.formControlInputClass}
                  customiseDisabled={false}
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

WorkplacePosters.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

WorkplacePosters.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(WorkplacePosters))
