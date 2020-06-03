import api from './api'

import { errorHandler } from '../utils'

const getMediaLibraryItems = async params => {
  try {
    const response = await api({
      method: 'GET',
      url: '/media',
      params
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteMediaLibraryItem = async request => {
  try {
    const { mediaId } = request

    const response = await api({
      method: 'DELETE',
      url: `/media/${mediaId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const getMediaGroupItems = async request => {
  try {
    const { groupId } = request

    const response = await api({
      method: 'GET',
      url: `/media/group/${groupId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const setMediaGroupItems = async request => {
  try {
    const { groupId, mediaId } = request

    const response = await api({
      method: 'POST',
      url: `/media/group/${groupId}`,
      data: {
        mediaId
      }
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const deleteMediaGroupItems = async request => {
  try {
    const { groupId, mediaId } = request

    const response = await api({
      method: 'DELETE',
      url: `/media/group/${groupId}/${mediaId}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const getMediaLibraryPref = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity: 'MediaLibrary'
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putMediaLibraryPref = async data => {
  try {
    const response = await api({
      method: 'PUT',
      url: '/preference/MediaLibrary',
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

const getGroups = async data => {
  const params = data.limit ? '&limit=' + data.limit : ''
  try {
    const response = await api({
      method: 'GET',
      url: `/group?entity=media${params}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const addMedia = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/media`,
      data
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
      url: `/media/group/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getMediaPreview = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/media/preview/${id}`,
      responseType: 'text'
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
      url: `/media/group/${data.groupId}`,
      data: {
        mediaId: data.mediaId
      }
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const generateMediaPreview = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/media/preview`,
      data,
      responseType: 'text'
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
      url: `/media/group/${data.groupId}/${data.mediaId}`
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getMediaItemById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/media/${id}`
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putMediaItemById = async ({ id, data, method }) => {
  try {
    const response = await api({
      method: method ? method : 'PUT',
      url: `/media/${id}`,
      data
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getFeatureMediaItems = async data => {
  try {
    const response = await api({
      method: 'GET',
      url: `/feature/media`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getMediaLibraryPref,
  getMediaLibraryItems,
  getMediaGroupItems,
  putMediaLibraryPref,
  deleteMediaGroupItems,
  deleteMediaLibraryItem,
  setMediaGroupItems,
  getGroups,
  addMedia,
  getMediaPreview,
  generateMediaPreview,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getMediaItemById,
  putMediaItemById,
  getFeatureMediaItems
}
