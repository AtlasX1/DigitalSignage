import * as types from './index'

const setPendingStatus = status => ({
  type: types.SET_PENDING_STATUS,
  payload: status
})

const setGroupModalHeight = height => ({
  type: types.SET_GROUP_MODAL_HEIGHT,
  payload: height
})

export { setPendingStatus, setGroupModalHeight }
