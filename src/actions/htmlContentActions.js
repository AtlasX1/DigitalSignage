import * as types from './index'

const getItems = params => ({
  type: types.GET_HTML_CONTENTS,
  params
})

const postItem = data => ({
  type: types.POST_HTML_CONTENT,
  data
})

const deleteItem = id => ({
  type: types.DELETE_HTML_CONTENT,
  id
})

const getItemById = id => ({
  type: types.GET_HTML_CONTENT_BY_ID,
  id
})

const putItem = (id, data) => ({
  type: types.PUT_HTML_CONTENT,
  id,
  data
})

const clearResponseInfo = () => ({
  type: types.CLEAR_HTML_CONTENT_RESPONSE_INFO
})

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_HTML_CONTENTS,
  ids
})

export {
  getItems,
  postItem,
  deleteItem,
  getItemById,
  putItem,
  clearResponseInfo,
  deleteSelectedItems
}
