import api from './api'
import { errorHandler } from '../utils'

const getCustomEmailTemplates = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/customEmailTemplate',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getCustomEmailTemplateById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/customEmailTemplate/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putCustomEmailTemplate = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/customEmailTemplate/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const postCustomEmailTemplate = async data => {
  try {
    await api({
      method: 'POST',
      url: `/customEmailTemplate`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getCustomEmailTemplates,
  getCustomEmailTemplateById,
  putCustomEmailTemplate,
  postCustomEmailTemplate
}
