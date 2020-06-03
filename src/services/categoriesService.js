import api from './api'
import { errorHandler } from '../utils'

const getCategoriesByFeature = async (feature, params) => {
  try {
    const { data } = await api({
      method: 'GET',
      url: `/feature/${feature}/category`,
      params
    })

    return data
  } catch (error) {
    throw errorHandler(error)
  }
}

const postCategoryIntoFeature = async (feature, data) => {
  try {
    await api({
      method: 'POST',
      url: `/feature/${feature}/category`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const getCategoryById = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/feature/category/${id}`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const putCategory = async (id, data) => {
  try {
    await api({
      method: 'PUT',
      url: `/feature/category/${id}`,
      data
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

const deleteCategory = async id => {
  try {
    await api({
      method: 'DELETE',
      url: `/feature/category/${id}`
    })
  } catch (error) {
    throw errorHandler(error)
  }
}

export default {
  getCategoriesByFeature,
  postCategoryIntoFeature,
  getCategoryById,
  putCategory,
  deleteCategory
}
