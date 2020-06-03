import api from './api'

import { errorHandler } from '../utils'

const getInfo = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/dashboard'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putInfo = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/dashboard',
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getInfo,
  putInfo
}
