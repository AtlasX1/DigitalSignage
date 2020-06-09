import { Grid, Typography, withStyles } from '@material-ui/core'
import {
  addMedia,
  clearAddedMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemsAction,
  getMediaPreview
} from 'actions/mediaActions'
import { useFormik } from 'formik'
import update from 'immutability-helper'
import { get as _get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Spreadsheet from 'react-spreadsheet'
import classNames from 'classnames'
import {
  createMediaPostData,
  getMediaInfoFromBackendData
} from 'utils/mediaUtils'
import * as Yup from 'yup'
import { MediaInfo, MediaTabActions } from '..'
import { mediaConstants } from '../../../constants'
import '../../../styles/forms/_spreadsheet.scss'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import { FormControlInput, SliderInputRange } from '../../Form'
import { FileUpload } from './components/Upload'
import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#4C5057'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes }) => (
    <div className={classes.DownloadFileButtonContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      padding: '15px 30px',
      fontFamily: [
        '"Segoe UI"',
        '"Product Sans"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),
      borderRight: `solid 1px ${palette[type].pages.media.card.border}`
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
    tabToggleButton: {
      width: '128px'
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.background,
      borderRadius: '4px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      fontSize: '12px',
      color: palette[type].pages.media.general.card.header.color
    },

    tabToggleButtonGroup: {
      marginBottom: '16px'
    },
    sheetWrap: {
      padding: '0 1px 1px'
    },
    fileTypeLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500',
      marginRight: '27px',
      '&:last-of-type': {
        marginRight: '0'
      }
    },

    helperCardWrap: {
      backgroundColor: '#f5fcff',
      borderRadius: '4px',
      padding: '13px 15px 20px'
    },
    helperTitle: {
      fontSize: '12px',
      color: '#0378BA',
      fontStyle: 'italic',
      fontWeight: 'bold',
      lineHeight: '15px'
    },
    helperText: {
      fontSize: '12px',
      color: '#0378BA',
      lineHeight: '15px'
    },

    previewMediaRow: {
      marginTop: '45px'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      ...typography.lightText[type]
    }
  }
}

const Table = ({
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

  const addMediaReducer = useSelector(({ addMedia }) => addMedia.general)
  const mediaItemReducer = useSelector(({ media }) => media.mediaItem)

  const featureId = useDetermineMediaFeatureId('General', 'Tables')

  const initialFormValues = useRef({
    type: 'inline',
    inline_source: Array(10).fill(Array(10).fill({ value: '' })),
    upload_source: null,
    web_source: '',
    refresh_every: 360,
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
          mediaName: 'general',
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
          mediaName: 'general',
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
      if (backendData.attributes && backendData.attributes.type) {
        switch (backendData.attributes.type) {
          case 'inline':
            initialFormValues.current = {
              type: backendData.attributes.type,
              inline_source: backendData.attributes.sheetData,
              upload_source: null,
              web_source: '',
              refresh_every: backendData.attributes.refresh_every,
              mediaInfo: getMediaInfoFromBackendData(backendData)
            }
            break
          case 'upload':
            initialFormValues.current = {
              type: backendData.attributes.type,
              inline_source: Array(10).fill(Array(10).fill({ value: '' })),
              upload_source: null,
              web_source: '',
              refresh_every: backendData.attributes.refresh_every,
              mediaInfo: getMediaInfoFromBackendData(backendData)
            }
            break
          case 'web':
            initialFormValues.current = {
              type: backendData.attributes.type,
              web_source: backendData.attributes.source,
              inline_source: Array(10).fill(Array(10).fill({ value: '' })),
              upload_source: null,
              refresh_every: backendData.attributes.refresh_every,
              mediaInfo: getMediaInfoFromBackendData(backendData)
            }
            break
          default:
            return
        }
      }
      form.setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [backendData])

  const validationSchema = Yup.object().shape({
    upload_source: Yup.mixed().when('type', {
      is: 'upload',
      then: Yup.mixed().required('Please upload a file')
    }),
    web_source: Yup.string().when('type', {
      is: 'web',
      then: Yup.string()
        .url('Please enter a valid URL')
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
        type,
        refresh_every,
        inline_source,
        upload_source,
        web_source,
        mediaInfo
      } = values
      const postData = createMediaPostData(mediaInfo, mode)
      let requestData = update(postData, {
        title: { $set: mediaInfo.title },
        featureId: { $set: featureId },
        attributes: {
          $set: {
            type: type
          }
        }
      })

      switch (type) {
        case 'inline':
          const sheetValues = inline_source.map(row => {
            return row.map(({ value }) => ({
              text: value
            }))
          })
          requestData['attributes'] = {
            ...requestData.attributes,
            source: { data: [...sheetValues] },
            refresh_every: refresh_every,
            sheetData: inline_source
          }
          break
        case 'upload':
          requestData = new FormData()
          requestData.append('featureId', featureId)
          requestData.append('title', mediaInfo.title)
          if (upload_source && upload_source[0]) {
            requestData.append('file', upload_source[0])
          } else {
            requestData.append('file', null)
            break
          }
          requestData.append(
            'attributes',
            JSON.stringify({
              type: 'upload',
              source: { content: '' },
              refresh_every: refresh_every
            })
          )

          break
        case 'web':
          requestData['attributes'] = {
            ...requestData.attributes,
            source: web_source,
            refresh_every: refresh_every
          }
          break
        default:
          break
      }

      const actionOptions = {
        mediaName: 'general',
        tabName: selectedTab,
        data: requestData
      }

      try {
        if (mode === 'add') {
          await validationSchema.validate(
            {
              type,
              refresh_every,
              ...(type === 'upload' && { upload_source }),
              ...(type === 'web' && { web_source })
            },
            { strict: true, abortEarly: false }
          )
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
  })

  const handleShowPreview = async () => {
    const {
      type,
      inline_source,
      upload_source,
      web_source,
      refresh_every,
      mediaInfo
    } = form.values
    let previewPayload = {
      title: mediaInfo.title,
      featureId: featureId,
      attributes: {
        type: type
      }
    }

    switch (type) {
      case 'inline':
        const sheetValues = inline_source.map(row => {
          return row.map(({ value }) => ({
            text: value
          }))
        })
        previewPayload['attributes']['source'] = { data: sheetValues }
        break
      case 'upload':
        if (mode === 'edit' && backendData.id) {
          dispatch(getMediaPreview(backendData.id))
          return
        } else {
          previewPayload = new FormData()
          previewPayload.append('featureId', featureId)
          previewPayload.append('title', mediaInfo.title)
          if (upload_source && upload_source[0]) {
            previewPayload.append('file', upload_source[0])
          } else {
            break
          }
          previewPayload.append(
            'attributes',
            JSON.stringify({
              type: 'upload',
              source: { content: '' },
              refresh_every: refresh_every
            })
          )
          form.setTouched({ upload_source: true })
        }
        break
      case 'web':
        previewPayload['attributes'] = {
          ...previewPayload.attributes,
          source: web_source,
          refresh_every: refresh_every
        }
        form.setTouched({ web_source: true })
        break
      default:
        return
    }

    try {
      await validationSchema.validate(
        {
          ...(type === 'upload' && { upload_source }),
          ...(type === 'web' && { web_source })
        },
        { strict: true, abortEarly: false }
      )
      if (form.errors.upload_source || form.errors.web_source) {
        return
      } else {
        generatePreview(previewPayload)
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
      <Grid item xs={7} className={classes.root}>
        <Grid container justify="center">
          <Grid item>
            <TabToggleButtonGroup
              className={classNames({
                [classes.tabToggleButtonGroup]: form.values.type !== 'upload'
              })}
              value={form.values.type}
              exclusive
              onChange={(_, tab) => form.setFieldValue('type', tab)}
            >
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'inline'}
              >
                {t('Inline Editor')}
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'upload'}
              >
                {t('Import File')}
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'web'}
              >
                {t('Web Feed')}
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container>
          {form.values.type === 'inline' && (
            <Grid container justify="center">
              <Grid item xs={12} className={classes.themeCardWrap}>
                <header className={classes.themeHeader}>
                  <Typography className={classes.themeHeaderText}>
                    Excel
                  </Typography>
                </header>
                <Grid container justify="stretcj">
                  <Grid item xs={12} className={classes.sheetWrap}>
                    <Spreadsheet
                      onChange={data =>
                        form.setFieldValue('inline_source', data)
                      }
                      data={form.values.inline_source}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          {form.values.type === 'upload' && (
            <>
              <Grid container>
                <Grid item xs={12}>
                  <FileUpload
                    name="file"
                    files={form.values.upload_source}
                    error={form.errors.upload_source}
                    touched={form.touched.upload_source}
                    noClick={false}
                    multiple={false}
                    dropZoneText={t('Drop Table File')}
                    onChange={event =>
                      form.setFieldValue('upload_source', event.target.value)
                    }
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} className={classes.themeCardWrap}>
                  <header className={classes.themeHeader}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography className={classes.themeHeaderText}>
                          {t('Download Sample Files')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container>
                          <Grid item className={classes.fileTypeLabel}>
                            <DownloadFileButton
                              iconClassName="icon-download-harddisk"
                              text="CSV"
                            />
                          </Grid>
                          <Grid item className={classes.fileTypeLabel}>
                            <DownloadFileButton
                              iconClassName="icon-download-harddisk"
                              text="XML"
                            />
                          </Grid>
                          <Grid item className={classes.fileTypeLabel}>
                            <DownloadFileButton
                              iconClassName="icon-download-harddisk"
                              text="JSON"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </header>
                </Grid>
              </Grid>
            </>
          )}
          {form.values.type === 'web' && (
            <Grid container>
              <Grid item xs={12}>
                <FormControlInput
                  label="Data URL:"
                  formControlRootClass={classes.formControlRootClass}
                  value={form.values.web_source}
                  error={form.errors.web_source}
                  touched={form.touched.web_source}
                  handleChange={event =>
                    form.setFieldValue('web_source', event.target.value)
                  }
                />
                <Grid item xs={12} className={classes.helperCardWrap}>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography className={classes.helperTitle}>
                        {t('Supported formats')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography className={classes.helperText}>
                        .csv, .xml, .json
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
              onClick={handleShowPreview}
              className={classes.previewMediaBtn}
            >
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>

          <Grid item>
            <SliderInputRange
              label={'Refresh Every'}
              tooltip={
                'Frequency of content refresh during playback (in minutes)'
              }
              labelAtEnd={false}
              step={1}
              maxValue={21600}
              minValue={60}
              value={form.values.refresh_every}
              error={form.errors.refresh_every}
              touched={form.touched.refresh_every}
              onChange={value => form.setFieldValue('refresh_every', value)}
              rootClass={classes.sliderContainerClass}
              numberWraperStyles={{ width: 55 }}
              inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
            />
          </Grid>
        </Grid>
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

Table.propTypes = {
  mode: PropTypes.string,
  formData: PropTypes.object,
  selectedTab: PropTypes.string,
  customClasses: PropTypes.object,
  onModalClose: PropTypes.func,
  onShareStateCallback: PropTypes.func
}

Table.defaultProps = {
  mode: 'add',
  formData: {},
  selectedTab: '',
  customClasses: {},
  onModalClose: () => {},
  onShareStateCallback: () => {}
}

export default translate('translations')(withStyles(styles)(Table))
