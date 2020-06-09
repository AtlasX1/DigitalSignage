import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { deviceService } from '../services'
import {
  capAlertDevicesError,
  capAlertDevicesSuccess
} from 'actions/deviceActions'

function* getItems({ params }) {
  try {
    const response = yield call(deviceService.getItems, params)
    yield put({ type: types.GET_DEVICE_ITEMS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_ITEMS_ERROR, payload: error })
  }
}

function* getPreference() {
  try {
    const response = yield call(deviceService.getPreference)
    yield put({
      type: types.GET_DEVICE_PREFERENCE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_PREFERENCE_ERROR, payload: error })
  }
}

function* putPreference(action) {
  try {
    yield call(deviceService.putPreference, action.payload)
    yield put({ type: types.GET_DEVICE_PREFERENCE })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_PREFERENCE_ERROR, payload: error })
  }
}

function* getGroups(action) {
  try {
    const response = yield call(deviceService.getGroups, action.payload)
    yield put({ type: types.GET_DEVICE_GROUPS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_GROUPS_ERROR, payload: error })
  }
}

function* putItem(action) {
  try {
    const response = yield call(deviceService.putItem, action.payload)
    yield put({ type: types.PUT_DEVICE_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_ITEM_ERROR, payload: error })
  }
}

function* getItem(action) {
  try {
    const response = yield call(deviceService.getItem, action.payload)
    yield put({ type: types.GET_DEVICE_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_ITEMS_ERROR, payload: error })
  }
}

function* getPreview(action) {
  try {
    const response = yield call(deviceService.getPreview, action.payload)
    yield put({ type: types.GET_DEVICE_PREVIEW_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_PREVIEW_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(
      deviceService.getGroupItems,
      action.payload.id,
      action.payload.params
    )
    yield put({ type: types.GET_DEVICE_GROUP_ITEMS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    const response = yield call(deviceService.postGroupItem, action.payload)
    yield put({ type: types.POST_DEVICE_GROUP_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_DEVICE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    const response = yield call(deviceService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_DEVICE_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.DELETE_DEVICE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* getReboot(action) {
  try {
    const response = yield call(deviceService.getReboot, action.payload)
    yield put({ type: types.GET_DEVICE_REBOOT_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_REBOOT_ERROR, payload: error })
  }
}

function* putReboot(action) {
  try {
    const response = yield call(deviceService.putReboot, action.payload)
    yield put({ type: types.PUT_DEVICE_REBOOT_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_REBOOT_ERROR, payload: error })
  }
}

function* getSleepMode(action) {
  try {
    const response = yield call(deviceService.getSleepMode, action.payload)
    yield put({ type: types.GET_DEVICE_SLEEP_MODE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_SLEEP_MODE_ERROR, payload: error })
  }
}

function* putSleepMode(action) {
  try {
    const response = yield call(deviceService.putSleepMode, action.payload)
    yield put({ type: types.PUT_DEVICE_SLEEP_MODE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_SLEEP_MODE_ERROR, payload: error })
  }
}

function* getDeviceNotes({ id }) {
  try {
    const response = yield call(deviceService.getDeviceNotes, id)
    yield put({ type: types.GET_DEVICE_NOTES_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_NOTES_ERROR, payload: error })
  }
}

function* postDeviceNote({ id, data }) {
  try {
    const response = yield call(deviceService.postDeviceNote, id, data)
    yield put({ type: types.POST_DEVICE_NOTE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_DEVICE_NOTE_ERROR, payload: error })
  }
}

function* getCapAlertDevicesWorker() {
  try {
    const response = yield call(deviceService.getCapAlertDevices)
    yield put(capAlertDevicesSuccess(response))
  } catch (error) {
    yield put(capAlertDevicesError(error))
  }
}

export default {
  getItems,
  getPreference,
  putPreference,
  getGroups,
  putItem,
  getItem,
  getPreview,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getReboot,
  putReboot,
  getSleepMode,
  putSleepMode,
  getDeviceNotes,
  postDeviceNote,
  getCapAlertDevicesWorker
}
