import api from './api'

import { errorHandler } from '../utils'

const getQuotes = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/quote?limit=20480'
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postQuote = async ({ data }) => {
  try {
    const response = await api({
      method: 'POST',
      url: '/quote',
      data
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getQuoteCategories = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: '/quoteCategory?limit=512'
    })
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}
export default {
  getQuotes,
  postQuote,
  getQuoteCategories
}
