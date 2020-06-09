import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, CircularProgress, Button } from '@material-ui/core'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { withSnackbar } from 'notistack'
import { compose } from 'redux'

import { SideModal } from 'components/Modal'
import Actions from './Actions'
import PlaylistInformation from './PlaylistInformation'
import PlaylistItems from './PlaylistItems'
import CollectionsMatchCard from './CollectionsMatchCard'

import {
  buildSmartPlaylist,
  clearSmartPlaylistStatus,
  postSmartPlaylist,
  putSmartPlaylist
} from 'actions/smartPlaylistActions'

import {
  getPlaylistById,
  getPlaylistItemsAction
} from 'actions/playlistActions'

import { selectUtils } from 'utils'
import { clearSmartPlaylist } from '../../../../actions/smartPlaylistActions'

const styles = theme => ({
  createPlaylistContent: {
    height: '100%',
    position: 'relative'
  },
  leftSide: {
    maxHeight: '100%',
    paddingLeft: '35px'
  },

  mediaInfoWrap: {
    borderLeft: `solid 1px ${
      theme.palette[theme.type].sideModal.content.border
    }`
  },
  mediaInfoContainer: {
    height: '100%',
    position: 'relative'
  },
  bottomActions: {
    width: '100%',
    position: 'absolute',
    bottom: 0
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
  title: Yup.string().required('Enter title'),
  description: Yup.string().required('Description is required field'),
  tagList: Yup.array()
    .of(
      Yup.object().shape({
        block: Yup.number(),
        tagId: Yup.array()
          .of(Yup.number())
          .min(1, 'Select at least one tag')
          .required()
      })
    )
    .min(1, 'Add at least one collection')
    .required()
})

const SmartPlaylist = props => {
  const { t, classes, location, match, history } = props

  const mode = location.pathname.includes('edit') ? 'edit' : 'add'
  const id = match.params.id

  const dispatchAction = useDispatch()

  const [
    smartPlaylistMedia,
    playlistItem,
    smartPlaylistItem
  ] = useSelector(state => [
    state.smartPlaylist.smartPlaylistMedia.response,
    state.playlist.playlistItem.response,
    state.smartPlaylist.smartPlaylistItem
  ])

  const [isLoading, setLoading] = useState(false)
  const [isClear, setClear] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      tagList: [],
      media: [],
      group: [],
      tag: [],
      duration: '00:00:00',
      playlistMediaOrder: undefined,
      exactMatch: false
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      const {
        title,
        description,
        tagList,
        media,
        group,
        tag,
        duration,
        playlistMediaOrder,
        exactMatch
      } = values

      const requestData = {
        data: {
          title,
          description,
          tagList,
          media,
          group: selectUtils.convertArr(group, selectUtils.fromChipObj),
          tag: selectUtils.convertArr(tag, selectUtils.fromChipObj),
          duration,
          playlistMediaOrder,
          exactMatch
        }
      }
      try {
        if (mode === 'add') {
          dispatchAction(postSmartPlaylist(requestData))
        } else {
          dispatchAction(putSmartPlaylist({ ...requestData, id }))
        }
        // setFormSubmitting(true)
      } catch (e) {
        form.setFieldValue('title', form.values.title)
      }
    }
  })

  // ---- methods

  const buildPlaylist = async () => {
    const { tagList, exactMatch } = form.values

    form.setTouched({ tagList: true })
    try {
      await validationSchema.validate(
        {
          tagList,
          title: 'Dummy title',
          description: 'Dummy description'
        },
        { strict: true, abortEarly: false }
      )

      dispatchAction(
        buildSmartPlaylist({
          tagList,
          exactMatch
        })
      )
    } catch (e) {
      console.log('e', e)
    }
  }

  const handleCancel = () => history.push('/playlist-library')

  const showSnackbar = title => {
    const { enqueueSnackbar, closeSnackbar, t } = props
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

  // ---- effects

  useEffect(
    () => {
      if (mode === 'edit' && id) {
        setLoading(true)
        dispatchAction(getPlaylistById(id))
      }
    },
    //eslint-disable-next-line
    []
  )

  useEffect(
    // as BE data
    () => {
      if (playlistItem) {
        const {
          title,
          description,
          tagList,
          media,
          group,
          tag,
          duration,
          playlistMediaOrder,
          exactMatch
        } = playlistItem

        form.setValues({
          ...form.values,
          title,
          description,
          tagList,
          media: media.map(item => ({
            id: item.id,
            title: item.title,
            playtime: item.repeatTime,
            transitionId: item.transition.id,
            daypartStartTime: item.startTime,
            daypartEndTime: item.endTime,
            duration: item.duration,
            sortOrder: item.sortOrder
          })),
          tag: selectUtils.convertArr(tag, selectUtils.toChipObj),
          group: selectUtils.convertArr(group, selectUtils.toChipObj),
          duration,
          playlistMediaOrder,
          exactMatch
        })

        setLoading(false)
      }
    },
    //eslint-disable-next-line
    [playlistItem]
  )
  // -- BE data

  useEffect(
    () => {
      if (!!smartPlaylistMedia && smartPlaylistMedia.length) {
        form.setFieldValue(
          'media',
          smartPlaylistMedia.map((media, index) => ({
            id: media.id,
            title: media.title,
            playtime: 1,
            transitionId: 1,
            daypartStartTime: '00:00:00',
            daypartEndTime: '23:59:59',
            duration: media.duration,
            sortOrder: index
          }))
        )
      } else {
        form.setFieldValue('media', [])
      }
    },
    //eslint-disable-next-line
    [smartPlaylistMedia]
  )

  useEffect(
    () => {
      if (!!smartPlaylistItem.status) {
        if (smartPlaylistItem.status === 'successfully') {
          showSnackbar(
            id
              ? `Playlist ${id} successfully edited`
              : 'Playlist successfully added'
          )

          dispatchAction(clearSmartPlaylistStatus())

          dispatchAction(
            getPlaylistItemsAction({
              page: 1,
              limit: 10
            })
          )

          if (isClear) {
            dispatchAction(clearSmartPlaylist())
            form.resetForm()
          } else {
            !!!id && handleCancel()
          }
        } else if (smartPlaylistItem.status === 'error') {
          showSnackbar(smartPlaylistItem.error.message)
        }
      }
    },
    //eslint-disable-next-line
    [smartPlaylistItem]
  )

  useEffect(
    () => () => {
      // clear everything on unmount
      form.resetForm()
      dispatchAction(clearSmartPlaylist())
    },
    // eslint-disable-next-line
    []
  )

  // ---- UI

  const { values, errors, touched } = form

  return (
    <SideModal
      width="90%"
      title={t('Smart Playlist')}
      closeLink="/playlist-library"
    >
      <Grid container wrap="nowrap" className={classes.createPlaylistContent}>
        {isLoading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress size={30} thickness={5} />
          </div>
        )}
        <Grid item xs={6} className={classes.leftSide}>
          <CollectionsMatchCard
            onBuild={buildPlaylist}
            onChange={form.setFieldValue}
            values={values}
            errors={errors}
            touched={touched}
            mode={mode}
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            className={classes.mediaInfoContainer}
          >
            <Grid item style={{ flexGrow: 1 }}>
              <PlaylistItems
                values={values}
                errors={errors}
                touched={touched}
                onChange={form.setFieldValue}
              />
            </Grid>
            <Grid item style={{ paddingBottom: 60 }}>
              <PlaylistInformation
                values={values}
                errors={errors}
                touched={touched}
                onChange={form.setFieldValue}
              />
            </Grid>
            <Grid item className={classes.bottomActions}>
              <Actions
                mode={mode}
                onSaveAndCreate={() => {
                  form.handleSubmit()
                  setClear(true)
                }}
                values={values}
                onSave={form.handleSubmit}
                onCancel={() => handleCancel()}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SideModal>
  )
}

SmartPlaylist.propTypes = {
  classes: PropTypes.object.isRequired,
  mode: PropTypes.string
}

SmartPlaylist.defaultProps = {
  mode: 'add'
}

export default compose(
  withSnackbar,
  translate('translations'),
  withStyles(styles)
)(SmartPlaylist)
