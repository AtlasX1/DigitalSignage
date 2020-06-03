import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  post: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.POST_FEEDBACK_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_FEEDBACK_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_FEEDBACK:
      return update(state, {
        post: { $set: {} }
      })
    default:
      return state
  }
}
