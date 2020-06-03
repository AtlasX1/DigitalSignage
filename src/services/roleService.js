import { errorHandler } from '../utils'
import api from './api'

const getRoles = async data => {
  try {
    const response = await api({
      method: 'GET',
      url: `/role?limit=100&level=${data}`
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getRoleById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/role/${id}`
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postRole = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/role',
      data
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putRoleById = async (id, data) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/role/${id}`,
      data
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getRolePermissionById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/role/${id}/permission`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putRolePermissionById = async (id, data) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/role/${id}/permission`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getRoles,
  getRoleById,
  postRole,
  putRoleById,
  getRolePermissionById,
  putRolePermissionById
}
