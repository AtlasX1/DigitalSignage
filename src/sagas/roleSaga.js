import { call, put } from 'redux-saga/effects'
import * as types from '../actions'
import { roleService } from '../services'

function* getRoles({ data }) {
  try {
    const response = yield call(roleService.getRoles, data)
    yield put({ type: types.GET_ROLES_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_ROLES_ERROR, payload: error })
  }
}

function* getRoleById({ id }) {
  try {
    const response = yield call(roleService.getRoleById, id)
    yield put({
      type: types.GET_ROLE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_ROLE_BY_ID_ERROR, payload: error })
  }
}

function* postRole({ data }) {
  try {
    const response = yield call(roleService.postRole, data)
    yield put({ type: types.POST_ROLE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_ROLE_ERROR, payload: error })
  }
}

function* putRoleById({ id, data }) {
  try {
    const response = yield call(roleService.putRoleById, id, data)
    yield put({ type: types.PUT_ROLE_BY_ID_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_ROLE_BY_ID_ERROR, payload: error })
  }
}

function* getRolePermissionById({ id }) {
  try {
    const response = yield call(roleService.getRolePermissionById, id)
    yield put({
      type: types.GET_ROLE_PERMISSION_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_ROLE_PERMISSION_BY_ID_ERROR, payload: error })
  }
}

function* putRolePermissionById({ id, data }) {
  try {
    const response = yield call(roleService.putRolePermissionById, id, data)
    yield put({
      type: types.PUT_ROLE_PERMISSION_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.PUT_ROLE_PERMISSION_BY_ID_ERROR, payload: error })
  }
}

export default {
  getRoles,
  getRoleById,
  postRole,
  putRoleById,
  getRolePermissionById,
  putRolePermissionById
}
