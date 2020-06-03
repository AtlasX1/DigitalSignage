import { call, put } from 'redux-saga/effects'

import * as types from '../actions'
import { mediaService } from '../services'

function* getItems({ params }) {
  try {
    const response = yield call(mediaService.getMediaLibraryItems, params)
    yield put({ type: types.GET_MEDIA_ITEMS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_ITEMS_ERROR, payload: error })
  }
}

function* getPreference() {
  try {
    const response = yield call(mediaService.getMediaLibraryPref)
    yield put({ type: types.GET_MEDIA_PREFERENCE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_PREFERENCE_ERROR, payload: error })
  }
}

function* putPreference(action) {
  try {
    yield call(mediaService.putMediaLibraryPref, action.payload)
    yield put({ type: types.GET_MEDIA_PREFERENCE })
  } catch (error) {
    yield put({ type: types.PUT_MEDIA_PREFERENCE_ERROR, payload: error })
  }
}

function* getGroups(action) {
  try {
    const response = yield call(mediaService.getGroups, action.payload)
    yield put({ type: types.GET_MEDIA_GROUPS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_GROUPS_ERROR, payload: error })
  }
}

function* addMedia({ data, meta }) {
  try {
    const response = yield call(mediaService.addMedia, data)
    yield put({
      type: types.ADD_MEDIA_SUCCESS,
      payload: response,
      meta: meta
    })
  } catch (error) {
    yield put({
      type: types.ADD_MEDIA_ERROR,
      payload: error,
      meta: meta
    })
  }
}

function* getMediaPreview(action) {
  try {
    const response = yield call(mediaService.getMediaPreview, action.data)
    yield put({
      type: types.GET_MEDIA_PREVIEW_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_PREVIEW_ERROR, payload: error })
  }
}

function* generateMediaPreview(action) {
  try {
    const response = yield call(mediaService.generateMediaPreview, action.data)
    yield put({
      type: types.GENERATE_MEDIA_PREVIEW_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GENERATE_MEDIA_PREVIEW_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(mediaService.getGroupItems, action.payload)
    yield put({ type: types.GET_MEDIA_GROUP_ITEMS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    const response = yield call(mediaService.postGroupItem, action.payload)
    yield put({ type: types.POST_MEDIA_GROUP_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_MEDIA_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    const response = yield call(mediaService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_MEDIA_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.DELETE_MEDIA_GROUP_ITEM_ERROR, payload: error })
  }
}

function* getMediaItemById(action) {
  try {
    const response = yield call(mediaService.getMediaItemById, action.data)
    yield put({
      type: types.GET_MEDIA_ITEM_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_MEDIA_ITEM_BY_ID_ERROR, payload: error })
  }
}

function* putMediaItemById(action) {
  try {
    const response = yield call(mediaService.putMediaItemById, {
      id: action.meta.id,
      data: action.data,
      method: action.meta.method
    })
    yield put({
      type: types.PUT_MEDIA_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.PUT_MEDIA_ERROR, payload: error })
  }
}

function* getFeatureMediaItems(action) {
  try {
    const response = yield call(
      mediaService.getFeatureMediaItems,
      action.payload
    )
    yield put({
      type: types.GET_FEATURE_MEDIA_ITEMS_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_FEATURE_MEDIA_ITEMS_ERROR, payload: error })
  }
}

export default {
  addMedia,
  getItems,
  getMediaItemById,
  putMediaItemById,
  getPreference,
  putPreference,
  getGroups,
  getMediaPreview,
  generateMediaPreview,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getFeatureMediaItems
}
