import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { smartPlaylistService } from '../services'

function* buildSmartPlaylist(action) {
  try {
    const response = yield call(
      smartPlaylistService.buildSmartPlaylist,
      action.data
    )
    yield put({
      type: types.BUILD_SMART_PLAYLIST_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.BUILD_SMART_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* postSmartPlaylist(action) {
  try {
    const response = yield call(
      smartPlaylistService.postSmartPlaylist,
      action.data
    )
    yield put({
      type: types.POST_SMART_PLAYLIST_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.POST_SMART_PLAYLIST_ERROR,
      payload: error
    })
  }
}

function* putSmartPlaylist(action) {
  try {
    const response = yield call(smartPlaylistService.putSmartPlaylist, {
      id: action.meta.id,
      data: action.data
    })
    yield put({
      type: types.PUT_SMART_PLAYLIST_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.PUT_SMART_PLAYLIST_ERROR,
      payload: error
    })
  }
}

export default {
  buildSmartPlaylist,
  postSmartPlaylist,
  putSmartPlaylist
}
