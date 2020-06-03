import api from './api'

import { errorHandler } from 'utils/index'

const getWhiteLabel = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/info'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getWhiteLabel
}
