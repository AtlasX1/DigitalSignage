import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { useFormik } from 'formik'

import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import uuidv4 from 'uuid/v4'

import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { get as _get } from 'lodash'
import { withRouter } from 'react-router-dom'

import { withStyles, Grid, Button } from '@material-ui/core'

import FooterActions from '../../CreatePlaylistLayout/FooterActions'
import PlaylistItems from '../../CreatePlaylistLayout/PlaylistItems'
import PlaylistInformation from './PlaylistInformation'
import PlaylistItemDropdown from './PlaylistItemDropdown'

import {
  addPlaylist,
  editPlaylist,
  clearAddedPlaylist,
  getPlaylistItemsAction
} from 'actions/playlistActions'
import PlaylistItemsOptions from './PlaylistItemsOptions'

import { labelToSec, secToLabel } from 'utils/secToLabel'
import { selectUtils } from 'utils'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      height: '100%'
    },
    tabWrap: {
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
    leftSide: {
      maxHeight: '100%'
    },
    mediaWrap: {},
    tabHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      borderBottom: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      backgroundColor: palette[type].sideModal.tabs.header.background
    },
    tabContentWrap: {
      flex: '1 1 auto'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%',
      position: 'relative'
    },
    moreIconsWrap: {
      display: 'flex',
      alignSelf: 'stretch',
      justifyContent: 'flex-end',
      margin: '0 5px 0 0'
    },
    moreIconWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    moreIcon: {
      padding: '8px',
      color: '#afb7c7'
    },
    settingWrap: {
      marginLeft: '5px',
      paddingLeft: '5px',
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    hidden: {
      display: 'none'
    },
    iconWithMargin: {
      marginRight: 15
    },
    itemsWrap: {
      minWidth: '100%'
    },
    bottomActions: {
      position: 'absolute',
      width: '100%',
      bottom: 0
    }
  }
}

const validationSchema = Yup.object().shape({
  playlistInfo: Yup.object().shape({
    title: Yup.string().required('Enter field'),
    description: Yup.string().required('Enter field')
  }),
  interactionType: Yup.string().required('Select interation type'),
  media: Yup.array().min(1, 'Choose at least 1 media file')
})

const CreatePlaylistGeneralTab = ({
  t,
  classes,
  history,
  playlistId,
  getMediaItem,
  ...props
}) => {
  const mode = playlistId ? 'edit' : 'add'

  const dispatchAction = useDispatch()
  const addPlaylistReducer = useSelector(({ addPlaylist }) => addPlaylist)
  const playlistItemReducer = useSelector(
    ({ playlist }) => playlist.playlistItem
  )
  const meta = useSelector(({ playlist }) => playlist.library.meta)

  const [autoClose, setAutoClose] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const initialFormValues = useRef({
    playlistInfo: {
      title: '',
      description: '',
      totalPlayTime: '',
      group: [],
      tag: []
    },
    media: [],
    interactionType: 'swipe',
    playlistType: 'Interactive'
  })

  const form = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      const {
        playlistInfo: { title, description, group, tag, totalPlayTime },
        media,
        playlistType,
        interactionType
      } = values

      const requestData = {
        title,
        description,
        duration: totalPlayTime,
        playlistType,
        media: media.map((media, index) => ({
          id: media.id,
          playtime: media.playtime ? media.playtime : 0,
          transitionId: media.transitionId ? media.transitionId : 0,
          daypartStartTime: media.daypartStartTime
            ? media.daypartStartTime
            : '00:00:00',
          daypartEndTime: media.daypartEndTime
            ? media.daypartEndTime
            : '00:00:00',
          interactionType: media.interactionType
            ? media.interactionType
            : 'swipe',
          sortOrder: media.sortOrder ? media.sortOrder : index
        })),
        ...(group &&
          group.length && {
            group: selectUtils.convertArr(group, selectUtils.fromChipObj)
          }),
        ...(tag &&
          tag.length && {
            tag: selectUtils.convertArr(tag, selectUtils.fromChipObj)
          })
      }

      const actionOptions = {
        data: requestData
      }

      try {
        await validationSchema.validate(
          {
            playlistInfo: values.playlistInfo,
            interactionType,
            media
          },
          { strict: true, abortEarly: false }
        )

        if (mode === 'add') {
          dispatchAction(addPlaylist(actionOptions))
        } else {
          dispatchAction(editPlaylist({ id: playlistId, ...actionOptions }))
        }

        setFormSubmitting(true)
      } catch (e) {
        console.log('e', e)
        form.setFieldValue('playlistInfo.title', form.values.playlistInfo.title)
      }
    }
  })

  const showSnackbar = title => {
    const { enqueueSnackbar, closeSnackbar } = props
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  const closeWindow = () => {
    history.push('/playlist-library')
  }

  const onResetForm = () => {
    form.resetForm(initialFormValues.current)
  }

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
        case 'description':
          formProp = 'playlistInfo.description'
          break
        case 'tag':
          formProp = 'playlistInfo.tag'
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

  const handleItemsChange = items => {
    if (_get(items, 'length')) {
      let totalPlayTime = 0

      items.forEach((i, index) => {
        totalPlayTime += labelToSec(i.duration)
        i.sortOrder = index
      })

      form.setFieldValue(
        'playlistInfo.totalPlayTime',
        secToLabel(totalPlayTime)
      )
      form.setFieldValue('media', items)
    } else {
      form.setFieldValue('media', [])
      form.setFieldValue('playlistInfo.totalPlayTime', secToLabel(0))
    }
  }

  useEffect(
    () => {
      if (playlistItemReducer.status === 'error') {
        showSnackbar('An error occurred !')
      }

      if (playlistItemReducer.status === 'successfully') {
        mode === 'edit' && showSnackbar('Successfully edited!')
        if (autoClose) {
          closeWindow()
          setAutoClose(false)
        }
      }

      if (!playlistItemReducer.status && playlistItemReducer.response) {
        const {
          description,
          duration,
          playlistType,
          randomizePlaybackOrder,
          media,
          title,
          tag,
          group
        } = playlistItemReducer.response

        initialFormValues.current = {
          ...initialFormValues.current,
          playlistInfo: {
            title,
            description,
            group: selectUtils.convertArr(group, selectUtils.toChipObj),
            tag: selectUtils.convertArr(tag, selectUtils.toChipObj),
            totalPlayTime: duration
          },
          duration: media ? _get(media[0], 'duration') : 0,
          transition: media ? _get(media[0], 'transition.id') : 1,
          media: media
            ? media.map(i => ({
                ...i,
                daypartStartTime: i.startTime ? i.startTime : '00:00:00',
                daypartEndTime: i.endTime ? i.endTime : '00:00:00',
                playtime: i.repeatTime ? i.repeatTime : 0,
                interactionType: i.interactionType
                  ? i.interactionType
                  : 'swipe',
                uid: uuidv4()
              }))
            : [],
          randomizePlaybackOrder,
          playlistType
        }
        form.setValues(initialFormValues.current)
      }
    },
    // eslint-disable-next-line
    [playlistItemReducer]
  )

  useEffect(() => {
    if (formSubmitting && addPlaylistReducer) {
      const { response, error } = addPlaylistReducer

      if (error) {
        const errors = _get(error, 'errorFields', [])
        console.log('error', error)
        handleBackendErrors(errors)
        showSnackbar(error.message)
        dispatchAction(clearAddedPlaylist())
        setFormSubmitting(false)
      }

      if (response) {
        form.resetForm()
        showSnackbar(t('Successfully added'))

        if (autoClose) {
          closeWindow()
          setAutoClose(false)
        }

        dispatchAction(clearAddedPlaylist())
        dispatchAction(
          getPlaylistItemsAction({
            page: 1,
            limit: meta.perPage
          })
        )
        setFormSubmitting(false)
      }
    }
    // eslint-disable-next-line
  }, [addPlaylistReducer])

  useEffect(
    () => () => {
      // clear everything on unmount
      form.resetForm()
      dispatchAction(clearAddedPlaylist())
    },
    // eslint-disable-next-line
    []
  )

  const { values, touched, errors } = form

  return (
    <form onSubmit={form.handleSubmit} className={classes.root}>
      <Grid container direction="column" className={classes.mediaInfoContainer}>
        <Grid item className={classes.itemsWrap}>
          <PlaylistItems
            selectedMedia={values.media}
            getMediaItem={getMediaItem}
            onItemsChange={handleItemsChange}
            interactionType={values.interactionType}
            handleValueChange={form.setFieldValue}
            touched={touched}
            errors={errors}
            playlistItemsOptionsComponent={PlaylistItemsOptions}
            playlistItemDropdownComponent={PlaylistItemDropdown}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <PlaylistInformation
            values={values.playlistInfo}
            errors={errors.playlistInfo}
            touched={touched.playlistInfo}
            onFormHandleChange={form.setFieldValue}
          />
        </Grid>
        <Grid item className={classes.bottomActions}>
          <FooterActions //TODO: reset functionality
            onSave={() => {
              // submit will be enabled when BE is ready
              // form.handleSubmit
            }}
            onSaveAndClose={() => {
              // submit will be enabled when BE is ready
              // setAutoClose(true)
              // form.handleSubmit()
            }}
            onCancel={onResetForm}
          />
        </Grid>
      </Grid>
    </form>
  )
}

CreatePlaylistGeneralTab.propTypes = {
  classes: PropTypes.object.isRequired,
  tabName: PropTypes.string
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withRouter,
  withSnackbar
)(CreatePlaylistGeneralTab)
