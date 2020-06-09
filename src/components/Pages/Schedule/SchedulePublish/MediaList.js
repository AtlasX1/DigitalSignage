import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { get as _get } from 'lodash'

import { Card } from '../../../Card'
import { CircleIconButton } from '../../../Buttons'
import MediaListItem from './MediaListItem'
import Typography from '@material-ui/core/Typography'
import ReactPaginate from 'react-paginate'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import MediaSearchForm from '../../Media/MediaSearch'
import { Scrollbars } from '../../../Scrollbars'
import FormControlReactSelect from '../../../Form/FormControlReactSelect'
import { queryParamsHelper } from '../../../../utils'
import { getMediaItemsAction } from '../../../../actions/mediaActions'
import { getPlaylistItemsAction } from '../../../../actions/playlistActions'
import { getTemplateItemsAction } from '../../../../actions/templateActions'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../../../Popup'
import { getConfigMediaCategory } from '../../../../actions/configActions'

const styles = theme => ({
  mediaListWrap: {
    padding: '13px 20px 0 0',
    flexGrow: 1
  },
  circleIcon: {
    margin: '0 10px',
    padding: '7px',
    color: '#afb7c7'
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  loaderWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,.7)'
  },
  itemsCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  }
})

const initialFilter = {
  title: '',
  featureId: '',
  group: ''
}

const dropdownStyle = {
  borderRadius: 6,
  width: 315,
  animation: 'fade-in 200ms'
}

const MediaList = props => {
  const {
    classes,
    media: mediaList,
    handleTypeChange,
    type,
    onPageChange,
    loading,
    page
  } = props

  const dispatchAction = useDispatch()

  const [configMediaCategory] = useSelector(state => [
    state.config.configMediaCategory.response
  ])

  const typeOptions = [
    {
      label: 'Media',
      value: 'media'
    },
    {
      label: 'Playlist',
      value: 'playlist'
    },
    {
      label: 'Template',
      value: 'template'
    }
  ]

  const [queryParams, setQueryParams] = useState(initialFilter)

  const onFilterSubmit = values => {
    setQueryParams(values)
    switch (type) {
      case 'media':
        dispatchAction(
          getMediaItemsAction(
            queryParamsHelper({
              ...values,
              limit: 20
            })
          )
        )
        break
      case 'playlist':
        dispatchAction(
          getPlaylistItemsAction(
            queryParamsHelper({
              ...values,
              limit: 20
            })
          )
        )
        break
      case 'template':
        dispatchAction(
          getTemplateItemsAction(
            queryParamsHelper({
              ...values,
              limit: 20
            })
          )
        )
        break
      default:
        break
    }
  }

  const onFilterReset = () => {
    setQueryParams(initialFilter)
    switch (type) {
      case 'media':
        dispatchAction(
          getMediaItemsAction({
            limit: 20
          })
        )
        break
      case 'playlist':
        dispatchAction(
          getPlaylistItemsAction({
            limit: 20
          })
        )
        break
      case 'template':
        dispatchAction(
          getTemplateItemsAction({
            limit: 20
          })
        )
        break
      default:
        break
    }
  }

  useEffect(
    () => {
      if (!configMediaCategory.length) {
        dispatchAction(getConfigMediaCategory())
      }
    },
    // eslint-disable-next-line
    []
  )

  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      classes={{
        root: classes.itemsCardWrapper
      }}
    >
      <Grid container alignContent="center">
        <Grid item xs style={{ padding: 5 }}>
          <FormControlReactSelect
            label={''}
            fullWidth={true}
            marginBottom={0}
            value={type}
            options={typeOptions}
            handleChange={e => handleTypeChange(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Popup
            position="bottom right"
            contentStyle={dropdownStyle}
            trigger={
              <CircleIconButton className={`hvr-grow ${classes.circleIcon}`}>
                <i className="icon-settings-1" />
              </CircleIconButton>
            }
          >
            <MediaSearchForm
              queryParams={queryParams}
              onSubmit={onFilterSubmit}
              onReset={onFilterReset}
              options={{
                disableType: type !== 'media'
              }}
            />
          </Popup>
        </Grid>
      </Grid>

      <Grid container className={classes.mediaListWrap}>
        {loading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress
              size={30}
              thickness={5}
              className={classes.progress}
            />
          </div>
        )}
        {_get(mediaList, 'data') && (
          <Scrollbars>
            {mediaList.data
              .sort(
                (a, b) =>
                  new Date(a.updatedAt).getTime() -
                  new Date(b.updatedAt).getTime()
              )
              .map((media, index) => (
                <MediaListItem key={`feature-${index}`} media={media} />
              ))}
          </Scrollbars>
        )}

        {/*No items message*/}
        {_get(mediaList, 'data') && !mediaList.data.length && (
          <Typography
            variant="h6"
            style={{ color: 'gray', margin: '20px auto' }}
          >
            No content found
          </Typography>
        )}
      </Grid>

      <Grid className={classes.paginationWrapper}>
        {_get(mediaList, 'meta') && (
          <ReactPaginate
            previousLabel={<KeyboardArrowLeft />}
            nextLabel={<KeyboardArrowRight />}
            forcePage={page - 1}
            breakLabel={'...'}
            breakClassName={'TableLibraryPagination_break-me'}
            pageCount={mediaList.meta.lastPage}
            marginPagesDisplayed={3}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            containerClassName={'TableLibraryPagination'}
            subContainerClassName={
              'TableLibraryPagination_pages TableLibraryPagination_pagination'
            }
            activeClassName={'TableLibraryPagination_active'}
          />
        )}
      </Grid>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(MediaList))
