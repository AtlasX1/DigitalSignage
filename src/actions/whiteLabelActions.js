import * as types from './index'

const getWhiteLabel = () => ({
  type: types.GET_WHITE_LABEL
})
const clearGetWhiteLabelInfo = () => ({
  type: types.CLEAR_GET_WHITE_LABEL_INFO
})
const setWhiteLabel = data => ({
  type: types.SET_WHITE_LABEL,
  payload: data
})

export { getWhiteLabel, clearGetWhiteLabelInfo, setWhiteLabel }
