import React, { useState, useEffect } from 'react'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'

import { get as _get } from 'lodash'

import {
  withStyles,
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from '@material-ui/core'
import {
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'

import {
  FormControlInput,
  FormControlSelect
} from '../../../../../../../../Form'
import { Card } from '../../../../../../../../Card'
import { BlueButton } from '../../../../../../../../Buttons'
import MediaItem from '../ItemsList/MediaItem'

import { createTemplateConstants } from '../../../../../../../../../constants'

import { updateCurrentTemplateItem } from '../../../../../../../../../actions/createTemplateActions'
import {
  clearMediaItemsAction,
  getMediaItemsAction
} from '../../../../../../../../../actions/mediaActions'
import ReactPaginate from 'react-paginate'

const styles = theme => {
  const { palette, type } = theme
  return {
    details: {
      width: '475px',
      height: '705px',
      maxHeight: '705px'
    },
    cardRoot: {
      height: '100%',
      paddingBottom: '0',
      overflow: 'hidden'
    },
    cardCloseButton: {
      position: 'relative',
      right: '20px'
    },
    header: {
      borderTop: '0',
      padding: '10px 0'
    },
    headerTitle: {
      fontSize: 14
    },
    headerMediaDetails: {
      borderBottom: '0',
      marginBottom: '0'
    },
    content: {
      height: 'calc(100% - 58px - 68px - 26px)', // card header height 64px
      display: 'flex',
      flexDirection: 'column'
    },
    footer: {
      height: '58px',
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
    footerFCLabel: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: palette[type].sideModal.header.titleColor
    },
    footerFCInputRoot: {
      width: '200px',
      height: '32px'
    },
    footerFCInput: {
      height: '100%'
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
    inlineFCInputRoot: {
      marginTop: '0 !important',
      width: '100%',
      height: '32px'
    },
    inlineFCInput: {
      height: '100%',
      fontSize: '12px'
    },
    inlineFCInputBold: {
      fontWeight: 'bold',
      color: '#888996'
    },
    grayContainer: {
      background: palette[type].sideModal.background,
      padding: '20px 32px',
      margin: '0 -32px 0 -32px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    textInfoContainer: {
      display: 'flex'
    },
    textInfo: {
      flex: '1',
      display: 'flex'
    },
    textInfoLabel: {
      fontSize: '12px',
      color: '#888996',
      minWidth: '70px'
    },
    textInfoValue: {
      fontWeight: 'bold'
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
    }
  }
}

const MediaDetails = props => {
  const {
    t,
    classes,
    closeHandler,
    itemData: { featureId, title, media: itemMedia }
  } = props

  const dispatchAction = useDispatch()

  const mediaReducer = useSelector(({ media }) => media.library.response)
  const { configMediaCategory } = useSelector(({ config }) => config)

  const [page, setPage] = useState(1)
  const [name, setName] = useState(title)
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState(itemMedia)
  const [convertId, setConvertId] = useState(featureId)

  const groupOptions = [{ label: t('ALL'), value: 'all' }]
  const categoryOptions = [{ label: t('ALL'), value: 'all' }]

  const handleSave = () => {
    dispatchAction(
      updateCurrentTemplateItem(createTemplateConstants.TITLE, name)
    )
    dispatchAction(
      updateCurrentTemplateItem(createTemplateConstants.MEDIA, selectedMedia)
    )
    closeHandler()
  }

  const selectMedia = media => {
    setSelectedMedia(media)
  }

  const getConvertZone = () => {
    const data = []
    if (_get(configMediaCategory, 'response')) {
      configMediaCategory.response
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach(tab => {
          data.push({
            component: <span>{tab.name}</span>,
            disabled: true,
            value: null
          })

          tab.feature.forEach(feature => {
            data.push({
              component: <span>{feature.alias}</span>,
              value: feature.id
            })
          })
        })
    }
    return data
  }

  useEffect(
    () => {
      setLoading(true)
      dispatchAction(
        getMediaItemsAction({
          page: page,
          limit: 5,
          featureId: convertId
        })
      )
    },
    //eslint-disable-next-line
    [page, convertId]
  )

  useEffect(() => {
    if (_get(mediaReducer, 'data')) {
      setLoading(false)
    }
  }, [mediaReducer])

  useEffect(
    () => () => {
      dispatchAction(clearMediaItemsAction())
    },
    // eslint-disable-next-line
    []
  )

  return (
    <Grid className={classes.details}>
      <Card
        title={t('Current Media Details')}
        grayHeader
        icon={false}
        shadow={false}
        rootClassName={classes.cardRoot}
        headerClasses={[classes.header, classes.headerMediaDetails]}
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
            {/*Item info*/}
            <Grid className={classes.grayContainer}>
              <FormControlInput
                type="text"
                label={`${t('Name')}:`}
                value={name}
                handleChange={e => setName(e.target.value)}
                formControlRootClass={classes.inlineFCRoot}
                formControlLabelClass={classes.inlineFCLabel}
                formControlInputRootClass={classes.inlineFCInputRoot}
                formControlInputClass={classes.inlineFCInput}
              />
              <Grid className={classes.textInfoContainer}>
                <div className={classes.textInfo}>
                  <Typography className={classes.textInfoLabel}>
                    {t('Duration')}
                  </Typography>
                  <Typography
                    className={[
                      classes.textInfoLabel,
                      classes.textInfoValue
                    ].join(' ')}
                  >
                    {_get(selectedMedia, 'duration')
                      ? selectedMedia.duration
                      : '00:00:00'}
                  </Typography>
                </div>
                <div className={classes.textInfo}>
                  <Typography className={classes.textInfoLabel}>
                    {t('Resolution')}
                  </Typography>
                  <Typography
                    className={[
                      classes.textInfoLabel,
                      classes.textInfoValue
                    ].join(' ')}
                  >
                    {_get(selectedMedia, 'resolution')
                      ? selectedMedia.resolution
                      : 'Na x Na'}
                  </Typography>
                </div>
              </Grid>
            </Grid>

            {/*filter*/}
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
                label={t('Category')}
                formControlContainerClass={classes.singleFCContainer}
                inputClasses={{
                  root: classes.singleFCInputRoot,
                  input: classes.singleFCInput
                }}
                value={'all'}
                options={categoryOptions}
              />
            </Grid>
          </Grid>

          {/*media items*/}
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
            {_get(mediaReducer, 'data') &&
              mediaReducer.data.map((media, index) => (
                <MediaItem
                  key={`media-feature-${index}`}
                  item={media}
                  noBorder={index === mediaReducer.data.length - 1}
                  onClick={() => selectMedia(media)}
                  selected={selectedMedia.id}
                />
              ))}
            {_get(mediaReducer, 'data') && !mediaReducer.data.length && (
              <Typography
                variant="h6"
                style={{ color: 'gray', margin: '20px auto' }}
              >
                No media found
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid className={classes.paginationWrapper}>
          {_get(mediaReducer, 'meta') && (
            <ReactPaginate
              previousLabel={<KeyboardArrowLeft />}
              nextLabel={<KeyboardArrowRight />}
              forcePage={page - 1}
              breakLabel={'...'}
              breakClassName={'TableLibraryPagination_break-me'}
              pageCount={mediaReducer.meta.lastPage}
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

        <Grid className={classes.footer}>
          <Typography className={classes.footerFCLabel}>
            {t('Convert Zone')}
          </Typography>
          <FormControlSelect
            custom
            marginBottom={false}
            // inputClasses={{
            //   root: [classes.footerFCInputRoot].join(' '),
            //   input: classes.footerFCInput
            // }}
            formControlInputRootClass={classes.footerFCInputRoot}
            options={getConvertZone()}
            value={convertId}
            handleChange={e => {
              dispatchAction(
                updateCurrentTemplateItem(
                  createTemplateConstants.FEATURE_ID,
                  e.target.value
                )
              )
              setConvertId(e.target.value)
            }}
          />
          <BlueButton
            classes={{ root: classes.footerButton }}
            onClick={handleSave}
          >
            {t('Save')}
          </BlueButton>
        </Grid>
      </Card>
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(MediaDetails))
