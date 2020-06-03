import api from './api'

import { errorHandler } from '../utils'
import transformPermissions from '../utils/transformPermissions'

const getDetails = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/me'
    })

    const permissions = transformPermissions(response.data.role.permission)
    return { ...response.data, permissions }
  } catch (error) {
    throw errorHandler(error)
  }
}

const putDetails = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/me',
      data: data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getDetails,
  putDetails
}
