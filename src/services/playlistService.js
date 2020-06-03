import api from './api'

import { errorHandler } from '../utils'

const addPlaylist = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/playlist',
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const putPlaylistById = async ({ id, data }) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/playlist/${id}`,
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const deletePlaylistById = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/playlist/${id}`
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const deleteSelectedPlaylist = async ids => {
  try {
    await api({
      method: 'DELETE',
      url: `/playlist/bulk`,
      params: {
        ids: ids.join(',')
      }
    })
  } catch (e) {
    throw errorHandler(e)
  }
}
const clonePlaylist = async data => {
  try {
    await api({
      method: 'POST',
      url: `/playlist/clone`,
      data
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const getPlaylistById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/playlist/${id}`
    })

    return response.data
  } catch (e) {
    throw errorHandler(e)
  }
}

const getItems = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/playlist',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getPreference = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity: 'PlaylistLibrary'
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putPreference = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/preference/PlaylistLibrary',
      data: {
        recordsPerPage: 10,
        gridColumn: data
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroups = async params => {
  try {
    const response = await api({
      method: 'GET',
      url: '/group?entity=playlist',
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getGroupItems = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/playlist/group/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postGroupItem = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/playlist/group/${data.groupId}`,
      data: {
        playlistId: data.playlistId
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteGroupItem = async data => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/playlist/group/${data.groupId}/${data.playlistId}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  addPlaylist,
  putPlaylistById,
  getPlaylistById,
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  deletePlaylistById,
  deleteSelectedPlaylist,
  clonePlaylist
}
