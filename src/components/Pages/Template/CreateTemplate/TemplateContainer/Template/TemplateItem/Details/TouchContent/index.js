import React, { Fragment, useEffect, useState } from 'react'
import { translate } from 'react-i18next'

import { get as _get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'

import {
  withStyles,
  Grid,
  IconButton,
  CircularProgress,
  Typography
} from '@material-ui/core'

import {
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'

import { FormControlInput, FormControlSelect } from 'components/Form'
import { Card } from 'components/Card'
import { BlueButton } from 'components/Buttons'
import FormControlTimeDurationPicker from 'components/Form/FormControlTimeDurationPicker'

import MediaItem from '../ItemsList/MediaItem'

import { getMediaItemsAction } from 'actions/mediaActions'
import { getPlaylistItemsAction } from 'actions/playlistActions'
import { updateCurrentTemplateItem } from 'actions/createTemplateActions'

import { createTemplateConstants } from '../../../../../../../../../constants'

const styles = theme => {
  const { palette, type } = theme
  return {
    details: {
      width: '475px',
      height: '600px',
      maxHeight: '600px'
    },
    paginationWrapper: {
      display: 'flex',
      justifyContent: 'center'
    },
    loaderWrapper: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardRoot: {
      height: '100%',
      paddingBottom: '0',
      overflow: 'hidden',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    },
    detailsSmall: {
      width: '300px',
      borderLeft: `1px solid ${palette[type].sideModal.content.border}`
    },
    cardRootSmall: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6
    },
    cardCloseButton: {
      position: 'relative',
      right: '20px'
    },
    header: {
      borderTop: 0,
      height: 58,
      display: 'flex',
      alignItems: 'center'
    },
    headerTitle: {
      fontSize: 14
    },
    content: {
      height: 'calc(100% - 21px - 78px - 26px)' // card header height 64px
    },
    footer: {
      height: '48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px',
      margin: '0 -32px 0 -32px',
      borderTop: `1px solid ${palette[type].sideModal.content.border}`
    },
    footerRightAlign: {
      justifyContent: 'flex-end'
    },
    footerButton: {
      width: '92px',
      height: '32px',
      lineHeight: '32px',
      padding: '0'
    },
    itemsListContainer: {
      flexGrow: 1,
      overflowX: 'hidden'
    },
    inlineFCRoot: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    inlineFCLabel: {
      position: 'relative',
      fontSize: '12px',
      minWidth: '70px',
      transform: 'none'
    },
    inlineFCBoldLabel: {
      fontWeight: 'bold',
      color: palette[type].sideModal.header.titleColor
    },
    inlineFCInputRoot: {
      marginTop: '0 !important',
      width: '100%',
      height: '32px'
    },
    inlineFCInputSmall: {
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: '-0.01px',
      color: '#888996',
      height: 30
    },
    inlineFCInputSmallRoot: {
      width: '50%'
    },
    inlineFCInput: {
      height: '100%',
      fontSize: '12px'
    },
    inlineFCInputBold: {
      fontWeight: 'bold',
      color: '#888996'
    },
    inlineFCInputRightText: {
      textAlign: 'right'
    },
    formControlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 32px',
      margin: '20px -32px 0 -32px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    singleFCContainer: {
      width: '30%'
    },
    singleFCLabel: {
      fontSize: '18px'
    },
    singleFCInputRoot: {
      height: '30px'
    },
    singleFCInput: {
      height: '100%',
      fontSize: '12px',
      color: '#9394a0'
    }
  }
}

const TouchContent = props => {
  const {
    t,
    classes,
    closeHandler,
    itemData: { touch = {} }
  } = props

  const dispatchAction = useDispatch()

  const mediaReducer = useSelector(({ media }) => media.library.response)
  const playlistReducer = useSelector(
    ({ playlist }) => playlist.library.response
  )

  const contentTypeOptions = [
    { label: t('Media'), value: 'media' },
    { label: t('Playlist'), value: 'playlist' }
  ]
  const groupOptions = [{ label: t('ALL'), value: 'all' }]
  const playbackLocationOptions = [
    { label: t('Popup Window'), value: 'popupWindow' },
    { label: t('Popup Bubble'), value: 'popupBubble' },
    { label: t('Existing zone'), value: 'existingZone' },
    { label: t('Fullscreen'), value: 'fullscreen' }
  ]
  const numberOfFilesOptions = [{ label: t('ALL'), value: 'all' }]
  const windowsSizeOptions = [
    { label: `${t('Small')} (480 x 270ox)`, value: 'small' },
    { label: `${t('Medium')} (800 x 600px)`, value: 'medium' },
    { label: `${t('Large')} (1440 x 810px)`, value: 'large' },
    { label: t('Custom Size'), value: 'custom' }
  ]

  const [page, setPage] = useState(1)
  const [contentType, setContentType] = useState(contentTypeOptions[0].value)
  const [windowSize, setWindowSize] = useState(
    touch.window_size ? touch.window_size : windowsSizeOptions[0].value
  )
  const [playbackLocation, setPlaybackLocation] = useState(
    touch.window_location
      ? touch.window_location
      : playbackLocationOptions[0].value
  )
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState(touch)
  const [content, setContent] = useState([])

  const handleSave = () => {
    dispatchAction(
      updateCurrentTemplateItem(createTemplateConstants.TOUCH, {
        window_location: playbackLocation,
        window_size: windowSize,
        ...selectedContent
      })
    )
    closeHandler()
  }

  useEffect(
    () => {
      setLoading(true)
      if (contentType === 'media') {
        dispatchAction(
          getMediaItemsAction({
            page: page,
            limit: 5
          })
        )
      } else {
        dispatchAction(
          getPlaylistItemsAction({
            page: page,
            limit: 5
          })
        )
      }
    },
    //eslint-disable-next-line
    [contentType, page]
  )

  useEffect(
    () => {
      if (contentType === 'media' && _get(mediaReducer, 'data')) {
        setContent(mediaReducer)
      }
      if (contentType === 'playlist' && _get(playlistReducer, 'data')) {
        setContent(playlistReducer)
      }
      setLoading(false)
    },
    //eslint-disable-next-line
    [mediaReducer, playlistReducer]
  )

  return (
    <Fragment>
      <Grid className={classes.details}>
        <Card
          title={t('Touch Content')}
          grayHeader
          icon={false}
          shadow={false}
          rootClassName={classes.cardRoot}
          headerClasses={[classes.header]}
          headerTextClasses={[classes.headerTitle]}
        >
          <Grid className={classes.content}>
            <Grid>
              <FormControlSelect
                label={t('Select Content Type')}
                inputClasses={{
                  root: classes.singleFCInputRoot,
                  input: classes.singleFCInput
                }}
                marginBottom={false}
                value={contentType}
                options={contentTypeOptions}
                handleChange={e => setContentType(e.target.value)}
              />
              <Grid className={classes.formControlsContainer}>
                <FormControlInput
                  type="text"
                  label={t('File Name')}
                  formControlContainerClass={classes.singleFCContainer}
                  formControlLabelClass={classes.singleFCLabel}
                  formControlInputRootClass={classes.singleFCInputRoot}
                  formControlInputClass={classes.singleFCInput}
                />
                <FormControlSelect
                  label={t('Group')}
                  formControlContainerClass={classes.singleFCContainer}
                  inputClasses={{
                    root: classes.singleFCInputRoot,
                    input: classes.singleFCInput
                  }}
                  value={'all'}
                  options={groupOptions}
                />
                <FormControlSelect
                  label={t('Number of Files')}
                  formControlContainerClass={classes.singleFCContainer}
                  inputClasses={{
                    root: classes.singleFCInputRoot,
                    input: classes.singleFCInput
                  }}
                  value={'all'}
                  options={numberOfFilesOptions}
                />
              </Grid>
            </Grid>

            <Grid className={classes.itemsListContainer}>
              {loading && (
                <div className={classes.loaderWrapper}>
                  <CircularProgress
                    size={30}
                    thickness={5}
                    className={classes.progress}
                  />
                </div>
              )}
              {_get(content, 'data') &&
                content.data.length &&
                content.data.map((item, index) => (
                  <MediaItem
                    key={`media-feature-${index}`}
                    item={item}
                    noBorder={index === mediaReducer.data.length - 1}
                    onClick={() => setSelectedContent(item)}
                    selected={selectedContent.id}
                  />
                ))}
              {_get(content, 'data') && !content.data.length && (
                <Typography
                  variant="h6"
                  style={{ color: 'gray', margin: '20px auto' }}
                >
                  No content found
                </Typography>
              )}
            </Grid>

            <Grid className={classes.paginationWrapper}>
              {_get(content, 'meta') && (
                <ReactPaginate
                  previousLabel={<KeyboardArrowLeft />}
                  nextLabel={<KeyboardArrowRight />}
                  forcePage={page - 1}
                  breakLabel={'...'}
                  breakClassName={'TableLibraryPagination_break-me'}
                  pageCount={content.meta.lastPage}
                  marginPagesDisplayed={3}
                  pageRangeDisplayed={3}
                  onPageChange={({ selected }) => setPage(selected + 1)}
                  containerClassName={'TableLibraryPagination'}
                  subContainerClassName={
                    'TableLibraryPagination_pages TableLibraryPagination_pagination'
                  }
                  activeClassName={'TableLibraryPagination_active'}
                />
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid className={[classes.details, classes.detailsSmall].join(' ')}>
        <Card
          title={t('Playback Location Details')}
          grayHeader
          icon={false}
          shadow={false}
          rootClassName={[classes.cardRoot, classes.cardRootSmall].join(' ')}
          headerClasses={[classes.header]}
          headerTextClasses={[classes.headerTitle]}
          titleComponent={
            <IconButton
              className={classes.cardCloseButton}
              onClick={closeHandler}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Grid className={classes.content}>
            <Grid>
              <FormControlSelect
                label={t('Playback Location')}
                inputClasses={{
                  root: classes.singleFCInputRoot,
                  input: classes.singleFCInput
                }}
                value={playbackLocation}
                options={playbackLocationOptions}
                handleChange={e => setPlaybackLocation(e.target.value)}
              />
              <FormControlSelect
                label={t('Window Size')}
                inputClasses={{
                  root: classes.singleFCInputRoot,
                  input: classes.singleFCInput
                }}
                value={windowSize}
                options={windowsSizeOptions}
                handleChange={e => setWindowSize(e.target.value)}
              />
              <FormControlTimeDurationPicker
                deepLabel={t('Reset Duration')}
                value={
                  selectedContent.duration
                    ? selectedContent.duration
                    : '00:00:00'
                }
                onChange={val =>
                  setSelectedContent({ ...selectedContent, duration: val })
                }
              />
            </Grid>
          </Grid>
          <Grid
            className={[classes.footer, classes.footerRightAlign].join(' ')}
          >
            <BlueButton
              classes={{ root: classes.footerButton }}
              onClick={handleSave}
            >
              {t('Save')}
            </BlueButton>
          </Grid>
        </Card>
      </Grid>
    </Fragment>
  )
}

export default translate('translations')(withStyles(styles)(TouchContent))
