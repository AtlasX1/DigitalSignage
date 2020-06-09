import api from './api'

import { errorHandler } from '../utils'

const buildSmartPlaylist = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/smartplaylist/build',
      data
    })

    return response.data
  } catch (e) {
    throw errorHandler(e)
  }
}

const postSmartPlaylist = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/smartplaylist',
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const putSmartPlaylist = async ({ id, data }) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/smartplaylist/${id}`,
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

export default {
  buildSmartPlaylist,
  postSmartPlaylist,
  putSmartPlaylist
}
