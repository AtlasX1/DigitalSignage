import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useFormik } from 'formik'

import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'

import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { get as _get } from 'lodash'
import { withRouter } from 'react-router-dom'

import {
  withStyles,
  Grid,
  Tooltip,
  Typography,
  Button,
  CircularProgress
} from '@material-ui/core'

import Popup from '../../../../../Popup'

import { SingleIconTabs, SingleIconTab } from '../../../../../Tabs'
import { CircleIconButton } from '../../../../../Buttons'

import GeneralTabActions from './GeneralTabActions'
import MediaList from './MediaList'
import PlaylistInformation from './PlaylistInformation'
import PlaylistItems from './PlaylistItems'
import PlaylistSearchForm from '../../../PlaylistSearch'

import {
  addPlaylist,
  editPlaylist,
  getPlaylistById,
  clearAddedPlaylist,
  getPlaylistItemsAction
} from '../../../../../../actions/playlistActions'

import { labelToSec, secToLabel } from '../../../../../../utils/secToLabel'
import {
  getConfigMediaCategory,
  getTransitions
} from '../../../../../../actions/configActions'
import { getMediaItemsAction } from '../../../../../../actions/mediaActions'
import { getAllowedFeatureId } from '../../../../../../utils/mediaUtils'
import { selectUtils } from '../../../../../../utils'

const TabIconStyles = theme => ({
  tabIconWrap: {
    fontSize: '24px',
    lineHeight: '18px'
  },
  iconLabel: {
    fontWeight: 700,
    textTransform: 'none',
    color: 'inherit'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', classes, label = false, tooltip = false, title }) => {
    if (tooltip) {
      return (
        <Tooltip title={title}>
          <div className={classes.tabIconWrap}>
            <i className={iconClassName} />
          </div>
        </Tooltip>
      )
    } else {
      return (
        <Grid className={classes.tabIconWrap} container alignItems="center">
          <i className={iconClassName} />
          <Typography className={classes.iconLabel}>{title}</Typography>
        </Grid>
      )
    }
  }
)

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
  transition: Yup.string().required('Select transition'),
  duration: Yup.string().required('Select duration'),
  media: Yup.array().min(1, 'Choose at least 1 media file')
})

const CreatePlaylistGeneralTab = props => {
  const { t, classes, history, tabName, playlistId } = props

  const mode = playlistId ? 'edit' : 'add'

  const dispatchAction = useDispatch()
  const addPlaylistReducer = useSelector(({ addPlaylist }) => addPlaylist)
  const playlistItemReducer = useSelector(
    ({ playlist }) => playlist.playlistItem
  )
  const meta = useSelector(({ playlist }) => playlist.library.meta)
  const mediaReducer = useSelector(({ media }) => media.library.response)
  const { configMediaCategory, transitions } = useSelector(
    ({ config }) => config
  )

  // console.log('configMediaCategory', configMediaCategory)

  const [autoClose, setAutoClose] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Text')
  const [transition, setTransition] = useState([])
  const [mediaLink, setMediaLink] = useState('')
  const [media, setMedia] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [icons, setIcons] = useState([])
  const [selectedTransition, setSelectedTransition] = useState(null)

  const form = useFormik({
    initialValues: {
      playlistInfo: {
        title: '',
        description: '',
        totalPlayTime: '',
        group: [],
        tag: []
      },
      media: [],
      randomizePlaybackOrder: false,
      duration: '',
      transition: '',
      playlistType: 'Standard'
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      const {
        playlistInfo: { title, description, group, tag, totalPlayTime },
        transition,
        media,
        randomizePlaybackOrder,
        playlistType,
        duration
      } = values

      const requestData = {
        title,
        description,
        duration: totalPlayTime,
        playlistType,
        randomizePlaybackOrder,
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
          duration: media.duration ? media.duration : '00:00:00',
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
            duration,
            transition,
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

  const handleTabChange = (event, selectedTab) => {
    setSelectedTab(selectedTab)
  }

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

  const getMediaItem = id => {
    const item = media.find(item => item.id === id)

    return item
  }

  const closeWindow = () => {
    history.push('/playlist-library')
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

  const ShowMoreButtonComponent = (
    <CircleIconButton className={classes.moreIcon}>
      <i className="icon-navigation-show-more-vertical" />
    </CircleIconButton>
  )
  const SettingsButtonComponent = (
    <CircleIconButton className={classes.moreIcon}>
      <i className="icon-settings-1" />
    </CircleIconButton>
  )

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
      setLoading(true)
      if (playlistId) {
        dispatchAction(getPlaylistById(playlistId))
      }
      if (!transitions.response.length) {
        dispatchAction(getTransitions())
      }
      if (!configMediaCategory.response.length) {
        dispatchAction(getConfigMediaCategory())
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(() => {
    if (tabName && configMediaCategory.response.length) {
      const icons = configMediaCategory.response.find(i => i.name === tabName)
      const userIcons = _get(icons, 'feature')
      userIcons.length && setSelectedTab(userIcons[0].name)
      userIcons && setIcons(userIcons)
    }
  }, [tabName, configMediaCategory.response])

  useEffect(() => {
    if (transitions.response) {
      setTransition(
        transitions.response.map(i => ({
          id: i.id,
          value: i.code,
          label: i.name
        }))
      )
    }
  }, [transitions])

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

        form.setValues({
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
            ? media.map(i => ({ ...i, transitionId: i.transition.id }))
            : [],
          randomizePlaybackOrder,
          playlistType
        })

        media && media.length && setSelectedTransition(media[0].transition.id)
      }
    },
    // eslint-disable-next-line
    [playlistItemReducer]
  )

  useEffect(
    () => {
      const id = getAllowedFeatureId(configMediaCategory, tabName, selectedTab)

      if (id) {
        setLoading(true)
        dispatchAction(
          getMediaItemsAction({
            page: 1,
            limit: 10,
            featureId: id
          })
        )
      }
    },
    // eslint-disable-next-line
    [selectedTab, configMediaCategory]
  )

  useEffect(
    () => {
      if (
        _get(mediaReducer, 'links') &&
        mediaReducer.links.firstPageUrl !== mediaLink
      ) {
        setMedia(mediaReducer.data)
        setMediaLink(mediaReducer.links.firstPageUrl)
      }
      setLoading(false)
    },
    // eslint-disable-next-line
    [mediaReducer]
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
      <Grid container className={classes.tabWrap}>
        {isLoading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress size={30} thickness={5} />
          </div>
        )}
        <Grid item xs={5} className={classes.leftSide}>
          <header className={classes.tabHeader}>
            <SingleIconTabs value={selectedTab} onChange={handleTabChange}>
              {!!icons.length &&
                icons.map((icon, index) => {
                  if (index > 5) {
                    return (
                      <SingleIconTab
                        className={classes.hidden}
                        value={icon.name}
                        key={index}
                      />
                    )
                  } else {
                    return (
                      <SingleIconTab
                        icon={
                          <TabIcon
                            iconClassName={
                              icon.name === 'Instagram'
                                ? 'icon-focus-face'
                                : icon.icon
                            }
                            title={icon.alias}
                            tooltip
                          />
                        }
                        disableRipple={true}
                        value={icon.name}
                        key={index}
                      />
                    )
                  }
                })}
            </SingleIconTabs>

            <div className={classes.moreIconsWrap}>
              {!!icons.length && icons.length > 6 && (
                <div className={classes.moreIconWrap}>
                  <Popup
                    trigger={ShowMoreButtonComponent}
                    contentStyle={{
                      padding: 15,
                      animation: 'fade-in 200ms'
                    }}
                  >
                    <Grid container direction="column" alignItems="center">
                      {icons.slice(6).map((icon, index) => (
                        <Grid key={index} item container alignItems="center">
                          <SingleIconTab
                            icon={
                              <TabIcon
                                iconClassName={[
                                  icon.icon,
                                  classes.iconWithMargin
                                ].join(' ')}
                                title={icon.alias}
                                label
                              />
                            }
                            disableRipple={true}
                            value={icon.name}
                            onClick={e => handleTabChange(e, icon.name)}
                            selected={selectedTab === icon.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Popup>
                </div>
              )}
              <div
                className={[classes.settingWrap, classes.moreIconWrap].join(
                  ' '
                )}
              >
                <Popup
                  position="bottom right"
                  trigger={SettingsButtonComponent}
                  contentStyle={{
                    borderRadius: 6,
                    width: 315,
                    animation: 'fade-in 200ms'
                  }}
                >
                  <PlaylistSearchForm />
                </Popup>
              </div>
            </div>
          </header>
          <div className={classes.mediaWrap}>
            <MediaList media={media} />
          </div>
        </Grid>
        <Grid item xs={7} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            className={classes.mediaInfoContainer}
          >
            <Grid item className={classes.itemsWrap}>
              <PlaylistItems
                transitionOptions={transition}
                selectedMedia={values.media}
                selectedTransition={selectedTransition}
                handleTransitionChange={val =>
                  form.setFieldValue('transition', val)
                }
                getMediaItem={getMediaItem}
                onItemsChange={handleItemsChange}
                duration={values.duration}
                randomize={values.randomizePlaybackOrder}
                handleValueChange={form.setFieldValue}
                touched={touched}
                errors={errors}
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
              <GeneralTabActions
                onSave={form.handleSubmit}
                onSaveAndClose={() => {
                  setAutoClose(true)
                  form.handleSubmit()
                }}
                onCancel={closeWindow}
              />
            </Grid>
          </Grid>
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
