import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { playlistService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* addPlaylist(action) {
  try {
    const response = yield call(playlistService.addPlaylist, action.data)
    yield put({
      type: types.POST_PLAYLIST_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.POST_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* deletePlaylistById({ id }) {
  try {
    yield call(playlistService.deletePlaylistById, id)
    yield put({
      type: types.DELETE_PLAYLIST_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* deleteSelectedPlaylist({ ids }) {
  try {
    yield call(playlistService.deleteSelectedPlaylist, ids)
    yield put({
      type: types.DELETE_SELECTED_PLAYLIST_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* putPlaylistById(action) {
  try {
    const response = yield call(playlistService.putPlaylistById, {
      id: action.meta.id,
      data: action.data
    })
    yield put({
      type: types.PUT_PLAYLIST_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.PUT_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* getPlaylistById(action) {
  try {
    const response = yield call(playlistService.getPlaylistById, action.data)
    yield put({
      type: types.GET_PLAYLIST_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_PLAYLIST_BY_ID_ERROR,
      payload: error
    })
  }
}

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(playlistService.getItems, params)
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_PLAYLIST_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_PLAYLIST_ITEMS_ERROR, payload: error })
  }
}

function* getPreference() {
  try {
    const response = yield call(playlistService.getPreference)
    yield put({
      type: types.GET_PLAYLIST_PREFERENCE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_PLAYLIST_PREFERENCE_ERROR, payload: error })
  }
}

function* putPreference(action) {
  try {
    yield call(playlistService.putPreference, action.payload)
    yield put({ type: types.GET_PLAYLIST_PREFERENCE })
  } catch (error) {
    yield put({ type: types.PUT_PLAYLIST_PREFERENCE_ERROR, payload: error })
  }
}

function* getGroups({ params }) {
  try {
    const response = yield call(playlistService.getGroups, params)
    yield put({ type: types.GET_PLAYLIST_GROUPS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_PLAYLIST_GROUPS_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(
      playlistService.getGroupItems,
      action.payload.id,
      action.payload.params
    )
    yield put({
      type: types.GET_PLAYLIST_GROUP_ITEMS_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_PLAYLIST_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    const response = yield call(playlistService.postGroupItem, action.payload)
    yield put({
      type: types.POST_PLAYLIST_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.POST_PLAYLIST_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    const response = yield call(playlistService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_PLAYLIST_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.DELETE_PLAYLIST_GROUP_ITEM_ERROR, payload: error })
  }
}

function* clonePlaylist({ data }) {
  try {
    yield call(playlistService.clonePlaylist, data)
    yield put({
      type: types.CLONE_PLAYLIST_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.CLONE_PLAYLIST_ERROR, payload: error })
  }
}

export default {
  addPlaylist,
  getPlaylistById,
  putPlaylistById,
  deletePlaylistById,
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  deleteSelectedPlaylist,
  clonePlaylist
}
