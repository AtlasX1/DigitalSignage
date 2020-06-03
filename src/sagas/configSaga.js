import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { configService } from '../services'

function* getConfigOrgRole() {
  try {
    const response = yield call(configService.getConfigOrgRole)

    //Extend response
    const transformResponse = response.map(item => ({
      ...item,
      label: item.displayName,
      value: item.id
    }))

    yield put({
      type: types.GET_CONFIG_ORG_ROLE_SUCCESS,
      payload: transformResponse
    })
  } catch (error) {
    yield put({ type: types.GET_CONFIG_ORG_ROLE_ERROR, payload: error })
  }
}

function* getConfigEnterpriseRole() {
  try {
    const response = yield call(configService.getConfigEnterpriseRole)
    yield put({
      type: types.GET_CONFIG_ENTERPRISE_ROLE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_ENTERPRISE_ROLE_ERROR,
      payload: error
    })
  }
}

function* getConfigSystemRole() {
  try {
    const response = yield call(configService.getConfigSystemRole)
    yield put({
      type: types.GET_CONFIG_SYSTEM_ROLE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_SYSTEM_ROLE_ERROR,
      payload: error
    })
  }
}

function* getConfigClientType() {
  try {
    const response = yield call(configService.getConfigClientType)
    yield put({
      type: types.GET_CONFIG_CLIENT_TYPE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_CLIENT_TYPE_ERROR,
      payload: error
    })
  }
}

function* getConfigDeviceType() {
  try {
    const response = yield call(configService.getConfigDeviceType)
    yield put({
      type: types.GET_CONFIG_DEVICE_TYPE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_DEVICE_TYPE_ERROR,
      payload: error
    })
  }
}

function* getConfigFeatureClient() {
  try {
    const response = yield call(configService.getConfigFeatureClient)
    yield put({
      type: types.GET_CONFIG_FEATURE_CLIENT_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_FEATURE_CLIENT_ERROR,
      payload: error
    })
  }
}

function* getConfigFeatureDevice() {
  try {
    const response = yield call(configService.getConfigFeatureDevice)
    yield put({
      type: types.GET_CONFIG_FEATURE_DEVICE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_FEATURE_DEVICE_ERROR,
      payload: error
    })
  }
}

function* getConfigFeatureMedia() {
  try {
    const response = yield call(configService.getConfigFeatureMedia)
    yield put({
      type: types.GET_CONFIG_FEATURE_MEDIA_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_FEATURE_MEDIA_ERROR,
      payload: error
    })
  }
}

function* getThemeOfMediaFeatureById({ id }) {
  try {
    const response = yield call(configService.getThemeOfMediaFeatureById, id)
    yield put({
      type: types.GET_THEME_OF_MEDIA_FEATURE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_THEME_OF_MEDIA_FEATURE_BY_ID_ERROR,
      payload: error
    })
  }
}

function* getContentSourceOfMediaFeatureById({ id }) {
  try {
    const response = yield call(
      configService.getContentSourceOfMediaFeatureById,
      id
    )
    yield put({
      type: types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID_ERROR,
      payload: error
    })
  }
}

function* getConfigMediaCategory() {
  try {
    const response = yield call(configService.getConfigMediaCategory)
    yield put({
      type: types.GET_CONFIG_MEDIA_CATEGORY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_MEDIA_CATEGORY_ERROR,
      payload: error
    })
  }
}

function* getLocation(action) {
  try {
    const response = yield call(configService.getLocation, action.data)
    yield put({
      type: types.GET_LOCATION_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_LOCATION_ERROR,
      payload: error
    })
  }
}

function* clearMediaThemes() {
  yield put({
    type: types.CLEAR_THEME_OF_MEDIA_SUCCESS,
    payload: []
  })
}

function* getTransitions() {
  try {
    const response = yield call(configService.getTransitions)
    yield put({
      type: types.GET_CONFIG_TRANSITIONS_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONFIG_TRANSITIONS_ERROR,
      payload: error
    })
  }
}

function* getAlertTypes() {
  try {
    const response = yield call(configService.getAlertTypes)
    yield put({ type: types.GET_CONFIG_ALERT_TYPES_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_CONFIG_ALERT_TYPES_ERROR, payload: error })
  }
}

function* getLocationInfo({ location }) {
  try {
    const { data } = yield call(configService.getLocationInfo, location)
    yield put({ type: types.GET_LOCATION_INFO_SUCCESS, payload: data })
  } catch (error) {
    yield put({ type: types.GET_LOCATION_INFO_ERROR, payload: error })
  }
}

export default {
  getConfigOrgRole,
  getConfigEnterpriseRole,
  getConfigSystemRole,
  getConfigClientType,
  getConfigDeviceType,
  getConfigFeatureClient,
  getConfigFeatureDevice,
  getConfigFeatureMedia,
  getConfigMediaCategory,
  getThemeOfMediaFeatureById,
  getContentSourceOfMediaFeatureById,
  getLocation,
  clearMediaThemes,
  getTransitions,
  getAlertTypes,
  getLocationInfo
}
