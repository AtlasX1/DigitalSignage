import * as types from './index'

const getDeviceItemsAction = params => ({
  type: types.GET_DEVICE_ITEMS,
  params
})

const getDeviceLibraryPrefAction = () => ({ type: types.GET_DEVICE_PREFERENCE })

const putDeviceLibraryPrefAction = data => ({
  type: types.PUT_DEVICE_PREFERENCE,
  payload: data
})

const getDeviceGroupsAction = (data = {}) => ({
  type: types.GET_DEVICE_GROUPS,
  payload: data
})

const clearGetDeviceGroupsInfoAction = () => ({
  type: types.CLEAR_GET_DEVICE_GROUPS_INFO
})

const putDeviceItemAction = data => ({
  type: types.PUT_DEVICE_ITEM,
  payload: data
})

const clearPutDeviceItemInfoAction = () => ({
  type: types.CLEAR_PUT_DEVICE_ITEM_INFO
})

const getDeviceItemAction = id => ({
  type: types.GET_DEVICE_ITEM,
  payload: id
})

const clearGetDeviceItemInfoAction = () => ({
  type: types.CLEAR_GET_DEVICE_ITEM_INFO
})

const getDevicePreviewAction = id => ({
  type: types.GET_DEVICE_PREVIEW,
  payload: id
})

const clearGetDevicePreviewInfoAction = () => ({
  type: types.CLEAR_GET_DEVICE_PREVIEW_INFO
})

const getDeviceGroupItemsAction = (id, params) => ({
  type: types.GET_DEVICE_GROUP_ITEMS,
  payload: { id, params }
})

const clearGetDeviceGroupItemsInfoAction = () => ({
  type: types.CLEAR_GET_DEVICE_GROUP_ITEMS_INFO
})

const postDeviceGroupItemAction = data => ({
  type: types.POST_DEVICE_GROUP_ITEM,
  payload: data
})

const clearPostDeviceGroupItemInfoAction = () => ({
  type: types.CLEAR_POST_DEVICE_GROUP_ITEM_INFO
})

const deleteDeviceGroupItemAction = data => ({
  type: types.DELETE_DEVICE_GROUP_ITEM,
  payload: data
})

const clearDeleteDeviceGroupItemInfoAction = () => ({
  type: types.CLEAR_DELETE_DEVICE_GROUP_ITEM_INFO
})

const clearDeviceGroupItemsInfo = () => ({
  type: types.CLEAR_DEVICE_GROUP_ITEMS_RESPONSE_INFO
})

const getDeviceReboot = id => ({
  type: types.GET_DEVICE_REBOOT,
  payload: id
})

const clearGetDeviceRebootInfo = () => ({
  type: types.CLEAR_GET_DEVICE_REBOOT_INFO
})

const putDeviceReboot = data => ({
  type: types.PUT_DEVICE_REBOOT,
  payload: data
})

const clearPutDeviceRebootInfo = () => ({
  type: types.CLEAR_PUT_DEVICE_REBOOT_INFO
})

const getDeviceSleepMode = id => ({
  type: types.GET_DEVICE_SLEEP_MODE,
  payload: id
})

const clearGetDeviceSleepModeInfo = () => ({
  type: types.CLEAR_GET_DEVICE_SLEEP_MODE_INFO
})

const putDeviceSleepMode = data => ({
  type: types.PUT_DEVICE_SLEEP_MODE,
  payload: data
})

const clearPutDeviceSleepModeInfo = () => ({
  type: types.CLEAR_PUT_DEVICE_SLEEP_MODE_INFO
})

const postDeviceNoteAction = (id, data) => ({
  type: types.POST_DEVICE_NOTE,
  data,
  id
})

const getDeviceNotesAction = id => ({
  type: types.GET_DEVICE_NOTES,
  id
})

export function getCapAlertDevices() {
  return {
    type: types.REQUEST_CAP_ALERT_DEVICES
  }
}

export function capAlertDevicesSuccess(data) {
  return {
    type: types.CAP_ALERT_DEVICES_SUCCESS,
    payload: data
  }
}

export function capAlertDevicesError(error) {
  return {
    type: types.CAP_ALERT_DEVICES_ERROR,
    payload: error
  }
}

export {
  getDeviceItemsAction,
  getDeviceLibraryPrefAction,
  putDeviceLibraryPrefAction,
  getDeviceGroupsAction,
  clearGetDeviceGroupsInfoAction,
  putDeviceItemAction,
  clearPutDeviceItemInfoAction,
  getDeviceItemAction,
  clearGetDeviceItemInfoAction,
  getDevicePreviewAction,
  clearGetDevicePreviewInfoAction,
  getDeviceGroupItemsAction,
  clearGetDeviceGroupItemsInfoAction,
  postDeviceGroupItemAction,
  clearPostDeviceGroupItemInfoAction,
  deleteDeviceGroupItemAction,
  clearDeleteDeviceGroupItemInfoAction,
  getDeviceReboot,
  clearGetDeviceRebootInfo,
  putDeviceReboot,
  clearPutDeviceRebootInfo,
  getDeviceSleepMode,
  clearGetDeviceSleepModeInfo,
  putDeviceSleepMode,
  clearPutDeviceSleepModeInfo,
  getDeviceNotesAction,
  postDeviceNoteAction,
  clearDeviceGroupItemsInfo
}
