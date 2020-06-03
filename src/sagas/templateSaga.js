import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { templateService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* postTemplate(action) {
  try {
    const response = yield call(templateService.postTemplate, action.data)
    yield put({
      type: types.POST_TEMPLATE_SUCCESS,
      payload: response,
      meta: action.meta
    })
  } catch (error) {
    yield put({
      type: types.POST_TEMPLATE_ERROR,
      payload: error,
      meta: action.meta
    })
  }
}

function* getTemplate(action) {
  try {
    const response = yield call(templateService.getTemplate, action.data)
    yield put({
      type: types.GET_TEMPLATE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_TEMPLATE_ERROR, payload: error })
  }
}

function* editTemplate(action) {
  try {
    const response = yield call(templateService.editTemplate, {
      id: action.meta.id,
      data: action.data
    })
    yield put({
      type: types.PUT_TEMPLATE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.PUT_TEMPLATE_ERROR, payload: error })
  }
}

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(templateService.getItems, params)
    const modifiedMeta = transformMeta(meta)
    yield put({
      type: types.GET_TEMPLATE_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_TEMPLATE_ITEMS_ERROR, payload: error })
  }
}

function* getPreference() {
  try {
    const response = yield call(templateService.getPreference)
    yield put({
      type: types.GET_TEMPLATE_PREFERENCE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_TEMPLATE_PREFERENCE_ERROR, payload: error })
  }
}

function* putPreference(action) {
  try {
    yield call(templateService.putPreference, action.payload)
    yield put({ type: types.GET_TEMPLATE_PREFERENCE })
  } catch (error) {
    yield put({ type: types.PUT_TEMPLATE_PREFERENCE_ERROR, payload: error })
  }
}

function* getGroups() {
  try {
    const response = yield call(templateService.getGroups)
    yield put({ type: types.GET_TEMPLATE_GROUPS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_TEMPLATE_GROUPS_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(templateService.getGroupItems, action.payload)
    yield put({
      type: types.GET_TEMPLATE_GROUP_ITEMS_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_TEMPLATE_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    const response = yield call(templateService.postGroupItem, action.payload)
    yield put({
      type: types.POST_TEMPLATE_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.POST_TEMPLATE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    const response = yield call(templateService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_TEMPLATE_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.DELETE_TEMPLATE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* cloneTemplate({ data }) {
  try {
    yield call(templateService.cloneTemplate, data)
    yield put({
      type: types.CLONE_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.CLONE_TEMPLATE_ERROR, payload: error })
  }
}

function* deleteTemplateById({ id }) {
  try {
    yield call(templateService.deleteTemplateById, id)
    yield put({
      type: types.DELETE_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_TEMPLATE_ERROR,
      payload: error
    })
  }
}

function* deleteSelectedTemplate({ ids }) {
  try {
    yield call(templateService.deleteSelectedTemplate, ids)
    yield put({
      type: types.DELETE_SELECTED_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_TEMPLATE_ERROR,
      payload: error
    })
  }
}

export default {
  postTemplate,
  getTemplate,
  editTemplate,
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  cloneTemplate,
  deleteSelectedTemplate,
  deleteTemplateById
}
