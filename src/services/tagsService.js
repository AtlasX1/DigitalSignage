import api from './api'

import { errorHandler } from '../utils'

const getTags = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/tag',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postTag = async data => {
  try {
    await api({
      method: 'POST',
      url: '/tag',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteTag = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/tag/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getTagById = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/tag/${id}`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putTag = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/tag/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getTags,
  getTagById,
  postTag,
  putTag,
  deleteTag
}
