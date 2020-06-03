import api from './api'
import { errorHandler } from '../utils'

const getHTMLContents = async params => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/HTMLContent`,
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postHTMLContent = async data => {
  try {
    await api({
      method: 'POST',
      url: '/HTMLContent',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteHTMLContent = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/HTMLContent/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getHTMLContent = async id => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/HTMLContent/${id}`
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putHTMLContent = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/HTMLContent/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getHTMLContents,
  postHTMLContent,
  deleteHTMLContent,
  getHTMLContent,
  putHTMLContent
}
