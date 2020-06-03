import axios from 'axios'
import * as config from '../config'

import api from './api'

import { errorHandler } from '../utils'

const googleApi = 'https://www.googleapis.com/webfonts/v1/webfonts?key='

const fetchFonts = async () => {
  try {
    const response = await axios.get(
      `${googleApi}${config.GOOGLE_FONTS_API_KEY}`
    )
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const saveFonts = addedFonts => {
  try {
    // TODO Implement save request
  } catch (error) {
    throw new Error(error)
  }
}

const getFonts = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/font'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteFont = async id => {
  try {
    const response = await api({
      method: 'DELETE',
      url: `/font/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postFont = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/font',
      data: data
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  fetchFonts,
  saveFonts,
  deleteFont,
  getFonts,
  postFont
}
