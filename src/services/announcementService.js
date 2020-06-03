import api from './api'

import { errorHandler } from '../utils'

const getAnnouncements = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/announcement`,
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postAnnouncement = async data => {
  try {
    await api({
      method: 'POST',
      url: '/announcement',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteAnnouncement = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/announcement/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getAnnouncement = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/announcement/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putAnnouncement = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/announcement/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  putAnnouncement
}
