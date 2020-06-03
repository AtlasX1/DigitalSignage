import * as types from './index'

const getItems = params => ({
  type: types.GET_ANNOUNCEMENTS,
  params
})

const postItem = data => ({
  type: types.POST_ANNOUNCEMENT,
  data
})
const deleteItem = id => ({
  type: types.DELETE_ANNOUNCEMENT,
  id
})

const getItemById = id => ({
  type: types.GET_ANNOUNCEMENT,
  id
})

const putItem = (id, data) => ({
  type: types.PUT_ANNOUNCEMENT,
  id,
  data
})

const clearResponseInfo = () => ({
  type: types.CLEAR_ANNOUNCEMENTS_RESPONSE_INFO
})

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_ANNOUNCEMENT,
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
