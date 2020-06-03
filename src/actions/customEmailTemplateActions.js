import * as types from './index'

const getItems = params => ({
  type: types.GET_CUSTOM_EMAIL_TEMPLATES,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_CUSTOM_EMAIL_TEMPLATE_RESPONSE_INFO
})

const getItemById = id => ({
  type: types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID,
  id
})

const putItem = (id, data) => ({
  type: types.PUT_CUSTOM_EMAIL_TEMPLATE,
  id,
  data
})

const postItem = data => ({
  type: types.POST_CUSTOM_EMAIL_TEMPLATE,
  data
})

export { getItems, getItemById, putItem, postItem, clearResponseInfo }
