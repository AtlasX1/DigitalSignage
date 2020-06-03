import api from './api'

import { errorHandler } from '../utils'

const getBanners = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/banner',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postBanner = async data => {
  try {
    await api({
      method: 'POST',
      url: '/banner',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteBanner = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/banner/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getBannerById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/banner/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putBanner = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/banner/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getBanners,
  getBannerById,
  postBanner,
  putBanner,
  deleteBanner
}
