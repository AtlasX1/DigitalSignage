import api from './api'

const getSettings = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/setting'
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const putSettings = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/setting',
      data
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  getSettings,
  putSettings
}
