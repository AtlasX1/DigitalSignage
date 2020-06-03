import api from './api'
import { errorHandler } from '../utils'

const getDevicePackage = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/devicePackage',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getDevicePackageById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/devicePackage/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postDevicePackage = async data => {
  try {
    await api({
      method: 'POST',
      url: '/devicePackage',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const putDevicePackage = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/devicePackage/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteDevicePackage = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/devicePackage/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getDevicePackage,
  getDevicePackageById,
  postDevicePackage,
  putDevicePackage,
  deleteDevicePackage
}
