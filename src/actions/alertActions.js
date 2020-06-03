import * as types from './index'

const getAlertDevicesByIdAction = id => ({
  type: types.GET_ALERT_DEVICES_BY_ID,
  payload: id
})

const clearGetAlertDevicesByIdInfoAction = () => ({
  type: types.CLEAR_GET_ALERT_DEVICES_BY_ID_INFO
})

const postAlertTriggerAction = data => ({
  type: types.POST_ALERT_TRIGGER,
  payload: data
})

const clearPostAlertTriggerInfoAction = () => ({
  type: types.CLEAR_POST_ALERT_TRIGGER_INFO
})

const getDeviceMediaEmergencyAlert = id => ({
  type: types.GET_DEVICE_MEDIA_EMERGENCY_ALERT,
  payload: id
})

const clearGetDeviceMediaEmergencyAlertInfo = () => ({
  type: types.CLEAR_GET_DEVICE_MEDIA_EMERGENCY_ALERT_INFO
})

const putDeviceMediaEmergencyAlertAction = data => ({
  type: types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT,
  payload: data
})

const clearPutDeviceMediaEmergencyAlertInfoAction = () => ({
  type: types.CLEAR_PUT_DEVICE_MEDIA_EMERGENCY_ALERT_INFO
})

const getDeviceMediaCapAlertAction = id => ({
  type: types.GET_DEVICE_MEDIA_CAP_ALERT,
  payload: id
})

const clearGetDeviceMediaCapAlertInfoAction = () => ({
  type: types.CLEAR_GET_DEVICE_MEDIA_CAP_ALERT_INFO
})

const putDeviceMediaCapAlertAction = data => ({
  type: types.PUT_DEVICE_MEDIA_CAP_ALERT,
  payload: data
})

const clearPutDeviceMediaCapAlertInfoAction = () => ({
  type: types.CLEAR_PUT_DEVICE_MEDIA_CAP_ALERT_INFO
})

const disableAlertAction = () => ({
  type: types.DISABLE_ALERT
})

const clearDisableAlertInfoAction = () => ({
  type: types.CLEAR_DISABLE_ALERT_INFO
})

const disableDeviceAlertAction = deviceId => ({
  type: types.DISABLE_DEVICE_ALERT,
  payload: deviceId
})

const clearDisableDeviceAlertInfoAction = () => ({
  type: types.CLEAR_DISABLE_DEVICE_ALERT_INFO
})

export {
  getAlertDevicesByIdAction,
  clearGetAlertDevicesByIdInfoAction,
  postAlertTriggerAction,
  clearPostAlertTriggerInfoAction,
  getDeviceMediaEmergencyAlert,
  clearGetDeviceMediaEmergencyAlertInfo,
  putDeviceMediaEmergencyAlertAction,
  clearPutDeviceMediaEmergencyAlertInfoAction,
  getDeviceMediaCapAlertAction,
  clearGetDeviceMediaCapAlertInfoAction,
  putDeviceMediaCapAlertAction,
  clearPutDeviceMediaCapAlertInfoAction,
  disableAlertAction,
  clearDisableAlertInfoAction,
  disableDeviceAlertAction,
  clearDisableDeviceAlertInfoAction
}
