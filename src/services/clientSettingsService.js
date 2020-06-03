import api from './api'

import { errorHandler } from '../utils'

const getClientSettings = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/client/setting'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putClientSettings = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/client/setting',
      data: data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getClientSettings,
  putClientSettings
}
