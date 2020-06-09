import api from './api'

import { errorHandler } from '../utils'

const getClients = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/client',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postClient = async data => {
  try {
    return await api({
      method: 'POST',
      url: '/client',
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteClient = async id => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/client/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getClientById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/client/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putClient = async (id, data) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/client/${id}`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroupItems = async (id, params) => {
  try {
    const response = await api({
      method: 'GET',
      url: `/client/group/${id}`,
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postGroupItem = async ({ clientId, groupId }) => {
  try {
    const response = await api({
      method: 'POST',
      url: `/client/group/${groupId}`,
      data: { clientId }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteGroupItem = async ({ clientId, groupId }) => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/client/group/${groupId}/${clientId}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getClientNotes = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/client/${id}/note`
    })

    return {
      ...data,
      note: data.note.reverse()
    }
  } catch (error) {
    throw errorHandler(error)
  }
}

const postClientNote = async (id, data) => {
  try {
    const response = await api({
      method: 'POST',
      url: `/client/${id}/note`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getClients,
  getClientById,
  postClient,
  putClient,
  deleteClient,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getClientNotes,
  postClientNote
}
