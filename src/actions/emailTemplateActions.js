import * as types from './index'

const getItems = params => ({
  type: types.GET_EMAIL_TEMPLATES,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_EMAIL_TEMPLATE_RESPONSE_INFO
})

const getItemById = id => ({
  type: types.GET_EMAIL_TEMPLATE_BY_ID,
  id
})

const putItem = (id, data) => ({
  type: types.PUT_EMAIL_TEMPLATE,
  id,
  data
})

export { getItems, getItemById, putItem, clearResponseInfo }
