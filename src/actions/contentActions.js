import * as types from './index'

const getContentsByFeature = (feature, params) => ({
  type: types.GET_CONTENTS_BY_FEATURE,
  feature,
  params
})
const getContentById = id => ({
  type: types.GET_CONTENT_BY_ID,
  id
})
const putContent = (id, data) => ({
  type: types.PUT_CONTENT,
  id,
  data
})
const deleteContent = id => ({
  type: types.DELETE_CONTENT,
  id
})
const deleteSelectedContent = ids => ({
  type: types.DELETE_SELECTED_CONTENT,
  ids
})
const postContentIntoFeature = (feature, data) => ({
  type: types.POST_CONTENT_INTO_FEATURE,
  data,
  feature
})
const clearContentResponseInfo = () => ({
  type: types.CLEAR_CONTENT_RESPONSE_INFO
})
export {
  getContentsByFeature,
  getContentById,
  putContent,
  deleteContent,
  deleteSelectedContent,
  postContentIntoFeature,
  clearContentResponseInfo
}
