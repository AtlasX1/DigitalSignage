import update from 'immutability-helper'

import * as types from 'actions/index'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_WHITE_LABEL_SUCCESS:
      return update(state, {
        response: { $set: action.payload }
      })
    case types.GET_WHITE_LABEL_ERROR:
      return update(state, {
        error: { $set: action.payload }
      })
    case types.SET_WHITE_LABEL:
      return update(state, {
        response: { $set: action.payload }
      })
    default:
      return state
  }
}
