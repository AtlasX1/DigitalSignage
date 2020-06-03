import api from './api'

import { errorHandler } from '../utils'

const postTemplate = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: `/template`,
      data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getTemplate = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/template/${id}`
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const editTemplate = async ({ id, data }) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/template/${id}`,
      data
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getItems = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/template',
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
        entity: 'TemplateLibrary'
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
      url: '/preference/TemplateLibrary',
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

const getGroups = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/group?entity=template'
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
      url: `/template/group/${id}`
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
      url: `/template/group/${data.groupId}`,
      data: {
        templateId: data.templateId
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(data)
  }
}

const deleteGroupItem = async data => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/template/group/${data.groupId}/${data.templateId}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const cloneTemplate = async data => {
  try {
    await api({
      method: 'POST',
      url: `/template/clone`,
      data
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const deleteTemplateById = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/template/${id}`
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const deleteSelectedTemplate = async ids => {
  try {
    await api({
      method: 'DELETE',
      url: `/template/bulk`,
      params: {
        ids: ids.join(',')
      }
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

export default {
  postTemplate,
  getTemplate,
  editTemplate,
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  cloneTemplate,
  deleteSelectedTemplate,
  deleteTemplateById
}
