import { errorHandler } from '../utils'
import api from './ipApi'

const getIp = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/',
      params: {
        format: 'json'
      }
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getIp
}
