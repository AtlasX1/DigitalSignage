import api from './api'

import { errorHandler } from '../utils'

//TODO: This is mock URLs,need to change on real once it will be ready on BE

const postDesignGallery = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/design-gallery',
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const putDesignGallery = async ({ id, data }) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/design-gallery/${id}`,
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const getDesignGallery = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/design-gallery/${id}`
    })

    return response.data
  } catch (e) {
    throw errorHandler(e)
  }
}

export default {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery
}
