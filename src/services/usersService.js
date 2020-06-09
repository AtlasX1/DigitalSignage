import api from './api'

import { errorHandler } from '../utils'

const getItems = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/user',
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
      url: '/user',
      data: data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getPreference = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity: 'UserLibrary'
      }
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putPreference = async data => {
  try {
    await api({
      method: 'PUT',
      url: '/preference/UserLibrary',
      data: {
        recordsPerPage: 10,
        gridColumn: data
      }
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteItem = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/user/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getItem = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/user/${id}`
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
      url: `/user/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroups = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/group',
      params: {
        limit: 99999,
        entity: 'user',
        ...params
      }
    })
    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getUngroupedUsers = async () => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/user/ungrouped'
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroupItems = async (id, params) => {
  try {
    const response = await api({
      method: 'GET',
      url: `/user/group/${id}`,
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postGroupItem = async ({ groupId, userId }) => {
  try {
    await api({
      method: 'POST',
      url: `/user/group/${groupId}`,
      data: { userId }
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteGroupItem = async ({ userId, groupId }) => {
  try {
    await api({
      method: 'DELETE',
      url: `/user/group/${groupId}/${userId}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getUsersPermission = async ({ id, entity }) => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/user/${id}/${entity}/permission`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putUsersPermission = async ({ id, data }) => {
  try {
    await api({
      method: 'PUT',
      url: `/user/${id}/permission`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getUsersGroupPermission = async ({ groupId, entity }) => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/user/group/${groupId}/${entity}/permission`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putUsersGroupPermission = async ({ groupId, data }) => {
  try {
    await api({
      method: 'PUT',
      url: `/user/group/${groupId}/permission`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getItems,
  postItem,
  getPreference,
  putPreference,
  deleteItem,
  getItem,
  putItem,
  getGroups,
  getUngroupedUsers,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getUsersPermission,
  putUsersPermission,
  getUsersGroupPermission,
  putUsersGroupPermission
}
