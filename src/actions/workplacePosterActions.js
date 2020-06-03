import * as types from './index'

const getItems = params => ({
  type: types.GET_WORKPLACE_POSTERS,
  params
})

const postItem = data => ({
  type: types.POST_WORKPLACE_POSTER,
  data
})
const deleteItem = id => ({
  type: types.DELETE_WORKPLACE_POSTER,
  id
})

const getItemById = id => ({
  type: types.GET_WORKPLACE_POSTER,
  id
})

const putItem = (id, data) => ({
  type: types.PUT_WORKPLACE_POSTER,
  id,
  data
})

const clearResponseInfo = () => ({
  type: types.CLEAR_WORKPLACE_POSTERS_RESPONSE_INFO
})

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_WORKPLACE_POSTER,
  ids
})

const getTags = params => ({
  type: types.GET_WORKPLACE_POSTERS_TAGS,
  params
})
const postTag = data => ({
  type: types.POST_WORKPLACE_POSTER_TAG,
  data
})
const deleteTag = id => ({
  type: types.DELETE_WORKPLACE_POSTER_TAG,
  id
})

export {
  getItems,
  postItem,
  deleteItem,
  getItemById,
  putItem,
  clearResponseInfo,
  deleteSelectedItems,
  getTags,
  postTag,
  deleteTag
}
