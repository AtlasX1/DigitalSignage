import * as types from './index'

const getCategoriesByFeature = (feature, params) => ({
  type: types.GET_CATEGORIES_BY_FEATURE,
  feature,
  params
})
const getCategoryById = id => ({
  type: types.GET_CATEGORY_BY_ID,
  id
})
const putCategory = (id, data) => ({
  type: types.PUT_CATEGORY,
  id,
  data
})
const deleteCategory = id => ({
  type: types.DELETE_CATEGORY,
  id
})
const postCategoryIntoFeature = (feature, data) => ({
  type: types.POST_CATEGORY_INTO_FEATURE,
  data,
  feature
})
const clearCategoryResponseInfo = () => ({
  type: types.CLEAR_CATEGORY_RESPONSE_INFO
})
export {
  getCategoriesByFeature,
  getCategoryById,
  putCategory,
  deleteCategory,
  postCategoryIntoFeature,
  clearCategoryResponseInfo
}
