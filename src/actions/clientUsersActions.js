import * as types from './index'

const getItems = params => ({ type: types.GET_CLIENT_USERS_ITEMS, params })

const postItem = data => ({
  type: types.POST_CLIENT_USERS_ITEM,
  payload: data
})

const deleteItem = id => ({
  type: types.DELETE_CLIENT_USERS_ITEM,
  payload: id
})

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_CLIENT_USERS,
  ids
})

const getItem = id => ({
  type: types.GET_CLIENT_USERS_ITEM,
  payload: id
})

const putItem = (id, data) => ({
  type: types.PUT_CLIENT_USERS_ITEM,
  id,
  data
})

const clearResponseInfo = () => ({
  type: types.CLEAR_CLIENT_USERS_RESPONSE_INFO
})

export {
  getItems,
  postItem,
  deleteItem,
  getItem,
  putItem,
  deleteSelectedItems,
  clearResponseInfo
}
