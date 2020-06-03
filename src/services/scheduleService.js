import api from './api'

import { errorHandler } from '../utils'

const getItems = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/schedule',
      params
    })

    return data
  } catch (error) {
    throw errorHandler(getItems)
  }
}

const getPreference = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity: 'ScheduleLibrary'
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
      url: '/preference/ScheduleLibrary',
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
      url: '/group?entity=schedule'
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
      url: `/schedule/group/${id}`
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
      url: `/schedule/group/${data.groupId}`,
      data: {
        scheduleId: data.scheduleId
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
      url: `/schedule/group/${data.groupId}/${data.scheduleId}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const cloneSchedule = async data => {
  try {
    await api({
      method: 'POST',
      url: `/schedule/clone`,
      data
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const deleteSelectedSchedules = async ids => {
  try {
    await api({
      method: 'DELETE',
      url: `/schedule/bulk`,
      params: {
        ids: ids.join(',')
      }
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

const deleteScheduleById = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/schedule/${id}`
    })
  } catch (e) {
    throw errorHandler(e)
  }
}

export default {
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  cloneSchedule,
  deleteSelectedSchedules,
  deleteScheduleById
}
