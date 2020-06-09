import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  isPending: false,
  groupModalHeight: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PENDING_STATUS:
      return update(state, {
        isPending: { $set: action.payload }
      })
    case types.SET_GROUP_MODAL_HEIGHT:
      return update(state, {
        groupModalHeight: { $set: action.payload }
      })
    default:
      return state
  }
}
