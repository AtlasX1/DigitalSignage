import { put, call } from 'redux-saga/effects'

import * as types from '../actions'

import { clientSettingsService } from '../services'

function* getClientSettings() {
  try {
    const response = yield call(clientSettingsService.getClientSettings)
    yield put({ type: types.GET_USER_SETTINGS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_USER_SETTINGS_ERROR, payload: error })
  }
}

function* putClientSettings(action) {
  try {
    yield call(clientSettingsService.putClientSettings, action.payload)
    yield put({ type: types.PUT_CLIENT_SETTINGS_SUCCESS, payload: [] })
  } catch (error) {
    yield put({ type: types.PUT_CLIENT_SETTINGS_ERROR, payload: error })
  }
}

export default {
  getClientSettings,
  putClientSettings
}
