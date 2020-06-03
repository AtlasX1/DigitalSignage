import api from './api'

import { errorHandler } from '../utils'

const getWorkplacePosters = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/workplacePoster`,
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postWorkplacePoster = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/workplacePoster',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteWorkplacePoster = async id => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/workplacePoster/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getWorkplacePoster = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/workplacePoster/${id}`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putWorkplacePoster = async (id, data) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/workplacePoster/${id}`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getWorkplacePostersTags = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/workplacePosterTag',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postWorkplacePosterTag = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/workplacePosterTag',
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteWorkplacePosterTag = async id => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/workplacePosterTag/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getWorkplacePosters,
  postWorkplacePoster,
  deleteWorkplacePoster,
  getWorkplacePoster,
  putWorkplacePoster,
  getWorkplacePostersTags,
  postWorkplacePosterTag,
  deleteWorkplacePosterTag
}
