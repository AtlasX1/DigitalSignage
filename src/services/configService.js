import api from './api'

import { errorHandler } from '../utils'

const getConfigOrgRole = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/org/role'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigEnterpriseRole = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/enterprise/role'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigSystemRole = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/system/role'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigClientType = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/client/type'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigDeviceType = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/device/type'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigFeatureClient = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/feature/client'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigFeatureDevice = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/feature/device'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigFeatureMedia = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/feature/media'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getConfigMediaCategory = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/mediaCategory'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getThemeOfMediaFeatureById = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/config/mediaFeature/${id}/theme`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getContentSourceOfMediaFeatureById = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/config/mediaFeature/${id}/contentSource`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getMediaCategory = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/config/mediaCategory'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getLocation = async params => {
  try {
    const response = await api({
      method: 'GET',
      url: `/config/city`,
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getTransitions = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/config/transition'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getAlertTypes = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/config/alertType'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getAirports = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/airport',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getAirlines = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/config/airline',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getLocationInfo = async location => {
  try {
    return await api({
      method: 'POST',
      url: '/locationInfo',
      data: {
        location
      }
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getBackgroundPattern = async () => {
  try {
    return await api({
      method: 'GET',
      url: '/config/backgroundPattern'
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getMediaGroups = async () => {
  try {
    return await api({
      method: 'GET',
      url: '/config/feature/media?includeAll=1'
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getBackgroundImagesFromMedia = async () => {
  try {
    return await api({
      method: 'GET',
      url: '/config/feature/media?includeAll=1'
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getMediaCategory,
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
  getTransitions,
  getAirports,
  getAirlines,
  getAlertTypes,
  getLocationInfo,
  getBackgroundPattern,
  getBackgroundImagesFromMedia,
  getMediaGroups
}
