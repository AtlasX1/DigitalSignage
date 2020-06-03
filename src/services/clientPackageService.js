import api from './api'
import { errorHandler } from '../utils'

const getClientPackage = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/clientPackage',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getClientPackageById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/clientPackage/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postClientPackage = async data => {
  try {
    await api({
      method: 'POST',
      url: '/clientPackage',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const putClientPackage = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/clientPackage/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteClientPackage = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/clientPackage/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getClientPackage,
  getClientPackageById,
  postClientPackage,
  putClientPackage,
  deleteClientPackage
}
