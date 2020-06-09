import * as types from './index'

const getItems = params => ({
  type: types.GET_CLIENTS,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_CLIENT_RESPONSE_INFO
})

const getItem = id => ({
  type: types.GET_CLIENT_BY_ID,
  id
})

const postItem = data => {
  return {
    type: types.POST_CLIENT,
    data
  }
}
const putItem = (id, data) => ({
  type: types.PUT_CLIENT,
  id,
  data
})

const getClientGroupItems = (id, params) => ({
  type: types.GET_CLIENT_GROUP_ITEMS,
  payload: { id, params }
})

const postClientGroupItem = data => ({
  type: types.POST_CLIENT_GROUP_ITEM,
  payload: data
})

const deleteClientGroupItem = data => ({
  type: types.DELETE_CLIENT_GROUP_ITEM,
  payload: data
})

const clearClientGroupItemsInfo = () => ({
  type: types.CLEAR_CLIENT_GROUP_ITEMS_RESPONSE_INFO
})

const clearGetClientsGroupItemsInfo = () => ({
  type: types.CLEAR_GET_CLIENTS_GROUP_ITEMS_INFO
})

const getClientNotes = id => ({
  type: types.GET_CLIENT_NOTES,
  payload: id
})

const postClientNote = ({ id, message }) => ({
  type: types.POST_CLIENT_NOTE,
  payload: {
    id,
    data: { message }
  }
})

const clearGetClientNoteInfo = () => ({
  type: types.CLEAR_GET_CLIENT_NOTE_INFO
})

const clearPostClientNoteInfo = () => ({
  type: types.CLEAR_POST_CLIENT_NOTE_INFO
})

export {
  getItems,
  getItem,
  postItem,
  putItem,
  clearResponseInfo,
  getClientGroupItems,
  postClientGroupItem,
  deleteClientGroupItem,
  clearClientGroupItemsInfo,
  getClientNotes,
  postClientNote,
  clearGetClientNoteInfo,
  clearPostClientNoteInfo,
  clearGetClientsGroupItemsInfo
}
