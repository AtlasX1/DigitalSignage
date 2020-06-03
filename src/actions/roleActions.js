import * as types from './index'

const getRolesAction = data => ({
  type: types.GET_ROLES,
  data
})

const clearGetRolesAction = () => ({ type: types.CLEAR_GET_ROLES_INFO })

const getRoleByIdAction = id => ({
  type: types.GET_ROLE_BY_ID,
  id
})

const postRoleAction = data => ({
  type: types.POST_ROLE,
  data
})

const clearPostRoleAction = () => ({ type: types.CLEAR_POST_ROLE_INFO })

const putRoleByIdAction = (id, data) => ({
  type: types.PUT_ROLE_BY_ID,
  id,
  data
})

const clearPutRoleAction = () => ({ type: types.CLEAR_PUT_ROLE_INFO })

const getRolePermissionByIdAction = id => ({
  type: types.GET_ROLE_PERMISSION_BY_ID,
  id
})

const clearGetRolePermissionByIdAction = () => ({
  type: types.CLEAR_GET_ROLE_PERMISSION_BY_ID_INFO
})

const putRolePermissionByIdAction = (id, data) => ({
  type: types.PUT_ROLE_PERMISSION_BY_ID,
  id,
  data
})

const clearPutRolePermissionByIdAction = () => ({
  type: types.CLEAR_PUT_ROLE_PERMISSION_BY_ID_INFO
})

export {
  getRolesAction,
  clearGetRolesAction,
  getRoleByIdAction,
  postRoleAction,
  clearPostRoleAction,
  putRoleByIdAction,
  clearPutRoleAction,
  getRolePermissionByIdAction,
  clearGetRolePermissionByIdAction,
  putRolePermissionByIdAction,
  clearPutRolePermissionByIdAction
}
