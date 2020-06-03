import * as types from './index'

const getPlaylistItemsAction = params => ({
  type: types.GET_PLAYLIST_ITEMS,
  params
})

const addPlaylist = ({ data }) => ({
  type: types.POST_PLAYLIST,
  data
})

const editPlaylist = ({ id, data }) => ({
  type: types.PUT_PLAYLIST,
  data,
  meta: {
    id
  }
})

const deletePlaylist = id => ({
  type: types.DELETE_PLAYLIST,
  id
})

const deleteSelectedPlaylist = ids => ({
  type: types.DELETE_SELECTED_PLAYLIST,
  ids
})

const getPlaylistById = id => ({
  type: types.GET_PLAYLIST_BY_ID,
  data: id
})

const clearAddedPlaylist = meta => ({
  type: types.CLEAR_ADDED_PLAYLIST,
  meta
})

const getPlaylistLibraryPref = () => ({ type: types.GET_PLAYLIST_PREFERENCE })

const putPlaylistLibraryPref = data => ({
  type: types.PUT_PLAYLIST_PREFERENCE,
  payload: data
})

const getPlaylistGroupsAction = params => ({
  type: types.GET_PLAYLIST_GROUPS,
  params
})

const clearGetPlaylistGroupInfoAction = () => ({
  type: types.CLEAR_GET_PLAYLIST_GROUP_INFO
})

const getPlaylistGroupItemsAction = id => ({
  type: types.GET_PLAYLIST_GROUP_ITEMS,
  payload: id
})

const clearGetPlaylistGroupItemsInfoAction = () => ({
  type: types.CLEAR_GET_PLAYLIST_GROUP_ITEMS_INFO
})

const clearPlaylistGroupItemsInfo = () => ({
  type: types.CLEAR_PLAYLIST_GROUP_ITEMS_RESPONSE_INFO
})

const postPlaylistGroupItemAction = data => ({
  type: types.POST_PLAYLIST_GROUP_ITEM,
  payload: data
})

const clearPostPlaylistGroupItemInfoAction = () => ({
  type: types.CLEAR_POST_PLAYLIST_GROUP_ITEM_INFO
})

const deletePlaylistGroupItemAction = data => ({
  type: types.DELETE_PLAYLIST_GROUP_ITEM,
  payload: data
})

const clearDeletePlaylistGroupItemInfoAction = () => ({
  type: types.CLEAR_DELETE_PLAYLIST_GROUP_ITEM_INFO
})

const clearResponseInfo = () => ({
  type: types.CLEAR_PLAYLIST_RESPONSE_INFO
})

const clonePlaylist = data => ({
  type: types.CLONE_PLAYLIST,
  data
})

export {
  addPlaylist,
  editPlaylist,
  getPlaylistById,
  clearAddedPlaylist,
  getPlaylistItemsAction,
  getPlaylistLibraryPref,
  putPlaylistLibraryPref,
  getPlaylistGroupsAction,
  clearGetPlaylistGroupInfoAction,
  getPlaylistGroupItemsAction,
  clearGetPlaylistGroupItemsInfoAction,
  postPlaylistGroupItemAction,
  clearPostPlaylistGroupItemInfoAction,
  deletePlaylistGroupItemAction,
  clearDeletePlaylistGroupItemInfoAction,
  deletePlaylist,
  deleteSelectedPlaylist,
  clearResponseInfo,
  clonePlaylist,
  clearPlaylistGroupItemsInfo
}
