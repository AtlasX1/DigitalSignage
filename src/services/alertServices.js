import api from './api'

import { errorHandler } from '../utils'

const getAlertDevicesById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/alert/${id}/device`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postAlertTrigger = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/alert/${data.id}/trigger`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getDeviceMediaEmergencyAlert = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/media/emergencyAlert`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putDeviceMediaEmergencyAlert = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/device/${data.deviceId}/media/emergencyAlert/${data.alertId}`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getDeviceMediaCapAlert = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/device/${id}/media/capAlert`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putDeviceMediaCapAlert = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/device/${data.deviceId}/media/capAlert`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const disableAlert = async () => {
  try {
    const response = await api({
      method: 'POST',
      url: '/alert/disable'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const disableDeviceAlert = async deviceId => {
  try {
    const response = await api({
      method: 'POST',
      url: `/device/${deviceId}/alert/disable`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

async function associateCapAlert({ mediaId, deviceId, password }) {
  try {
    const response = await api({
      method: 'PUT',
      url: '/capAlert/device',
      data: {
        mediaId,
        deviceId,
        password
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
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
  disableDeviceAlert,
  associateCapAlert
}
