import * as types from './index'

const getItems = params => ({ type: types.GET_USERS_ITEMS, params })

const postItem = data => ({
  type: types.POST_USERS_ITEM,
  payload: data
})

const deleteItem = id => ({
  type: types.DELETE_USERS_ITEM,
  payload: id
})

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_USERS,
  ids
})

const getItem = id => ({
  type: types.GET_USERS_ITEM,
  payload: id
})

const putItem = (id, data) => ({
  type: types.PUT_USERS_ITEM,
  id,
  data
})

const clearResponseInfo = () => ({
  type: types.CLEAR_USERS_RESPONSE_INFO
})

const getUsersGroups = params => ({
  type: types.GET_USERS_GROUPS,
  params
})

const getUngroupedUsers = () => ({
  type: types.GET_UNGROUPED_USERS
})

const getUsersGroupItems = (id, params) => ({
  type: types.GET_USERS_GROUP_ITEMS,
  payload: { id, params }
})

const postUsersGroupItem = data => ({
  type: types.POST_USERS_GROUP_ITEM,
  payload: data
})

const deleteUsersGroupItem = data => ({
  type: types.DELETE_USERS_GROUP_ITEM,
  payload: data
})

const clearGetUsersGroupItemsInfo = () => ({
  type: types.CLEAR_GET_USERS_GROUP_ITEMS_INFO
})

const clearUsersGroupItemsInfo = () => ({
  type: types.CLEAR_USERS_GROUP_ITEMS_RESPONSE_INFO
})

const getUsersPermission = data => ({
  type: types.GET_USERS_PERMISSION,
  payload: data
})

const clearGetUsersPermissionInfo = () => ({
  type: types.CLEAR_GET_USERS_PERMISSION_INFO
})

const putUsersPermission = data => ({
  type: types.PUT_USERS_PERMISSION,
  payload: data
})

const getUsersGroupPermission = data => ({
  type: types.GET_USERS_GROUP_PERMISSION,
  payload: data
})

const clearGetUsersGroupsPermissionInfo = () => ({
  type: types.CLEAR_GET_USERS_GROUP_PERMISSION_INFO
})

const putUsersGroupPermission = data => ({
  type: types.PUT_USERS_GROUP_PERMISSION,
  payload: data
})

export {
  getItems,
  postItem,
  deleteItem,
  getItem,
  putItem,
  deleteSelectedItems,
  getUsersGroups,
  getUngroupedUsers,
  getUsersGroupItems,
  postUsersGroupItem,
  deleteUsersGroupItem,
  getUsersPermission,
  putUsersPermission,
  getUsersGroupPermission,
  putUsersGroupPermission,
  clearResponseInfo,
  clearGetUsersPermissionInfo,
  clearGetUsersGroupsPermissionInfo,
  clearGetUsersGroupItemsInfo,
  clearUsersGroupItemsInfo
}
