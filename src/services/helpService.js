import api from './api'
import { errorHandler } from '../utils'

const getHelps = async params => {
  try {
    const response = await api({
      method: 'GET',
      url: '/help',
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putHelp = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/help/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getHelps,
  putHelp
}
