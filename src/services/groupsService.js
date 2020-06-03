import api from './api'

import { errorHandler } from '../utils'

const getGroupByEntity = async (entity, params) => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/group',
      params: {
        ...params,
        entity
      }
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postGroup = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/group',
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteGroup = async id => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/group/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putGroup = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/group/${data.id}`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroupPermission = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/group/${id}/permission`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putGroupPermission = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/group/${data.id}/permission`,
      data: data.data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  postGroup,
  deleteGroup,
  putGroup,
  getGroupByEntity,
  getGroupPermission,
  putGroupPermission
}
