import * as types from './index'

const getItems = params => ({
  type: types.GET_TAGS,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_TAG_RESPONSE_INFO
})

const getItemById = id => ({
  type: types.GET_TAG_BY_ID,
  id
})

const postItem = data => {
  return {
    type: types.POST_TAG,
    data
  }
}
const putItem = (id, data) => ({
  type: types.PUT_TAG,
  id,
  data
})

const deleteItem = id => {
  return {
    type: types.DELETE_TAG,
    id
  }
}

const deleteSelectedItems = ids => {
  return {
    type: types.DELETE_SELECTED_TAGS,
    ids
  }
}

export {
  getItems,
  postItem,
  putItem,
  deleteItem,
  getItemById,
  clearResponseInfo,
  deleteSelectedItems
}
