import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  alertDevices: {},
  postAlertTrigger: {},
  deviceMediaEmergencyAlert: {},
  putDeviceMediaEmergencyAlert: {},
  deviceMediaCapAlert: {},
  putDeviceMediaCapAlert: {},
  disableAlert: {},
  disableDeviceAlert: {
    response: {},
    error: {}
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ALERT_DEVICES_BY_ID_SUCCESS:
      return update(state, {
        alertDevices: {
          response: { $set: action.payload }
        }
      })
    case types.GET_ALERT_DEVICES_BY_ID_ERROR:
      return update(state, {
        alertDevices: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_ALERT_DEVICES_BY_ID_INFO:
      return update(state, {
        alertDevices: { $set: {} }
      })
    case types.POST_ALERT_TRIGGER_SUCCESS:
      return update(state, {
        postAlertTrigger: {
          response: { $set: action.payload }
        }
      })
    case types.POST_ALERT_TRIGGER_ERROR:
      return update(state, {
        postAlertTrigger: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_ALERT_TRIGGER_INFO:
      return update(state, {
        postAlertTrigger: { $set: {} }
      })
    case types.GET_DEVICE_MEDIA_EMERGENCY_ALERT_SUCCESS:
      return update(state, {
        deviceMediaEmergencyAlert: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_MEDIA_EMERGENCY_ALERT_ERROR:
      return update(state, {
        deviceMediaEmergencyAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_MEDIA_EMERGENCY_ALERT_INFO:
      return update(state, {
        deviceMediaEmergencyAlert: { $set: {} }
      })
    case types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT_SUCCESS:
      return update(state, {
        putDeviceMediaEmergencyAlert: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT_ERROR:
      return update(state, {
        putDeviceMediaEmergencyAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_DEVICE_MEDIA_EMERGENCY_ALERT_INFO:
      return update(state, {
        putDeviceMediaEmergencyAlert: { $set: {} }
      })
    case types.GET_DEVICE_MEDIA_CAP_ALERT_SUCCESS:
      return update(state, {
        deviceMediaCapAlert: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_MEDIA_CAP_ALERT_ERROR:
      return update(state, {
        deviceMediaCapAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_MEDIA_CAP_ALERT_INFO:
      return update(state, {
        deviceMediaCapAlert: { $set: {} }
      })
    case types.PUT_DEVICE_MEDIA_CAP_ALERT_SUCCESS:
      return update(state, {
        putDeviceMediaCapAlert: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_MEDIA_CAP_ALERT_ERROR:
      return update(state, {
        putDeviceMediaCapAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_DEVICE_MEDIA_CAP_ALERT_INFO:
      return update(state, {
        putDeviceMediaCapAlert: { $set: {} }
      })
    case types.DISABLE_ALERT_SUCCESS:
      return update(state, {
        disableAlert: {
          response: { $set: action.payload }
        }
      })
    case types.DISABLE_ALERT_ERROR:
      return update(state, {
        disableAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DISABLE_ALERT_INFO:
      return update(state, {
        disableAlert: { $set: {} }
      })
    case types.DISABLE_DEVICE_ALERT_SUCCESS:
      return update(state, {
        disableDeviceAlert: {
          response: { $set: action.payload }
        }
      })
    case types.DISABLE_DEVICE_ALERT_ERROR:
      return update(state, {
        disableDeviceAlert: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DISABLE_DEVICE_ALERT_INFO:
      return update(state, {
        $merge: {
          disableDeviceAlert: {
            response: {},
            error: {}
          }
        }
      })
    default:
      return state
  }
}
