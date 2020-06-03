import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'

import GroupModal from 'components/Group'
import MediaItem from 'components/Pages/Media/MediaItem'
import { WhiteButton } from '../../Buttons'
import { ScreenPreviewModal } from '../../Modal'
import PageContainer from '../../PageContainer'
import AddMedia from './AddMedia'
import MediaSearchForm from './MediaSearch'
import MediaTable from './MediaTable'

import { dndConstants, entityGroupsConstants } from 'constants/index'
import { queryParamsHelper } from 'utils'
import {
  clearDeleteGroupInfoAction,
  clearPostGroupInfoAction,
  clearPutGroupInfoAction,
  deleteGroupAction,
  postGroupAction,
  putGroupAction
} from 'actions/groupActions'
import {
  clearDeleteMediaGroupItemInfoAction,
  clearGetMediaGroupItemsInfoAction,
  clearGetMediaGroupsInfoAction,
  clearMediaGroupItemsInfo,
  clearPostMediaGroupItemInfoAction,
  deleteMediaGroupItemAction,
  getMediaGroupItemsAction,
  getMediaGroupsAction,
  getMediaItemsAction,
  postMediaGroupItemAction
} from 'actions/mediaActions'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: palette[type].pageContainer.header.button.iconColor
  },
  selectTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: palette[type].pageContainer.header.titleColor
  },
  selectSubTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: palette[type].pageContainer.header.titleColor
  }
})

const initialFilter = {
  title: '',
  featureId: '',
  group: ''
}

const MediaLibrary = ({
  t,
  classes,
  library,
  location: { search },
  meta,
  getMediaItemsAction,
  postMediaGroupItemAction,
  getMediaGroupItemsAction,
  clearGetMediaGroupItemsInfoAction,
  deleteMediaGroupItemAction,
  postGroupItemReducer,
  groupItemsReducer,
  deleteGroupItemReducer,
  clearMediaGroupItemsInfo
}) => {
  const searchParams = useMemo(() => {
    const paramsObj = {}
    const urlParams = new URLSearchParams(search)
    urlParams.forEach((value, key) => {
      paramsObj[key] = value
    })
    return paramsObj
  }, [search])

  const [selected, setSelected] = useState(0)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)

  const [queryParams, setQueryParams] = useState({
    ...initialFilter,
    ...searchParams
  })

  useEffect(() => {
    if (library.response) {
      setMedia(library.response.data)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [library])

  const handleChangeSelectionItems = useCallback(value => {
    setSelected(value)
  }, [])

  const handleMoveItem = useCallback(
    (mediaId, groupId) => {
      postMediaGroupItemAction({ mediaId, groupId })
    },
    [postMediaGroupItemAction]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteMediaGroupItemAction({ mediaId: itemId, groupId })
    },
    [deleteMediaGroupItemAction]
  )

  const onFilterSubmit = values => {
    setQueryParams(values)
    getMediaItemsAction(
      queryParamsHelper({
        ...values,
        limit: meta.perPage
      })
    )
  }

  const onFilterReset = () => {
    setQueryParams(initialFilter)
    getMediaItemsAction({
      limit: meta.perPage
    })
  }

  return (
    <PageContainer
      pageTitle={t('Media page title')}
      PageTitleComponent={
        selected > 0 ? (
          <div
            key="selectTitle"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography component="h2" className={classes.selectTitle}>
              {`${t('Media page title')} |`}
            </Typography>
            {'\u00A0'}
            <Typography
              component="h3"
              variant="subtitle1"
              className={classes.selectSubTitle}
            >
              {`${selected} ${t('selected')}`}
            </Typography>
          </div>
        ) : null
      }
      ActionButtonsComponent={
        <>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to="/media-library/groups"
          >
            <i
              className={`${classes.iconColor} icon-navigation-show-more-vertical`}
            />
            {t('Groups')}
          </WhiteButton>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to="/media-library/media/add/general"
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {t('Add Media table action')}
          </WhiteButton>
        </>
      }
      SubHeaderMenuComponent={
        <MediaSearchForm
          queryParams={queryParams}
          onSubmit={onFilterSubmit}
          onReset={onFilterReset}
        />
      }
    >
      <MediaTable
        onChangeSelection={handleChangeSelectionItems}
        queryParams={queryParamsHelper(queryParams)}
      />
      <Route
        path="/media-library/media/:mode/:currentTab"
        component={AddMedia}
      />
      <Route
        path="/media-library/groups"
        render={props => (
          <GroupModal
            {...props}
            title={t('Media Groups')}
            closeLink="/media-library"
            entity={entityGroupsConstants.Media}
            groupItemsTitle={t('Media')}
            dropItemType={dndConstants.mediaGroupsItemTypes.MEDIA_ITEM}
            onMoveItem={handleMoveItem}
            itemsLoading={loading}
            groupItemsReducer={groupItemsReducer}
            postGroupItemReducer={postGroupItemReducer}
            deleteGroupItemReducer={deleteGroupItemReducer}
            clearGroupItemsInfo={clearMediaGroupItemsInfo}
            itemsPopupProps={{
              getGroupItems: getMediaGroupItemsAction,
              onDeleteItem: handleDeleteGroupItem,
              clearGroupItemsInfo: clearGetMediaGroupItemsInfoAction
            }}
          >
            <Grid container>
              {media.map((media, index) => (
                <MediaItem key={`media-${index}`} media={media} index={index} />
              ))}
            </Grid>
          </GroupModal>
        )}
      />
      <ScreenPreviewModal />
    </PageContainer>
  )
}

MediaLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ media, group, user }) => ({
  library: media.library,
  groupsReducer: media.groups,
  postGroupReducer: group.post,
  deleteGroupReducer: group.del,
  putGroupReducer: group.put,
  postGroupItemReducer: media.postGroupItem,
  detailsReducer: user.details,
  groupItemsReducer: media.groupItems,
  deleteGroupItemReducer: media.deleteGroupItem,
  meta: _get(media, 'library.response.meta', { perPage: 10 })
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMediaItemsAction,
      getMediaGroupsAction,
      postMediaGroupItemAction,
      clearPostMediaGroupItemInfoAction,
      getMediaGroupItemsAction,
      clearGetMediaGroupItemsInfoAction,
      deleteMediaGroupItemAction,
      clearDeleteMediaGroupItemInfoAction,
      clearDeleteGroupInfoAction,
      clearPostGroupInfoAction,
      clearPutGroupInfoAction,
      deleteGroupAction,
      postGroupAction,
      putGroupAction,
      clearGetMediaGroupsInfoAction,
      clearMediaGroupItemsInfo
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(MediaLibrary)
