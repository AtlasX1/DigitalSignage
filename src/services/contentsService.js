import api from './api'
import { errorHandler } from '../utils'

const getContentsByFeature = async (feature, params) => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/feature/${feature}/content`,
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postContentIntoFeature = async (feature, data) => {
  try {
    await api({
      method: 'POST',
      url: `/feature/${feature}/content`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getContentById = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/feature/content/${id}`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putContent = async (id, data) => {
  try {
    await api({
      method: 'POST',
      url: `/feature/content/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteContent = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/feature/content/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getContentsByFeature,
  postContentIntoFeature,
  getContentById,
  putContent,
  deleteContent
}
