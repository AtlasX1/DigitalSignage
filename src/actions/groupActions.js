import * as types from './index'

const getGroupsByEntity = (entity, params) => ({
  type: types.GET_GROUPS_BY_ENTITY,
  entity,
  params
})

const postGroupAction = data => ({ type: types.POST_GROUP, payload: data })

const clearPostGroupInfoAction = () => ({ type: types.CLEAR_POST_GROUP_INFO })

const deleteGroupAction = id => ({ type: types.DELETE_GROUP, payload: id })

const clearDeleteGroupInfoAction = () => ({
  type: types.CLEAR_DELETE_GROUP_INFO
})

const putGroupAction = data => ({ type: types.PUT_GROUP, payload: data })

const clearPutGroupInfoAction = () => ({ type: types.CLEAR_PUT_GROUP_INFO })

const clearUpdateGroupInfoAction = () => ({
  type: types.CLEAR_UPDATE_GROUP_INFO
})

const getGroupPermission = id => ({
  type: types.GET_GROUP_PERMISSION,
  payload: id
})

const clearGetGroupPermissionInfo = () => ({
  type: types.CLEAR_GET_GROUP_PERMISSION_INFO
})

const putGroupPermission = data => ({
  type: types.PUT_GROUP_PERMISSION,
  payload: data
})

const clearPutGroupPermissionInfo = () => ({
  type: types.CLEAR_PUT_GROUP_PERMISSION_INFO
})

export {
  getGroupsByEntity,
  postGroupAction,
  clearPostGroupInfoAction,
  deleteGroupAction,
  clearDeleteGroupInfoAction,
  putGroupAction,
  clearPutGroupInfoAction,
  clearUpdateGroupInfoAction,
  getGroupPermission,
  clearGetGroupPermissionInfo,
  putGroupPermission,
  clearPutGroupPermissionInfo
}
