import { call, put } from 'redux-saga/effects'

import { alertServices } from '../services'

import * as types from '../actions'

function* getAlertDevicesById(action) {
  try {
    const response = yield call(
      alertServices.getAlertDevicesById,
      action.payload
    )
    yield put({
      type: types.GET_ALERT_DEVICES_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_ALERT_DEVICES_BY_ID_ERROR, payload: error })
  }
}

function* postAlertTrigger(action) {
  try {
    const response = yield call(alertServices.postAlertTrigger, action.payload)
    yield put({ type: types.POST_ALERT_TRIGGER_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_ALERT_TRIGGER_ERROR, payload: error })
  }
}

function* getDeviceMediaEmergencyAlert(action) {
  try {
    const response = yield call(
      alertServices.getDeviceMediaEmergencyAlert,
      action.payload
    )
    yield put({
      type: types.GET_DEVICE_MEDIA_EMERGENCY_ALERT_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_DEVICE_MEDIA_EMERGENCY_ALERT_ERROR,
      payload: error
    })
  }
}

function* putDeviceMediaEmergencyAlert(action) {
  try {
    const response = yield call(
      alertServices.putDeviceMediaEmergencyAlert,
      action.payload
    )
    yield put({
      type: types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT_ERROR,
      payload: error
    })
  }
}

function* getDeviceMediaCapAlert(action) {
  try {
    const response = yield call(
      alertServices.getDeviceMediaCapAlert,
      action.payload
    )
    yield put({
      type: types.GET_DEVICE_MEDIA_CAP_ALERT_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_MEDIA_CAP_ALERT_ERROR, payload: error })
  }
}

function* putDeviceMediaCapAlert(action) {
  try {
    const response = yield call(
      alertServices.putDeviceMediaCapAlert,
      action.payload
    )
    yield put({
      type: types.PUT_DEVICE_MEDIA_CAP_ALERT_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_MEDIA_CAP_ALERT_ERROR, payload: error })
  }
}

function* disableAlert() {
  try {
    yield call(alertServices.disableAlert)
    yield put({ type: types.DISABLE_ALERT_SUCCESS, payload: { status: 'ok' } })
  } catch (error) {
    yield put({ type: types.DISABLE_ALERT_ERROR, payload: error })
  }
}

function* disableDeviceAlert(action) {
  try {
    yield call(alertServices.disableDeviceAlert, action.payload)
    yield put({
      type: types.DISABLE_DEVICE_ALERT_SUCCESS,
      payload: { status: 'ok' }
    })
  } catch (error) {
    yield put({ type: types.DISABLE_DEVICE_ALERT_ERROR, payload: error })
  }
}

export default {
  getAlertDevicesById,
  postAlertTrigger,
  getDeviceMediaEmergencyAlert,
  putDeviceMediaEmergencyAlert,
  getDeviceMediaCapAlert,
  putDeviceMediaCapAlert,
  disableAlert,
  disableDeviceAlert
}
