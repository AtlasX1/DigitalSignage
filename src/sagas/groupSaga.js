import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { groupsService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getGroupByEntity({ entity, params }) {
  try {
    const { data, meta } = yield call(
      groupsService.getGroupByEntity,
      entity,
      params
    )
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_GROUPS_BY_ENTITY_SUCCESS,
      payload: { entity, data, modifiedMeta }
    })
  } catch (error) {
    yield put({
      type: types.GET_GROUPS_BY_ENTITY_ERROR,
      payload: { entity, error }
    })
  }
}

function* postGroup(action) {
  try {
    yield call(groupsService.postGroup, action.payload)
    yield put({
      type: types.POST_GROUP_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_GROUP_ERROR, payload: error })
  }
}

function* deleteGroup(action) {
  try {
    yield call(groupsService.deleteGroup, action.payload)
    yield put({
      type: types.DELETE_GROUP_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_GROUP_ERROR, payload: error })
  }
}

function* putGroup(action) {
  try {
    yield call(groupsService.putGroup, action.payload)
    yield put({ type: types.PUT_GROUP_SUCCESS, payload: { status: 'success' } })
  } catch (error) {
    yield put({ type: types.PUT_GROUP_ERROR, payload: error })
  }
}

function* getGroupPermission(action) {
  try {
    const response = yield call(
      groupsService.getGroupPermission,
      action.payload
    )
    yield put({ type: types.GET_GROUP_PERMISSION_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_GROUP_PERMISSION_ERROR, payload: error })
  }
}

function* putGroupPermission(action) {
  try {
    const response = yield call(
      groupsService.putGroupPermission,
      action.payload
    )
    yield put({ type: types.PUT_GROUP_PERMISSION_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_GROUP_PERMISSION_ERROR, payload: error })
  }
}

export default {
  getGroupByEntity,
  postGroup,
  deleteGroup,
  putGroup,
  getGroupPermission,
  putGroupPermission
}
