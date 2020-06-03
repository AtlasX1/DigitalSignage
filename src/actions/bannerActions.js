import * as types from './index'

const getItems = params => ({
  type: types.GET_BANNERS,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_BANNER_RESPONSE_INFO
})

const getItemById = id => ({
  type: types.GET_BANNER_BY_ID,
  id
})

const postItem = data => {
  return {
    type: types.POST_BANNER,
    data
  }
}
const putItem = (id, data) => ({
  type: types.PUT_BANNER,
  id,
  data
})

const deleteItem = id => {
  return {
    type: types.DELETE_BANNER,
    id
  }
}

const deleteSelectedItems = ids => ({
  type: types.DELETE_SELECTED_BANNERS,
  ids
})

export {
  getItems,
  getItemById,
  postItem,
  putItem,
  deleteItem,
  clearResponseInfo,
  deleteSelectedItems
}
