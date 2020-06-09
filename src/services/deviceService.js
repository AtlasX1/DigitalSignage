import api from './api'
import { errorHandler } from '../utils'

const getItems = async params => {
  try {
    const response = await api({
      method: 'GET',
      url: '/device',
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getItem = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

// Add device is not implemented on backend yet
const addDeviceLibraryItem = async request => {
  try {
    const { deviceId } = request

    const response = await api({
      method: 'POST',
      url: `/device/${deviceId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const setDeviceLibraryItem = async request => {
  try {
    const { deviceId } = request

    const response = await api({
      method: 'PUT',
      url: `/device/${deviceId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDeviceGroupItems = async request => {
  try {
    const { groupId, deviceId } = request

    const response = await api({
      method: 'DELETE',
      url: `/device/group/${groupId}/${deviceId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const getDeviceReboot = async request => {
  try {
    const { deviceId } = request

    const response = await api({
      method: 'GET',
      url: `/device/${deviceId}/reboot`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const getPreference = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity: 'DeviceLibrary'
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putPreference = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/preference/DeviceLibrary',
      data: {
        recordsPerPage: 10,
        gridColumn: data
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroups = async data => {
  try {
    const response = await api({
      method: 'GET',
      url: `/group?entity=device${data.title ? '&title=' + data.title : ''}${
        data.limit ? '&limit=' + data.limit : ''
      }`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putItem = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/device/${data.id}`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getPreview = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/preview`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroupItems = async (id, params) => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/group/${id}`,
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postGroupItem = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/device/group/${data.groupId}`,
      data: {
        deviceId: data.deviceId
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteGroupItem = async data => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/device/group/${data.groupId}/${data.deviceId}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getReboot = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/reboot`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putReboot = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/device/${data.id}/reboot`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getSleepMode = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/sleepMode`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putSleepMode = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/device/${data.id}/sleepMode`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getDeviceNotes = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/note`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postDeviceNote = async (id, data) => {
  try {
    const response = await api({
      method: 'POST',
      url: `/device/${id}/note`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

async function getCapAlertDevices() {
  try {
    const response = await api({
      method: 'GET',
      url: '/capAlert/device'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getItem,
  getItems,
  getDeviceReboot,
  addDeviceLibraryItem,
  setDeviceLibraryItem,
  deleteDeviceGroupItems,
  getPreference,
  putPreference,
  getGroups,
  putItem,
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
  getCapAlertDevices
}
