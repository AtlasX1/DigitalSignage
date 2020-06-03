import api from './api'
import { errorHandler } from '../utils'

const getBandwidthPackage = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/bandwidthPackage',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getBandwidthPackageById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/bandwidthPackage/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postBandwidthPackage = async data => {
  try {
    await api({
      method: 'POST',
      url: '/bandwidthPackage',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const putBandwidthPackage = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/bandwidthPackage/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteBandwidthPackage = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/bandwidthPackage/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getBandwidthPackage,
  getBandwidthPackageById,
  postBandwidthPackage,
  putBandwidthPackage,
  deleteBandwidthPackage
}
