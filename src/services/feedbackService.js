import api from './api'

import { errorHandler } from '../utils'

const postInfo = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/feedback',
      data: data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  postInfo
}
