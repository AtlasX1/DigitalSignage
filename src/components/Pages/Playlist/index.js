import React, { Fragment, useMemo, useCallback, useState } from 'react'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
import { Grid, withStyles } from '@material-ui/core'

import { WhiteButton } from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import PlaylistSearchForm from './PlaylistSearch'
import PlaylistPreview from './PlaylistPreview'
import CreatePlaylist from './CreatePlaylist'
import SmartPlaylist from './SmartPlaylist'
import BaseTable from 'components/TableLibrary/BaseTable'
import PageTitle from 'components/PageContainer/PageTitle'
import PlaylistTableRow from 'components/Pages/Playlist/PlaylistTableRow'
import CopyItemModal from 'components/Modal/CopyItemModal'
import GroupModal from 'components/Group'

import {
  routeByName,
  entityGroupsConstants,
  dndConstants,
  entityConstants
} from 'constants/index'

import useIds from 'hooks/tableLibrary/useIds'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import usePreference from 'hooks/tableLibrary/usePreference'
import useNotifyAnalyzer from 'hooks/tableLibrary/useNotifyAnalyzer'

import {
  clearDeleteGroupInfoAction,
  clearPostGroupInfoAction,
  clearPutGroupInfoAction,
  deleteGroupAction,
  postGroupAction,
  putGroupAction
} from 'actions/groupActions'

import {
  getPlaylistItemsAction as getItems,
  deleteSelectedPlaylist as deleteSelectedItems,
  clearResponseInfo,
  clonePlaylist as cloneItem,
  postPlaylistGroupItemAction,
  clearPostPlaylistGroupItemInfoAction,
  getPlaylistGroupsAction,
  getPlaylistGroupItemsAction,
  clearGetPlaylistGroupItemsInfoAction,
  deletePlaylistGroupItemAction,
  clearDeletePlaylistGroupItemInfoAction,
  clearPlaylistGroupItemsInfo
} from 'actions/playlistActions'
import PlaylistItem from './PlaylisItem'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionIcons: {
      marginRight: '17px'
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    }
  }
}

const initialColumns = [
  { id: 'playlistType', label: 'Type', display: true },
  { id: 'title', label: 'Name', display: true },
  { id: 'group', label: 'Group', display: true },
  { id: 'duration', label: 'Duration', align: 'center', display: true },
  { id: 'createdBy', label: 'Created By', display: true },
  { id: 'noOfFiles', label: 'Media Count', align: 'center', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true }
]

const cloneModalInitialState = {
  open: false,
  playlistId: 0,
  title: ''
}

const PlaylistLibrary = ({
  classes,
  t,
  items,
  meta,
  clone,
  getItems,
  del,
  clearResponseInfo,
  deleteSelectedItems,
  enqueueSnackbar,
  closeSnackbar,
  cloneItem,
  getPlaylistGroupItemsAction,
  clearGetPlaylistGroupItemsInfoAction,
  postGroupItemReducer,
  groupItemsReducer,
  deleteGroupItemReducer,
  clearPlaylistGroupItemsInfo,
  postPlaylistGroupItemAction,
  deletePlaylistGroupItemAction
}) => {
  const translate = useMemo(
    () => ({
      title: t('Playlist page title'),
      groups: t('Groups'),
      add: t('Add Playlist table action'),
      showInactive: t('Show Inactive Users')
    }),
    [t]
  )

  const rowsIds = useIds(items)

  const selectedList = useSelectedList(rowsIds)

  const preference = usePreference({
    initialColumns,
    fetcher: getItems,
    entity: entityConstants.PlaylistLibrary,
    perPage: meta.perPage
  })

  const fetchItems = useCallback(
    () =>
      getItems({
        page: 1,
        limit: meta.perPage
      }),
    [getItems, meta.perPage]
  )

  const [dataOfCopyModal, setDataOfCopyModal] = useState(cloneModalInitialState)

  const handleCloneRow = useCallback(data => {
    setDataOfCopyModal(data)
  }, [])

  const handleCloseModal = useCallback(() => {
    setDataOfCopyModal(cloneModalInitialState)
  }, [])

  const handleCopyPlaylist = useCallback(
    data => {
      cloneItem({ ...data, playlistId: data.id })
    },
    [cloneItem]
  )

  const handleMoveItem = useCallback(
    (playlistId, groupId) => {
      postPlaylistGroupItemAction({ playlistId, groupId })
    },
    [postPlaylistGroupItemAction]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deletePlaylistGroupItemAction({ playlistId: itemId, groupId })
    },
    [deletePlaylistGroupItemAction]
  )

  useNotifyAnalyzer(
    fetchItems,
    clearResponseInfo,
    enqueueSnackbar,
    closeSnackbar,
    'Playlist',
    [del, clone]
  )

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={routeByName.playlist.groups}
          >
            <i
              className={`${classes.iconColor} icon-navigation-show-more-vertical`}
            />
            {translate.groups}
          </WhiteButton>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={routeByName.playlist.create}
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={<PlaylistSearchForm />}
    >
      <BaseTable
        noType
        meta={meta}
        fetcher={getItems}
        columns={preference.columns}
        preferenceActions={preference.actions}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        placeholderMessage="No saved playlist"
      >
        {items.map(row => (
          <PlaylistTableRow
            row={row}
            columns={preference.columns}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            key={`playlist-row-${row.id}`}
            onClone={handleCloneRow}
          />
        ))}
      </BaseTable>
      <CopyItemModal
        data={dataOfCopyModal}
        onCloseModal={handleCloseModal}
        modalTitle="Copy playlist"
        inputPlaceholder="Playlist name"
        onClickSave={handleCopyPlaylist}
      />
      <Route path={routeByName.playlist.preview} component={PlaylistPreview} />
      <Route path={routeByName.playlist.create} component={CreatePlaylist} />
      <Route
        path={routeByName.playlist.edit}
        render={props => <CreatePlaylist {...props} edit />}
      />
      <Route path={routeByName.playlist.smart} component={SmartPlaylist} />
      <Route
        path={routeByName.playlist.groups}
        render={props => (
          <GroupModal
            {...props}
            title={t('Playlist Groups')}
            closeLink={routeByName.playlist.root}
            entity={entityGroupsConstants.Playlist}
            groupItemsTitle={t('Playlists')}
            dropItemType={dndConstants.playlistGroupsItemTypes.PLAYLIST_ITEM}
            onMoveItem={handleMoveItem}
            itemsLoading={meta.isLoading}
            groupItemsReducer={groupItemsReducer}
            postGroupItemReducer={postGroupItemReducer}
            deleteGroupItemReducer={deleteGroupItemReducer}
            clearGroupItemsInfo={clearPlaylistGroupItemsInfo}
            itemsPopupProps={{
              getGroupItems: getPlaylistGroupItemsAction,
              onDeleteItem: handleDeleteGroupItem,
              clearGroupItemsInfo: clearGetPlaylistGroupItemsInfoAction
            }}
          >
            <Grid container>
              {items.map((playlist, index) => (
                <PlaylistItem key={`playlist-${index}`} playlist={playlist} />
              ))}
            </Grid>
          </GroupModal>
        )}
      />
    </PageContainer>
  )
}
const mapStateToProps = ({ playlist, group }) => ({
  items: playlist.library.response,
  meta: playlist.library.meta,
  clone: playlist.clone,
  del: playlist.del,
  groupsReducer: playlist.groups,
  postGroupReducer: group.post,
  deleteGroupReducer: group.del,
  putGroupReducer: group.put,
  postGroupItemReducer: playlist.postGroupItem,
  groupItemsReducer: playlist.groupItems,
  deleteGroupItemReducer: playlist.deleteGroupItem
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo,
      deleteSelectedItems,
      cloneItem,
      postPlaylistGroupItemAction,
      clearPostPlaylistGroupItemInfoAction,
      getPlaylistGroupsAction,
      getPlaylistGroupItemsAction,
      clearGetPlaylistGroupItemsInfoAction,
      deletePlaylistGroupItemAction,
      clearDeletePlaylistGroupItemInfoAction,
      clearDeleteGroupInfoAction,
      clearPostGroupInfoAction,
      clearPutGroupInfoAction,
      deleteGroupAction,
      postGroupAction,
      putGroupAction,
      clearPlaylistGroupItemsInfo
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(PlaylistLibrary)
