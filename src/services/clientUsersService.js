import api from './api'

import { errorHandler } from '../utils'

const getItems = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/client/user',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postItem = async data => {
  try {
    await api({
      method: 'POST',
      url: '/client/user',
      data: data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteItem = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/client/user/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getItem = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/client/user/${id}`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putItem = async (id, data) => {
  try {
    await api({
      method: 'POST',
      url: `/client/user/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getItems,
  postItem,
  deleteItem,
  getItem,
  putItem
}
