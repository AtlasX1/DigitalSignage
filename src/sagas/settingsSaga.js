import { put, call } from 'redux-saga/effects'

import * as types from '../actions'

import { settingsService } from '../services'

function* getSettings() {
  try {
    const response = yield call(settingsService.getSettings)
    yield put({ type: types.GET_SETTINGS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_SETTINGS_ERROR, payload: error })
  }
}

function* putSettings(action) {
  try {
    yield call(settingsService.putSettings, action.payload)
    yield put({ type: types.PUT_SETTINGS_SUCCESS, payload: [] })
  } catch (error) {
    yield put({ type: types.PUT_SETTINGS_ERROR, payload: error })
  }
}

export default {
  getSettings,
  putSettings
}
