import api from 'services/api'
import { errorHandler } from 'utils'

const getPreferenceByEntity = async entity => {
  try {
    const { data } = await api({
      method: 'GET',
      url: '/preference',
      params: {
        entity
      }
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putPreferenceByEntity = async (entity, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/preference/${entity}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getPreferenceByEntity,
  putPreferenceByEntity
}
