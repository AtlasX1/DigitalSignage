import * as types from './index'

const getItems = params => ({
  type: types.GET_HELPS,
  params
})

const clearResponseInfo = () => ({
  type: types.CLEAR_HELP_RESPONSE_INFO
})

const putItem = (id, data) => ({ type: types.PUT_HELP, id, data })

export { putItem, getItems, clearResponseInfo }
