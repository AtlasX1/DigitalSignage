import api from './api'
import { errorHandler } from '../utils'

const getEmailTemplates = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/emailTemplate',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getEmailTemplateById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/emailTemplate/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putEmailTemplate = async (id, data) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/emailTemplate/${id}`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getEmailTemplates,
  getEmailTemplateById,
  putEmailTemplate
}
